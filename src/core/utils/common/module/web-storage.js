/**
 * @Author: jiffy
 * @Date: 2023-07-30 17:13:55
 * @Description: 本地存储方法 提供 get(key)  set(key,value,过期时间秒) remove(key) clear 方法
 */
import { isNumber, isNull, isUndefined } from "lodash";

/**
 * Cache class
 * Construction parameters can be passed into sessionStorage, localStorage,
 * @class Cache
 * @example
 */
const WebStorage = class WebStorage {
  /**
   *
   * @param {*} storage
   */
  constructor({
    // prefixKey = "",
    storage = sessionStorage,
    timeout = null,
    hasEncrypt = false,
  }) {
    this.storage = storage;
    this.prefixKey = "TY_SDK_";
    this.encryption = {
      encryptByAES: (e) => e,
      decryptByAES: (e) => e,
    };
    this.hasEncrypt = hasEncrypt;
    this.timeout = timeout;
  }
  getKey(key) {
    let res = '';
    if (key && key.startsWith(this.prefixKey)) {
      res = `${key}`.toUpperCase();
    } else {
      res = `${this.prefixKey}${key}`.toUpperCase();
    }
    return res;
  }

  /**
   * Set cache
   * @param {string} key
   * @param {*} value
   * @param {*} expire Expiration time in seconds
   * @memberof Cache
   */
  set(key, value, expire) {
    try {
      if (!expire) {
        expire = this.timeout;
      }

      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: isNumber(expire) ? new Date().getTime() + expire * 1000 : null,
      });
      const stringifyValue = this.hasEncrypt
        ? this.encryption.encryptByAES(stringData)
        : stringData;
      this.storage.setItem(this.getKey(key), stringifyValue);
    } catch (e) {
      console.error(e,key,value)
    }
  }

  /**
   * Read cache
   * @param {string} key
   * @param {*} def
   * @memberof Cache
   * @returns {Object}
   */
  get(key, def) {
    const _val = this.storage.getItem(this.getKey(key));
    const native = this.storage.getItem(key) //获取没有经过此类存储的值
    const val = _val || native
    if (!val) return def;
    try {
      const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
      const data = JSON.parse(decVal);
      const { value, expire } = data;
      if (
        isNull(expire) ||
        isUndefined(expire) ||
        expire >= new Date().getTime()
      ) {
        return value;
      }
      this.remove(key);
      return def;
    } catch (e) {
      return def;
    }
  }

  /**
   * Delete cache based on key
   * @param {string} key
   * @memberof Cache
   */
  remove(key) {
    this.storage.removeItem(this.getKey(key));
  }

  /**
   * Delete all caches of this instance
   */
  clear() {
    this.storage.clear();
  }
};

/**
 * localStorage
 */
export const LocalStorage = new WebStorage({
  storage: localStorage,
  prefixKey: "__",
});
/**
 * sessionStorage
 */
export const SessionStorage = new WebStorage({
  storage: sessionStorage,
  prefixKey: "__",
});
