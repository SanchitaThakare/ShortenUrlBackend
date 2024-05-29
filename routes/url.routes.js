const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const UrlModel = require('../models/url.model');
const userController = require('../controllers/users.controller')

router.route('/:urlId').get(async(req,res)=>{
    let urlId = req.params.urlId;
    let existingUrl = await UrlModel.findOne({shortUrl:urlId});
    if(existingUrl){
        res.redirect(existingUrl.originalUrl);
    }else{
        res.send({message:'Input code is invalid'})
    }
});
module.exports = router;