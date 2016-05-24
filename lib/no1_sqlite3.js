var sql_builder = require('sql');
var sqlite3 = require('sql.js');
var fs = require("fs");
var md5 = require('md5');
var db_mem = {};

var path = require('path');
var app_dir = path.dirname(process.mainModule.filename);
var log_file = path.join(app_dir, "no1_sqlite3.log");
var log4js = require('log4js');
log4js.configure({
	appenders: [
		{ type: 'console' },
		{
			type: 'file',
			absolute: true,
			filename: log_file,
			"maxLogSize": 20480,
			"backups": 3,
			category: 'no1_sqlite3'
		}
	],
	replaceConsole: true
});
var logger = log4js.getLogger('no1_sqlite3');
logger.setLevel('trace');

var database = function (path) {
	try {
		if (!isInputValid(path))
			return false;
		var db_id = convertPath2Id(path);
		if (!isInputValid(db_id))
			return false;
		if (isDbOpened(db_id))
			return db_id;
		if (isDbFileExist(path))
			return readDbFileFromDisk2Mem(path);
		var db_created_id = createMemDbSync(path);
		if (db_id != db_created_id)
			return false;
		var db_saved_id = saveMemDb2DiskFile(db_id, path);
		if (!isInputValid(db_saved_id))
			return false;
		return db_id;
	} catch (e) {
		throw e;
	}
}

database.save = function () { }

///////////////////////////////////////////////

function isInputValid(input) {
	return !!input;
}

function convertPath2Id(input) {
	try {
		if (!isInputValid(input))
			return false;
		return md5((new Buffer(input)).toString('base64'));
	} catch (e) {
		throw e;
	}
}

function isDbOpened(id) {
	try {
		if (!isInputValid(id))
			return false;
		return !!db_mem[id];
	} catch (e) {
		throw e;
	}
}

function isDbFileExist(path) {
	try {
		if (!isInputValid(path))
			return false;
		return fs.existsSync(path);
	} catch (e) {
		throw e;
	}
}

function readDbFileFromDisk2Mem(path) {
	try {
		if (!isInputValid(path))
			return false;
		var db_id = convertPath2Id(path);
		if (!isInputValid(db_id))
			return false;
		if (!isDbFileExist(path))
			return false;
		if (isDbOpened(db_id))
			return db_id;
		var filebuffer = fs.readFileSync(path);
		if (!isInputValid(filebuffer))
			return false;
		db_mem[db_id] = new sqlite3.Database(filebuffer);
		if (!isInputValid(db_mem[db_id]))
			return false;
		filebuffer = null;
		return db_id;
	} catch (e) {
		throw e;
	}
}

function createMemDbSync(path) {
	try {
		if (!isInputValid(path))
			return false;
		var db_id = convertPath2Id(path);
		if (!isInputValid(db_id))
			return false;
		if (isDbFileExist(path))
			return readDbFileFromDisk2Mem(path);
		if (isDbOpened(db_id))
			return db_id;
		db_mem[db_id] = new sqlite3.Database();
		if (!isInputValid(db_mem[db_id]))
			return false;
		return db_id;
	} catch (e) {
		throw e;
	}
}

function saveMemDb2DiskFile(id, path) {
	try {
		if (!isInputValid(id))
			return false;
		if (!isInputValid(path))
			return false;
		var db_id = convertPath2Id(path);
		if (!isInputValid(db_id))
			return false;
		if (id != db_id)
			return false;
		if (isDbFileExist(path))
			return false;
		if (!isDbOpened(db_id))
			return false;
		var data = db_mem[db_id].export();
		var buffer = new Buffer(data);
		fs.writeFileSync(path, buffer);
		buffer = null;
		logger.debug("isDbFileExist(path) = " + isDbFileExist(path));
		if (!isDbFileExist(path))
			return false;
		return db_id;
	} catch (e) {
		throw e;
	}
}
///////////////////////////////////////////////

exports.db = database;