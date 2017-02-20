const spdy = require('spdy'),
  fs = require('fs'),
  path = require('path');

const options = {
  key: fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt'),
  ca: fs.readFileSync('keys/server.csr')
};

const styles = fs.readFileSync('assets/style.css');
const appScript = fs.readFileSync('public/app.js');

const server = spdy.createServer(options, (request, response) => {
  if (!request.isSpdy) {
    return response.end('SPDY is off. We cannot use Server Push :(')
  }

  if (request.url === '/') {
    // INDEX, use PUSH_STREAM
    response.push('/assets/style.css', {
      'Content-Type': 'text/css'
    }, function(err, stream){
      if (err) {
        return;
      }
      stream.end(styles);
    });

    response.push('/public/app.js', {
      'Content-Type': 'application/javascript'
    }, function(err, stream){
      if (err) {
        return;
      }
      stream.end(appScript);
    });

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    const indexPath = path.join(__dirname, '/public/index.html');
    fs.createReadStream(indexPath).pipe(response);
    return;
  }


  // PUBLIC/ASSETS, serviceworker files
  // NOTE: security issues here
  const filePath = path.join(__dirname, request.url);

  fs.exists(filePath, (exists) => {
    if (!exists) {
      response.writeHead(500);
      response.end();
      return;
    }

    if (request.url.endsWith('.js')) {
      response.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
    }

    return fs.createReadStream(filePath).pipe(response);
  });

});

server.listen(3000, () => {
  console.log(`Server started on port ${server.address().port}`);
});
