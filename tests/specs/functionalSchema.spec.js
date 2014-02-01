/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */
window.debug = true;
define(['database', 'mocks/tasks', 'mocks/companies', 'mocks/employees'], function(database, t, c, e){
	var Task = t.doc,
		Company = c.doc,
		Employee = e.doc,
		tasks = t.model,
		companies = c.model,
		employees = e.model
	;
		


	describe('Create Documents, Employee, Company & Task:', function(){


		it('Defining Task', function(){
			// are defined
			expect(Task.prototype.schema.name).toBeDefined('name must be defined');

			// Types Checks
			expect(Task.prototype.schema.name.type).toBe(String, 'name.type must be String');

			// AllowNull Checks
			expect(Task.prototype.schema.name.allowNull).toBeFalsy('name must not allowNull');

			// Unique Checks
			expect(Task.prototype.schema.name.unique).toBeFalsy('name must be unique');

			// Prototype Chain Check
			expect(Task.prototype instanceof database.SchemaDocument).toBeTruthy("Task must extend of SchemaDocument");
		});

		it('Defining Company', function(){
			// are defined
			expect(Company.prototype.schema.name).toBeDefined();
			expect(Company.prototype.schema.address).toBeDefined();
			expect(Company.prototype.schema.address2).toBeDefined();
			expect(Company.prototype.schema.phone).toBeDefined();
			expect(Company.prototype.schema.startDate).toBeDefined();

			// Types Checks
			expect(Company.prototype.schema.name.type).toBe(String);
			expect(Company.prototype.schema.address.type).toBe(String);
			expect(Company.prototype.schema.address2.type).toBe(String);
			expect(Company.prototype.schema.phone.type).toBe(String);
			expect(Company.prototype.schema.startDate.type).toBe(Date);

			// Diference
//			expect(List_Employees).not.toBe(Employee.prototype.schema.coworkers.type);

			// AllowNull Checks
			expect(Company.prototype.schema.name.allowNull).toBeTruthy();
			expect(Company.prototype.schema.address.allowNull).toBeTruthy();
			expect(Company.prototype.schema.address2.allowNull).toBeTruthy();
			expect(Company.prototype.schema.phone.allowNull).toBeTruthy();
			expect(Company.prototype.schema.startDate.allowNull).toBeTruthy();

			// Unique Checks
			expect(Company.prototype.schema.name.unique).toBeFalsy();
			expect(Company.prototype.schema.address.unique).toBeFalsy();
			expect(Company.prototype.schema.address2.unique).toBeFalsy();
			expect(Company.prototype.schema.phone.unique).toBeFalsy();
			expect(Company.prototype.schema.startDate.unique).toBeFalsy();

			// Prototype Chain Check
			expect(Company.prototype instanceof database.SchemaDocument).toBeTruthy();
		});


		it('Defining Employee', function(){
			
			
			
			// are defined
			expect(Employee.prototype.schema.name).toBeDefined();
			expect(Employee.prototype.schema.lastName).toBeDefined();
			expect(Employee.prototype.schema.email).toBeDefined();
			expect(Employee.prototype.schema.joinDate).toBeDefined();
			expect(Employee.prototype.schema.metadata).toBeDefined();
			expect(Employee.prototype.schema.hoursWorked).toBeDefined();
			expect(Employee.prototype.schema.company).toBeDefined();
			expect(Employee.prototype.schema.coworkers).toBeDefined();
			expect(Employee.prototype.schema.tasks).toBeDefined();
			
			// Types Checks
			expect(Employee.prototype.schema.name.type).toBe(String);
			expect(Employee.prototype.schema.lastName.type).toBe(String);
			expect(Employee.prototype.schema.email.type).toBe(String);
			expect(Employee.prototype.schema.joinDate.type).toBe(Date);
			expect(Employee.prototype.schema.metadata.type).toBe(Object);
			expect(Employee.prototype.schema.hoursWorked.type).toBe(Number);
			expect(Employee.prototype.schema.company.type).toBe(Company);
			expect(Employee.prototype.schema.coworkers.type).toBe(e.List_Employee);
			expect(Employee.prototype.schema.tasks.type).toBe(e.List_Task);
			
			// AllowNull Checks
			expect(Employee.prototype.schema.name.allowNull).toBeTruthy();
			expect(Employee.prototype.schema.lastName.allowNull).toBeTruthy();
			expect(Employee.prototype.schema.email.allowNull).toBeFalsy();
			expect(Employee.prototype.schema.joinDate.allowNull).toBeFalsy();
			expect(Employee.prototype.schema.metadata.allowNull).toBeTruthy();
			expect(Employee.prototype.schema.hoursWorked.allowNull).toBeTruthy();
			expect(Employee.prototype.schema.company.allowNull).toBeTruthy();
			expect(Employee.prototype.schema.coworkers.allowNull).toBeTruthy();
			expect(Employee.prototype.schema.tasks.allowNull).toBeTruthy();
			
			// Unique Checks
			expect(Employee.prototype.schema.name.unique).toBeFalsy();
			expect(Employee.prototype.schema.lastName.unique).toBeFalsy();
			expect(Employee.prototype.schema.email.unique).toBeTruthy();
			expect(Employee.prototype.schema.joinDate.unique).toBeFalsy();
			expect(Employee.prototype.schema.metadata.unique).toBeFalsy();
			expect(Employee.prototype.schema.hoursWorked.unique).toBeFalsy();
			expect(Employee.prototype.schema.company.unique).toBeFalsy();
			expect(Employee.prototype.schema.coworkers.unique).toBeFalsy();
			expect(Employee.prototype.schema.tasks.unique).toBeFalsy();
			
			// Prototype Chain Check
			expect(Employee.prototype instanceof database.SchemaDocument).toBeTruthy();
		});

		
		
		
	});
	
	describe('Inserting Elements', function(){
		it('rawData Way', function(){
			
			var PepeCo = new Company({
				name: 'PePeCo',
				address: 'Evergreen Terrace 226b',
				address2: 'Springfield, England',
				phone: '+44 555 0100',
				startDate: new Date(1980, 7, 11, 8,10,0)
			});
			


			var Fulgencio = new Employee({
				name: 'Fulgencio Joseph',
				lastName: 'Pritchett',
				email: 'fulgencio@modern.family.us',
				joinDate: new Date(2011, 2, 3, 9, 30, 0),
				metadata: {
					schemaLess: 'Value',
					SchemaLess_2: 'Value 2'
				},
				hoursWorked: 35,
				company: PepeCo,
				coworkers: [
					{
						name: 'Rita',
						lastName: 'Bennett',
						email: 'rita@dexter.us',
						joinDate: new Date(2006, 2, 3, 9, 30, 0),
						metadata: {
							RealName: 'Julie Benz',
							sexappeal: '+7'
						},
						hoursWorked: 350,
						company: PepeCo
					},
					{
						name: 'Angel',
						lastName: 'Batista',
						email: 'angel.cuba.libre@dexter.us',
						joinDate: new Date(2005, 2, 3, 9, 30, 0),
						metadata: {
							RealName: 'David Zayas',
							say: 'Que Pasa Mi chico!'
						},
						hoursWorked: 1115,
						company: PepeCo
					}
				]
			});
			
			Fulgencio.save()
				.done(function() {
					console.log('FULGENCIO SAVED');
				})
				.fail(function() {
					console.log('FULGENCIO EXPLODED');
				})
			;
//			PepeCo.save()
//				.done(function(){
//					console.log('PepeCo SAVED');
//					console.log(Fulgencio.company);
//				})
//				.fail(function(){
//					console.log('PepeCo save FAILED');
//				})
//			;
			


			
			window.Fulgencio = Fulgencio;

		});
	});
});
