import Dexie from "dexie";
export const db = new Dexie("base_data");

db.version(1).stores({
    mids_config: "++mid_id,mid_data",
    
    mids_info: "mid,mid_info",// mid 数据表
    menus_i18n: "play_id,play_name",//menu 数据表
    match_info: "mi,match_info",//赛事数据表

    tids_info: "tid,tid_info",//tids数据表
    sp_list:"csid,sp_info",//spList数据表
    tids_obj:"csid,tids_obj",//tids_obj数据表
});
