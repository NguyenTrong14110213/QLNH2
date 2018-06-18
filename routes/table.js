const User = require('../models/user');// Import User Model Schema
const jwt =require('jsonwebtoken'); // Các phương tiện đại diện cho các yêu cầu được chuyển giao giữa hai bên hợp lý, an toàn với URL.
const config =require('../config/database');// Import cấu hình database 
const Table =require('../models/tables');

module.exports =(router,io)=>{
    
    router.post('/createTable',(req, res)=>{
       
        if(!req.body.id){
            res.json({success: false, message: 'Chưa nhập mã bàn!'});
        }else{
            if(!req.body.region_id){
                res.json({success: false, message: 'Chưa nhập mã khu vực!'});
            }else{
                const table = new Table({
                    id: req.body.id,
                    region_id: req.body.region_id
                });
                table.save((err)=>{
                    if(err){
                        if(err.code===11000)
                        {
                            res.json({success:false, message: 'Mã bàn bị trùng!'});
                        }else{
                            if(err.errors){
                                if(err.errors.id){
                                    res.json({success:false, message: err.errors.id.message});
                                }else{
                                    if(err.errors.region_id){
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
                        res.json({success: true, message: 'Đã lưu bàn!'});
                        io.sockets.emit("server-add-table", {table:table});
                    }
                })
            }
        }
    });
    router.get('/checkIdTable/:id', (req, res)=>{
        if(!req.params.id){
            res.json({success: false, message: 'Chưa nhập mã bàn!'});
        }else{
            Table.findOne({id: req.params.id}, (err, table)=>{
                if(err){
                    res.json({success:false, message:err});
                }else{
                    if(table){
                        res.json({success:false, message: 'Mã này đã được sử dụng!'});
                    }else{
                        res.json({success:true, message:'Mã này hợp lệ.'});
                    }
                }
            });
        }
    });
    
    router.get('/allTables/:region_id', (req,res)=>{
        if(req.params.region_id==0){
          Table.find({}, (err, tables)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!tables){
                    res.json({success:false, message:'Không tìm thấy bàn nào.'});
                }else{
                    res.json({success:true, tables:tables});
                }
            }
        }).sort({'_id':-1});// sấp sếp theo thứ tự mới nhất
        }else{
            Table.find({region_id: req.params.region_id}, (err, tables)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!tables){
                    res.json({success:false, message:'Không tìm thấy bàn nào.'});
                }else{
                    res.json({success:true, tables:tables});
                }
            }
        }).sort({'_id':-1});
        }
    });

      router.delete('/deleteTable/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'Chưa cung cấp mã bàn.' }); 
        } else {
          Table.findOne({ id: req.params.id }, (err, table) => {
            if (err) {
              res.json({ success: false, message:err }); 
            } else {
              if (!table) {
                res.json({ success: false, messasge: 'Không tìm thấy bàn.' }); // Return error message
              } else {
                        if(table.order_id !=''){
                            res.json({success: false, message:'Không thể xóa! Bàn đang hoạt động.'});
                        }else{
                            table.remove((err) => {
                                if (err) {
                                res.json({ success: false, message: err }); // Return error message
                                } else {
                                    res.json({ success: true, message: 'Bàn đã được xóa.' }); // Return success message
                                    io.sockets.emit("server-delete-table", {id: req.params.id});
                                }
                            });
                        }
                    }
            }
                    
            })
        }
      });
      router.put('/updateActivedTable', (req, res) => {
        if (!req.body.id) {
          res.json({ success: false, message: 'Chưa cung cấp mã bàn' }); 
        } else {
          Table.findOne({ id: req.body.id }, (err, table) => {
            if (err) {
              res.json({ success: false, message: err }); // Return error message
            } else {
              if (!table) {
                res.json({ success: false, message: 'Không tìm thấy bàn.' }); // Return error message
              } else {
                table.actived = req.body.actived; 
                table.save((err) => {
                          if (err) {
                            if (err.errors) {
                                res.json({ success: false, message: err });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Trạng thái đã được cập nhật!' }); // Return success message
                            io.sockets.emit("server-update-active-table",  {table:table});
                        }
                    });
                }
              }
          });
        }
      });
    return router;
};
