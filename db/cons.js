const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://My-proj:vLdrF9ZcEHqeSaG@myproj.bqul5.mongodb.net/chats?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
    

}).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log('no connection');
})