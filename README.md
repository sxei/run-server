# run-server

Run a simple static file server at anywhere.

## install

```bash
npm i run-server -g
```

## use

运行后会自动将当前目录作为静态资源根目录，默认`index.html`为首页：

```bash
run-server
run-server -port 9900
```

完整参数：

* `-port 9900`：自定义端口，默认`8899`；
* `-https`：启用`HTTPS`，默认否；
* `-debug`：开启`debug`，默认`true`；
* `-index home.html`：自定义默认首页，默认`index.html`；
* `-open`：是否自动用浏览器打开，默认是；

