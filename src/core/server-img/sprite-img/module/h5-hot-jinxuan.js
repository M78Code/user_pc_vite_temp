
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_resource from "app/job/output/assets/index.json";

import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
    default: "h5-hot-jinxuan",
};

// x y 
const item = {
    item_1: 0, // 足球
    item_2: -23, // 蓝球
    item_5: -46, // 网球
    item_7: -69, // 斯诺克
    item_10: -115, // 羽毛球
    item_8: -138, // 乒乓球
    item_9: -161, // 排球
    item_4: -184, // 冰球
    item_3: -207, // 棒球
    item_114: -230, // 橄榄球
}
/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css_obj({ position, theme = 'day' }) {
    //从打包的 环境拿 图片地址
    let url = get(server_resource, `${config[CURRENT_ENV] || config['default']}.${theme}`);
    if (!url) {
        //从本地拿
        url = get(config, theme);
    }
    return {
        "background-image": `url(${url})`,
        "background-position-x": `36px`,
        "background-position-y": `${item[position]}px`,
    };
}

export { compute_css_obj };