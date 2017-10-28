const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

describe('Blog Posts', function) {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('should list posts on GET', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			res.should.be.json;
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.forEach(function(item) {
				item.should.be.a('object');
				item.should.have.all.keys(
					'id', 'title', 'content', 'author')
			});
		});
	});

	it ('should add blog-post on POST', function() {
		newPost = {
			title: 'foo foo foo',
			content: 'bar bar bar',
			author: 'Christian Teller'
		};
		const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

		return chai.request(app)
			.post('/blog-posts')
			.send(newPost)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.title.should.equal(newPost.title);
				res.body.content.should.equal(newPost.content);
				res.body.author.should.equal(newPost.author);
			});
	});

	it ('should throw err if missing expectedKeys', function() {
		const missingData = {};
		return chai.request(app);
			.post('/blog-posts')
			.send(missingData)
			.catch(function(res) {
				res.should.have.status(400);
			});
	});

	it('should update post on PUT', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				const updatedPost = Object.assign(res.body[0], {
					title: 'foo foo foo',
					content: 'bar bar bar'
				});
				return chai.request(app)
					.put(`/blog-posts/${res.body[0].id}`)
					.send(updatedPost)
					.then(function(res) {
						res.should.have.status(204);
					});
			});
	});

	it('should delete post on DEL', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				.delete(`/blog-posts/${res.body[0].id}`)
				.then(function(res) {
					res.should.have.status(204);
				});
			});
	});
};