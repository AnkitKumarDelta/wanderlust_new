const express = require("express");
const router  = express.Router();

//index
router.get("/",(req,res)=>{
    res.send("GET for users");
});

//show
router.get("/:id",(req,res)=>{
    res.send("show for users");
});

//create
router.get("/",(req,res)=>{
    res.send("create for users");
});

//delete
router.get("/:id",(req,res)=>{
    res.send("delete for users");
});

module.exports = router;