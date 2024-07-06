import mongoose, { connect } from 'mongoose'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import User from './src/models/user.js'
import bcrypt from 'bcrypt'
import multer from 'multer'
import Post from './src/models/post.js'
import Note from './src/models/note.js'
import { createServer } from 'node:http'
import {Server} from 'socket.io'
import setUpChat from './chat.js'
import Message from './src/models/messages.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.img)
    },
})
const upload = multer({ storage: storage });

const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploadAudio")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.audio)
    },
})

const audioUploads = multer({storage: audioStorage});

const app = express()
app.use(express.json())
// app.use(cors());
app.use(cors({
    origin: '*',
}));

app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true
  }));

mongoose.connect('mongodb+srv://vanshdvn2505:vansh123@cluster0.o9mplqn.mongodb.net/')

const server = createServer(app);
const io  = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
})
setUpChat(io);

app.post("/", async (req,res) => {
    const {name, email, password} = req.body
    const userEmail = await User.findOne({email: email});

    if(userEmail){
        return res.status(401).json({
            error: "Email Already Exists",
            status: false
        })
    }

    if(!name || !email || !password){
        return res.status(401).json({
            error: "Enter All Fields",
            status: false
        })
    }

    if(password.length < 8){
        return res.status(401).json({
            error: "Password length should be atleast 8",
            status: false
        })
    }

    try{
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashPass
        });

        req.session.name = name;
        req.session.email = email;
        await newUser.save();
        return res.json("done");
    }catch(error){
        console.log(error);
        return res.json("done");
    }
})

app.post('/signup', async (req, res) => {
    const {name, email, password} = req.body

    const userEmail = await User.findOne({email: email});

    if(!name || !email || !password){
        return res.status(401).json({
            error: "Enter All Fields",
            status: false
        })
    }
    if(password.length < 8){
        return res.status(401).json({
            error: "Password length should be atleast 8",
            status: false
        })
    }

    if(userEmail){
        return res.status(401).json({
            error: "Email Already Exists",
            status: false   
        })
    }

    try{
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashPass
        });

        req.session.name = name;
        req.session.email = email;
        await newUser.save();
        return res.json("done");
    }catch(error){
        console.log(error);
        return res.json("done");
    }
})

app.post("/login", async (req,res) => {
    const {name, email , password} = req.body;

    const userEmail = await User.findOne({email: email})
    
    if(!name || !email || !password){
        return res.status(401).json({
            error: "Enter All Fields",
            status: false
        })
    }
    try {
        if(!userEmail){
            return res.status(401).json({
                error: "Email Doesn't Exists",
                status: false
            })
        }
        

        const userPass = await bcrypt.compare(password, userEmail.password);
    
        if(!userPass){
            return res.status(401).json({
                error: "Invalid Password",
                status: false
            })
        }
        req.session.name = name;
        req.session.email = email;
        res.json("Success");
    } catch (error) {
        console.log(error)
        res.json("Done")
    }
})

app.get('/blog/home', (req,res) => {
    if(!req.session.email || !req.session.name){
        return res.status(401).json({
            status: false
        })
    }
})


app.post('/blog/upload', upload.single('file'), (req,res) => {
    res.status(200).json("Image has been uploaded successfully!");
})

app.post('/blog/edit', async (req,res) => {
    const edited = req.body;
    const userEmail = edited.email;

    const finder = await User.findOne({email: userEmail})

    try{
       finder.age = edited.age; 
       finder.height = edited.height; 
       finder.from = edited.from; 
       finder.work = edited.work; 
       finder.dob = edited.dob;
       finder.image = edited.filename; 

       await finder.save();
       res.status(200).json("Done");
    }
    catch(error){
        console.log("EDIT" + error)
        res.status(400).json("Done");
    }
})

app.post('/blog/profile', async (req,res) => {
    const {email} = req.body;

    const userEmail = await User.findOne({email: email});

    try {
        const age = userEmail.age;
        const height = userEmail.height;
        const dob = userEmail.dob;
        const from = userEmail.from;
        const work = userEmail.work;
        const imgFile = userEmail.image;
        const obj = {
            age, height, dob, from, work, imgFile
        }  
        return res.json(obj);  
    }
    catch(error){
        console.log(error);
        res.status(400).json("Something Went Wrong!")
    }
})

app.post('/blog/post', async (req,res) => {
    const post = req.body;

    try{
        const newPost = new Post({
            name: post.name,
            email: post.email,
            photo: post.filename,
            content: post.content,
            userImg: post.img,
            date: Date.now(),
        });
        
        await newPost.save();
        return res.status(200).json("Done");
    }
    catch(error){
        console.log("Post " + error);
        return res.status(400).json("Done");
    }
})

app.delete('/blog/postDel', async (req, res) => {
    const {id} = req.body;
    try {
        const post = await Post.findOneAndDelete({_id: id});
        return res.status(200).json("Done");
    }
    catch(error){
        console.log(error);
        return res.status(400).json("Done")    
    }
})

app.get('/blog/posts', async (req,res) => {
    try{
       const posts = await Post.find();
       res.json(posts); 
    }
    catch(error){
        console.log(error);
        res.status(400).json("Done");
    }
})

app.post('/blog/postComment', async (req, res) => {
    const {email, content, id} = req.body;
    try {
        const userEmail = await User.findOne({email: email});
        const date = new Date(Date.now());
        if(!userEmail){
            return res.status(400).json("Please Login First");
        }
        const comment = {
            id: userEmail.name + Date.now(),
            email: userEmail.email,
            name: userEmail.name,
            photo: userEmail.image,
            time: date,
            content: content,
        }
        const post = await Post.findOne({_id: id});
        post.comments.push(comment);
        await post.save();
        return res.status(200).json("Done");

    }
    catch(error){
        console.log(error);
        return res.status(400).json("Error");    
    }
})

app.post('/blog/getComments', async (req, res) => {
    const {id} = req.body;
    try {
        const post = await Post.findOne({_id: id});
        res.status(200).json(post.comments);
    }
    catch(error){
        console.log(error);
        return res.status(400).json("Error");    
    }
})

app.post('/blog/addFriend', async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email : email})
        const friend = user.friends;
        const req = user.friendRequests;
        const users = await User.find();
        const include = users.map(user => ({
            name: user.name,
            email: user.email,
            id: user._id,
            photo: user.image
        }));
        const myself = [user.email]
        const exclude = new Set([
            ...friend.map(user => user.email),
            ...req.map(user => user.email),
            ...myself
        ])

        const filtered = include.filter(user => !exclude.has(user.email));
        res.status(200).json(filtered);
    }
    catch(error){
        console.log(error);
        res.status(400).json("Error");
    }
})

app.post('/blog/sendReq', async (req, res) => {
    const {userEmail, email} = req.body;
    
    try {
        const sender = await User.findOne({email: userEmail});
        const receiver = await User.findOne({email: email});
        const first = {
            id: receiver._id,
            email: receiver.email,
            name: receiver.name,
            photo: receiver.image,
            type: "Sent"
        }
        const second = {
            id: sender._id,
            email: sender.email,
            name: sender.name,
            photo: sender.image,
            type: "Accept"
        }
        sender.friendRequests.push(first);
        receiver.friendRequests.push(second);

        await sender.save();
        await receiver.save();
        res.status(200).json("Done");
    }
    catch(error){
        console.log(error);
        res.status(400).json("Error");
    }
})

app.post('/blog/friendReq', async (req, res) => {
    const {email} = req.body;
    try {
        const userEmail = await User.findOne({email: email})
        res.status(200).json(userEmail.friendRequests);
    }
    catch(error){
        console.log(error);
        res.status(400).json("Done");    
    }
})

app.post('/blog/reqDecline', async (req, res) => {
    const {userEmail, email} = req.body;
    try {
        const sender = await User.findOne({email: userEmail});
        const receiver = await User.findOne({email: email});

        const idx1 = sender.friendRequests.findIndex(item => item.email === email);
        if(idx1 != -1){
            sender.friendRequests.splice(idx1, 1);
        }
        const idx2 = receiver.friendRequests.findIndex(item => item.email === userEmail);
        if(idx2 != -1){
            receiver.friendRequests.splice(idx2, 1);
        }
        await sender.save();
        await receiver.save();
        res.status(200).json("Done");
    }
    catch(error){
        console.log(error);
        res.status(400).json("Error")    
    }
})

app.post('/blog/reqAccept', async (req, res) => {
    const {email, userEmail} = req.body;
    try {
        const sender = await User.findOne({email: userEmail});
        const receiver = await User.findOne({email: email});

        const idx1 = sender.friendRequests.findIndex(item => item.email === email);
        if(idx1 != -1){
            sender.friends.push(sender.friendRequests[idx1]);
            sender.friendRequests.splice(idx1, 1);
        }
        const idx2 = receiver.friendRequests.findIndex(item => item.email === userEmail);
        if(idx2 != -1){
            receiver.friends.push(receiver.friendRequests[idx2]);
            receiver.friendRequests.splice(idx2, 1);
        }
        await sender.save();
        await receiver.save();
        res.status(200).json("Done");
    }
    catch(error){
        console.log(error);
        res.status(400).json("Error")    
    }

})

app.post('/blog/friends', async (req, res) => {
    const {email} = req.body;
    try {
        const userEmail = await User.findOne({email: email})
        res.status(200).json(userEmail.friends);
    }
    catch(error){
        console.log(error);
        res.status(400).json("Done");    
    }
})

app.post('/blog/remove', async (req, res) => {
    const {userEmail, email} = req.body;
    try {
        const sender = await User.findOne({email: userEmail});
        const receiver = await User.findOne({email: email});

        const idx1 = sender.friends.findIndex(item => item.email === email);
        if(idx1 != -1){
            sender.friends.splice(idx1, 1);
        }
        const idx2 = receiver.friends.findIndex(item => item.email === userEmail);
        if(idx2 != -1){
            receiver.friends.splice(idx2, 1);
        }
        await sender.save();
        await receiver.save();
        res.status(200).json("Done");
    }
    catch(error){
        console.log(error);
        res.status(400).json("Error")    
    }
})

app.post('/blog/uploadAudio', audioUploads.single('file'), (req,res) => {
    try {
        res.status(200).send('Audio uploaded successfully');
      }
      catch(error){
        console.log(error);
        res.status(500).send('Failed to upload audio');
      }
})

app.post('/blog/addNote', async (req, res) => {
    const note = req.body;
    try {
        const newNote = new Note({
            id: note.id,
            name: note.name,
            email: note.email,
            content: note.content,
            userImg: note.userImg,
            photo: note.filename,
            audio: note.audioName,
        })

        await newNote.save();
        res.status(200).json('Done');
    }
    catch(error){
        console.log(error);
        res.status(400).json("Error");    
    }
})

app.post('/blog/fetchNotes', async (req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email: email});
        const notes = await Note.find();

        const friends = user.friends.map(friend => friend.email);
        friends.push(user.email);
        const filtered = notes.filter(note => friends.includes(note.email));
        res.status(200).json(filtered);
    }
    catch(error){
        console.log(error);
        res.status(400).json("Error");
    }
})

app.post('/blog/chatFriends', async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email: email});
        const friends = user.friends;
        return res.status(200).json(friends);
    }
    catch(error){
        console.log(error);
        return res.status(400).json("Error");
    }
})

app.post('/blog/chatHistory', async (req, res) => {
    const {users} = req.body;
    try {
        const chatter = await Message.findOne({ users:  { $all: users  } })
        if(chatter){
            return res.status(200).json(chatter);
        }
        else{
            return res.status(200).json({chat: []})
        }
    }
    catch(error){
        console.log(error);
        return res.status(400).json("Error");    
    }
})

app.listen(5000, () => {
    console.log("Listening...")
})

server.listen(3000, () => {
    console.log("Chat Listening...");
})



