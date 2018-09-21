var fs = require('fs');
var path = require('path');

var Logger = exports.Logger = {};
var infoStream = fs.createWriteStream(__dirname + '/systemLogs/info.log');
var debugStream = fs.createWriteStream(__dirname + '/systemLogs/debug.log');
var errorStream = fs.createWriteStream(__dirname + '/systemLogs/error.log');

infoStream.on('error', (err) => {
    console.log("infoStream error: ", err)
})
debugStream.on('error', (err) => {
    console.log("debugStream error:", err)
})
errorStream.on('error', (err) => {
    console.log("errorStream error:", err)
})

Logger.info = function (key, msg) {
    var message = new Date().toISOString() + " - " + key + " : " + msg + "\n";
    infoStream.write(message);
};

Logger.debug = function (key, msg) {
    var message = new Date().toISOString() + " - " + key + " : " + msg + "\n";
    debugStream.write(message);
};

Logger.error = function (key, msg) {
    var message = new Date().toISOString() + " - " + key + " : " + msg + "\n";
    errorStream.write(message);
};

const writeLog = (_header, _data) => {
    let date = new Date();
    _data = '\n' + date.getDay() + "\\" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "=>" + _header + ':\n-----------------\n' + _data + '\n-----------------\n';
    fs.appendFile('./historyLogs.log', _data, function (err) {
        if (err) return console.error(err);
        console.log("Thành công");
    });
}