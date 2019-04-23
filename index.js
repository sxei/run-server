#!/usr/bin/env node

// 使用：run-server -port 9900 -https -debug -index index.html -open

const http = require('http');
// var https = require('https')
const url = require('url');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css',
    txt: 'text/plain',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
};
const args = getArgs();
const port = args.port || 8899; // 默认端口
const enableHttps = args.https || false; // 是否开启https，默认否
const debug = args.debug  === undefined ? true : args.debug; // 默认开启debug模式
const indexPage = args.index || 'index.html';
const autoOpen = args.open === undefined ? '/' : args.open;

function getArgs() {
    const argArray = process.argv.splice(2); // 获取命令行后面的参数
    const args = {};
    let lastKey = null;
    argArray.forEach(item => {
        if (/^-\w/g.test(item)) {
            lastKey = item.replace(/^-/g, '')
            args[lastKey] = true;
        } else if (lastKey){
            args[lastKey] = item;
        }
    });
    return args;
}

function log(...args) {
    if (debug) {
        console.log(...args);
    }
}
if (enableHttps) {
    var options = {
        pfx: fs.readFileSync('/Users/xxx.pfx'),
        passphrase: 'xxxxxxx'
    };
    https.createServer(options, onRequest).listen(port)
} else {
    http.createServer((request, response) => {
        const location = url.parse(request.url, true);
        log(request.url);
        request.setEncoding('utf8');
        let postData = null;
        request.addListener('data', (postDataChunk) => {
            postData += postDataChunk
        });
        request.addListener('end', () => {
            const pathname = location.pathname.replace(/^\//g, '') || indexPage;
            let filePath = path.resolve(process.cwd(), pathname);
            log(`filePath: ${filePath}`);
            if(fs.existsSync(filePath)) {
                if (fs.statSync(filePath).isDirectory()) {
                    filePath = path.join(filePath, indexPage);
                }
                const buffer = fs.readFileSync(filePath);
                const ext = filePath.substring(filePath.lastIndexOf('.') + 1);
                response.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
                response.write(buffer);
                response.end();
            } else {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.write('404 Page Not Found');
                response.end();
            }
        });
    }).listen(port);
}

/**
 * 使用默认浏览器打开某个URL
 * @param {*} url 完整URL
 */
function openUrlByBrowser(url) {
    if (!url) {
        throw new Error('url can not be null.');
    }
    require('child_process').exec(`${require('os').platform() === 'win32' ? 'start' : 'open'} ${url}`);
}
const runUrl = `${enableHttps ? 'https' : 'http'}://localhost:${port}`;
console.log('Server running on ' + runUrl);
if (autoOpen) {
    openUrlByBrowser(runUrl + autoOpen);
}
