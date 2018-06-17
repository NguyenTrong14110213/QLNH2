const User =require('../models/user');
const jwt = require('jsonwebtoken');
const config =require('../config/database');

module.exports=(router,io)=>{
    router.post('/register', (req,res)=>{
        if(!req.body.email){
            res.json({success:false, message:'Bạn phải nhập e-mail'});
        }else{
            if(!req.body.username){
                res.json({success:false, message:'Bạn phải nhập tên đăng nhập'});
            }else{  
                if(!req.body.password){
                    res.json({success:false, message:'Bạn phải nhập mật khẩu'});
                }else{
                    if(!req.body.fullname){
                        res.json({success:false, message:'Bạn phải nhậpn họ tên'});
                    }else{
                        if(!req.body.gender){
                            res.json({success:false, message:'Bạn phải nhập giới tính'});
                        }else{
                            if(!req.body.identity_card){
                                res.json({success:false, message:'Bạn phải nhập số chứng minh thư'});
                            }else{
                                if(!req.body.phone){
                                    res.json({success:false, message:'Bạn phải nhập số điện thoại'});
                                }else{
                                    let user =new User({
                                        email: req.body.email.toLowerCase(),
                                        username: req.body.username.toLowerCase(),
                                        password: req.body.password,
                                        fullname: req.body.fullname,
                                        gender: req.body.gender,
                                        birthdate: req.body.birthdate,
                                        identity_card:req.body.identity_card,
                                        phone:req.body.phone,
                                        address:req.body.address,
                                        type_account:req.body.type_account,
                                        url_profile: req.body.url_profile
                                    });
                                    user.save((err)=>{
                                        if(err){
                                            if(err.code===11000)
                                            {
                                                res.json({success:false, message: 'Tên người dùng hoặc email đã sử dụng!'});
                                            }else{
                                                if(err.errors){
                                                    if(err.errors.email){
                                                        res.json({success:false, message: err.errors.email.message});
                                                    }else{
                                                        if(err.errors.username){
                                                            res.json({success:false, message: err.errors.username.message});
                                                        }else{
                                                            if(err.errors.identity_card){
                                                                res.json({success:false, message: err.errors.identity_card.message});
                                                            }else{
                                                                if(err.errors.phone){
                                                                    res.json({success:false, message: err.errors.phone.message});
                                                                }else{
                                                                    res.json({success:false, message:err});
                                                                }
                                                            }
                                                         
                                                        }
                                                    }
                                                }else{
                                                    res.json({success:false, message: 'Không thể đăng ký. Error', err});
                                                }
                                            }
                                        }else{
                                            res.json({ success:true, message:'Đăng ký thành công!'});
                                            io.sockets.emit('server-register', {username: user.username})
                                        }
                                    });
                            
                                }
                            }

                        }
                    }
       
                }

            }
           
        }
    });

    router.get('/checkEmail/:email', (req, res)=>{
        if(!req.params.email){
            res.json({success: false, message: 'Chưa nhập Email!'});
        }else{
            User.findOne({email: req.params.email}, (err, user)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(user){
                        res.json({success:false, message: 'E-mail này đã được sử dụng!'});
                    }else{
                        res.json({success:true, message:'E-mail này hợp lệ.'});
                    }
                }
            });
        }
    });

    router.get('/checkUsername/:username', (req, res)=>{
        if(!req.params.username){
            res.json({success: false, message: 'Chưa nhập tên đăng nhập!'});
        }else{
            User.findOne({username: req.params.username}, (err, user)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(user){
                        res.json({success:false, message: 'Tên đăng nhập này đã được sử dụng'});
                    }else{
                        res.json({success:true, message:'Tên Đăng nhập hợp lệ.'});
                    }
                }
            });
        }
    });

    router.get('/checkIdentity_card/:identity_card', (req, res)=>{
        if(!req.params.identity_card){
            res.json({success: false, message: 'Chưa nhập số CMND!'});
        }else{
            User.findOne({identity_card: req.params.identity_card}, (err, user)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(user){
                        res.json({success:false, message: 'Số CMND này đã được sử dụng'});
                    }else{
                        res.json({success:true, message:'Số CMND hợp lệ.'});
                    }
                }
            });
        }
    });
    router.get('/checkPhone/:phone', (req, res)=>{
        if(!req.params.phone){
            res.json({success: false, message: 'Chưa nhập số điện thoại!'});
        }else{
            User.findOne({phone: req.params.phone}, (err, user)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(user){
                        res.json({success:false, message: 'Số điện thoại này đã được sử dụng'});
                    }else{
                        res.json({success:true, message:'Số điện thoại hợp lệ.'});
                    }
                }
            });
        }
    });
    router.post('/login',(req, res)=>{
        if(!req.body.username){
            res.json({success:false, message:'Chưa nhập tên đăng nhập!'});
        }else{
            if(!req.body.password){
                res.json({success:false, message:'Chưa nhập mật khẩu!'});
            }else{
                User.findOne({username: req.body.username.toLowerCase()},(err, user)=>{
                    if(err){
                        res.json({success:false,message: err});
                    }else{
                        if(!user){
                            res.json({success:false, message:'Không tìm thấy tài khoảng.'})
                        }else{
                            const validPassword =user.comparePassword(req.body.password);
                            if(!validPassword){
                                res.json({success:false, message:'Sai mật khẩu.'});
                            }else{
                                const token = jwt.sign({ userId: user._id }, config.secret);
                                res.json({success:true, message:'Đăng nhập thành công!', token:token,
                                 user:{username: user.username, type_account: user.type_account}});
                            }
                        }
                    }
                });
            }
        }
    });

    router.delete('/deleteEmployee/:username', (req, res) => {
        if (!req.params.username) {
          res.json({ success: false, message: 'Chưa cung cấp username' }); 
        } else {
          User.findOne({ username: req.params.username }, (err, user) => {
            if (err) {
              res.json({ success: false, message:err }); 
            } else {
              if (!user) {
                res.json({ success: false, messasge: 'Không tìm thấy nhân viên' }); // Return error message
              } else {
                        user.remove((err) => {
                                if (err) {
                                res.json({ success: false, message: err }); // Return error message
                                } else {
                                    res.json({ success: true, message: 'Nhân viên đã được xóa.' }); // Return success message
                                    io.sockets.emit("server-delete-employee", {username: req.params.username});
                                }
                            });
                        }
                    }
                })
              }
      });
      router.put('/updateEmployee', (req, res) => {
        if (!req.body.username) {
          res.json({ success: false, message: 'Chưa cung cấp username' }); 
        } else {
          User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!user) {
                res.json({ success: false, message: 'Không tìm thấy nhân viên.' }); // Return error message
              } else {
                user.email = req.body.email; // Save latest blog title
                user.fullname =req.body.fullname;
                user.gender=req.body.gender;
                user.birthdate= req.body.birthdate;
                user.identity_card=req.body.identity_card;
                user.phone=req.body.phone;
                user.address =req.body.address;
                user.type_account =req.body.type_account;
                user.birthdate =req.body.birthdate;
                user.address =req.body.address;
                user.save((err) => {
                          if (err) {
                            if (err.errors) {
                                if(err.errors.email){
                                    res.json({success:false, message: err.errors.email.message});
                                    }else{
                                        if(err.errors.identity_card){
                                            res.json({success:false, message: err.errors.identity_card.message});
                                        }else{
                                            if(err.errors.phone){
                                                res.json({success:false, message: err.errors.phone.message});
                                            }else{
                                                if(err.errors.fullname){
                                                    res.json({success:false, message: err.errors.fullname.message});
                                                }else{
                                                    res.json({success:false, message:err});
                                                }
                                               
                                            }
                                                   
                                    }
                                }
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                              //anh muon truyen nguyen cai object user hay la chi username
                            res.json({ success: true, message: 'Thông tin nhân viên đã được cập nhật!'}); // Return success message
                            io.sockets.emit("server-update-employee", {username: user.username});
                        }
                    });
                }
              }
          });
        }
      });
      router.put('/updatePassword', (req, res) => {
        if (!req.body.username) {
          res.json({ success: false, message: 'Chưa cung cấp username' }); 
        } else {
          User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!user) {
                res.json({ success: false, message: 'Không tìm thấy nhân viên.' }); // Return error message
              } else {
                user.password = req.body.password; 
                user.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Thông tin cần chính xác.' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Mật khẩu đã được cập nhật!' }); // Return success message
                          }
                    });
                }
              }
          });
        }
      });
      router.put('/updateActivedEmployee', (req, res) => {
        if (!req.body.username) {
          res.json({ success: false, message: 'Chưa cung cấp username' }); 
        } else {
          User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!user) {
                res.json({ success: false, message: 'Không tìm thấy nhân viên.' }); // Return error message
              } else {
                user.actived = req.body.actived; 
                user.save((err) => {
                          if (err) {
                            if (err.errors) {
                                res.json({ success: false, message: err });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Trạng thái đã được cập nhật!' }); // Return success message
                          }
                    });
                }
              }
          });
        }
      });
    router.use((req, res, next)=>{
       const token= req.headers['authorization'];
        if(!token){
            res.json({success:false, message:'No token provided'});
        }else{
            jwt.verify(token, config.secret, (err, decoded)=>{
                if(err){
                    res.json({success: false, message:'Token invalid: '+ err});
                }else{
                    req.decoded= decoded;
                    next();
                }
            });
        }
    });
    router.get('/profile', (req, res)=>{
        User.findOne({ _id: req.decoded.userId}).select('username email').exec((err, user)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!user){
                    res.json({success:false, message:'User not found'});
                }else{
                    res.json({success:true, user:user});
                }
            }
        });
    });
    router.get('/employee/:username', (req, res)=>{
        if(!req.params.username){
            res.json({success: false, message: 'Chưa nhập username!'});
        }else{
            User.findOne({username: req.params.username}, (err, employee)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(!employee){
                        res.json({success:false, message: 'Không tìm thấy nhân viên.'});
                    }else{
                        res.json({ success: true, employee: employee }); 
                    }
                }
            });
        }
    });
    router.get('/allEmployees/:type_account', (req,res)=>{
        User.find({type_account: req.params.type_account}, (err, employees)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!employees){
                    res.json({success:false, message:'Không tìm nhân viên nào.'});
                }else{
                    res.json({success:true, employees:employees});
                }
            }
        }).sort({'_id':-1});
        
    });

    return router;
}