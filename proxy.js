const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const TARGET = 'api.river.ai';
const PORT = 3001;

// Serve the app itself so the page and the API share an origin. Loading index.html from
// file:// makes every fetch to the proxy cross-origin, which Chrome's Local Network Access
// check blocks (surfaces as "Failed to fetch").
const STATIC = { '/': 'index.html', '/index.html': 'index.html', '/app.js': 'app.js' };
process.chdir(__dirname);

function serveStatic(req, res, file) {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  fs.readFile(path.join(__dirname, file), (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const type = file.endsWith('.js') ? 'application/javascript' : 'text/html';
    res.writeHead(200, { 'Content-Type': type + '; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const urlPath = (req.url || '/').split('?')[0];
  if (STATIC[urlPath]) return serveStatic(req, res, STATIC[urlPath]);
  if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const up = https.request({
      hostname: TARGET, path: req.url, method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 Authorization: req.headers.authorization || '',
                 'Content-Length': Buffer.byteLength(body) }
    }, u => {
      res.writeHead(u.statusCode, { 'Access-Control-Allow-Origin': '*',
        'Content-Type': u.headers['content-type'] || 'application/json' });
      u.pipe(res);
    });
    up.on('error', e => { res.writeHead(502, {'Access-Control-Allow-Origin':'*'});
      res.end(JSON.stringify({error:e.message})); });
    up.write(body); up.end();
  });
}).listen(PORT, () => console.log('App + proxy on http://localhost:' + PORT));
