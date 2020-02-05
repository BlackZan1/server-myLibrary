if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // не parse() и не load(), a config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

let indexRouter = require('./routes/index');
let authorsRouter = require('./routes/authors');
let booksRouter = require('./routes/books');

// Config
app.set('view engine', 'ejs'); // расширение файла которое будет искать экспресс
app.set('views', __dirname + '/views'); // расположение views компонента
app.set('layout', 'layouts/layout'); // расположение layout компонентов и сам файл layout

// Layouts
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Routes
app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

// let db = mongoose.connection;

async function start() {
    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true, useUnifiedTopology: true
    });

    app.listen(process.env.PORT || 3036, () => {
        console.log('Server is running');
    });
}

start();
// db.on('error', (err) => console.log(err))
// db.on('open', () => console.log('Server is connected'))
