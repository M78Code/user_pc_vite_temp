import { LocalStorage } from "xxx";

/**
 * 获取 uuid
 * @returns 
 */
export function getUUID() {
  const _uuid = LocalStorage.getItem("uuid");
  if (_uuid) {
    return _uuid;
  }
  return Math.random();
}
