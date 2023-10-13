const modules = import.meta.globEager("./sprite-img/*.js");
const sprite = {};
Object.keys(modules).forEach((key) => {
    const _key = key.replace("./sprite-img/", "").replace(".js", "");
    sprite[_key] = modules[key].default || (() => { });
});
//本地环境要用的key
const local_config = {
    test: {
        default: "key",
        // local_dev: "pc-left-menu-bg-image",
        // local_test: "pc-left-menu-bg-image",
        // local_ylcs: "pc-left-menu-bg-image",
        // idc_pre: "pc-left-menu-bg-image",
        // idc_sandbox: "pc-left-menu-bg-image",
        // idc_lspre: "pc-left-menu-bg-image",
        // idc_online: "pc-left-menu-bg-image",
    }
}
export { local_config, sprite };
/**
 * 对于 精灵图  key 是文件名字也是 单个素材资源的 标识键   ， position 是 精灵图内 item 单个元素的 位置 标识键
 * 调用示例： compute_css(key,position) || compute_css({key,position}) 
 * 对于 非 精灵图    ， key 是  单个素材资源的 标识键
 * 调用示例：   compute_css(key) || compute_css({key})// 单图
 */

