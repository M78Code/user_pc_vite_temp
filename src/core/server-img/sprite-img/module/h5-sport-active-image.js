// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_resource from "app/job/output/assets/index.js";

import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
const config = {
    default: "pc-left-menu-bg-image",
    // local_dev: "pc-left-menu-bg-image",
    local_test: "https://user-h5-bw3.sportxxx278gwf4.com/2023-09-09-17-11-50/image/wwwassets/bw3/menu/sport_menu_01.png",
    // local_ylcs: "pc-left-menu-bg-image",
    // idc_pre: "pc-left-menu-bg-image",
    // idc_sandbox: "pc-left-menu-bg-image",
    // idc_lspre: "pc-left-menu-bg-image",
    // idc_online: "pc-left-menu-bg-image",

};
/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css({ position, theme }) {
    //从打包的 环境拿 图片地址
    let url = get(server_resource, `${config[CURRENT_ENV] || config['default']}.${theme}`);
    if (!url) {
        //从本地拿
        url = get(config, CURRENT_ENV) || get(config, theme);
    }
    return {
        "background-image": `url(${url})`,
        "background-position-y": `calc(var(--per)*${position})`,
    };
}

export { compute_css };