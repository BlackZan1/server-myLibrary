const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// authorSchema.pre('remove', function(next) {
//     Book.find({ author: this._id }, (err, books) => {
//         console.log(books)

//         if(err) {
//             next(err);
//         }
//         else if(books.length) {
//             next(new Error('This author has books!'));
//         } 
//         else {
//             next();
//         }
//     })
// })

module.exports = mongoose.model('Author', authorSchema);