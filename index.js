require("dotenv").config();
const cool = require("cool-ascii-faces");
const bodyParser = require("body-parser");
const express = require("express");
const session = require('express-session')
const request = require("request");
const apiKey = "7036d1b6c7fdb0dc512c2dc0fd0420fa";
const path = require("path");
const bcrypt = require("bcryptjs")

var sess;
const app = express();
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({secret: 'sssshhhhhh', saveUninitialized: true, resave: true}))
app.use(express.urlencoded({ extended: true }));
app.set("/views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");


// connecting to my dataBase
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const PORT = process.env.PORT || 5000;


app.get("/", function(req, res) {
  res.sendFile("login.html",{root:__dirname + "/public/html"})
});

app.post("/login", (req, res)=>{
  var user = req.body.username
  var pass = req.body.password
  sess = req.session

  var sql = "SELECT username, pw FROM USERS WHERE username = $1"
  var params = [user]
  pool.query(sql, params, function(err, data){
    if (err) {
      console.log("Error in query...")
      console.log(err)
    } else {
      if (data.rowCount) {
        if (pass == data.rows[0].pw) {
          sess.username = user;
          res.redirect("/mainPage")
        } else {
          res.redirect("/")
        }
      } else {
        res.redirect("/")
      }
      console.log(data.rows)
      
    }

  })

})

// app.get("/signupPage", function(req, res) {
//   res.sendFile("signup.html",{root:__dirname + "/public/html"})
// });

app.post("/addUser", (req, res)=>{
  var user = req.body.username
  var pass = req.body.password
  var sql = "INSERT INTO USERS (username, pw) VALUES ($1, $2) RETURNING id"
  var params = [user, pass]
  pool.query(sql, params, function(err, data){
    if (err) {
      console.log("Error in query...")
      console.log(err)
    } else {
      console.log(data.rows[0].id)
      res.redirect("/html/signup.html")
    }
  })
//   bcrypt.compare(pass, data[0].password, function(err, response) {
//     if (response === false) {
//         console.log("Bad Password!")
//     }
// });

// console.log("Back from DB with result:");
// console.log(result.rows);

// const username = data[0].username
// var params = {username: username} 
// res.render("login", params)
// res.end()
})

// app.get('/', verifyLogin, (req, res) => {
  
//     res.render('/login', {data: response['data']['data']})
//   });
  

// app.get('/login', (req, res) => {
//   res.render('login')
// });

// app.post('/login', handleLogin);
// app.get('/logout', handleLogout);


// // goes to teh signup page
//  app.get("/signup", function(req, res) {
//    res.sendFile("signup.html",{root:__dirname + "/public"})
//  });

app.get('/logout', (req, res) => {
    req.session.destroy(function(err){
      if(err){
         return console.log("Error in Logout " + err)
      }
       res.redirect("/");
    });
})

// that takes me to my app
app.get("/mainPage", function(req, res) {
  sess = req.session;
  if (sess.username) {
    res.render("index", { weather: null, error: null });
  } else {
    res.redirect("/");
  }
});


//get the currentWeather page
app.get("/currentWeather", function(
  req,
  res
) 
{
  res.render("currentWeather");
});


//get the ajax page
app.get("/weather_ajax", function(
  req,
  res
) 
{
  res.render("weather_ajax");
});



app.post("/displayWeather", function(req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  request(url, function(err, response, body) {
    if (err) {
      res.render("index", { weather: null, error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);
      if (weather.main == undefined) {
        res.render("index", {
          weather: null,
          error: "Error, please try again"
        });
      } else {
        let weatherText = `It is ${weather.main.temp} Fahrenheit degrees in ${weather.name}!`;
        res.render("index", { weather: weatherText, error: null });
      }
    }
  });
});

app.get("/cool", (req, res) => res.send(cool()));
app.get("/times", (req, res) => res.send(showTimes()));
app.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM test_table");
    const results = { results: result ? result.rows : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

showTimes = () => {
  let result = "";
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + " ";
  }
  return result;
};

// function verifyLogin(req, res, next) {
//   if (req.session.user) {
//     // logged in
//     next();
//   } else {
//     // not logged in
//     res.render('login')
//   }
// }



// const showSignup = () => {
//   $('#login').hide();
//   $('#signup').show();
//   $('#newUsername').focus();
// };
// const showLogin = () => {
//   $('#signup').hide();
//   $('#login').show();
//   $('#username').focus();
// };