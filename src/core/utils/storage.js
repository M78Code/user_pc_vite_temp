/*
 * @Author: tyrone
 * @Date: 2023-07-30 11:13:55
 * @Description: 本地存储方法
 */
//==========sessionStorage CRUD
export const setSessionItem = (key, value) => {
  if (typeof value == "object") {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
};

export const getSessionItem = (key) => {
  const value = sessionStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const removeSessionItem = (key) => {
  sessionStorage.removeItem(key);
};
//==========localStorage CRUD
export const setLocalItem = (key, value) => {
  if (typeof value == "object") {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
};

export const getLocalItem = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const removeLocalItem = (key) => {
  localStorage.removeItem(key);
};
