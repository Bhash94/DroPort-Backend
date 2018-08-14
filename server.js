// THIS IS SERVER FILE FOR DROPORT BACKEND //



// initializing
var dbcon = require('./dbconnection');
var express = require('express');
var app = express();
var cons = require('consolidate');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser');

//authentication packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);




app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

var options = {
    host: 'localhost',
    // port: 3306,
    user: 'root',
    password: '',
    database: 'droport_new'
};

var sessionStore = new MySQLStore(options);

app.use(cookieParser());
app.use(session({
    secret: 'sdmbgjgrjgbdskjfbqerlihkjadgkd',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());


var request_routes = require('./routes/request_routes')
var user_routes = require('./routes/user_routes')



app.use('/api/req', request_routes);
app.use('/api/user', user_routes);

// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         console.log("in server passport")
//         console.log(username);
//         console.log(password);
//         var sql = "SELECT password FROM drone_pilot WHERE username = ? "
//         dbcon.query(sql, [username], function (err, results) {
//             if (err) {
//                 done(err)
//             };

//             if (results.length == 0) {
//                 done(null, false);
//             }
//             if (results) {
//                 console.log("in server results")
//                 results_data = JSON.stringify(results)
//                 console.log(results_data);
//             }


//         });
//         return done(null, 'dfbhj');

//     }
// ));





passport.use(new LocalStrategy(
  function(username, password, done) {
      var sql = "SELECT username FROM drone_pilot WHERE username = ?"
    dbcon.query(sql,username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));




port = 3000;
app.listen(port, (err) => {
    if (err) {
        console.log("server error")
    } else {
        console.log('connected')
    }

})