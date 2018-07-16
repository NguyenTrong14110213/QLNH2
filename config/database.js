
const crypto =require('crypto').randomBytes(256).toString('hex');

module.exports={
   // uri:'mongodb://localhost:27017/mean-angular-3',
    uri:'mongodb://nguyentrong14110213:nguyentrong14110213@ds139251.mlab.com:39251/angular-2-qlnh',
    secret:crypto,
    db: 'angular-2-qlnh'
}