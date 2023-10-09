// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import all_assets from "app/job/output/assets/index.json";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
const config = {
    default: "menu-sport-icon-image",
    // local_dev: "pc-left-menu-bg-image",
    // local_test: "https://user-h5-bw3.sportxxx278gwf4.com/2023-09-09-17-11-50/image/wwwassets/bw3/menu/sport_menu_02.png",
    // local_ylcs: "pc-left-menu-bg-image",
    // idc_pre: "pc-left-menu-bg-image",
    // idc_sandbox: "pc-left-menu-bg-image",
    // idc_lspre: "pc-left-menu-bg-image",
    // idc_online: "pc-left-menu-bg-image",

};
function get_position(type) {
    return {
        1: 1,
        2: 3,
        3: 28,
        4: 6,
        5: 19,
        6: 4,
        7: 15,
        10: 22,
        11: 13,
        12: 10,
        13: 12,
        8: 7,
        9: 6,
        20: 4,
        17: 6,
        2101: 39,
        2103: 40,
        2102: 41,
        2100: 42,
        16: 14,
        23: 8,
        41: 9,
        44: 10,
        1002: 11,
        45: 12,
        43: 13,
        24: 14,
        14: 20,
        27: 16,
        25: 17,
        39: 18,
        13: 19,
        22: 20,
        26: 21,
        15: 8,
        1011: 23,
        1009: 24,
        30: 26,
        19: 28,
        1001: 29,
        1004: 30,
        29: 31,
        48: 32,
        49: 33,
        50: 34,
        51: 35,
        52: 36,
        53: 38,
        3001: 39,
        3003: 40,
        3004: 41,
        3002: 42,
        20030: 43,
        20031: 44,
        20032: 45,
        20026: 46,
        20027: 47,
        20033: 48,
        20034: 49,
        20035: 50,
        20036: 51,
        20037: 52,
        20038: 53,
        20039: 54,
        100: 55,
        40: 56,
        1010: 57
    }[type]

}

/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css({ position, theme }) {
    const server_resource = all_assets[theme]

    //从打包的 环境拿 图片地址
    let url = get(server_resource, `${config[CURRENT_ENV] || config['default']}.${theme}`);
    if (!url) {
        //从本地拿
        url = get(config, theme);
    }
    return {
        "background-image": `url(${url})`,
        "background-position-y": `calc(var(--per)*${get_position(position)})`,
    };
}

export { compute_css };