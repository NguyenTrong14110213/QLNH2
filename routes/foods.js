const User = require('../models/user');// Import User Model Schema
const jwt =require('jsonwebtoken'); // Các phương tiện đại diện cho các yêu cầu được chuyển giao giữa hai bên hợp lý, an toàn với URL.
const Food =require('../models/foods');// Import Blog Model Schema
const config =require('../config/database');// Import cấu hình database 
const fs = require('fs');
const Order = require('../models/order');
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
                    var foodID = food.id

                    var oldPrice = parseInt(food.price_unit)
                    var oldDiscount = parseInt(food.discount)
                    var newPrice = parseInt(req.body.price_unit)
                    var newDiscount = parseInt(req.body.discount)

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
                            if(oldPrice != newPrice || oldDiscount != newDiscount){
                                var promise = new Promise((resolve,reject)=>{
                                    Order.find({$or:[{flag_status:C.CREATING_FLAG}, {flag_status:C.PENDING_FLAG}]}, (err, orders)=>{
                                        if(err){
                                            reject(err)
                                        }else{
                                            orders.map((order)=>{
                                                var constainThisFood = false
                                                var finalCost = order.final_cost
    
                                                var detail_orders = order.detail_orders
                                                var size = detail_orders.length
                                                for(var i = 0; i < size; i ++){
                                                    var detail = detail_orders[i]
                                                    if(detail.food_id == foodID){
                                                        constainThisFood = true

                                                        var _oldPrice = parseInt(detail.price_unit)
                                                        var _oldDiscount = parseInt(detail.discount)
                                                        var count = parseInt(detail.count)
                                                        finalCost = finalCost + ((newPrice - newDiscount) - (_oldPrice - _oldDiscount)) * count
                                                        
                                                        detail.food_name = food.name
                                                        detail.price_unit = food.price_unit
                                                        detail.discount = food.discount
                                                        order.detail_orders.set(i, detail)
                                                    }
                                                }
                                                if(constainThisFood){
                                                    order.final_cost = finalCost
                                                    order.save((err)=>{
                                                        if(err){
                                                            console.log("update food ==> update order failed:error:"+err)
                                                        }else{
                                                            // console.log("update food ==> update order succes")
                                                            io.sockets.emit("server-update-order", { order })
                                                        }
                                                        resolve()
                                                    })
                                                }else{
                                                    resolve()
                                                }
                                            })
                                        }
                                    })
                                })
                                
                                Promise.all(promise)
                                .then(()=>{
                                    console.log("update food and update order")
                                    res.json({ success: true, message: 'Đã lưu thông tin món' })
                                    io.sockets.emit("server-update-food",  {food: food})
                                }, (err)=>{
                                    console.log("update food but count error when update order")
                                    res.json({ success: true, message: 'Đã lưu thông tin món' })
                                    io.sockets.emit("server-update-food",  {food: food})
                                })
                            }
                            else{
                                res.json({ success: true, message: 'Thông tin món ăn dã được cập nhật!' }); // Return success message
                                io.sockets.emit("server-update-food",  {food: food});
                            }
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
                        
                            
                            const arrayIndex = food.url_image.indexOf(req.body.url_image); 
                            food.url_image.splice(arrayIndex, 1); // Remove 
                            food.save((err) => {
                                // Check if error was found
                                if (err) {
                                  res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                } else {
                                    fs.unlink('public/foods/'+ req.body.url_image, (err) => {
                                        if (err) throw err;
                                    });
                                  res.json({ success: true, message: 'Xóa ảnh thành công!' }); // Return success message
                                  io.sockets.emit("server-delete-image-food",  {food: food});
                                }
                              });

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

      router.get('/findFood/:keyWord', (req,res)=>{
        Food.find({name: { $regex: req.params.keyWord, $options : 'i'} }, (err, food)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!food){
                    res.json({success:false, message:'Không tìm thấy món ăn nào.'});
                }else{
                    res.json({success:true, food:food});
                }
            }
        }).sort({'_id':-1});
        
        });
        // đặt món cho order
    // body cung cấp mã món, số lượng tồn kho lưu trong client (để đối chiếu với db), 
    // số lượng đặt phát sinh
    router.put('/orderFood', (req, res) => {
        if (!req.body.foodID) {
          res.json({ success: false, message: 'Chưa cung cấp mã món' }); 
        } else {
          Food.findOne({ id: req.body.foodID }, (err, food) => {
            if (err) {
              res.json({ success: false, message:err }); // Return error message
            } else {
              if (!food) {
                res.json({ success: false, message: 'Không tìm thấy món.' }); // Return error message
              } else {
                if(!food.actived){
                    res.json({ success: false, message: 'Món không hoạt động.' });
                }else{
                    if(food.inventory != req.body.inventory){
                        res.json({ success: false, message: 'Thông tin lượng tồn kho sai lệch' }); // Return error message
                    }else{
                        const oldCount = req.body.oldCount;
                        const newCount = req.body.newCount;
                        const extra = newCount - oldCount;
                        if(food.inventory - extra < 0){
                            res.json({ success: false, message: 'Số lượng đặt vượt quá lượng tồn kho' });
                        }else{
                            if(newCount < 0){
                                res.json({ success: false, message: 'Số lượng đặt món không thể âm' });
                            }else{
                                food.inventory = food.inventory - extra;
                                
                                food.save((err) => {
                                    if (err) {
                                      if (err.errors) {
                                        res.json({ success: false, message: 'Lưu thông tin thất bại. Thông tin cần chính xác.', error:err.errors});
                                      } else {
                                        res.json({ success: false, message: "Lỗi lưu thông tin trên server", error:err }); // Return error message
                                      }
                                    } else {
                                    //   res.json({ success: true, message: 'Đặt món thành công!', 
                                    //   order_id:req.body.orderID, new_count:newCount, food:food});
                                      res.json({ success: true, message: 'Đặt món thành công!', food:food});
                                      io.sockets.emit("server-order-food",  {food: food});
                                    }
                              });
                            }
                        }
                    }
                }
              }
              }
            });
        }
    });
    
    // remove món khỏi hóa đơn
    router.post('/removeFoodFromOrder', (req, res) => {
        // console.log("removeFoodFromOrder:"+JSON.stringify(req.body))
        if(!req.body.orderID){
            res.json({ success: false, message: 'Chưa cung cấp mã hóa đơn !' }); 
        }
        else if (!req.body.foodID) {
          res.json({ success: false, message: 'Chưa cung cấp mã món !' }); 
        } 
        else if (!req.body.count) {
          res.json({ success: false, message: 'Chưa cung cấp số lượng đã đặt !' }); 
        }else {
          var foodID = req.body.foodID
          var orderID = req.body.orderID
          Food.findOne({ id: foodID }, (err, food) => {
            if (err) {
                // console.log("remove food from order failed:find failed:"+err)
              // error tồn tại nghĩa là lỗi khi thao tác trên server
              res.json({ success: false, message:"Không tìm được món", error:err }); 
            } else {
              if (!food) {
                res.json({ success: false, message: 'Không tìm thấy món.' });
              } else {
                food.inventory = parseInt(food.inventory) + parseInt(req.body.count)
                food.save((err)=>{
                    if (err) {
                        console.log("remove food from order failed:error:"+err)
                        // error tồn tại nghĩa là lỗi khi thao tác trên server
                        res.json({ success: false, message:"Lỗi xử lý trên server", error:err }); 
                      } else {
                        Order.findOne({id : orderID}, (err,order)=>{
                            if(err){
                                res.json({ success: false, message: 'Tìm hóa đơn gặp lỗi', error: err })
                            }else{
                                var i = 0
                                var length = order.detail_orders.length

                                while(i<length){
                                    if(order.detail_orders[i].food_id == foodID){
                                        console.log("remove food from order : find detail order")
                                        order.detail_orders.splice(i,1)
                                        break
                                    }
                                    i++
                                }
                                order.save((err)=>{
                                    if(err){
                                        res.json({ success: true, message:"Hủy món thất bại do lỗi trên server", error: err});
                                    }else{
                                        console.log("remove food from order success")
                                        res.json({ success: true, message:"Hủy món thành công"});
                                    }
                                })
                            }
                        })
                    }
                })
              }
            }
          });
        }
      });
    return router;
};
