const User = require('../models/user');// Import User Model Schema
const jwt =require('jsonwebtoken'); // Các phương tiện đại diện cho các yêu cầu được chuyển giao giữa hai bên hợp lý, an toàn với URL.
const Region =require('../models/region');// Import Blog Model Schema
const config =require('../config/database');// Import cấu hình database 
const Table =require('../models/tables');
module.exports =(router,io)=>{

    
    // tạo một Category_food  mới 
    router.post('/createRegion',(req, res)=>{
        if(!req.body.id){
            res.json({success: false, message: 'Chưa nhập mã Khu vực!'});
        }else{
            if(!req.body.name){
                res.json({success: false, message: 'Chưa nhập tên Khu vực!'});
            }else{
                const region = new Region({
                    id: req.body.id,
                    name: req.body.name
                });
                region.save((err)=>{
                    if(err){
                        if(err.code===11000)
                        {
                            res.json({success:false, message: 'Mã hoặc tên khu vực bị trùng!'});
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
                                res.json({success :false, message:err});
                            }
                        }
                        
                    }else{
                        res.json({success: true, message: 'Đã lưu khu vực!'});
                        io.sockets.emit("server-add-region", {region: region});
                    }
                })
            }
        }
    });

    router.get('/checkIdRegion/:id', (req, res)=>{
        if(!req.params.id){
            res.json({success: false, message: 'Chưa nhập mã khu vực!'});
        }else{
            Region.findOne({id: req.params.id}, (err, region)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(region){
                        res.json({success:false, message: 'Mã này đã được sử dụng!'});
                    }else{
                        res.json({success:true, message:'Mã này hợp lệ.'});
                    }
                }
            });
        }
    });
    router.get('/checkNameRegion/:name', (req, res)=>{
        if(!req.params.name){
            res.json({success: false, message: 'Chưa nhập tên khu vực!'});
        }else{
            Region.findOne({name: req.params.name}, (err, region)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(region){
                        res.json({success:false, message: 'Tên này đã được sử dụng!'});
                    }else{
                        res.json({success:true, message:'Tên này hợp lệ.'});
                    }
                }
            });
        }
    });
    
    router.get('/allRegions', (req, res) => {
        // Search database for all blog posts
        Region.find({}, (err, region) => {
          // Check if error was found or not
          if (err) {
            res.json({ success: false, message: err }); // Return error message
          } else {
            // Check if blogs were found in database
            if (!region) {
              res.json({ success: false, message: 'Không tìm thấy khu vực nào.' }); // Return error of no blogs found
            } else {
              res.json({ success: true, region: region }); // Return success and blogs array
            }
          }
        }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
      });

      router.delete('/deleteRegion/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'Chưa cung cấp mã Khu vực.' }); 
        } else {
          Region.findOne({ id: req.params.id }, (err, region) => {
            if (err) {
              res.json({ success: false, message:err }); 
            } else {
              if (!region) {
                res.json({ success: false, messasge: 'Không tìm thấy khu vực.' }); // Return error message
              } else {
                Table.findOne({region_id: req.params.id},(err, table)=>{
                    if(err){
                        res.json({success: false, message:err})
                    }else{
                        if(table){
                            res.json({success: false, message:'Không thể xóa! Khu vực tồn tại bàn.'});
                        }else{
                            region.remove((err) => {
                                if (err) {
                                res.json({ success: false, message: err }); // Return error message
                                } else {
                                    res.json({ success: true, message: 'Khu vực đã được xóa.' }); // Return success message
                                    io.sockets.emit("server-delete-region", {id: req.params.id});
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

      router.put('/updateRegion', (req, res) => {
        if (!req.body.id) {
          res.json({ success: false, message: 'Chưa cung cấp mã khu vực.' }); 
        } else {
          Region.findOne({ id: req.body.id }, (err, region) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!region) {
                res.json({ success: false, message: 'Không tìm thấy khu vực.' }); // Return error message
              } else {
                region.name = req.body.name; // Save latest blog title
                region.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: err });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Khu vực dã được cập nhật!' }); // Return success message
                            io.sockets.emit("server-update-region",  {region: region});
                        }
                    });
                }
              }
          });
        }
      });

    return router;
};
