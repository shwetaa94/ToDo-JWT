const express = require("express");
const server = express();
const cors=require('cors');
const bodyParser=require('body-parser');
const { User, Todo } =require("./db")
const jwt= require("jsonwebtoken")
const jwtkey= 'abc'
server.use(cors());
server.use(bodyParser.json());

//write
server.post("/register", async (req,res)=>{

    const user = await User.create({
        username: req.body.username,
        password:req.body.password
    })
    const token=jwt.sign({
        username:user.username,
        userId:user._id,
    }, jwtkey
    );
    console.log(token);
    res.status(201).json({token});

//     let user = new User({
//     username : req.body.username,
//     password : req.body.password,
// })  
//     const token = jwt.sign({username:req.body.username, userId:user._id}, jwtkey)
//     await user.save();
//     console.log(token);
//     res.json({token});

})

//read
server.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        if(user.password !== req.body.password){
            return res.status(401).json({ error: "password dont match" });
        }
        // Generate JWT token
        const token=jwt.sign({
            username:user.username,
            userId:user._id,
        }, jwtkey
        );
      

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const auth = (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, jwtkey);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({});
    }
  };
  
   server.use(auth);
// Routes
// Get all todos
server.get('/todos', async (req, res) => {
    const userId= req.userId;
    try {
      const todos = await Todo.find({userId});
      res.json(todos);
    } catch (error) {
      console.error("Error getting todos:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Create a new todo
  server.post('/addtodo', async (req, res) => {
    const { todo } = req.body;
    const {userId}=req;
    
    try {
      const newTodo = await Todo.create({ todo, userId });
    //   await newTodo.save();
      res.status(201).json(newTodo);
    } catch (error) {
      console.error("Error adding todo:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Update a todo
  server.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(id, { todo }, { new: true });
      res.json(updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete a todo
  server.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await Todo.findByIdAndDelete(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

server.listen(8080,()=>{
    console.log("serverr started")}
    )

