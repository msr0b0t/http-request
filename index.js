const request = require('request');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.connect('mongodb://localhost:27017/http-request-db');

const Article = require('./models/article');

const doi = 'https://api.crossref.org/works/10.1017/cbo9781139058605.030';

function getArticle(doi) {
	return new bluebird((resolve, reject) => {
		request(doi, {json: true}, (err, res, body) => {
			if (err) {
				return reject(err);
			}
			const jsonstring = JSON.stringify(body);
			Article.create({doiString: doi, rawData: jsonstring}).then(articleObject => {
				return resolve(articleObject);
			}).catch(err => {
				return reject(err);
			});
		});
	});
}
exports.getArticle = getArticle;

// getArticle(doi).then(res => {
// 	console.log(res);
// }).catch(e => {
// 	console.log(e);
// });
