const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');

// Upload image
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
// const multer = require('multer');
// const uploadPath = path.join('public', Book.imageBasePath);
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

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

        res.render('books/index', {
            books,
            searchedOptions: req.query
        })
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
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })

    console.log(book)

    saveImageCover(book, req.body.cover);

    console.log(book)

    try {
        const newBook = await book.save();

        // res.redirect('books/' + newBook.id);
        res.redirect('books');
    }
    catch(err) {
        // if(!book.coverImageName) {
        //     removeBookCover(book.coverImageName);
        // }
        renderNewPage(res, book, true);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const author = await Author.findById(book.author);

        res.render('books/view', {
            book,
            author
        })
    }
    catch(err) {
        res.redirect('/books')
    }
})

router.get('/:id/edit', async (req, res) => {
    res.send('Hello')
})

router.put('/:id', async (req, res) => {
    res.send('Hello')
})

router.delete('/:id', async (req, res) => {
    res.send('Hello')
})

function saveImageCover(book, coverEncoded = null) {
    if(!coverEncoded) return;
    
    const cover = JSON.parse(coverEncoded);
    if(cover && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }   
}

// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if(err) console.error(err);
//     })
// }

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