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
    try {
        let db = mongoose.connection;

        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true
        })

        app.listen(process.env.PORT || 3036, () => {
            console.log('Server is running...!')
        });

        db.on('error', (err) => console.log(err));
        db.once('open', () => console.log('Connected to DataBase'));
    }
    catch(e) {
        console.log('Can not connected to server')
    }
}

startServer();
