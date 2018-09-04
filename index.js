var express = require('express');
// var multer = require('multer');
// var bodyParser = require('body-parser');
var path = require('path');
var upload = require('express-fileupload');
var app = express();

app.use(upload()); // configure middleware

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/test', function (req, res) {
    res.send('hello world');
});

app.post('/upload', function (req, res) {
    console.log(req.files);
    console.log(req.form);
    if (req.files.upfile) {
        var file = req.files.upfile,
            name = file.name,
            type = file.mimetype;
        var uploadpath = __dirname + '/uploads/' + name;
        file.mv(uploadpath, function (err) {
            if (err) {
                console.log("File Upload Failed", name, err);
                res.send("Error Occured!")
            } else {
                console.log("File Uploaded", name);
                res.send('Done! Uploading files')
            }
        });
    } else {
        res.send("No File selected !");
        res.end();
    };
});

app.listen(3002, function (a) {
    console.log("Listening to port 3002");
});