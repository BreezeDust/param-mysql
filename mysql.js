/**
 * Created by BreezeDust on 16/2/22.
 */
var mysql = require('mysql');
var config = require(APP_PATCH+"/config");
var pool = mysql.createPool(
    {
        connectionLimit : config.mysql.connectionLimit,
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        port: config.mysql.port
    }
);
function end(){
    pool.end();
}
function query(sql,callback) {
    pool.getConnection(function (err, connection) {
        if (!!err) {
            console.error('[sqlqueryErr] ' + err.stack);
            //connection.release();
            if(callback !=null){
                callback(err,res);
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

exports.query=query;

