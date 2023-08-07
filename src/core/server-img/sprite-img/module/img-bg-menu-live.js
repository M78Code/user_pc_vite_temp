// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
const config = {
  label: "img-bg-menu-live",
  config_dark,
  config_day,
};

const config_dark = {
  common: "",
  local_test: "srccoreserver-imgsprite-imgmoduleimg-bg-menu-live.js",
};
const item = {
  item_1: 1,
  item_2: 2,
};
const config_day = {
  local_test: "srccoreserver-imgsprite-imgmoduleimg-bg-menu-live.js",
};
function compute_css(key) {
  return {
    "background-image": "url(url)",
    "background-position": "0px -25.5px",
  };
}
export { config };
