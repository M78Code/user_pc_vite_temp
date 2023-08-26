



import  MatchDataBase from "./match-ctr/match-ctr.js"



/**
 * 1. 数据仓库会存在多个实例 ，
 * 2. WS层会转换 postmassage 直接作用数据分发到 各个数据仓库
 * 3. 数据仓库的销毁逻辑有待确认
 * 4. 详情赛事相当于一条数据的赛事列表
 * 
 * 
 * 
 * 
 * 
 */

// 使用方式
// import {MatchDataWarehouse_PC_List_Common as MatchDataWarehouseInstance} from "src/core/data-warehouse/index.js"
// 或者 
// import {MatchDataWarehouse_PC_List_Common  } from "src/core/data-warehouse/index.js"



/**
 * 
 * PC 的电竞列表 ，虚拟体育的 足蓝 ，以及其他虚拟体育 的 列表 和 详情 在开发过程中确认  备注清楚 
 * 
 * 所有的H5列表数据 以及详情数据 都需要在这里有所 备注 ，
 * 
 * 因为 投注  和 数据来源进行脱离 按照固定的数据结构查找对应的赛事数据 ，理论上来讲所有的赛事 列表和详情 都需要走 这个数据仓库 ，
 * 
 *  
 */





/**
 * PC  数据仓库 常规赛事   通用列表
 */

export const   MatchDataWarehouse_PC_List_Common =new MatchDataBase({name_code:"MatchDataWarehouse_PC_List_Common"})

/**
 * PC  数据仓库  常规赛事  通用详情
 */

export const   MatchDataWarehouse_PC_Detail_Common =new MatchDataBase({name_code:"MatchDataWarehouse_PC_Detail_Common"})











//============================================ H5 ,PC 分割线  ====================================================

/**
 * 
 * H5 的电竞列表 ，虚拟体育的 足蓝 ，以及其他虚拟体育 的 列表 和 详情 在开发过程中确认  备注清楚 
 * 
 * 所有的H5列表数据 以及详情数据 都需要在这里有所 备注 ，
 * 
 * 因为 投注  和 数据来源进行脱离 按照固定的数据结构查找对应的赛事数据 ，理论上来讲所有的赛事 列表和详情 都需要走 这个数据仓库 ，
 * 
 * 甚至是 H5 的猜你喜欢 轮播区域也一样
 */






/**
 * H5  数据仓库 常规赛事   通用列表
 */

export const   MatchDataWarehouse_H5_List_Common =new MatchDataBase({name_code:"MatchDataWarehouse_H5_List_Common"})

/**
 * H5  数据仓库  常规赛事  通用详情
 */

export const   MatchDataWarehouse_H5_Detail_Common =new MatchDataBase({name_code:"MatchDataWarehouse_H5_Detail_Common"})


/**
 * H5  数据仓库 热门页面的    竞足 和其他热门联赛 不含精选赛事 /如果竞足需要拆分就拆分出去 ，应该不需要
 */

export const   MatchDataWarehouse_H5_List_Hot_Main =new MatchDataBase({name_code:"MatchDataWarehouse_H5_List_Hot_Main"})

/**
 * H5  数据仓库 热门页面 和 所有常规赛事页面显示 的 精选赛事   ，不含 详情页的精选推荐  , 这个会跨页 因此不推荐销毁
 */

export const   MatchDataWarehouse_H5_List_Jingxuan =new MatchDataBase({name_code:"MatchDataWarehouse_H5_List_Jingxuan"})


/**
 * H5  数据仓库   详情页的精选推荐 ，比如赛果页面 的精选推荐 ，或者详情页 没赔率显示的 依据当前赛事计算的精选推荐
 */

export const   MatchDataWarehouse_H5_Detail_Jingxuan =new MatchDataBase({name_code:"MatchDataWarehouse_H5_Detail_Jingxuan"})