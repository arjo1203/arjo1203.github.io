var http = require('http');
var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var app = express();
var server = http.Server(app);
var db = mongoose.connection;

var userSchema = mongoose.Schema({
    userID: String,
    password: String
});
var User = mongoose.model('User', userSchema);

var NerdProjectSchema = mongoose.Schema({
    userID: String,
    projectName: String,
    settings: String,
    workSpace: String
});
var NerdProject = mongoose.model('NerdProject', NerdProjectSchema);



mongoose.connect('mongodb://localhost/test');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('Connected!');
});



server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server initialized!");
    console.log('Listening to http://', host, port);
});




app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/getUsers', function (req, res) {
    var users = [];
    User.find({}, function (err, doc) {
        users.push(doc);
        res.send('index', JSON.stringify(users));
    });
});

app.get('/getNerdProjects', function (req, res) {
    var projects = [];
    NerdProject.find({}, function (err, doc) {
        projects.push(doc);
        res.send('index', JSON.stringify(projects));
    });
});

app.get('/deleteUsers', function (req, res) {
    var users = [];
    User.find({}, function (err, doc) {
        users.push(doc);
        res.send('index', JSON.stringify(users));
    }).remove().exec();
});

app.post('/findUser', function (req, res) {
    var target = JSON.parse(req.body.data).userID;
    var users = [];
    var data = {};
    data.found = false;
    data.index = -1;
    User.find({}, function (err, doc) {
        users.push(doc);

        if(users) {
            for(var i = 0; i < users[0].length; i++) {
                if(target == users[0][i].userID) {
                    data.found = true;
                    data.index = i;
                    data.user = users[0][i];
                    console.log(target + ' found at index of ' + i +'!');
                    break;
                }
            }
        }

        res.send('findUser() called', JSON.stringify(data));
    });
});

app.post('/findNerdProject', function (req, res) {
    console.log(JSON.parse(req.body.data));
    var target = JSON.parse(req.body.data).projectName;
    var NerdProjects = [];
    var data = {};
    data.found = false;
    data.index = -1;
    NerdProject.find({}, function (err, doc) {
        NerdProjects.push(doc);
        console.log(NerdProjects);

        if(NerdProjects) {
            for(var i = 0; i < NerdProjects[0].length; i++) {
                if(target == NerdProjects[0][i].projectName) {
                    data.found = true;
                    data.index = i;
                    data.NerdSchema = NerdProjects[0][i];
                    console.log(target + ' found at index of ' + i +'!');
                    break;
                }
            }
        }

        res.send('findNerdProject() called', JSON.stringify(data));
    });
});

app.post('/saveUser', function (req, res) {
    var data = JSON.parse(req.body.data);

    var newUser = new User(data);

    newUser.save(function (err) {
        if (err) {
            return console.error(err);
        }
        else {
            console.log('New student created and saved!');
            console.log(data);
        }
        res.send('saveUser() Called.');
    });
});

app.post('/saveNerdProject', function (req, res) {
    var data = JSON.parse(req.body.data);

    var newNerdProject = new NerdProject(data);
    console.log(newNerdProject);

    newNerdProject.save(function (err) {
        if (err) {
            return console.error(err);
        }
        else {
            console.log('New NerdProject was created and saved!');
            console.log(data);
        }
        res.send('saveNerdProject() Called.');
    });
});

app.post('/updateNerdProject', function (req, res) {
    var data = JSON.parse(req.body.data);

    var newNerdProject = new NerdProject(data);
    console.log(newNerdProject);

    newNerdProject.save(function (err) {
        if (err) {
            return console.error(err);
        }
        else {
            console.log('New NerdProject was created and saved!');
            console.log(data);
        }
        res.send('saveNerdProject() Called.', true);
    });
});

app.get('/signUp', function (req, res) {
    res.sendFile(__dirname + "/public/HTML/signUp.html");
});

app.get('/NerdBoard', function (req, res) {
    res.sendFile(__dirname + "/public/HTML/NerdBoard.html");
});

app.get('/modifyNerdProject', function (req, res) {
    res.sendFile(__dirname + "/public/HTML/modifyNerdProject.html");
});