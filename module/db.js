var MongoClient=require('mongodb').MongoClient;
var Config=require('./config.js');
class Db{
    static getInstance(){
        if(!Db.instance){
            Db.instance=new Db();
        }
        return Db.instance;
    }
    constructor(){
        this.dbClient=''
        this.connect();
    }
    connect(){
        return new Promise((resolve,reject)=>{
            if(!this.dbClient){
                MongoClient.connect(Config.dbUrl,(error,client)=>{
                    if(error){
                        reject(err);
                    }else{
                        this.dbClient=client.db(Config.dbName);
                        resolve(this.dbClient)
                    }
                })
            }else{
                resolve(this.dbClient)
            }
            
        })
    }
    insert(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json,(err,result)=>{
                    if(err){
                        reject(error)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }
    remove(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then(function(db){
                db.collection(collectionName).removeOne(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }
    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then(function(db){
                db.collection(collectionName).updateOne(json1,{
                    $set:json2
                },(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }
    find(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then(function(db){
                var result=db.collection(collectionName).find(json);
                result.toArray(function(err,docs){
                    if(err){
                        reject(error);
                        return;
                    }else{
                        resolve(docs);
                    }
                })
            })
        })
    }
    findOne(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then(function(db){
                db.collection(collectionName).findOne(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                });
            })
        })
    }
}
module.exports=Db.getInstance();