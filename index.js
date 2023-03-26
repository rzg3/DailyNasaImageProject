const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const collection=require("./mongodb")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const tempelatePath=path.join(__dirname,'./tempelates')
app.use(express.static("public"));
app.use(express.json())
app.set("view engine", "hbs")
app.set("views",tempelatePath)
app.use(express.urlencoded({extended:false}))

app.get("/", (req,res)=> {
    res.render("login")
})

app.get("/signup", (req,res)=> {
    res.render("signup")
})

app.post("/signup",async (req,res)=>{

const data={
    name:req.body.name,
    password:req.body.password
}

await collection.insertMany([data])

const apiKey = 'zaKhMQ6BgBYucqzNIR2VUxWPATgThn6rHweyU7QR';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

const response = await fetch(apiUrl);
const data2 = await response.json();

res.render("home", {
    imageUrl: data2.url,
    imageCaption: data2.explanation
});


})

app.post("/login",async (req,res)=>{

    try{
        const check=await collection.findOne({name:req.body.name})

        if(check.password===req.body.password){
            const apiKey = 'zaKhMQ6BgBYucqzNIR2VUxWPATgThn6rHweyU7QR';
            const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            res.render("home", {
                imageUrl: data.url,
                imageCaption: data.explanation
            });
        }
        else{
            res.send("wrong password")
        }
    }
    catch{

        res.send("wrong details")

    }
    
})

app.post('/logout', (req, res) => {
    res.redirect('/');
  });


app.listen(3000, ()=> {
    console.log("port connected");
})

module.exports = app;