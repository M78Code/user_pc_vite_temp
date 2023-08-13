/*
 * @Author: Cable
 * @Date: 2020-09-09 12:30
 * @Description: 赛事主列表容器卡片逻辑
 */
/**
 * 赛事主列表容器卡片逻辑 设计思路
 * 原始痛点：
 *     1.PC 列表按照赛事维度循环来渲染 ， 在赛事多，赛事变更时候会特别卡
 *     2.更新影响维度较大 ，粒度较大
 *     3.比较不好做到 脱离文档流
 *     4.总会为了高度等问题操作DOM 引起强制回流
 * 设计理念：
 *     1. 容器， 卡片 ，骨架  高度原始计算 ， 内部填词 ，===》 类似 楼房 骨架和 房间装修
 *     2. 根据PC 业务特殊性 ，PC 本身性能比较强大， 粒度选择 联赛层级 ， 提升了粒度 ， 缩减了步长
 *        步长： 赛事越多，处理的时候步长越大，效率越低
 *        粒度： 粒度由原来的整个列表 变更为  联赛级别  ，  联赛中间层 ，向上接后台原始数据，向下对应赛事粒度 （卡片）
 *     3. 房屋装修 ，骨架成型后，房屋内部随便怎么装修 ，不影响骨架
 *
 * 后期优化方向：
 *     1.css布局 卡片内分层，脱离文档流
 *     2.前端视图显示级别：
 *          level 1 赔率 状态等所有都显示  ws更新
 *          level 2 赔率 状态等所有都显示  ws不更新
 *          level 3 只显示主客队等静态内容  不显示时间 赔率 状态等   ws不更新
 *          level 4 只显示空格容器 空div
 *     3.因为前端列表数据形式的视图渲染 当索引改变的时候重新渲染数据 开销较大 所以优化方案如下
 *          根据列表 赛种的顺序是固定的 可以在一定程度上预留容器
 *     4.当我们页面数据变更的东西离我们视觉区比较远的情况 可以只改变高度，甚至高度都可以不用改，内存里面跑一份高度映射
 *
 *
 * 备注： 卡片 ===大部分场景下 等同于容器
 *
 * 数据依据：
 *     1.列表后台返回的数据
 *     2.前端页面所在页面 业务特殊性
 *     3.单个赛事的模板
 *     4.附加需求 （扩展性）
 *
 * 特别留意：
 *     1.顺序问题：  永远记得：  先骨架 >>>> 联赛卡片 >>>> 赛事卡片（角球）
 *     2.附加需求:   例如目前的 滚球下的 球类显示行
 *     3.更新粒度问题 ： 理论上  赛事级别 最佳 ， 本期 联赛级别
 *     4.冠军玩法、虚拟体育不走卡片容器逻辑
 *     5.一个列表里面联赛ID是有可能多次重复的，赛事ID 是不可能重复的
 *
 *
 *
 * 卡片类型：
 *      sport_title  -----  球种标题
 *      play_title   -----  滚球盘标题
 *      no_start_title  --- 未开赛标题
 *      league_title  ----  联赛标题
 *      champion_league_title - 冠军联赛标题
 *      league_container -  联赛容器
 *
 *
 */
import {
  match_status_title_card_template,
  sport_title_card_template,
  league_title_card_template,
  fold_template,
  league_container_card_template,
  no_data_card_template
} from "./card-template-config.js"
import { MATCH_LIST_TEMPLATE_CONFIG } from  "../list-template/index.js"
import  MatchListCardData from  "./module/match-list-card-data-class.js"

import {conpute_match_list_card_offset} from  "./module/card-show-offset.js"

 class MatchListCard {
  constructor(){}
  init() {
    this.view={}
  
    // 代表在哪一个列表里面（滚球、今日、早盘、串关）等等
    this.which_list = ''
  
   
  }




  /**
   * @Description 设置联赛容器卡片赛事数据加载状态
   * @param {object} league_title_card_obj 卡片对象
   * @param load_data_status 加载状态
  */
  set_league_card_load_data_status(league_title_card_obj,load_data_status){
    // 设置联赛加载无数据状态
    if(['user_api_limited','empty'].includes(load_data_status)){
      let league_container = MatchListCardData.all_card_obj[league_title_card_obj.league_container_card_key] || {}
      league_container.load_data_status = load_data_status
    }
  }

 
  /**
   * @Description 刷新联赛，展开联赛接口报限流错误调用
   * @param {object} card_obj 刷新的联赛卡片对象
  */
  refresh_league(card_obj){
    card_obj.load_data_status = 'loading'
    let params = {
      mids: card_obj.mids.split(','),
    };
    // 拉取http请求
    window.vue.$root.$emit(window.vue.emit_cmd.EMIT_API_BYMIDS,params, status => {
      let league_title_card_obj = MatchListCardData.all_card_obj[card_obj.league_title_card_key] || {}
      this.set_league_card_load_data_status(league_title_card_obj,status)
    });
  }





}



export default new MatchListCard()