
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_resource from "app/job/output/assets/index.json";

import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
    default: "h5-left-menu-image",
    // local_dev: "pc-left-menu-bg-image",
    // local_test: "",
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
function compute_css_obj({ position, theme }) {
    //从打包的 环境拿 图片地址
    let url = get(server_resource, `${config[CURRENT_ENV] || config['default']}.${theme}`);
    if (!url) {
        //从本地拿
        url = get(config, theme);
    }
    return {
        "background-image": `url(${url})`,
        "background-position-y": `calc(var(--per)*${position})`,
    };
}

export { compute_css_obj };