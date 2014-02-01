/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */

define(['jquery'], function($){
	'use strict';
	
	function inherits(ctor, superCtor){
		ctor.super_ = superCtor;
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor: {
				value: ctor,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
	};
	
	function AsyncDocument(rawData, promise){
		this.rawData = rawData;
		this.promise = promise;
		this.done = promise.done;
		this.fail = promise.fail;
	}
	
	function deferredUnserializeAssignment(docCtor, item, toPush){
		var dfrIX,
			promise = docCtor.unserialize(item),
			aDocument = new AsyncDocument(
				item, 
				promise
			);
		dfrIX = toPush.push(aDocument) - 1;
		promise.done(function(doc){
			toPush[dfrIX] = doc;
		});

		return promise;
	};
	
	return {
		inherits: inherits,
		AsyncDocument: AsyncDocument,
		deferredUnserializeAssignment: deferredUnserializeAssignment,
		defer: function(action) {
            return $.Deferred(action);
        },
		/**
		 * Calls to $.when in 2 ways, if an array of promises is given, call 
		 * $.when using that array as arguments, or you can call utils.all 
		 * using the nomal behaivior of $.when, multiple promises arguments
		 * 
		 * @param {Array|Promise|...} promises
		 * @returns {Promise}
		 */
		all: function(promises) {
			if(arguments.length === 1){
				return $.when.apply(null, promises);
			}else{
				return $.when.apply(null, arguments);
			}
        },
		isArray: $.isArray
	};
});
