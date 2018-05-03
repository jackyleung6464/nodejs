const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
			message_type	:{ type: String , required: true},
			content			:{ type: String , required: true},
			username		:{ type: String },
			room			:{ type: String , required: true},
			create_at		:{ type: Date, default: Date.now },
		    update_at		:{ type: Date, default: Date.now }
		});