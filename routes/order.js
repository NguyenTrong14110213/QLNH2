const jwt = require('jsonwebtoken'); // Các phương tiện đại diện cho các yêu cầu được chuyển giao giữa hai bên hợp lý, an toàn với URL.
const config = require('../config/database');// Import cấu hình database 
const C = require('../config/globalVariables');
const Order = require('../models/order');
const Table = require('../models/tables');
const Food = require('../models/foods');
const User =require('../models/user');
var count =1;

module.exports = (router, io) => {
    // chuyển hóa đơn đã tạo ở route "createOrder" sang trạng thái PENDING và tạo created_time
    router.post('/makeOrder', (req, res)=>{
        if (!req.body.id) {
            res.json({ success: false, message: 'Chưa có mã hóa đơn !' })
        }else{
            Order.findOne({id:req.body.id}, (err,order)=>{
                if(err){
                    res.json({ success: false, message: 'Lỗi tìm kiếm hóa đơn trên server !', error : err })
                }else{
                    var oldStatus = order.flag_status

                    datenow = new Date();
                    yyyy = datenow.getFullYear();
                    MM = datenow.getMonth()+1;
                    if(MM<10)MM = '0' + MM;
                    dd =datenow.getDate();
                    if(dd<10) dd ='0' +dd;
                    hh = datenow.getHours();
                    if(hh<10) hh ='0' +hh;
                    mm = datenow.getMinutes();
                    if(mm<10) mm ='0' +mm;
                    time =  yyyy+'-'+MM+'-'+dd+'T'+hh+':'+mm+':00.000Z'; 
                    
                    order.time_created = time
                    order.flag_status = C.PENDING_FLAG
                    order.save((err)=>{
                        if(err){
                            res.json({ success: false, message: 'Lỗi lưu hóa đơn trên server !', error : err })
                        }else{
                            res.json({ success: true, message: 'Tạo hóa đơn thành công !' })
                            io.sockets.emit("server-update-status-order",  {old_status: oldStatus, order: order});
                        }
                    })
                }
            })
        }
    })
    router.post('/createOrder', (req, res) => {
        // console.log("create new order:request:"+JSON.stringify(req.body))
        if (!req.body.waiter_username) {
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
            // tạo id cho hóa đơn
            var isoString = new Date(Date.now()).toISOString()
            var dateTime = isoString.replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, ' ')
            .replace(/-/g, ' ')
            // console.log("dateTime:"+dateTime)
            var _count = count.toString()
            while(_count.length < 5){
                _count = "0" + _count
            }
            var _id = dateTime + " " + _count

            count++;

            const order = new Order({
                id: _id,
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
                detail_orders: req.body.detail_orders,
                number_customer:req.body.number_customer,
               
            });
            order.save((err) => {
                if (err) {
                    console.log("create order failed:"+err)
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Mã hóa đơn bị trùng!' });
                    } else {
                        if (err.errors) {
                            console.log("createOrder:save failed:not error code 11000:"+err)
                            res.json({ success: false, message: err });
                        }
                    }
            
                } else {
                    Order.findOne({id:order.id}, (err, _order)=>{
                        if(err){
                            res.json({ success: false, message: 'Tạo hóa đơn thành công nhưng không có giá trị trả về', error:err});
                        }else{
                            res.json({ success: true, message: 'Tạo hóa đơn thành công!', order:_order});
                        }
                    })
                   io.sockets.emit("server-create-order", { order: order });
                }
            })
        }

    });

    router.get('/allOrders/:region_id', (req, res) => {
        if (req.params.region_id == 0) {
            Order.find({ $or: [{ flag_status: C.COOKING_FLAG }, { flag_status: C.PREPARE_FLAG }, { flag_status: C.EATING_FLAG }, { flag_status: C.PAYING_FLAG }] }, (err, order) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!order) {
                        res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                    } else {
                        res.json({ success: true, order: order });

                    }
                }
            }).sort({ '_id': -1 });
        } else {
            Order.find({ region_id: req.params.region_id, flag_status: C.COOKING_FLAG }, (err, order) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!order) {
                        res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                    } else {
                        res.json({ success: true, order: order });

                    }
                }
            }).sort({ '_id': -1 });
        }
    });

    router.get('/getOrder/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'Chưa nhập mã hóa đơn!' });
        } else {
            Order.findOne({ id: req.params.id }, (err, order) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!order) {
                        res.json({ success: false, message: 'Không tìm thấy hóa đơn.' });
                    } else {
                        res.json({ success: true, order: order });
                    }
                }
            });
        }
    });

    router.get('/findOrder/:keyWord', (req, res) => {
        var datenow = new Date();
        Order.aggregate([{ $match: { time_created: { $gte: new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate()) } } }, { $match: { $or: [{ customer_username: { $regex: req.params.keyWord, $options: 'i' } }, { customer_fullname: { $regex: req.params.keyWord, $options: 'i' } }, { waiter_username: { $regex: req.params.keyWord, $options: 'i' } }, { waiter_fullname: { $regex: req.params.keyWord, $options: 'i' } }, { tables: { $regex: req.params.keyWord, $options: 'i' } }] } }], (err, order) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy nguyên liệu nào.' });
                } else {
                    res.json({ success: true, order: order });
                }
            }
        }).sort({ '_id': -1 });

    });

    router.get('/getRevenueOfMonth/:MM/:yyyy', (req, res) => {
        //{$project : { month : {$month : "$time_created"},  year : {$year :  "$time_created"}}},
        Order.aggregate([{ $match: { flag_status: C.COMPLETE_FLAG } }, { $match: { time_created: { $gte: new Date(req.params.yyyy, req.params.MM - 1), $lt: new Date(req.params.yyyy, req.params.MM) } } }, { $group: { _id: { day: { $dayOfMonth: "$time_created" }, month: { $month: "$time_created" }, year: { $year: "$time_created" } }, total: { $sum: "$final_cost" } } }], (err, order) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                } else {
                    res.json({ success: true, order: order });
                }
            }
        }).sort({ '_id': -1 });
    });
    router.get('/getRevenueOfYear/:yyyy', (req, res) => {
        //{$project : { month : {$month : "$time_created"},  year : {$year :  "$time_created"}}},
        Order.aggregate([{ $match: { flag_status: C.COMPLETE_FLAG } }, { $match: { time_created: { $gte: new Date(req.params.yyyy, 0), $lt: new Date(req.params.yyyy, 12) } } }, { $group: { _id: { month: { $month: "$time_created" }, year: { $year: "$time_created" } }, total: { $sum: "$final_cost" } } }], (err, order) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                } else {
                    res.json({ success: true, order: order });
                }
            }
        }).sort({ '_id': -1 });
    });

    router.get('/getFoodOfMonth/:MM/:yyyy', (req, res) => {
        //{$project : { month : {$month : "$time_created"},  year : {$year :  "$time_created"}}},
        Order.aggregate([{ $match: { flag_status: C.COMPLETE_FLAG } }, { $match: { time_created: { $gte: new Date(req.params.yyyy, req.params.MM - 1), $lt: new Date(req.params.yyyy, req.params.MM) } } }, { $unwind: "$detail_orders" }, { $group: { _id: {food_id: "$detail_orders.food_id", food_name: "$detail_orders.food_name" ,price_unit: "$detail_orders.price_unit"}, total: { $sum: "$detail_orders.count" } } }], (err, order) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                } else {
                    res.json({ success: true, order: order });
                }
            }
        }).sort({ '_id': -1 });
    });
    router.get('/getFoodOfDay/:dd/:MM/:yyyy', (req, res) => {
        Order.aggregate([{ $match: { flag_status: C.COMPLETE_FLAG } }, { $match: { time_created: { $gte: new Date(req.params.yyyy, req.params.MM - 1,req.params.dd,0), $lt: new Date(req.params.yyyy, req.params.MM - 1,req.params.dd,24)} } }, { $unwind: "$detail_orders" }, { $group: { _id: { food_id: "$detail_orders.food_id", food_name: "$detail_orders.food_name",price_unit: "$detail_orders.price_unit" }, total: { $sum: "$detail_orders.count" } } }], (err, order) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                } else {
                    res.json({ success: true, order: order });
                }
            }
        }).sort({ '_id': -1 });
    });
    router.get('/getAmountCustomersOfMonth/:MM/:yyyy', (req, res) => {
        Order.aggregate([{ $match: { flag_status: C.COMPLETE_FLAG } }, { $match: { time_created: { $gte: new Date(req.params.yyyy, req.params.MM - 1), $lt: new Date(req.params.yyyy, req.params.MM)} } }, { $group: { _id: null, total: { $sum: "$number_customer" } } }], (err, order) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                } else {
                    res.json({ success: true, order: order });
                }
            }
        }).sort({ '_id': -1 });
    });
    router.get('/getAmountCustomersOfDay/:dd/:MM/:yyyy', (req, res) => {
        Order.aggregate([{ $match: { flag_status: C.COMPLETE_FLAG } }, { $match: { time_created: { $gte: new Date(req.params.yyyy, req.params.MM - 1,req.params.dd,0), $lt: new Date(req.params.yyyy, req.params.MM - 1,req.params.dd,24)} } }, { $group: { _id: null, total: { $sum: "$number_customer" } } }], (err, order) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                } else {
                    res.json({ success: true, order: order });
                }
            }
        }).sort({ '_id': -1 });
    });

    router.get('/getRevenueMinYear', (req, res) => {
        Order.aggregate([{ $group: { _id: { $min: { $year: "$time_created" } } } }, { $limit: 1 }], (err, order) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!order) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn nào.' });
                } else {
                    res.json({ success: true, order: order });
                }
            }
        }).sort({ '_id': -1 });
    });


    router.put('/updateStatusOrder', (req, res) => {
        // console.log("updateStatusOrder():request:"+JSON.stringify(req.body))
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
                        var oldStatus = order.flag_status
                        var flag = req.body.flag_status;
                        order.flag_status = flag;

                        var available = true;

                        // nếu là muốn chuyển hóa đơn sang trạng thái sẵn sàng thanh toán
                        if (flag == C.PAYING_FLAG) {
                            // khôi phục lại các bàn trong order
                            var failedTables = [];

                            // tìm tất cả các bàn đã được order
                            Table.find({ order_id: order.id }, (err, tables) => {
                                if(err){
                                    available = false;
                                }else{
                                    for(var _table of tables){
                                        var process = function(__table){
                                            return function(err){
                                                if(err){
                                                    available = false;
                                                    failedTables.push(__table.id)
                                                }
                                            }
                                        }
                                        _table.order_id = ""
                                        _table.save(process(_table))
                                    }
                                }
                            })

                            // không thể thay đổi trạng thái hóa đơn
                            if (!available) {
                                console.log("updateStatusOrder():pay order failed:tables not restore:" + JSON.stringify(failedTables))
                                res.json({
                                    success: false,
                                    message: "Không thể chuyển hóa đơn sang trạng thái sẵn sàng thanh toán", tables: failedTables
                                });
                            }
                        }
                        // có thể thay đổi trạng thái hóa đơn
                        if (available) {
                            order.save((err) => {
                                if (err) {
                                    console.log("updateStatusOrder():update failed:" + err)
                                    if (err.errors) {
                                        res.json({ success: false, message: err });
                                    } else {
                                        res.json({ success: false, message: err }); 
                                    }
                                } else {
                                    res.json({ success: true, message: 'Trạng thái hóa đơn đã được thanh toán!', old_status: oldStatus, order: order });
                                    io.sockets.emit("server-update-status-order", { old_status: oldStatus, order: order });
                                }
                            });
                        }
                    }
                }
            });
        }
    });


    // cập nhật detail order theo orderID và foođID
    router.put('/updateOrCreateDetailOrder', (req, res) => {
        if (!req.body.orderID) {
            res.json({ success: false, message: 'Chưa cung cấp mã order' });
        } else {
            Order.findOne({ id: req.body.orderID }, (err, order) => {
                if (err) {
                    res.json({ success: false, message: err }); // Return error message
                } else {
                    if (!order) {
                        res.json({ success: false, message: 'Không tìm thấy hóa đơn.' }); // Return error message
                    } else {
                        if (typeof order.final_cost === "undefined") {
                            order.final_cost = 0;
                        }
                        var foodID = req.body.foodID

                        // tìm chi tiết hóa đơn có chứa món muốn tìm
                        var i = -1
                        for (i = order.detail_orders.length - 1; i >= 0; i--) {
                            if (order.detail_orders[i].food_id === foodID) {
                                break;
                            }
                        }

                        // không tìm thấy
                        if (i == -1) {
                            if (req.body.newCount == 0) {
                                res.json({ success: false, message: 'Không thể tạo mới chi tiết hóa đơn cho món có số lượng đặt là 0' })
                            } else {

                                var newDetail = {
                                    food_id : foodID,
                                    food_name : req.body.foodName,
                                    price_unit : parseInt(req.body.priceUnit),
                                    discount : req.body.discount,
                                    count : parseInt(req.body.newCount)
                                }
                                order.detail_orders.push(newDetail)
                                order.final_cost = parseInt(order.final_cost) 
                                                    + parseInt(newDetail.count) * (parseInt(newDetail.price_unit) - parseInt(newDetail.discount))
    
                                order.save((err) => {
                                    if (err) {
                                        // console.log("updateOrCreateDetailOrder:create new detail failed:"+ err)
                                        if (err.errors) {
                                            res.json({ success: false, message: "Tạo mới chi tiết hóa đơn thất bại", error: err.errors });
                                        } else {
                                            res.json({ success: false, message: "Tạo mới chi tiết hóa đơn thất bại", err }); // Return error message
                                        }
                                    } else {
                                        res.json({ success: true, message: 'Đặt món thành công', order: order });
                                        io.sockets.emit("server-create-detail-order", { order_id: req.body.orderID, final_cost: order.final_cost, detail_order: newDetail });
                                    }
                                });
                            }
                        } else {
                            var newCount = req.body.newCount

                            // cờ xác định update hay remove detail order
                            var isUpdated = true
                            // hủy chi tiết hóa đơn (==0)
                            if (newCount == 0) {
                                var detail = order.detail_orders[i]
                                order.final_cost = parseInt(order.final_cost)
                                    - parseInt(detail.count) * (parseInt(detail.price_unit) - parseInt(detail.discount))
                                order.detail_orders.splice(i, 1)

                                // remove detail order
                                isUpdated = false
                            }
                            // cập nhật số lượng được đặt (nếu nó lớn hơn 0)
                            else {
                                var detail = order.detail_orders[i]

                                var newPriceUnit = req.body.priceUnit
                                var newDiscount = req.body.discount
                                var newPrice = (parseInt(newPriceUnit) - parseInt(newDiscount)) * parseInt(newCount)

                                var oldCount = parseInt(detail.count)
                                var unitPrice = parseInt(detail.price_unit)
                                var discount = parseInt(detail.discount)

                                var oldPrice = (parseInt(unitPrice) - parseInt(discount)) * parseInt(oldCount)
                                // cập nhật lại tổng tiền trong order và số lượng đặt món trong chi tiết hóa đơn
                                order.final_cost = parseInt(order.final_cost) - parseInt(oldPrice) + parseInt(newPrice)

                                detail.price_unit = newPriceUnit
                                detail.discount = newDiscount
                                detail.count = newCount
                                
                                order.detail_orders.set(i, detail)
                            }

                            order.save((err) => {
                                if (err) {
                                    // console.log("updateOrCreateDetailOrder:update detail order failed:"+JSON.stringify(err))
                                    if (err.errors) {
                                        res.json({ success: false, message: "Cập nhật thông tin thất bại", error: err.errors });
                                    } else {
                                        res.json({ success: false, message: "Cập nhật thông tin thất bại", err }); // Return error message
                                    }
                                } else {
                                    res.json({ success: true, message: 'Đặt món thành công', order: order });

                                    // update detail order
                                    if (isUpdated) {
                                        io.sockets.emit("server-update-detail-order", { order_id: req.body.orderID, final_cost: order.final_cost, detail_order: newDetail });
                                    }
                                    // remove detail order
                                    else {
                                        io.sockets.emit("server-remove-detail-order", { order_id: req.body.orderID, final_cost: order.final_cost, detail_order: newDetail });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    });

    router.put('/orderTable', (req, res) => {
        if (!req.body.orderID) {
            res.json({ success: false, message: "Không có mã order" });
        } else {
            if (!req.body.tableID) {
                res.json({ success: false, message: "Không có mã bàn" });
            } else {
                Table.findOne({ id: req.body.tableID }, (err, table) => {
                    if (err) {
                        res.json({ success: false, message: "Thêm bàn vào order thất bại", error: err }); // Return error message
                    } else {
                        if (!table) {
                            res.json({ success: false, message: 'Không tìm thấy bàn.' }); // Return error message
                        } else {
                            if (table.order_id) {
                                res.json({ success: false, message: 'Bàn đã được order' });
                            } else {
                                table.order_id = req.body.orderID;
                                table.save((err) => {
                                    if (err) {
                                        var _err;
                                        if (err.errors) {
                                            _err = err.errors;
                                        } else {
                                            _err = err;
                                        }
                                        res.json({ success: false, message: "Thêm bàn vào order thất bại", error: _err }); // Return error message
                                    } else {

                                        // add table vào order
                                        Order.findOne({ id: req.body.orderID }, (err, order) => {
                                            if (err) {
                                                res.json({ success: false, message: "Tìm kiếm hóa đơn thất bại", error: err }); // Return error message
                                            } else {
                                                if (!order) {
                                                    res.json({ success: false, message: 'Không tìm thấy hóa đơn.' }); // Return error message
                                                } else {
                                                    var index = order.tables.indexOf(req.body.tableID)
                                                    if (index >= 0) {
                                                        res.json({ success: false, message: 'Bàn này đã có trong hóa đơn' });
                                                    } else {
                                                        var region_id = table.region_id
                                                        var _regionIndex = order.region_id.indexOf(region_id)

                                                        // khu vực này chưa có trong hóa đơn
                                                        if(_regionIndex < 0){
                                                            order.region_id.push(region_id)
                                                        }

                                                        order.tables.push(req.body.tableID)
                                                        order.save((err) => {
                                                            if(err){
                                                                res.json({ success: false, message: 'Thêm bàn vào order thất bại:', error:err });
                                                            }else{
                                                                res.json({ success: true, message: 'Thêm bàn thành công', table:table});
                                                                io.sockets.emit("server-add-table-to-order",  {order_id: order.id, table: table});
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        })
                                    }
                                });
                            }
                        }
                    }
                })
            }
        }
    })
    router.put('/removeOrderTable', (req, res) => {
        
                if (!req.body.orderID) {
                    res.json({ success: false, message: "Không có mã order" });
                } else {
                    if (!req.body.tableID) {
                        res.json({ success: false, message: "Không có mã bàn" });
                    } else {
                        Table.findOne({ id: req.body.tableID }, (err, table) => {
                            if (err) {
                                // error tồn tại nghĩa là lỗi khi thao tác trên server
                                res.json({ success: false, message: "Xóa bàn ra khỏi order thất bại", error: err }); // Return error message
                            } else {
                                if (!table) {
                                    res.json({ success: false, message: 'Không tìm thấy bàn.' }); // Return error message
                                } else {
                                    // bàn không có order hoặc thuộc order khác
                                    if (table.order_id == null || table.order_id != req.body.orderID) {
                                        res.json({ success: false, message: 'Bàn này không thuộc order xác định.' });
                                    } else {
                                        table.order_id = "";
                                        table.save((err) => {
                                            if (err) {
                                                if (err.errors) {
                                                    res.json({ success: false, message: "Xóa bàn ra khỏi order thất bại", error: err.errors });
                                                } else {
                                                    res.json({ success: false, message: "Xóa bàn ra khỏi order thất bại", error: err }); // Return error message
                                                }
                                            } else {
        
                                                // remove table ra khỏi order
                                                Order.findOne({ id: req.body.orderID }, (err, order) => {
                                                    if (err) {
                                                        res.json({ success: false, message: "Tìm kiếm hóa đơn thất bại", error: err }); // Return error message
                                                    } else {
                                                        if (!order) {
                                                            res.json({ success: false, message: 'Không tìm thấy hóa đơn.' }); // Return error message
                                                        } else {
                                                            var index = order.tables.indexOf(req.body.tableID)
        
                                                            if (index >= 0) {
                                                                // xóa bàn khỏi hóa đơn
                                                                order.tables.splice(index,1)
                                                                    
                                                                // xóa region_id nếu không còn table nào nằm trong khu vực đó ở trong hóa đơn
                                                                var regionID = table.region_id.trim().toLowerCase()
                                                                
                                                                var promises = order.tables.map((_tableID)=>{
                                                                    return new Promise((resolve, reject)=>{
                                                                        Table.findOne({id: _tableID}, (err, _table)=>{
                                                                            console.log("tableID:"+_tableID)
                                                                            if(err){
                                                                                console.log("remove table from order: find table:"+_tableID
                                                                                    + ":error:"+err)
                                                                                    reject(err)
                                                                            }else{
                                                                                var _regionID = _table.region_id.trim().toLowerCase()
                                                                                if(regionID === _regionID){
                                                                                    console.log("remove table from order: not deletable region id")
                                                                                    resolve(false)
                                                                                }else{
                                                                                    resolve()
                                                                                }
                                                                            }
                                                                        })
                                                                    })
                                                                })
        
                                                                Promise.all(promises)
                                                                .then((value)=>{
                                                                    var strValue = JSON.stringify(value)
                                                                    var check = strValue.indexOf("false")
                                                                    
                                                                    if(check<0){
                                                                        var regionIndex = order.region_id.indexOf(table.region_id)
                                                                        // console.log("remove table from order: deleting region id: region id:"+regionIndex)
                                                                        if(regionIndex > -1){
                                                                            order.region_id.splice(regionIndex,1)
                                                                        }
                                                                    }
        
                                                                    order.save((err) => {
                                                                        if(err){
                                                                            res.json({ success: false, message: 'Hủy bàn ra khỏi order thất bại', error:err });
                                                                        }
                                                                        else{
                                                                            res.json({ success: true, message: 'Hủy bàn thành công', table:table});
                                                                            io.sockets.emit("server-remove-table-from-order",  {order_id: order.id, table: table});
                                                                        }
                                                                    })
                                                                })
                                                            } else {
                                                                res.json({ success: true, message: 'Bàn này không có trong order', table: table });
                                                                io.sockets.emit("server-remove-table-from-order", { order_id: order.id, table: table });
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            })

    router.put('/updateNumberCustomer', (req, res) => {
        if (!req.body.order_id) {
            res.json({ success: false, message: "Không có mã order" });
        } else {
            if (!req.body.number_customer) {
                res.json({ success: false, message: "Không có số lượng khách" });
            } else {
                Order.findOne({ id: req.body.order_id }, (err, order) => {
                    if (err) {
                        res.json({ success: false, message: "Tìm kiếm hóa đơn thất bại", error: err }); // Return error message
                    } else {
                        if (!order) {
                            res.json({ success: false, message: 'Không tìm thấy hóa đơn.' }); // Return error message
                        } else {
                            order.number_customer = req.body.number_customer
                            order.save((err) => {
                                if (err) {
                                    res.json({ success: false, message: 'Update lượng khách hàng thất bại', error: err });
                                } else {
                                    res.json({ success: true, message: 'Update lượng khách hàng thành công', order: order });
                                    io.sockets.emit("server-update-number-customer-order", { order: order });
                                }
                            })
                        }
                    }
                })
            }
        }
    })

    router.put('/updateDescription', (req, res) => {
        if (!req.body.order_id) {
            res.json({ success: false, message: "Không có mã order" });
        } else {
            if (!req.body.description) {
                res.json({ success: false, message: "Không có chú thích" });
            } else {
                Order.findOne({ id: req.body.order_id }, (err, order) => {
                    if (err) {
                        res.json({ success: false, message: "Tìm kiếm hóa đơn thất bại", error: err }); // Return error message
                    } else {
                        if (!order) {
                            res.json({ success: false, message: 'Không tìm thấy hóa đơn.' }); // Return error message
                        } else {
                            order.description = req.body.description
                            order.save((err) => {
                                if (err) {
                                    res.json({ success: false, message: err });
                                } else {
                                    res.json({ success: true, message: 'Update chú thích thành công' });
                                }
                            })
                        }
                    }
                })
            }
        }
    })

    router.put('/removeOrder', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: "Không có mã order" });
        } else {
            Order.findOne({ id: req.body.id }, (err, order) => {
                if (err) {
                    res.json({ success: false, message: "Tìm kiếm hóa đơn thất bại", error: err }); // Return error message
                } else {
                    if (!order) {
                        res.json({ success: false, message: 'Không tìm thấy hóa đơn.' }); // Return error message
                    } else {
                        // console.log("order:"+JSON.stringify(order))
                        // console.log("removeOrder:validate success:tables:"+order.tables+":details:"+order.detail_orders)

                        // cờ xác định đã chọn bàn hoặc món chưa
                        var hasSelectedAnyItem = (order.tables && order.tables.length > 0) || (order.detail_orders && order.detail_orders.length > 0)

                        var isSuccess = true;
                        var failedTables = [];
                        var failedFoods = [];
                        for (var _table of order.tables) {
                            // console.log("Khôi phục bàn")
                            var process = function(_table){
                                return function(err, __table){
                                    if(err){
                                        console.log("Khôi phục bàn thất bại:"+_table)
                                        failedTables.push(_table);
                                        isSuccess = false;
                                    }else{
                                        if(__table){
                                            __table.order_id = ""
                                            __table.save((err)=>{
                                                if(err){
                                                    failedTables.push(__table.id)
                                                    isSuccess = false;
                                                }else{
                                                    // console.log("restore table "+ table.id+" success")
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                            Table.findOne({id: _table}, process(_table))
                        }

                        for (var _detail of order.detail_orders) {
                            Food.findOne({ id: _detail.food_id }, (err, food) => {
                                var process = function(__detail){
                                    return function(err,_food){
                                        if(err){
                                            console.log("Khôi phục món thất bại:"+__detail.food_id)
                                            failedFoods.push(__detail.food_id);
                                            isSuccess = false;
                                        }else{
                                            if(_food){
                                                // console.log("food:"+JSON.stringify(food))
                                                // console.log("_detail:"+JSON.stringify(_detail))
                                                _food.inventory = parseInt(_food.inventory) + parseInt(__detail.count)
                                                _food.save((err)=>{
                                                    if(err){
                                                        failedFoods.push(_food.id)
                                                        isSuccess = false;
                                                    }else{
                                                        // console.log("restore food "+ food.id+" success")
                                                        
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }
                                Food.findOne({id:_detail.food_id}, process(_detail))
                            })
                        }

                        // nếu khôi phục bàn và món thành công (nếu có) 
                        // mới có thể hủy hóa đơn
                        if (isSuccess) {
                            order.remove((err) => {
                                if (err) {
                                    isSuccess = false;
                                    console.log("Remove order thất bại:error:" + err)
                                } else {
                                    // console.log("Order đã được xóa.")
                                    io.sockets.emit("server-remove-order", { order_id: order.id })
                                }
                            });
                        }

                        if (isSuccess) {
                            // console.log("Khôi phục dữ liệu thành công")
                            var message = hasSelectedAnyItem ? "Khôi phục các item đã chọn và xóa hóa đơn thành công" : "Xóa hóa đơn thành công"
                            res.json({ success: true, message: message });
                        } else {
                            if (failedTables.length > 0) {
                                console.log("số bàn không khôi phục được:" + failedTables.length)
                                var message = "\nCác bàn không khôi phục được: ";
                                failedTables.array.forEach(_table => {
                                    message += _table + ", "
                                });
                                message.replaceAt(message.length - 2, ",", ".")
                            }
                            if (failedFoods.length > 0) {
                                console.log("số món không khôi phục được:" + failedFoods.length)
                                var message = message + "\nCác món không khôi phục được: ";
                                failedFoods.array.forEach(_food => {
                                    message += _food + ", "
                                });
                                message.replaceAt(message.length - 2, ",", ".")
                            }

                            res.json({ success: false, message: "Khôi phục dữ liệu thất bại. Xóa hóa đơn thất bại" + message });
                            io.sockets.emit("server-update-order", { order })
                        }
                    }
                }
            })
        }
    })


    // Load tất cả order cho phục vụ
    router.get('/getOrdersForWaiter', (req, res) => {
        Order.find({ flag_status: { $gt: C.CREATING_FLAG, $lt: C.COMPLETE_FLAG } }, (err, orders) => {
            if (err) {
                res.json({ success: false, message: "Lỗi xử lý tìm kiếm trên server", error: err });
            } else {
                if (!orders) {
                    res.json({ success: false, message: 'Không có hóa đơn' });
                } else {
                    // console.log("getOrdersWaiting():count:"+orders.length)
                    res.json({ success: true, orders: orders });
                }
            }
        });
    });


    // Load tất cả order cho bếp
    router.get('/getOrdersForChef', (req, res) => {
        Order.find({ flag_status: { $gt: C.CREATING_FLAG, $lt: C.EATING_FLAG } }, (err, orders) => {
            if (err) {
                res.json({ success: false, message: "Lỗi xử lý tìm kiếm trên server", error: err });
            } else {
                if (!orders) {
                    res.json({ success: false, message: 'Không có hóa đơn' });
                } else {
                    // console.log("getOrdersWaiting():count:"+orders.length)
                    res.json({ success: true, orders: orders });
                }
            }
        });
    });
    // phục vụ A đề xuất bàn giao hóa đơn chưa xử lý xong cho phục vụ B khi hết ca
    router.put('/suggestDelegacy', (req, res) => {
        if (!req.body.handover_username) {
            res.json({ success: false, message: "Không có tên đăng nhập" });
        } else {

            if (!req.body.delegacy_username) {
                res.json({ success: false, message: "Không có tên đăng nhập của người được bàn giao" });
            } else {
                var handover_username = req.body.handover_username.toLowerCase()
                var delegacy_username = req.body.delegacy_username.toLowerCase()

                User.findOne({ username: handover_username }, (err, handover) => {
                    if (err) {
                        res.json({ success: false, message: "Không tìm được tài khoản của bạn do lỗi", error: err });
                    }
                    else {
                        if (!handover) {
                            res.json({ success: false, message: 'Không tìm thấy tài khoản của bạn' })
                        }
                        else {
                            if (!handover.actived) {
                                res.json({ success: false, message: 'Tài khoản của bạn đã ngưng hoạt động' })
                            }
                            else {
                                User.findOne({ username: delegacy_username }, (err, delegacy) => {
                                    if (err) {
                                        res.json({ success: false, message: "Không tìm được tài khoản người được bàn giao do lỗi", error: err });
                                    }
                                    else {
                                        if (!delegacy) {
                                            res.json({ success: false, message: 'Không tìm thấy tài khoản của người được bàn giao' })
                                        }
                                        else {
                                            if (!delegacy.actived) {
                                                res.json({ success: false, message: 'Tài khoản của người được bàn giao đã ngưng hoạt động' })
                                            }
                                            else {
                                                if (delegacy.type_account !== C.ACCOUNT_WAITER) {
                                                    res.json({ success: false, message: 'Người được bàn giao không phải là nhân viên phục vụ' })
                                                }
                                                else {
                                                    res.json({ success: true, message: 'Đã gửi yêu cầu bàn giao. Vui lòng chờ hồi đáp' })

                                                    var data = {
                                                        delegacy_username: delegacy.username,
                                                        handover_username: handover.username,
                                                        handover_fullname: handover.fullname
                                                    }

                                                    io.sockets.emit("server-request-delegacy-waiter", data)
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
    })

    // phục vụ B đồng ý đề xuất bàn giao của phục vụ A
    router.put('/agreeBecomeDelegacy', (req, res) => {
        var data = {};
        if (!req.body.username) {
            res.json({ success: false, message: "Không có tên đăng nhập" });
        } else {
            if (!req.body.handover_username) {
                res.json({ success: false, message: "Không có tên đăng nhập của người bàn giao" });
            } else {

                var delegacy_username = req.body.username.toLowerCase()
                var handover_username = req.body.handover_username.toLowerCase()

                // tìm tài khoản người được bàn giao
                User.findOne({ username: delegacy_username }, (err, delegacy) => {
                    if (err) {
                        res.json({ success: false, message: "Không tìm được tài khoản của bạn do lỗi", error: err });
                    }
                    else {
                        if (!delegacy) {
                            res.json({ success: false, message: 'Không tìm thấy tài khoản của bạn' })
                        }
                        else {
                            if (!delegacy.actived) {
                                res.json({ success: false, message: 'Tài khoản của bạn đã ngừng hoạt động' })

                                data = {
                                    is_ok: false,
                                    message: "Tài khoản người được bàn giao đã ngừng hoạt động",
                                    handover_username: handover.username,
                                    delegacy_username: delegacy_username,
                                    delegacy_fullname: delegacy.fullname
                                }

                                io.sockets.emit("server-response-delegacy-waiter", data)
                            }
                            else {
                                // tìm tài khoản người bàn giao
                                User.findOne({ username: handover_username }, (err, handover) => {
                                    if (err) {
                                        res.json({ success: false, message: "Không tìm được tài khoản của người bàn giao do lỗi", error: err });
                                    } else {
                                        if (!handover) {
                                            res.json({ success: false, message: 'Không tìm thấy tài khoản của người bàn giao' })
                                        } else {
                                            if (!handover.actived) {
                                                res.json({ success: true, message: 'Tài khoản của người bàn giao đã ngừng hoạt động' })
                                            }
                                            else {
                                                // chứng thực thành công tài khoản của người bàn giao và được bàn giao
                                                // load danh sách các hóa đơn được tạo bởi người bàn giao và vẫn chưa được thanh toán
                                                // cờ status vẫn chưa là COMPLETE
                                                console.log("handover username:" + handover_username)
                                                var query = {
                                                    waiter_username: handover_username,
                                                    flag_status: { $gt: C.CREATING_FLAG, $lt: C.COMPLETE_FLAG }
                                                }
                                                console.log("query orders:" + JSON.stringify(query))

                                                var failedOrders = "";

                                                Order.find(query, (err, orders) => {
                                                    if (err) {
                                                        res.json({
                                                            success: false,
                                                            message: 'Không tìm thấy danh sách hóa đơn được tạo ra từ người bàn giao mà bạn có thể phục vụ do lỗi',
                                                            error: err
                                                        })
                                                    }
                                                    else {
                                                        // console.log("count of orders:"+orders.length)
                                                        for (var order of orders) {
                                                            var delegacies = order.delegacy
                                                            var lastDelegacy = ""
                                                            if (delegacies && delegacies.length > 0) {
                                                                lastDelegacy = delegacies[delegacies.length - 1]
                                                            }

                                                            // console.log("delegacies:"+delegacies)
                                                            // console.log("lastDelegacy:"+lastDelegacy)
                                                            // console.log("lastDelegacy != delegacy_username:"+(lastDelegacy != delegacy_username))

                                                            // nếu người được ủy nhiệm cuối cùng trong hóa đơn không phải người được bàn giao hiện tại
                                                            if (lastDelegacy != delegacy_username) {
                                                                console.log("agree delegacy:different usernames")
                                                                order.delegacy.push(delegacy_username)
                                                                order.save((err) => {
                                                                    if (err) {
                                                                        if (failedOrders === "") {
                                                                            failedOrders = order.id
                                                                        } else {
                                                                            failedOrders += ", " + order.id
                                                                        }
                                                                        console.log("delegacy order failed:id:" + order.id + ":error:" + err)
                                                                    }
                                                                })
                                                            }
                                                        }

                                                        // nên làm chức năng lưu trữ các hóa đơn failed trong client để hiển thị khi cần
                                                        if (failedOrders && failedOrders.length > 0) {
                                                            res.json({
                                                                success: false,
                                                                message: 'Bàn giao không hoàn toàn. Các hóa đơn chưa được bàn giao : ' + failedOrders
                                                            })

                                                            data = {
                                                                is_ok: true,
                                                                message: 'Bàn giao không hoàn toàn',
                                                                fails: failedOrders,
                                                                delegacy_username: delegacy.username,
                                                                delegacy_fullname: delegacy.fullname,
                                                                handover_username: handover.username
                                                            }
                                                        }
                                                        else {
                                                            res.json({ success: true, message: 'Bàn giao thành công' })
                                                            // console.log("delegacy username:"+delegacy.username)
                                                            data = {
                                                                is_ok: true,
                                                                message: "Đồng ý bàn giao",
                                                                fails: "",
                                                                delegacy_username: delegacy.username,
                                                                delegacy_fullname: delegacy.fullname,
                                                                handover_username: handover.username
                                                            }
                                                        }

                                                        io.sockets.emit("server-response-delegacy-waiter", data)
                                                    }
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
    })

    router.put('/disagreeBecomeDelegacy', (req, res) => {
        var data = {};
        if (!req.body.username) {
            res.json({ success: false, message: "Không có tên đăng nhập" });
        }
        else {
            if (!req.body.handover_username) {
                res.json({ success: false, message: "Không có tên đăng nhập của người bàn giao" });
            }
            else {

                var username = req.body.username.toLowerCase()
                var handover_username = req.body.handover_username.toLowerCase()

                // tìm tài khoản của người được bàn giao
                User.findOne({ username: username }, (err, delegacy) => {
                    if (err) {
                        res.json({ success: false, message: "Không tìm được tài khoản của bạn do lỗi", error: err });
                    }
                    else {
                        if (!delegacy) {
                            res.json({ success: false, message: 'Không tìm thấy tài khoản của bạn' })
                        }
                        else {
                            if (!delegacy.actived) {
                                res.json({ success: false, message: 'Tài khoản của bạn đã bị ngưng hoạt động' })

                                data = {
                                    is_ok: false,
                                    message: "Tài khoản người được bàn giao đã ngưng hoạt động",
                                    handover_username: handover_username,
                                    delegacy_username: username,
                                    delegacy_fullname: delegacy.fullname
                                }
                                io.sockets.emit("server-response-delegacy-waiter", data)
                            }
                            else {
                                // tìm tài khoản của người bàn giao
                                User.findOne({ username: handover_username }, (err, handover) => {
                                    if (err) {
                                        res.json({ success: false, message: "Không tìm được tài khoản của người bàn giao do lỗi", error: err });
                                    }
                                    else {
                                        if (!handover) {
                                            res.json({ success: false, message: 'Không tìm thấy tài khoản của người bàn giao' })
                                        }
                                        else {
                                            if (!handover.actived) {
                                                res.json({ success: true, message: 'Tài khoản của người bàn giao đã bị ngưng hoạt động' })
                                            }
                                            else {
                                                res.json({ success: true, message: 'Đã gửi lời từ chối bàn giao' })

                                                data = {
                                                    is_ok: false,
                                                    message: "Từ chối bàn giao",
                                                    handover_username: handover_username,
                                                    delegacy_username: delegacy.username,
                                                    delegacy_fullname: delegacy.fullname
                                                }

                                                io.sockets.emit("server-response-delegacy-waiter", data)
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
    })

    return router;
};





