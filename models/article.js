const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
	doiString: { type: String },
	rawData: { type: String },
});

module.exports = mongoose.model("Article", articleSchema);
