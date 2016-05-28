/**
* @Author: BreezeDust
* @Date:   2016-03-06
* @Email:  breezedust.com@gmail.com
* @Last modified by:   BreezeDust
* @Last modified time: 2016-05-28
*/
var mysql = require('mysql');
function MysqlPool(config){
    this._pool = mysql.createPool(
        {
            connectionLimit : config.connectionLimit,
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port
        }
    );
    return this;
}
MysqlPool.prototype.end=function(){
    this._pool.end();
};
MysqlPool.prototype.query=function(sql,callback) {
    this._pool.getConnection(function (err, connection) {
        if (!!err) {
            console.error('[sqlqueryErr] ' + err.stack);
            //connection.release();
            if(callback !=null){
                callback(err);
            }
            throw err;
        }
        connection.query(sql, function (err, res) {
            if(callback !=null){
                callback(err,res);
            }
            connection.release();
        });
    });
}
module.exports=MysqlPool;

