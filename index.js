// implement your API here
// import express from 'express'; // ES2015 modules
const express = require("express"); // common js modules - stuff we use now.

const server = express();

const DB = require("./data/db");
console.log("hello world");
server.use(express.json()); // needed for post and put requests
//teaches express to read JSON from the body.

server.get("/", (req, res) => {
  res.json({ hello: "Web 26" });
});

// view a list of stuff
server.get("/api/users", (req, res) => {
  //works
  DB.find()
    .then(db => {
      res.status(200).json(db);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
  res.status(200);
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  DB.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
        console.log(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

// add a stuff

server.post("/api/users", (req, res) => {
  // data will be in the body of the request
  const dbInfo = req.body;
  // validate the data, if valid, save it!

  DB.insert(dbInfo)
    .then(db => {
      res.status(201).json(db, "id");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      });
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    });
});

//update
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  console.log(req.params);
  if ({ name, bio }) {
    DB.update(id, { name, bio })
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        console.log(err);

        res.status(500).json({
          errorMessage: "The user information could not be modified."
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
});

// delete

server.delete(`/api/users/:id`, (req, res) => {
  const { id } = req.params;
  if ({ id } !== { id }) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    DB.remove(id)
      .then(removed => {
        res.status(200).json(removed);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "The user could not be removed" });
      });
  }
});
const port = 5000;
server.listen(port, () => console.log(`\n** API on port ${port} \n`));
