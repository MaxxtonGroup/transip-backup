'use strict';

// based on https://github.com/DualDev/node-transip

var TransIP = require('transip');
var fs = require('fs');

// this requires a config.js in the same folder as this index.js
var config = require('./config.js');

var login = config.transip.login;
var privateKey = config.transip.privateKey;




(function(){
  // remove possible exisitng file
  clearExistingFile(getFilename());

  var transipInstance = new TransIP(login, privateKey);

  transipInstance.domainService.getDomainNames().then(function(domains) {
    
    for(var domain in domains) {
      var domainUrl = domains[domain];
      transipInstance.domainService.getInfo(domainUrl).then(function(info) {
        // store a line with the domain name 
        var domainMessage = "DOMAIN: " + info['name'] + " =========================================================";
        console.log(domainMessage);
        saveDnsEntry(domainMessage);
        console.log('Saving entries for domain: ' + info['name']);
        saveDnsEntry(info['dnsEntries']);
      });
    }
  });
})();



function saveDnsEntry(data) {
  var fs = require('fs');
  
  fs.appendFile(getFilename(), JSON.stringify(data, null, 2) + "\n", function(err) {
    if(err) { return console.log(err); }
  });
}

function clearExistingFile(filePath){
  if(fs.existsSync(filePath))
    fs.unlinkSync(filePath);
}

function getFilename(){
  var date = new Date();
  var dateStr = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  return "dns-backup-"+dateStr+".bak";
}


