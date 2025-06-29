import express  from "express";
export  const router = express.Router();
import { createUser, getUsers , getUserByUsername , updateUserName , getAdminByUsername , deleteUser  , changeUserRole} from '../queries/users_queris.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyAdminToken, verifyUserToken } from "../middlewares/verifyJwt.js";
dotenv.config();


const json_sec = process.env.SECRET_KEY
router.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body;

        // Check if the user already exists
        const existingUser = await getUsers();
        if (existingUser.some(user => user.username === username)) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the user
        const user = await createUser(username, hashedPassword);
        
        if (user) {
            return res.status(201).json({
                message: "User created successfully",
                userId: user.insertId,
            });
        }
        
        res.status(500).json({
            message: "Failed to create user"
        });
    }catch(Err){
        res.status(500).json({
            error: Err.message
        });
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found"
            });
        }   
        res.status(200).json({
            message: "Users fetched successfully",
            users: users,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}   );


router.post("/login", async(req,res)=>{
    try{
        const {username , password} = req.body
        const findUser = await getUserByUsername(username)
        if(!findUser){
            return res.status(404).json({message:"error , username or password isn't typed correctly"})

        }
        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        if(!isPasswordValid){
            return res.status(404).json({message:"error , username or password isn't typed correctly"})
        }

        if(findUser.role === "banned"){
            return res.status(403).json({message:"you are banned from this site"})
        }

         if (findUser.role === "moderator"){
            const token = jwt.sign({ id: findUser.id, user_name: findUser.username ,is_admin:false , is_moderator:true }, json_sec, {
                expiresIn: "24h", //
            })
            return res.status(200).json({
                message:"welcome moderator",
                token: token,
            })
         }

         if( findUser.role === "admin"){
            const token  = jwt.sign({ id: findUser.id, user_name: findUser.username ,is_admin:true , is_moderator:false }, json_sec, {
                expiresIn: "24h", //
            })
            return res.status(200).json({
                message:"welcome admin",
                token: token,
            })
         }

         const token  = jwt.sign({ id: findUser.id, user_name: findUser.username ,is_admin:false , is_moderator:false }, json_sec, {
                expiresIn: "24h", //
            })

        return res.status(200).json({
        message:"welcome user",
        token: token,
    })
     
        
    }catch(err){
        return res.status(500).json({error:err.message});
    };
    
})

router.post("/admin/login", async(req,res)=>{
    try{
        const {username , password} = req.body
        if(username !="zagros-coder"){
            return res.status(403).json({message:"you are not allowed to login as admin"})
        }
        const findAdmin = await getAdminByUsername(username)
        if(!findAdmin){
            return res.status(404).json({message:"error , username or password isn't typed correctly"})

        }
        const isPasswordValid = await bcrypt.compare(password, findAdmin.password);
        if(!isPasswordValid){
            return res.status(404).json({message:"error , username or password isn't typed correctly"})
        }

         const token = jwt.sign({ id: findAdmin.id, user_name: findAdmin.username ,is_admin:true }, json_sec, {
         expiresIn: "24h", // Token expires in 1 day
    });


    return res.status(200).json({
        message:"login successfully",
        token: token,
    })
        
    }catch(err){
        return res.status(500).json({error:err.message});
    };  

})
router.put("/user/:id", async(req,res)=>{
    try{
        const id = req.params.id;
        console.log(id);
        const {username} = req.body;

        if(id !== req.user.id){
            return res.status(403).json({message:"you can't update this user"});
        }


        const updateUser = await updateUserName(username,id);
        if(!updateUser){
            return res.status(404).json({
                message: "user name is taken"
            });    
        }
        return res.status(200).json({
                message: "user name updated successfully",
                user: updateUser
            })
        
    }catch(err){
        return res.status(500).json({
            error: err.message
        });
    }
})


router.get("/hi", verifyAdminToken, (req, res) => {
    res.status(200).json({
        message: "Hello Admin, you have access to this route"
    });
})


router.delete("/user/:id" , verifyUserToken , async(req,res)=>{
    try{
        const id = req.params.id;
        console.log(id);
        if(id != req.user.id){
            return res.status(403).json({message:"you can't delete this user"});
        }
        const deletion = await deleteUser(id);
        if(!deletion){
            return res.status(404).json({
                message: "user not found"
            });    
        }
        return res.status(200).json({
                message: "user deleted successfully",
            })
    }catch(err){
        return res.status(500).json({
            error: err.message
        });
    }
})


router.delete("/admin/user/:id" , verifyAdminToken , async(req,res)=>{
    try{
        const id = req.params.id;
        const deletion = await deleteUser(id);
        if(!deletion){
            return res.status(404).json({
                message: "user not found"
            });    
        }
        return res.status(200).json({
            message:"user deleted successfully",
        })

    }catch(err){
        return res.status(500).json({
            error: err.message
        });
    }
})

router.put("/admin/role/:id" , verifyAdminToken , async(req,res)=>{
    try{
        const id = req.params.id;
        const {role} = req.body;
        if(!role){
            return res.status(400).json({
                message: "role is required"
            });
        }
        const updateRole = await changeUserRole(id,role);
        if(!updateRole){
            return res.status(404).json({
                message: "user not found"
            });    
        }

        return res.status(200).json({
            message:"user role updated successfully",
            user: updateRole
        })
    }catch(err){
        return res.status(500).json({
            error: err.message
        });
    }
});