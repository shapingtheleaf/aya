/**
 * Soundtouch JS Library
 */

module.exports = {
		
		testFunction: function() {
			
		},
		
		Soundtouch : function ( name, hostName, port, ipAddress ) {
			log.info("[Soundtouch] Initiating a new soundtouch device instance.");
			log.info("[Soundtouch] Name: " + name);
			log.info("[Soundtouch] Hostname: " + hostName);
			log.info("[Soundtouch] Port: " + port);
			log.info("[Soundtouch] IP Address: " + ipAddress);
			this.name = name;
			this.hostName = hostName;
			this.port = port;
			this.ipAddress = ipAddress;

			this.changeSource = function ( source ) {
				log.info("[Soundtouch][changeSource] Changing source to " + source);
				soundTouchConnector.changeSource(this, source)
				log.info("[Soundtouch][changeSource] Exit")
				
			}
			
			this.setRadioChannel = function ( radioName ) {
				log.info("[Soundtouch][setRadioChannel] Changing radio channel to " + radioName);
				soundTouchConnector.setRadioChannel(this, radioName)
				log.info("[Soundtouch][setRadioChannel] Exit");
			}
			
			this.setVolumeLevel = function ( volumeLevel ) {
				log.info("[Soundtouch][setVolumeLevel] Changing volume level to " + volumeLevel);
				soundTouchConnector.setVolumeLevel(this, volumeLevel)
				log.info("[Soundtouch][setVolumeLevel] Exit")
			}
			
			this.changeMuteCondition = function () {
				log.info("[Soundtouch][changeMuteCondition] Changing mute condition")
				soundTouchConnector.changeMuteCondition(this);
				log.info("[Soundtouch][changeMuteCondition] Exit")
			}
			
			this.changePowerCondition = function() {
				log.info("[Soundtouch][changePowerCondition] Changing power condition")
				soundTouchConnector.changePowerCondition(this);
				log.info("[Soundtouch][changePowerCondition] Exit")
			}
		}
}

var logLib = require("../../../lib/logger/logger");
var log = logLib.getLogger();

var soundTouchConnector = (function () {

	var js2xmlparser = require("js2xmlparser");
	var requestInterface = require("request");

	return {
		
		/*
		 * Power on / off the device
		 */
		changePowerCondition: function ( soundtouchInstance ) {
			soundTouchConnector.pressKey("POWER");
		},
		
		/*
		 * Mute / unmute the device
		 */
		changeMuteCondition: function( soundtouchInstance ) {
			soundTouchConnector.pressKey("MUTE");
		},

		/*
		 * Set a level of volume
		 */
		setVolumeLevel: function( soundtouchInstance, volumeLevel ) {
			var requestObject = "";
			var xmlObject = "<volume>" + soundTouchConnector.translateVolumeLevel(volumeLevel) + "</volume>"
			
			console.log(xmlObject)

			requestInterface.post({
				headers: {'content-type' : 'text/plain'},
				url:     'http://muziekdoosje:8090/volume',
				body:    xmlObject
			}, function(error, response, body){
				console.log(body);
			});
		},
		
		/*
		 * Select a specific radio channel
		 */
		setRadioChannel: function ( soundtouchInstance, radioName ) {
			var requestObject = "";
			var xmlObject = "";
			
			requestObject = {
					"@" : {
						"source" : "INTERNET_RADIO",
						"location" : soundTouchConnector.translateRadioName( radioName ),
						"sourceAccount" : "",
						"isPresetable" : "true"
					}
			}
			
			xmlObject = js2xmlparser.parse("ContentItem", requestObject)
			console.log(xmlObject)

			requestInterface.post({
				headers: {'content-type' : 'text/plain'},
				url:     'http://muziekdoosje:8090/select',
				body:    xmlObject
			}, function(error, response, body){
				console.log(body);
			});
			
		},
		
		/*
		 * Change the preset on the soundtouch device
		 */
		changePreset: function ( soundtouchInstance, presetID ) {
			var requestObject = "";
			var xmlObject = "";
			
			
		},

		/*
		 * Change the source on the soundtouch device
		 */
		changeSource: function( soundtouchInstance , sourceID ) {

			var requestObject = "";
			var xmlObject = "";

			if ( sourceID = "AUX" ) {
				requestObject = {
						"@" : {
							"source" : "AUX",
							"sourceAccount" : "AUX"
						}
				}
			}

			xmlObject = js2xmlparser.parse("ContentItem", requestObject)
			console.log(xmlObject)

			requestInterface.post({
				headers: {'content-type' : 'text/plain'},
				url:     'http://muziekdoosje:8090/select',
				body:    xmlObject
			}, function(error, response, body){
				console.log(body);
			});

		},
		
		/*
		 * Translate a radio name to a location ID
		 */
		translateRadioName: function( radioName ) {
			if ( radioName == "Studio Brussel" ) return "4712";
			else if ( radioName == "Topradio" ) return "3318";
			else if ( radioName == "Zen" ) return "24973";
			else return "1";
		},
		
		/*
		 * This function translates a volume level to an exact number
		 */
		translateVolumeLevel: function( volumeLevel ) {
			if ( volumeLevel == "MIN" ) return "0";
			else if ( volumeLevel == "VERY LOW" ) return "10";
			else if ( volumeLevel == "LOW" ) return "15";
			else if ( volumeLevel == "NORMAL" ) return "25";
			else if ( volumeLevel == "HIGH" ) return "30";
			else if ( volumeLevel == "VERY HIGH" ) return "40";
			else if ( volumeLevel == "MAX" ) return "50";
		},
		
		/*
		 * Generic Key press function
		 */
		pressKey: function( keyValue ) {
			var pressXMLObject = "<key state=\"press\" sender=\"Gabbo\">"+keyValue+"</key>"
			var releaseXMLObject = "<key state=\"release\" sender=\"Gabbo\">"+keyValue+"</key>"
			
			console.log(pressXMLObject)
			console.log(releaseXMLObject)

			requestInterface.post({
				headers: {'content-type' : 'text/plain'},
				url:     'http://muziekdoosje:8090/key',
				body:    pressXMLObject
			}, function(error, response, body){
				console.log(body);
			});
			requestInterface.post({
				headers: {'content-type' : 'text/plain'},
				url:     'http://muziekdoosje:8090/key',
				body:    releaseXMLObject
			}, function(error, response, body){
				console.log(body);
			});
		}
	};

})();

