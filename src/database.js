/* 
 * 
 *  @overview 
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 * 
 */

define(['./SchemaDocument.js', './SchemaLessDocument.js', './NeDBModel.js', './List.js'], 
function(SchemaDocument, SchemaLessDocument, NeDBModel, List){
	'use strict';
	
	return {
		SchemaDocument: SchemaDocument, 
		SchemaLessDocument: SchemaLessDocument, 
		NeDBModel: NeDBModel,
		List: List
	};
});
