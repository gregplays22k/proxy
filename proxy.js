const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/proxy' && parsedUrl.query.url) {
    const targetUrl = parsedUrl.query.url;
    const targetParsedUrl = url.parse(targetUrl);
    const protocol = targetParsedUrl.protocol === 'https:' ? https : http;

    protocol.get(targetUrl, (targetRes) => {
      let data = '';

      targetRes.on('data', (chunk) => {
        data += chunk;
      });

      targetRes.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/html' }); // Adjust content type if needed
        res.end(data);
      });
    }).on('error', (error) => {
      console.error('Proxy error:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
