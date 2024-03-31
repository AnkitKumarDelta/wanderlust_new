const express = require("express");
const router  = express.Router();

//index post
router.get("/",(req,res)=>{
    res.send("GET for users");
});

//show post
router.get("/:id",(req,res)=>{
    res.send("show for users");
});

//create post
router.get("/",(req,res)=>{
    res.send("create for users");
});

//delete post
router.get("/:id",(req,res)=>{
    res.send("delete for users");
});

module.exports = router;