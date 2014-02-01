/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */

define(['database', './companies', './tasks'], function(database, c, t){
	function Employee(){
		database.SchemaDocument.apply(this, arguments);
	}
	
	var companies = c.model,
		tasks = t.model,
		List_Employee = database.List(Employee),
		List_Task = database.List(tasks.getDocumentConstructor())
	;

	database.SchemaDocument.inherit(Employee, {
		name: String,
		lastName: String,
		email: {
			type: String,
			unique: true,
			allowNull: false
		},
		joinDate: {
			type: Date,
			allowNull: false,
			defaultValue: new Date(0)
		},
		metadata: Object,
		hoursWorked: {
			type: Number,
			defaultValue: 0
		},
		company: { // 1:1
			type: companies.getDocumentConstructor(),
			defaultValue: {name: 'NO-COMPANY'}
		},
		coworkers: List_Employee, // n:m
		tasks: List_Task // n:m
	});
	
	var employees = new database.NeDBModel(Employee);
	
	// ADVICE: This is not the recomended exportation, you must to export only 
	// the model
	return {
		model: employees,
		doc: Employee,
		List_Employee: List_Employee,
		List_Task: List_Task
	};
});
