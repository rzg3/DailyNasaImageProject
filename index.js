const express=require("express")
const path=require("path")
const hbs=require("hbs")
const collection=require("./mongodb")
const passport = require('passport');
const session = require("express-session")
require('./auth')
const app=express()
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const tempelatePath=path.join(__dirname,'./tempelates')
app.use(express.static(__dirname + "/public/"));
app.use(express.json())
app.set("view engine", "hbs")
app.set("views",tempelatePath)
app.use(express.urlencoded({extended:false}))
app.get("/", (req,res)=> {
    res.render("login")
})

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    })
)

app.get("/protected", isLoggedIn, async (req, res) => {
    const apiKey = 'zaKhMQ6BgBYucqzNIR2VUxWPATgThn6rHweyU7QR';
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
  
    const response = await fetch(apiUrl);
    const data = await response.json();
  
    if (data.media_type === "image") {
      res.render("home", {
        imageUrl: data.url,
        imageCaption: data.explanation
      });
    } else if (data.media_type === "video") {
      const videoUrl = data.url;
      res.render("home", {
        videoUrl: videoUrl,
        videoCaption: data.title,
        videoExplanation: data.explanation
      });
    }
  });

app.get("/auth/failure", (req,res)=> {
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

if (data2.media_type === "image") {
    res.render("home", {
      imageUrl: data2.url,
      imageCaption: data2.explanation
    });
  } else if (data2.media_type === "video") {
    const videoUrl = data2.url;
    res.render("home", {
      videoUrl: videoUrl,
      videoCaption: data2.title,
      videoExplanation: data2.explanation
    });
  }
});



app.post("/login",async (req,res)=>{

    try{
        const check=await collection.findOne({name:req.body.name})

        if(check.password===req.body.password){
            const apiKey = 'zaKhMQ6BgBYucqzNIR2VUxWPATgThn6rHweyU7QR';
            const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.media_type === "image") {
                res.render("home", {
                  imageUrl: data.url,
                  imageCaption: data.explanation
                });
              } else if (data.media_type === "video") {
                const videoUrl = data.url;
                res.render("home", {
                  videoUrl: videoUrl,
                  videoCaption: data.title,
                  videoExplanation: data.explanation
                });
              }
        }
        else{   
            res.render("login")
        }
    }
    catch{
        res.render("login")
    }
    
})

app.post('/logout', (req, res) => {
    res.redirect('/');
  });


app.listen(3000, ()=> {
    console.log("port connected");
})

module.exports = app;