# WCNMB | Developer Launchpad

个人开发者导航页 — 项目、笔记、工具、学习资源和联系方式的集合入口。

A personal developer launchpad for projects, notes, tools, learning resources, and contact links.

## ✨ 特性

- 🎨 明/暗主题切换，跟随系统偏好
- 🌐 中/英文双语支持
- 📂 分类导航（项目、文章、工具、社交、联系、学习）
- 🃏 精选卡片 + 紧凑列表双视图
- 📋 一键复制邮箱 / 联系卡片弹窗
- ⚡ Vite + React 19 构建，极速开发体验

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 |
| 构建 | Vite 6 |
| 图标 | react-icons (Font Awesome 6) |
| 语言 | JavaScript (JSX) |

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📁 项目结构

```
├── index.html          # 入口 HTML
├── vite.config.mjs     # Vite 配置
├── package.json
├── public/
│   └── favicon.svg     # 网站图标
└── src/
    ├── main.jsx        # React 挂载入口
    ├── App.jsx         # 主应用组件
    ├── styles.css      # 全局样式
    └── data/
        ├── profile.js  # 个人信息配置
        ├── links.js    # 导航链接数据
        └── i18n.js     # 国际化文案
```

## 📝 自定义

编辑 `src/data/` 目录下的文件即可定制内容：

- **profile.js** — 修改品牌名、GitHub、邮箱、QQ 等个人信息
- **links.js** — 增删导航链接，支持多种分类和状态
- **i18n.js** — 修改中英文文案

## 📄 License

MIT
