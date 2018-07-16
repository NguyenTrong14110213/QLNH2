const User =require('../models/user');
const jwt = require('jsonwebtoken');
const config =require('../config/database');
const C = require('../config/globalVariables');
const fs = require('fs');

module.exports=(router,io)=>{
   
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
                            res.json({success:false, message:'Không tìm thấy tài khoản.'})
                        }else{
                            if(!user.actived){
                                res.json({success:false, message:'Tài khoản chưa được kích hoạt!.'})
                            }else{
                                if(user.is_logining){
                                    res.json({success:false, message:'Tài khoản đang đăng nhập ở máy khác!.'})
                                }else{
                                const validPassword =user.comparePassword(req.body.password);
                                if(!validPassword){
                                    res.json({success:false, message:'Sai mật khẩu.'});
                                }else{
                                    //user.is_logining = false;
                                    user.save((err)=>{
                                        if(err){
                                            res.json({success: false, message:'Lỗi thao tác trên server', error:"Không thay đổi được dữ liệu trên server"})
                                        }else{
                                            const token = jwt.sign({ userId: user._id }, config.secret);
                                            res.json({success:true, message:'Đăng nhập thành công!', token:token,
                                             user:{username: user.username, type_account: user.type_account}});
                                        }
                                    })
                                    
                                }
                            }
                            }
                          
                        }
                    }
                });
            }
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
                                                    res.json({success:false, message: 'Không thể đăng ký', error: err});
                                                }
                                            }
                                        }else{
                                            res.json({ success:true, message:'Đăng ký thành công!'});
                                            io.sockets.emit('server-register', {user:user})
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
      router.put('/updateProfile', (req, res) => {
        if (!req.body.username) {
          res.json({ success: false, message: 'Chưa cung cấp username' }); 
        } else {
          User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!user) {
                res.json({ success: false, message: 'Không tìm thấy profile.' }); // Return error message
              } else {
                user.email = req.body.email; // Save latest blog title
                user.phone=req.body.phone;
                user.address =req.body.address;
                user.save((err) => {
                          if (err) {
                            if (err.errors) {
                                if(err.errors.email){
                                    res.json({success:false, message: err.errors.email.message});
                                    }else{
                                        if(err.errors.address){
                                            res.json({success:false, message: err.errors.address.message});
                                        }else{
                                            if(err.errors.phone){
                                                res.json({success:false, message: err.errors.phone.message});
                                            }else{
                                    
                                                    res.json({success:false, message:err});
                                                }        
                                            }
                                        }
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Thông tin đã được cập nhật!'}); // Return success message
                            io.sockets.emit("server-update-employee", {user:user});
                        }
                    });
                }
              }
          });
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
                            io.sockets.emit("server-update-employee", {user:user});
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
              res.json({ success: false, message: "Lỗi xử lý dữ liệu", error: err }); 
            } else {
              if (!user) {
                res.json({ success: false, message: 'Không tìm thấy dữ liệu' }); 
              } else {
                  if(!user.actived){
                    res.json({ success: false, message: 'Tài khoản của bạn không còn hoạt động' }); 
                  }else{
                    user.password = req.body.password; 
                    user.save((err) => {
                              if (err) {
                                if (err.errors) {
                                  res.json({ success: false, message: 'Lỗi xử lý dữ liệu', error:err.errors });
                                } else {
                                  res.json({ success: false, message: 'Lỗi xử lý dữ liệu', error:err }); 
                                }
                              } else {
                                res.json({ success: true, message: 'Mật khẩu đã được cập nhật!' });
                                io.sockets.emit("server-update-password",{user:user});
                            }
                        });
                  }
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
                            io.sockets.emit("server-update-active-employee",{user:user});
                        }
                    });
                }
              }
          });
        }
      });
      router.put('/updateAvatar', (req, res) => {
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
                user.url_profile = req.body.url_profile; 
                user.save((err) => {
                          if (err) {
                            if (err.errors) {
                                res.json({ success: false, message: err });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                              if(req.body.usl_profile_old != 'default.png'){
                                fs.unlink('public/avatar/'+ req.body.usl_profile_old, (err) => {
                                    if (err) throw err;
                                });
                              }
                            
                            res.json({ success: true, message: 'Ảnh đại diện đã được cập nhật!' }); // Return success message
                            io.sockets.emit("server-update-avatar-employee",{user:user});
                        }
                    });
                }
              }
          });
        }
      });
    router.get('/profile', (req, res)=>{
        User.findOne({ _id: req.decoded.userId},(err, user)=>{
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
    router.post('/verify',(req, res)=>{
        console.log("verify account")
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
                            res.json({success:false, message:'Không tìm thấy tài khoản.'})
                        }else{
                            if(!user.actived){
                                res.json({success: false, message:'Tài khoản đã ngưng hoạt động!'})
                            }else{
                                const validPassword =user.comparePassword(req.body.password);
                                if(!validPassword){
                                    res.json({success:false, message:'Sai mật khẩu.'});
                                }else{
                                    res.json({success:true, message:'Xác thực thành công!'});
                                }
                            }
                           
                        }
                    }
                });
            }
        }
    });
    
    router.put('/logout',(req, res)=>{
        if(!req.body.username){
            res.json({success:false, message:'Chưa nhập tên đăng nhập!'});
        }
        else{
            User.findOne({username: req.body.username.toLowerCase()},(err, user)=>{
                if(err){
                    res.json({success:false,message: err});
                }else{
                    if(!user){
                        res.json({success:false, message:'Không tìm thấy tài khoản.'})
                    }else{
                        if(!user.actived){
                            res.json({success:false, message:'Tài khoản không hoạt động.'})
                        }
                        else{
                            if(user.is_logining){
                                user.is_logining = false
                                user.save((err)=>{
                                    if(err){
                                        res.json({success:false, message:'Lỗi thao tác trên server. Có thể thử lại.', error:err})
                                    }else{
                                        res.json({success:true, message:'Đăng xuất thành công'})
                                    }
                                })
                            }
                            else{

                                res.json({success:false, message:'Tài khoản này đã đăng xuất'})
                            }
                        }
                    }
                }
            });
        }
    });

    router.post('/findAccount',(req, res)=>{
        
        if(!req.body.username){
            res.json({success:false, message:'Chưa có tên đăng nhập'});
        }
        else{
            var type_account = req.body.type_account

            if(type_account < -1 || type_account > C.ACCOUNT_ADMIN){
                res.json({success:false, message:'Loại tài khoản không hợp lệ'})
            }
            else{
                var username = req.body.username.toLowerCase()
                var query = {}
    
                // tìm trên tất cả các loại tài khoản
                if (type_account == -1){
                    query = {username: username}
                }
                else if (type_account <= C.ACCOUNT_ADMIN){
                    query = {username : username, type_account : type_account}
                }

                User.findOne(query, (err, user)=>{
                    
                    if(err){
                        res.json({success:false, message: "Lỗi khi tìm kiếm tài khoản", error:err});
                    }
                    else{
                        if(!user){
                            res.json({success:false, message:'Không tìm thấy tài khoản.'})
                        }
                        else{
                            var data = {
                                success:true, 
                                message:'Tìm thấy tài khoản!', 
                                username: user.username,
                                fullname: user.fullname,
                                birthdate : user.birthdate,
                                gender : user.gender,
                                url_profile: user.url_profile
                            }

                            res.json(data);
                        }
                    }
                });
            }
        }
    });



    return router;
}