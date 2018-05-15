const express= require('express');
const app =express();
const mongoose =require('mongoose');
const config = require('./config/database');
const path = require('path');
const router= express.Router();
const authentication = require('./routes/authentication')(router);
const categoryFood = require('./routes/categoryFood')(router);
const foods = require('./routes/foods')(router);
const region = require('./routes/region')(router);
const table = require('./routes/table')(router);
const bodyParser =require('body-parser');
const cors = require('cors');
const multer = require('multer');

// const upload = require('express-fileupload');

// app.use(upload()); // configure middleware


app.use(express.static("./public"));
app.use(cors({
    origin: 'http://localhost:4200'
}));

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
    if(err){
        console.log('Could NOT connect to database: ', err);
    } else{
        console.log('Connected to database: ' + config.db);
    }
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/client/dist'));
app.use('/authentication', authentication);
app.use('/foods', foods); 
app.use('/categoryFood',categoryFood);
app.use('/region',region);
app.use('/table',table);
app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname+'/client/dist/index.html'));
});

const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, './public/foods')
    },
    filename: function (req, file, cb) {
       cb(null, file.originalname);
    //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage }).array('imgfood',10);

app.post("/uploadImageFood",(req, res) => {
    upload(req, res, (err)=>{
        if(err) {
            res.json({success :false, message:err});
        }else{
            res.json({success: true, message: 'Đã lưu hình ảnh!'});
        }
    });
});


const server = app.listen(8080,()=>{
    console.log('Listening on port 8080');
})

const socket = require("socket.io");
const io = socket(server);

io.on("connection", function(socket){
    console.log("co nguoi ket noi " + socket.id);
    
    socket.on("client-loadCategoryFoods",(data)=>{
        console.log(data);
        io.sockets.emit("server-loadCategoryFoods", 'Cap nhat danh muc');
    });
    socket.on("client-loadFoods",(data)=>{
        console.log(data);
        io.sockets.emit("server-loadFoods", 'Cap nhat mon');
    });
    socket.on("client-loadRegions", (data)=>{
        console.log(data);
        io.sockets.emit("server-loadRegions", 'Cap nhan khu vuc');
    });
    socket.on("client-loadTables", (data)=>{
        console.log(data);
        io.sockets.emit("server-loadTables", 'Cap nhan ban');
    })
});


