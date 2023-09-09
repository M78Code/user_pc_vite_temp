const BUILDIN_CONFIG = window.BUILDIN_CONFIG;

 
const PROJECT_NAME = BUILDIN_CONFIG.TARGET_PROJECT_NAME;

//通用

import lodash from "lodash";

// import { useRouter, useRoute } from 'vue-router';
// const router = useRouter();
// const route = useRoute();

export * from "src/core/format/index.js";
export * from "src/core/constant/index.js";
export * from "src/core/utils/index.js";
export * from "src/core/enter-params/index.js";

// ==============================   间接转出     项目无差异的        ======================================
import { i18n, loadLanguageAsync, map_lang, t, i18n_t } from "src/boot/i18n.js";

import {
  useMittOn,
  useMittEmit,
  useMittEmitterGenerator,
  MITT_TYPES,
} from "src/core/mitt/index.js";
import uid from "src/core/uuid/index.js";
import VrSportCtr from "src/core/vr-sport/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import MatchDetailCtr from "src/core/match-detail/match-detail-class.js";
import {
  http,
  axios_loop,
  infoUpload,
  zhuge,
  AllDomain,
} from "src/core/http/index.js";

import PageSourceData from "src/core/page-source/page-source.js";

// ==============================  间接转出     默认输出   项目有差异的    ======================================

// pc

import MenuData_PC from "src/core/menu-pc/menu-data-class.js";
import MatchListCard_PC from "src/core/match-list-h5/match-card/match-list-card-class.js";
import MatchListCardData_PC from "src/core/match-list-h5/match-card/module/match-list-card-data-class.js";

// h5

import MenuData_H5 from "src/core/menu-h5/menu-data-class.js";
import MatchListCard_H5 from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListCardData_H5 from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

const IS_PC = PROJECT_NAME.includes("pc");
const MenuData = IS_PC ? MenuData_PC : MenuData_H5;
const MatchListCard = IS_PC ? MatchListCard_PC : MatchListCard_H5;
const MatchListCardData = IS_PC ? MatchListCardData_PC : MatchListCardData_H5;

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

const MatchDataWarehouse_PC_List_Common = reactive(new MatchDataBase({
  name_code: "MatchDataWarehouse_PC_List_Common",
}));

/**
 * PC  数据仓库  常规赛事  通用详情
 */

const MatchDataWarehouse_PC_Detail_Common = new MatchDataBase({
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

const MatchDataWarehouse_H5_List_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_H5_List_Common",
});

/**
 * H5  数据仓库  常规赛事  通用详情
 */

const MatchDataWarehouse_H5_Detail_Common = new MatchDataBase({
  name_code: "MatchDataWarehouse_H5_Detail_Common",
});

/**
 * H5  数据仓库 热门页面的    竞足 和其他热门联赛 不含精选赛事 /如果竞足需要拆分就拆分出去 ，应该不需要
 */

const MatchDataWarehouse_H5_List_Hot_Main = new MatchDataBase({
  name_code: "MatchDataWarehouse_H5_List_Hot_Main",
});

/**
 * H5  数据仓库 热门页面 和 所有常规赛事页面显示 的 精选赛事   ，不含 详情页的精选推荐  , 这个会跨页 因此不推荐销毁
 */

const MatchDataWarehouse_H5_List_Jingxuan = new MatchDataBase({
  name_code: "MatchDataWarehouse_H5_List_Jingxuan",
});

/**
 * H5  数据仓库   详情页的精选推荐 ，比如赛果页面 的精选推荐 ，或者详情页 没赔率显示的 依据当前赛事计算的精选推荐
 */

const MatchDataWarehouse_H5_Detail_Jingxuan = new MatchDataBase({
  name_code: "MatchDataWarehouse_H5_Detail_Jingxuan",
});

/**
 * PC  布局
 */

import LayOutMain_pc from "src/core/layout/index.js";
import { reactive } from "vue";

/**
 *
 * 所有的用法 都一样
 * import { xxxx } from "src/core/index.js";
 *
 * import { is_eports_csid  } from "src/core/index.js";
 *
 */

export {
  //
  http,
  axios_loop,
  infoUpload,
  zhuge,
  AllDomain,
  // 国际化相关
  i18n,
  loadLanguageAsync,
  map_lang,
  t,
  i18n_t,
  // emit相关
  useMittOn,
  useMittEmit,
  useMittEmitterGenerator,
  MITT_TYPES,
  uid,
  VrSportCtr,
  MatchDetailCtr,
  UserCtr,
  IS_PC,
  MenuData,
  MatchListCard,
  MatchListCardData,
  PageSourceData,
  MatchDataWarehouse_PC_List_Common,
  MatchDataWarehouse_PC_Detail_Common,
  MatchDataWarehouse_H5_List_Common,
  MatchDataWarehouse_H5_Detail_Common,
  MatchDataWarehouse_H5_List_Hot_Main,
  MatchDataWarehouse_H5_List_Jingxuan,
  MatchDataWarehouse_H5_Detail_Jingxuan,
  LayOutMain_pc,
};
