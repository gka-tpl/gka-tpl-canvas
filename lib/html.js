var pkg = require("../package.json");
var gkaUtils = require('gka-utils');

module.exports = function html(data, opts, dataName) {

    var prefix = opts.prefix,
        isDiff = opts.diff,
        frameduration = opts.frameduration,
        names = JSON.stringify(gkaUtils.data.getImageNames(data)),
        width = data.frames[0].sourceW,
        height = data.frames[0].sourceH,
        html = gkaUtils.html.getHtmlWrap(opts.gkaVersion, pkg.name, pkg.version);

    var diffjs = (function(){
        if (isDiff) {
            return `
            if (i === 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
`
        } else {
           return `
            ctx.clearRect(0, 0, canvas.width, canvas.height);
` 
        }
    })()

    html.includeBodyContent(`
    <canvas id="gka" width="${width}" height="${height}"></canvas>
    <script src="./${dataName}"></script>
    <script>
    ${gkaUtils.html.getPreloadImageScript('    ')}
    preloadImage(${names}, function(imgs) {
       var canvas = document.getElementById('gka'),
            ctx = canvas.getContext('2d'),

            frames = data.frames,
            len = frames.length,
            i = 0,
            o = {};

        var cacheCanvas = document.createElement("canvas"),
            ctxCache = cacheCanvas.getContext("2d");

        cacheCanvas.width = canvas.width;
        cacheCanvas.height = canvas.height;

        setInterval(function(){
            o = frames[i];
            ctxCache.clearRect(0, 0, canvas.width, canvas.height);
            o = Object.prototype.toString.call(o)=='[object Array]'? o: [o];
            for (var j = 0, t; j < o.length; j++) {
                t = o[j];
                ctxCache.drawImage((imgs[t.file] || imgs[data.file]), (t.x || data.x || 0), (t.y || data.y || 0), (t.width || data.width), (t.height || data.height), (t.offX || data.offX || 0), (t.offY || data.offY || 0), (t.width || data.width), (t.height || data.height));
            }
            ${diffjs}
            ctx.drawImage(cacheCanvas, 0, 0, canvas.width, canvas.height);
            i = ++i === len? 0: i;
        }, ${frameduration * 1000})
    }, "img/")
    </script>`);

    return html + '';
}
