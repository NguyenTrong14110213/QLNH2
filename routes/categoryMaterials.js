const CategoryMaterials =require('../models/categoryMaterials');// Import Blog Model Schema
const config =require('../config/database');// Import cấu hình database 
const Materials =require('../models/materials');
module.exports =(router,io)=>{
 
    router.post('/createCategoryMaterials',(req, res)=>{
        if(!req.body.id){
            res.json({success: false, message: 'Chưa nhập mã danh mục!'});
        }else{
            if(!req.body.name){
                res.json({success: false, message: 'Chưa nhập tên danh mục!'});
            }else{
                const categoryMaterials = new CategoryMaterials({
                    id: req.body.id,
                    name: req.body.name 
                });
                categoryMaterials.save((err)=>{
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
                                            res.json({success :false, message:err.errmsg});
                                        
                                    }
                                }
                            }else{
                                res.json({success :false, message:er});
                            }
                        }
                        
                    }else{
                        res.json({success: true, message: 'Đã lưu danh mục!'});
                        io.sockets.emit("server-add-categoryMaterials", {categoryMaterials:categoryMaterials});
                    }
                })
            }
        }
    });
    

    router.get('/checkIdCategory/:id', (req, res)=>{
        if(!req.params.id){
            res.json({success: false, message: 'Chưa nhập mã danh mục!'});
        }else{
            CategoryMaterials.findOne({id: req.params.id}, (err, categoryMaterials)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(categoryMaterials){
                        res.json({success:false, message: 'Mã này đã được sử dụng!'});
                    }else{
                        res.json({success:true, message:'Mã này hợp lệ.'});
                    }
                }
            });
        }
    });
    router.get('/checkNameCategory/:name', (req, res)=>{
        if(!req.params.name){
            res.json({success: false, message: 'Chưa nhập tên danh mục!'});
        }else{
            CategoryMaterials.findOne({name: req.params.name}, (err, categoryMaterials)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(categoryMaterials){
                        res.json({success:false, message: 'Tên này đã được sử dụng!'});
                    }else{
                        res.json({success:true, message:'Tên này hợp lệ.'});
                    }
                }
            });
        }
    });
    
    router.get('/allCategoryMaterials', (req, res) => {
        // Search database for all blog posts
        CategoryMaterials.find({}, (err, categoryMaterials) => {
          // Check if error was found or not
          if (err) {
            res.json({ success: false, message: err }); // Return error message
          } else {
            // Check if blogs were found in database
            if (!CategoryMaterials) {
              res.json({ success: false, message: 'Không tìm thấy danh mục nào.' }); // Return error of no blogs found
            } else {
              res.json({ success: true, categoryMaterials: categoryMaterials }); // Return success and blogs array
            }
          }
        }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
      });

      router.delete('/deleteCategoryMaterials/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'Chưa cung cấp mã danh mục' }); 
        } else {
            CategoryMaterials.findOne({ id: req.params.id }, (err, categoryMaterials) => {
            if (err) {
              res.json({ success: false, message:err }); 
            } else {
              if (!categoryMaterials) {
                res.json({ success: false, messasge: 'Không tìm thấy danh mục' }); // Return error message
              } else {
                Materials.findOne({category_id: req.params.id},(err, materials)=>{
                    if(err){
                        res.json({success: false, message:err})
                    }else{
                        if(materials){
                            res.json({success: false, message:'Không thể xóa! Danh mục có chứa nguyên liệu.'});
                        }else{
                            categoryMaterials.remove((err) => {
                                if (err) {
                                res.json({ success: false, message: err }); // Return error message
                                } else {
                                    res.json({ success: true, message: 'Danh mục đã được xóa.' }); // Return success message
                                    io.sockets.emit("server-delete-categoryMaterials", {id: req.params.id});
                                }
                            });
                        }
                    }
                })
              }
            }
                    
            })
        }
      });
      
      router.put('/updateCategoryMaterials', (req, res) => {
        if (!req.body.id) {
          res.json({ success: false, message: 'Chưa cung cấp mã danh mục' }); 
        } else {
            CategoryMaterials.findOne({ id: req.body.id }, (err, categoryMaterials) => {
            if (err) {
              res.json({ success: false, message: 'Không đúng mã danh mục' }); // Return error message
            } else {
              if (!categoryMaterials) {
                res.json({ success: false, message: 'Không tìm thấy danh mục.' }); // Return error message
              } else {
                categoryMaterials.name = req.body.name; // Save latest blog title
                categoryMaterials.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Thông tin cần chính xác.' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Danh mục dã được cập nhật!' }); // Return success message
                            io.sockets.emit("server-update-categoryMaterials", {categoryMaterials:categoryMaterials});
                        }
                    });
                }
              }
          });
        }
      });

    return router;
};
