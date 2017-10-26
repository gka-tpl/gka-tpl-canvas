
function isSame(frames, key) {
    var same = frames.filter(function(f){
        return f[key] === frames[0][key];
    });
    return (same.length === frames.length? true: false);
}

/**
 * data 为传入数据
 * delKeys {array} 制定frame中哪些字段去除
 */
function formateData(data, delKeys) {
    var frames = data.frames,
        frame = frames[0];

    var sKeys = [];
    var _data = {};

    for (var i = 0, fKeys = Object.keys(frame); i < fKeys.length; i++) {
        var key = fKeys[i];
        if(isSame(frames, key)) {
            sKeys.push(key);
            _data[key] = frames[0][key]
        }
    }

    _data['frames'] = frames.map(function(frame){
        var f = {};
        for(var k in frame) {
            if(sKeys.indexOf(k) === -1 && (delKeys? delKeys.indexOf(k) === -1:  true)) {
                f[k] = frame[k];
            }
        }
        return f;
    })

    return _data;
}

module.exports = {
    formateData: formateData
}
    