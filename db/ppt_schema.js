const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var childSchema = new Schema({ path: 	{ type: String } });

module.exports = new Schema({
  	filename: 	{ type: String },	
    password:  	{ type: String },
    owner_id:   { type: String },
    create_at: 	{ type: Date, default: Date.now },
    update_at: 	{ type: Date, default: Date.now },
    pptSlide:   [childSchema]
});