'use strict';
//通过mongodb对象获取客户端
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/todoList';

let dbTools = {};

//挂载添加功能
dbTools.insert = function(cName, arr, callback) {
    //连接服务器
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        //获取集合对象
        let collection = db.collection(cName);
        //操作集合CRUD
        collection.insertMany(arr, function(err, result) {
            if (err) throw err;
            db.close(); //关闭连接
            callback(err, result); //调用回调函数，走下一个流程
        });

    });
}
//删除数据
dbTools.delete = function(cName, filter, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        //获取集合对象
        let collection = db.collection(cName);
        //操作集合CRUD
        collection.deleteMany(filter, function(err, result) {
            if (err) throw err;
            db.close();
            callback(err, result);
        });
    });
}
//更新
dbTools.update = function(cName, filter, modify, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        //获取集合对象
        let collection = db.collection(cName);
        //操作集合CRUD
        collection.updateMany(filter, { $set: modify }, function(err, result) {
            if (err) throw err;
            db.close();
            callback(err, result)
        })
    });
}
//查询
dbTools.find = function(cName,filter,callback){
    MongoClient.connect(url,function(err,db){
    if(err) throw err;
    
    //获取集合对象
    let collection = db.collection(cName);
    //操作集合CRUD
    collection.find(filter).toArray(function(err,docs){
        if(err) throw err;
        db.close();
        callback(err,docs);
    })

});
}
//导出工具
module.exports = dbTools;