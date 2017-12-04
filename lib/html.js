module.exports = function html(data, names, opts) {
    var prefix = opts.prefix,
        frameduration = opts.frameduration * 1000,
        isDiff = opts.diff;

    var frame = data.frames[0];

    frame = Object.prototype.toString.call(frame)=='[object Array]'? frame[0]: frame;

    var width = data.sourceW? data.sourceW: frame.sourceW,
    height = data.sourceH? data.sourceH: frame.sourceH;

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

var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,maximum-scale=1">
    <title>gka-preview</title>
</head>
<body>
    <canvas id="gkaStage" width="${width}" height="${height}"></canvas>
    
    <div style="position: fixed; bottom: 10px;">
        Powered By <a target="_blank" href="https://github.com/gkajs/gka">gka</a> .
        Template By <a target="_blank" href="https://github.com/gkajs/gka-tpl-canvas">gka-tpl-canvas</a>
    </div>

    <script src="./data.js"></script>
    <script>
    var imgNames = ${names},
        imgs = {};

    function loadImage(names, cb, prefix){
        var n = 0;
        names.forEach(function(name) {
            var img = new Image();
            img.onload = function() {
                imgs[name] = img;
                (++n === names.length) && cb && cb();
            };
            img.src = (prefix || '') + name;
        });
    }

    loadImage(imgNames, function() {
        var canvas = document.getElementById('gkaStage'),
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
        }, ${frameduration})
    }, "img/")
    </script>
</body>
</html>
`;

return str;
}