// Importing express
import express from 'express';
import userRoutes from './routes/userRoutes.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Initializing epxress into a variable
const app = express();
const PORT = 3000;

// Getting ES moudles
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

//Server static files to be used by template
app.use(express.static('./styles'));

//Creating template engine
app.engine('cat', (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    //Error handling
    if (err) return callback(err);

    //Takes template, turns to string, puts dynamic content in spedified areas, returns value
    const rendered = content
      .toString()
      .replaceAll('#title#', `${options.name}`)
      .replace('#content#', `${options.content}`)
      .replace('#lorem#', options.lorem)
      .replace('#img#', `${options.img}`);

    return callback(null, rendered);
  });
});

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
      name: `Anthony's Awesome App!`,
      content: 'This is my app created in VS',
      lorem: `Do you want to see who is the worst team in the NFL?`,
      img: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/ne.png',
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

  app.get('/button-action', (req, res) => {
    res.send('Button clicked!');
  });
  
  app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, req.params.filename, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error downloading the file');
        }
    });
  });

  app.use('/user', userRoutes);
  
  //App.listen should ALWAYS be the last thing in your server
  app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
  });