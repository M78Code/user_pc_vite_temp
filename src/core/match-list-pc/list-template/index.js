/**
 * 
 * 这里是所有球种的数据模板统一抛出的地方
 * 具体的模板配置在 ./module下
 * 这里注意的是  从菜单中拿的对应球种的 对应玩法的id
 * 以id来映射 数据模板
 * 然后  根据数据模板  走 视图模板
 * 中间的链接点是 pc-menu-match-template.js
 * 主要是两个字段   data_tpl_id     view_tpl_id   数据模板id    视图模板id
 */

import  * as template_1_config from "./module/template-1.js"
import  * as template_2_config from "./module/template-2.js"
import  * as template_3_config from "./module/template-3.js"
import  * as template_5_config from "./module/template-5.js"
import  * as template_6_config from "./module/template-6.js"
import  * as template_7_config from "./module/template-7.js"
import  * as template_8_config from "./module/template-8.js"
import  * as template_9_config from "./module/template-9.js"
import  * as template_10_config from "./module/template-10.js"
import  * as template_11_config from "./module/template-11.js"
import  * as template_12_config from "./module/template-12.js"
import  * as template_13_config from "./module/template-13.js"
import  * as template_15_config from "./module/template-15.js"
import  * as template_16_config from "./module/template-16.js"
import  * as template_17_config from "./module/template-17.js"
import  * as template_18_config from "./module/template-18.js"
import  * as template_19_config from "./module/template-19.js"
import  * as template_20_config from "./module/template-20.js"
import  * as template_21_config from "./module/template-21.js"
import  * as template_22_config from "./module/template-22.js"
import  * as template_23_config from "./module/template-23.js"
import  * as template_24_config from "./module/template-24.js"
import  * as template_25_config from "./module/template-25.js"
import  * as template_26_config from "./module/template-26.js"
import  * as template_27_config from "./module/template-27.js"
import  * as template_28_config from "./module/template-28.js"
import  * as template_29_config from "./module/template-29.js"
import  * as template_30_config from "./module/template-30.js"
import  * as template_101_config from "./module/template-101.js"
import  * as template_102_config from "./module/template-102.js"
import  * as template_104_config from "./module/template-104.js"
import  * as template_106_config from "./module/template-106.js"
import  * as template_109_config from "./module/template-109.js"
import  * as template_111_config from "./module/template-111.js"
import  * as template_112_config from "./module/template-112.js"
import  * as template_117_config from "./module/template-117.js"
import  * as template_118_config from "./module/template-118.js"
import  * as template_119_config from "./module/template-119.js"
import  * as template_120_config from "./module/template-120.js"
import  * as template_124_config from "./module/template-124.js"
import  * as template_126_config from "./module/template-126.js"
import  * as template_129_config from "./module/template-129.js"


/**
 * 赛事模板玩法配置
 * main_handicap_list   主盘口 盘口列表
 * add_handicap_list    附加盘 盘口列表
 * cur_handicap_list    当前局 盘口列表
 * hid    盘口ID
 * _hpid  玩法ID
 * ol     投注项列表
 */




export const  MATCH_LIST_TEMPLATE_CONFIG={
    template_1_config,
    template_2_config,
    template_3_config,
    template_5_config,
    template_6_config,
    template_7_config,
    template_8_config,
    template_9_config,
    template_10_config,
    template_11_config,
    template_12_config,
    template_13_config,
    template_15_config,
    template_16_config,
    template_17_config,
    template_18_config,
    template_19_config,
    template_20_config,
    template_21_config,
    template_22_config,
    template_23_config,
    template_24_config,
    template_25_config,
    template_26_config,
    template_27_config,
    template_28_config,
    template_29_config,
    template_30_config,
    template_101_config,
    template_102_config,
    template_104_config,
    template_106_config,
    template_109_config,
    template_111_config,
    template_112_config,
    template_117_config,
    template_118_config,
    template_119_config,
    template_120_config,
    template_124_config,
    template_126_config,
    template_129_config
}

 