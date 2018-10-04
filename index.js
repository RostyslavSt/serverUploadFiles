let express = require('express');
let app = express();
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');
let bodyParser = require('body-parser');
const uniqid = require('uniqid');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let arrWithFilesURL = [];


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

app.get('/test_post', function (req, res) {
    res.send('ok');
});

app.get('/test', function (req, res) {
    res.send('hello world');
});

app.delete('/fileName', function(req, res) {
    console.log(req.body);
    let path = req.body.url;
    let arrWithPathStrings = path.split('\\');
    let necessaryIndex = arrWithPathStrings.length - 1;
    let fileName = arrWithPathStrings[necessaryIndex];
    // res.send(path);
    fs.unlink(path, function(err) {
        if (err) {
            res.send(err.toString());
            console.log(err);
        }
        else {
            console.log('ok');
            res.send(`file - ${fileName} is deleted'`);
        }
    });
})

// app.use(express.static(path.join(__dirname, 'public')));




app.post('/upload', function (req, res) {

    // create an incoming form object
    let form = new formidable.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req);

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        // arrWithFilesURL = [];
        let fileObj = {};
        // console.log(file.size);
        fs.rename(file.path, path.join(form.uploadDir, file.name));
        // console.log(file);
        fileObj.name = file.name;
        fileObj.size = file.size;
        fileObj.path = file.path;
        fileObj.id = uniqid();
        arrWithFilesURL.push(fileObj);
       
    });

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '\\uploads\\' + file.name;
        // file.path = file.path.replace('\\', "/");
        // file.path = file.path.replace('\\', "/");
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.send(arrWithFilesURL);
        console.log(arrWithFilesURL);
        arrWithFilesURL = [];
       
    });

    
});

app.listen(3002, function (a) {
    console.log("Listening to port 3002");
});