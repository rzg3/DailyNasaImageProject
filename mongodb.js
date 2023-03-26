const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://rzg2:VB65UTrUV9S1iErv@dailynasaimageproject.3x6cbzn.mongodb.net/test")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connect");
})

const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("Collection1",LogInSchema)

module.exports=collection