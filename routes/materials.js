const CategoryMaterials =require('../models/categoryMaterials');// Import Blog Model Schema
const config =require('../config/database');// Import cấu hình database 
const Materials =require('../models/materials');

module.exports =(router,io)=>{

    // tạo một Category_food  mới 
    router.post('/createMaterials',(req, res)=>{        
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
                            }else{ if(!req.body.count){
                                res.json({success: false, message: 'Chưa nhập số lượng!'});
                                }else{ if(!req.body.time){
                                    res.json({success: false, message: 'Chưa nhập ngày!'});
                                    }else{
                                        const materials = new Materials({
                                            id: req.body.id,
                                            name: req.body.name,
                                            category_id: req.body.category_id,
                                            count: req.body.count,
                                            time: req.body.time,                                    
                                            price_unit: req.body.price_unit,
                                            unit: req.body.unit
                                        });
                                        materials.save((err)=>{
                                            if(err){
                                                    if(err.errors){
                                                        if(err.errors.id){
                                                            res.json({success:false, message: err.errors.id.message});
                                                        }else{
                                                            if(err.errors.name){
                                                                res.json({success: false, message: err.errors.name.message});
                                                            }else{
                                                                if(err.errors.count){
                                                                    res.json({success: false, message: err.errors.count.message});
                                                                }else{
                                                                    if(err.errors.price_unit){
                                                                        res.json({success: false, message: err.errors.price_unit.message});
                                                                    }else{
                                                                        if(err.errors.unit){
                                                                            res.json({success: false, message: err.errors.unit.message});
                                                                        }else{
                                                    
                                                                                if(err.errors.time){
                                                                                    res.json({success: false, message: err.errors.time.message});
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
                                                    }else{
                                                        res.json({success :false, message:err});
                                                    }
                                                
                                            }else{
                                                res.json({success: true, message: 'Đã lưu nguyên liệu!'});
                                                io.sockets.emit("server-add-materials", {materials: materials});
                                            }
                                        })
                                    }
                                }
                               
                            }
                        
                    }
                }
            }
        }
    });

    router.delete('/deleteMaterials/:_id', (req, res) => {
        if (!req.params._id) {
          res.json({ success: false, message: 'Chưa cung cấp mã nguyên liệu' }); 
        } else {
            Materials.findOne({ _id: req.params._id }, (err, materials) => {
            if (err) {
              res.json({ success: false, message:err }); 
            } else {
              if (!materials) {
                res.json({ success: false, messasge: 'Không tìm thấy nguyên liệu' }); // Return error message
              } else {
        
                materials.remove((err) => {
                                if (err) {
                                res.json({ success: false, message: err }); // Return error message
                                } else {
                                    res.json({ success: true, message: 'Nguyên liệu đã được xóa.' }); // Return success message
                                    io.sockets.emit("server-delete-materials", {_id: req.params._id});
                                }
                            });
                        
              }
            }
                    
            })
        }
      });



    router.get('/allMaterials/:category_id', (req,res)=>{
        if(req.params.category_id==0){
          Materials.find({}, (err, materials)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!materials){
                    res.json({success:false, message:'Không tìm thấy nguyên liệu nào.'});
                }else{
                    res.json({success:true, materials:materials});
                }
            }
        }).sort({'_id':-1});// sấp sếp theo thứ tự mới nhất
        }else{
            Materials.find({category_id: req.params.category_id}, (err, materials)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!materials){
                    res.json({success:false, message:'Không tìm thấy nguyên liệu nào.'});
                }else{
                    res.json({success:true, materials:materials});
                }
            }
        }).sort({'_id':-1});
        }
    });
    router.get('/getMaterials/:_id', (req,res)=>{
            Materials.findOne({_id: req.params._id}, (err, materials)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!materials){
                    res.json({success:false, message:'Không tìm thấy nguyên liệu nào.'});
                }else{
                    res.json({success:true, materials:materials});
                }
            }
        }).sort({'_id':-1});
        
    });
    router.get('/findMaterials/:keyWord', (req,res)=>{
    Materials.find({$or:[{ id:{ $regex: req.params.keyWord, $options : 'i' } },{name: { $regex: req.params.keyWord, $options : 'i' }},{time: { $regex: req.params.keyWord, $options : 'i' }}]}, (err, materials)=>{
        if(err){
            res.json({success:false, message:err});
        }else{
            if(!materials){
                res.json({success:false, message:'Không tìm thấy nguyên liệu nào.'});
            }else{
                res.json({success:true, materials:materials});
            }
        }
    }).sort({'_id':-1});
    
    });
    
    

    router.put('/updateMaterials', (req, res) => {
        if (!req.body._id) {
          res.json({ success: false, message: 'Chưa cung cấp mã nguyên liệu' }); 
        } else {
          Materials.findOne({ _id: req.body._id }, (err, materials) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!materials) {
                res.json({ success: false, message: 'Không tìm thấy nguyên liệu.' }); // Return error message
              } else {
                materials.id= req.body.id;
                materials.name = req.body.name; // Save latest blog title
                materials.category_id= req.body.category_id;
                materials.count= req.body.count;
                materials.time= req.body.time;                                
                materials.price_unit= req.body.price_unit;
                materials.unit= req.body.unit;

                materials.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Thông tin cần chính xác.' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Thông tin nguyên liệu dã được cập nhật!' }); // Return success message
                            io.sockets.emit("server-update-materials",  {materials: materials});
                          }
                    });
                }
              }
          });
        }
      });

    return router;
};
