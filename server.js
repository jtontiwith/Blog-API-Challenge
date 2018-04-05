//just boiler plate stuff here the calls in (i.e. "requires") express, morgan <-the
//logging middleware, body-parser <-a middleware that parses incoming json from the 
//client, and express router which I believe allow me to modularize with express router
const express = require('express');
const morgan = require('morgan');
//I took out Router and body-parser b/c it appears they sit in the modularized routes
const app = express();
const blogPostRouter = require('./blogPostRouter')



// log the http layer
app.use(morgan('common'));

app.use('/blog-posts', blogPostRouter);


app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });
  