
class Db_schema  {
	constructor(){
		this.mongoose = require('mongoose');
		this.mongoose.connect('mongodb://localhost/test_server');
		this.db = this.mongoose.connection;
		this.connect();
		this.init_schema();
	}

	connect(){
		this.db.on('error', console.error.bind(console, 'connection error:'));
		this.db.once('open', function() {
		  console.log('get db connection success');
		});
	}

	disconnect(){
		this.mongoose.connection.close()
	}

	init_schema(){
		this.UserSchema = this.mongoose.Schema({
		  	displayname:{ type: String },	
		    username:  	{ type: String, unique: true },
		    password:  	{ type: String},
		    email:     	{ type: String, unique: true },
		    level:     	{ type: String },
		    create_at: 	{ type: Date, default: Date.now },
		    update_at: 	{ type: Date, default: Date.now }
		});
		this.MessageSchema = this.mongoose.Schema({
			_id				:{ type: String },
			message_type	:{ type: String },
			content			:{ type: String },
			username		:{ type: String },
			room			:{ type: String },
			create_at		:{ type: Date, default: Date.now },
		    update_at		:{ type: Date, default: Date.now }
		});

		this.init_model();
	}
	init_model(){
		this.UserModel = this.mongoose.model('User', this.UserSchema);
		this.MessageModel = this.mongoose.model('Message', this.MessageSchema);
	}
	//----- getter
	
	//--- end getter
}

module.exports = Db_schema;