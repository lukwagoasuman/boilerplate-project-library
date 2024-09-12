const mongoose = require('mongoose');


module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        const booksWithCommentCount = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        }));
        res.json(booksWithCommentCount);
      } catch (err) {
        res.status(500).send('Error retrieving books');
      }
    })
    
    .post(async function (req, res) {
      const title = req.body.title;
      if (!title) return res.send('missing required field title');
      
      try {
        const newBook = new Book({ title });
        const savedBook = await newBook.save();
        res.json({ _id: savedBook._id, title: savedBook.title });
      } catch (err) {
        res.status(500).send('Error saving the book');
      }
    })
    
    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('Error deleting all books');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .post(async function (req, res) {
      const comment = req.body.comment;
      if (!comment) return res.send('missing required field comment');

      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');

        book.comments.push(comment);
        const updatedBook = await book.save();
        res.json({ _id: updatedBook._id, title: updatedBook.title, comments: updatedBook.comments });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .delete(async function (req, res) {
      try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
};
