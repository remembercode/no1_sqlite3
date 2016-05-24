var md5 = require('md5');
var fs = require("fs");
var sqlite3 = require('sql.js');

var method = NO1_DB.prototype;

function NO1_DB(path) {
	global.logger.trace('NO1_DB called');
	try {
		if (!path) {
			global.logger.error('NO1_DB.constructor check path failed');
			return false;
		}
		global.logger.trace('NO1_DB.constructor check path pass');
		this._path = path;
		this._id = md5((new Buffer(path)).toString('base64'));
		global.logger.trace('NO1_DB.constructor generate this._id is' + this._id);
		if (!this._id) {
			global.logger.error('NO1_DB.constructor generate this._id is' + null + ', failed');
			return false;
		}
		global.logger.trace('NO1_DB.constructor check this._id pass');
		if (!!this._mem) {
			global.logger.error('NO1_DB.constructor db already opened in mem, return this');
			return this;
		}
		if (fs.existsSync(path)) {
			global.logger.trace('NO1_DB.constructor db exist on disk, read it to mem');
			var readbuffer = fs.readFileSync(path);
			if (!readbuffer) {
				global.logger.error('NO1_DB.constructor db exist on disk, but read to readbuffer failed');
				return false;
			}
			global.logger.trace('NO1_DB.constructor db exist on disk, read to readbuffer succeed');
			this._mem = new sqlite3.Database(readbuffer);
			if (!this._mem) {
				global.logger.error('NO1_DB.constructor db exist on disk, but create sqlite3.NO1_DB from readbuffer failed');
				return false;
			}
			global.logger.trace('NO1_DB.constructor db exist on disk, create sqlite3.NO1_DB from readbuffer succeed');
			readbuffer = null;
			global.logger.trace('NO1_DB.constructor release readbuffer link');
			global.logger.trace('NO1_DB.constructor succeed');
			return this;
		}
		global.logger.trace('NO1_DB.constructor db do not exist on disk, create it to mem');
		this._mem = new sqlite3.Database();
		if (!this._mem) {
			global.logger.error('NO1_DB.constructor create empty mem db failed');
			return false;
		}
		global.logger.trace('NO1_DB.constructor create empty mem db succeed');
		var data = this._mem.export();
		if (!data) {
			global.logger.error('NO1_DB.constructor this._mem export failed');
			return false;
		}
		global.logger.trace('NO1_DB.constructor this._mem export succeed');
		var buffer = new Buffer(data);
		if (!buffer) {
			global.logger.error('NO1_DB.constructor convert data to Buffer failed');
			return false;
		}
		global.logger.trace('NO1_DB.constructor convert data to Buffer succeed');
		fs.writeFileSync(path, buffer);
		if (!fs.existsSync(path)) {
			global.logger.error('NO1_DB.constructor write Buffer to disk failed');
		}
		global.logger.trace('NO1_DB.constructor write Buffer to disk succeed');
		buffer = null;
		global.logger.trace('NO1_DB.constructor release write Buffer buffer link');
		return this;
	} catch (e) {
		global.logger.error(e);
	}
}

method.path = function () {
	return this._path;
};
method.id = function () {
	return this._id;
};

module.exports = NO1_DB;