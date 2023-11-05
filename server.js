const express = require('express');
const dbConnect = require('./src/configs/connectDB');
const app = express();
const dotenv = require('dotenv').config();
const swaggerUi = require('swagger-ui-express');;
const PORT = process.env.PORT || 8800;
const participantRouter = require('./src/routes/authRoute');
const bookRouter = require('./src/routes/bookRoute');
const meetRouter = require('./src/routes/meetRoute');
const reviewRouter = require('./src/routes/reviewRoute');

const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./src/middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
dbConnect()

// Use the JavaScript Swagger definition
const swaggerDefinition = require('./swagger.json');
// Serve Swagger UI at /docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));


app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use('/api/user', participantRouter);
app.use('/api/book', bookRouter);
app.use('/api/meet', meetRouter);
app.use('/api/review', reviewRouter);


app.use(notFound);
app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`);
})