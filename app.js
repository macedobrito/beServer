var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
        clientID: 381773938884800,
        clientSecret: '5c8838c6aeef469c7fa242660e36e954',
        callbackURL: 'http://localhost:3000/login/facebook/return',
        profileFields: ['id', 'displayName', 'photos', 'emails']
    },
    function(accessToken, refreshToken, profile, cb) {

        return cb(null, profile);
    }));
//
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

app.use(bodyParser.json());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

Genre = require('./models/genre');
Book = require('./models/book');
User = require('./models/user');

// connect to mongoose
mongoose.connect('mongodb://localhost/bookstore');
var db = mongoose.connection;


app.get('/api/genres', function(req, res) {
    Genre.getGenres(function(err, genres) {
        if (err) {
            throw err;
        }
        res.json(genres);
    });
});

app.post('/api/genres', function(req, res) {
    var genre = req.body;
    Genre.addGenre(genre, function(err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.put('/api/genres/:_id', function(req, res) {
    var id = req.params._id;
    var genre = req.body;
    Genre.updateGenre(id, genre, {}, function(err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.delete('/api/genres/:_id', function(req, res) {
    var id = req.params._id;
    Genre.removeGenre(id, function(err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});

app.get('/api/books', function(req, res) {
    Book.getBooks(function(err, books) {
        if (err) {
            throw err;
        }
        res.json(books);
    });
});

app.get('/api/books/:_id', function(req, res) {
    Book.getBookById(req.params._id, function(err, book) {
        if (err) {
            throw err;
        }
        res.json(book);
    });
});

app.get('/api/users', function(req, res) {
    User.getUsers(function(err, users) {
        if (err) {
            throw err;
        }
        res.json(users);
    });
});

app.get('/api/user/:facebookId', function(req, res) {
    User.getUserByFacebookId(req.params.facebookId, function(err, user) {
        if (err) {
            throw err;
        }
        res.json(user);
    });
});


// Define routes.
app.get('/',
    function(req, res) {
        res.send('biscaite api');
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/login',
    passport.authenticate('facebook'));

app.get('/login/facebook/return',
    passport.authenticate('facebook', {failureRedirect: '/login'}),
    function(req, res) {
        var userId = req.user.id
        console.log("userId", userId)
        User.getUserByFacebookId(userId, function(err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                console.log('user already exists: ', user.id)
                res.json(user);
            } else {
                var newUser = {
                    name: req.user.displayName,
                    facebookId: req.user.id,
                    picture: req.user.photos[0].value
                }
                User.createUser(newUser, function(err, newUser) {
                    if (err) {
                        throw err;
                    }
                    console.log('user created: ', newUser)
                    res.json(newUser);
                });
            }

        });
        // res.json(req.user);
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
        res.json(req.user);
        // res.render('profile', { user: req.user });
    });

app.post('/api/user', function(req, res) {
    var user = req.body;
    User.createUser(user, function(err, user) {
        if (err) {
            throw err;
        }
        res.json(user);
    });
});


app.listen(3000);
console.log('running on 3000')
