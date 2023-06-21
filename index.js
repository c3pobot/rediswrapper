'use strict'
module.exports = class Redis{
  constructor(opt){
    this.node_redis = require('redis')
    this._type = opt.type || 'redis'
    this._ttl = (opt.ttl || 600)
    this._opt = {
      socket: {
        host: (opt.host || 'localhost'),
        port: (opt.port || 6379)
      }
    }
    if(opt.passwd) this._opt.password = opt.passwd;
    this._redis = this.node_redis.createClient(this._opt);
    //this._redis.on('error', err => console.error(this._type+' client error', err));
    //this._redis.on('connect', () => console.log(this._type+' client is connected'));
    //this._redis.on('reconnecting', () => console.log(this._type+' client is reconnecting'));
    this._redis.on('ready', () => console.log(this._type+' client is ready'));
  }
  async init(){
    try{
      return await this._redis.connect()
    }catch(e){
      console.error(e);
    }
  }
  async get(key){
    try{
      const obj = await this._redis.get(key)
      if(obj) return JSON.parse(obj)
    }catch(e){
      console.error(e)
    }
  }
  async hget(key){
    try{
      return await this._redis.HGETALL(key)
    }catch(e){

    }
  }
  async del(key){
    try{
      return await this._redis.del(key)
    }catch(e){
      console.error(e)
    }
  }
  async ping(){
    try{
      return await this._redis.ping()
    }catch(e){
      console.error(e);
    }
  }
  async save(){
    try{
      return await this._redis.BGSAVE()
    }catch(e){
      console.error(e);
    }
  }
  async set(key, obj){
    try{
      return await this._redis.set(key, JSON.stringify(obj))
    }catch(e){
      console.error(e);
    }
  }
  async setTTL(key, obj, ttl = this._ttl){
    try{
      return await this._redis.SET(key, JSON.stringify(obj), { EX: ttl })
    }catch(e){
      console.error(e)
    }
  }
  async string(key, string){
    try{
      return await this._redis.set(key, string)
    }catch(e){
      console.error(e);
    }
  }
  async push(key, obj){
    try{
      return await this._redis.LPUSH(key, JSON.stringify(obj))
    }catch(e){
      console.error(e);
    }
  }
  async priority(key, obj){
    try{
      return await this._redis.RPUSH(key, JSON.stringify(obj))
    }catch(e){
      console.error(e);
    }
  }
  async pull(key){
    try{
      const obj = await this._redis.RPOP(key)
      if(obj) return await JSON.parse(obj)
    }catch(e){
      console.error(e);
    }
  }
  async bpull(key){
    try{
      const obj = await this._redis.BRPOP(key, 5.00)
      if(obj && obj[1]) return await JSON.parse(obj[1])
    }catch(e){
      console.error(e);
    }
  }
  async rem(key, obj){
    try{
      return await this._redis.LREM(key, -1, JSON.stringify(obj))
    }catch(e){
      console.error(e);
    }
  }
  async getList(key){
    try{
      return await this._redis.LRANGE(key, 0, -1)
    }catch(e){
      console.error(e);
    }
  }
  async keys(str){
    try{
      return await this._redis.KEYS(str)
    }catch(e){
      console.error(e);
    }
  }
}
