require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encript = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
userSchema.plugin(encript, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, function (err, foundUser) {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.send("Sorry Doesn't exist!!");
        }
      } else {
        res.send("Sorry Doesn't exist!!");
      }
    } else {
      res.send(err);
    }
  });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({
    email: username,
    password: password,
  });
  newUser.save(function (err) {
    if (!err) {
      console.log("Successfully Register");
      res.redirect("/login");
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
