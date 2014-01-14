/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */

define(['jquery'], function($){
	
	function ListAbstract(rawData){
		if(!!rawData){
			this.set(rawData);
		}
	}
	
	ListAbstract.prototype = Object.create(Array.prototype);
	ListAbstract.prototype.constructor = ListAbstract;
	
	ListAbstract.prototype.set = function(rawData){
		var i, item, dfrIX, promises = [], tmp;
		for(i = 0; i < rawData.length; i++){
			item = rawData[i];
			if('string' === typeof(item) && item.indexOf('#REF') === 0){
				// giveme things MODEL!
				dfrIX = this.push(new this.docCtor);
				promises.push(this._asyncSearch(dfrIX, item.substring(4)));
			}else{
				this.push(this.docCtor.constructor.unserialize(item));
			}
		}
//		if(promises.length === 0){
//			tmp = $.Deferred();
//			this._promise = tmp.promise();
//			tmp.resolve();
//		}else{
//		}
		this._promise = $.when.apply(null, promises).promise();
	};
	
	ListAbstract.prototype._asyncSearch = function(dfrIX, _id){
		var me = this;
		return this.docCtor.prototype._model.findByID(_id)
			.done(function(doc){
				me[dfrIX] = doc;
			})
			.fail(function(err){
				throw TypeError(this.constructor.name + ' imposible to find ' + _id + ' document because: ' + err);
			})
		;
	};
	
	ListAbstract.prototype.onAllResultsReady = function(cbk){
		this._promise.done(cbk);
	};
	ListAbstract.prototype.ready = ListAbstract.prototype.onAllResultsReady;

	ListAbstract.prototype.push = function(doc){
		if(doc instanceof this.docCtor){
			Array.prototype.push(doc);
		}else{
			throw TypeError('The document is not a instance of ' + this.docCtor.name);
		}
	};

	ListAbstract.serialize = function(instance){
		var i = 0, 
			doc,
			docCtor = instance.prototype.docCtor,
			serialized = []
		;

		for(i = 0; i < this.length; i++){
			doc = this[i];
			if(doc.hasOwnProperty('_id')){
				serialized.push('#REF' + doc._id);
			}else{
				serialized.push(docCtor.serialize(doc));
			}
		}

		return serialized;
	};
	
	function ListFactory(docCtor){
		var List = (new Function(
			'function List_' + docCtor.name + '(){ ListAbstract.apply(this, arguments); };'+
			'return List_' + docCtor.name + ';'
		))();
		
		ListAbstract.prototype = Object.create(ListAbstract.prototype);
		ListAbstract.prototype.constructor = List;
		
		List.prototype.docCtor = docCtor;
		List.serialize = ListAbstract.serialize;
		List.unserialize = function(rawData){
			return new List(rawData);
		};
		
		return List;
	}
	
	
	return ListFactory;
	
});
