module.exports = function html(data, prefix, frameduration) {
    var frames = data.frames,
        keys = Object.keys(frames);

    var frame = frames[keys[0]],
        width = frame.sourceW,
        height = frame.sourceH;

var  str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>gka-animation-preview</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,maximum-scale=1">
</head>
<body>
    <canvas id="gkaStage" width="${width}" height="${height}"></canvas>

    <script src="./data.js"></script>
    <script>
    var img = new Image();

    img.onload = function() {
        var canvas = document.getElementById('gkaStage'),
            ctx = canvas.getContext('2d'),

            frames = data.frames,
            keys = Object.keys(frames),
            len = keys.length,

            i = 0,
            o = {};

        setInterval(function(){
            o = frames[keys[i]];
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