const express = require('express');
const router = express.Router();
const Author = require('../models/author');

const Book = require('../models/book');

router.get('/', async (req, res) => {
    let searchedOptions = {};

    if(req.query.name != null && req.query.name !== '') {
        searchedOptions.name = new RegExp(req.query.name, 'i');
    }

    try {
        const authors = await Author.find(searchedOptions); // Засунул await а так не запускался роут

        res.render('authors/index', { 
            authors: authors,
            searchedOptions: req.query
        });
    }
    catch(err) {
        res.redirect('/');
    }
})

router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// create route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save();

        res.redirect('authors/' + newAuthor._id);
    }
    catch (err) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        const books = await Book.find({author: author._id});

        res.render('authors/view', {
            author,
            books
        })
    } 
    catch(err) {
        res.redirect('authors');
    }
})

router.get('/:id/edit', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        res.render('authors/edit', {
            author
        })
    }
    catch(err) {
        res.redirect('authors')
    }
})

router.put('/:id', async (req, res) => {
    let author = await Author.findById(req.params.id);

    try {
        author.name = req.body.name;
        console.log(req.body.name)

        await author.save();

        res.redirect('/authors/' + req.params.id);
    }
    catch(err) {
        if(!author) {
            res.redirect('/');
        }
        else {
            res.render('authors/edit', {
                author,
                errorMessage: 'Error updating Author'
            })  
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author = await Author.findById(req.params.id);

    try {
        const books = await Book.find({ author: author._id});

        if(author && books.length > 0) {
            res.redirect(`/${req.params.id}`);
        }
        else {
            author.remove();

            res.redirect(`/authors`);
        }
    }
    catch(err) {
        res.render(`authors/view`, {
            author,
            errorMessage: 'Error deleting Author'
        }) 
    }
})

module.exports = router;