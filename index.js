const express = require('express');
const app = express();
const session = require('express-session');
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose
  .connect('mongodb://127.0.0.1:27017/authDemo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MONGO CONNECTION OPEN!!!');
  })
  .catch((err) => {
    console.log('OH NO MONGO CONNECTION ERROR!!!!');
    console.log(err);
  });
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'Not a good secret' }));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res) => {
  res.send('This is the home page');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    password: hash,
  });
  user.save();
  req.session.userId = user._id;
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/logout', (req, res) => {
  //req.session.userId = null;
  req.session.destroy();
  res.redirect('/login');
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log(user);
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    req.session.userId = user._id;
    res.redirect('secret');
  } else {
    res.send('Please try again');
  }
});

app.get('/secret', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/login');
  }
  res.render('secret');
});

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
