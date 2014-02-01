/*
 *
 *  @overview
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 *
 */

define(['./utils'], function(utils){
	'use strict';

	function SchemaLessDocument(){}

	SchemaLessDocument.serialize = function(instance){
		return instance;
	};
	SchemaLessDocument.unserialize = function(rawData){
		var defer = utils.defer(),
			fName
		;

		for(fName in rawData){
			if(rawData.hasOwnProperty(fName)){
				this[fName] = rawData[fName];
			}
		}

		defer.resolve();
		return defer.promise();
	};

	return SchemaLessDocument;
});
