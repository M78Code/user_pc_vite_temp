import Dexie from "dexie";
export const db = new Dexie("base_data");//初始化
db.version(1).stores({
    mids_config: "++mid_id,mid_data",
    matchs_list: "mid,matchs_list",//mid数据表
    menus_info: "mi,menu_info",//menu数据表
    menu_lang: "mi,menu_lang",//menu 多语言表
    menus_mapping: "mi,menus_mapping",//menu map对照表
    match_info: "mid,match_info",//赛事数据表
    tids_info: "tid,tid_info",//tids数据表
    sp_list:"csid,sp_info"//spList数据表
});
