const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const UrlModel = require('../models/url.model');
const QRCode = require('qrcode');

// const userController = require('../controllers/users.controller');

// router.route('/').get(userController.getUsers);


router.post('/shorten', async (req, res) => {
    try {
        const { url } = req.body;
        const shortCode = shortid.generate();
        const shortUrl = `${shortCode}`;
        const qrCodeDataURL = await QRCode.toDataURL(`${process.env.SERVER_URL}/${shortUrl}`);


        // Save to MongoDB
        await UrlModel.create({ originalUrl: url, shortUrl, qrUrl: qrCodeDataURL });
        // https://shorten-url-backend-sigma.vercel.app
        res.status(200).json({ url: `${process.env.SERVER_URL}/${shortUrl}`, qrUrl: qrCodeDataURL });
    } catch (e) {
        console.log(e);
        res.send({ data: null })
    }
});

router.get('/urls', async (req, res) => {
    console.log("res!!!!!!!!", res)
    try {
        const data = await UrlModel.find();

        if (data.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }

        res.status(200).json({ urls: data });
    } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/update-short-url', async (req, res) => {
    try {
        const {editedShortcode, originalShortcode } = req.body;
        const codeExist = await UrlModel.findOne({shortUrl: editedShortcode}).lean();
        console.log("!!!!!!!", codeExist)
        if(codeExist){
            res.status(404).json({message: "Requested code already exists. try different!"})
        } 

        const originalCode = await UrlModel.findOne({shortUrl: originalShortcode});

        const updatedShortUrl = await UrlModel.findByIdAndUpdate(
            originalCode.id,
            {shortUrl: editedShortcode}
        )

        if(!updatedShortUrl) {
            res.status(404).json({message: "shortUrl not found"})
        }
        return res.status(200).json({ url: `${process.env.SERVER_URL}/${editedShortcode}` })
    }
    catch(error) {
        console.error('Error updating shortUrl:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})




module.exports = router;