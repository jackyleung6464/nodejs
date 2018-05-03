var mongoose 	= require('mongoose');
mongoose.connect('mongodb://localhost/test_server');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


var UserSchema = mongoose.Schema({
  	displayname:{ type: String },	
    username:  	{ type: String, unique: true },
    password:  	{ type: String},
    email:     	{ type: String, unique: true },
    level:     	{ type: String },
    create_at: 	{ type: Date, default: Date.now },
    update_at: 	{ type: Date, default: Date.now }
});

var UserModel = mongoose.model('User', UserSchema);
////--- insert
var user = new UserModel({ 
	displayname: 'Jacky',
	username:    'j',
	password:    '1',
	email:       'jackyleung64647@vtc.edu.hk',
	level:       'Teacher'
});


user.save(function (err, user) {
    if (err) {
    	return console.error(err);	
    }
    console.log('saved user');
  });
////----- end insert



// UserModel.find(function (err, users) {
// 	console.log('find all user')
// 	if (err) return console.error(err);
// 	console.log(users);
// })



// UserModel.find({ username: 'jackyleung64642' }, function(err,users){
// 	console.log('find user which is username == jackyleung64642')
// 	if (err) return console.error(err);
//   	console.log(users);
//   	mongoose.connection.close()
// });


