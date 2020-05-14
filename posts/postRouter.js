const express = require('express');
const Posts = require('./postDb.js');
const Users = require('../users/userDb.js');

const router = express.Router();

router.use((req,res,next) => {
  console.log("-Processed by Post Router-")
  next();
})

router.get('/', (req, res) => {
  // do your magic!
      Posts.get()
      .then(post => {
        res.status(200).json(post)
      })
});

router.get('/:id',validatePostId ,(req, res) => {
  // do your magic!
  try{
    res.status(200).json(req.post)
  }catch{
    res.status(500).json({errorMessage:"Server Error"})
  }
 
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const {id} = req.params;
  Posts.getById(id)
  .then(post => {
    if(post){
        req.post = post;
        next();
        
    }else{
      res.status(404).json({errorMessage:"No post exist with this ID"})
    }
  }).catch(err => {
    res.status(500).json({errorMessage:"Server issue"})
  })


}

module.exports = router;
