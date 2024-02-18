/**
 * 业务逻辑  相关 
 * 数据仓库 
 * 通用项目：  各个版本 体育 客户端 H5,PC ,   
 * 不通用项目：活动动画等其他 项目
 * 
 * 
 */


//=================================     数据仓库=================================
import MatchDataBase from "src/core/data-warehouse/match-ctr/match-ctr.js";

/**
 * 1. 数据仓库会存在多个实例 ，
 * 2. WS层会转换 postmassage 直接作用数据分发到 各个数据仓库
 * 3. 数据仓库的销毁逻辑有待确认
 * 4. 详情赛事相当于一条数据的赛事列表
 * 5. 列表页渲染流程逻辑：
 *    列表使用菜单计算模板，通过模板配置渲染视图框架 生成好格子，
 *    ==>>> 通过单个玩法 ols 下的 _hpid 或者 _hpid_fn   玩法ID （动态的通过算法自己实现，和数据仓库无关）
 *    ==>>> 通过玩法ID 去数据仓库 取数据 显示赔率填坑
 * 6. 详情页渲染流程逻辑：
 *    详情页使用 玩法集和玩法ID映射关系 ，过滤显示 需要显示的玩法数据
 *    ==>>> 本质上详情页的数据都是全量的，并且需要留存，
 *    ==>>> 玩法集菜单切换 ，只是所有投注 玩法 tab 下数据的显示隐藏
 *    ==>>> 玩法置顶逻辑在 详情页视图控制对象内做，或者在另外单独的对象类来做，本身属于视图 和数据仓库无关
 *    ==>>> 每个玩法的玩法显示模板数据内有，读取显示进行渲染相关的详情模板就可以了，
 *    ==>>> 同列表一样 ，详情玩法模板 ，只提供辅助参数和视图填充逻辑 ，不负责赔率等合并，一样的只显示框架，进行数据填坑
 *
 *
 *
 *
 */

// 使用方式  别名：   MatchDataWarehouseInstance  暂时不推荐  最好别用
// import {MatchDataWarehouse_PC_List_Common as MatchDataWarehouseInstance} from "src/core/data-warehouse/index.js"
// 或者  推荐
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

export const MatchDataWarehouse_PC_List_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_PC_List_Common",
});

/**
 * 欧洲版 PC/H5 数据仓库 15mins 顶部列表
 */

export const MatchDataWarehouse_ouzhou_PC_l5mins_List_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_ouzhou_PC_l5mins_List_Common",
});

/**
 * 欧洲版 PC/H5 数据仓库 五大联赛 仓库
 */

export const MatchDataWarehouse_ouzhou_PC_five_league_List_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_ouzhou_PC_five_league_List_Common",
});

/**
 * 欧洲版 PC/H5 数据仓库 热推 顶部列表
 */

export const MatchDataWarehouse_ouzhou_PC_hots_List_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_ouzhou_PC_hots_List_Common",
});

/**
 * 欧洲版 PC/H5 数据仓库 滚球 列表
 */

export const MatchDataWarehouse_ouzhou_PC_in_play_List_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_ouzhou_PC_in_play_List_Common",
});

/**
 * 欧洲版 PC/H5 数据仓库 通用列表
 */

export const MatchDataWarehouse_ouzhou_PC_List_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_ouzhou_PC_List_Common",
});

/**
 * PC  数据仓库  常规赛事  通用详情
 */

export const MatchDataWarehouse_PC_Detail_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_PC_Detail_Common",
});



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
export const MatchDataWarehouse_H5_List_Common = new MatchDataBase({
    name_code: "MatchDataWarehouse_H5_List_Common",
    set_list_to_obj: 1,
  });
  
  /**
   * H5  数据仓库  常规赛事  通用详情
   */
  
  export const MatchDataWarehouse_H5_Detail_Common = new MatchDataBase({
    name_code: "MatchDataWarehouse_H5_Detail_Common",
  });
  console.log("----------------",MatchDataWarehouse_H5_Detail_Common.list_to_obj)
  /**
   * H5  数据仓库 热门页面的    竞足 和其他热门联赛 不含精选赛事 /如果竞足需要拆分就拆分出去 ，应该不需要
   */
  
  export const MatchDataWarehouse_H5_List_Hot_Main = new MatchDataBase({
    name_code: "MatchDataWarehouse_H5_List_Hot_Main",
  });
  
  /**
   * H5  数据仓库 热门页面 和 所有常规赛事页面显示 的 精选赛事   ，不含 详情页的精选推荐  , 这个会跨页 因此不推荐销毁
   */
  
  export const MatchDataWarehouse_H5_List_Jingxuan = new MatchDataBase({
    name_code: "MatchDataWarehouse_H5_List_Jingxuan",
  });
  
  /**
   * H5  数据仓库   详情页的精选推荐 ，比如赛果页面 的精选推荐 ，或者详情页 没赔率显示的 依据当前赛事计算的精选推荐
   */
  
  export const MatchDataWarehouse_H5_Detail_Jingxuan = new MatchDataBase({
    name_code: "MatchDataWarehouse_H5_Detail_Jingxuan",
  });