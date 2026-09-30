# WCNMB 配置参考

[返回 README](../README.md)

## 导航链接

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

## Nginx

先运行 `npm run build`，将 `dist/` 内容上传到站点目录，再按实际域名和路径调整以下配置。

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
