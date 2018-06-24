const User = require('../models/user');// Import User Model Schema
const jwt =require('jsonwebtoken'); // Các phương tiện đại diện cho các yêu cầu được chuyển giao giữa hai bên hợp lý, an toàn với URL.
const Food =require('../models/foods');// Import Blog Model Schema
const config =require('../config/database');// Import cấu hình database 
const fs = require('fs');

module.exports =(router,io)=>{

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
                                    inventory:req.body.inventory,
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
                                        res.json({success: true, message: 'Đã lưu món ăn!'});
                                        io.sockets.emit("server-add-food", {food: food});
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


    router.get('/allFoods/:category_id', (req,res)=>{
        if(req.params.category_id==0){
          Food.find({}, (err, foods)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!foods){
                    res.json({success:false, message:'Không tìm thấy món nào.'});
                }else{
                    res.json({success:true, foods:foods});
                }
            }
        }).sort({'_id':-1});// sấp sếp theo thứ tự mới nhất
        }else{
            Food.find({category_id: req.params.category_id}, (err, foods)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!foods){
                    res.json({success:false, message:'Không tìm thấy món nào.'});
                }else{
                    res.json({success:true, foods:foods});
                }
            }
        }).sort({'_id':-1});
        }
    });
    
      router.get('/food/:id', (req, res)=>{
        if(!req.params.id){
            res.json({success: false, message: 'Chưa nhập mã món!'});
        }else{
            Food.findOne({id: req.params.id}, (err, food)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(!food){
                        res.json({success:false, message: 'Không tìm thấy món ăn.'});
                    }else{
                        res.json({ success: true, food: food }); 
                    }
                }
            });
        }
    });

    router.put('/updateFood', (req, res) => {
        if (!req.body.id) {
          res.json({ success: false, message: 'Chưa cung cấp mã món' }); 
        } else {
          Food.findOne({ id: req.body.id }, (err, food) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!food) {
                res.json({ success: false, message: 'Không tìm thấy món.' }); // Return error message
              } else {
                food.name = req.body.name; // Save latest blog title
                food.category_id= req.body.category_id;
                food.description= req.body.description;
                food.discount= req.body.discount;          
                food.inventory= req.body.inventory;                        
                food.price_unit= req.body.price_unit;
                food.unit= req.body.unit;

                food.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Thông tin cần chính xác.' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Thông tin món ăn dã được cập nhật!' }); // Return success message
                            io.sockets.emit("server-update-food",  {food: food});
                          }
                    });
                }
              }
          });
        }
      });
      router.put('/deleteImage/',(req, res)=>{
          if(!req.body.id){
              res.json({success:false, message:'Mã món ăn chưa được cung cấp'});
          }else{
              Food.findOne({id: req.body.id}, (err, food)=>{
                  if(err){
                      res.json({success:false, message:err});
                  }else{
                      if(!food){
                          res.json({success:false, message:'Không tìm thấy món'});
                      }else{
                          if(!food.url_image.includes(req.body.url_image)){
                            res.json({success:false, message:'Không tìm thấy ảnh'});
                          }else{
                            
                            const arrayIndex = food.url_image.indexOf(req.body.url_image); 
                            food.url_image.splice(arrayIndex, 1); // Remove 
                            food.save((err) => {
                                // Check if error was found
                                if (err) {
                                  res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                } else {
                                    fs.unlink('public/foods/'+ req.body.url_image, (err) => {
                                        if (err) throw err;
                                        console.log('path/file.txt was deleted');
                                    });
                                  res.json({ success: true, message: 'Xóa ảnh thành công!' }); // Return success message
                                  io.sockets.emit("server-delete-image-food",  {food: food});
                                }
                              });

                          }
                      }
                  }
              })
          }
      });
      router.put('/addImage/',(req, res)=>{
        if(!req.body.id){
            res.json({success:false, message:'Mã món ăn chưa được cung cấp'});
        }else{
            Food.findOne({id: req.body.id}, (err, food)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(!food){
                        res.json({success:false, message:'Không tìm thấy món'});
                    }else{

                        for(let i =0; i < req.body.url_image.length; i++){
                            food.url_image.push(req.body.url_image[i]);
                           }
                          food.save((err) => {
                              // Check if error was found
                              if (err) {
                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                              } else {
                                res.json({ success: true, message: 'Thêm ảnh thành công!' }); // Return success message
                                io.sockets.emit("server-add-image-food", {food: food});
                            }
                            });
                    }
                }
            })
        }
    });
    router.put('/updateActivedFood', (req, res) => {
        if (!req.body.id) {
          res.json({ success: false, message: 'Chưa cung cấp mã món' }); 
        } else {
          Food.findOne({ id: req.body.id }, (err, food) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!food) {
                res.json({ success: false, message: 'Không tìm thấy món.' }); // Return error message
              } else {
                food.actived = req.body.actived; 
                food.save((err) => {
                          if (err) {
                            if (err.errors) {
                                res.json({ success: false, message: err });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Trạng thái đã được cập nhật!' }); // Return success message
                            io.sockets.emit("server-update-ative-food",  {food: food});
                        }
                    });
                }
              }
          });
        }
      });

    return router;
};
