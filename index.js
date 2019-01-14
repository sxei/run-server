/**
 * 直接运行
 */

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
const port = args.port || 8899;
const enableHttps = args.https || false;

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


if (enableHttps) {
    var options = {
        pfx: fs.readFileSync('/Users/xxx.pfx'),
        passphrase: 'xxxxxx'
    };
    https.createServer(options, onRequest).listen(port)
} else {
    http.createServer((request, response) => {
        const location = url.parse(request.url, true);
        console.log(request.url);
        request.setEncoding('utf8');
        let postData = null;
        request.addListener('data', (postDataChunk) => {
            postData += postDataChunk
        });
        request.addListener('end', () => {
            const pathname = location.pathname.replace(/^\//g, '') || 'index.html';
            const filePath = path.resolve(__dirname, pathname);
            if(fs.existsSync(filePath) && fs.statSync(filePath).isFile) {
                const buffer = fs.readFileSync(filePath);
                const ext = pathname.substring(pathname.lastIndexOf('.') + 1);
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
console.log('Server running on port http://localhost:' + port);