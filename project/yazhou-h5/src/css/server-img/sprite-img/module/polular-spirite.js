
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import all_assets from "app/job/output/assets/index.json";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
const config = {
    default: "polular-spirite",
    // local_dev: "pc-left-menu-bg-image",
    // local_test: "",
    // local_ylcs: "pc-left-menu-bg-image",
    // idc_pre: "pc-left-menu-bg-image",
    // idc_sandbox: "pc-left-menu-bg-image",
    // idc_lspre: "pc-left-menu-bg-image",
    // idc_online: "pc-left-menu-bg-image",
};
function get_positon(csid) {
    {
        let csid_poz_y = 1;
        switch (csid) {
            case 1:
                csid_poz_y = 0;// 足球
                break;
            case 2:
                csid_poz_y = 1;// 篮球
                break;
            case 5:
                csid_poz_y = 2;// 网球
                break;
            case 7:
                csid_poz_y = 7;// 斯诺克
                break;
            case 10:
                csid_poz_y = 3;// 羽毛球
                break;
            case 8:
                csid_poz_y = 4;// 乒乓球
                break;
            case 9:
                csid_poz_y = 5;// 排球
                break;
            case 4:
                csid_poz_y = 6;// 冰球
                break;
            case 3:
                csid_poz_y = 8;// 棒球
                break;
            case 6:
                csid_poz_y = 9;// 美式足球
                break;
        }
        return csid_poz_y
    }
}

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
        "background-position-y": `calc(var(--per)*${get_positon(position)})`,
    };
}
export { compute_css };