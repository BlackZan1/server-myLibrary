if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // не parse() и не load()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

let indexRouter = require('./routes/index');

app.set('view engine', 'ejs'); // расширение файла которое будет искать экспресс
app.set('views', __dirname + '/views'); // расположение views компонента
app.set('layout', 'layouts/layout'); // расположение layout компонентов и сам файл layout

app.use(expressLayouts);
app.use(express.static('public'));

app.use('/', indexRouter);

async function startServer() {
    console.log(process.env.DATABASE_URL, process.env.PORT)

    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true
        });

        app.listen(process.env.PORT || 3036, () => {
            console.log('Server is running');
        });
    }
    catch(err) {
        console.log(err);
    }
}

startServer();
