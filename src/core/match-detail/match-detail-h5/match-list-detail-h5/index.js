/**
 * H5   列表 和 详情  之间的 数据中间件
 *
 * 1. 列表跳转详情的 ：
 *   ==》跳转详情之前
 *   ==》调用列表数据仓库 读取当前mid 的 mid_obj
 *   ==》直接设置 详情数据仓库 set_list([obj])
 *   ==》跳转详情
 *
 *
 * 2.  详情跳转列表
 *          赛事已结束： {
 *          ==> 拉取一次元数据 ，菜单和 列表队列映射关系
 *          }
 *          赛事没有结束：{
 *            不用去数据同步
 *            ===》读取之前存的 来源菜单 来源页面
 *            ===》调用菜单那边的方法  设置 要用的菜单
 *            ===》切路由
 *            ===》列表走自己的 整体逻辑
 *
 *          }
 *
 * 需要存储：
 *  1. 从哪里来  ， （为了 知道 往哪里返回）
 *
 *
 *
 *
 * 详情页面自动切   元数据一定有 ,如果没有 则： {mid}
 *
 * 1.init_detail_form_base_data
 *
 *
 *
 *
 *
 */

 class MatchListDetailMiddleware {
  constructor() {
    this.init();
    // 来源页面  source_page
  }
  init() {
    // 详情进入列表场景下：返回来源列表页面必须参数
    this.back_to_list_params = {};
  }
  /**
   * 列表进详情
   * @param {*} params
   */
  before_enter_detail_form_list(params) {
    let {
      MatchDataWarehouse_source,
      MatchDataWarehouse_target,
      mid,
      back_to_source_params = {},
    } = params;
    // console.error(MatchDataWarehouse_source);
    // 读取 来源数据仓库 赛事基础信息
    let mid_data = MatchDataWarehouse_source.mid_obj[`${mid}_`];
    // 写入 目标数据仓库 赛事基础信息
    MatchDataWarehouse_target.set_match_details(mid_data);
    // 详情进入列表场景下：返回来源列表页面必须参数
    this.back_to_source_params = back_to_source_params;
  }

  /**
   * 拿元数据组装 mid 基础信息对象
   * @param {*} mid
   */
  init_detail_form_base_data(params) {
    let { MatchDataWarehouse_target, mid } = params;

    // 从 元数据 拿基础信息
    let mid_obj = { mid };

    // 写入 目标数据仓库 赛事基础信息
    MatchDataWarehouse_target.set_match_details(mid_obj);
  }
}


export default new MatchListDetailMiddleware()