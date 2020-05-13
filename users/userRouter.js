const express = require("express");

const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: "server err" });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!

  const newPost = { user_id: req.id, text: req.body.text };
  Posts.insert(newPost)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "server Error" });
    });
});

router.get("/", (req, res) => {
  // do your magic!
  Users.get().then((user) => {
    res.status(200).json(user);
  });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  //   const {id} = req.params;
  // Users.getById(id)
  // .then(user => {
  //   res.status(200).json(user);
  // })
  try {
    res.json(req.user);
  } catch {
    res.status(500).json({ errorMessage: "Server Error" });
  }
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  Users.getUserPosts(id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ errorMessage: "Post is not exist for this user" });
      }
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "server issiue" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.id)
    .then((user) => {
      if (user > 0) {
        //console.log(user)

        res.status(200).json(req.user);
      } else {
        res.status(400).json({ errorMessage: "user Not Found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "server error" });
    });
});

router.put("/:id", (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Users.getById(id).then((user) => {
    if (user) {
      req.user = user;
      req.id = id;
      next();
    } else {
      res.status(400).json({ errorMessage: "User ID is not valid" });
    }
  });
}

function validateUser(req, res, next) {
  // do your magic!
  if (req.body && Object.keys(req.body).length > 0) {
    if (
      req.body.name &&
      Object.keys(req.body.name).length > 0 &&
      req.body.name !== ""
    ) {
      next();
    } else {
      res.status(404).json({ errorMessage: "name missing" });
    }
  } else {
    res.status(404).json({ errorMessage: "user data (body) missing" });
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (req.body && Object.keys(req.body).length > 0) {
    if (
      req.body.text &&
      Object.keys(req.body.text).length > 0 &&
      req.body.text !== ""
    ) {
      next();
    } else {
      res.status(404).json({ errorMessage: "comment missing" });
    }
  } else {
    res.status(404).json({ errorMessage: "comment data (body) missing" });
  }
}

module.exports = router;
