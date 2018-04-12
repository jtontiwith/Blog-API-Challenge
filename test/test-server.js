const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
//the line above lets me uset the "expect" style syntax 
//so I can do stuff like `expect(1+1).to.equal(2)`

chai.use(chaiHttp); //lets me make http requests 

describe('Blog Post', function() {

  //we have to start the server right before the test and 
  //shut it down right afterwards    
  before(function() {
      return runServer();
  });

  after(function() {
      return closeServer();
  });

  it('should list blogposts on GET', function() {
      return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys(
            'id', 'title', 'author', 'content', 'publishDate'
          )
        });
      });
  });

  it('should add a blog post on POST', function() {
    const newBlog = {title: 'something', author: 'some name', content: 'some content'};
    return chai.request(app)
    .post('/blog-posts')
    .send(newBlog)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys(
        'id', 'title', 'author', 'content', 'publishDate');
      expect(res.body.id).to.not.equal(null);
      //expect(res.body).to.deep.equal(Object.assign(newBlog, {id: res.body.id}));
      
      });
    });

  it('should throw error if POST missing values', function() {
    const badBlogPost = {};
    return chai.request(app)
      .post('/blog-posts')
      .send(badBlogPost)
      .catch(function(res) { 
        expect(res).to.have.status(400);
      });
  });


});