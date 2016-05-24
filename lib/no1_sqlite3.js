var md5 = require('md5');
//changelog: rewrite as http://stackoverflow.com/questions/18188083/javascript-oop-in-nodejs-how
var path = require('path');

var method = NO1_SQLITE3.prototype;

function NO1_SQLITE3(path) {
	global.logger.trace('NO1_SQLITE3 called');
	var Database = require("./no1_db.js");
	return new Database(path);
}

method.path = function () {
	return this._path;
};

module.exports = NO1_SQLITE3;

function convertpath2id(input) {
	try {
		if (!isinputvalid(input))
			return false;
		return md5((new buffer(input)).tostring('base64'));
	} catch (e) {
		throw e;
	}
}