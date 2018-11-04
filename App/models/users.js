var mongoose = require("mongoose");
var Movie = require("./movies.js");


var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	moviesHistory: [Movie.schema],

});

var User = mongoose.model("User",userSchema);

module.exports = User;