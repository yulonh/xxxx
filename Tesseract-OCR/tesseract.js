var fs = require('fs');
var spawn = require('child_process').spawn;

var cmd = __dirname + '/tesseract.exe';
var imgPath = __dirname + '/code.png';

function saveBase64Image(base64, path) {
    base64 = base64.replace(/^data:image\/\w+;base64,/, "")
    var bitmap = new Buffer(base64, 'base64');
    fs.writeFileSync(path, bitmap);
}


exports.getTextFromBase64 = function(base64, callback) {

    saveBase64Image(base64, imgPath);

    var tesseract = spawn(cmd, [imgPath, 'out', '-l eng', '-psm 7', 'digits']);
    tesseract.stdout.setEncoding('utf8');
    tesseract.stdout.on('end', function(data) {
        callback && callback();
    });

    tesseract.on('error', function(e) {
        console.log(e);
    });

}

exports.dirname = __dirname;