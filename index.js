var gkaUtils = require('gka-utils'),
    writeSync = gkaUtils.file.writeSync;
var html = require("./lib/html");

module.exports = function (data, opts, cb) {
    
    var dir = opts.imageDir;

    function run(data, opts, key) {
        var name = (key? key + '-' : '') + 'gka',
            dataName = name + '-data.js',
            htmlName = name + '.html';

		var _data = gkaUtils.data.formateData(data, ['name'], false);
		
        writeSync([dir, '..', dataName],  `var data = ${gkaUtils.data.fixArrayString(JSON.stringify(_data, null, '    '))}`);
        writeSync([dir, '..', htmlName], html(data, opts, dataName));
    }

    run(data, opts);

    // 对每个子目录都进行处理
    gkaUtils._.effectSubFolderSync(run, data, opts);

    cb && cb();
}
