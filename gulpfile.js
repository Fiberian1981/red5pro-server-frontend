'use strict';

var path = require('path');
var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));

var port = 5080;
var nconf = require('nconf');
nconf.argv().env().file({
  file: 'settings.json'
});

var taskDirectory = [process.cwd(), 'scripts', 'task'].join(path.sep);

var srcDir = [process.cwd(), 'src'].join(path.sep);
var distDir = [process.cwd(), 'dist'].join(path.sep);
var scriptsDir = [process.cwd(), 'scripts'].join(path.sep);
var webappBuildScriptDir = [scriptsDir, 'task', 'webapp'].join(path.sep);
var deployWebappDir = nconf.get('red5pro-server-local')
  ? [nconf.get('red5pro-server-local'), 'webapps'].join(path.sep)
  : [process.cwd(), 'red5pro-server', 'webapps'].join(path.sep);
var deployLibDir = nconf.get('red5pro-server-local')
  ? [nconf.get('red5pro-server-local'), 'lib'].join(path.sep)
  : [process.cwd(), 'red5pro-server', 'lib'].join(path.sep);

// Import build task
var buildSetup = require([taskDirectory, 'build.js'].join(path.sep))(srcDir, distDir, webappBuildScriptDir, gulp); //eslint-disable-line no-unused-vars

// Import deploy task
var deploySetup = require([taskDirectory, 'deploy.js'].join(path.sep))(distDir, deployWebappDir, deployLibDir, gulp); //eslint-disable-line no-unused-vars

// Import watch task
var watchSetup = require([taskDirectory, 'watch.js'].join(path.sep))(srcDir, distDir, gulp, 'deploy'); //eslint-disable-line no-unused-vars

// Import launch task
var launchSetup = require([taskDirectory, 'launch.js'].join(path.sep))(port, gulp); //eslint-disable-line no-unused-vars

// Import new task
var newTask = require([taskDirectory, 'new.js'].join(path.sep))(srcDir, distDir, scriptsDir, gulp);
gulp.task('new', function(cb) {
  var webappNameOption = argv.name;
  if(webappNameOption) {
    newTask(webappNameOption);
    cb()
  }
  else {
    console.log('You need to provide a --name option.');
  }
});

