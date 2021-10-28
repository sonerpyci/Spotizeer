const CONFIG = require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const { PassThrough } = require('stream')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const userAgent = require('express-useragent');
const models = require('./Models');
const swaggerOpts = require('./Utils/Swagger/swaggerUtils').getOptions(__dirname);
const Authenticator = require('./Middlewares/Authenticator');
const Interceptor = require('./Middlewares/Interceptor');

const app = express();
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger(swaggerOpts);

app.use(morgan('combined'))
app.use(userAgent.express());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));


app.use(Authenticator.initialize())
app.use(Interceptor.Intercept);


app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : __dirname + '/uploads/',
    debug:true,
    createParentPath : true
}));

app.use("/v1/oauth", require('./Routes/oauth'));
app.use("/v1/auth", require('./Routes/auth'));

const server =  require('http').createServer(app);

models.sequelize.authenticate()
    .then(() => {
        console.log("DB Connected.");
        models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true}).then((results) => {
            models.sequelize.sync({force:false, alter:true}).then(() => {
                models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', {raw: true}).then((results) => {
                    server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
                        console.log(`Running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`);
                    });
                });
            }).catch((err) => {
                console.error('Unable to connect to the database: ', err);
            });
        });
    })
    .catch(err => {
        console.error('Error: ', err);
    });