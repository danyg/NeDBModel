/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */

define(['database'], function(database, companies){
	function Task(){
		database.SchemaDocument.apply(this, arguments);
	}

	database.SchemaDocument.inherit(Task, {
		name: {
			type: String,
			allowNull: false
		}
	});
	
	var tasks = new database.NeDBModel(Task);
	
	// ADVICE: This is not the recomended exportation, you must to export only 
	// the model
	return {
		model: tasks,
		doc: Task
	};
});

