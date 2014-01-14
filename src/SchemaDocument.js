/*
 *
 *  @overview
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 *
 */

define(['durandal/system', 'jquery'], function(system, $){

	var util = nrequire('util');

	function SchemaDocument(rawData){
		if(!!rawData){
			this.set(rawData);
		}
	}

	SchemaDocument.prototype.set = function(rawData){
		var i, fName, fDef, 
			me = this,
			defer = system.defer(),
			promises = []
		;

		if(rawData.hasOwnProperty('_id')){
			this._id = rawData._id;
		}

		for(i = 0; i < this.fields.length; i++){
			fName = this.fields[i];
			fDef = this.schema[fName];
			if(fDef.allowNull){
				if(!rawData.hasOwnProperty(fName)){
					this[fName] = this.schema[fName].defaultValue ? this.schema[fName].defaultValue : null;
					continue;
				}else if(rawData[fName] === null || rawData[fName] === undefined){
					this[fName] = this.schema[fName].defaultValue ? this.schema[fName].defaultValue : null;
					continue;
				}
			}else{
				if(!rawData.hasOwnProperty(fName)){
					console.error(this.constructor.name + ' not allow ' + fName + ' to be null or undefined', rawData);
					throw TypeError(this.constructor.name + ' not allow ' + fName + ' to be null or undefined');
				}
			}

			if(rawData[fName].constructor.name !== this.schema[fName].type.name){
				try{
					if(this.schema[fName].type.hasOwnProperty('unserialize')){
						promises.push(
							this.schema[fName].type.unserialize( rawData[fName] )
							.done(function(doc){
								me[fName] = doc;
							})
						);
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
					throw TypeError(rawData[fName] + ' can be converted to ' + this.schema[fName].type.name);
				}
			}else{
				this[fName] = rawData[fName];				
			}
			
			return $.when.apply(null, promises);
		}
	};

	SchemaDocument.prototype.isPersisted = function(){
		return !!this._id;
	};

	SchemaDocument.prototype.save = function(){
		var defer = system.defer(),
			me = this
		;

		this._model.save(this)
			.done(function(docs){
				me.set(docs[0]);
				defer.resolve(me);
			})
			.fail(function(err){
				defer.reject(err);
			})
		;

		return defer.promise();
	};

	SchemaDocument.prototype.remove = function(){
		var defer = system.defer(),
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
		var rawData = {}, i, fName, fDef;

		if(instance.hasOwnProperty('_id')){
			rawData._id = instance._id;
		}

		for(i = 0; i < instance.fields.length; i++){
			fName = instance.fields[i];
			fDef = instance.schema[fName];

			if(instance.hasOwnProperty(fName)){
				if(instance.schema[fName].type.hasOwnProperty('serialize')){
					rawData[fName] = instance.schema[fName].type.serialize( instance[fName] );
				}else{
					// consider this as a basicType
					rawData[fName] = instance[fName];
				}
			}
		}

		return rawData;
	};

	SchemaDocument.inherit = function(ctor, schema){
		util.inherits(ctor, SchemaDocument);
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
				util.inherits(subCtor, ctor);

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
			}
		}

		return normalizedSchema;
	}

	return SchemaDocument;
});
