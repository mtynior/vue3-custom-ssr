const path = require('path');
const express = require('express');
const fs = require('fs');
const { renderToString } = require('@vue/server-renderer');
const manifest = require('./dist/server/ssr-manifest.json');

// Create the express app.
const server = express();

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js']);
const createApp = require(appPath).default;

// Serve static content
const clientDistPath = './dist/client';
server.use(express.static(path.join(__dirname, clientDistPath, '/')));
server.use('/favicon.ico', express.static(path.join(__dirname, clientDistPath, 'favicon.ico')));
server.use('/img', express.static(path.join(__dirname, clientDistPath, 'img')));
server.use('/js', express.static(path.join(__dirname, clientDistPath, 'js')));
server.use('/css', express.static(path.join(__dirname, clientDistPath, 'css')));

// Serve PWA stuff 
server.use('/manifest.json', express.static(path.join(__dirname, clientDistPath, 'manifest.json')));
server.use('/service-worker.js', express.static(path.join(__dirname, clientDistPath, 'service-worker.js')));

// Handle all routes
server.get('*', async (req, res) => {
  const { app } = await createApp(req);

  let appContent = await renderToString(app);

  fs.readFile(path.join(__dirname, clientDistPath, 'index.html'), (err, html) => {
    if (err) {
      throw err;
    }

    appContent = `<div id="app">${appContent}</div>`;

    html = html.toString().replace('<div id="app"></div>', `${appContent}`);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`You can navigate to http://localhost:${port}`);
});