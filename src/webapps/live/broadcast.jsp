{{> jsp_header }}
<%
  String host = ip;
  String ice = null;
  String tech = null;
  Integer framerateMin = 8;
  Integer framerateMax = 24;
  Integer audioBandwidth = 56;
  Integer videoBandwidth = 750;
  Integer videoWidthMin = 640;
  Integer videoWidthMax = 640;
  Integer videoHeightMin = 480;
  Integer videoHeightMax = 480;

  if (request.getParameter("view") != null) {
    tech = request.getParameter("view");
  }

  if (request.getParameter("ice") != null) {
    ice = request.getParameter("ice");
  }

  if (request.getParameter("framerateMin") != null) {
    framerateMin = Integer.parseInt(request.getParameter("framerateMin"));
  }

  if (request.getParameter("framerateMax") != null) {
    framerateMax = Integer.parseInt(request.getParameter("framerateMax"));
  }

  if (request.getParameter("audioBW") != null) {
    audioBandwidth = Integer.parseInt(request.getParameter("audioBW"));
  }

  if (request.getParameter("videoBW") != null) {
    videoBandwidth = Integer.parseInt(request.getParameter("videoBW"));
  }

  if (request.getParameter("videoWidthMin") != null) {
    videoWidthMin = Integer.parseInt(request.getParameter("videoWidthMin"));
  }
  if (request.getParameter("videoWidthMax") != null) {
    videoWidthMax = Integer.parseInt(request.getParameter("videoWidthMax"));
  }
  if (request.getParameter("videoHeightMin") != null) {
    videoHeightMin = Integer.parseInt(request.getParameter("videoHeightMin"));
  }
  if (request.getParameter("videoHeightMax") != null) {
    videoHeightMax = Integer.parseInt(request.getParameter("videoHeightMax"));
  }

%>
<!doctype html>
{{> license}}
<html lang="eng">
  <head>
    {{> head_meta }}
    {{> resources }}
    <title>Stream Broadcasting with the Red5 Pro Server</title>
    <script src="//webrtchacks.github.io/adapter/adapter-latest.js"></script>
    <script src="lib/screenfull/screenfull.min.js"></script>
    <script src="lib/jquery-1.12.4.min.js"></script>
    <link href="lib/red5pro/red5pro-media.css"></script>
    <style>
      object:focus {
        outline:none;
      }

      #video-container {
        border-radius: 5px;
        background-color: #e3e3e3;
        padding: 10px;
      }

      #video-form {
        background-color: #eee;
        padding: 10px;
        margin-bottom: 10px;
      }

      .video-form-item > label {
        text-align: right;
        margin-right: 10px;
        min-width: 120px;
        display: inline-block;
      }

      #status-field {
        text-align: center;
        padding: 10px;
        color: #fff;
        margin: 10px 0;
      }

      #statistics-field {
        text-align: center;
        padding: 5px;
        color: #000
        margin: 10px 0;
      }

      .status-alert {
        background-color: rgb(227, 25, 0);
      }

      .status-message {
        background-color: #aaa;
      }

      #start-stop-button {
        font-size: 16px;
        background-color: #efefef;
        text-align: center;
        border-radius: 5px;
        padding: 10px;
      }

      .button-enabled {
        cursor: pointer;
      }

      .button-disabled {
        color: gray;
        pointer-events: none;
      }

      #live-page-subcontent {
        text-align: center;
        position: relative;
        width: 100%;
        height: 230px;
        overflow: hidden;
      }

      #event-log-field {
        background-color: #c0c0c0;
        border-radius: 6px;
        padding: 10px;
        margin: 14px;
      }

      .notify-callout {
        margin: 0px;
        padding: 26px 26px;
        background-color: #eeeeee
      }

      .video-element {
        width: 100%;
      }
    </style>
  </head>
  <body>
    {{> top-bar }}
    {{> navigation }}
    {{> header }}
    <div class="main-container">
      <div id="menu-section">
        {{> menu }}
      </div>
      <div id="content-section">
        <div id="subcontent-section">
          <div id="subcontent-section-text">
            <h1 class="red-text">Live Broadcast For Any Screen</h1>
            <p class="heading-title">To start a Broadcast session, allow device access, provide a <span class="bold">Stream Name</span>, select any additional broadcast options, then click <span class="bold">Start Broadcast.</span>
            </p>
          </div>
          <div id="subcontent-section-image">
            <img class="image-block" width="380" id="live-page-img" src="images/red5pro_live_broadcast.png">
          </div>
        </div>
        <hr class="top-padded-rule">
        <div class="content-section-story">
                <p class="notify-callout">Select <strong>Enable Recording</strong> to save your broadcast for Video on Demand playback!<br/><span class="small-font-size">To view the current Video On Demand (VOD) files on your server, visit the <a class="link" href="playback.jsp" target="_blank">Playback</a> page.</span></p>
          <hr />
          <div id="video-container">
            <div id="video-form">
              <p class="video-form-item">
                <label for="stream-name-field">Stream Name:</label>
                <input name="stream-name-field" id="stream-name-field"></input>
              </p>
              <p class="video-form-item">
                <label for="enable-record-field">Enable Recording:</label>
                <input type="checkbox" name="enable-record-field" id="enable-record-field"></input>
              </p>
              <p class="video-form-item hidden">
                <label for="camera-select">Select Camera:</label>
                <select name="camera-select" id="camera-select-field"></select>
              </p>
            </div>
            <div id="statistics-field" class="statistics-field"></div>
            <div id="video-holder">
              <video id="red5pro-publisher"
                      controls muted autoplay playsinline
                      class="video-element">
              </video>
            </div>
            <div id="status-field" class="status-message"></div>
            <div id="start-stop-button" class="button-disabled">Start Broadcast</div>
            <div id="event-log-field" class="event-log-field">
              <div style="padding: 10px 0">
                <p><span style="float: left;">Event Log:</span><button id="clear-log-button" style="float: right;">clear</button></p>
                <div style="clear: both;"></div>
              </div>
            </div>
          </div>
          <hr class="top-padded-rule" />
          {{> web-applications }}
          <hr class="top-padded-rule">
          {{> mobile-applications }}
          <hr class="top-padded-rule" />
          {{> additional_info }}
        </div>
      </div>
    </div>
    {{> es6-script-includes }}
    <script src="script/r5pro-ice-utils.js"></script>
    <script>
      function assignIfDefined (value, prop) {
        if (value && value !== 'null') {
          window[prop] = value;
        }
      }
      assignIfDefined("<%=tech%>", 'r5proViewTech');
      assignIfDefined(<%=framerateMin%>, 'r5proFramerateMin');
      assignIfDefined(<%=framerateMax%>, 'r5proFramerateMax');
      assignIfDefined(<%=audioBandwidth%>, 'r5proAudioBandwidth');
      assignIfDefined(<%=videoBandwidth%>, 'r5proVideoBandwidth');
      assignIfDefined(<%=videoWidthMin%>, 'r5proVideoWidthMin');
      assignIfDefined(<%=videoWidthMax%>, 'r5proVideoWidthMax');
      assignIfDefined(<%=videoHeightMin%>, 'r5proVideoHeightMin');
      assignIfDefined(<%=videoHeightMax%>, 'r5proVideoHeightMax');

      window.targetHost = '<%=ip%>';
      window.r5proIce = window.determineIceServers('<%=ice%>');
    </script>
    <script src="lib/red5pro/red5pro-sdk.min.js"></script>
    <script src="script/r5pro-utils.js"></script>
    <script src="script/r5pro-sm-utils.js"></script>
    <script src="script/r5pro-publisher-failover.js"></script>
    {{> footer }}
   </body>
</html>
