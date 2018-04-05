//so when you modularize the routes the requiring of express and the middlewares
//like Router, body-parser, etc. are shifted to the individual routes

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./models');

BlogPosts.create(
    'Walden', 'I learned this, at least, by my experiment: that if one advances confidently in the direction of his dreams, and endeavors to live the life which he has imagined, he will meet with a success unexpected in common hours.” “Rather than love, than money, than fame, give me truth.', 'Henry David Thoreau'
);
BlogPosts.create(
    'Crime and Punishment', 'To go wrong in one\'s own way is better than to go right in someone else\'s.', 'Fyodor Dostoyevsky'
);


router.get('/', (req, res) => {
    res.json(BlogPosts.get());
  });


router.post('/', jsonParser, (req, res) => {
    //make sure title, content, and author are in the request body
    const requiredFields = ['title', 'content', 'author'];
    for(let i = 0; i < requiredFields; i++) {
        if(!(requiredFields[i] in req.body)) {
            const message = `Missing ${message} in the request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const bookBlog = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(bookBlog);
});


router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post: ${req.params.id}`);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
        if(!(requiredFields[i] in req.body)) {
            const message = `You are missing ${requiredFields[i]} in the request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if(req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedBlog = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
})


module.exports = router;