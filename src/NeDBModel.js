/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */

define(['nwgui', './utils'], function(nwgui, utils){
	'use strict';
	
	var Datastore = requireNode('nedb');
	
	function Model(documentCtor){
		if(!documentCtor instanceof Function){
			throw TypeError('In order to create a Model, you must send a Document Constructor as a argument');
		}

		this.docCtor = documentCtor;
		if( !this.docCtor.hasOwnProperty('serialize') || !this.docCtor.hasOwnProperty('unserialize') ){
			console.group('Invalid Document Constructor');
			console.dir(this.docCtor);
			console.groupEnd();
			throw TypeError('Invalid Document Constructor [' + (documentCtor && documentCtor.name ? documentCtor.name : 'undefined') + '] must provide serialize & unserialize static methods\n'+
					'Example:\n'+
						'\tdocumentCtor = function(){};\n'+
						'\tdocumentCtor.serialize = function(rawData){ return "..." };\n'+
						'\tdocumentCtor.unserialize = function(rawData){ return new documentCtor(rawData); };\n'
			);
		}
		
		var dbName;
		if(this.docCtor.hasOwnProperty('dbName')){
			dbName = this.docCtor.dbName;
		}else{
			dbName = this.docCtor.name;
		}

		this.db = new Datastore({
			filename: nwgui.App.dataPath + '/nedb-data/' + dbName + '.db'
		});
		this.db.loadDatabase();
		if(this.docCtor.prototype.unique.length > 0){
			var i, fName;
			for(i = 0; i < this.docCtor.prototype.unique.length; i++){
				fName = this.docCtor.prototype.unique[i];
				this.db.ensureIndex({
					fieldName: fName,
					unique: true
				}, function(){});
			}
		}
		
		this.docCtor.prototype._model = this;
	}
	
	/**
	 * DRY function that resolve a deferred depends on the response of NeDB
	 * This function is valid for find*, insert, updateOne
	 * 
	 * @param {Deferred} deferred
	 * @param {*} err
	 * @param {Array|Object} docs
	 * @returns {undefined}
	 */
	Model.prototype._dbReturn = function(deferred, err, docs){
		var me = this;
		if(err){
			deferred.reject(err);
		}else if(docs !== null){
			this.createDocuments(docs)
				.then(
					function(ObjDocs){
						console.log('createDocuments RESPONSE', ObjDocs, 'FROM', docs, me.docCtor.name);
						deferred.resolve(ObjDocs);
					},
					deferred.reject
				)
			;
		}else{
			deferred.resolve([]);
		}
	};
	
	/**
	 * Converts an array of objects, normally returned by NeDB in an array 
	 * of this.docCtor. In case of receive an object this function trys to 
	 * convert and return in a this.docCtor
	 * 
	 * @param {type} rawData
	 * @returns {Promise}
	 */
	Model.prototype.createDocuments = function(rawData){
		var DBG_ID = this.docCtor.name + "_" + rawData.name + "_" + parseInt(Math.random() * 10000);
		
		var i, 
			docs = [], 
			promises = [], 
			defer = utils.defer()
		;
		
		window.debug ? console.log(DBG_ID + ': Model.createDocuments', rawData) : '';
		
		if(utils.isArray(rawData)){
			for(i = 0; i < rawData.length; i++){
				if(rawData[i] instanceof this.docCtor){
					docs.push( rawData[i] );
				}else{
					promises.push( 
						utils.deferredUnserializeAssignment(this.docCtor, rawData[i], docs, DBG_ID)
					);
				}
			}
		}else if(!(rawData instanceof this.docCtor)){
			// rawData in a serialized Object of this.docCtor and the 
			// createDocuments must return an instance of that object unserilized
			return this.docCtor.unserialize(rawData);
		}else{
			docs = rawData;
		}
		
		utils.all(promises)
			.done(function(){
				window.debug ? console.log(DBG_ID + ': Model.createDocuments.resolve', docs, arguments) : '';
				defer.resolve(docs);
			})
			.fail(function(){
				// @TODO Improve this error message
				var e = TypeError('Error creating document from rawData');
				defer.reject(e, rawData);
				throw e;
			})
		;
		
		return defer.promise();
	};
	
	Model.prototype._getRaw = function(docs){
		var i, rawData = [];
		
		if(utils.isArray(docs)){
			for(i = 0; i < docs.length; i++){
				if(docs[i] instanceof this.docCtor){
					rawData.push( this.docCtor.serialize(docs[i]) );
				}else{
					rawData.push( rawData[i] );
				}
			}
		}else if(docs instanceof this.docCtor){
			rawData = this.docCtor.serialize(docs);
		}else{
			rawData = docs;
		}
		return rawData;
	};

	/**
	 * find method of neDB
	 * @see neDB.find
	 * @param {Object} query
	 * @returns {Promise}
	 */
	Model.prototype.find = function(query){
		if(undefined === query){
			query = {};
		}
		var defer = utils.defer(),
			me = this
		;
		this.db.find(query, function(err, docs){
			me._dbReturn(defer, err, docs);
		});
		return defer.promise();
	};

	/**
	 * Find a the first document of the match
	 * @param {Object} query
	 * @returns {Promise}
	 */
	Model.prototype.findOne = function(query){
		var defer = utils.defer(),
			me = this
		;
		this.db.findOne(query, function(err, docs){
			me._dbReturn(defer, err, docs);
		});
		return defer.promise();
	};
	
	/**
	 * Find a document by ID (_id)
	 * @param {String} id
	 * @returns {Promise}
	 */
	Model.prototype.findByID = function(id){
		var defer = utils.defer(),
			me = this
		;
		this.db.findOne({_id: id}, function(err, docs){
			me._dbReturn(defer, err, docs);
		});
		return defer.promise();
	};
	
	Model.prototype.getByID = Model.prototype.findByID;
	
	/**
	 * Save an array of docs or one doc (docCtor type)
	 * 
	 * @param {docCtor|Array.<docCtor>} docs
	 * @returns {primise}
	 */
	Model.prototype.save = function(docs){
		var defer = utils.defer(),
			me = this
		;
		
		var i, doc, toInsert = [], toUpdate = [],
			add = function(doc){
				if (doc.hasOwnProperty('_id')){
					toUpdate.push( doc );
				} else {
					toInsert.push( doc );
				}
			}
		;
		
		this.createDocuments(docs)
			.done(function(docs){
				if (utils.isArray(docs)) {
					for (i = 0; i < docs.length; i++) {
						add(docs[i]);
					}
				} else {
					add(docs);
				}

				utils.all(

						me.insert(toInsert),
						me.update(toUpdate)

				).done(function(insertedDocs, updatedDocs) {
					var docs = insertedDocs.concat(updatedDocs);
					defer.resolve(docs);
				}).fail(function(errA, errB) {
					if(errA && !errB){
						defer.reject(errA);
					}else if(!errA && errB){
						defer.reject(errB);
					}else{
						defer.reject(errA, errB);
					}
				});
			})
			.fail(defer.reject)
		;

		
		return defer.promise();
	};
	
	/**
	 * Inserts a or an array of docCtor into the database
	 * 
	 * @param {docCtor|Array.<docCtor>} docs
	 * @returns {Promise}
	 */
	Model.prototype.insert = function(docs){
		var defer = utils.defer(),
			me = this
		;
		
		window.debug ? console.log('inserting', this._getRaw(docs)) : '';
		
		this.db.insert(this._getRaw(docs), function(err, docs){
			window.debug ? console.log('insert return', err, docs) : '';
			me._dbReturn(defer, err, docs);
		});
		
		return defer.promise();
	};
	
	/**
	 * Updates a or an array of docCtor into the database
	 * 
	 * @param {docCtor|Array.<docCtor>} docs
	 * @returns {Promise}
	 */
	Model.prototype.update = function(docs){
		var defer = utils.defer(),
			me = this,
			promises = [],
			i
		;
		
		if(!utils.isArray(docs)){
			return this.updateOne(docs);
		}
		
		for(i = 0; i < docs.length; i++){
			promises.push( this.updateOne(docs[i]) );
		}
		
		utils.all(promises)
			.done(function(){
				defer.resolve(Array.prototype.slice.call(arguments, 0));
			})
			.fail(function(){
				defer.reject(Array.prototype.slice.call(arguments, 0));
			})
		;
		
		return defer.promise();
	};

	/**
	 * Updates a docCtor into the database
	 * 
	 * @param {docCtor} doc
	 * @returns {Promise}
	 */
	Model.prototype.updateOne = function(doc){
		var defer = utils.defer(),
			me = this,
			rawData = this._getRaw(doc)
		;
		
		this.db.update({_id: rawData._id}, rawData, {}, function(err, docs){
			me._dbReturn(defer, err, rawData);
		});
		
		return defer.promise();
	};
	
	Model.prototype.remove = function(docs){
		var defer = utils.defer(),
			me = this,
			promises = [],
			i
		;
		
		if(!utils.isArray(docs)){
			return this.removeOne(docs);
		}
		
		for(i = 0; i < docs.length; i++){
			promises.push( this.removeOne(docs[i]) );
		}
		
		utils.all(promises)
			.done(function(){
				defer.resolve(Array.prototype.slice.call(arguments, 0));
			})
			.fail(function(){
				defer.reject(Array.prototype.slice.call(arguments, 0));
			})
		;
		
		return defer.promise();
	};
	
	Model.prototype.removeOne = function(doc){
		var defer = utils.defer(),
			rawData = this._getRaw(doc)
		;
		if(!!rawData._id){
			this.db.remove({_id: rawData._id}, function(err, numRemoved){
				if(err){
					defer.reject(err);
				}else{
					defer.resolve(numRemoved);
				}
			});
		}else{
			defer.reject('Imposible to remove a non persisted document');
		}
		
		return defer.promise();
	};
	
	Model.prototype.newDocument = function(rawData){
		return new this.docCtor(rawData);
	};
	
	Model.prototype.getDocumentConstructor = function(){
		return this.docCtor;
	};
	
	return Model;
});
