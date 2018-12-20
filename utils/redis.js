const redis = require("redis"),
    RDS_PORT = 6379,            //服务器端口
    RDS_HOST = '111.230.236.23',     //服务器ip
    RDS_OPTS = {
        password:'janninewegel@@'
    },              //设置值
    db = 9
    client = redis.createClient({RDS_PORT, RDS_HOST,RDS_OPTS, db});

let test = {
    set: async () => {
        client.set('token', "普通的种下token", function(err, res) {
           console.log(err);
           console.log(res);
        });
        client.expire('token', 60*60*24*30);  //  缓存30天 设置失效时间

        /*
        * set 也允许设置失效时间
        * */
        // client.set('token', '普通的种下token', 'EX', 60*60*24*30);  //  缓存30天 设置失效时间
    },
    get: async () => {
        /*
        * 得到
        * */
        client.get('token', function(err, reply) {
           if(err) {
               console.log("报错了");
               console.log(err);
               throw err;
               // return;
           }
           if(reply)
                console.log(reply);
           else
               console.log("没有值");
        });

        // let reply = await new Promise(function(resolve, reject) {
        //     client.get('token', function(err, reply) {
        //         resolve(reply?reply:'');
        //     });
        // });
        // if(reply)
        //     console.log(reply);
        // else
        //     console.log("没有值");
    },
    remove: async ()=>{
        client.del("token",function(err, res) {
            console.log(err);
            console.log(res);
        }); //删除
        // await client.del('token'); //删除  支持await
    },
    /*
    * 单个key存储  hash
    * */
    hset: async ()=> {
        client.hset('hset', 'key001', 'hello', function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log('res:', res);
            }
        });
    },
    /*
    * 单个key获取  hash
    * */
    hget: async ()=> { //单个key获取  hash
        client.hget('hset', 'key001', function (err, getRslt) {
            if (err) {
                console.log(err);
            } else {
                console.log('getRslt:', getRslt);
                client.quit();
            }
        });
    },
    /*
    * 多个key存储  hash
    * */
    hmset: async ()=> {
        // client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
        client.hmset('hmset', {a:2,b:3,c:4}, function(err, response) {
            if (err) {
                console.log(err);
            } else {
                console.log(response);
                // client.quit();
            }
        });
    },
    /*
    * 多个key获取  hash
    * */
    hmget: async () => {
        client.hmget("hosts", "mjr", "another", "home", function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
        client.hmget('hmset', ['a', 'c'], function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
    },
    /*
    *
    * 参考网址 https://blog.csdn.net/qq_28893679/article/details/53005057
    * 遍历查询所有的key
    * 可以模糊查询  性能可能损耗，建议独立开一个db
    * */
    keys: async () => {
        client.keys("605*", function (err, replies) {
            console.log(replies.length + " replies:");
            replies.forEach(function (reply, i) {
                console.log("    " + i + ": " + reply);
            });
            client.quit();
        });
    },
    /*
    * 获取hash数据类型键值为1的所有key值
    * */
    hkeys: async () => {
        client.hkeys("1", function (err, replies) {
            if(err) throw err;
            console.log(replies);
            client.quit();
        });
    },
    /*
    * 获取hash数据类型键值为1的所有键值对数据
    * */
    hgetall: async () => {
        client.hgetall("1", function (err, obj) {
            console.log("hgetall:",obj);
        });
    },
    /*
    * 无序集合
    * */
    sadd: async () => {
        client.sadd("sadd", "a member", redis.print);
        client.sadd("sadd", "another member", redis.print);
        let set_size = 10;
        while (set_size > 0) {
            client.sadd("bigset", "member " + set_size,redis.print);
            set_size -= 1;
        }
    },
    /*
    * 有序集合
    * */
    zadd: async () => {
        client.zadd('zadd',[1,'one',2,'ninety-nine',3,'hello'], function(err, response){
            if(err) throw err;
            else {
                console.log('added '+response+' items.');
            }
        })
    },
    /*
    * 返回无序集合 key 的基数(集合中元素的数量)。
    * 也就是list数据类型里的列表长度
    * 下面几种对应不同的数据结构
    * scard zcard hcard
    * */
    scard: async () => {
        client.scard("sadd",function(err,response){
            console.log(response);
            console.log("Number of key sadd:" + response);
        });
    },
    zcard: async () => {
        client.zcard("sadd",function(err,response){
            console.log(response);
            console.log("Number of key sadd:" + response);
        });
    },
    rpush: async () => {
        client.rpush("rpush", [1, 2, 3, 4, 5]);
    },
    /*
    * 下面几种对应不同的数据结构
    * hscan zscan sscan
    * */
    zscan: async () => {
        client.zscan('bisset', 2, 'COUNT', '0', function(err, res) {
             console.log(err);
             console.log(res);
             console.log(res[1].length);
        });
    },
    sscan: async () => {
        client.sscan('zadd', 2, 'COUNT', '0', function(err, res) {
            console.log(err);
            console.log(res);
            console.log(res[1].length);
        });
    },
    hscan: async () => {
        client.hscan('z', 2, 'COUNT', '0', function(err, res) {
            console.log(err);
            console.log(res);
            console.log(res[1].length);
        });
    },
    /*
   * zcount方法获取指定集合指定范围内的元素个数，设定为-Infinity, Infinity时，可以获取数组长度。
   * */
    zcount: async () => {
        client.zrange('zadd', -Infinity, Infinity, function(err, resp) {
            console.log(err);
            console.log("resp:", resp);
        });
    },
    /*
    * 根据元素在有序排列中的位置
    * zrange方法获取指定下标范围的内的所有key值，包括起始位置和终止位置。
    * */
    zrange: async () => {
        client.zrange('zadd', 0, 1, function(err, resp) {
            console.log(err);
            console.log("resp:", resp);
        });
    },
    /*
    * 根据元素在有序排列中的位置
    * 适用于列表数据类型的，set集合使用则会报错
    * */
    lrange: async () => {
        client.lrange('rpush', 0, 1, function(err, resp) {
            console.log(err);
            console.log("resp:", resp);
        });
    },
    /*
    *  随机返回一个key键
    * */
    randomKey: async () => {
        client.randomkey(function (err, reply) {
            if (err) return false;
            console.log(reply);
        });
    },
}