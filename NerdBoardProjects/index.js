var http = require('http');
var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var app = express();
var server = http.Server(app);
var db = mongoose.connection;

var userSchema = mongoose.Schema({
    type: String,
    userID: String,
    password: String
});
var User = mongoose.model('User', userSchema);



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

app.get('/signUp', function (req, res) {
    res.sendFile(__dirname + "/public/HTML/signUp.html");
});