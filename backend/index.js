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



app.use(cors());

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

    const accessToken=jwt.sign({
        user
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"36000m",
    });

    return res.json({
        error:false,
        user,
        accessToken,
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
            message:"Login Succesfull",
            user,
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

//GET USER

app.get("/get-user",authenticateToken,async (req,res) =>{
    // const {user} =req.user;
    const {user} =req.user;
    // console.log(email);
    const isUser =await User.findOne({_id:user._id});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user:{fullname:isUser.fullname,
            email:isUser.email,
            "_id":isUser._id,
            createdOn:isUser.createdOn
        },
        message:"",
    });
})


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

//EDIT-NOTE
app.put("/edit-note/:noteId",authenticateToken, async (req,res)=>{
    console.log("req.body :"+req.body); 
    console.log("req.user :"+req.user); 
    const noteId=req.params.noteId;
    const{title,content,tags,isPinned}=req.body;


    if(!title && !content && !tags){
        return res.status(400).json({
            error:true,
            message:"No changes provided",
        });
    }
    try{
        const note=await Note.findOne({_id:noteId});

        if(!note){
            return res.status(404).json({
                err:true,
                message:"Note not found"
            });
        }

        if(title){
            note.title=title;
        }
        if(content){
            note.content=content;
        }
        if(tags){
            note.tags=tags;
        }
        if(isPinned){
            note.isPinned=isPinned;
        }
        await note.save();

        return res.json({
            error:false,
            note,
            message:"Note updated successfully",
        });

    }
    catch(err){
        return res.status(500).json({
            error:false,
            message:"Internal server error"
        })
    }
});

//GET ALL NOTES

app.get("/get-all-notes/",authenticateToken,async (req,res) =>{
const {user} = req.user;

try{
    const notes=await Note.find({userId:user._id}).sort({isPinned:-1});

    return res.json({
        error:false,
        notes,
        message:"All notes retrives successfully",
    });
}
catch(err){
    return res.status(500).json({
        error:true,
        message:"Internal Server Error",
    });
}
});

// DELETE-NOTE
app.delete("/delete-note/:noteId",authenticateToken,async (req,res)=>{
    const noteId=req.params.noteId;
    const{user}=req.user;

    try{
        const note=await Note.findOne({ _id: noteId }); 
        
        
        if(!note){
            return res.status(404).json({error:true,message:"Note not found"});
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });
        return res.json({ error: false, message: "Note deleted successfully" });
        
    }catch(err){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        });
    }
})



//update isPinned

app.put("/update-note-pinned/:noteId",authenticateToken,async (req,res) =>{
    const noteId=req.params.noteId;
    const{isPinned}=req.body;
    const {user} =req.user;

 
    try{
        const note=await Note.findOne({_id:noteId,userId:user._id});

        if(!note){
            return res.status(404).json({
                err:true,
                message:"Note not found"
            });
        }

            note.isPinned=isPinned ;

        await note.save();

        return res.json({
            error:false,
            note,
            message:"Note updated successfully",
        });

    }
    catch(err){
        return res.status(500).json({
            error:false,
            message:"Internal server error"
        })
    }

});



app.get("/search-notes/",authenticateToken,async (req,res) =>{
    const {user} =req.user;
    const{query} =req.query;

    if(!query){
        return res.status(400).json({error:true,message:"Search query is required"});
    }

    try{
        const match=await Note.find({
            userId:user._id,
            $or:[
                {title:{$regex:new RegExp(query,"i")}},
                {content:{$regex:new RegExp(query,"i")}},
                
            ],
        });
        return res.json({
            error:false,
            notes:match,
            message:"Notes matching successfully"
        })

    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server error",
        })
    }

});
app.listen(5000,()=>{
    console.log("Server is running successfull")

});

module.exports=app;