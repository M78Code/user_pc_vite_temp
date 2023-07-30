import { getLocalItem } from 'src/public/utils/storage'

/**
 * 获取 uuid
 * @returns 
 */
export function getUUID() {
  const _uuid = getLocalItem("uuid");
  if (_uuid) {
    return _uuid;
  }
  return Math.random();
}
