const express = require('express');
const multer = require('multer')
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');

// Upload image
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const uploadPath = path.join('public', Book.imageBasePath);
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// Index and All books route
router.get('/', async (req, res) => {
    let query = Book.find({});

    if(req.query.title && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.publishedBefore && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if(req.query.publishedAfter && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }

    try {
        const books = await query.exec();

        res.render('books/index', ({
            books: books,
            searchedOptions: req.query
        }))
    }
    catch(err) {
        res.redirect('/')
    }
})

// New book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
})

// Create book route
router.post('/', upload.single('cover'), async (req, res) => {
    const filename = req.file != null ? req.file.filename : null;

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: filename,
        description: req.body.description
    })

    console.log(book)

    try {
        const newBook = await book.save();

        // res.redirect('books/' + newBook.id);
        res.redirect('books');
    }
    catch(err) {
        if(!book.coverImageName) {
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, true);

        console.log(err)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err);
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors,
            book
        }

        if(hasError) params.errorMessage = 'Creating Error';

        res.render('books/new', params);
    }
    catch(err) {
        res.redirect('books')
    }
}

module.exports = router;