NeDBModel
=========

A Schema Related Data Model For NeDB usable for NodeWebKit

You can find an How To use, in the tests/specs/functionalSchema.spec.js
To run the tests, download or clone this repository

	git clone https://github.com/danyg/NeDBModel.git ./
	npm install
	npm test

# Examples

```javascript
define(['database', 'models/tasks'], function(database, tasks){
	// Definition of Document, the document is the object that will be 
	// stored on the database
	function Company(){
		database.SchemaDocument.apply(this, arguments);
	}

	// Company extends SchemaDocument
	// You must specify a Schema
	database.SchemaDocument.inherit(Company, {
		name: String,  // Javascript Basic Type are used
		address: {
			type: String,
			allowNull: false,
			unique: true		// You can define unique fields
		},
		address2: {
			type: String,
			defaultValue: 'NO-ADDRESS-2'
		},
		phone: {
			type: String,
			defaultValue: 'NO-PHONE'
		},
		startDate: {
			type: Date,
			allowNull: true,
			defaultValue: new Date(0)
		},
		// Or you can use relations this is a 1:1 relation
		mainTask: tasks.getDocumentConstructor(),
		// Or you can create a List of relations, 1:n relation
		otherTasks: database.List(tasks.getDocumentConstructor())
	});

	// And then you need to create a model to operate with this Document
	// the model provide find, and this type of methods
	var companies = new database.NeDBModel(Company);

	return companies;
});
```

# Roadmap

- Node compatibility
- Searchs in the relations like, companies.find({'otherTasks': {$in: ['software']}); this don´t work with relations

[![Analytics](https://ga-beacon.appspot.com/UA-47717226-1/NeDBModel/home)](https://github.com/igrigorik/ga-beacon)

