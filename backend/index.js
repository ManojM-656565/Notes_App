require("dotenv").config();

const config=require("./config.json")
const mongoose=require("mongoose");

mongoose.connect(config.connectionString).then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err);
});

const User=require("./models/User.model");
const Note=require("./models/notes.model");

const express =require("express")
const cors=require("cors")
const app=express()
app.use(express.json())

const jwt=require("jsonwebtoken");
const{authenticateToken} =require("./utilities")



app.use(
    cors({
        origin:"*"
    })
)

app.get("/",(req,res)=>{
    res.json("hello")
});

//ROUTES

app.post("/create-account",async (req,res) =>{
    const {fullname,email,password} = req.body;
    if(!fullname){
        return res.status(400).json({
            error:true,
            message:"Full Name is required"
        });
    }

    if(!email){
        return res.status(400).json({
            error:true,
            message:"Email is required"
        })
    }

    if(!password){
        return res.status(400).json({
            error:true,
            message:"Password is required"
        })
    }
    const isUser=await User.findOne({
        email:email
    });

    if(isUser){
        return res.json({
            error:true,
            message:"User already exists"
        });
    }

    const user=new User({
        fullname,
        email,
        password,

    });

    await user.save();

    const accesToken=jwt.sign({
        user
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"36000m",
    });

    return res.json({
        error:false,
        user,
        accesToken,
        message:"Registration succesful",


    });
});

app.post("/login", async (req,res) =>{
    const {email,password} =req.body;
    if(!email){
        return res.status(400).json({
            error:true,
            message:"Email is required"
        })
    }
    if(!password){
        return res.status(400).json({
            error:true,
            message:"password is required"
        })
    }
    const userInfo= await User.findOne({
        email:email
    });

    if(!userInfo){
        return res.status(400).json({
            message:"User not found"
        });
    }

    if(userInfo.email==email && userInfo.password==password){
        const user={user:userInfo};
        const accesToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m"
        })

        return res.json({
            error:false,
            message:"Login Succesful",
            email,
            accesToken,

        });

    }
    else{
        return res.status(400).json({
            error:"true",
            message:"Invalid Credentials"
        });
    }





}); 


//ADD NOTE

app.post("/add-note",authenticateToken, async (req,res) =>{
    const {title,content,tags} = req.body;
    const {user} =req.user;

    if(!title){
        return res.status(400).json(
            {
                error:true,
                message:"Content is required"
            }
        )
    }
    try{
        const note=new Note({
            title,
            content,
            tags:tags || [],
            userId:user._id,
        });
        await note.save();

        return res.json({
            error:false,
            note,
            message:"Note added succesfully",
            
        });
    }
    catch(err){
        return res.status(500).json({
            error:true,
            message:"Internal server error",
        })
    }

});

app.listen(8000,()=>{
    console.log("Server is running successfull")

})

module.exports=app;