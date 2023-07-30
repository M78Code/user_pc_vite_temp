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
import match_list_basic_data from "src/core/match-list/match-list-basic-data.js"

import {
  match_status_title_card_template,
  sport_title_card_template,
  league_title_card_template,
  fold_template,
  league_container_card_template,
  match_template_config,
  no_data_card_template
} from "src/project/yabo/mixins/match_list/match_list_card_config.js"

export default class MatchListCard {

  constructor(view) {
    // 视图对象
    this.view = view;
    
    // 代表在哪一个列表里面（滚球、今日、早盘、串关）等等
    this.which_list = '' 

    // 所有卡片对象
    this.all_card_obj = {
      // 'card_key':{}
    }
    //当前列表的卡片key列表  不包含赛事卡片
    this.match_list_card_key_arr = [
      // 'card_key'
    ] 

    // 赛种ID到card_key的映射对象
    this.csid_to_card_key_obj = {
      // 'csid_1':[ 'card_0', 'card_1' ]
    }
    // 已开赛 到卡片key的 映射对象  
    this.play_to_card_key_arr = []
    // 未开赛 到卡片key的 映射对象  
    this.no_start_to_card_key_arr = []
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
    this.match_list_mapping_relation_obj_type = '' 
    // 是否走卡片逻辑  虚拟体育和详情页热门赛事 不走卡片逻辑
    this.is_run_card_function = true
    // 列表视图渲染key 每次切换菜单自增1  解决切换菜单偶现视图数据不更新
    this.match_list_render_key = 0
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
      this.set_tpl0_tab_play_title_height()
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
   * @Description 计算所有卡片样式数据 1. 单一赛种，有未开赛 已开赛 ，不区分赛种   3 单一赛种，不区分赛种 ，只有未开赛，只有联赛
  */
  compute_match_list_style_obj_and_match_list_mapping_relation_obj_type1(all_league_obj,is_ws_call,is_remove_call){
    // 赛事模板ID
    let template_id = $menu.menu_data.match_tpl_number
    if($menu.menu_data.is_esports_champion){
      // 电竞冠军玩法
      template_id = 18
    }else if($menu.menu_data.is_esports){
      // 电竞常规玩法
      template_id = 'esports'
    }

    // 已开赛 到卡片key的 映射对象  
    let play_to_card_key_arr = ['play_title']
    // 未开赛 到卡片key的 映射对象  
    let no_start_to_card_key_arr = ['no_start_title']
    // 所有卡片列表
    let match_list_card_key_arr = []
    // 所有卡片样式对象
    let all_card_obj = {}
    // 所有联赛容器卡片key列表
    let all_league_container_keys_arr = []

    // 当前卡片索引
    let card_index = -1
    // 卡片key
    let card_key = ''

    // 展开的赛事数量计数  用于计数首次加载列表 只展开前12场赛事
    let unfold_match_count = 0
    // 是否联赛折叠
    let is_league_fold = false

    let league_nofold_height = this.get_league_title_card_height(template_id)

    // 临时卡片对象变量
    let temp_card_obj
    // 临时赛事状态标题卡片对象
    let temp_match_status_title_card_obj = {}

    // 联赛标题卡片类型
    let league_title_card_type = $menu.menu_data.is_esports_champion ? 'champion_league_title' : 'league_title'

    // 同样联赛出现次数  用于生成自定义联赛ID
    let league_repeat_count_obj = {}
    // 自定义联赛ID
    let cus_tid = ''

    // 遍历所有赛事数据
    let match_status_type_arr = ['livedata','nolivedata']
    match_status_type_arr.forEach(match_status_type => {
      // 已开赛、未开赛的赛事数量计算
      let match_status_type_match_count = 0

      // 遍历联赛列表
      let league_list = _.get(all_league_obj,match_status_type,[])
      league_list.forEach( (league_obj,league_index) => {
        league_repeat_count_obj[league_obj.tid] = league_repeat_count_obj[league_obj.tid] || 0
        // 生成自定义联赛ID
        league_repeat_count_obj[league_obj.tid]++
        cus_tid = `${league_obj.tid}_${league_repeat_count_obj[league_obj.tid]}`

        // 赛事ID数组
        let mids_arr = league_obj.mids.split(',')

        match_status_type_match_count += mids_arr.length

        // 如果是第一个联赛 并且列表类型是1 有已开赛、未开赛区分，  添加一个已开赛、未开赛标题卡片
        if(league_index == 0 && this.match_list_mapping_relation_obj_type == 1){
          // 已开赛、未开赛标题卡片处理
          card_index += 1
          card_key = match_status_type == 'livedata' ? 'play_title' : 'no_start_title'
          match_list_card_key_arr.push(card_key)

          // 打入已开赛、未开赛标题卡片特征
          all_card_obj[card_key] = {
            ...match_status_title_card_template,
            // 卡片索引
            card_index,
            // 卡片类型
            card_type: card_key,
          }
          temp_match_status_title_card_obj = all_card_obj[card_key]
          // 如果不是ws调用  设置折叠数据
          if(!is_ws_call){
            Object.assign(all_card_obj[card_key],fold_template)
          }
        }

        // 联赛标题卡片处理
        card_index += 1
        card_key = `league_title_${cus_tid}`
        match_list_card_key_arr.push(card_key)
      
        if(match_status_type == 'livedata'){
          // 已开赛 到卡片key的 映射对象 
          play_to_card_key_arr.push(card_key)
        }else{
          // 未开赛 到卡片key的 映射对象  
          no_start_to_card_key_arr.push(card_key)
        }

        if(unfold_match_count < 12){
          is_league_fold = false
        }else{
          is_league_fold = true
        }

        // 打入联赛标题卡片特征
        all_card_obj[card_key] = {
          ...league_title_card_template,
          // 卡片索引
          card_index,
          card_type:league_title_card_type,
          // 联赛未折叠高度
          league_nofold_height:league_nofold_height,
          // 联赛下赛事数量
          match_count:mids_arr.length,
          // 联赛下第一个赛事ID
          mid:mids_arr[0],
          // 对应的联赛容器卡片key
          league_container_card_key:`league_container_${cus_tid}`,
          // 联赛信息对象 联赛名称 联赛logo等
          league_obj:{...league_obj},
          // 可能未来要加上他自己下面的所有赛事的内容高度
        }

        temp_card_obj = all_card_obj[card_key]

        if(!is_ws_call){
          // 非ws调用 设置折叠数据
          Object.assign(temp_card_obj,fold_template)
          temp_card_obj.is_league_fold = is_league_fold
        }

        // 打入联赛容器卡片
        card_index += 1
        card_key = `league_container_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        all_league_container_keys_arr.push(card_key)

        if(match_status_type == 'livedata'){
          // 已开赛 到卡片key的 映射对象 
          play_to_card_key_arr.push(card_key)
        }else{
          // 未开赛 到卡片key的 映射对象  
          no_start_to_card_key_arr.push(card_key)
        }

        // 联赛容器卡片总高度
        let league_card_total_height = 0
        
        mids_arr.forEach( mid => {
          unfold_match_count++
          // 赛事表征数据
          let match = this.view.match_list_data.mid_obj['mid_'+mid]
          let match_style_obj = this.compute_style_template_by_matchinfo(match,template_id)
          all_card_obj['mid_'+mid] = match_style_obj
          league_card_total_height += match_style_obj.total_height
          // 设置父级卡片key
          match_style_obj.parent_card_key = card_key
        })

        // 打入联赛容器卡片特征
        all_card_obj[card_key] = {
          ...league_container_card_template,
          // 卡片索引
          card_index,
          // 对应的联赛标题卡片key
          league_title_card_key:`league_title_${cus_tid}`,
          // 卡片总高度备份 用于折叠展开还原卡片高度
          card_total_height_back:league_card_total_height,
          mids:league_obj.mids
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
          all_card_obj[card_key].is_league_fold = is_league_fold
          all_card_obj[card_key].is_show_card = !is_league_fold

          // 设置赛事数据加载状态
          all_card_obj[card_key].load_data_status = is_league_fold ?'loading' : 'loaded'
        }else{
          // 是ws调用
          delete all_card_obj[card_key].load_data_status
        }
  
      })
      // 设置赛事数量
      if(match_status_type_match_count > 0){
        temp_match_status_title_card_obj.match_count = match_status_type_match_count
      }
    })

    // 合并所有卡片样式对象
    _.merge(this.all_card_obj,all_card_obj)
    // 已开赛 到卡片key的 映射对象  
    this.play_to_card_key_arr = play_to_card_key_arr
    // 未开赛 到卡片key的 映射对象  
    this.no_start_to_card_key_arr = no_start_to_card_key_arr
    // 所有卡片列表
    this.match_list_card_key_arr = match_list_card_key_arr
    
    // 遍历所有联赛容器卡片
    all_league_container_keys_arr.forEach( card_key => {
      // 设置联赛容器卡片
      let league_container_card_obj = this.all_card_obj[card_key]
      // 联赛标题卡片
      let league_title_card_obj = this.all_card_obj[league_container_card_obj.league_title_card_key]
      // 如果未设置折叠数据  设置折叠数据
      if(!league_container_card_obj.hasOwnProperty('is_show_card')){
        Object.assign(league_container_card_obj,fold_template)
        Object.assign(league_title_card_obj,fold_template)
        league_container_card_obj.load_data_status = 'loading'
      }

      if(league_container_card_obj.is_show_card){
        // 卡片显示  还原卡片总高度
        league_container_card_obj.card_total_height = league_container_card_obj.card_total_height_back
      }else{
        // 卡片不显示 设置总高度为0
        league_container_card_obj.card_total_height = 0
      }

      // 设置联赛标题卡片
      if(league_title_card_obj.is_league_fold){
        // 联赛折叠 设置高度为折叠的高度
        league_title_card_obj.card_total_height_back = league_title_card_template.league_fold_height
        league_title_card_obj.mid = 0
      }else{
        // 联赛未折叠 设置高度为未折叠的高度
        league_title_card_obj.card_total_height_back = league_nofold_height
      }
      if(league_title_card_obj.is_show_card){
        // 卡片显示  还原卡片总高度
        league_title_card_obj.card_total_height = league_title_card_obj.card_total_height_back
      }else{
        // 卡片不显示 设置总高度为0
        league_title_card_obj.card_total_height = 0
      }
    })
    // 如果是ws调用 
    if(is_ws_call){
      // 设置新增球种标题卡片折叠数据
      this.set_new_sport_title_card_fold()
      // 设置新增赛事折叠
      this.set_new_league_fold()
      // 更新未折叠赛事
      if(!is_remove_call){
        this.update_all_unfold_match(all_league_container_keys_arr)
      }
    }
  }

  /**
   * @Description 计算所有卡片样式数据 2. 全部赛种 不区分 是否开赛  4. 列表数据类型为赛事列表   单一赛种，有未开赛 已开赛 ，不区分赛种  
   * @param {Array} match_list 赛事列表
   * @param {boolean} is_ws_call 是否ws调用
  */
  compute_match_list_style_obj_and_match_list_mapping_relation_obj_type2(match_list,is_ws_call){

    // 已开赛 到卡片key的 映射对象  
    let play_to_card_key_arr = ['play_title']
    // 未开赛 到卡片key的 映射对象  
    let no_start_to_card_key_arr = ['no_start_title']
    // 赛种ID 到卡片key的 映射对象  
    let csid_to_card_key_obj = {}
    // 卡片key 到 赛事 id 映射 对象
    let league_card_mids_arr = {}
    // 所有卡片列表
    let match_list_card_key_arr = []
    // 所有卡片样式对象
    let all_card_obj = {}

    // 上一个赛事的联赛ID
    let pre_match_tid = 0
    // 上一个赛事的赛种ID
    let pre_match_csid = 0
    // 上一个赛事的开赛状态
    let pre_match_ms = -1
    // 当前卡片索引
    let card_index = -1
    // 卡片key
    let card_key = ''
    
    // 滚球赛事数量统计
    let play_match_count = 0
    // 未开赛事数量统计
    let no_start_match_count = 0

    // 同样联赛出现次数  用于生成自定义联赛ID
    let league_repeat_count_obj = {}
    // 自定义联赛ID
    let cus_tid = ''

    // 暂无数据热门赛事 添加暂无数据卡片
    if(this.view.is_show_hot){
      card_index++
      card_key = 'no_data'
      match_list_card_key_arr.push(card_key)
      // 打入球种标题卡片特征
      all_card_obj[card_key] = {
        ...no_data_card_template,
        // 卡片索引
        card_index,
      }
    }

    // 遍历所有赛事列表
    _.each(match_list, _match => {
      let match = this.view.match_list_data.mid_obj['mid_'+_match.mid] || {}
      league_repeat_count_obj[match.tid] = league_repeat_count_obj[match.tid] || 0
      let match_ms = this.view.$utils.get_match_status(match.ms)
      // 赛事数量统计
      if(match_ms == 1){
        play_match_count++
      }else{
        no_start_match_count++
      }
      let csid_key = 'csid_'+match.csid
      // 赛种ID到卡片key的映射
      csid_to_card_key_obj[csid_key] = csid_to_card_key_obj[csid_key] || []

      // 如果当前赛种 不等于上一个赛种  需要添加一个球种标题卡片
      if(this.match_list_mapping_relation_obj_type == 2 && match.csid != pre_match_csid){
        pre_match_csid = match.csid
        card_key = `sport_title_${match.csid}`
        // 判断球种标题卡片是否创建过，防止傻逼后台返回傻逼数据， 有可能会出现重复球种标题卡片
        if(!csid_to_card_key_obj[csid_key].includes(card_key)){
          // 球种标题卡片处理
          card_index += 1
          match_list_card_key_arr.push(card_key)
          csid_to_card_key_obj[csid_key].push(card_key)
          // 打入球种标题卡片特征
          all_card_obj[card_key] = {
            ...sport_title_card_template,
            // 卡片索引
            card_index,
            // 球种名称
            csna:match.csna,
            // 球种ID
            csid:match.csid,
          }
          // 如果不是ws调用  设置折叠数据
          if(!is_ws_call){
            Object.assign(all_card_obj[card_key],fold_template)
          }
        }
        
      }
      // 是否创建了一个赛事开赛状态标题卡片
      let is_create_match_status_card = false
      // 如果当前赛事开赛状态 不等于上一个赛事开赛状态  需要添加一个开赛状态标题卡片
      if(this.match_list_mapping_relation_obj_type == 4 && match_ms != pre_match_ms){
        pre_match_ms = match_ms
        card_key = match_ms == 1 ? 'play_title' : 'no_start_title'
        // 判断开赛状态标题卡片是否创建过，防止傻逼后台返回傻逼数据， 有可能会出现重复开赛状态标题卡片
        if(!match_list_card_key_arr.includes(card_key)){
          is_create_match_status_card = true
          // 赛事开赛状态标题卡片处理
          card_index += 1
          match_list_card_key_arr.push(card_key)
          
          // 打入开赛状态标题卡片特征
          all_card_obj[card_key] = {
            ...match_status_title_card_template,
            // 卡片索引
            card_index,
            // 卡片类型
            card_type: card_key,
          }
          // 如果不是ws调用  设置折叠数据
          if(!is_ws_call){
            Object.assign(all_card_obj[card_key],fold_template)
          }
        }

      }

      // 如果当前联赛 不等于上一个联赛,或者刚创建了一个赛事开赛状态标题卡片，  需要添加一个联赛标题卡片
      if(match.tid != pre_match_tid || is_create_match_status_card){
        // 生成自定义联赛ID
        league_repeat_count_obj[match.tid]++
        cus_tid = `${match.tid}_${league_repeat_count_obj[match.tid]}`

        pre_match_tid = match.tid

        // 联赛标题卡片处理
        card_index += 1
        card_key = `league_title_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        csid_to_card_key_obj[csid_key].push(card_key)

        if(match_ms == 1){
          // 已开赛 到卡片key的 映射对象 
          play_to_card_key_arr.push(card_key)
        }else{
          // 未开赛 到卡片key的 映射对象  
          no_start_to_card_key_arr.push(card_key)
        }
        
        // 打入联赛标题卡片特征
        all_card_obj[card_key] = {
          ...league_title_card_template,
          // 卡片索引
          card_index,
          // 赛事ID
          mid:match.mid,
          // 对应的联赛容器卡片key
          league_container_card_key:`league_container_${cus_tid}`,
          // 联赛信息对象 联赛名称 联赛logo等
          league_obj:{
            csid:match.csid,
            lurl:match.lurl,
            tf:match.tf,
            tid:match.tid,
            tn:match.tn,
            mids:''
          },
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
        }
        
        // 打入联赛容器卡片
        card_index += 1
        card_key = `league_container_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        csid_to_card_key_obj[csid_key].push(card_key)

        if(match_ms == 1){
          // 已开赛 到卡片key的 映射对象 
          play_to_card_key_arr.push(card_key)
        }else{
          // 未开赛 到卡片key的 映射对象  
          no_start_to_card_key_arr.push(card_key)
        }

        // 打入联赛容器卡片特征
        all_card_obj[card_key] = {
          ...league_container_card_template,
          // 卡片索引
          card_index,
          // 对应的联赛标题卡片key
          league_title_card_key:`league_title_${cus_tid}`,
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
        }

      }

      // 联赛卡片下的所有赛事ID列表
      league_card_mids_arr[card_key] = league_card_mids_arr[card_key] || []
      league_card_mids_arr[card_key].push(match.mid)

      // 赛事表征数据
      let match_style_obj = this.compute_style_template_by_matchinfo(match,match.tpl_id)
      all_card_obj['mid_'+match.mid] = match_style_obj

    })

    // 设置赛事状态标题卡片下的赛事数量
    if(all_card_obj['play_title']){
      all_card_obj['play_title'].match_count = play_match_count
    }
    if(all_card_obj['no_start_title']){
      all_card_obj['no_start_title'].match_count = no_start_match_count
    }

    // 合并所有卡片样式对象
    _.merge(this.all_card_obj,all_card_obj)
    // 已开赛 到卡片key的 映射对象  
    this.play_to_card_key_arr = play_to_card_key_arr
    // 未开赛 到卡片key的 映射对象  
    this.no_start_to_card_key_arr = no_start_to_card_key_arr
    // 赛种ID 到卡片key的 映射对象 
    this.csid_to_card_key_obj = csid_to_card_key_obj
    // 卡片key列表
    this.match_list_card_key_arr = match_list_card_key_arr
    
    // 重新计算所有的联赛卡片样式
    for(let card_key in league_card_mids_arr){
      // 不是联赛容器卡片不处理
      if(card_key.indexOf('league') < 0){
        continue
      }
      let card_total_height = 0
 
      let mids_arr = league_card_mids_arr[card_key]
      let mids = mids_arr.join(',')
      mids_arr.forEach( mid => {
        let match_style_obj = this.all_card_obj['mid_'+mid]
        // 设置父级卡片key
        match_style_obj.parent_card_key = card_key
        card_total_height += match_style_obj.total_height
      })

      // 联赛容器卡片
      let league_container_card_obj = this.all_card_obj[card_key]
      // 联赛标题卡片
      let league_title_card_obj = this.all_card_obj[league_container_card_obj.league_title_card_key]

      // 设置联赛容器卡片
      league_container_card_obj.card_total_height_back = card_total_height
      league_container_card_obj.mids = mids

      // 如果未设置折叠数据  设置折叠数据
      if(!league_container_card_obj.hasOwnProperty('is_show_card')){
        Object.assign(league_container_card_obj,fold_template)
        Object.assign(league_title_card_obj,fold_template)
      }

      // 判断卡片是否显示  设置联赛卡片总高度
      if(league_container_card_obj.is_show_card){
        league_container_card_obj.card_total_height = card_total_height
      }else{
        league_container_card_obj.card_total_height = 0
      }

      // 设置联赛标题卡片
      league_title_card_obj.match_count = mids_arr.length
      // 设置联赛标题卡片赛事ID
      league_title_card_obj.league_obj.mids = mids
      // 判断卡片是否显示  设置联赛卡片总高度
      if(!league_title_card_obj.is_show_card){
        league_title_card_obj.card_total_height = 0
      }
    }
    // 如果是ws调用 
    if(is_ws_call){
      // 设置新增球种标题卡片折叠数据
      this.set_new_sport_title_card_fold()
      // 设置新增赛事折叠
      this.set_new_league_fold()
    }
  }
  /**
   * @Description 计算所有卡片样式数据   5. 冠军赛事列表 全部赛种 不区分是否开赛  6. 冠军赛事列表    单一赛种 不区分是否开赛   
   * @param {Array} match_list 赛事列表
   * @param {boolean} is_ws_call 是否ws调用
   * @param {undefined} undefined
  */
  compute_match_list_style_obj_and_match_list_mapping_relation_obj_type5(match_list,is_ws_call){

    // 赛种ID 到卡片key的 映射对象  
    let csid_to_card_key_obj = {}
    // 所有卡片列表
    let match_list_card_key_arr = []
    // 所有卡片样式对象
    let all_card_obj = {}
    // 所有联赛容器卡片key列表
    let all_league_container_keys_arr = []
    // 卡片key 到 赛事 id 映射 对象
    let league_card_mids_arr = {}
 
    // 上一个赛事的赛种ID
    let pre_match_csid = 0
    // 当前卡片索引
    let card_index = -1
    // 卡片key
    let card_key = ''
    
    // 是否联赛折叠
    let is_league_fold = false

    // 上一个赛事的联赛ID
    let pre_match_tid = 0
    // 同样联赛出现次数  用于生成自定义联赛ID
    let league_repeat_count_obj = {}
    // 自定义联赛ID
    let cus_tid = ''

    // 遍历所有赛事列表
    match_list && match_list.length && match_list.forEach( (match,match_index) => {
      league_repeat_count_obj[match.tid] = league_repeat_count_obj[match.tid] || 0
      // 冠军首次加载只显示前3场赛事
      is_league_fold = match_index > 2
  
      let csid_key = 'csid_'+match.csid
      // 赛种ID到卡片key的映射
      csid_to_card_key_obj[csid_key] = csid_to_card_key_obj[csid_key] || []

      // 如果当前赛种 不等于上一个赛种  需要添加一个球种标题卡片
      if(this.match_list_mapping_relation_obj_type == 5 && match.csid != pre_match_csid){
        pre_match_csid = match.csid
        card_key = `sport_title_${match.csid}`
        // 判断球种标题卡片是否创建过，防止傻逼后台返回傻逼数据， 有可能会出现重复球种标题卡片
        if(!csid_to_card_key_obj[csid_key].includes(card_key)){
          // 球种标题卡片处理
          card_index += 1
          match_list_card_key_arr.push(card_key)
          csid_to_card_key_obj[csid_key].push(card_key)
          
          // 打入球种标题卡片特征
          all_card_obj[card_key] = {
            ...sport_title_card_template,
            // 卡片索引
            card_index,
            // 球种名称
            csna:match.csna,
            // 球种ID
            csid:match.csid,
          }
          // 如果不是ws调用  设置折叠数据
          if(!is_ws_call){
            Object.assign(all_card_obj[card_key],fold_template)
          }
        }
      }

      // 如果当前联赛 不等于上一个联赛  需要添加一个联赛标题卡片
      if(match.tid != pre_match_tid){
        // 生成自定义联赛ID
        league_repeat_count_obj[match.tid]++
        cus_tid = `${match.tid}_${league_repeat_count_obj[match.tid]}`

        pre_match_tid = match.tid

        // 联赛标题卡片处理
        card_index += 1
        card_key = `league_title_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        csid_to_card_key_obj[csid_key].push(card_key)

        // 打入联赛标题卡片特征
        all_card_obj[card_key] = {
          ...league_title_card_template,
          // 卡片索引
          card_index,
          // 卡片类型
          card_type:'champion_league_title',
          // 赛事ID
          mid:match.mid,
          // 对应的联赛容器卡片key
          league_container_card_key:`league_container_${cus_tid}`,
          // 联赛信息对象 联赛名称 联赛logo等
          league_obj:{
            csid:match.csid,
            lurl:match.lurl,
            tf:match.tf,
            tid:match.tid,
            tn:match.tn,
            onTn:match.onTn,
            mid:match.mid,
          },
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
          all_card_obj[card_key].is_league_fold = is_league_fold
        }
        
        // 打入联赛容器卡片
        card_index += 1
        card_key = `league_container_${cus_tid}`
        match_list_card_key_arr.push(card_key)
        all_league_container_keys_arr.push(card_key)
        csid_to_card_key_obj[csid_key].push(card_key)

        // 打入联赛容器卡片特征
        all_card_obj[card_key] = {
          ...league_container_card_template,
          // 卡片索引
          card_index,
          // 对应的联赛标题卡片key
          league_title_card_key:`league_title_${cus_tid}`,
        }
        // 如果不是ws调用  设置折叠数据
        if(!is_ws_call){
          Object.assign(all_card_obj[card_key],fold_template)
          all_card_obj[card_key].is_league_fold = is_league_fold
          all_card_obj[card_key].is_show_card = !is_league_fold
        }

      }

      // 联赛卡片下的所有赛事ID列表
      league_card_mids_arr[card_key] = league_card_mids_arr[card_key] || []
      league_card_mids_arr[card_key].push(match.mid)

      // 赛事表征数据
      let match_style_obj = this.compute_style_template_by_matchinfo(match,18)
      all_card_obj['mid_'+match.mid] = match_style_obj

    })

    // 合并所有卡片样式对象
    _.merge(this.all_card_obj,all_card_obj)
    // 赛种ID 到卡片key的 映射对象 
    this.csid_to_card_key_obj = csid_to_card_key_obj
    // 卡片key列表
    this.match_list_card_key_arr = match_list_card_key_arr

    // 遍历所有联赛容器卡片
    all_league_container_keys_arr.forEach( card_key => {
      let card_total_height = 0
 
      let mids_arr = league_card_mids_arr[card_key]
      let mids = mids_arr.join(',')
      mids_arr.forEach( mid => {
        let match_style_obj = this.all_card_obj['mid_'+mid]
        // 设置父级卡片key
        match_style_obj.parent_card_key = card_key
        card_total_height += match_style_obj.total_height
      })

      // 设置联赛容器卡片
      let league_container_card_obj = this.all_card_obj[card_key]
      // 联赛标题卡片
      let league_title_card_obj = this.all_card_obj[league_container_card_obj.league_title_card_key]

      // 设置联赛容器卡片
      league_container_card_obj.card_total_height_back = card_total_height
      league_container_card_obj.mids = mids

      // 如果未设置折叠数据  设置折叠数据
      if(!league_container_card_obj.hasOwnProperty('is_show_card')){
        Object.assign(league_container_card_obj,fold_template)
        Object.assign(league_title_card_obj,fold_template)
      }

      // 判断卡片是否显示  设置联赛卡片总高度
      if(league_container_card_obj.is_show_card){
        league_container_card_obj.card_total_height = card_total_height
      }else{
        league_container_card_obj.card_total_height = 0
      }
      
      // 设置联赛标题卡片赛事ID
      league_title_card_obj.league_obj.mids = mids
      // 设置联赛标题卡片
      if(league_title_card_obj.is_show_card){
        // 卡片显示  还原卡片总高度
        league_title_card_obj.card_total_height = league_title_card_obj.card_total_height_back
      }else{
        // 卡片不显示 设置总高度为0
        league_title_card_obj.card_total_height = 0
      }
    })
    // 如果是ws调用 
    if(is_ws_call){
      // 设置新增球种标题卡片折叠数据
      this.set_new_sport_title_card_fold()
      // 设置新增赛事折叠
      this.set_new_league_fold()
    }
  }
  /**
   * @Description 获取联赛标题卡片高度 
   * @param {number} template_id 赛事模板编号
   * @param {undefined} undefined
  */
  get_league_title_card_height(template_id){

    let height
    // 个别模板有两行玩法标题
    if([1,3,5,21,22].includes(+template_id)){
      height = 56
    }else{
      height = league_title_card_template.league_nofold_height
    }
    return height
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
          if(!this.view.match_list_data.mid_obj['mid_'+mid]){
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
   * @Description 移除一场赛事 
   * @param {number} remove_mid 移除的赛事ID
  */
  remove_match(remove_mid){
    if(window.vue.$route.name =='search') {
      return
    }
    if([1,3].includes(this.match_list_mapping_relation_obj_type)){
      // 列表接口数据类型为联赛列表
      // 移除的赛事联赛ID
      let remove_tid = _.get(this.view.match_list_data.mid_obj,`mid_${remove_mid}.tid`)
      let all_league_obj = this.view.match_list_data.league_list_obj
      // 遍历所有赛事数据
      let match_status_type_arr = ['livedata','nolivedata']
      match_status_type_arr.forEach(match_status_type => {
        // 遍历联赛列表
        let league_list = _.get(all_league_obj,match_status_type,[])
        league_list.forEach( (league_obj,league_index) => {
          // 判断联赛ID是否相等
          if(remove_tid == league_obj.tid){
            // 赛事ID数组
            let mids_arr = league_obj.mids.split(',')
            // 遍历联赛下所有赛事ID
            mids_arr.forEach( (mid,mid_index) => {
              // 判断赛事ID是否相等
              if(mid == remove_mid){
                mids_arr.splice(mid_index,1)
                if(mids_arr.length == 0){
                  // 联赛下没有赛事  移除联赛
                  league_list.splice(league_index,1)
                }else{
                  // 移除赛事后  重新赋值联赛的mids
                  league_obj.mids = mids_arr.join(',')
                }
              }
            })
          }
        })
      })
      let match_length = _.get(all_league_obj,'livedata.length',0) + _.get(all_league_obj,'nolivedata.length',0)
      if(match_length == 0){
        this.view.set_load_data_state('empty')
      }else{
        // 重新计算卡片样式
        this.compute_match_list_style_obj_and_match_list_mapping_relation_obj(all_league_obj,true,true)
      }
    }else{
      // 列表接口数据类型为赛事列表
      let match_list = this.view.match_list_data.match_list
      match_list.forEach( (match,index) => {
        if(match.mid == remove_mid){
          match_list.splice(index,1)
        }
      })
      if(match_list.length == 0){
        // 收藏时当列表为空时跳转菜单
        if(localStorage.getItem('get_layout_list_type') == 'collect'){
          //取消最后一个收藏定位到赛事列表
          this.view.vx_set_layout_list_type("match");
          // 获取赛事列表数据
          this.view.fetch_match_list()
        }else{
          this.view.set_load_data_state('empty')
        }
      }else{
        // 重新计算卡片样式
        this.compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list,true,true)
      }
      // 滚球 重新计算菜单数量
      if($menu.menu_data.cur_level1_menu == 'play' && !localStorage.getItem('get_layout_list_type') == 'collect'){
        this.view.match_list_data.compute_sport_count(remove_mid)
      }
    }
  }
  /**
   * @Description 移除一场联赛 
   * @param {number} remove_tid 移除的联赛ID
  */
  remove_league(remove_tid){
    
    if($menu.menu_data.is_esports){
      // 列表接口数据类型为联赛列表

      let all_league_obj = this.view.match_list_data.league_list_obj
      // 遍历所有赛事数据
      let match_status_type_arr = ['livedata','nolivedata']
      match_status_type_arr.forEach(match_status_type => {
        // 遍历联赛列表
        let league_list = _.get(all_league_obj,match_status_type,[])
        league_list.forEach( (league_obj,league_index) => {
          // 判断联赛ID是否相等
          if(remove_tid == league_obj.tid){
            league_list.splice(league_index,1)
          }
        })
      })
      // 重新计算卡片样式
        this.compute_match_list_style_obj_and_match_list_mapping_relation_obj(all_league_obj,true)
    }else{
      // 列表接口数据类型为赛事列表
      let match_list = this.view.match_list_data.match_list
      // 移除联赛ID一样的赛事
      _.remove(match_list, match => {
        return match.tid == remove_tid
      })
      // 重新计算卡片样式
      this.compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list,true)
    }
  }
  /**
   * 更新     all_card_obj
   * 更新     映射信息  
   * 这里注意  单个赛事增删  不用遍历循环全部 的 数据 
   * bymids接口拉取数据或者 ws推送改变赛事盘口变更
   */
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(mids_arr){
    // 是否走卡片逻辑
    if(!this.is_run_card_function){
      return
    }
    mids_arr.forEach( mid => {
      // 原来的样式数据
      let old_match_style_obj = this.all_card_obj['mid_'+mid] || {}
      // 判断是否需要动态计算高度
      if(old_match_style_obj.is_dynamic_compute_height || !old_match_style_obj.card_total_height){
        // 更新赛事表征数据
        let match = this.view.match_list_data.mid_obj['mid_'+mid] || {}
        let match_style_obj = this.compute_style_template_by_matchinfo(match,match.tpl_id)
        Object.assign(old_match_style_obj,match_style_obj)
        // 更新赛事父级卡片样式 即对应的联赛容器卡片样式 
        this.update_match_parent_card_style(old_match_style_obj)
      }
    })

    // 设置列表总高度
    this.conpute_match_list_card_offset()
  }
  /**
   * @Description 更新赛事父级卡片样式 即赛事对应的联赛容器卡片样式 
   * @param {object} match_card_obj 赛事卡片对象
  */
  update_match_parent_card_style(match_card_obj){
    // 父级联赛内容卡片
    let parent_card_obj = this.all_card_obj[match_card_obj.parent_card_key] || {mids:''}
    // 设置赛事数据加载状态为已加载
    parent_card_obj.load_data_status = 'loaded'
    let card_total_height = 0
    // 父级卡片下的mid列表
    let parent_card_mids_arr = parent_card_obj.mids.split(',')
    parent_card_mids_arr.forEach( mid => {
      let child_match_card_obj = this.all_card_obj['mid_'+mid] || {total_height:0}
      card_total_height += child_match_card_obj.total_height
    })
    // 更新父级卡片高度
    parent_card_obj.card_total_height_back = card_total_height
    if(parent_card_obj.is_show_card){
      parent_card_obj.card_total_height = card_total_height
    }
    // 更新联赛标题卡片mid
    let league_title_card_obj = this.all_card_obj[parent_card_obj.league_title_card_key] || {league_obj:{mids:''}}
    league_title_card_obj.mid = league_title_card_obj.league_obj.mids.split(',')[0]
  }
  /**
   * @Description 打印数据  调试用 
  */
  test_log_data(){
    // 错误的卡片数据
    let error_card_obj = {}
    this.match_list_card_key_arr.forEach( card_key => {
      let card_obj = this.all_card_obj[card_key]
      // 卡片显示 高度为0
      if(card_obj.is_show_card && card_obj.card_total_height == 0){
        error_card_obj[card_key] = card_obj
      }
      // 卡片不显示  高度不等于0
      else if(!card_obj.is_show_card && card_obj.card_total_height != 0){
        error_card_obj[card_key] = card_obj
      }
    })

    let log_data = {
      error_card_obj,
      which_list:this.which_list,
      all_card_obj:this.all_card_obj,
      match_list_card_key_arr:this.match_list_card_key_arr,
      csid_to_card_key_obj:this.csid_to_card_key_obj,
      play_to_card_key_arr:this.play_to_card_key_arr,
      no_start_to_card_key_arr:this.no_start_to_card_key_arr,
      match_list_mapping_relation_obj_type:this.match_list_mapping_relation_obj_type,
      is_run_card_function:this.is_run_card_function,
      mid_obj: this.view.match_list_data.mid_obj,
      hl_obj: this.view.match_list_data.hl_obj,
      ol_obj: this.view.match_list_data.ol_obj,
      hn_obj: this.view.match_list_data.hn_obj,
      match_list: this.view.match_list_data.match_list,
      all_league_obj: this.view.match_list_data.league_list_obj,
      scroll_top:this.view.$matchlist.scroll_top,
    }
    if(window.is_custom_test){
      console.info(log_data);
    }else{
      console.log('=====打印数据')
      console.log(log_data)
      let is_clog = (sessionStorage.getItem('clog') == 1)?1: ((location.href.indexOf('clog=1') != -1)?1:0);
      this.view.$root.$emit('SHOW_TOAST',is_clog ? '打印成功' : 'clog=1未开启')
    }
  }
  /**
   * @Description 展开所有联赛 调试用
  */
  unfold_all_league(){
    let params
    this.match_list_card_key_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key] || {}
      if(card_obj.card_type == 'league_title'){
        if(card_obj.is_league_fold){
          if(['today','early','bet'].includes(this.which_list)){
            params = {
              mids: card_obj.league_obj.mids.split(','),
            }; 
            // 拉取http请求
            window.vue.$root.$emit(window.vue.emit_cmd.EMIT_API_BYMIDS,params)
          }
          card_obj.is_league_fold = true
          this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(card_obj)
        }
      }
    })
  }
  /**
   * @Description 折叠所有联赛   调试用
  */
  fold_all_league(){
    this.match_list_card_key_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key] || {}
      if(card_obj.card_type == 'league_title'){
        card_obj.is_league_fold = false
        this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(card_obj)
      }
    })
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
   * @Description 判断联赛是否加载过数据  如果没加载过数据 从基础数据仓库 设置赛事主客队名称 
  */
  set_match_basic_data(league_title_card_obj){
    // 模板10 网球-准确盘数   模板15 兵乓球-准确盘数  不处理
    if([10, 15].includes(+$menu.menu_data.match_tpl_number)){
      return
    }
    // 设置联赛加载无数据状态
    let league_container = this.all_card_obj[league_title_card_obj.league_container_card_key] || {}
    // 没加载过数据
    if(league_container.load_data_status == 'loading'){
      // 联赛的赛事ID数组
      let mids = league_title_card_obj.league_obj.mids.split(',')
      let match_list = []
      mids.forEach( mid => {
        let match = match_list_basic_data.get_match_data(mid)
        if(match){
          match_list.push(match)
        }
      })
      if(match_list.length > 0){
        // 设置列表数据仓库
        this.view.match_list_data.compute_match_list_all_data(match_list,true)
        // 重新计算赛事样式
        this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(mids)
      }
    }
  }
  /**
   * @Description 新增球种标题卡片 或者赛事状态标题卡片 设置折叠数据 
  */
  set_new_sport_title_card_fold(){
    // 新增球种操作
    _.each(this.csid_to_card_key_obj, card_key_arr => {
      let sport_card_obj = this.all_card_obj[card_key_arr[0]] || {}
      // 如果未设置折叠数据  设置折叠数据
      if(!sport_card_obj.hasOwnProperty('is_show_card')){
        Object.assign(sport_card_obj,fold_template)
      }
    })
    
    // 滚球标题卡片折叠数据处理
    let play_card_obj = this.all_card_obj['play_title'] || {}
    if(!play_card_obj.hasOwnProperty('is_show_card')){
      Object.assign(play_card_obj,fold_template)
    }

    // 未开赛标题卡片折叠数据处理
    let no_start_card_obj = this.all_card_obj['no_start_title'] || {}
    if(!no_start_card_obj.hasOwnProperty('is_show_card')){
      Object.assign(no_start_card_obj,fold_template)
    }
  }
  /**
   * 新增赛事重新设置折叠
   * 哪种列表类型     
   * 1. 列表数据类型为联赛列表   单一赛种，有未开赛 已开赛 ，不区分赛种  
   * 2. 列表数据类型为赛事列表   全部赛种 不区分 是否开赛，区分赛种  
   * 3. 列表数据类型为联赛列表   单一赛种，不区分赛种 ，只有未开赛，只有联赛
   * 4. 列表数据类型为赛事列表   单一赛种，有未开赛 已开赛 ，不区分赛种  
   * 5. 冠军赛事列表            全部赛种 不区分是否开赛 
   * 6. 冠军赛事列表            单一赛种 不区分是否开赛 
   */
  set_new_league_fold(){
    // 列表类型区分已开赛 和 未开赛
    if([1,4].includes(this.match_list_mapping_relation_obj_type)){
      let play_title_card_obj = this.all_card_obj.play_title || {}
      // 如果滚球已折叠 调用滚球折叠方法  设置所有的滚球联赛折叠
      if(play_title_card_obj.is_match_status_fold){
        play_title_card_obj.is_match_status_fold = false
        this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie(play_title_card_obj,true)
      }
      let no_start_title_card_obj = this.all_card_obj.no_start_title || {}
      // 如果未开赛已折叠 调用未开赛折叠方法  设置所有的未开赛联赛折叠
      if(no_start_title_card_obj.is_match_status_fold){
        no_start_title_card_obj.is_match_status_fold = false
        this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie(no_start_title_card_obj,true)
      }
    }
    // 列表类型区分球种
    else if([2,5].includes(this.match_list_mapping_relation_obj_type)){
      // 遍历所有球种标题卡片列表
      _.each(this.csid_to_card_key_obj, card_keys_arr => {
        // 球种标题卡片对象
        let sport_title_card_obj = this.all_card_obj[card_keys_arr[0]] || {}
        // 如果球种已折叠 调用球种折叠方法  设置所有的球种联赛折叠
        if(sport_title_card_obj.is_sport_fold){
          sport_title_card_obj.is_sport_fold = false
          this.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie(sport_title_card_obj,true)
        }
      })
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
    * 联赛 折叠
    * click_card_obj 点击的联赛卡片对象
    */
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_tid_zhedie(click_card_obj){
    click_card_obj.is_league_fold = !click_card_obj.is_league_fold
    // 折叠的联赛容器卡片
    let league_container_card_obj = this.all_card_obj[click_card_obj.league_container_card_key]
    // 设置联赛容器卡片是否折叠
    league_container_card_obj.is_league_fold = click_card_obj.is_league_fold
    // 设置联赛容器卡片是否显示
    league_container_card_obj.is_show_card = !click_card_obj.is_league_fold

    // 根据折叠状态设置联赛标题卡片高度 联赛标题卡片高度有折叠和未折叠两种状态  
    if(click_card_obj.is_league_fold){
      // 联赛折叠  
      // 设置折叠后的列表scroll_top
      this.set_fold_match_list_scroll_top(click_card_obj.offset_top,true)
      // 设置联赛标题卡片高度
      click_card_obj.card_total_height = click_card_obj.league_fold_height
      click_card_obj.card_total_height_back = click_card_obj.league_fold_height

      // 设置联赛容器卡片
      league_container_card_obj.card_total_height = 0

    }else{
      // 联赛展开
      // 还原联赛标题卡片高度
      click_card_obj.card_total_height = click_card_obj.league_nofold_height
      click_card_obj.card_total_height_back = click_card_obj.league_nofold_height

      // 设置联赛容器卡片高度
      if(league_container_card_obj.load_data_status == 'loaded'){
        league_container_card_obj.card_total_height = league_container_card_obj.card_total_height_back
      }else{
        league_container_card_obj.load_data_status = 'loading'
        league_container_card_obj.card_total_height = 200
      }
    }
    
    // 计算所有卡片偏移量 和列表总高度
    this.conpute_match_list_card_offset()
  }

  /**
    * 赛种 折叠
    *   click_card_obj 点击折叠的卡片对象
    */
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_sportid_zhedie(click_card_obj,is_no_emit_fold_change){
    // 是否赛种折叠
    let is_sport_fold = !click_card_obj.is_sport_fold

    // 赛种已折叠
    if(is_sport_fold){
      // 设置已折叠高度
      click_card_obj.card_total_height = click_card_obj.card_fold_height
      if(!is_no_emit_fold_change){
        // 设置折叠后的列表scroll_top
        this.set_fold_match_list_scroll_top(click_card_obj.offset_top)
      }
    }else{
      // 设置未折叠高度
      click_card_obj.card_total_height = click_card_obj.card_nofold_height
    }

    // 赛种下所有卡片key列表
    let sport_card_keys_arr = this.csid_to_card_key_obj['csid_'+click_card_obj.csid] || []

    // 遍历所有赛种下卡片  设置赛种折叠
    sport_card_keys_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key]
      // 设置赛种折叠
      card_obj.is_sport_fold = is_sport_fold
      
      // 非球种标题类型卡片 设置卡片是否显示
      if(card_obj.card_type != 'sport_title'){
        // 设置卡片是否显示
        if(is_sport_fold){
          // 赛种已折叠
          card_obj.is_show_card = false
        }else{
          // 赛种未折叠
          // 如果是联赛标题卡片则显示 ， 联赛容器卡片是否显示等于自身是否折叠
          card_obj.is_show_card = ['league_title','champion_league_title'].includes(card_obj.card_type) ? true : !card_obj.is_league_fold
        }
        // 如果卡片隐藏 设置卡片高度为0  否则还原卡片高度
        if(card_obj.is_show_card){
          card_obj.card_total_height = card_obj.card_total_height_back
        }else{
          card_obj.card_total_height = 0
        }
      }
    })
    // 设置列表总高度
    this.conpute_match_list_card_offset()
  }

  /**
  * 未开赛 开赛 折叠
  *   click_card_obj 点击折叠的卡片对象
  */
  recompute_match_list_style_obj_and_match_list_mapping_relation_obj_when_zaopan_gunqiu_zhedie(click_card_obj,is_no_emit_fold_change){
    let is_match_status_fold = !click_card_obj.is_match_status_fold
    // 已折叠  
    if(is_match_status_fold){
      // 设置已折叠高度
      click_card_obj.card_total_height = click_card_obj.card_fold_height
      if(!is_no_emit_fold_change){
        // 设置折叠后的列表scroll_top
        this.set_fold_match_list_scroll_top(click_card_obj.offset_top)
      }
    }else{
      // 设置未折叠高度
      click_card_obj.card_total_height = click_card_obj.card_nofold_height
    }
    let fold_card_keys_arr
    if(click_card_obj.card_type == 'play_title'){
      // 滚球折叠
      fold_card_keys_arr = this.play_to_card_key_arr
    }else{
      // 未开赛折叠
      fold_card_keys_arr = this.no_start_to_card_key_arr
    }

    fold_card_keys_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key]
      // 设置赛事状态折叠
      card_obj.is_match_status_fold = is_match_status_fold

      // 非已开赛、未开赛标题类型卡片 设置卡片是否显示
      if(!['play_title','no_start_title'].includes(card_obj.card_type)){
        // 设置卡片是否显示
        if(is_match_status_fold){
          card_obj.is_show_card = false
        }else{
          // 如果赛事状态未折叠并且是联赛标题卡片 则显示  否则是否显示等于是否折叠
          card_obj.is_show_card = card_obj.card_type == 'league_title' ? true : !card_obj.is_league_fold
        }
        // 如果卡片隐藏 设置卡片高度为0  否则还原卡片高度
        if(card_obj.is_show_card){
          card_obj.card_total_height = card_obj.card_total_height_back
        }else{
          card_obj.card_total_height = 0
        }
      }
    })

    // 设置列表总高度
    this.conpute_match_list_card_offset()
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
   * @Description 角球折叠 
   * @param {number} mid 折叠的赛事ID
  */
  fold_tab_play(mid){
    let card_obj = this.all_card_obj['mid_'+mid] || {}
    card_obj.is_fold_tab_play = !card_obj.is_fold_tab_play
    
    if(card_obj.is_fold_tab_play){
      // 角球已折叠  角球区域总高度 等于角球标题高度
      card_obj.tab_play_total_height = card_obj.tab_play_title_height 
    }else if (card_obj.is_show_tab_play){
      // 角球且未折叠  角球区域总高度
      card_obj.tab_play_total_height = card_obj.tab_play_title_height + this.get_tab_play_height(mid)
    }
    // 设置赛事卡片总高度 + 赛事间距和边框6px
    card_obj.total_height = card_obj.main_handicap_height + card_obj.add_handicap_height + card_obj.tab_play_total_height + 6
    
    // 更新赛事父级卡片样式 即对应的联赛容器卡片样式 
    this.update_match_parent_card_style(card_obj)
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
  /**
   * 设置卡片显示等级
   * 一级   列表可视区域
   * 二级   列表可视区域 加前500px  和后500px  
   * 三级   列表可视区域 加前1000px 和后1000px 
   * 四级   列表可视区域 加前2000px 和后2000px 
   * 五级   列表可视区域 加前3000px 和后3000px 
  */
  set_card_show_level(){
    let scroll_top = this.view.$matchlist.scroll_top
    // 列表高度
    let list_content_height = JSON.parse(localStorage.getItem('get_layout_size')).content_height

    // 一级区域offset_top
    this.level1_offset_top = scroll_top
    // 一级区域offset_bottom 
    this.level1_offset_bottom = this.level1_offset_top + list_content_height 

    // 二级区域offset_top
    this.level2_offset_top = scroll_top - 500
    // 二级区域offset_bottom 
    this.level2_offset_bottom = this.level2_offset_top + list_content_height + 500 * 2

    // 三级区域offset_top
    this.level3_offset_top = scroll_top - 1000
    // 三级区域offset_bottom 
    this.level3_offset_bottom = this.level3_offset_top + list_content_height + 1000 * 2

    // 可视区域赛事ID
    let show_mids_arr = []

    // 遍历所有卡片
    this.match_list_card_key_arr.forEach(card_key => {
      let card_obj = this.all_card_obj[card_key]
      
      // 是否联赛容器卡片
      if(card_obj.card_type == 'league_container'){
        // 设置卡片显示等级
        card_obj.show_level = this.get_show_level(card_obj)
        // 设置对应的联赛标题卡片显示等级
        let league_title_card_obj = this.all_card_obj[card_obj.league_title_card_key] || {}
        league_title_card_obj.show_level = card_obj.show_level
        
        let mids_arr = card_obj.mids.split(',')
        // 遍历联赛容器下的赛事卡片  设置显示等级
        mids_arr.forEach( mid => {
          let match_card_obj = this.all_card_obj['mid_'+mid] || {}
          match_card_obj.show_level = this.get_show_level(match_card_obj)
          if(match_card_obj.show_level == 1 && card_obj.is_show_card){
            show_mids_arr.push(mid)
          }
        })
      }else{
        // 球种标题卡片 和赛事状态卡片 因为设置吸顶的原因，不能用offset_top判断判断是否可视，所以这个类型卡片需要一直显示
        card_obj.show_level = 1
      }

    })
    this.view.$matchlist.set_show_mids(show_mids_arr)
  }
  /**
   * @Description 获取显示等级 
  */
  get_show_level(card_obj){
    let show_level
    if((card_obj.offset_top > this.level1_offset_top && card_obj.offset_top < this.level1_offset_bottom) || (card_obj.offset_bottom > this.level1_offset_top && card_obj.offset_top < this.level1_offset_bottom)){
      show_level = 1
    }else if((card_obj.offset_top > this.level2_offset_top && card_obj.offset_top < this.level2_offset_bottom) || (card_obj.offset_bottom > this.level2_offset_top && card_obj.offset_top < this.level2_offset_bottom)){
      show_level = 2
    }else if((card_obj.offset_top > this.level3_offset_top && card_obj.offset_top < this.level3_offset_bottom) || (card_obj.offset_bottom > this.level3_offset_top && card_obj.offset_top < this.level3_offset_bottom)){
      show_level = 3
    }else{
      show_level = 4
    }
    return show_level
  }
  /**
   * 计算当前赛事数据模板    --------单个赛事 
   * 数据依据：
   *    1. 赛事信息 ， 赛种ID 
   *    2. 当前在哪一个列表  假定 which_list
   *    3. 配置文件  / 或者叫配置方法
   *   
   * 
   * 输出信息：
   *    一个计算后的当前赛事的 高度相关的数据 ，含 模板 等信息 ，
   *    这个信息用于两个地方： 
   *      1. 联赛卡片 计算  
   *      2. 用于赛事自身约束
   * 
   * 主要注意：
   *     1. 附加需求:   例如目前的 滚球下的 球类显示行
   *     2. 联赛信息展示行
   * 
   *  
   *  备注  1.在滚球我们自己根据数据计算出实际模板数据
   *        2. 在早盘 后台返回模板我们根据 后台返回的模板计算出实际模板数据 
   * 
   * 最好是写 配置文件 
   *    
   */ 
  compute_style_template_by_matchinfo(match,template_id){
    if(template_id == 13){
      template_id = 0
    }
    // 赛事列表模板配置
    let template_config = match_template_config['template_'+template_id] || {}
    // 赛事样式对象
    let style_obj = {
      // 显示等级
      show_level:1,
      // 是否显示卡片  没拿到赛事数据的时候 不显示
      is_show_card:false,
      // 是否显示角球、罚牌、点球大战等玩法
      is_show_tab_play: false,
      // 角球、罚牌、点球大战等玩法 是否折叠
      is_fold_tab_play: false,
      // 角球区域高度
      tab_play_total_height: 0,
      // 角球盘口高度
      tab_play_title_height:template_config.tab_play_title_height,
      // 角球盘口高度
      tab_play_handicap_height:this.get_tab_play_height( _.get(match,'mid')),
      // 足球篮球  附加盘数量
      add_handicap_count: 0,
      // 附加盘高度
      add_handicap_height: 0,
      // 是否需要动态计算高度
      is_dynamic_compute_height:template_config.is_dynamic_compute_height,
      // 卡片总高度
      total_height: 0,
      // 主盘口高度
      main_handicap_height: 0,
      // 是否显示当前局玩法
      is_show_cur_handicap: false,
      // 当前局盘口高度
      cur_handicap_height: 0,
    }
 
    // 如果没有赛事信息
    if(!match || !match.mid){
      return style_obj
    }
    style_obj.csid = match.csid
    style_obj.tpl_id = match.tpl_id
    style_obj.is_show_card = true
    // 0号模板设置角球玩法数据
    if(template_id == 0){
      let obj = this.compute_style_template_by_matchinfo_template0_zuqiu(match,template_config)
      Object.assign(style_obj,obj)
    }
    // 7号模板 篮球 让球与大小
    else if(template_id == 7){
      let obj = this.compute_style_template_by_matchinfo_template7_lanqiu(match,template_config)
      Object.assign(style_obj,obj)
    }
    // 18号模板 冠军
    else if(template_id == 18){
      let obj = this.compute_style_template_by_matchinfo_template18(match)
      Object.assign(style_obj,obj)
    }

    // 设置主盘口高度
    style_obj.main_handicap_height = template_config.main_handicap_height
    // 是否显示当前局盘口
    style_obj.is_show_cur_handicap = match.is_show_cur_handicap
    
    // 如果有当前局盘口 设置当前局盘口高度
    if(style_obj.is_show_cur_handicap){
      style_obj.cur_handicap_height = template_config.cur_handicap_height
    }

    // 设置卡片总高度 等于主盘口高度 + 当前局盘扣高度 + 附加盘高度 + 角球区域高度 + 赛事间距和边框6px
    style_obj.total_height = style_obj.main_handicap_height + style_obj.cur_handicap_height + style_obj.add_handicap_height + style_obj.tab_play_total_height + 6
    return style_obj
  }
  /**
   * @Description 计算模板0专有的数据
   * @param {object} match 赛事
   * @param {object} template_config 配置
  */
  compute_style_template_by_matchinfo_template0_zuqiu(match,template_config){
    // 是否显示角球、罚牌、点球大战等玩法
    let is_show_tab_play = match.has_other_play
    // 角球、罚牌、点球大战等玩法 是否折叠
    let is_fold_tab_play = _.get(this.all_card_obj['mid_'+match.mid],'is_fold_tab_play',false) 
 
    let tab_play_total_height = 0
    if(is_show_tab_play && !is_fold_tab_play){
      // 如果有角球玩法并且未折叠  角球区域总高度 等于角球标题高度加角球盘口高度 
      tab_play_total_height = template_config.tab_play_title_height + this.get_tab_play_height(match.mid)
    }else if (is_show_tab_play){
      // 如果有角球玩法并且未折叠  角球区域总高度 等于角球标题高度
      tab_play_total_height = template_config.tab_play_title_height 
    }
    
    // 足球篮球  附加盘数量
    let add_handicap_count = this.get_add_handicap_count(match)
    // 附加盘高度 等于附加盘数量*模板配置附加盘高度
    let add_handicap_height = add_handicap_count * template_config.add_handicap_height

    return {
      // 是否显示角球、罚牌、点球大战等玩法
      is_show_tab_play,
      // 角球、罚牌、点球大战等玩法 是否折叠
      is_fold_tab_play,
      // 角球区域高度
      tab_play_total_height,
      // 足球篮球  附加盘数量
      add_handicap_count,
      // 附加盘高度
      add_handicap_height,
    }
  }
  /**
   * @Description 篮球让球与大小
   * @param {object} match 赛事
   * @param {object} template_config 配置
   **/
  compute_style_template_by_matchinfo_template7_lanqiu(match,template_config){
    // 足球篮球  附加盘数量
    let add_handicap_count = this.get_add_handicap_count(match)
    // 附加盘高度 等于附加盘数量*模板配置附加盘高度
    let add_handicap_height = add_handicap_count * template_config.add_handicap_height

    return {
      // 足球篮球  附加盘数量
      add_handicap_count,
      // 附加盘高度
      add_handicap_height,
    }
  }
  /**
   * @Description 计算冠军模板赛事高度
   * @param {object} match 赛事
   **/
  compute_style_template_by_matchinfo_template18(match){
    let cur_match = this.view.match_list_data.mid_obj[`mid_${match.mid}`]  || {main_handicap_list:[]}
    // 附加盘口高度
    let add_handicap_height = 0
    // 投注项数量
    let ol_count = 0
    cur_match.main_handicap_list.forEach(hl_data => {
      if(hl_data.hid && hl_data.hs != 2){
        // 盘口标题高度
        add_handicap_height += 32
        // 计算投注项数量
        ol_count = 0
        hl_data.ol.forEach(ol => {
          if(ol.os != 3 && ol.oid){
            ol_count++
          }
        })
        // 累加投注项高度
        add_handicap_height = add_handicap_height + Math.ceil(ol_count / 2) * 35
      }
    })
    return { add_handicap_height }
  }
   /**
   * @Description 跟新次要玩法高度
   * @param {String|Number} mid 赛事id
  */
  update_match_cur_card_style(mid) {
    let card_obj = this.all_card_obj['mid_'+mid] || {}
    if(!card_obj.is_fold_tab_play){
      card_obj.tab_play_total_height = card_obj.tab_play_title_height + this.get_tab_play_height(-1)
      card_obj.total_height = card_obj.main_handicap_height + card_obj.add_handicap_height + card_obj.tab_play_total_height + 6
      this.update_match_parent_card_style(card_obj)
    }
  }
  /**
   * @Description 获取足篮附加盘数量 
  */
  get_add_handicap_count(match){
    let add_handicap_count = 0
    // 是否有附加盘1
    if(match.has_add1){
      add_handicap_count++
    }
    // 是否有附加盘2
    if(match.has_add2){
      add_handicap_count++
    }
    return add_handicap_count;
  }
  /**
   * @Description 获取其他玩法盘口高度
   * @param {string | Number } mid  赛事id
  */
  get_tab_play_height(mid) {
    let { play_current_key,other_handicap_list=[] } = this.view.match_list_data.mid_obj['mid_' + mid] || {}
    let { tab_play_handicap_height:handicap_height } = match_template_config.template_0
    let length =  _.get(other_handicap_list,'0.ols.length',3) 
           //5分钟      波胆
    if (['hps5Minutes','hpsBold'].includes(play_current_key)) {
        // 计算0号模板次要玩法 盘口+玩法标题高度
        handicap_height = length * 35 + (40 - (!['en','ad','ms'].includes(localStorage.getItem('get_lang')) ? 16 : 0))
    } 
    return handicap_height
}
  /**
   * @Description 冠军投注后跟新 联赛收藏状态
   * @param {string} mid  赛事id
   * @returns 
   */
  update_league_collect_data(mid){
    for (let index = 0; index < this.match_list_card_key_arr.length; index++) {
      let item = this.match_list_card_key_arr[index]
      if(item.indexOf('league_title') !=-1){
        if(this.all_card_obj[item].mid == mid){
          this.all_card_obj[item].league_obj.tf = true
          return
        }
      }
    }
  }
  /**
   *@Description 更新常规赛事不同分类的联赛收藏状态 并 获取所有同联赛下的赛事ID
   * @param {String} tid  联赛id
   * @param {Boolean} status  联赛收藏状态
   * @returns {Array}       联赛下的赛事ID
   */
  update_league_collect_data_and_get_mids(tid,status){
    let mids = []
    // 遍历所有卡片key
    _.each(this.match_list_card_key_arr, card_key => {
      if(card_key.indexOf('league_title') !=-1){
        let card_obj = this.all_card_obj[card_key]
        if(card_obj.league_obj.tid == tid){
          card_obj.league_obj.tf = status
          // 组装联赛下的赛事ID
          mids.push(...card_obj.league_obj.mids.split(','))
        }
      }
    })
    return mids
  }
  /**
   *@Description 设置0号模板次要玩法盘口+玩法标题高度
   */
  set_tpl0_tab_play_title_height(){
    _.set(match_template_config,'template_0.tab_play_handicap_height',145 - (!['en','ad','ms'].includes(localStorage.getItem('get_lang')) ? 16 : 0))
  }
}

