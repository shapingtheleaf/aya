/**
 * New node file
 */

var application_root = __dirname,
  http = require('http'),
  express = require('express'),
  path = require('path');

// Create server
var vieraControl = express();



// Method for sending requests
var sendRequest = function(ipAddress, type, action, command, options) {
	//192.168.10.102
  var url, urn;
  if(type == "command") {
    url = "/nrc/control_0";
    urn = "panasonic-com:service:p00NetworkControl:1";
  } else if (type == "render") {
    url = "/dmr/control_0";
    urn = "schemas-upnp-org:service:RenderingControl:1";
  }

   var body = "<?xml version='1.0' encoding='utf-8'?> \
   <s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'> \
    <s:Body> \
     <u:"+action+" xmlns:u='urn:"+urn+"'> \
      "+command+" \
     </u:"+action+"> \
    </s:Body> \
   </s:Envelope>";

   console.log(command + "\n");
   console.log(body + "\n");

   var postRequest = {
    host: ipAddress,
    path: url,
    port: 55000,
    method: "POST",
    headers: {
      'Content-Length': body.length,
      'Content-Type': 'text/xml; charset="utf-8"',
      'SOAPACTION': '"urn:'+urn+'#'+action+'"'
    }
  };

  var self = this;
  if(options !== undefined) {
    self.callback = options['callback'];
  } else {
    self.callback = function(data){ console.log(data) };
  }

  var req = http.request(postRequest, function(res) {
    res.setEncoding('utf8');
    res.on('data', self.callback);
  });

  req.on('error', function(e) {
     console.log('ERROR: ' + e);
     return false;
  });

  req.write(body);
  req.end();
};

vieraControl.post('/tv/:ip/action', function(req, res) {
  if(sendRequest(req.params.ip, 'command', 'X_SendKey', '<X_KeyEvent>'+req.body.action+'</X_KeyEvent>')) {
      res.end();
  } else {
      res.send({"error": "internal error"});
  }
});

vieraControl.get('/tv/:ip/volume', function(req, res) {
  var self = this;
  sendRequest(req.params.ip, 'render', 'GetVolume', '<InstanceID>0</InstanceID><Channel>Master</Channel>',
    {
      callback: function(data){
        var match = /<CurrentVolume>(\d*)<\/CurrentVolume>/gm.exec(data);
        if(match !== null){
          res.send(match[1]);
        }
      }
    }
  );
});

// Require the API
// Comment this if you don't want to use API
require('./api')(vieraControl, sendRequest);


vieraControl.listen(3000);
console.log('Listening on port 3000');
