const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 8000
const io = require('socket.io')(http);
require("./db/cons");
const Register = require('./models/register');
const Login = require('./models/login');
const Contact = require('./models/Contact');
var mongoose = require('mongoose');
const { clearScreenDown } = require('readline');
const { send } = require('process');
app.set("view engine", 'pug')

const msg = new mongoose.Schema({
    Name: String,
    message: String,
    when: Date
});
const msgitem = mongoose.model('msgitem', msg);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const users = {};
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})


app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.post('/', async (req, res) => {
    try {

        const password = req.body.password;
        const Username = req.body.Username;
        // console.log(email, password, Username);
        const nameofuser = await Register.findOne({ Username: Username })
        if ((nameofuser.password === password)) {
            const logg = new Login({
                Username: req.body.Username,
                password: req.body.password,

            })

            const logged = await logg.save();

            res.status(200).render('index');
        }
        else {

            res.status(401).sendFile(__dirname + '/public/err.html')
        }
    }
    catch (err) {

        res.status(401).sendFile(__dirname + '/public/err.html')
    }
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html')
})
app.post('/register',async(req,res)=>{
    try{
       const rege=new Register({
           Username:req.body.Username,
           email:req.body.email,
           password:req.body.password
       })

       const registered=await rege.save();
       res.sendFile(__dirname+'/public/login.html');
    }
    catch(err){
        res.sendFile(__dirname+'/public/regerr.html');
    }
})
app.get('/chat', (req, res) => {
    res.render('index');
})
app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/public/contact.html')
})
app.post('/contact',async(req,res)=>{
    try{
        const con=new Contact({
            name:req.body.name,
            email:req.body.email,
            msg:req.body.msg
        })
 
        const cont=await con.save();
        res.sendFile(__dirname+'/public/consuc.html');
     }
     catch(err){
          res.status(401).send('Bad request');
     }
})


io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
        var it = new msgitem({ Name: users[socket.id], message: message, when: Date.now() });
        it.save(function (err, it) {
            if (err) return console.error(err);
            it.speak;
        });

    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

})
