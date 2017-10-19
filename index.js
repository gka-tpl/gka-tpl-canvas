var html = require("./lib/html");

function isSame(frames, key) {
    var sameSourceWarr = frames.filter(function(f){
        return f[key] === frames[0][key];
    });
    return (sameSourceWarr.length === frames.length? true: false);
}

module.exports = function (data, opts, tool) {
    var prefix = opts.prefix,
        frameduration = opts.frameduration * 1000;

    var frames = data.frames;

    var isSameSourceW = isSame(frames, "sourceW");
    var isSameSourceH = isSame(frames, "sourceH");
    var isSameWidth = isSame(frames, "width");
    var isSameHeight = isSame(frames, "height");
    
    console.log(isSameSourceW,isSameSourceH)

    isSameWidth && (data["width"] = frames[0].width);
    isSameHeight && (data["height"] = frames[0].height);
    isSameSourceW && (data["sourceW"] = frames[0].sourceW);
    isSameSourceH && (data["sourceH"] = frames[0].sourceH);
    
    data.frames = frames.map(function(frame){
        var res = {
            "x": frame.x,
            "y": frame.y,
            "offX": frame.offX,
            "offY": frame.offY,
            "file": frame.file,
            "w": frame.w,
            "h": frame.h
        };

        !isSameWidth && (res["width"] = frame.width);
        !isSameHeight && (res["height"] = frame.height);
        !isSameSourceW && (res["sourceW"] = frame.sourceW);
        !isSameSourceH && (res["sourceW"] = frame.sourceH);

        return res;
    });

    var names = tool.getNames();
    
    tool.writeFile("data.js", `var data = ${JSON.stringify(data, null, '    ')}`);
    tool.writeFile("gka.html", html(data, names, prefix, frameduration));
};

