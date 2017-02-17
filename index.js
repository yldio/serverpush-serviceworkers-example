const spdy = require('spdy'),
  fs = require('fs');

const options = {
  key: fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt'),
  ca: fs.readFileSync('keys/server.csr')
};

const styles = fs.readFileSync('assets/style.css');

const server = spdy.createServer(options, (request, response) => {

  if (!request.isSpdy) {
    return response.end('SPDY is off. We cannot use Server Push :(')
  }

  // use PUSH_STREAM
  response.push('/assets/style.css', {
    'Content-Type': 'text/css'
  }, function(err, stream){
    if (err) {
      return;
    }
    stream.end(styles);
  });

  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  response.end(
    "<html>" +
      "<head>" +
        "<link rel='stylesheet' type='text/css' href='/assets/style.css'>" +
        "<title>HTTP2 and Service Workers!</title>" +
      "<head>" +
      "<body>" +
        "<p class='myHelloClass'>Hello, World!</p>" +
      "</body>" +
    "<html>"
  );
});

server.listen(3000, () => {
  console.log(`Server started on port ${server.address().port}`);
});
