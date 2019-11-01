/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code") 
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following  
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying  
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation 
files (collectively, the "Software") without restriction, including without limitation the rights to use, 
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit 
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end 
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.   
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT  
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND  
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION 
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*global window, $ */
(function (window, Promise, $) {
  'use strict';

  // If Promise or the Promise polyfill fails (thanks IE!), use jQuery.
  window.promisify = function(fn) {
    if (window.Promise) {
      return new window.Promise(fn);
    }
    var d = new $.Deferred();
    fn(d.resolve, d.reject);
    var promise = d.promise();
    promise.catch = promise.fail;
    return promise;
  }

  var bitrateInterval = 0;
  var vRegex = /VideoStream/;
  var aRegex = /AudioStream/;

  // Based on https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/bandwidth/js/main.js
  window.trackBitrate = function (connection, cb, resolutionCb) {
    window.untrackBitrate(cb);
    //    var lastResult;
    var lastOutboundVideoResult;
    var lastInboundVideoResult;
    var lastInboundAudioResult;
    bitrateInterval = setInterval(function () {
      connection.getStats(null).then(function(res) {
        res.forEach(function(report) {
          var bytes;
          var packets;
          var now = report.timestamp;
          if ((report.type === 'outboundrtp') ||
              (report.type === 'outbound-rtp') ||
              (report.type === 'ssrc' && report.bytesSent)) {
            bytes = report.bytesSent;
            packets = report.packetsSent;
            if ((report.mediaType === 'video' || report.id.match(vRegex))) {
              if (lastOutboundVideoResult && lastOutboundVideoResult.get(report.id)) {
                // calculate bitrate
                var bitrate = 8 * (bytes - lastOutboundVideoResult.get(report.id).bytesSent) /
                    (now - lastOutboundVideoResult.get(report.id).timestamp);

                cb(bitrate, packets);

              }
              lastOutboundVideoResult = res;
            }
          }
          // playback.
          else if ((report.type === 'inboundrtp') ||
              (report.type === 'inbound-rtp') ||
              (report.type === 'ssrc' && report.bytesReceived)) {
            bytes = report.bytesReceived;
            packets = report.packetsReceived;
            if ((report.mediaType === 'video' || report.id.match(vRegex))) {
              if (lastInboundVideoResult && lastInboundVideoResult.get(report.id)) {
                // calculate bitrate
                bitrate = 8 * (bytes - lastInboundVideoResult.get(report.id).bytesReceived) /
                  (now - lastInboundVideoResult.get(report.id).timestamp);

                cb('video', report, bitrate, packets - lastInboundVideoResult.get(report.id).packetsReceived);
              }
              lastInboundVideoResult = res;
            }
            else if ((report.mediaType === 'audio' || report.id.match(aRegex))) {
              if (lastInboundAudioResult && lastInboundAudioResult.get(report.id)) {
                // calculate bitrate
                bitrate = 8 * (bytes - lastInboundAudioResult.get(report.id).bytesReceived) /
                  (now - lastInboundAudioResult.get(report.id).timestamp);

                cb('audio', report, bitrate, packets - lastInboundAudioResult.get(report.id).packetsReceived);
              }
              lastInboundAudioResult = res;
            }
          }
          else if (resolutionCb && report.type === 'track' && report.kind === 'video') {
            if (report.frameWidth > 0 || report.frameHeight > 0) {
              resolutionCb(report.frameWidth, report.frameHeight);
            }
          }
        });
      });
    }, 1000);
  }

  window.untrackBitrate = function() {
    clearInterval(bitrateInterval);
  }

})(window, window.Promise, $);
