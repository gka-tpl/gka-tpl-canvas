var html = require("./lib/html");
var utils = require("./lib/utils");

module.exports = function (data, opts, tool, cb) {

    var names = utils.getFileNames(data);
    var _data = utils.formateData(data, ['name']);

    tool.writeFile("data.js", `var data = ${JSON.stringify(_data, null, '    ')}`, function() {
        tool.writeFile("gka.html", html(_data, JSON.stringify(names), opts), function() {
            cb && cb();
        });
    });
};

