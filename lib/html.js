module.exports = function html(data, names, opts) {
    var prefix = opts.prefix,
        frameduration = opts.frameduration * 1000,
        isDiff = opts.diff;

    var frames = data.frames,
        keys = Object.keys(frames);

    var frame = frames[keys[0]],
        width = data.sourceW? data.sourceW: frame.sourceW,
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

        setInterval(function(){
            o = frames[i];
            ${diffjs}
            ctx.drawImage((imgs[o.file] || imgs[data.file]), (o.x || data.x || 0), (o.y || data.y || 0), (o.width || data.width), (o.height || data.height), (o.offX || data.offX || 0), (o.offY || data.offY || 0), (o.width || data.width), (o.height || data.height));
            i = ++i === len? 0: i;
        }, ${frameduration})
    }, "img/")
    </script>
</body>
</html>
`;

return str;
}