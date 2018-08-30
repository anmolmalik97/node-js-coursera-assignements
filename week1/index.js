const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dishRouter = require('./dishRouter');
const promoRouter = require('./promoRouter');
const leaderRouter = require('./leaderRouter');

app.use(bodyParser.json());



app.use('/dishes',dishRouter);
app.use('/Promotions',promoRouter);
app.use('/leaders',leaderRouter);


const port = 3000;
const hostName = 'localhost';

app.listen(3000,(req,res) => {
	console.log(`server started at http://${hostName}:${port}/`)
});