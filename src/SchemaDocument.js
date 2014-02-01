/*
 *
 *  @overview
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 *
 */

define(['./utils'], function(utils){
	'use strict';

	/**
	 * @name SchemaDocument
	 * @abstract
	 * @class
	 * @param {Object} rawData
	 * @returns {SchemaDocument}
	 */
	function SchemaDocument(rawData){
		if(!!rawData){
			this.set(rawData);
		}
	}

	/**
	 * 
	 * @param {Object} rawData
	 * @returns {Promise}
	 */
	SchemaDocument.prototype.set = function(rawData){
		var i, fName, fDef,
			me = this,
			defer = utils.defer(),
			promises = []
		;

		var defer = utils.defer();
		if(rawData.hasOwnProperty('_id')){
			this._id = rawData._id;
		}

		for(i = 0; i < this.fields.length; i++){
			fName = this.fields[i];
			fDef = this.schema[fName];
			if(fDef.allowNull){
				// if allowNull && the field is empty ... continue
				if(!rawData.hasOwnProperty(fName)){
					this[fName] = this.schema[fName].defaultValue ? 
						this.schema[fName].defaultValue : 
						null
					;
					continue;
				}else if(rawData[fName] === null || 
					rawData[fName] === undefined
				){
					this[fName] = this.schema[fName].defaultValue ? 
						this.schema[fName].defaultValue : 
						null
					;
					continue;
				}

			}else if(!rawData.hasOwnProperty(fName)){
				console.error(
					this.constructor.name + ' not allow ' + fName + 
					' to be null or undefined', rawData
				);
				throw TypeError(this.constructor.name + ' not allow ' + 
					fName + ' to be null or undefined'
				);
			}

			if(rawData[fName].constructor.name !== this.schema[fName].type.name){
				try{
					if(this.schema[fName].type.hasOwnProperty('unserialize')){
						if('string' === typeof(rawData[fName]) && 
							rawData[fName].indexOf('#REF_') === 0
						){
							promises.push(
								this._getRef(fName, rawData[fName])
							);
						}else{
							promises.push(
								this._unserializeDoc(fName, rawData[fName])
							);
						}
					}else{
						switch(this.schema[fName].type){
							case Number:
								this[fName] = parseFloat(rawData[fName], 10);
							break;
							case Date:
								if(rawData[fName] !== ''){
									this[fName] = new this.schema[fName].type( rawData[fName] );
								}else{
									this[fName] = new this.schema[fName].type( 0 );
								}
							break;
							default:
								this[fName] = new this.schema[fName].type( rawData[fName] );
						}

					}
				}catch(e){
					window.debug ? console.group('DEBUGGIN ERROR LOG', rawData[fName] + ' can be converted to ' + this.schema[fName].type.name) : '';
					window.debug ? console.log(e.message) : '';
					window.debug ? console.log(e.stack) : '';
					window.debug ? console.groupEnd() : '';

					throw TypeError(rawData[fName] + ' can be converted to ' + this.schema[fName].type.name);
				}
			}else{
				this[fName] = rawData[fName];
			}

		}
		utils.all(promises)
			.then(
				function(){
					defer.resolve(me); 
				}, 
				defer.reject
			)
		;
		return defer.promise();
	};

	SchemaDocument.prototype._getRef = function(fName, ref){
		var me = this;
		return this.schema[fName].type.prototype._model.findByID( ref.substring(5) )
			.done(function(doc){
				me[fName] = doc;
			})
		;
	};
	
	SchemaDocument.prototype._unserializeDoc = function(fName, item){
		var me = this;
		return this.schema[fName].type.unserialize( item )
			.done(function(doc){
				me[fName] = doc;
			})
		;
	};
	

	SchemaDocument.prototype.isPersisted = function(){
		return !!this._id;
	};

	SchemaDocument.prototype.save = function(){
		if(!!this._savingPromise){
			return this._savingPromise;
		}else{
			var defer = utils.defer(),
				me = this,
				i,
				rName,
				promises = []
			;
			
			this._savingPromise = defer.promise().always(function(){
				delete me._savingPromise;
			});

			for(i=0; i < this.relations.length; i++){
				rName = this.relations[i];
				if(!!this[rName] && this[rName].save){
					promises.push( this[rName].save() );
				}
			}

			utils.all(promises).done(function(){
				me._model.save(me)
					.done(function(docs){
						me.set(docs[0]);
						defer.resolve(me);
					})
					.fail(function(err){
						defer.reject(err);
					})
				;
			});

			return defer.promise();
		}
	};

	SchemaDocument.prototype.remove = function(){
		var defer = utils.defer(),
			me = this
		;

		this._model.removeOne(this)
			.done(function(docs){
				if(me.hasOwnProperty('_id')){
					delete me._id;
				}
				defer.resolve(me);
			})
			.fail(function(err){
				defer.reject(err);
			})
		;

		return defer.promise();
	};

	SchemaDocument.unserialize = function(rawData){
		var o = new SchemaDocument();
		return o.set(rawData);
	};

	SchemaDocument.serialize = function(instance){
		var rawData = {}, i, fName, fDef, item;

		if(instance.fields && instance.unique && instance.relations){

			if(instance.hasOwnProperty('_id')){
				rawData._id = instance._id;
			}

			for(i = 0; i < instance.fields.length; i++){
				fName = instance.fields[i];
				fDef = instance.schema[fName];
				item = instance[fName];

				if(instance.hasOwnProperty(fName) && !!instance[fName]){
					if(instance.schema[fName].type.hasOwnProperty('serialize')){
						if(!!item._id){ // is persisted!
							rawData[fName] = '#REF_' + item._id;
						}else{
							rawData[fName] = instance.schema[fName].type.serialize( instance[fName] );
						}
					}else{
						// consider this as a basicType
						if(fName.charAt(0) !== '_'){
							rawData[fName] = item;
						}
					}
				}
			}
			
			return rawData;
		}else{
			return instance;
		}
	};

	SchemaDocument.inherit = function(ctor, schema){
		utils.inherits(ctor, SchemaDocument);
		ctor.prototype.schema = _normalizeSchema(ctor, schema);

		if(!ctor.hasOwnProperty('serialize')){
			ctor.serialize = SchemaDocument.serialize;
		}

		if(!ctor.hasOwnProperty('unserialize')){
			ctor.unserialize = function(rawData){
				var o = new ctor();
				return o.set(rawData);
			};
		}
		if(!ctor.hasOwnProperty('inherit')){
			var subExtend = function(subCtor, schema){
				var mergedSchema = $.extend({}, ctor.prototype.schema, schema);
				utils.inherits(subCtor, ctor);

				subCtor.prototype.schema = _normalizeSchema(subCtor, mergedSchema);

				if(!subCtor.hasOwnProperty('serialize')){
					subCtor.serialize = ctor.serialize;
				}

				if(!subCtor.hasOwnProperty('unserialize')){
					subCtor.unserialize = function(rawData){
						var o = new subCtor();
						return o.set(rawData);
					};
				}

				if(!subCtor.hasOwnProperty('inherit')){
					subCtor.inherit = subExtend;
				}
			};
			ctor.inherit = subExtend;
		}
	};

	function _normalizeSchema(ctor, schema){
		var normalizedSchema = {},
			fName
		;

		ctor.prototype.fields = [];
		ctor.prototype.unique = [];
		ctor.prototype.relations = [];

		for(fName in schema){
			if(schema.hasOwnProperty(fName)){
				if(schema[fName] instanceof Function){
					normalizedSchema[fName] = {
						name: fName,
						type: schema[fName],
						allowNull: true,
						defaultValue: undefined,
						unique: false
					};
				}else{
					normalizedSchema[fName] = {
						name: fName,
						type: schema[fName].type,
						allowNull: undefined !== schema[fName].allowNull ? schema[fName].allowNull : true,
						defaultValue: undefined !== schema[fName].defaultValue ? schema[fName].defaultValue : undefined,
						unique: undefined !== schema[fName].unique ? schema[fName].unique : false
					};
				}

				if(normalizedSchema[fName].unique){
					ctor.prototype.unique.push(fName);
				}

				ctor.prototype.fields.push(fName);
				
				if(normalizedSchema[fName].type.serialize && 
					normalizedSchema[fName].type.unserialize){
					
					ctor.prototype.relations.push(fName);
				}
			}
		}

		return normalizedSchema;
	}

	return SchemaDocument;
});
