module.exports = {
    
        // phục hồi bàn trống đối với các bàn đã được đặt nhưng không tìm thấy order hoặc order đó đang ở trạng thái PENDING
        cleanDatabase: function(){
            const Table = require('../models/tables')
            const Order = require('../models/order')
            const C = require('../config/globalVariables')
    
            Table.find({}, (err,tables)=>{
                if(err){
                    console.log("couldn't clean table database:error:"+err)
                }else{
                    for(var table of tables){
                        if(table.order_id){
                            var process = function(_table){
                                return function(err,order){
                                    if(err){
                                        console.log("clean table database:find order failed:id"+_table.order_id + ":error:"+err)
                                    }else{
                                        var isNeedRestore = !order || order.flag_status == C.PENDING_FLAG
        
                                        if(isNeedRestore){
                                            _table.order_id = ""
                                            _table.save((err)=>{
                                                if(err){
                                                    console.log("clean table database:find order success:not restore table:id"+_table.order_id + ":restore failed:"+err)
                                                }else{
                                                    console.log("clean table database: restore table success:" + _table.id)
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                            Order.findOne({id: table.order_id}, process(table))
                        }
                    }
                }
            })
    
            // set các account đang trong trạng thái login về logout (trường is_logining)
            const User = require('../models/user')
            User.find({}, (err,users)=>{
                if(!err){
                    for(var user of users){
                        if(user.is_logining){
                            var process = function(_user){
                                return function(err){
                                    if(err){
                                        console.log("find an account is logining but couldn't set logout failed:"+_user.username)
                                    }else{
                                        console.log("find an account is logining and set logout success:"+_user.username)
                                    }
                                }
                            }
                            user.is_logining = false
                            user.save(process(user))
                        }
                    }
                }
            })
    
            const Food = require('../models/foods')
    
            // xóa hết các hóa đơn trạng thái CREATING (ĐANG TẠO), phục hồi các món và bàn (nếu đã chọn)
            Order.find({flag_status : C.CREATING_FLAG}, (err, orders)=>{
                var isSuccess = true;
                var failedTables = []
                var failedFoods = []
    
                for(var order of orders){
    
                    // khôi phục bàn
                    for(var tableID of order.tables){
                        Table.findOne({id: tableID}, (err,table)=>{
                            if(err){
                                console.log("Khôi phục bàn thất bại:"+table.id)
                                failedTables.push(table.id);
                                isSuccess = false;
                            }
                            else{
                                if(table){
                                    table.order_id = ""
                                    table.save((err)=>{
                                        if(err){
                                            failedTables.push(table.id)
                                            isSuccess = false;
                                        }else{
                                            // console.log("restore table "+ table.id+" success")
                                        }
                                    })
                                }
                            }
                        })
                    }
                    
                    for(var _detail of order.detail_orders){
                        Food.findOne({id:_detail.food_id}, (err, food)=>{
                            if(err){
                                console.log("Khôi phục món thất bại:id:"+food.id+":name:"+food.name)
                                failedFoods.push(food.id);
                                isSuccess = false;
                            }else{
                                if(food){
                                    // console.log("food:"+JSON.stringify(food))
                                    // console.log("_detail:"+JSON.stringify(_detail))
                                    food.inventory = parseInt(food.inventory) + parseInt(_detail.count)
                                    food.save((err)=>{
                                        if(err){
                                            failedFoods.push(food.id)
                                            isSuccess = false;
                                        }else{
                                            // console.log("restore food "+ food.id+" success")
                                            
                                        }
                                    })
                                }
                            }
                        })
                    }
    
                    // nếu khôi phục bàn và món thành công (nếu có) 
                    // mới có thể hủy hóa đơn
                    if(isSuccess){
                        order.remove((err) => {
                            if (err) {
                                isSuccess = false;
                                console.log("Remove order thất bại:error:"+err+":order id:"+order.id)
                            } else {
                                console.log("Order đã được xóa:"+order.id)
                            }
                        });
                    }else{
                        console.log("Không thể hủy order:id:"+order.id)
                    }
                }
            })
        }
    }