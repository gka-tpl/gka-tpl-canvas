module.exports = function html(data, prefix, frameduration) {
    var frames = data.frames,
        keys = Object.keys(frames);

    var frame = frames[keys[0]],
        width = data.sourceW? data.sourceW: frame.sourceW,
        height = data.sourceH? data.sourceH: frame.sourceH;

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
    var img = new Image();

    img.onload = function() {
        var canvas = document.getElementById('gkaStage'),
            ctx = canvas.getContext('2d'),

            frames = data.frames,
            len = frames.length,
            i = 0,
            o = {};

        setInterval(function(){
            o = frames[i];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, o.x, o.y, o.width, o.height, o.offX, o.offY, o.width, o.height);
            i = ++i === len? 0: i;
        }, ${frameduration})
    };

    img.src = "img/" + data.file;
    </script>
</body>
</html>
`;

return str;
}