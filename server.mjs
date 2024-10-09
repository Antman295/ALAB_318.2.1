// Importing express
import express from 'express';
import userRoutes from ''

// Initializing epxress into a variable
const app = express();
const PORT = 3000;

app.set('views', './views');
app.set('view engine', 'cat');

// Middleware
const logReq = function (req, res, next) {
    console.log('Request Received');
    next();
  };
  
  app.use(logReq);
  app.use((err, req, res, next) => {
    res.status(400).send(err.message);
  });


// Routes
app.get('/', (req, res) => {
    let options = {
      name: 'My App',
      content: 'Holy Cow this is magic',
      lorem: `lorem ipsum something, another thing i wanted to get a lot of text but its not working, Toooo bad`,
      img: 'https://m.media-amazon.com/images/I/619HhG5MELL.__AC_SX300_SY300_QL70_FMwebp_.jpg',
    };
  
    res.render('template', options);
  });
  
  app.get('/new/:title/:content/:lorem', (req, res) => {
  
      //this replicates going to db
    let options = {
      title: req.params.title,
      content: req.params.content,
      lorem: req.params.lorem,
    };
  
    res.render('template', options);
  });
  
  app.get('*', (req, res) => {
    res.send('404 page not found');
  });
  
  app.use('/user', userRoutes);
  
  //App.listen should ALWAYS be the last thing in your server
  app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
  });