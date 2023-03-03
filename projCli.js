/**
 * @Author: lujiafeng
 * @Email: 934789537@qq.com
 * @Date: 2023-02-17 14:36:25
 * @Description: 
 * @LastEditors: lujiafeng
 * @LastEditTime: 2023-02-21 11:33:42
 */
 const http = require("http");
 const fs = require('fs');
 const open = require('./quick/utils/open');
 const path = require('path')
 const url = require('url')
 const {debounce} = require('./quick/utils/debounce')
 const {config,getExt} = require('./quick/config')
 
 const app = http.createServer((request, response) => {
  let pathName = url.parse(request.url).pathname; //转换为url对象
  if (pathName == '/') {
    pathName = "/index.html";
  }
  console.log(pathName,'pathName')
  let extName = path.extname(pathName);
  const fsPathUrl = `${__dirname}/demo${pathName}`

  if (fs.existsSync(fsPathUrl)) {
    let html = fs.readFileSync(fsPathUrl,{
      encoding: 'utf-8'
    })
    if(pathName === '/index.html'){
      // 将socket内容插入html
      const webSocketHtml = fs.readFileSync(__dirname + '/quick/client.js',{
        encoding: 'utf-8'
      })
      const splitHtml = html.split("</body>")
      html = `
        ${splitHtml[0]}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.0/socket.io.js"></script>
        <script>${webSocketHtml}</script></body></html>
      `
    }
    response.writeHead(200, { 'Content-Type': `${getExt(extName)};charset=utf-8` });
    response.end(html);
  } else {
    response.writeHead(304, { 'Content-Type': `${getExt(extName)};charset=utf-8` });
    response.end();
  }
});

const { WebSocketServer } = require("ws");

const socketServer = new WebSocketServer({ port: 3000 });

socketServer.on("connection", (socket) => {

  fs.watch(`${__dirname}/demo`, {
    recursive: true
  }, debounce((event, filename) => {
    // socketServer.send(JSON.stringify({
    //   type: "hello from server",
    //   content: [ 1, "2" ]
    // }));
    console.log(event + '------' + filename)
    socket.send(JSON.stringify({
      type: "refresh",
      content: true
    }));
  }))
  // send a message to the client
  // receive a message from the client
  socket.on("message", (data) => {
    const packet = JSON.parse(data);
    switch (packet.type) {
      case "hello from client":
        // ...
        break;
    }
  });
});
// socketServer.on('message',(data)=> {
//   console.log('collect socket ------')
// })
app.listen(config.port, config.host, async () => {
  const localHostUrl = `http://localhost:${8080}`
  const netWorkUrl = `http://${config.host}:${8080}`
  console.log('\n')
  console.log(`localhost: \x1B[34m${localHostUrl}\x1B[0m`)
  console.log(`netWork  :\x1B[34m ${netWorkUrl}\x1B[0m\n`)
  // open(localHostUrl)
  // 监听文件修改
})