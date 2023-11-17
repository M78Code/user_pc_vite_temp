/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 押注功能数据处理操作(普通赛事和冠军)
 */
import oddsConversion from "project/activity/src/public/mixins/odds_conversion/odds_conversion_mixin.js";
import play_mapping from "project/activity/src/public/config/mapping/play_mapping.js";
import bettingStore from 'project/activity/src/public/store/module/betting_list/betting_list';
export default {
  mixins: [ oddsConversion],
  methods: {
    vx_set_chat_room_type(arg) {
        return bettingStore.mutations.set_chat_room_type(arg);
    },
    /**
     * @description: 点击押注按钮操作
     * @param {Object, is_chat_room}  Object 数据源  
     * @param {is_chat_room}  is_chat_room 是不是聊天室点击
     * @return {undefined} undefined
     */
    bat_click(obj, is_chat_room=false) {
      if(!is_chat_room) this.vx_set_chat_room_type(null); //聊天室来源跟单盘口状况eu置空
      // 有投注正在提交中进行提示
      if (this.vx_get_is_handle) {
        // 提示投注正在处理中请稍等...
        this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t('bet.bet_submiting'));
        return;
      }
      //是不是单关
      let is_bet_single = this.vx_is_bet_single;
      // 如果是已下注状态，不让其再添加 正在处理中点击按钮触发完成方法
      if (is_bet_single && this.vx_get_is_single_handle) {
        // 触发单关点击确认按钮的方法
        this.$root.$emit(this.emit_cmd.EMIT_SINGLE_COMPLETE_HANDLE_CMD);
      } else if (this.vx_get_is_handle){
        // 触发点击确认按钮的方法
        this.$root.$emit(this.emit_cmd.EMIT_COMPLETE_HANDLE_CMD);
      }
      // 关闭遮罩
      this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);

      //查找里面是否有相同的赛事 如果有则替换该条记录,如果没有则增加该条记录
      let match_id, hid;
      // 如果点击的是赛事列表
      if (obj.bet_source == 'match_list' && !is_chat_room) {
        // 通过mid_obj获取传入的赛事id
        match_id = obj.mid_obj.mid;
      } else {
        // 非赛事列表获通过match_info对象取赛事id
        match_id = obj.match_info.mid;
      }
      let effect = true;  //投注项默认不在
      let effect_index = -1; //投注项在列表中的位置
      // 若为串关 且数据不为空
      if(!is_bet_single && !_.isEmpty(this.vx_get_bet_obj) && !_.isEmpty(this.vx_get_bet_list)) {
        //投注列表长度
        let flen = _.get(this,'vx_get_bet_list.length', 0);
        for(let i = 0; i < flen; i++) {
          // 获取投注项id
          let id = _.get(this,`vx_get_bet_list[${i}]`);
          // 获取投注项的cs对象(前端自己组装用的对象)
          let cs = _.get(this,`vx_get_bet_obj[${id}].cs`, {});
          // 点击串关投注列表中存在的赛事投注项，获取所在赛事在赛事列表中的位置
          if(cs.match_id == match_id) {
            effect = false;  //投注项默认在vx_get_virtual_bet_list中
            effect_index = i;
            break;
          }
        }
      }
      // 点击赛事列表时获取盘口id
      if(obj.bet_source == 'is_chat_room'){
        hid = _.get(obj, 'hid');
      }else
      if(obj.bet_source == 'match_list') {
          hid = _.get(obj, 'hl_obj.hid');
      } else if (['hot','recent','banner_hot'].includes(obj.bet_source)) { // 热门推荐、近期关注获取盘口id
        hid = _.get(obj, 'bet_ids.hid');
      } else { // 赛事详情获取盘口id
        hid = _.get(obj,`match_info.hps.${obj.bet_path.hps_index}.hl.${obj.bet_path.hl_index}.hid`)
      }
      let g_bet_list = _.get(this,'vx_get_bet_list',[]);
      /** 拆分前的逻辑  */
      //单关且投注项列表中有数据，且新增加的id不在列表中
      // if (is_bet_single && !_.includes(_.get(this,'vx_get_bet_single_list',[]), obj.id)) {
      //   this.add_obj_when_id_not_include_single(obj);
      // } else if (is_bet_single && _.includes(_.get(this,'vx_get_bet_single_list',[]), obj.id)) { // 单关且列表中存在所选择的投注项id
      //   // 移除投注项对象
      //   this.bet_item_del(obj.id);
      // } else if(this.vx_get_is_bet_merge && !_.includes(g_bet_list, obj.id)) { // 合并勾选后的串关
      //   this.add_obj_when_id_not_includes_bet_list(obj);
      // } else if (!is_bet_single && !_.includes(g_bet_list, obj.id) && effect) { // 串关且串关列表中有数据且新增的id不在串关列表中并且赛事没有在列表中
      //   this.bet_item_add_info(obj);
      // } else if (!is_bet_single && !_.includes(g_bet_list, obj.id) && !effect) { // 串关且串关列表中有数据且新增的id存在串关列表中并且赛事存在列表中
      //   this.add_obj_when_id_not_includes_bet_list_not_effect(obj);
      // } else { // 删除投注项
      //   this.add_obj_when_last_step(obj);
      // }

      /** 拆分后的逻辑  */
      //如果是单关
      if(is_bet_single) {
        //投注项不在列表里
        if(!_.includes(_.get(this,'vx_get_bet_single_list',[]), obj.id)) {
          //单关当投注项id不在列表中时添加投注项
          this.add_obj_when_id_not_include_single(obj, match_id, hid);
        }else{
          //根据对象id删除押注项
          this.bet_item_del(obj.id);
        }
      }else{
        //如果是串关
        if(this.vx_get_is_bet_merge) {
           //投注项不在串关列表里
          if(!_.includes(g_bet_list, obj.id)) {
            //串关当投注项id不在列表中时且是合并添加投注项
            this.add_obj_when_id_not_includes_bet_list(obj, match_id, hid);
          }else{
            //最后一步删除投注项
            this.add_obj_when_last_step(obj);
          }
        }else{
          //投注项默认不在
          if(effect) {
            if(!is_bet_single && !_.includes(g_bet_list, obj.id)) {
              // 增加投注项--首页使用
              this.bet_item_add_info(obj);
            }else{
              //最后一步删除投注项
              this.add_obj_when_last_step(obj);
            }
          }else{
            //投注项在
            if(!is_bet_single && !_.includes(g_bet_list, obj.id)) {
              //串关当投注项id不在列表中时且投注项不存在添加投注项
              this.add_obj_when_id_not_includes_bet_list_not_effect(obj, effect_index, hid);
            }else {
              //最后一步删除投注项
              this.add_obj_when_last_step(obj);
            }
          }
        }
      }
      // 当为串关且串关投注项列表有数据
      if(!is_bet_single && _.get(this,'vx_get_bet_list.length', 0) > 0) {
        // 菜单切换为展开状态
        if(this.vx_get_left_menu_toggle) {
          // 设置右侧显示投注项列表
          this.vx_set_layout_left_show('bet_list');
        }
        // 校验是否可以串关
        this.yabo_common.check_mix(this);
      } else if (is_bet_single && this.vx_get_left_menu_toggle) { // 当为单关且菜单切换为展开状态
        // 设置右侧显示投注项列表
        this.vx_set_layout_left_show('bet_list');
      }
    },
    /**
     * @description: 增加投注项--首页使用
     * @param {Object} bet_obj 押注对象
     * @param {effect} effect 是否有效
     * @param {match_update} match_update 是否赛事更新
     * @return {undefined} undefined
     */
    bet_item_add_info(bet_obj, effect = true, match_update = false) {
      let obj = {};
      obj = this.tidy_bet_item_info(bet_obj, effect);
      if(obj && obj.isok) {
         let is_bet_single = this.vx_is_bet_single;
         // 判断添加的注单是否已经到达上限
        if ((is_bet_single && this.vx_get_bet_single_list.length == 10) ||
          (!is_bet_single && this.vx_get_bet_list.length == this.vx_get_mix_max_count)) {
          this.$root.$emit(
            this.emit_cmd.EMIT_SHOW_TOAST_CMD,
            this.$root.$t("bet.bet_max_val_msg")
          ); //投注项数量已达上限
          return;
        }
        // 串关投注时没有投注项
        if(obj.bet_source != 'is_chat_room'){
          if(!is_bet_single && this.vx_get_bet_list.length == 0) {
            // 设置赛事更新标致为false
            obj.cs.match_update = false;
          } else {
            // 设置赛事更新标识
            obj.cs.match_update = match_update;
          }
        }
        // 设置投注项id
        let id = _.get(bet_obj, 'id');
        // 当为单关时添加投注项
        if(is_bet_single) {
          // 添加单关投注项对象
          this.vx_bet_single_obj_attr(obj);
          // 添加对应的id到单关投注列表中
          this.vx_bet_single_list_push(id);
        } else {
          // 串关时添加投注项
          // 添加串关投注项对象
          this.vx_bet_obj_add_attr(obj);
          // 添加投注项id到串关投注项列表中
          this.vx_bet_list_push(id);
        }
      }
    },
    /**
     * @description: 整理押注对象
     * @param {Object} bet_obj 押注对象
     * @param {effect} effect 是否有效
     * @return {Object} 处理好的数据对象
     */
    tidy_bet_item_info(bet_obj, effect=true) {
      console.log('正常投注参数playOptionName处理------------701',  bet_obj);
      let isok = true,
        item,
        // 要构造的投注项对象
        obj = {"key":"", "bs":{}, "cs":{}},
        // 投注项id
        id = _.get(bet_obj, 'id'),
        // 盘口值
        handicap_value='',
        // 是否支持串关 true:支持 false:不支持
        serial_type = true,
        // fields为组合赛事需要保留的对象字段 hps
        /**
         fields 赛事层字段含义说明
         csid: 球种id
         mid: 赛事id
         tid: 联赛id
         msc: 赛事比分(字符串数组形式)
         tn:联赛名称
         onTn: 赛季
         mmp:赛事阶段
         ms:赛事状态
         mhid: 主队id
         mhn:主队名称
         maid: 客队id
         man:客队名称
         mgt: 赛事开赛时间
         mcg:栏目类型(1:滚球,2:即将开赛，3:今日，4:早盘)
         mhs: 赛事级盘口状态
         mf: 收藏标识(true:收藏 false:未收藏)
         orpt: 模板(主要用于判断冠军)
         mprmc: 操盘来源(PA:PA操盘,MTS:MTS操盘)
         _index: 赛事所在赛事列表中的位置
         cds: 数据来源
        */
        fields =  ["csid","mid","tid","msc","tn","onTn","mmp","tlev","ms","mhid","mhn","maid","man","mgt","mcg","mhs","mf", "med", "seoy", "orpt", "mprmc", "_index","cds"],
        /**
          hps_fields 玩法层字段含义说明
          hpid: 玩法id
          hpn: 玩法名称
          hsw:支持的盘口(取值1,2,3,4,5,6)
          title: 标题
          hl: 盘口对象
          hps: 玩法对象
          hids: 1:支持串关 0:不支持串关
         */
        hps_fields = ["hpid","hpn","hsw","title","hl", "hps", "hids"],
        /**
         * hl_fields 盘口层字段含义说明
         * hid: 盘口id
         * hmt: 盘口类型(1:赛前盘 0:滚球)
         * hv: 盘口值
         * hn: 坑位值
         * ol: 投注项数组对象
         */
        hl_fields = ["hid","hmt","hs","ad2","hv","hn","ol"],

        bet_omit_obj = {}, score_type = "S1", match_type, market_type;


      if(_.isEmpty(id)) {
        isok = false;
        obj.isok = isok;
        return obj;
      }
      // 深度复制对象
      let item_obj = {
        hps: [{hl:[{ol:{}}]}]
      };
      try {
        let {type_name} = this.vx_cur_menu_type;
        // 如果来源是赛事列表:match_list,热门推荐:hot,近期关注:recent
        if (['match_list', 'hot','recent', 'banner_hot'].includes(bet_obj.bet_source)) {
          let mid = _.get(bet_obj, 'bet_ids.mid') || _.get(bet_obj,'ol_data._mid'),
              hid = _.get(bet_obj, 'bet_ids.hid') || _.get(bet_obj,'ol_data._hid'),
              oid = _.get(bet_obj, 'bet_ids.oid') || _.get(bet_obj,'ol_data.oid');
          // 投注项所在的赛事对象
          let mid_obj = _.get(bet_obj, `mid_obj.${mid}`) || _.get(bet_obj, 'mid_obj');
          // 投注项所在的盘口对象
          let hl_obj = _.get(bet_obj, `hl_obj.${hid}`) || _.get(bet_obj, 'hl_obj');
          // 所选投注项对象
          let ol_obj = _.get(bet_obj, `ol_obj.${oid}`) || _.get(bet_obj, 'ol_obj');
          item = mid_obj;
          if(['hot','recent','banner_hot'].includes(_.get(bet_obj,'bet_source'))) {
            item_obj.hps[0] = {
              // 玩法id
              hpid: _.get(mid_obj,'hps[0].hpid'),
              // 玩法名称
              hpn: _.get(mid_obj,'hps[0].hpn'),
              // 玩法支持的盘口
              hsw: _.get(mid_obj,'hps[0].hsw'),
              // 是否支持串关
              hids: _.get(mid_obj, 'hps[0].hids')
            }
          } else {
            item_obj.hps[0] = {
              // 玩法id
              hpid: _.get(hl_obj,'_play.hpid'),
              // 玩法名称
              hpn: _.get(hl_obj, '_play.hpn'),
              // 玩法支持的盘口
              hsw: _.get(hl_obj, '_play.hsw'),
               // 是否支持串关
              hids: _.get(hl_obj, '_play.hids')
            };
          }
          // 玩法对象 和 选投注项对象 其一为空得情况
          if(_.isEmpty(hl_obj) || _.isEmpty(ol_obj)) {
            isok = false;
            obj.isok = isok;
            return obj;
          }
          // 盘口对象获取
          item_obj.hps[0].hl = _.cloneDeep([hl_obj]);
          // 整理盘口对象，删除不需要的字段
          for(let key of Object.keys(item_obj.hps[0].hl[0])) {
            if(!hl_fields.includes(key)) {
              delete item_obj.hps[0].hl[0][key];
            }
          }
          // 投注项数据
          item_obj.hps[0].hl[0].ol = _.cloneDeep([ol_obj]);

          // 显示的盘口
          handicap_value = _.get(item_obj, 'hps[0].hl[0].hv', '') || _.get(item_obj, 'hps[0].hl[0].ol.hv', '');
          if(!_.isEmpty(ol_obj.on) && !_.isEmpty(ol_obj.onbl) && handicap_value == ol_obj.on && !ol_obj.on.includes(ol_obj.onbl)) {
            // 投注项名称的组成
            item_obj.hps[0].hl[0].ol[0].on = `${ol_obj.onbl} ${ol_obj.on}`;
          }
          // console.log(`==========tidy_bet_item_info=======>>>>>on:${item_obj.hps[0].hl[0].ol[0].on}`);
          // 获取赛事模板id
          let match_tpl_id = $menu.menu_data.match_tpl_number;
          // 获取赛事id
          let menu_id = _.get(this.$route,'query.menu_id', 0);
          if((match_tpl_id == 18 ||
            menu_id == 100 ||
            type_name == 'winner_top')){
              match_type = 3;
          }
          // 当为冠军(在赛事列表中包括冠军赛事id 菜单id 顶部冠军)
          // 获取玩法id
          let hpid = _.get(item_obj, 'hps[0].hpid');
          // 从映射列表中获取玩法所在的比分类型
          score_type = _.get(play_mapping,`SCORE_BASE_KEY[${hpid}]`,'');
          //15分钟玩法阶段比分获取
          if ([32, 33, 34,231,232,233,371].includes(hpid*1) && score_type.includes(',')) {
            let hSpecial = _.get(bet_obj, 'hl_obj.hSpecial')
            if (hSpecial) {
              let _score_type_arr = score_type.split(",");
              // 匹配球种玩法对应的比分
              score_type = _score_type_arr[hSpecial-1]
            }
          }
        } else if(bet_obj.bet_source == 'match_details') { // 当点击的投注项是在赛事详情列表是
          let indexs = _.get(bet_obj, 'bet_path');
          // 赛事对象
          item = _.get(bet_obj, 'match_info');
          // 玩法对象
          item_obj.hps[0] = _.cloneDeep(item.hps[indexs.hps_index]);
          // 盘口对象
          item_obj.hps[0].hl = _.cloneDeep([item.hps[indexs.hps_index].hl[indexs.hl_index]]);
          // 投注项对象数组
          item_obj.hps[0].hl[0].ol = _.cloneDeep([item.hps[indexs.hps_index].hl[indexs.hl_index].ol[indexs.ol_index]]);

          // 移除多余的玩法对象上的字段(保留hps_fields列举的字段)
          for(let key of Object.keys(item_obj.hps[0])) {
            if(!hps_fields.includes(key)) {
              delete item_obj.hps[0][key];
            }
          }

          // 移除多余的盘口对象上的字段(保留hl_fields列举的字段)
          for(let key of Object.keys(item_obj.hps[0].hl[0])) {
            if(!hl_fields.includes(key)) {
              delete item_obj.hps[0].hl[0][key];
            }
          }
          // 投注项盘口上的比分
          let score = _.get(item_obj, 'hps[0].hps');
          let hpid = _.get(item_obj, 'hps[0].hpid');
          // 查分比分获取比分类型
          if(_.isString(score) && score.includes('|')) {
            score_type = score.split('|')[0];
          }
        }else if(bet_obj.bet_source == 'is_chat_room'){
          item = _.get(bet_obj, 'match_info');
          item_obj.hps[0].hl[0].ol = _.omitBy(bet_obj, _.isObject);
          item_obj.hps[0].hl[0].ol.hpn = _.get(bet_obj, 'hpn');
          // 投注项盘口上的比分
          let score = _.get(bet_obj, 'hps');

           // 查分比分获取比分类型
          if(_.isString(score) && score.includes('|').length>1) {
            score_type = score.split('|')[0];
          }
        }
        // 如果投注项来自赛事列表
        if(bet_obj.bet_source == "match_list") {
          // 比分玩法
          let hpid = _.get(item_obj, 'hps[0].hpid');
          // 全场比分,上半场比分,下半场比分
          if(['7','20','74'].includes(hpid)) {
            // 投注项类型
            let ot = _.get(item_obj,'hps[0].hl[0].ol[0].ot');
            if(ot && ot.includes(':')) {
              handicap_value = ot.replace(':', '-')
            } else if(ot && ot == 'Other') {
              // 显示其他
              handicap_value = this.$root.$t('list.other');
            }
          } else {
            // 获取盘口
            handicap_value = _.get(item_obj, 'hps[0].hl[0].hv','');
          }
        } else if(bet_obj.bet_source == "is_chat_room"){
          handicap_value = _.get(bet_obj, 'hv', '') ||_.get(bet_obj, 'on', '');
        }else{
          // 获取盘口
          handicap_value = _.get(item_obj, 'hps[0].hl[0].hv','');
        }
        // 获取赛事上字段不是Object类型的字段
        let omit_obj = _.omitBy(item, _.isObject);

        for(let [key, value] of Object.entries(omit_obj)){
          if(fields.includes(key)) {
            bet_omit_obj[key] = value;
          }
        }
        // 深度复制对象
        Object.assign(item_obj, {
          ...bet_omit_obj,
          msc: item.msc
        });

      } catch (error) {
        console.error('押注按钮触发错误:'+error);
        this.vx_set_error_data({
          site:'bet-betting_data_ctr--bat_click',
          error
        });
        isok = false;
      }
      if (isok) {
        obj.key = id;
        obj.bs = item_obj;
        // 取消玩法名称上的"-附加盘"字样
        let play_name = _.get(item_obj, 'hps[0].hpn') || _.get(bet_obj, 'hpn') || _.get(item_obj, 'hps[0].hl[0].ol.hpn');
        if(!_.isEmpty(play_name) && _.endsWith(play_name,`-${this.$root.$t('match_info.append')}`)) {
          play_name = play_name.replace(`-${this.$root.$t('match_info.append')}`,'');
        }
        // 球种id
        let sport_id = _.get(item_obj, 'csid');
        // 玩法id
        let play_id = bet_obj.bet_source  == 'is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.hpid'):_.get(item_obj, 'hps[0].hpid');
        // 主队比分
        let home_score = 0;
        // 客队比分
        let away_score = 0;
        // timerly_score_type:及时比分类型 timerly_home_score:主队及时比分 timerly_away_score:客队及时比分
        let timerly_score_type ='', timerly_home_score = '', timerly_away_score = '';
        // 投注项来源于赛事列表
        if(bet_obj.bet_source == 'match_list') {
          if(score_type) {
            // 主队比分
            home_score = _.get(item.score_obj,`${score_type}.home`) || '0';
            // 客队比分
            away_score = _.get(item.score_obj,`${score_type}.away`) || '0';
          }
          // sport_id在一下取值的含义 1:足球，2:篮球，3:棒球，8:乒乓球，9：排球
          // 当为对应的球种时对应玩法id存在对应数组对象中则是需要显示及时比分的
          if((sport_id == 1 && play_mapping.FOOTBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
            (sport_id == 2 && play_mapping.BASKETBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
            (sport_id == 3 && play_mapping.BASEBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
            (sport_id == 8 && play_mapping.TENNIS_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
            (sport_id == 9 && play_mapping.VOLLEYBALL_TIMERLY_SCORE_HPID.includes(play_id * 1))) {
            // 获取及时比分的类型(即为S几比分)
            timerly_score_type = play_mapping.SPORT_PLAY_TO_SCROE[sport_id][play_id];
            let msc_obj = _.get(item_obj, 'msc');
            // 若及时比分类型存在
            if(timerly_score_type) {
              // 并且及时比分类型只有一个(不包含其他及时比分不是如"S1,S2,S3"的形式)
              if(!timerly_score_type.includes(",")) {

                // 主队及时比分
                timerly_home_score =  _.get(item.score_obj,`${timerly_score_type}.home`);
                // 客队及时比分
                timerly_away_score =  _.get(item.score_obj,`${timerly_score_type}.away`);
              } else {
                
                // 及时比分类型只有多个如"S1,S2,S3"的形式，则转换成数组
                let _score_type_arr = timerly_score_type.split(",");
                // 通过球种id，玩法id，赛事阶段在对应的映射对象中获取其对应的及时比分类型
                timerly_score_type = _.get(play_mapping.SPORT_PLAY_TO_STAGE_SCROE,`${sport_id}.${play_id}.${item.mmp}`);

                // 及时比分类型存在
                if(_score_type_arr.includes(timerly_score_type)) {

                  // 获取主队及时比分
                  timerly_home_score = _.get(item.score_obj,`${timerly_score_type}.home`);
                  // 获取客队及时比分
                  timerly_away_score = _.get(item.score_obj,`${timerly_score_type}.away`);
                }
                // 足球而且15分钟玩法
                if (sport_id == 1 && [32, 33, 34,231,232,233].includes(play_id*1)) {
                  let hSpecial = _.get(bet_obj, 'hl_obj.hSpecial')
                  if (hSpecial) {
                    // 匹配球种玩法对应的比分
                    let hSpecial_score = _score_type_arr[hSpecial-1]
                    if(msc_obj instanceof Array && msc_obj.length>0) {
                      // “S1002|0:2”
                      let hSpecial_score_item = msc_obj.filter(item => item.includes(hSpecial_score))
                      if(hSpecial_score_item.length>0) {
                        let timerly_total = hSpecial_score_item[0].split('|')[1]
                        let timerly_total_ = timerly_total.split(':')
                        timerly_home_score = timerly_total_[0]
                        timerly_away_score = timerly_total_[1]
                      } else {
                        // 不展示比分
                        timerly_home_score = ''
                        timerly_away_score = ''
                      }
                    }
                  }
                }
              }
            }
          }
        } else if(['hot','recent', 'banner_hot'].includes(bet_obj.bet_source)){ // 热门推荐，近期关注
          // sport_id在一下取值的含义 1:足球，2:篮球，3:棒球，8:乒乓球，9：排球
          // 当为对应的球种时对应玩法id存在对应数组对象中则是需要显示及时比分的
          if((sport_id == 1 && play_mapping.FOOTBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
            (sport_id == 2 && play_mapping.BASKETBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
            (sport_id == 3 && play_mapping.BASEBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
            (sport_id == 8 && play_mapping.TENNIS_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
            (sport_id == 9 && play_mapping.VOLLEYBALL_TIMERLY_SCORE_HPID.includes(play_id * 1))) {
            // 获取及时比分的类型(即为S几比分)
            timerly_score_type = play_mapping.SPORT_PLAY_TO_SCROE[sport_id][play_id];
            // 若及时比分类型存在
            if(timerly_score_type) {
              // 获取主队及时比分
              timerly_home_score =  _.get(item.msc,`${timerly_score_type}.home`);
              // 获取客队及时比分
              timerly_away_score =  _.get(item.msc,`${timerly_score_type}.away`);
            }
          }
        } else {
          // 比分对象
          let msc_obj = _.get(item_obj, 'msc');
          if(msc_obj instanceof Array) {
            // 将数组对象转换成对应的Object类型的对象
            msc_obj = this.yabo_common.msc_array_obj(msc_obj);
          }
          if(_.get(msc_obj,`${score_type}`,false)) {
            // 主队比分
            home_score = _.get(msc_obj,`${score_type}.home`) || '0';
            // 客队比分
            away_score = _.get(msc_obj,`${score_type}.away`) || '0';
          }
          // sport_id在一下取值的含义 1:足球，2:篮球，3:棒球，8:乒乓球，9：排球
          // 当为对应的球种时对应玩法id存在对应数组对象中则是需要显示及时比分的
          if((sport_id == 1 && play_mapping.FOOTBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
           (sport_id == 2 && play_mapping.BASKETBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
           (sport_id == 3 && play_mapping.BASEBALL_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
           (sport_id == 8 && play_mapping.TENNIS_TIMERLY_SCORE_HPID.includes(play_id * 1)) ||
           (sport_id == 9 && play_mapping.VOLLEYBALL_TIMERLY_SCORE_HPID.includes(play_id * 1))) {
            // 获取及时比分的类型(即为S几比分)
            timerly_score_type = play_mapping.SPORT_PLAY_TO_SCROE[sport_id][play_id];
            // 并且及时比分类型只有一个(不包含其他及时比分不是如"S1,S2,S3"的形式)
            if(!timerly_score_type.includes(",")) {
              // 获取主队及时比分
              timerly_home_score =  _.get(msc_obj,`${timerly_score_type}.home`);
              // 获取客队及时比分
              timerly_away_score =  _.get(msc_obj,`${timerly_score_type}.away`);
            } else {
              // 及时比分类型只有多个如"S1,S2,S3"的形式，则转换成数组
              let _score_type_arr = timerly_score_type.split(",");
              // 通过球种id，玩法id，赛事阶段在对应的映射对象中获取其对应的及时比分类型
              timerly_score_type = _.get(play_mapping.SPORT_PLAY_TO_STAGE_SCROE,`${sport_id}.${play_id}.${item.mmp}`);
               // 及时比分类型存在
              if(_score_type_arr.includes(timerly_score_type)) {
                // 主队及时比分
                timerly_home_score = _.get(msc_obj,`${timerly_score_type}.home`);
                // 获取客队及时比分
                timerly_away_score = _.get(msc_obj,`${timerly_score_type}.away`);
               } else {
                  // 主队及时比分取主队比分
                  timerly_home_score = home_score;
                  // 客队及时比分取客队比分
                  timerly_away_score = away_score;
                }
                // 足球而且15分钟玩法
                if (sport_id == 1 && [32, 33, 34,231,232,233,370,371,372].includes(play_id*1)) {
                  // 玩法比分
                  // "S1001|0:2"
                  let hps = _.get(item_obj, 'hps[0].hps');
                  if(hps && hps.includes('|') && hps.includes(':')) {
                    let timerly_total = hps.split('|')[1]
                    let timerly_total_ = timerly_total.split(':')
                    timerly_home_score = timerly_total_[0]
                    timerly_away_score = timerly_total_[1]
                  } else {
                    // 不展示比分
                    timerly_home_score = ''
                    timerly_away_score = ''
                  }
                }
            }
          }
        }

        // 是否可以串关
        let is_serial = this.vx_is_bet_single? false: true
        // 盘口类型
        market_type = bet_obj.bet_source == 'is_chat_room' ?_.get(item_obj, 'hps[0].hl[0].ol.hmt'):_.get(item_obj, 'hps[0].hl[0].hmt');
        if(!match_type) {
          if(market_type == 0) {
            match_type = 2 // 滚球
          } else if(market_type == 1) {
            match_type = 1 // 赛前
          }
        }
        // 支持串关 true 否则 false
        serial_type = bet_obj.bet_source == 'is_chat_room' ? false:_.get(item_obj, 'hps[0].hids') == 1;
        if(_.get(item_obj, 'cds') == "C01"){
          // C01赛事不支持串关
          serial_type=0;
        }
        // cs对象封装
        obj.cs = {
          id, // 投注项id
          oid: bet_obj.bet_source == 'is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.oid'):_.get(item_obj, 'hps[0].hl[0].ol[0].oid'), // 投注项oid
          kid: bet_obj.bet_source == 'is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.hn'):_.get(item_obj, 'hps[0].hl[0].ol[0]._hn'), // 坑位id
          match_id: _.get(item_obj, 'mid'), // 赛事id
          handicap_id:bet_obj.bet_source == 'is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.hid'): _.get(item_obj, 'hps[0].hl[0].hid'), // 盘口id
          play_id, //玩法id
          sport_id, //球种
          match_status: _.get(item_obj, 'mhs'), //赛事状态
          handicap_value, // 盘口
          handicap_status: bet_obj.bet_source =='is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.hs'):_.get(item_obj, 'hps[0].hl[0].hs'), //盘口状态
          odds_value: bet_obj.bet_source == 'is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.ov'):_.get(item_obj, 'hps[0].hl[0].ol[0].ov'), //赔率
          active: bet_obj.bet_source =='is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.os'):_.get(item_obj, 'hps[0].hl[0].ol[0].os'), // 投注项状态
          play_name, //玩法名称
          odds_switch:bet_obj.bet_source =='is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.hsw'):_.get(item_obj, 'hps[0].hsw'), // 支持的盘口
          break_odds_value: bet_obj.bet_source == 'is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.obv'):_.get(item_obj, 'hps[0].hl[0].ol[0].obv'), //断档赔率
          target_side: bet_obj.bet_source == 'is_chat_room'?_.get(item_obj, 'hps[0].hl[0].ol.ots'):_.get(item_obj, 'hps[0].hl[0].ol[0].ots'), //T1,T2
          score_type, // 比分类型 S几 例如: S1,S2...
          home_id: _.get(item_obj, 'mhid'), // 主队id
          home: _.get(item_obj, 'mhn'), //主队
          home_score, // 主队得分
          away_id: _.get(item_obj, 'maid'), // 客队id
          away: _.get(item_obj, 'man'), //客队
          away_score, // 客队得分
          effect, // 是否有效
          full_bet: 0, //是否满额投注，1：是，0：否
          money: "", // 投注额
          win_money: "", // 可赢额
          min_money: "", // 最大值
          max_money: "", // 最小值
          source: bet_obj.bet_source, // 投注数据来源 match_list detail
          hv_ov_change: false, // 盘口值与赔率是否一起变化
          serial_type, // 串关类型
          is_serial,
          match_type, // 投注项所在赛事的模板id
          market_type, // 盘口类型
          operate_type: _.get(item_obj,'mprmc') || 'PA', // 操盘类型取值 "", MTS ,PA
          timerly_home_score,
          timerly_away_score,
          pending_order_status: -1, //是否能预约 0关闭 1开启 -1默认
          cds:_.get(item_obj, 'cds'),//数据源
        };
        // console.log(`match_id:${obj.cs.match_id}=====handicap_id:${obj.cs.handicap_id}=====play_id:${obj.cs.play_id}=====hn:${obj.bs.hps[0].hl[0].hn}=====id:${obj.cs.id}=====oid:${obj.cs.oid}`);
      }
      obj.isok = isok;
      if(!_.isUndefined(item_obj._index)) {
        // 赛事索引
        obj.cs.match_index = item_obj._index;
      }
      return obj;
    },
    /**
     * 
     * @description: 根据对象id删除押注项
     * @param {String} id 对象id
     * @return {undefined} undefined
     */
    bet_item_del(id) {
      // 如果未勾选合并，并且预约投注id存在。则重新选择投注项钱需要情况预约投注id
      if(this.vx_get_bet_appoint_obj && this.vx_get_bet_appoint_obj.bet_appoint_id == id) {
         // 置空预约投注项
        this.vx_set_bet_appoint_obj(null);
      }
      let temp = this.bat_find_index(id);
      if (temp != -1) {
        if(this.vx_is_bet_single) {
          // 删除对应的单关投注项对象
          // 删除对应的单关列表
          this.vx_bet_single_obj_remove_attr(id);
          this.vx_bet_single_list_remove (temp);
        } else {
          // 删除串关投注项
          this.vx_bet_obj_remove_attr(id);
          // 删除串关列表
        }
        this.vx_bet_list_remove(temp);
      }
    },
    /**
     * @description: 检查是否选中
     * @param {String} 对象id
     * @return {Boolean} 是否包含
     */
    bet_item_select(id) {
      if(this.vx_is_bet_single) {
         // 检查单关是否选中
        return this.vx_get_bet_single_list.includes(id);
      } else {
        // 检查串关是否选中
        return this.vx_get_bet_list.includes(id);
      }
    },

    /**
     * @description: 获取对象索引
     * @param {String} id 投注对象id
     * @return {Integer} 索引
     */
    bat_find_index(id) {
      let ret = -1;
      if(this.vx_is_bet_single) {
        // 单关所在投注项列表中的位置
        ret = this.vx_get_bet_single_list.findIndex(item => item == id);
      } else {
        // 串关所在投注项列表中的位置
        ret = this.vx_get_bet_list.findIndex(item => item == id);
      }
      return ret;
    },

    /**
     * @description: 单关当投注项id不在列表中时添加投注项
     * @param {object} obj  数据源   
     * @return {undefined}
     */
    add_obj_when_id_not_include_single(obj, match_id, hid) {
      let len = _.get(this,'vx_get_bet_single_list.length', 0);
      // 勾选了合并的话
      if(this.vx_get_is_bet_merge) {
        let index = -1;
        let id;
        // 单关列表已经存在选择的投注项
        if(len) {
          for(let i = 0; i < len; i++) {
            id = _.get(this,`vx_get_bet_single_list[${i}]`);
            let cs = _.get(this.vx_get_bet_single_obj,`${id}.cs`);
            // 查找同一场赛事的同一个盘口所在单关列表中的位置
            if(cs && cs.match_id ==  match_id && cs.handicap_id == hid) {
              index = i;
              break;
            }
          }
        }
        // 找到同一场赛事所在单关列表中的位置
        if(index > -1) {
          // 替换之前存在的单关投注项 整理一个新的投注项对象
          let new_obj = this.tidy_bet_item_info(obj);
          // 添加新的投注项对象到单关投注对象中
          this.vx_bet_single_obj_attr(new_obj);
          // 克隆一份单关投注列表
          let bet_list = _.clone(_.get(this,'vx_get_bet_single_list',[]));
          // 替换同一场赛事同一个盘口中选中的id
          bet_list.splice(index, 1, obj.id);
          // 重新设置单关投注列表
          this.vx_set_bet_single_list(bet_list);
          // 移除之前存在的投注项对象
          this.vx_bet_single_obj_remove_attr(id);
          if(this.vx_get_bet_appoint_obj && this.vx_get_bet_appoint_obj.bet_appoint_id == id) {
            // 置空预约投注项
            this.vx_set_bet_appoint_obj(null);
          }
        } else {
          // 添加到单关投注列表中
          this.bet_item_add_info(obj, true);
        }
      } else {
        // 没有勾选合并且之前有添加过的投注项，则先清除单关投注项后添加(等同于替换效果)
        if(len) {
          // 如果未勾选合并，并且预约投注id存在。则重新选择投注项钱需要情况预约投注id
          this.vx_set_bet_appoint_obj(null);
          //清空单关数据
          this.vx_bet_single_clear();
          //添加数据
          this.bet_item_add_info(obj, true);
        } else {
          // 直接添加投注项
          this.bet_item_add_info(obj);
        }
      }
      // 内嵌版的时候触发一下方法
      if(this.vx_main_menu_toggle == 'mini') {
        //展开单关投注框
        this.$root.$emit(this.emit_cmd.EMIT_OPEN_SINGLE_BET);
      }
    },
    /**
     * @description: 串关当投注项id不在列表中时且是合并添加投注项
     * @param {object} obj 数据源   
     * @return {undefined}
     */
    add_obj_when_id_not_includes_bet_list(obj, match_id, hid) {
      let len = _.get(this,'vx_get_bet_list.length', 0);
      let index=-1;
      // 串关列表已经存在选择的投注项
      if(len) {
        for(let i = 0 ; i < len; i++) {
          let id = _.get(this,`vx_get_bet_list[${i}]`);
          let cs = _.get(this.vx_get_bet_obj,`${id}.cs`);
          // 如果是串关统一场赛事的统一个盘口则记录在串关中所在位置
          if(cs && cs.match_id == match_id && cs.handicap_id == hid) {
            index = i;
            break;
          }
        }
      }
      if(index > -1) {
        //串关替换功能实现
        // 整理一个新的投注对象
        let new_obj = this.tidy_bet_item_info(obj);
        // 添加新的投注项对象到串关投注对象中
        this.vx_bet_obj_add_attr(new_obj);
        // 移除同一赛事统一盘口下选中的投注对象
        this.vx_bet_obj_remove_attr(_.get(this,`vx_get_bet_list[${index}]`));
        // 克隆一份串关投注项列表
        let bet_list = _.clone(g_bet_list);
        // 替换串关投注项列表中同一场赛事同一个盘口的那个投注项id
        bet_list.splice(index, 1, obj.id);
        // 设置最新的投注项列表
        this.vx_set_bet_list(bet_list);
      } else {
        // 添加投注项对象
        this.bet_item_add_info(obj, true);
      }
    },
    /**
     * @description: 串关当投注项id不在列表中时且投注项不存在添加投注项
     * @param {object} obj 数据源   
     * @return {undefined}
     */
    add_obj_when_id_not_includes_bet_list_not_effect(obj, effect_index) {
      //以下是串关替换功能的实现
      let new_obj = this.tidy_bet_item_info(obj);
      // 添加本次选中的投注项对象
      this.vx_bet_obj_add_attr(new_obj);
      // 移除之同一个赛事统一盘口下之前选中的投注项对象
      this.vx_bet_obj_remove_attr(_.get(this,`vx_get_bet_list[${effect_index}]`));
      // 克隆一份串关投注项列表对象
      let bet_list = _.clone(_.get(this,'vx_get_bet_list', []));
      // 替换同一个赛事统一盘口下的投注项id
      bet_list.splice(effect_index, 1, obj.id);
      // 重新设置串关投注项列表
      this.vx_set_bet_list(bet_list);
    },
     /**
     * @description: 最后一步删除投注项
     * @param {object} obj 数据源   
     * @return {undefined}
     */
    add_obj_when_last_step(obj) {
      this.bet_item_del(obj.id);
        let is_bet_single = this.vx_is_bet_single;
        //串关且没有投注项 且串关投注数据长度为0
        if(!is_bet_single && this.vx_get_bet_list.length == 0) {
          this.vx_set_layout_left_show('menu');
          // 移除了串关数据后发现单关里面也存在此投注项，且仅剩下一个那么移除数据
          if(this.vx_get_is_bet_merge) {
            //清空单关数据
            this.vx_bet_single_clear();
          }
          // 当前不为串关
          if(this.vx_cur_menu_type.type_name != 'bet') {
            this.$nextTick(() => {
              // 取消合并勾选
              this.vx_set_is_bet_merge(false);
              // 设置为单关投注
              this.vx_set_is_bet_single(true);
            });
          }

        }
    }
  }
}
