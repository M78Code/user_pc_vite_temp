
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_assets from "app/job/output/assets/index.json";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
const config = {
    default: "menu-lang",
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
function compute_css({ position, theme }) {
    const server_resource = all_assets[theme]
    //从打包的 环境拿 图片地址
    let url = get(server_resource, `${config[CURRENT_ENV] || config.default}`);
    if (!url) {
      //从本地拿
      url = get(config, CURRENT_ENV);
    }
    return {
        "background-image": `url(${url})`,
        "background-position-y": `calc(var(--per)*${position})`,
    };
}
export { compute_css };