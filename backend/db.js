const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/todo");


const userSchema = new mongoose.Schema({
    username: String,
    password: String,   
    
});
const User = mongoose.model("User", userSchema);

const todoSchema = new mongoose.Schema({
    todo: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Todo = mongoose.model("Todo", todoSchema);



module.exports = { User, Todo };