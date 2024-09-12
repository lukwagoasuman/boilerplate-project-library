const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(10000);


  let bookId;

  suite('POST /api/books', function () {
    test('Create a book with title', function (done) {
      chai.request(server)
        .post('/api/books')
        .send({ title: 'Test Book' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          bookId = res.body._id;
          done();
        });
    });

    test('Create book without title', function (done) {
      chai.request(server)
        .post('/api/books')
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
        });
    });
  });

  suite('GET /api/books', function () {
    test('Retrieve all books', function (done) {
      chai.request(server)
        .get('/api/books')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });

  suite('GET /api/books/:id', function () {
    test('Retrieve book with invalid id', function (done) {
      chai.request(server)
        .get('/api/books/invalidid')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
    });

    test('Retrieve book with valid id', function (done) {
      chai.request(server)
        .get(`/api/books/${bookId}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          done();
        });
    });
  });

  suite('POST /api/books/:id', function () {
    test('Add comment to book', function (done) {
      chai.request(server)
        .post(`/api/books/${bookId}`)
        .send({ comment: 'Great book!' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'comments');
          done();
        });
    });

    test('Add comment without providing comment', function (done) {
      chai.request(server)
        .post(`/api/books/${bookId}`)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
    });
  });

  suite('DELETE /api/books/:id', function () {
    test('Delete a book with valid id', function (done) {
      chai.request(server)
        .delete(`/api/books/${bookId}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
    });

    test('Delete a book with invalid id', function (done) {
      chai.request(server)
        .delete('/api/books/invalidid')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
    });
  });

  suite('DELETE /api/books', function () {
    test('Delete all books', function (done) {
      chai.request(server)
        .delete('/api/books')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'complete delete successful');
          done();
        });
    });
  });
});