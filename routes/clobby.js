const express = require('express');
const router = new express.Router();
const clManager = require('../managers/clobby');


router.post('/fetchInformation', (req, res)=>{
    console.log("[!] Routing @ /fetchInformation")
    const {
        type,
        cycle
    } = req.body;

    if(!validateContent(type)){
        return res.status(400).send({message:"Wrong Request"});
    }
    clManager.fetch(type, cycle).then((result)=>{
        res.status(200).send(result)
    }, (error) =>{
        res.status(400).send({code: "Wrong Request"});
        console.log(error);
    });
});

const validateContent = (p) =>{
    if (p === undefined || p === null || p === '') {
        return false;
      } else {
        return true;
      }
}


module.exports = router;