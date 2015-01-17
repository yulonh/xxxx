var fs = require('fs');
var spawn = require('child_process').spawn;

var cmd = __dirname + '/tesseract.exe';
var imgPath = __dirname + '/code.png';

function image2base64(img) {

}

function saveBase64Image(base64, path) {
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(path, bitmap);
}


exports.getTextFromBase64 = function(base64) {
    saveBase64Image(base64, imgPath);

    var tesseract = spawn(cmd, [imgPath, 'out', '-l eng']);
    tesseract.stdout.setEncoding('utf8');
    tesseract.stdout.on('end', function(data) {
        console.log('tesseract data:', data);
    });
    tesseract.stdout.on('end', function(data) {
        console.log('tesseract end:', data);
    });

    tesseract.on('error', function(e) {
        console.log(e);
    });

}