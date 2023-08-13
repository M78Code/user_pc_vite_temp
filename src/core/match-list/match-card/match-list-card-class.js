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
} from "./card_config.js"
import { MATCH_LIST_TEMPLATE_CONFIG } from  "../list-template/index.js"
import  MatchListCardData from  "../match-card/module/card-data-class.js"


 class MatchListCard {
  constructor(){}
  init() {
    this.view={}
    //列表数据挂载
    this.match_list_data = {};
    // 代表在哪一个列表里面（滚球、今日、早盘、串关）等等
    this.which_list = ''
  
   
  }
 /**
  *  列表数据仓库 的列表数据 的  挂载点 ，方便类内部计算使用
  *  严禁 数据仓库内 以及这个类内对  match_list_data 进行深拷贝 以及地址更换操作
  *  每次更换地址 必须调用这个方法 再次更新引用
  *  需要 列表第一次数据回来的时候 设置 数据仓库后 ，引用赋值i
  *
  * @param {*} match_list_data
  */
  init_match_list_data(match_list_data){
        //列表数据挂载
        this.match_list_data = match_list_data;
  }
  //计算 当前的 赛事列表 级别 的 卡片 数据
  /**
   * 数据依据：
   *    1. 数据仓库的 列表赛事数据  假定  match_list
   *    2. 当前在哪一个列表  假定 which_list
   *    3. 单种赛事基础模板 ， 可以走赛种 维度 （赛种 到 模板 配置）  假定
   *    4. 联赛折叠     在  联赛卡片内
   *    5. 赛种折叠   放到 第一个 联赛卡片内
   *    6. 未开赛 ， 已开赛折叠  放到    放到 第一个 联赛卡片内
   *
   *
   *
   * 调用时机：
   *    1. 列表初始化，赛事列表方法调度
   *    2. 赛事增删 ，(可以走小的方法 ，不一定走这个)
   *    3. 列表排序变更 ， 代码内一般 还是走  调用时机 1
   *    4. 筛选过滤 ， 等同于 1
   *    5. 赛事状态变更
   *    6. 附加盘增减 ，
   *    7. 角球类玩法 开关
   *
   * 执行流程： 第一步第二步可以一起执行 计算 ，最好一起计算   ，这里只是 基本梳理
   *   第一步：
   *      根据当前的 数据列表 ， 目前后台返回的都是赛事粒度的  计算出 几个映射关系
   *      单一赛种列表页面： 开赛层级 -->  联赛层级 ---》赛事层级，（需要注意，开赛未开赛都有 同一个联赛）
   *      全部赛种列表页面： 赛种层级  --> 联赛层级 ---》赛事层级，         （目前只有滚球全部，和热门 赛事 两个菜单，或者可能的 关注--全部）
   *   第二步：
   *       循环赛事列表 计算每个赛事的显示表征， 并且 同时计算  联赛层级表征 ，  compute_style_template_by_matchinfo(match)
   *       如果需要可以同时计算 赛种层级 或者 开赛层级 表征 数据
   *       但是 理论上   赛种层级 或者 开赛层级 走其他方法更快
   *
   *
   *
   *
   */
  compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list,is_ws_call,is_remove_call){
    this.which_list = $menu.menu_data.cur_level1_menu
    // 虚拟体育 不走卡片逻辑
    if($menu.menu_data.is_virtual_sport && window.vue.$route.name !=='search'){
      this.is_run_card_function = false
      return
    }else{
      this.is_run_card_function = true
    }
    this.set_match_list_mapping_relation_obj_type()
    // 非ws调用  清空卡片数据
    if(!is_ws_call){
      this.match_list_render_key++
       // 重置 赛事模板配置  开始
       let template_id = $menu.menu_data.match_tpl_number
       let reset_template_config_fn = MATCH_LIST_TEMPLATE_CONFIG['template_'+template_id]['reset_match_template_config']
       if(reset_template_config_fn){reset_template_config_fn()}
      // 重置 赛事模板配置  结束
      this.reset_all_card_data()
    }
    /**
     * 哪种列表类型
     * 1. 列表数据类型为联赛列表   有未开赛 已开赛
     * 2. 列表数据类型为赛事列表   区分赛种
     * 3. 列表数据类型为联赛列表   只有联赛
     * 4. 列表数据类型为赛事列表   有未开赛 已开赛
     * 5. 冠军赛事列表            区分赛种
     * 6. 冠军赛事列表            只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     */
    if([1,3].includes(this.match_list_mapping_relation_obj_type)){
      this.compute_match_list_style_obj_and_match_list_mapping_relation_obj_type1(match_list,is_ws_call,is_remove_call)
    }
    else if([2,4,7].includes(this.match_list_mapping_relation_obj_type)){
      this.compute_match_list_style_obj_and_match_list_mapping_relation_obj_type2(match_list,is_ws_call)
    }
    else {
      this.compute_match_list_style_obj_and_match_list_mapping_relation_obj_type5(match_list,is_ws_call)
    }
    // 设置列表总高度
    this.conpute_match_list_card_offset()
  }

  /**
   * @Description 切换菜单的时候初始化所有卡片数据
  */
  reset_all_card_data(){
    // 所有卡片样式对象
    this.all_card_obj = {}
  }
  /**
   * @Description 设置是哪种列表类型
  */
  set_match_list_mapping_relation_obj_type(){
    /**
     * 哪种列表类型
     * 1. 列表数据类型为联赛列表   有未开赛 已开赛
     * 2. 列表数据类型为赛事列表   区分赛种
     * 3. 列表数据类型为联赛列表   只有联赛
     * 4. 列表数据类型为赛事列表   有未开赛 已开赛
     * 5. 冠军赛事列表            区分赛种
     * 6. 冠军赛事列表            只有联赛
     * 7. 列表数据类型为赛事列表   只有联赛
     */
    let type
    // 列表页强力推荐
    if(this.view.is_show_hot){
      type = $menu.menu_data.is_esports ? 7 : 2
    }
    // 详情页强力推荐
    else if(this.view.page_source == 'details'){
      type = 7
    }
    // 搜索页面
    else if(this.view.$route.name == 'search'){
      type = 4
    }
    // 电竞收藏
    else if($menu.menu_data.is_esports && localStorage.getItem('get_layout_list_type') == 'collect'){
      type = 7
    }
    // 冠军聚合页
    else if(this.which_list == 'winner_top'){
      type = 5
    }
    // 电竞冠军
    else if($menu.menu_data.is_esports_champion){
      type = 3
    }
    // 今日冠军
    else if($menu.menu_data.match_tpl_number == 18){
      type = 6
    }
    // 列表接口类型为赛事列表
    else if($menu.match_list_api_type == 'match_list'){
      // 热门赛事 或者 今日、早盘、串关
      if((this.which_list == 'hot' && $menu.match_list_api_params.euid != 30199) || ['today','early','bet'].includes(this.which_list)){
        type = 4
      }else{
        type = 2
      }
    }
    // 早盘 和 电竞只有未开赛  不区分赛种
    else if(this.which_list == 'early' || ($menu.menu_data.is_esports && this.which_list != 'hot')){
      type = 3
    }else{
      type = 1
    }
    this.match_list_mapping_relation_obj_type = type
  }
  /**
   * @Description 更新所有未折叠 但是赛事没数据的 赛事
   * @param {array} all_league_container_keys_arr  所有联赛容器卡片列表
  */
  update_all_unfold_match(all_league_container_keys_arr){
    // 需要更的赛事ID列表
    let update_mids_arr = []
    all_league_container_keys_arr.forEach( card_key => {
      let card_obj = this.all_card_obj[card_key] || {}
      // 判断联赛是否显示
      if(card_obj.is_show_card){
        let mids_arr = card_obj.mids.split(',')
        // 遍历联赛下 所有赛事
        mids_arr.forEach(mid => {
          // 判断数据仓库是否有数据  没有数据 就更新
          if(!this.match_list_data.mid_obj['mid_'+mid]){
            update_mids_arr.push(...mids_arr)
          }
        })
      }
    })
    // 调用bymids接口 拉数据
    if(update_mids_arr.length > 0){
      let params = {
        mids: update_mids_arr,
      };
      // 拉取http请求
      window.vue.$root.$emit(window.vue.emit_cmd.EMIT_API_BYMIDS,params)
    }
  }


  /**
   * @Description 设置联赛容器卡片赛事数据加载状态
   * @param {object} league_title_card_obj 卡片对象
   * @param load_data_status 加载状态
  */
  set_league_card_load_data_status(league_title_card_obj,load_data_status){
    // 设置联赛加载无数据状态
    if(['user_api_limited','empty'].includes(load_data_status)){
      let league_container = this.all_card_obj[league_title_card_obj.league_container_card_key] || {}
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
      let league_title_card_obj = this.all_card_obj[card_obj.league_title_card_key] || {}
      this.set_league_card_load_data_status(league_title_card_obj,status)
    });
  }



  /**
   * @Description 设置折叠后的列表scroll_top
   * @param {number} offset_top 折叠的卡片offset_top
   * @param {boolean} is_league_fold 是否联赛折叠
  */
  set_fold_match_list_scroll_top(offset_top,is_league_fold){
    // 列表类型为冠军赛事 不需要设置表scroll_top
    if([5,6].includes(this.match_list_mapping_relation_obj_type)){
      return
    }
    if(is_league_fold && ![3,6].includes(this.match_list_mapping_relation_obj_type)){
      // 联赛折叠 并且列表类型不是3,6    有球种区分 或者赛事开赛状态区分  offset_top减去球种标题卡片高度
      offset_top -= 32
    }
    // 如果折叠后 标题不在可视区域  则滚动到标题吸顶的位置
    if(offset_top < this.view.$matchlist.scroll_top){
      this.view.$root.$emit('set_match_list_scroll_top',offset_top)
    }
  }


  /**
   * 计算所有卡片的偏移量 和列表总高度
   * 切记 先改赛事 联赛 赛种  开赛层级 再 改这个
   * 自定义可视区域暂设2个列表高度  即当前真实可视区域加前半个列表高度  和后半个列表高度
   */
  conpute_match_list_card_offset(){
    // 详情页强力推荐 不用计算卡片偏移量
    if(this.view.page_source == 'details'){
      return
    }
    // 球种标题、赛事状态标题卡片类型的索引  用于给该类型偶数卡片 设置不同的背景色
    let match_type_card_index = 0
    // 上一个卡片对象
    let pre_card_obj = {
      // 卡片底部 距离列表顶部的距离
      offset_bottom:0,
    }
    // 上一个赛事卡片对象
    let pre_match_card_obj
    this.match_list_card_key_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key]
      // 设置卡片偏移量  顶部偏移量等于上一个卡片 的底部偏移量， 底部偏移量等于自定顶部偏移量加自身高度
      card_obj.offset_top = pre_card_obj.offset_bottom
      card_obj.offset_bottom = card_obj.offset_top + card_obj.card_total_height
      // 设置是否球种标题、赛事状态标题类型卡片 的偶数卡片  用于设置偶数类型背景色
      if(['sport_title','play_title','no_start_title'].includes(card_obj.card_type)){
        match_type_card_index++
        if(match_type_card_index % 2 == 0){
          card_obj.is_even_type = true
        }else{
          card_obj.is_even_type = false
        }
      }
      // 设置赛事卡片偏移量
      if(card_obj.card_type == 'league_container'){
        pre_match_card_obj = {
          // 卡片底部 距离列表顶部的距离
          offset_bottom:card_obj.offset_top,
        }
        let mids_arr = card_obj.mids.split(',')
        // 遍历所有赛事卡片
        mids_arr.forEach( mid => {
          let match_card_obj = this.all_card_obj['mid_'+mid] || {}
          // 设置卡片偏移量  顶部偏移量等于上一个卡片 的底部偏移量， 底部偏移量等于自定顶部偏移量加自身高度
          match_card_obj.offset_top = pre_match_card_obj.offset_bottom
          match_card_obj.offset_bottom = match_card_obj.offset_top + match_card_obj.total_height
          pre_match_card_obj = match_card_obj
        })
      }
      // 设置上一个卡片对象
      pre_card_obj = card_obj
    })
    this.set_card_show_level()
  }


}



export default new MatchListCard()