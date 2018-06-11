/* eslint-env node, mocha */
const assert = require('assert');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const article = require('..');

mongoose.connect('mongodb://localhost:27017/http-request-db');

const Article = require('../models/article');

describe('getArticle', () => {
	before(done => {
		Article.remove({}).exec().then(() => {
			done();
		});
	});
	after(() => {
		mongoose.connection.close();
		process.exit(0);
	});
	it('should push doi to db', done => {
		const url = 'https://api.crossref.org/works/10.1017/cbo9781139058605.030';
		article.getArticle(url).then(result => {
			assert.notEqual(result._id, undefined, 'Result id should not be undefined');
			done();
		});
	}).timeout(10000);
	it('should push two dois to db', done => {
		const url1 = 'https://api.crossref.org/works/10.1017/cbo9781139058605.030';
		const url2 = 'https://api.crossref.org/journals/1549-7712';
		const promise1 = article.getArticle(url1);
		const promise2 = article.getArticle(url2);
		bluebird.all([promise1, promise2]).then(result => {
			const articleObject1 = result[0];
			const articleObject2 = result[1];
			assert.notEqual([articleObject1._id, articleObject2._id], [undefined, undefined], 'Result ids should not be undefined');
			done();
		});
	}).timeout(15000);
});
