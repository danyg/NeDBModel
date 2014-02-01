/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */

define(['./utils'], function(utils){

	function ListAbstract(rawData){
		if(!!rawData){
			this.set(rawData);
		}
	}
	
	utils.inherits(ListAbstract, Array);

	ListAbstract.prototype.set = function(rawData){
		var i, 
			item, 
			dfrIX,
			promises = [], 
			tmp, 
			defer = utils.defer(),
			me = this
		;

		for(i = 0; i < rawData.length; i++){
			item = rawData[i];
			if('string' === typeof(item) && item.indexOf('#REF_') === 0){
				promises.push(
					this._asyncSearch(item.substring(5))
				);
			}else{
				promises.push( 
					utils.deferredUnserializeAssignment(this.docCtor, item, this, 'LIST_' + this.docCtor.name+'_'+item.name)
				);
			}
		}
//		if(promises.length === 0){
//			tmp = $.Deferred();
//			this._promise = tmp.promise();
//			tmp.resolve();
//		}else{
//		}
		this._promise = utils.all(promises)
			.then(
				function(){	defer.resolve(me); }, 
				defer.reject
			)
		;
		
		return defer.promise();
	};
	
	ListAbstract.prototype._asyncSearch = function(_id){
		var dfrIX, 
			me = this,
			promise = this.docCtor.prototype._model.findByID(_id)
		;

		dfrIX = this.push( new utils.AsyncDocument({_id: _id}, promise) ) - 1;
		promise
			.done(function(doc){
				me[dfrIX] = doc;
			})
			.fail(function(err){
				throw TypeError(this.constructor.name + ' imposible to find ' + _id + ' document because: ' + err);
			})
		;
		return promise;
	};
	
	ListAbstract.prototype.onAllResultsReady = function(cbk){
		this._promise.done(cbk);
	};
	ListAbstract.prototype.ready = ListAbstract.prototype.onAllResultsReady;

	ListAbstract.prototype.push = function(doc){
		if(doc instanceof utils.AsyncDocument){
			return Array.prototype.push.call(this, doc);
		}else if(doc instanceof this.docCtor){
			return Array.prototype.push.call(this, doc);
		}else{
			throw TypeError('The document is not a instance of ' + this.docCtor.name);
		}
	};
	
	ListAbstract.prototype.save = function(){
		var i,
			promises = []
		;
		
		for(i=0; i < this.length; i++){
			promises.push(this[i].save());
		}

		return utils.all(promises);
	};

	ListAbstract.serialize = function(instance){
		var i = 0, 
			doc,
			docCtor,
			serialized = []
		;
		if(!!instance && !!instance.docCtor){
			docCtor = instance.docCtor;

			for(i = 0; i < instance.length; i++){
				doc = instance[i];
				if(doc.hasOwnProperty('_id')){
					serialized.push('#REF_' + doc._id);
				}else{
					serialized.push(docCtor.serialize(doc));
				}
			}

		}
		return serialized;
	};
	
	function ListFactory(docCtor){
		var List = (new Function(
			'function List_' + docCtor.name + '(){ this._superCtor.apply(this, arguments); };'+
			'return List_' + docCtor.name + ';'
		))();
		
		List.prototype = Object.create(ListAbstract.prototype);
		List.prototype._superCtor = ListAbstract;
		List.prototype.constructor = List;
		
		List.prototype.docCtor = docCtor;
		List.serialize = ListAbstract.serialize;
		List.unserialize = function(rawData){
			var o = new List();
			return o.set(rawData);
		};
		
		return List;
	}
	
	
	return ListFactory;
	
});
