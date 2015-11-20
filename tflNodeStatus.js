var http = require('http');

http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    response.on('error', function(err) {
      console.error(err);
    });

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    // Note: the 2 lines above could be replaced with this next one:
    // response.writeHead(200, {'Content-Type': 'application/json'})

    var responseBody = {
      headers: headers,
      method: method,
      url: url,
      body: body
    };

    getStatus(body, response);

    // response.write(text);
    // response.write(JSON.stringify(responseBody));
    // response.end();
    // Note: the 2 lines above could be replaced with this next one:
    // response.end(JSON.stringify(responseBody))

    // END OF NEW STUFF
  });
}).listen(8080); // Activates this server, listening on port 8080.

function getStatus(req, response) {
  var https = require('https');
  var line = req.split('=')[1];

  var url = 'https://api.tfl.gov.uk/Line/' + line + '/Status?detail=False';
    https.get(url, function(res){

      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(res){
          var fbResponse = JSON.parse(body);
          response.end("Got a response: " + fbResponse[0].lineStatuses[0].statusSeverityDescription);
      });
    }).on('error', function(e){
          response.end("Got an error: " + e);
  });
}
