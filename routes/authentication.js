const User =require('../models/user');
const jwt = require('jsonwebtoken');
const config =require('../config/database');

module.exports=(router)=>{
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
                                        identity_card:req.body.identity_card,
                                        phone:req.body.phone,
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
                                const token = jwt.sign({ userId: user._id }, config.secret, {expiresIn: '24h'});
                                res.json({success:true, message:'Đăng nhập thành công!', token:token, user:{username: user.username}});
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

    return router;
}