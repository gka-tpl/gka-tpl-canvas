var html = require("./lib/html");

module.exports = function (data, opts, tool) {
    var prefix = opts.prefix,
        frameduration = opts.frameduration * 1000;

    tool.writeFile("data.js", `var data = ${JSON.stringify(data, null, '    ')}`);
    tool.writeFile("gka.html", html(data, prefix, frameduration));
};

