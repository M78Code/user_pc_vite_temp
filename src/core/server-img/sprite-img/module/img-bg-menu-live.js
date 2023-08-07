// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称


import {  server_resource  } from  "app/job/output/merchant/index.js"



 
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


const url = server_resource[config.label][theme]


function compute_position(key){
   // key  item_0    "0px  -0px"
   // key  item_1    "0px -25.5px"
   // key  item_2    "0px  -51px"
 
    

  return  "0px -25.5px"
}

function compute_css( { key ,theme}) {
  return {
    "background-image":  `url(${url})`,
    "background-position": compute_position(key) ,
  };
}
 
export { compute_css}
