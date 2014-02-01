/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */

define(['database'], function(database, companies){
	function Company(){
		database.SchemaDocument.apply(this, arguments);
	}

	database.SchemaDocument.inherit(Company, {
		name: String,
		address: {
			type: String,
			defaultValue: 'NO-ADDRESS'
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
		}
	});
	
	var companies = new database.NeDBModel(Company);
	
	// ADVICE: This is not the recomended exportation, you must to export only 
	// the model
	return {
		model: companies,
		doc: Company
	};
});

