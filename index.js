var html = require("./lib/html");
var utils = require("./lib/utils");

module.exports = function (data, opts, tool) {
    var prefix = opts.prefix,
        frameduration = opts.frameduration * 1000;

    var names = tool.getNames();
    var _data = utils.formateData(data, ['name']);

    tool.writeFile("data.js", `var data = ${JSON.stringify(_data, null, '    ')}`);
    tool.writeFile("gka.html", html(_data, names, prefix, frameduration));
};

