const User = require('../models/user');// Import User Model Schema
const jwt =require('jsonwebtoken'); // Các phương tiện đại diện cho các yêu cầu được chuyển giao giữa hai bên hợp lý, an toàn với URL.
const Food =require('../models/foods');// Import Blog Model Schema
const config =require('../config/database');// Import cấu hình database 

module.exports =(router)=>{

    // tạo một Category_food  mới 
    router.post('/createFood',(req, res)=>{        
    if(!req.body.id){
        res.json({success: false, message: 'Chưa nhập mã món ăn!'});
    }else{
        if(!req.body.name){
            res.json({success: false, message: 'Chưa nhập tên món!'});
        }else{
            if(!req.body.category_id){
                res.json({success: false, message: 'Chưa nhập mã danh mục!'});
            }else{
                if(!req.body.price_unit){
                    res.json({success: false, message: 'Chưa nhập đơn giá!'});
                    }else{
                        if(!req.body.unit){
                            res.json({success: false, message: 'Chưa nhập đơn vị!'});
                            }else{
                                const food = new Food({
                                    id: req.body.id,
                                    name: req.body.name,
                                    category_id: req.body.category_id,
                                    description: req.body.description,
                                    discount: req.body.discount,
                                    price_unit: req.body.price_unit,
                                    unit: req.body.unit,
                                    url_image: req.body.url_image
                                });
                                food.save((err)=>{
                                    if(err){
                                        if(err.code===11000)
                                        {
                                            res.json({success:false, message: 'Mã hoặc tên danh mục bị trùng!'});
                                        }else{
                                            if(err.errors){
                                                if(err.errors.id){
                                                    res.json({success:false, message: err.errors.id.message});
                                                }else{
                                                    if(err.errors.name){
                                                        res.json({success: false, message: err.errors.name.message});
                                                    }else{
                                                        if(err.errors.description){
                                                            res.json({success: false, message: err.errors.description.message});
                                                        }else{
                                                            if(err.errors.price_unit){
                                                                res.json({success: false, message: err.errors.price_unit.message});
                                                            }else{
                                                                if(err.errors.unit){
                                                                    res.json({success: false, message: err.errors.unit.message});
                                                                }else{
                                                                    if(err.errors.url_image){
                                                                        res.json({success: false, message: err.errors.url_image.message});
                                                                    }else{
                                                                        if(err.errors.discount){
                                                                            res.json({success: false, message: err.errors.discount.message});
                                                                        }else{
                                                                            if(err.errors.category_id){
                                                                                res.json({success: false, message: err.errors.category_id.message});
                                                                            }else{
                                                                                res.json({success :false, message:err});
                                                                            }
                                                                        }
                                                                    }

                                                                }
                                                            }

                                                        }
                                                    }
                                                }
                                            }else{
                                                res.json({success :false, message:err});
                                            }
                                        }
                                    }else{
                                        res.json({success: true, message: 'Đã lưu món ăn!'})
                                    }
                                })
                            }
                        
                    }
                }
            }
        }
    });

    router.get('/checkIdFood/:id', (req, res)=>{
        if(!req.params.id){
            res.json({success: false, message: 'Chưa nhập mã danh mục!'});
        }else{
            Food.findOne({id: req.params.id}, (err, food)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(food){
                        res.json({success:false, message: 'Mã này đã được sử dụng!'});
                    }else{
                        res.json({success:true, message:'Mã này hợp lệ.'});
                    }
                }
            });
        }
    });

    router.get('/checkNameFood/:name', (req, res)=>{
        if(!req.params.name){
            res.json({success: false, message: 'Chưa nhập tên món!'});
        }else{
            Food.findOne({name: req.params.name}, (err, food)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(food){
                        res.json({success:false, message: 'Tên món đã tồn tại.'});
                    }else{
                        res.json({success:true, message:'Tên món hợp lệ.'});
                    }
                }
            });
        }
    });

    router.get('/allFoods', (req, res) => {
        // Search database for all blog posts
        Food.find({}, (err, foods) => {
          // Check if error was found or not
          if (err) {
            res.json({ success: false, message: err }); // Return error message
          } else {
            // Check if blogs were found in database
            if (!foods) {
              res.json({ success: false, message: 'Không tìm thấy món ăn nào.' }); // Return error of no blogs found
            } else {
              res.json({ success: true, foods: foods }); // Return success and blogs array
            }
          }
        }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
      });

    return router;
};
