/*
 *
 *  @overview
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 *
 */
(function(){
	'use strict';
	nwgui.App.setCrashDumpDir(nwgui.App.dataPath);
	
	process.on('uncaughtException', function(e){
		console.group('Node uncaughtException');
		if(!!e.message){
			console.log(e.message);
		}
		if(!!e.stack){
			console.log(e.stack);
		}
		console.log(e);
		console.groupEnd();
	});
	process._events.uncaughtException.splice(0,1);
	
	var info_tests = requireNode('./tests/info_tests');

	var req = require.config({
		baseUrl: info_tests.path.app,
		paths: {
			jquery: '../libs/jquery/jquery-1.10.2',
			specs: info_tests.path.specs,
			mocks: '../tests/mocks'
		}
	});

	define('nwgui', window.nwgui);

	// Load all sources in order to be getched from the code coverage analyzer
	req(info_tests.sources, function(){
		//When we have the sources loaded, we load the specs then run the jasmine
		req(info_tests.specs, function(){
			jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
			jasmine.getEnv().execute();
		});
	});

}());