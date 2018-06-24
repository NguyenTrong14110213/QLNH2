const User = require('../models/user');// Import User Model Schema
const jwt = require('jsonwebtoken'); // Các phương tiện đại diện cho các yêu cầu được chuyển giao giữa hai bên hợp lý, an toàn với URL.
const config = require('../config/database');// Import cấu hình database 
const Order = require('../models/order');

module.exports = (router,io) => {

    router.post('/createOrder', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'Chưa nhập mã order!' });
        } else if (!req.body.waiter_username) {
            res.json({ success: false, message: 'Chưa nhập tài khoản nhân viên phục vụ!' });
        } else if (!req.body.waiter_fullname) {
            res.json({ success: false, message: 'Chưa nhập tên nhân viên phục vụ!' });
        } else if (!req.body.flag_status) {
            res.json({ success: false, message: 'Chưa nhập cờ trạng thái' });
        } else if (!req.body.flag_set_table) {
            res.json({ success: false, message: 'Chưa nhập cờ đặt bàn trước!' });
        } else if (!req.body.number_customer) {
            res.json({ success: false, message: 'Chưa nhập số lượng khách!' });
        } else {
            const order = new Order({
                id: req.body.id,
                customer_username: req.body.customer_username,
                customer_fullname:  req.body.customer_fullname,
                waiter_username :  req.body.waiter_username,
                waiter_fullname :  req.body.waiter_fullname,
                cashier_username :  req.body.cashier_username,
                cashier_fullname :  req.body.cashier_fullname,
                flag_status:  req.body.flag_status,
                flag_set_table: req.body.flag_set_table,
                time_set_table: req.body.time_set_table,
                paid_cost: req.body.paid_cost,
                final_cost: req.body.final_cost,
                description: req.body.description,
                tables: req.body.tables,
                region_id: req.body.region_id,
                region_name:req.body.region_name,
                detail_orders: req.body.detail_orders,
                number_customer:req.body.number_customer,
               
            });
            order.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Mã hóa đơn bị trùng!' });
                    } else {
                        if (err.errors) {
                            res.json({ success: false, message: err });
                        }
                    }
            
                } else {
                    res.json({ success: true, message: 'Đã lưu hóa đơn!' });
                   io.sockets.emit("server-create-order", { order: order });
                }
            })
        }

    });

    router.get('/allOrders/:region_id', (req,res)=>{
  
            Order.find({region_id: req.params.region_id, flag_status: 2}, (err, order)=>{
            if(err){
                res.json({success:false, message:err});
            }else{
                if(!order){
                    res.json({success:false, message:'Không tìm thấy hóa đơn nào.'});
                }else {
                    res.json({success:true, order:order});

                }
            }
        }).sort({'_id':-1});
        });
        
        router.get('/getOrder/:id', (req, res)=>{
            if(!req.params.id){
                res.json({success: false, message: 'Chưa nhập mã hóa đơn!'});
            }else{
                Order.findOne({id: req.params.id}, (err, order)=>{
                    if(err){
                        res.json({success:false, message:err});
                    }else{
                        if(!order){
                            res.json({success:false, message: 'Không tìm thấy món ăn.'});
                        }else{
                            res.json({ success: true, order: order }); 
                        }
                    }
                });
            }
        });

        router.put('/updateStatusOrder', (req, res) => {
            if (!req.body.id) {
              res.json({ success: false, message: 'Chưa cung cấp mã món' }); 
            } else {
              Order.findOne({ id: req.body.id }, (err, order) => {
                if (err) {
                  res.json({ success: false, message: err }); // Return error message
                } else {
                  if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn.' }); // Return error message
                  } else {
                    order.flag_status = req.body.flag_status; 
                    order.save((err) => {
                              if (err) {
                                if (err.errors) {
                                    res.json({ success: false, message: err });
                                } else {
                                  res.json({ success: false, message: err }); // Return error message
                                }
                              } else {
                                res.json({ success: true, message: 'Trạng hóa đơn đã được thanh toán!' }); // Return success message
                                io.sockets.emit("server-update-status-order",  {order: order});
                            }
                        });
                    }
                  }
              });
            }
          });
    return router;
};





