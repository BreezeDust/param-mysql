/**
 * Created by BreezeDust on 16/2/22.
 * sql参数化类
 */
var mysql = require('mysql');
var MysqlPool=require('./MysqlPool');
var _MY_SQL_POOL={};
var _DEFAULT_KEY="___default_";
function DataParameter(sqlStr){
    this._sqlArray=[]; // sql按照%s分割后的数组
    this._valueArray=[]; // 值数组
    this._index = 0; // bind参数时的游标
    this._valueCount=0; // sql语句传入进来时,真实的参数个数
    this._sql="";
    this.__construct(sqlStr);
    return this;
}

DataParameter.NUMBER = "number";
DataParameter.STRING = "string";
DataParameter.BOOL = "boolean";

DataParameter.prototype.__construct=function(sqlStr){
    this._sqlArray=sqlStr.split("%s");
    this._valueCount=this._sqlArray.length-1;
};
DataParameter.prototype.bind=function(value,type){
    if(typeof (value)==type){
        this._valueArray[this._index++]=value;
        return;
    }
    if(!this.checkHasTheType(type)){
        console.log("ERROR: DataParamenter without type of "+type);
    }
    else{
        if(typeof(value)=="string"){
            value="'"+value+"'";
        }
        console.log("ERROR: value ["+value+"] is not type ["+type+"]");
    }
};
DataParameter.prototype.checkHasTheType=function(type){
    if(type==DataParameter.NUMBER
        || type==DataParameter.STRING
        || type==DataParameter.BOOL){
        return true;
    }
    return false;
};
DataParameter.prototype.getSql=function(){
    if (this._index == this._valueCount) {
        if(this._sql==null || this._sql==""){
            this._createSqlStr();
        }
        return this._sql;
    }
    console.log("ERROR: a total of "+this._valueCount+" parames, you just have "+this._index);
    return "";
};
DataParameter.prototype._createSqlStr=function(){
    this._sql=this._sqlArray[0];
    var count=1;
    for(var i=0;i<this._valueCount;i++){
        var value=this._valueArray[i];
        if(typeof (value)==DataParameter.STRING){
            value=mysql.escape(value);
        }
        this._sql=this._sql+value+this._sqlArray[count++];
    }
};
/**
 * ==========================other=========================
 */
DataParameter.createMysqlPool=function(mysqlConfig,key){
    if(key==null){
        key=_DEFAULT_KEY;
    }
    if(_MY_SQL_POOL[key]!=null){
        throw new Error("the pool hasd exits!!")
        return;
    }
    _MY_SQL_POOL[key]=new MysqlPool(mysqlConfig);
    return _MY_SQL_POOL[key];
};
DataParameter.mysql=function(key){
    if(key==null){
        key=_DEFAULT_KEY;
    }
    if(_MY_SQL_POOL[key]!=null){
        return _MY_SQL_POOL[key];
    }
    return null;
};
DataParameter.endMysqlPool=function(){
    if(_MY_SQL_POOL!=null){
        for(var key in _MY_SQL_POOL){
            _MY_SQL_POOL[key].end();
        }
    }
};
DataParameter.MysqlPool=function(key){
    return MysqlPool;
};
module.exports=DataParameter;