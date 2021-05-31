const mongoose = require('mongoose');

const regschema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique:true,
        // sparse:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // index:true,
        // sparse:true
    },
    password: {
        type: String,
        required: true
    }

})

const Register=new mongoose.model("Register",regschema);
module.exports=Register;