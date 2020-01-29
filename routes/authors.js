const express = require('express');
const router = express.Router();
const Author = require('../models/author');

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

        // res.redirect('authors/' + newAuthor.id)
        res.redirect('authors')
    }

    catch (err) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router;