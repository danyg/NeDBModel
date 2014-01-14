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
		console.error(e);
	});
	process.on('error', function(e){
		console.error(e);
	});

	/**
	 * @type Info
	 */
	var info = nrequire('./node_includes/info');
	var info_tests = nrequire('./tests/info_tests');

	var req = require.config({
		baseUrl: info_tests.path.app,
		paths: {
			jquery: '../node_modules/jquery/jquery-1.10.2',
			specs: info_tests.path.specs
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