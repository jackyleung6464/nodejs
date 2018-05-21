const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pptSlide_schema = require("./child/pptSlide_schema.js");

module.exports = new Schema({
  	filename: 	{ type: String },	
    password:  	{ type: String },
    owner_id:   { type: String },
    create_at: 	{ type: Date, default: Date.now },
    update_at: 	{ type: Date, default: Date.now },
    pptSlide:   [pptSlide_schema]
});