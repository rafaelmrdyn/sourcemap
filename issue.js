var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var StackTrace = require('stacktrace-js');
var StackTraceGPS = require('stacktrace-gps');
var StackFrame = require('stackframe');
var server = http.createServer(app);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var gps = new StackTraceGPS();

// Pinpoint actual function name and source-mapped location
// var stackframe = new StackFrame({
//     fileName: 'http://192.168.1.11/ui/main.js',
//     lineNumber: 3263,
//     columnNumber: 41
// });
// gps.pinpoint(stackframe).then(res => {
//     console.log('res', res);
// }).catch(err => {
//     console.log('err', err)
// });

var sourceNames = (name) => {
    return '/ui/' + name + '.js';
}

app.post('/source-map', function (req, res) {
    if (!req.body.fileName || !req.body.lineNumber || !req.body.columnNumber) {
        res.json({
            status: 'failed',
            message: 'fileName, lineNumber and columnNumber are required'
        });
        return;
    }
    req.body.fileName = sourceNames(req.body.fileName);
    var stackframe = new StackFrame(req.body);
    gps.pinpoint(stackframe).then(source => {
        console.log(req.body, source);
        res.json({
            status: 'success',
            source: source
        });
    }).catch(err => {
        console.log('err', err);
        res.json({
            status: 'failed',
            source: err
        });
    });
});

server.listen(3000, function () {
    console.log('listening on *:3000');
});