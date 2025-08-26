const express = require('express');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post("/",authMiddleware,async (req,res)=>{
    try {
        const todo = new Todo({
            user : req.user.id,
            title : req.body.title,
        });
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({message : "Error creating todo", error : error});
    }
});

router.get("/", authMiddleware,async (req,res)=>{
    try {
        const todos = await Todo.find({user : req.user.id}).sort({createdAt: -1});
        res.json(todos);
    } catch (error) {
        res.status(500).json({message : "Error fetching  todo", error : error});
    }
});

router.put("/:id",authMiddleware, async (req,res)=>{
    try {
        const todo = await Todo.findOneAndUpdate(
            {_id : req.params.id, user : req.user.id},
            {$set : req,body},
            {new : true},
        );
        if(!todo) return res.status(404).json({message : "Todo not found"});

        res.json(todo);
    } catch (error) {
        res.status(500).json({message : "Error updating todo", error : error});
    }
})

router.delete("/:id",authMiddleware,async (req,res)=>{
    try {
        const todo = await Todo.findByIdAndDelete({
            _id : req.params.id,
            user : req.user.id,
        });

        if(!todo) return res.status(404).json({message : "Todo not found"});
        res.json({message : "Todo Deleted"});
    } catch (error) {
       res.status(500).json({message : "Error deleting todo",error : error}); 
    }
});

module.exports = router;