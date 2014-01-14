/**
 *
 *  @overview
 *  @author Daniel Goberitz <dalgo86@gmail.com>
 *
 */

var
	// privates
	path = require('path'),
	fs = require('fs'),

	// paths
	specPath = path.resolve(__dirname + '/specs'),
	appPath = path.resolve(__dirname + '/../src'),
	// other exports

	specs = listDir(specPath, 'js'),
	sources = listDir(appPath, 'js')
;
function listDir(path, ext){
	var dirList = fs.readdirSync(path);
		rList = [],
		i
	;
	dirList.forEach(function(item){
		var stat = fs.statSync(path + '/' + item);
		if(stat.isDirectory()){
			rList.concat(listDir(path + '/' + item));
		}else if(!ext || (item.substring(item.length - ext.length) === ext)){
			rList.push(path + '/' + item);
		}
	});

	rList.sort();
	return rList;
}



module.exports = /** @lends Info */{
	path: {
		app: appPath,
		specs: specPath
	},

	sources: sources,
	specs: specs
};
