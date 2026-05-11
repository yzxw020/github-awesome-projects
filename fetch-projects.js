const https = require('https');
const fs = require('fs');

// GitHub API 搜索有趣的开源项目
// 标准：stars >= 1000，多语言/多领域
const QUERIES = [
  'stars:>=1000 language:python sort:stars',
  'stars:>=1000 language:javascript sort:stars',
  'stars:>=1000 language:typescript sort:stars',
  'stars:>=1000 language:rust sort:stars',
  'stars:>=1000 language:go sort:stars',
  'stars:>=1000 topic:machine-learning sort:stars',
  'stars:>=1000 topic:cli sort:stars',
  'stars:>=1000 topic:game sort:stars',
];

const headers = {
  'User-Agent': 'Awesome-Projects-App',
  'Accept': 'application/vnd.github.v3+json',
};

// 如果设置了 GITHUB_TOKEN，加入认证头（提高API限制）
if (process.env.GITHUB_TOKEN) {
  headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      // 处理重定向
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJSON(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const errData = JSON.parse(data);
            reject(new Error(`HTTP ${res.statusCode}: ${errData.message || 'Unknown error'}`));
          } catch {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
        return;
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchProjects() {
  const allProjects = [];
  const seen = new Set();

  for (const query of QUERIES) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=20`;
    try {
      const data = await fetchJSON(url);
      if (data.message) {
        console.error(`⚠️ API限制或错误: ${data.message}`);
        return;
      }
      for (const item of (data.items || [])) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        allProjects.push({
          id: item.id,
          name: item.name,
          full_name: item.full_name,
          description: item.description,
          url: item.html_url,
          stars: item.stargazers_count,
          forks: item.forks_count,
          language: item.language,
          topics: item.topics || [],
          updated_at: item.updated_at,
          owner: item.owner.login,
          owner_avatar: item.owner.avatar_url,
        });
      }
      console.log(`  ✓ 查询"${query}" 获取到 ${(data.items || []).length} 个项目`);
    } catch (e) {
      console.error(`✗ 查询失败: ${query}`, e.message);
    }
    // 避免触发GitHub API速率限制
    await new Promise(r => setTimeout(r, 2000));
  }

  // 按stars排序
  allProjects.sort((a, b) => b.stars - a.stars);

  const output = {
    update_time: new Date().toISOString(),
    total: allProjects.length,
    projects: allProjects,
  };

  fs.writeFileSync('projects.json', JSON.stringify(output, null, 2));
  console.log(`✅ 成功抓取 ${allProjects.length} 个项目，数据已保存到 projects.json`);
}

fetchProjects().catch(console.error);
