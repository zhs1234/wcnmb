# WCNMB 个人导航页 1Panel 部署教程

这份教程适用于当前项目：`Vite + React` 个人导航页。

项目构建后是纯静态文件，推荐用 **1Panel 静态网站 + OpenResty** 部署，不需要长期运行 Node.js 服务。

## 一、部署前准备

你需要准备：

- 一台已经安装 1Panel 的 Linux 服务器
- 一个已经解析到服务器 IP 的域名，例如 `example.com`
- 服务器安全组/防火墙已放行：
  - `80`
  - `443`
  - `1Panel 面板端口`
- 本地项目可以正常构建

在本地项目目录运行：

```bash
npm install
npm run build
```

构建成功后，会生成：

```text
dist/
```

这个 `dist` 文件夹就是要上传到服务器的网站文件。

## 二、确认本地构建是否正常

在本地运行：

```bash
npm run build
```

看到类似输出就说明构建成功：

```text
✓ built
dist/index.html
dist/assets/...
```

如果你想本地预览生产版本，可以运行：

```bash
npm run preview
```

然后打开终端提示的本地地址。

## 三、打包 dist 文件

进入项目目录，把 `dist` 目录压缩成 zip。

Windows 可以直接右键：

```text
dist -> 发送到 -> 压缩(zipped)文件夹
```

建议命名为：

```text
wcnmb-homepage-dist.zip
```

注意：压缩包里最好直接包含 `index.html` 和 `assets`，不要多套一层 `dist/dist`。

正确结构：

```text
wcnmb-homepage-dist.zip
  index.html
  favicon.svg
  assets/
```

如果压缩后结构是这样：

```text
wcnmb-homepage-dist.zip
  dist/
    index.html
    assets/
```

也可以，但上传后需要把 `dist` 里面的内容移动到网站根目录。

## 四、在 1Panel 创建静态网站

登录 1Panel 后：

```text
网站 -> 创建网站
```

网站类型选择：

```text
静态网站
```

填写：

```text
主域名：你的域名，例如 example.com
代号：wcnmb-homepage
备注：WCNMB 个人导航页
```

提交创建。

创建完成后，1Panel 会为网站生成一个网站目录。

常见目录类似：

```text
/opt/1panel/apps/openresty/openresty/www/sites/你的站点目录/index
```

实际路径以 1Panel 网站设置里的“网站目录”为准。

## 五、上传网站文件

进入：

```text
网站 -> 你的站点 -> 网站目录
```

打开网站根目录后，上传刚才的压缩包。

然后解压。

最终网站根目录应该类似这样：

```text
index.html
favicon.svg
assets/
```

如果目录里有 1Panel 默认生成的占位文件，可以删除或覆盖。

## 六、设置默认文档

进入：

```text
网站 -> 你的站点 -> 配置 -> 基本设置
```

确认默认文档包含：

```text
index.html
```

通常静态网站默认已经配置好了，但建议检查一次。

## 七、配置 HTTPS

进入：

```text
网站 -> 你的站点 -> HTTPS
```

推荐使用：

```text
Let's Encrypt
```

申请证书前确认：

- 域名已经解析到服务器
- 服务器 80 端口可访问
- 没有被 CDN 或防火墙错误拦截

证书申请成功后，开启：

```text
HTTPS
HTTP 自动跳转 HTTPS
```

## 八、访问网站

浏览器打开：

```text
https://你的域名
```

如果能看到 WCNMB 个人导航页，就部署完成。

## 九、更新网站

以后你修改项目后，更新流程是：

```bash
npm run build
```

然后重新上传新的 `dist` 内容到 1Panel 网站目录。

建议更新时：

1. 删除旧的 `assets/`
2. 上传新的 `index.html`
3. 上传新的 `favicon.svg`
4. 上传新的 `assets/`

Vite 构建产物文件名通常带 hash，旧 `assets` 不清理可能会留下无用文件。

## 十、如果刷新出现 404 怎么办

当前这个个人导航页基本是单页静态页面，没有复杂路由，通常不会遇到刷新 404。

如果以后你增加了 React Router 这类前端路由，例如：

```text
/projects
/notes
/tools
```

那么需要在 1Panel 网站配置里增加伪静态规则，让所有路径回退到 `index.html`。

OpenResty/Nginx 常用规则：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

如果 1Panel 提供“伪静态”编辑入口，可以把类似规则加进去。

## 十一、如果访问后样式丢失怎么办

常见原因：

1. 上传目录不对
2. `assets/` 没上传完整
3. `index.html` 和 `assets/` 不在同一个网站根目录
4. 部署到了子目录但 Vite 没配置 `base`

如果你部署在域名根路径：

```text
https://example.com/
```

当前配置通常不用改。

如果你部署在子路径：

```text
https://example.com/home/
```

需要修改 `vite.config.mjs`：

```js
export default defineConfig({
  base: "/home/",
});
```

然后重新构建：

```bash
npm run build
```

## 十二、如果还是看到旧页面怎么办

可以尝试：

- 浏览器强制刷新：`Ctrl + F5`
- 清理浏览器缓存
- 确认上传的是最新的 `dist`
- 确认 1Panel 网站目录没有多套一层目录
- 重启 OpenResty

在 1Panel 里可以进入：

```text
应用商店 -> 已安装 -> OpenResty -> 重启
```

或在网站管理页面里重载配置。

## 十三、推荐部署方式总结

这个项目最推荐：

```text
本地 npm run build
上传 dist 到 1Panel 静态网站目录
用 OpenResty 提供静态访问
绑定域名
开启 HTTPS
```

不推荐为了这个项目长期运行：

```text
npm run dev
```

也不需要用 Node.js 进程常驻部署，因为这个项目构建后就是静态页面。

## 十四、上线前检查清单

上线前确认：

- [ ] `npm run build` 成功
- [ ] `dist/index.html` 存在
- [ ] `dist/assets/` 存在
- [ ] `favicon.svg` 存在
- [ ] 1Panel 网站目录里有 `index.html`
- [ ] 域名解析正确
- [ ] HTTPS 已开启
- [ ] 手机端访问正常
- [ ] GitHub / Email / QQ 信息正确
- [ ] 项目占位链接后续替换为真实链接

