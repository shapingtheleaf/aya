/**
 * New node file
 */

var application_root = __dirname,
  http = require('http'),
  express = require('express'),
  path = require('path');

var logLib = require(application_root + "/lib/logger/logger");
var soundtouchLib = require(application_root + "/lib/adapters/soundtouch/soundtouch");
var vieraSTLib = require(application_root + "/lib/adapters/pana_viera_st/vierast");


var log = logLib.getLogger();

log.info("**************************************************************");
log.info("********************* AYA ENGINE STARTED *********************");
log.info("**************************************************************");

var soundtouchInstance = new soundtouchLib.Soundtouch ("soundtouch", "Muziekdoosje", 8090, "192.168.10.107");

var vieraSTInstance = new vieraSTLib.VieraST ("192.168.10.102");
vieraSTInstance.doMenuAction();