# // WCNMB — Developer Launchpad

> Code. Ship. Play. Repeat.

个人开发者导航页 — Landing Page + 项目、笔记、工具、学习资源和联系方式的集合入口。

A personal developer launchpad with a cinematic landing page, project links, tools, learning resources, and contact card.

---

## ✨ 特性

- 🚀 **Landing Page** — 全屏欢迎页，打字机效果、浮动代码装饰、光晕氛围、丝滑 fade 过渡
- 🎨 **明暗主题** — 亮/暗双主题切换，跟随系统偏好，Landing 与主站风格统一
- 🌐 **中英双语** — 完整 i18n 支持，一键切换语言
- 📂 **分类导航** — 项目、文章、工具、社交、联系、学习，侧边栏快速筛选
- 🃏 **双视图** — 精选卡片（featured）+ 紧凑列表（standard），一目了然
- 📋 **联系卡片** — 弹窗式 Contact Card，一键复制邮箱 / 打开邮件客户端
- 📊 **状态栏** — 底部状态栏，复制反馈 + 系统状态提示
- ⚡ **极致性能** — Vite + React 19，构建产物 gzip 后仅 ~77KB
- 📱 **响应式** — 桌面端与移动端完美适配
- ♿ **无障碍** — 尊重 `prefers-reduced-motion`，语义化 HTML，键盘可操作

---

## 🛠 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19.2 |
| 构建 | Vite | 6.4 |
| 图标 | react-icons (Font Awesome 6) | 5.6 |
| 语言 | JavaScript (JSX) | — |
| 样式 | 纯 CSS（CSS Variables + 自定义属性） | — |

> 零 UI 框架依赖，全部手写样式，CSS 变量驱动主题系统。

---

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 127.0.0.1:5173）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 📁 项目结构

```
├── index.html              # 入口 HTML
├── vite.config.mjs         # Vite 配置（依赖预构建 + 开发预热）
├── package.json
├── public/
│   └── favicon.svg         # 网站图标
└── src/
    ├── main.jsx            # React 挂载入口
    ├── App.jsx             # 主应用（状态管理 + Landing/Launchpad 路由）
    ├── styles.css          # 全局样式（主题变量 + 组件样式 + 动画）
    ├── components/
    │   ├── LandingPage.jsx  # Landing Page（打字机 + 浮动装饰 + 光晕）
    │   ├── Header.jsx       # 顶栏（品牌名 + 主题/语言切换）
    │   ├── SidePanel.jsx    # 侧边分类导航
    │   ├── LinkGrid.jsx     # 链接卡片网格
    │   ├── ContactModal.jsx # 联系卡片弹窗
    │   └── StatusBar.jsx    # 底部状态栏
    └── data/
        ├── profile.js       # 个人信息（品牌名、邮箱、GitHub、QQ 等）
        ├── links.js         # 导航链接数据（分类、状态、双语标题）
        └── i18n.js          # 中英文文案
```

---

## 🎨 主题系统

使用 CSS 自定义属性（CSS Variables）驱动，定义在 `:root` 和 `[data-theme="dark"]` 中：

```css
:root {
  --bg: ...; --text: ...; --accent: ...; /* 亮色主题 */
}
[data-theme="dark"] {
  --bg: ...; --text: ...; --accent: ...; /* 暗色主题 */
}
```

切换主题时仅需修改 `document.documentElement.dataset.theme`，所有组件自动响应。

---

## 📝 自定义

编辑 `src/data/` 目录下的文件即可定制内容：

### `profile.js` — 个人信息

```js
export const profile = {
  brand: "WCNMB",            // 品牌名（Landing Page + Header 显示）
  github: "https://github.com/yourname",
  email: "you@example.com",
  qq: "12345678",
  focus: "frontend / tools / ai",  // Landing Page 焦点标签，用 " / " 分隔
  xp: "12,450",              // 经验值数字
};
```

### `links.js` — 导航链接

每条链接支持以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识 |
| `category` | string | 分类：projects / blog / tools / social / contact / learning |
| `icon` | string | 图标名（Font Awesome 映射） |
| `href` | string | 链接地址 |
| `featured` | boolean | 是否为精选卡片（大卡片） |
| `status` | string | 状态：live / soon / new |
| `title` | {zh, en} | 双语标题 |
| `desc` | {zh, en} | 双语描述 |
| `action` | {zh, en} | 双语按钮文案（仅 featured 卡片） |
| `opensContactCard` | boolean | 点击时打开联系卡片弹窗 |
| `copyValue` | string | 点击时复制到剪贴板的值 |

### `i18n.js` — 文案

修改 `zh` / `en` 对象中的键值即可调整界面文案。Landing Page 相关：

- `landingGreeting` — 欢迎语（"你好，欢迎来到" / "Hey, welcome to"）
- `landingEnter` — 进入按钮文案（"cd ~/launchpad"）

---

## 🌐 部署

### 构建产物

```bash
npm run build
# 产物输出到 dist/ 目录，约 245KB（gzip 后 ~77KB）
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;

    # SPA 回退 — 所有路径指向 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长缓存（Vite 产出带 hash）
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 开启 gzip
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

### Vercel / Netlify

直接关联 Git 仓库，构建命令 `npm run build`，输出目录 `dist`，无需额外配置。

---

## 📄 License

MIT
