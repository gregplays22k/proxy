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
      res.writeHead(targetRes.statusCode, targetRes.headers); // Forward headers
      targetRes.pipe(res); // Pipe the response directly
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
