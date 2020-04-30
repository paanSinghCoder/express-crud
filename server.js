let express = require('express');
let app = express();
let logger = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let PORT = process.env.PORT || 4000;

let productRoutes = require('./api/routes/products');
let userRoutes = require('./api/routes/user');

//db connect cluster: credit-card, email:gaurav3017@gmail.com
mongoose.connect(process.env.DEF_MONGO_ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

//Middlewares
app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //extracts json from body
//handling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/user', userRoutes);

//404 and 500 error handle
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => {
    console.info(`Server has started on port ${PORT}`);
});
