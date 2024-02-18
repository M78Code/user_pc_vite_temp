




import {all_template_classes } from  "./play-template/index.js"

/**
 * 
 * 根据 tpl 的值 生成 玩法配置实例 
 * @param {*} num   tpl的值
 * @returns 
 */
export const generate_detail_play_template_config=(num)=>{
    let module_name =  `DetailPlayTemplate${num}Class`
    let sub_class = all_template_classes[module_name]
  
    return new sub_class()
  
  }

//   使用步骤 
/**
 * 1.循环 getMatchOddsInfo  接口返回的结果的时候 顺带调用这个方法产出实例对象
 * 
 * let play_template_config = generate_detail_play_template_config(num)
 * 
 * 2. 使用默认的  数据初始化 一步到位
 *    play_template_config.init_all_by_default()
 * 
 *  可以 2调用后   3 4 5 单独调用 进行重新计算 ，也可以不调用 2 直接 345 ， 
 * 3. 初始化 玩法数据
 *     play_template_config.init_hp_data()
 * 4.初始化 布局数据
 *    play_template_config.init_style_data()
 * 5. 初始化 样式数据
 *   play_template_config.init_style_data()
 * 
 * 
 * 
 */