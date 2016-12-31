/**
 * Panasonic Viera ST JS Library
 */

module.exports = {
		
		VieraST : function ( ipAddress ) {
			log.info("[VieraST] Initiating a new Viera ST device instance.");
			log.info("[VieraST] IP Address: " + ipAddress);
			this.ipAddress = ipAddress;

			this.doMenuAction = function () {
				log.info("[VieraST][doMenuAction] Executing NRC_MENU-ONOFF key event");
				sendRequest(this.ipAddress, 'command', 'X_SendKey', '<X_KeyEvent>NRC_MENU-ONOFF</X_KeyEvent>');
			    log.info("[VieraST][doMenuAction] Exit");
			}
		}
}

var http = require('http'),
path = require('path');

var logLib = require("../../../lib/logger/logger");
var log = logLib.getLogger();

var sendRequest = function(ipAddress, type, action, command, options) {
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


