const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  	displayname:{ type: String },	
    username:  	{ type: String, unique: true },
    password:  	{ type: String},
    email:     	{ type: String, unique: true },
    level:     	{ type: String },
    create_at: 	{ type: Date, default: Date.now },
    update_at: 	{ type: Date, default: Date.now }
});