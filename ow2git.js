/**
 * OW2 API Sample
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
require('shelljs/global');
var _ = require('underscore')
  , argv = require('optimist').argv
  , colors = require('colors');

var cli = function() {
  if (argv.clone) {
    clone(argv.clone, function() {
      console.log('[IFNO] Launched'.green)
    });
  } else {
    console.log('[ERROR] Bad command, bye!'.red)
    return;
  }
}
exports.cli = cli;
 
var clone = function(project, done) {
  var Gitorious = require('gitoriou.js').Gitorious;
  var config = {
    url : 'http://gitorious.ow2.org',
  }

  var client = new Gitorious(config);
  client.getProject(project, function(err, result) {
    if (err) {
      console.log('[ERROR] ' + err + ''.red)
      return;
    } else {
      _.each(result.project.repositories.mainlines.repository, function(item) {
        var child = exec('git clone ' + item.clone_url, {silent : false, async : true}, function(code, output) {
          if (code != 0) {
            console.log('[ERROR] ' + item.clone_url + ' : ' + output + ''.red)
          } else {
            console.log('[OK] ' + item.clone_url + ''.green);            
          }
        });
      });
      if (done) done();
    }
  })
}
exports.clone = clone;