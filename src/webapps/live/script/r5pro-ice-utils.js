(function (window) {

  'use strict';

  var OPTION_R5P = 'red5pro';
  var OPTION_GOOG = 'google';
  var OPTION_MOZ = 'moz';
  var OPTION_NUMB = 'numb';
  var numbServers = [
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'Red5Pro',
      username: 'jessica@infrared5.com'
    }
  ];
  var r5proServers = [
    {urls: 'stun:50.56.81.179:3478'}
  ];
  var mozServers = [
    {urls: 'stun:stun.services.mozilla.com:3478'}
  ];
  var googleServers = [
    {url:'stun:stun.l.google.com:19302'},
    {url:'stun:stun1.l.google.com:19302'},
    {url:'stun:stun2.l.google.com:19302'},
    {url:'stun:stun3.l.google.com:19302'},
    {url:'stun:stun4.l.google.com:19302'}
  ];
  var miscServers = [
    {url:'stun:stun01.sipphone.com'},
    {url:'stun:stun.ekiga.net'},
    {url:'stun:stun.fwdnet.net'},
    {url:'stun:stun.ideasip.com'},
    {url:'stun:stun.iptel.org'},
    {url:'stun:stun.rixtelecom.se'},
    {url:'stun:stun.schlund.de'},
    {url:'stun:stunserver.org'},
    {url:'stun:stun.softjoys.com'},
    {url:'stun:stun.voiparound.com'},
    {url:'stun:stun.voipbuster.com'},
    {url:'stun:stun.voipstunt.com'},
    {url:'stun:stun.voxgratia.org'},
    {url:'stun:stun.xten.com'}
  ];
  var defaultServers = googleServers.concat(miscServers, mozServers, numbServers, r5proServers);

  function determineIceServers (option) {
    switch (option) {
      case OPTION_R5P:
        return r5proServers;
      case OPTION_GOOG:
        return googleServers;
      case OPTION_MOZ:
        return mozServers;
      case OPTION_NUMB:
        return numbServers;
      default:
        return defaultServers;
    }
  }

  window.determineIceServers = determineIceServers;

})(this);
