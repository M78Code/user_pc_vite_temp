/**
 * 详情页面 玩法 级别 布局专用  通用 类
 *
 */
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
import { uid } from "quasar";
import * as BASE_CONFIG from "./play-template-base.js";

const { PROJECT_NAME , IS_MAIN_PROJECT_PC,  IS_MAIN_PROJECT_H5}  = BUILDIN_CONFIG
class DetailPlayTemplateBaseClass {
  constructor() {}

  /**
   *  初始化玩法数据
   * @param {*} params
   */
  init_hp_data(hp_obj = {}, params) {
    let { hpt, possible_pids, mid, topKey, hshow } = hp_obj;

    // 可能的 玩法 id ,辅助性的  无实际作用
    this.possible_pids = possible_pids || [];
    //模板ID
    this.local_hpt = hpt || 0;
    //topKey
    this.topKey = topKey || "";
    // 玩法的展开收起状态 布尔值 ,这个值 可以被覆写
    this.hshow = !!(params.topKey || hshow || false);
    // 赛事ID
    this.mid = mid;
    // ID 数据对象ID  ,topkey 正常不会重复的 ，除非出错，或者走 uid
    this.DPTID = this.topKey || uid();
    // 项目是 H5,还是PC 
    this.IS_H5 = IS_MAIN_PROJECT_H5
    // 项目名字 
    this.PROJECT_NAME = PROJECT_NAME
    

    
  }
  /**
   * 初始化 布局数据
   */
  init_layout_data(params) {
    let obj = Object.assign({}, BASE_CONFIG.default_layout_config, params);
    this.layout_data= obj
  }
  /**
   * 初始化 样式数据
   */
  init_style_data(params) {
    let obj = Object.assign({}, BASE_CONFIG.default_style_config, params);
    this.style_data= obj
  }

  /**
   * 设置   玩法的展开收起状态 布尔值
   * @param {*} val
   */
  set_hshow(val) {
    // 玩法的展开收起状态 布尔值 ,这个值 可以被覆写
    this.hshow = !!val;
  }
/**
 * 用 玩法数据初始化 所有 
 * @param {*} hp_obj 
 * @param {*} params 
 */
  init_all_by_default(hp_obj = {}, params = {}){
    this.init_hp_data()
    this.init_layout_data()
    this.init_style_data()
  }
 
  /**
   * 计算 OL 投注项的列表行数，不含特殊的 
   */
  compute_ol_row_nmm(hp_obj,hp_index =0){

    // let {ol=[]} = hp_obj[hp_index]
   
    // ol.length

  }
}

export default DetailPlayTemplateBaseClass;
