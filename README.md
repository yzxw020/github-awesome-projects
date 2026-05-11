# 🌟 Awesome GitHub 项目展示

自动发现 GitHub 上有趣的高质量开源项目，每周自动更新！

## ✨ 特点

- 🔍 自动抓取 **stars ≥ 1000** 的优质开源项目
- 🌈 覆盖多种语言：Python、JavaScript、TypeScript、Rust、Go 等
- 🎯 涵盖多个主题：AI、机器学习、开发工具、CLI、游戏、教育等
- 🃎 直观的卡片式展示，支持按语言筛选
- 🔄 每周自动更新，数据永远最新

## 🚀 本地运行

```bash
# 项目本地路径：E:\github-awesome-projects
# 或者从 GitHub 克隆：
git clone https://github.com/你的用户名/github-awesome-projects.git
cd github-awesome-projects

# 抓取项目数据（可选：设置 GITHUB_TOKEN 提高 API 限额）
node fetch-projects.js

# 启动本地预览（需要 Python）
python -m http.server 8080
# 然后在浏览器打开 http://localhost:8080
```

## 📁 项目结构

```
├── index.html          # 展示页面（可直接部署到 GitHub Pages）
├── projects.json       # 自动生成的项目数据
├── fetch-projects.js   # 数据抓取脚本
└── .github/
    └── workflows/
        └── update.yml  # 每周自动更新工作流
```

## ⚙️ GitHub Actions 自动更新

已配置 GitHub Actions 工作流，每周一早上 8:00（北京时间）自动：
1. 运行 `fetch-projects.js` 抓取最新项目
2. 更新 `projects.json`
3. 自动提交并推送

你也可以手动触发：  
**GitHub 仓库 → Actions → 「更新 GitHub 有趣项目」→ Run workflow**

## 📊 数据来源

通过 [GitHub Search API](https://docs.github.com/en/rest/search) 搜索符合条件的高质量开源项目。

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
