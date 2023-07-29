import { isNull, isUndefined } from "lodash";
/**
 * 创建一个 web Storage
 * @param {*}
 * prefixKey 存储前戳 storage
 * storage localStorage||sessionStorage
 * timeout 超时时间秒
 * hasEncrypt 是否加密 加密暂时没有 写
 */
export const createStorage = ({
  prefixKey = "",
  storage = sessionStorage,
  timeout = null,
  hasEncrypt = false,
}) => {
  /**
   * Cache class
   * Construction parameters can be passed into sessionStorage, localStorage,
   * @class Cache
   * @example
   */
  const WebStorage = class WebStorage {
    storage;
    prefixKey;
    encryption;
    hasEncrypt;
    /**
     *
     * @param {*} storage
     */
    constructor() {
      this.storage = storage;
      this.prefixKey = prefixKey;
      this.encryption = {
        encryptByAES: (e) => e,
        decryptByAES: (e) => e,
      };
      this.hasEncrypt = hasEncrypt;
    }
    getKey(key) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * Set cache
     * @param {string} key
     * @param {*} value
     * @param {*} expire Expiration time in seconds
     * @memberof Cache
     */
    set(key, value, expire = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire:
          !isNull(expire) || !isUndefined(expire)
            ? new Date().getTime() + expire * 1000
            : null,
      });
      const stringifyValue = this.hasEncrypt
        ? this.encryption.encryptByAES(stringData)
        : stringData;
      this.storage.setItem(this.getKey(key), stringData);
    }

    /**
     * Read cache
     * @param {string} key
     * @param {*} def
     * @memberof Cache
     */
    get(key, def) {
      const val = this.storage.getItem(this.getKey(key));
      if (!val) return def;

      try {
        const decVal = this.hasEncrypt
          ? this.encryption.decryptByAES(val)
          : val;
        const data = JSON.parse(decVal);
        const { value, expire } = data;
        if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
          return value;
        }
        this.remove(key);
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
  return new WebStorage();
};
export const LocalStorage = createStorage({
  storage: localStorage,
  prefixKey: "__",
});
export const SessionStorage = createStorage({
  storage: sessionStorage,
  prefixKey: "__",
});
