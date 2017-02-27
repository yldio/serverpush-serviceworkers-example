const spdy = require('spdy'),
  fs = require('fs'),
  path = require('path'),
  express = require('express')
  app = express();

const options = {
  key: fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt'),
  ca: fs.readFileSync('keys/server.csr')
};

const styles = fs.readFileSync('assets/style.css');
const appScript = fs.readFileSync('public/app.js');

// INDEX, use PUSH_STREAM if possible
app.get('/', function (request, response) {

  if (!request.isSpdy) {
    return response.end('SPDY is off. We cannot use Server Push :(')
  }

  // Note: we cached pushed files for 5 minutes (testing purposes)
  response.push('/style.css', {
    response: {
      'Content-Type': 'text/css',
      'Cache-Control': 'max-age=300'
    }
  }, function(err, stream){
    if (err) {
      return;
    }
    stream.end(styles);
  });

  response.push('/app.js', {
    response: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'max-age=300'
    }
  }, function(err, stream){
    if (err) {
      return;
    }
    stream.end(appScript);
  });

  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'max-age=300'
  });

  const indexPath = path.join(__dirname, '/public/index.html');
  fs.createReadStream(indexPath).pipe(response);
  return;
});

// Service Worker file
app.get('/sw.js', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'application/javascript'
  });
  const filePath = path.join(__dirname, request.url);
  return fs.createReadStream(filePath).pipe(response);
});

// Assets and public folder. Located after index because otherwise push streams didnt work
app.use(express.static('public'));
app.use(express.static('assets'));

const server = spdy.createServer(options, app);

server.listen(3000, () => {
  console.log(`Server started on port ${server.address().port}`);
});
