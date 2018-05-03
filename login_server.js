const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const request = require('request');
const FormData = require('form-data');


const Port_room = require('./class_room.js');
const HashMap = require('hashmap');
const db_connection = require('./db/db_connection.js');
const user_schema = require('./db/user_schema.js');
const userModel = db_connection.model('User', user_schema);


var room_count = 0;
var login_server_count = 0;
var room_list = [];
var room_map = new HashMap();


loop_port_room(8886,8887);


app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/html/login_server_v1.html');
});

//--- handle upload ppt
app.post('/upload_ppt', function(req, res){
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '/uploads/ppt');
    form.on('file', function(field, file) {
        let dest_path = path.join(form.uploadDir, file.name);
        fs.rename(file.path, dest_path);


        let cloudconvert = new (require('cloudconvert'))('p3w4P9HhhgzN8wmWz5S3BtF3j2Ygmav2GGlecpnEY3CigDxTnoSqvqEXG6bUEyWp');
        fs.createReadStream(dest_path)
        .pipe(cloudconvert.convert({
            "inputformat": "ppt",
            "outputformat": "jpg",
            "input": "upload"
        }))
        .on('error', function(err) {
            console.error('Failed: ' + err);
        }).on('finished', function(data) {
            console.log('Done: ' + data.message);
            this.downloadAll('uploads/ppt2jpg/'+file.name+'/');
        }).on('downloaded', function(destination) {
            console.log('Downloaded to: ' + destination.path);
        }).on('downloadedAll', function(path) {
            console.log('Downloaded all to: ' + path);
        });
    });
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    form.on('end', function() {
        res.end('success');
    });
    form.parse(req);
});

//----- end upload ppt



//-----------start socket.io

io.on('connection', (socket) => {
    login_server_count++;
    io.emit("wellcome_login_connection",'Wellcome Login Server');
    io.emit("login_server_count", login_server_count  );

    socket.on("get_room_list", () => {
        console.log('get_room_list');
        io.emit("getback_room_list", room_list);
    });


    socket.on('login',( username , password )=>{
        userModel.findOne({
                username:username,
                password:password
              }).select('_id').exec((err,result)=>{
                if (err){
                    return handleError(err);   
                }
                if(result){
                    console.log('login success: '+result._id);
                    socket.emit('login_token',result._id);
                }else{
                    console.log('login fail');
                }
              });
    });

    socket.on('disconnect', () => {
        login_server_count = (login_server_count < 0) ? 0 : login_server_count-=1;
        io.emit("login_server_count", login_server_count);
    });
});

server.listen(8888, () => {
    console.log("Login Server Started. http://localhost:8888");
});


function loop_port_room(sp,ep){
	for (var i = sp; i <= ep; i++) {
		console.log('Port :'+ i + ' ready.');
		room_list.push(i);
		room_map.set(i,new Port_room(i,db_connection,userModel));
	};
}



