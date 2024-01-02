import axios from "axios";

//模块之间通信 ，去耦合化的一个 事件通信 仓库

import * as all_preload_image_obj from "/src/core/pre-load/index.js";

import {
  useMittOn,
  useMittEmit,
  useMitt,
  useMittEmitterGenerator,
  MITT_TYPES,
} from "src/core/mitt/index.js";

// MITT_PRELOAD_IMAGE

import {
  compute_local_project_file_path,
  compute_local_common_file_path,
} from "src/output/module/constant-utils.js";

//
/**
 *
 * @param {*} params   {key }  key 的来源是   all_preload_image_obj 的键
 *
 * 如果要多个 就多次调用
 */

// let params ={
//    key:'common_sport_list_image'

// }
let MITT_PRELOAD_IMAGE_CALLBACK = (params) => {
  let { key = "" } = params;
  let arr = all_preload_image_obj[key] || [];

  let origin = location.origin;

  let final_arr = [];

  arr = arr.map((x) => {
    let { type, path = [] } = x;

    path.map((y) => {
      let url = "";
      if (("" + y).startsWith("/")) {
        if (type == "common") {
          url = origin + compute_local_common_file_path(y);
        } else if (type == "project") {
          url = origin + compute_local_project_file_path(y);
        }
      } else {
        url = y;
      }

      final_arr.push(url);
    });

    final_arr = final_arr.filter((x) => x);
  });

  final_arr.map((x) => {
    try {
      axios.get(x);
    } catch (error) {}
  });
};


const pre_load_img=(key)=>{
  MITT_PRELOAD_IMAGE_CALLBACK(key)
  // useMittOn(MITT_TYPES.MITT_PRELOAD_IMAGE, MITT_PRELOAD_IMAGE_CALLBACK);
}



/**
 *   import {pre_load_img} from "src/"
 * 
 * 
 */


export { pre_load_img };
