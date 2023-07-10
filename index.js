'use strict'
module.exports = class Redis{
  constructor(opt){
    this.log = {
      info: this.logInfo,
      error: this.logError,
      debug: this.logInfo
    }
    this.notify = true
    if(opts.logger) this.log = opts.logger
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
    this._redis.on('error', err => this.log.debug(this._type+' client error', err));
    this._redis.on('connect', () => this.log.debug(this._type+' client is connected'));
    this._redis.on('reconnecting', () => this.log.debug(this._type+' client is reconnecting'));
    this._redis.on('ready', () => {
      if(this.notify){
        this.notify = false
        this.log.info(this._type+' client is ready')
      }else{
        this.log.debug(this._type+' client is ready')
      }
    });
  }
  logInfo (msg){
    console.log(msg)
  }
  logError (msg){
    console.log(msg)
  }
  async init(){
    try{
      return await this._redis.connect()
    }catch(e){
      throw(e);
    }
  }
  async get(key){
    try{
      const obj = await this._redis.get(key)
      if(obj) return JSON.parse(obj)
    }catch(e){
      throw(e)
    }
  }
  async hget(key){
    try{
      return await this._redis.HGETALL(key)
    }catch(e){
      this.log.error(e)
    }
  }
  async del(key){
    try{
      return await this._redis.del(key)
    }catch(e){
      this.log.error(e)
    }
  }
  async ping(){
    try{
      return await this._redis.ping()
    }catch(e){
      this.log.error(e);
    }
  }
  async save(){
    try{
      return await this._redis.BGSAVE()
    }catch(e){
      this.log.error(e);
    }
  }
  async set(key, obj){
    try{
      return await this._redis.set(key, JSON.stringify(obj))
    }catch(e){
      throw(e);
    }
  }
  async setTTL(key, obj, ttl = this._ttl){
    try{
      return await this._redis.SET(key, JSON.stringify(obj), { EX: ttl })
    }catch(e){
      throw(e)
    }
  }
  async string(key, string){
    try{
      return await this._redis.set(key, string)
    }catch(e){
      throw(e);
    }
  }
  async push(key, obj){
    try{
      return await this._redis.LPUSH(key, JSON.stringify(obj))
    }catch(e){
      throw(e);
    }
  }
  async priority(key, obj){
    try{
      return await this._redis.RPUSH(key, JSON.stringify(obj))
    }catch(e){
      throw(e);
    }
  }
  async pull(key){
    try{
      const obj = await this._redis.RPOP(key)
      if(obj) return await JSON.parse(obj)
    }catch(e){
      throw(e);
    }
  }
  async bpull(key){
    try{
      const obj = await this._redis.BRPOP(key, 5.00)
      if(obj && obj[1]) return await JSON.parse(obj[1])
    }catch(e){
      throw(e);
    }
  }
  async rem(key, obj){
    try{
      return await this._redis.LREM(key, -1, JSON.stringify(obj))
    }catch(e){
      throw(e);
    }
  }
  async getList(key){
    try{
      return await this._redis.LRANGE(key, 0, -1)
    }catch(e){
      throw(e);
    }
  }
  async keys(str){
    try{
      return await this._redis.KEYS(str)
    }catch(e){
      throw(e);
    }
  }
}
