/* eslint-env node, mocha */
const assert = require("assert");
const mongoose = require("mongoose");
const article = require("..");

// mongoose.connect is a side-effect of require('..'). No need to do it again

const Article = require("../models/article");

describe("getArticle", () => {
	before(async () => {
		await Article.deleteMany({}).exec();
	});

	after(async () => {
		await mongoose.disconnect();
		process.exit(0);
	});

	it("should push doi to db", async () => {
		const url = "https://api.crossref.org/works/10.1017/cbo9781139058605.030";
		const result = await article.getArticle(url);
		assert.notEqual(result._id, undefined, "Result id should not be undefined");
	}).timeout(10000);

	it("should push two dois to db", async () => {
		const url1 = "https://api.crossref.org/works/10.1017/cbo9781139058605.030";
		const url2 = "https://api.crossref.org/journals/1549-7712";
		const promise1 = article.getArticle(url1);
		const promise2 = article.getArticle(url2);
		const result = await Promise.all([promise1, promise2]);
		const articleObject1 = result[0];
		const articleObject2 = result[1];
		assert.notEqual([articleObject1._id, articleObject2._id], [undefined, undefined], "Result ids should not be undefined");
	}).timeout(15000);
});
