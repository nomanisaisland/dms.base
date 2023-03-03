exports.config = {
  host: '127.0.0.1',
  port: 8080
}
exports.getExt = (extName) => {
  switch (extName) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'text/js';
    default: return 'text/html';
  }
}