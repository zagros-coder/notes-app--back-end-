import express from "express";
// Import the createNote controller
import { verifyUserToken } from "../middlewares/verifyJwt.js";
export  const router = express.Router();

import { createNote , getNotes , deleteNote , updateNote } from '../queries/notes_queries.js';

router.post('/note' , verifyUserToken , async(req, res) => {
    try{
        const {title, content} = req.body;
        const userId = req.user.id;
        const notes = await createNote(title, content , userId);
        if(createNote){
            return res.status(201).json({
                message: "Note created successfully",
                noteId: notes,
            });
        }
        res.status(500).json({
            message: "Failed to create note"
        });
    }catch (error) {
        res.status(500).json({
            error:error.message
        });
    }
})

router.get('/notes', verifyUserToken , async (req, res) => {
    try {
        const userId = req.user.id;
        const notes = await getNotes(userId);
        if (notes.length === 0) {
            return res.status(404).json({
                message: "No notes found"
            });
        }   
        res.status(200).json({
            message: "Notes fetched successfully",
            notes: notes,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


router.delete("/note/:id", verifyUserToken, async(req,res)=>{
    try{
        const noteId =req.params.id;
        const userId = req.user.id;
        console.log(noteId);
        
        const deleted = await deleteNote(noteId,userId);
        if(!deleted){
            return res.status(404).json({
                message: "you can't delete this note or it doesn't exist"
            });
        }
        res.status(200).json({
            message: "Note deleted successfully"
        });
    }catch(err){
        return res.status(500).json({
            error: err.message
        });
    }
})

router.put("/note/:id" , verifyUserToken , async(req,res)=>{
    try{
        const noteId = req.params.id;
        const {title,content} = req.body;
        console.log(title,content);
        const userId = req.user.id;
        const updated = await updateNote(title,content,userId, noteId)
        if(!updated){
            return res.status(404).json({
                message: "you can't update this note or it doesn't exist"
            });
        }
        return res.status(200).json({
            message: "Note updated successfully",
            note: updated
        })
    }catch(err){
        return res.status(500).json({
            error: err.message
        }); 
    }
})