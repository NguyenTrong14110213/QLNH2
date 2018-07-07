const jwt = require('jsonwebtoken'); // Các phương tiện đại diện cho các yêu cầu được chuyển giao giữa hai bên hợp lý, an toàn với URL.
const config = require('../config/database');// Import cấu hình database 
const C = require('../config/globalVariables');
const Order = require('../models/order');
const Table = require('../models/tables');
const Food = require('../models/foods');


module.exports = (router, io) => {

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
                customer_fullname: req.body.customer_fullname,
                waiter_username: req.body.waiter_username,
                waiter_fullname: req.body.waiter_fullname,
                cashier_username: req.body.cashier_username,
                cashier_fullname: req.body.cashier_fullname,
                flag_status: req.body.flag_status,
                flag_set_table: req.body.flag_set_table,
                time_set_table: req.body.time_set_table,
                paid_cost: req.body.paid_cost,
                final_cost: req.body.final_cost,
                description: req.body.description,
                tables: req.body.tables,
                region_id: req.body.region_id,
                region_name: req.body.region_name,
                detail_orders: req.body.detail_orders,
                number_customer: req.body.number_customer,

            });
            order.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Mã hóa đơn bị trùng!' });
                    } else {
                        if (err.errors) {
                            console.log("createOrder:save failed:not error code 11000:" + err)
                            res.json({ success: false, message: err });
                        }
                    }

                } else {
                    Order.findOne({ id: order.id }, (err, _order) => {
                        if (err) {
                            res.json({ success: false, message: 'Đã lưu hóa đơn nhưng không trả về được!', order: order });
                        } else {
                            res.json({ success: true, message: 'Hóa đơn mới được tạo!', order: _order });
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
                        res.json({ success: false, message: 'Không tìm thấy món ăn.' });
                    } else {
                        res.json({ success: true, order: order });
                    }
                }
            });
        }
    });


    router.get('/findOrder/:keyWord', (req, res) => {
        Order.find({ $or: [{ id: { $regex: req.params.keyWord, $options: 'i' } }, { customer_username: { $regex: req.params.keyWord, $options: 'i' } }, { customer_fullname: { $regex: req.params.keyWord, $options: 'i' } }, { waiter_username: { $regex: req.params.keyWord, $options: 'i' } }, { waiter_fullname: { $regex: req.params.keyWord, $options: 'i' } }, { tables: { $regex: req.params.keyWord, $options: 'i' } }] }, (err, order) => {
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


    router.put('/updateStatusOrder', (req, res) => {
        console.log("updateStatusOrder():request:" + JSON.stringify(req.body))
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
                                if (err) {
                                    available = false;
                                } else {
                                    for (var _table of tables) {
                                        _table.order_id = ""
                                        _table.save((err) => {
                                            if (err) {
                                                available = false;
                                                failedTables.push(_table.id)
                                            }
                                        })
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
                                        res.json({ success: false, message: err }); // Return error message
                                    }
                                } else {
                                    console.log("updateStatusOrder():update success:" + JSON.stringify(failedTables))
                                    res.json({ success: true, message: 'Trạng thái hóa đơn đã được thanh toán!', old_status: oldStatus, order: order });
                                    var failedTables = [];

                                    // tìm tất cả các bàn đã được order
                                    Table.find({ order_id: order.id }, (err, tables) => {
                                        if (err) {
                                            available = false;
                                        } else {
                                            for (var _table of tables) {
                                                _table.order_id = ""
                                                _table.save((err) => {
                                                    if (err) {
                                                        available = false;
                                                        failedTables.push(_table.id)
                                                    }
                                                })
                                            }
                                        }
                                    })
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
                                    food_id: foodID,
                                    food_name: req.body.foodName,
                                    price_unit: req.body.priceUnit,
                                    discount: req.body.discount,
                                    count: req.body.newCount
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
                                var oldCount = parseInt(order.detail_orders[i].count)
                                var unitPrice = parseInt(order.detail_orders[i].price_unit)
                                var discount = parseInt(order.detail_orders[i].discount)
                                var extra = (unitPrice - discount) * (newCount - oldCount)

                                // cập nhật lại tổng tiền trong order và số lượng đặt món trong chi tiết hóa đơn
                                order.final_cost = parseInt(order.final_cost) + extra
                                order.detail_orders[i].count = newCount
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
                                                        order.tables.push(req.body.tableID)
                                                        order.save((err) => {
                                                            if (err) {
                                                                res.json({ success: false, message: 'Thêm bàn vào order thất bại:', error: err });
                                                            } else {
                                                                res.json({ success: true, message: 'Thêm bàn thành công', table: table });
                                                                io.sockets.emit("server-add-table-to-order", { order_id: order.id, table: table });
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
                                                        order.tables.splice(index, 1)
                                                        order.save((err) => {
                                                            if (err) {
                                                                res.json({ success: false, message: 'Hủy bàn ra khỏi order thất bại', error: err });
                                                            } else {
                                                                res.json({ success: true, message: 'Hủy bàn thành công', table: table });
                                                                io.sockets.emit("server-remove-table-from-order", { order_id: order.id, table: table });
                                                            }
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
                        var isSuccess = true;
                        var failedTables = [];
                        var failedFoods = [];
                        for (var _table of order.tables) {
                            // console.log("Khôi phục bàn")
                            Table.findOne({ id: _table }, (err, table) => {
                                if (err) {
                                    console.log("Khôi phục bàn thất bại:" + _table.id)
                                    failedTables.push(table.id);
                                    isSuccess = false;
                                } else {
                                    if (table) {
                                        table.order_id = ""
                                        table.save((err) => {
                                            if (err) {
                                                failedTables.push(table.id)
                                                isSuccess = false;
                                            } else {
                                                // console.log("restore table "+ table.id+" success")
                                            }
                                        })
                                    }
                                }
                            })
                        }

                        for (var _detail of order.detail_orders) {
                            Food.findOne({ id: _detail.food_id }, (err, food) => {
                                if (err) {
                                    console.log("Khôi phục món thất bại:" + _detail.food_id)
                                    failedFoods.push(food.id);
                                    isSuccess = false;
                                } else {
                                    if (food) {
                                        // console.log("food:"+JSON.stringify(food))
                                        // console.log("_detail:"+JSON.stringify(_detail))
                                        food.inventory = parseInt(food.inventory) + parseInt(_detail.count)
                                        food.save((err) => {
                                            if (err) {
                                                failedFoods.push(food.id)
                                                isSuccess = false;
                                            } else {
                                                // console.log("restore food "+ food.id+" success")

                                            }
                                        })
                                    }
                                }
                            })
                        }

                        order.remove((err) => {
                            if (err) {
                                isSuccess = false;
                                console.log("Order đã xóa thất bại:error:" + err)
                            } else {
                                // console.log("Order đã được xóa.")
                                io.sockets.emit("server-remove-order", { order_id: order.id })
                            }
                        });

                        if (isSuccess) {
                            // console.log("Khôi phục dữ liệu thành công")
                            res.json({ success: true, message: "Khôi phục dữ liệu thành công" });
                        } else {
                            if (failedTables.length > 0) {
                                console.log("số bàn không khôi phục được:" + failedTables.length)
                                var message = message + "\nCác bàn không khôi phục được: ";
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

                            res.json({ success: false, message: "Khôi phục dữ liệu thất bại." + message });
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
                res.json({ success: false, message: err });
            } else {
                if (!orders) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn đang chờ hay hoạt động.' });
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
                res.json({ success: false, message: err });
            } else {
                if (!orders) {
                    res.json({ success: false, message: 'Không tìm thấy hóa đơn cho bếp.' });
                } else {
                    // console.log("getOrdersWaiting():count:"+orders.length)
                    res.json({ success: true, orders: orders });
                }
            }
        });
    });
    return router;
};





