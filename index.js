const mongoose = require("mongoose");
const got = require("got");
const Article = require("./models/article");

const mongooseOptions = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	reconnectTries: 30,
	reconnectInterval: 500,
	poolSize: 100,
	keepAlive: true,
	keepAliveInitialDelay: 300000,
	useUnifiedTopology: true,
};
mongoose.connect("mongodb://localhost:27017/http-request-db", mongooseOptions).catch((error) => console.error(error.message));

async function getArticle(doi) {
	const { body } = await got(doi, { json: true });
	const articleObject = await Article.create({ doiString: doi, rawData: JSON.stringify(body) });
	return articleObject;
}
exports.getArticle = getArticle;

// getArticle("https://api.crossref.org/works/10.1017/cbo9781139058605.030")
// 	.then(console.log)
// 	.then(mongoose.disconnect)
// 	.then(() => process.exit(0))
// 	.catch(console.error);
