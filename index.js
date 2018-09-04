var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
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

// app.get('/',function(req,res){
//   res.sendFile(__dirname+'views/index.html');
// })

app.post('/upload', function (req, res) {
    console.log(req.files);
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    console.log(typeof (req.files.upfile));
    //   if typeof(req.files.upfile) === ara


    if (req.files.upfile) {
        let file = req.files.upfile;
        file.forEach(item => {
            // type = item.mimetype;
            let uploadpath = __dirname + '/uploads/' + item.name;
            item.mv(uploadpath, function (err) {
                if (err) {
                    console.log("File Upload Failed", item.name, err);
                    res.send("Error Occured!")
                    return;
                } else {
                    console.log("Files Uploaded", item.name);
                    // res.send('Done! Uploading files');
                    // return;
                }
            });
        });
        res.send('Done! Uploading files');
    } else {
        res.send("No File selected !");
        res.end();
    };
})





// app.use(bodyParser.json());

// var Storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "./uploads");
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     }
// });

// var upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

// app.post("/upload", function (req, res) {
//     console.log(req.body);
//     upload(req, res, function (err) {
//         // console.log(req.body);
//         if (err) {
//             return res.end("Something went wrong!");
//         }
//         return res.end("File uploaded sucessfully!.");
//     });
// });

app.listen(3002, function (a) {
    console.log("Listening to port 3002");
});