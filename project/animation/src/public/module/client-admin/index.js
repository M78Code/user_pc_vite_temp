/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共API接口定义
 */

import axios from "project/animation/src/public/utils/http/axios_warpper.js";
let prefix_api = "http://api-doc-server-new.dbsporxxxw1box.com";

/**
 * 获取动画基础配置
 *
 * @param {*} params
 * @param {*} config
 * @param {*} url
 * @returns
 */
export const get_animation_base_config = (
  params,
  url = "/openapi/animation/baseData"
) => {
  return axios.get(`${prefix_api}${url}`, { params });
};

/**
 * 获取 logo 配置
 * @param {*} params
 * @param {*} config
 * @param {*} url
 * @returns
 */
export const get_animation_logo_config = (
  params,
  url = "/openapi/animation/logoData"
) => {
  return axios.get(`${prefix_api}${url}`, { params });
};
