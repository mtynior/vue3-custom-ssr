const path = require('path');
const express = require('express');
const fs = require('fs');
const { renderToString } = require('@vue/server-renderer');
const manifest = require('./dist/server/ssr-manifest.json');

// Create the express app.
const server = express();

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js']);
const createApp = require(appPath).default;

const clientDistPath = './dist/client';
server.use('/img', express.static(path.join(__dirname, clientDistPath, 'img')));
server.use('/js', express.static(path.join(__dirname, clientDistPath, 'js')));
server.use('/css', express.static(path.join(__dirname, clientDistPath, 'css')));
server.use('/favicon.ico', express.static(path.join(__dirname, clientDistPath, 'favicon.ico')));
server.use('/manifest.json', express.static(path.join(__dirname, clientDistPath, 'manifest.json')));
server.use('/service-worker.js', express.static(path.join(__dirname, clientDistPath, 'service-worker.js')));
server.use(express.static(path.join(__dirname, clientDistPath, '/')));


// handle all routes in our application
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