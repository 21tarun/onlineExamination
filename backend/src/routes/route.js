const express= require('express')
const router=express.Router()
const validator = require('validator')
const userModel= require('../models/userModel')
const quetionModel=require('../models/quetionModel')
const jwt =require('jsonwebtoken')
const aws = require('aws-sdk')
const mid =require('../middleware/auth')



aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1",
   

})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: '2006-03-01' });


        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
        


    })
}




router.post('/login',async function(req,res){
    try{
        let data=req.body
        if(!data.email)return res.status(400).send({status:false,message:"email is required"})
        if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, msg: "please enter valid email address!" })
       
        if(!data.userType) data.userType='Student' 
    
        const user= await userModel.findOne({email:data.email})
        let type
        if(user){
            
            if(user.userType=='Admin') type='Admin'
            else {type='Student'}
            let token= jwt.sign({type:type},"kuchh-bhi",{expiresIn: '24h'})
            return res.status(200).send({status:true,type:type,token:token})
    
        }
        else{
            await userModel.create(data)
            if(data.userType=="Admin")type="Admin"
            else {type="Student"}
            let token= jwt.sign({type:type},"kuchh-bhi",{expiresIn: '2h'})
            return res.status(200).send({status:true,type:type,token:token})
        }
    
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

})

router.post('/createQuetion',mid.Authentication,async function(req,res){
    try{
        let data=req.body
        let files=req.files
        let create={}

        //Authorization
        if(req.decode.type=='Student') return res.status(403).send({status:false,message:"you are not authorized"})

        if(!data.quetion) return res.status(400).send({status:false,message:"quetion is required"})
        create.quetion=data.quetion
        if(!data.option1 || !data.option2 || !data.option3 || !data.option4) return res.status(400).send({status:false,message:"all options required"})
        let options=[data.option1,data.option2,data.option3,data.option4]

        let temp = options.filter((x,i)=>i!=options.indexOf(x))
        if(temp.length>0) return res.status(400).send({status:false,message:"all options should be different"})

        create.options=options
       
        if(!data.answer) return res.status(400).send({status:false,message:"answer required"})
        if(!options.includes(data.answer)) return res.status(400).send({status:false,message:"answer should be in options"})
     


        create.answer=data.answer
      
        

        if (files.length > 0) {
            var fileLink = await uploadFile(files[0])
            if (!fileLink) {
                return res.status(404).send({ status: false, message: "no file found" })

            }
            create.file=fileLink
        }
        

      
        

        let que=await quetionModel.create(create)
    
        return res.status(201).send({status:true,message:"quetion created successfully", data:que})


          


    
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

})

router.get('/getQuetions',mid.Authentication,async function(req,res){
    try{
        let type=req.decode.type
        let quetionsData= await quetionModel.find()
        if(type=='Admin'){
            return res.status(200).send({status:true,message:"all quetions",data:quetionsData})
        }
        else{
            if(quetionsData.length<=10){
                return res.status(200).send({status:true,message:"quetions for student",data:quetionsData})
            }
            else{
                const shuffled = quetionsData.sort(() => 0.5 - Math.random())
                return res.status(200).send({status:true,message:"quetions for student",data:shuffled.slice(0,10)})
            }
        }
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
    
})

router.put('/updateQuetion',mid.Authentication,async function(req,res){
    try{
        let data=req.body
        let files=req.files
        let id= req.body.id
        let update={}
        

        
        //authorization
        if(req.decode.type=='Student') return res.status(403).send({status:false,message:"you are not authorized"})

        if(Object.keys(data).length==0 && files.length==0) return res.status(400).send({status:false,message:"please provide updation detaion data"})
        
        
        let quetion = await quetionModel.findOne({_id:id})

        let options= quetion.options



        if(data.quetion) update.quetion=data.quetion
        if(data.option1) options[0]=data.option1
        if(data.option2) options[1]=data.option2
        if(data.option3) options[2]=data.option3
        if(data.option4) options[3]=data.option4



        let temp = options.filter((x,i)=>i==indexOf(x))
        if(temp.length>0) return res.status(400).send({status:false,message:"all options should be different"})

        update.options=options

        if(data.answer) {
            if(!options.includes(answer)) return res.status(400).send({status:false,message:"answer should be in options"})
            update.answer=data.answer
        }

        

        if (files.length > 0) {
            var fileLink = await uploadFile(files[0])
            if (!fileLink) {
                return res.status(404).send({ status: false, message: "no file found" })
            }
            update.file=fileLink
        }
        

        let que=await quetionModel.findByIdAndUpdate(id,update)
        return res.status(200).send({status:true,message:"quetion updated successfully"})


          


    
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

})



module.exports=router

