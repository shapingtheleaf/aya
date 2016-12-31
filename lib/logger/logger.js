/**
 * New node file
 */

module.exports = {
		
		getLogger: function () {
			var logger = require('log4js')
			, log
			, i = 0;
			
			logger.configure({
			  "appenders": [
			      {
			          type: "console"
			        , category: "console"
			      },
			      {
			          "type": "file",
			          "filename": "log/aya.log",
			          "maxLogSize": "1048576",
			          "backups": 10,
			          "category": "aya"
			      }
			  ]
			});
			
			return logger.getLogger("aya");
		}
		
		
	
}