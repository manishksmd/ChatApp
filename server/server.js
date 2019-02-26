const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
var fs = require("fs");
var uniqid = require('uniqid');
var unique = require('array-unique');
var moment = require('moment');
var HashMap = require('hashmap');

users = [];
connections = [];
const app = express();

const port = 5000;
let counter = -1;
let msgIndex = 0;
// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);
var fileObj = [];
var chat = [];
var readArray = [];
var typingDetail = [];
var readUser = [];
var readReceiptArray = []
var readReceipt = [];
var map = new HashMap();

// This is what the socket.io syntax is like, we will work this later
io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);
    io.sockets.emit('ONLINE_USER', users)

    io.sockets.emit('NEW_MSG', chat)

    io.sockets.emit('FILE_DOWNLOAD', fileObj)
    //DISCONNET
    socket.on('disconnect', function (data) {
        if (!users.includes(socket.username)) {
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length);
            return;
        }
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
        updateusernames();
        console.log('Disconnected: %s sockets connected', connections.length, socket.username);
        var connectiondata = {}, disconnected = [];
        connectiondata.user = socket.username;
        connectiondata.msg = ' is disconnected';
        disconnected.push(connectiondata)
        io.sockets.emit('DISCONNECTED_USER', disconnected);
        if (connections.length <= 1) {
            chat = [];
            readReceipt = [];
            readArray = [];
            readUser = [];
            counter = -1;
            readReceiptArray = [];
        }
    });

    //New User
    socket.on('NEW_USER', function (data) {
        for (index = 0; index < users.length; index++) {
            if (users[index] == data.Name) {
                console.log("matched")
                io.sockets.emit('ALREADY_USER', { user: data.Name, msg: 'name is already taken' });
                return;
            }
        }
        socket.username = data.Name;
        users.push(socket.username);
        updateusernames();
    });

    //Update Username
    function updateusernames() {
        io.sockets.emit('GET_USER', users);
    }

    //Typing
    socket.on('TYPING', function () {
        var typingData = {}
        typingData.user = socket.username;
        typingData.msg = ' is typing...';
        typingDetail.push(typingData)
        io.sockets.emit('USER_TYPING', typingDetail);
        typingDetail = [];
    })

    //Send Message
    socket.on('SEND_MSG', function (data) {
      if(data.id > -1){
        objIndex = chat.findIndex((obj => obj.index == data.id));
        readReceipt = [];
        chat[objIndex].msg = data.msg;
      }
      else{
        var msgdata = {}
        msgdata.delivermsg = "";
        msgdata.user = socket.username;
        msgdata.msg = data.msg;
        msgdata.isFile = false;
        msgdata.time = moment().format('lll')
        counter = counter + 1;
        msgdata.index = counter;
        chat.push(msgdata);
        readReceipt = [];
      }
      //console.log(chat)
      io.sockets.emit('NEW_MSG', chat);
    });

    //File Upload
    socket.on('FILE_UPLOAD', function (data) {
        fs.writeFile('./uploads/' + data.user + "_" + data.fileName + uniqid() + "." + data.fileType, data.file, function (err) { });
        var filedata = {}
        filedata.user = socket.username;
        filedata.fileName = data.fileName;
        filedata.fileType = data.fileType;
        filedata.content = data.file;
        filedata.time = moment().format('lll');
        counter = counter + 1;
        filedata.index = counter;
        filedata.isFile = true;
        chat.push(filedata);
        var fileContent = {}
        fileContent.user = socket.username;
        fileContent.fileName = data.fileName;
        fileContent.fileType = data.fileType;
        fileContent.content = data.file;
        fileContent.isFile = true;
        fileContent.time = moment().format('lll')
        fileObj.push(fileContent);
        io.sockets.emit('NEW_MSG', chat)
        io.sockets.emit('FILE_DOWNLOAD', fileObj)
    })

    //Read Receipt
    socket.on('READ_RECEIPT', function (index, username) {
        var readReceiptObj = {}
        readReceipt.push(username)
        readReceiptObj.index = index;
        readReceiptObj.user = unique(readReceipt);
        map.set(index, readReceipt);
        readReceiptArray.push(map)
        io.sockets.emit("READ_USER", readReceiptArray);
         map.forEach(function (value, key) {
             console.log(key + " : " + value);
          });
    })

   
    //Delete message
    socket.on('DELETE', function (data) {
        chat.splice(data, 1);
        io.sockets.emit('NEW_MSG', chat)
    })


})

server.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`));