/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */
window.debug = true;
define(['database', 'utils', 'mocks/tasks', 'mocks/companies', 'mocks/employees'], function(database, utils, t, c, e){
	var Task = t.doc,
		Company = c.doc,
		Employee = e.doc,
		tasks = t.model,
		companies = c.model,
		employees = e.model
	;

	describe('Checking definition of Mocked Documents (Task, Company, Employee):', function(){
		// We use this mocked Documents and models, in order to test the 
		// creation of models type SchemaDocument is well done
		
		it('Checking Mocked Task', function(){
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

		it('Checking Mocked Company', function(){
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


		it('Checking Mocked Employee', function(){
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
		it('Creating a Company, a few Tasks and 3 employees in nesteed manner', function(){
			var waitsForAsync = true,
				saved = false,
				Fulgencio,
				PepeCo,
				tasks = {}
			;
			window.tasks = tasks;
			runs(function() {
				PepeCo = new Company({
					name: 'PePeCo',
					address: 'Evergreen Terrace 226b',
					address2: 'Springfield, England',
					phone: '+44 555 0100',
					startDate: new Date(1980, 7, 11, 8,10,0)
				});
				
				tasks.baby = new Task({name: 'Be a Baby'});
				tasks.sargent = new Task({name: 'Sargent'});
				tasks.wife = new Task({name: 'Lovely Wife'});
				tasks.nice = new Task({name: 'Nice Person'});
				tasks.sexy = new Task({name: 'Be sexy'});

				Fulgencio = new Employee({
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
							company: PepeCo,
							tasks: [
								tasks.wife,
								tasks.sexy,
								tasks.nice
							]
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
							company: PepeCo,
							tasks: [
								tasks.sargent,
								tasks.nice
							]
						}
					],
					tasks: [
						tasks.baby
					]
				});
				
				Fulgencio.save()
					.done(function() {
						waitsForAsync = false;
						saved = true;
					})
					.fail(function() {
						waitsForAsync = false;
						saved = false;
					})
				;
			});
			
			waitsFor(
				function() {
					return !waitsForAsync;
				}, 
				'waiting for save resolution', 
				750
			);
			
			runs(function() {
				expect(saved).toBeTruthy();
				
				expect(Fulgencio._id).toBeDefined();
				expect(PepeCo._id).toBeDefined();

				expect(Fulgencio.company._id).toBeDefined();
				
				// Checking neested saves
				expect(Fulgencio.coworkers[0]).toBeDefined();
				expect(Fulgencio.coworkers[1]).toBeDefined();
				expect(Fulgencio.coworkers[2]).toBeUndefined();
				expect(Fulgencio.coworkers[0]._id).toBeDefined();
				expect(Fulgencio.coworkers[1]._id).toBeDefined();
				
				// Checking order of save
				expect(Fulgencio.coworkers[0].name).toEqual('Rita');
				expect(Fulgencio.coworkers[1].name).toEqual('Angel');
				
				// Checking nested nesteed save :P
				expect(Fulgencio.coworkers[0].company).toBeDefined();
				expect(Fulgencio.coworkers[0].company._id).toBeDefined();
				
				expect(Fulgencio.coworkers[1].company).toBeDefined();
				expect(Fulgencio.coworkers[1].company._id).toBeDefined();
				
				// Checking reuse of save objects
				expect(Fulgencio.company).toEqual(PepeCo);
				expect(Fulgencio.coworkers[0].company).toEqual(PepeCo);
				expect(Fulgencio.coworkers[1].company).toEqual(PepeCo);
				expect(Fulgencio.coworkers[0].company._id).toEqual(Fulgencio.company._id);
				expect(Fulgencio.coworkers[1].company._id).toEqual(Fulgencio.company._id);

				// checking unserializetion
				expect(Fulgencio.joinDate instanceof Date).toBeTruthy();
				expect(typeof Fulgencio.hoursWorked).toEqual('number');
				
				expect(Fulgencio.coworkers instanceof e.List_Employee).toBeTruthy();
				expect(Fulgencio.tasks instanceof e.List_Task).toBeTruthy();
				
				expect(Fulgencio.tasks[0]).toEqual(tasks.baby);
				
				expect(Fulgencio.coworkers[0].tasks[0]).toEqual(tasks.wife);
				expect(Fulgencio.coworkers[0].tasks[1]).toEqual(tasks.sexy);
				expect(Fulgencio.coworkers[0].tasks[2]).toEqual(tasks.nice);
				expect(Fulgencio.coworkers[0].tasks[3]).toBeUndefined();
				
				expect(Fulgencio.coworkers[1].tasks[0]).toEqual(tasks.sargent);
				expect(Fulgencio.coworkers[1].tasks[1]).toEqual(tasks.nice);
				expect(Fulgencio.coworkers[1].tasks[2]).toBeUndefined();
			});
		});
	});
	
	describe('Getting Elements', function(){
		var waitsForAsync,
			theDocs,
			aDoc,
			aDoc2
		;
		
		it('find Method, Search somewone lastnamed Pritchett', function(){
			
			runs(function(){
				waitsForAsync = true;
				employees.find({
					lastName: 'Pritchett'
				}).done(function(docs){
					theDocs = docs;
					waitsForAsync = false;
				});
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'waiting for save resolution', 
				750
			);
			
			runs(function(){
				expect(theDocs instanceof Array).toBeTruthy();
				expect(theDocs.length).toEqual(1);
//				expect(theDocs[0]).toBeGreaterThan(0);
			});
		});

		it('findOne Method, Search somewone named Rita', function(){
			
			runs(function(){
				waitsForAsync = true;
				employees.findOne({
					name: 'Rita'
				}).done(function(doc){
					aDoc = doc;
					waitsForAsync = false;
				});
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'waiting for save resolution', 
				750
			);
			
			runs(function(){
				expect(aDoc instanceof Employee).toBeTruthy();
				expect(aDoc.name).toEqual('Rita');
			});
		});
		
		it('findById Method, Search _id of last search', function(){
			
			runs(function(){
				waitsForAsync = true;
				employees.findByID(aDoc._id).done(function(doc){
					aDoc2 = doc;
					waitsForAsync = false;
				});
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'waiting for save resolution', 
				750
			);
			
			runs(function(){
				expect(aDoc2 instanceof Employee).toBeTruthy();
				expect(aDoc2.name).toEqual('Rita');
			});
		});
	});
	
	describe('Check Unique Index', function(){
		var waitsForAsync,
			saved,
			errMsg,
			Rita
		;
		
		it('Trying to Save an existing Document', function(){
			runs(function(){
				waitsForAsync = true;
				Rita = new Employee({
					name: 'Rita',
					lastName: 'Bennett',
					email: 'rita@dexter.us',
					joinDate: new Date(2006, 2, 3, 9, 30, 0),
					metadata: {
						RealName: 'Julie Benz',
						sexappeal: '+7'
					},
					hoursWorked: 350
				});
				
				Rita.save()
					.done(function(){
						waitsForAsync = false;
						saved = true;
					})
					.fail(function(e){
						errMsg = e;
						waitsForAsync = false;
						saved = false;						
					})
				;
			});
			
			waitsFor(
				function() {
					return !waitsForAsync;
				}, 
				'waiting for save resolution', 
				750
			);
	
			runs(function() {
				expect(saved).toBeFalsy('F*ck! the document was saved...');
				expect(errMsg.message).toBeDefined();
				expect(errMsg.message).toMatch(/unique/, 'what error is this? I expect something with "unique"');
			});
		});
	});
	
	describe('Updating documents', function(){
		var waitsForAsync,
			saved,
			errMsg,
			Rita			
		;
		
		it('Getting Rita, incrementing hoursWorked, Getting again and check the incrementation', function(){
			runs(function(){
				waitsForAsync = true;
				employees.findOne({name: 'Rita'})
					.done(function(doc){
						Rita = doc;
						waitsForAsync = false;
					})
					.fail(function(e){
						errMsg = e;
						waitsForAsync = false;
					})
				;
			});
			
			waitsFor(
				function() {
					return !waitsForAsync;
				}, 
				'waiting for Find resolution', 
				750
			);
	
			runs(function() {
				waitsForAsync = true;
				expect(Rita instanceof Employee).toBeTruthy();
				Rita.hoursWorked += 40;
				Rita.save()
					.done(function(){
						saved = true;
						waitsForAsync = false;
					})
					.fail(function(e){
						errMsg = e;
						saved = false;
						waitsForAsync = false;
					})
				;
			});
			
			waitsFor(
				function() {
					return !waitsForAsync;
				}, 
				'waiting for Save resolution', 
				750
			);
	
			runs(function(){
				Rita = null;
				waitsForAsync = true;
				employees.findOne({name: 'Rita'})
					.done(function(doc){
						Rita = doc;
						waitsForAsync = false;
					})
					.fail(function(e){
						errMsg = e;
						waitsForAsync = false;
					})
				;
			});
			
			waitsFor(
				function() {
					return !waitsForAsync;
				}, 
				'waiting for Find resolution', 
				750
			);
	
			runs(function() {
				expect(Rita instanceof Employee).toBeTruthy();
				expect(Rita.hoursWorked).toEqual(390);
			});
		});
	});
	
	describe('Removing Elements', function(){
		
		it('Removing Employees', function(){
			var waitsForAsync,
				removed,
				theDocs
			;

			runs(function(){
				waitsForAsync = true;
				employees.find()
					.done(function(docs){
						theDocs = docs;
						waitsForAsync = false;
					})
				;
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for find resolution', 
				750
			);
			
			runs(function(){
				waitsForAsync = true;
				expect(theDocs instanceof Array).toBeTruthy();
				
				employees.remove(theDocs)
					.then(
						function(){
							waitsForAsync = false;
							removed = true;
						},
						function(err){
							expect(err).toBeNull(); // force to show the message on jasmine
							waitsForAsync = false;
							removed = false;
						}
					)
				;
				
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for remove resolution', 
				750
			);

			runs(function(){
				expect(removed).toBeTruthy();

				waitsForAsync = true;
				theDocs = null;
				employees.find()
					.done(function(docs){
						theDocs = docs;
						waitsForAsync = false;
					})
				;				

			});

			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for remove resolution', 
				750
			);

			runs(function(){
				expect(theDocs.length).toEqual(0);
			});
		});
		
		it('Removing Tasks', function(){
			var waitsForAsync,
				removed,
				theDocs
			;

			runs(function(){
				waitsForAsync = true;
				theDocs = null;
				tasks.find()
					.done(function(docs){
						theDocs = docs;
						waitsForAsync = false;
					})
				;
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for find resolution', 
				750
			);
			
			runs(function(){
				waitsForAsync = true;
				expect(theDocs instanceof Array).toBeTruthy();
				
				var i, promises = [];
				for(i=0; i < theDocs.length; i++){
					promises.push( theDocs[i].remove() );
				}
				
				utils.all(promises)
					.then(
						function(){
							waitsForAsync = false;
							removed = true;
						},
						function(err){
							expect(err).toBeNull(); // force to show the message on jasmine
							waitsForAsync = false;
							removed = false;
						}
					)
				;
				
				theDocs = null;
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for remove resolution', 
				750
			);

			runs(function(){
				expect(removed).toBeTruthy();

				waitsForAsync = true;
				theDocs = null;
				tasks.find()
					.done(function(docs){
						theDocs = docs;
						waitsForAsync = false;
					})
				;				

			});

			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for remove resolution', 
				750
			);

			runs(function(){
				expect(theDocs.length).toEqual(0);
			});
		});
		
		it('Removing Companies', function(){
			var waitsForAsync,
				removed,
				theDocs
			;

			runs(function(){
				waitsForAsync = true;
				theDocs = null;
				companies.find()
					.done(function(docs){
						theDocs = docs;
						waitsForAsync = false;
					})
				;
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for find resolution', 
				750
			);
			
			runs(function(){
				waitsForAsync = true;
				expect(theDocs instanceof Array).toBeTruthy();
				
				var i, promises = [];
				for(i=0; i < theDocs.length; i++){
					promises.push( theDocs[i].remove() );
				}
				
				utils.all(promises)
					.then(
						function(){
							waitsForAsync = false;
							removed = true;
						},
						function(err){
							expect(err).toBeNull(); // force to show the message on jasmine
							waitsForAsync = false;
							removed = false;
						}
					)
				;
				
				theDocs = null;
			});
			
			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for remove resolution', 
				750
			);

			runs(function(){
				expect(removed).toBeTruthy();

				waitsForAsync = true;
				theDocs = null;
				companies.find()
					.done(function(docs){
						theDocs = docs;
						waitsForAsync = false;
					})
				;				

			});

			waitsFor(function(){
					return !waitsForAsync;
				}, 
				'for remove resolution', 
				750
			);

			runs(function(){
				expect(theDocs.length).toEqual(0);
			});
		});
	});
	
	
});
