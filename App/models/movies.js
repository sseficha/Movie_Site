var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
	id: Number,
	downloads: Number,
	title: String,
	year: Number,
	rating: Number,
	genres: [String],
	description: String,
	image_ref: String,
	torrent_size: String,
	torrent_url: String
});

var Movie = mongoose.model("Movie",movieSchema);

module.exports = Movie;