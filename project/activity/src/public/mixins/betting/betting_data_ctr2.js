/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 押注功能数据处理操作(虚拟体育电子竞技和vr体育)
 */
export default {
  methods: {    
    /**
     * @description: 点击押注按钮操作
     * @param {Object}  obj
     * @return {undefined} undefined 
     */
    virtual_bat_click(obj) {
      // 有投注正在提交中进行提示
      if (this.vx_get_is_virtual_handle) {
        // 提示投注正在处理中请稍等...
        this.$root.$emit(
          this.emit_cmd.EMIT_SHOW_TOAST_CMD,
          this.$root.$t('bet.bet_submiting')
        );
        return;
      }
      // 获取虚拟体育投注项列表个数，默认为0
      let bet_count = _.get(this,'vx_get_virtual_bet_list.length',0);
      //查找里面是否有相同的赛事 如果有则替换该条记录,如果没有则增加该条记录
      let match_id; 
      // 当点击的是赛事类表投注项 
      if (obj.bet_source == 'match_list') {
        // 从mid_obj中获取赛事id
        match_id = obj.mid_obj.mid; 
      } else {  // 当点击的是非赛事类表投注项 
        // 从match_info中获取赛事id
        match_id = obj.match_info.mid;
      }
      
      // 如果是已下注状态，不让其再添加 正在处理中点击按钮触发完成方法
      if (bet_count == 1 && this.vx_get_is_virtual_handle) {
        // 触发单关点击确认按钮的方法
        this.$root.$emit(this.emit_cmd.EMIT_SINGLE_COMPLETE_HANDLE_CMD);
      } else if (this.vx_get_is_virtual_handle){    
         // 触发点击确认按钮的方法    
        this.$root.$emit(this.emit_cmd.EMIT_COMPLETE_HANDLE_CMD);        
      }
      // 关闭遮罩
      this.$root.$emit(this.emit_cmd.EMIT_CLOSE_MENU_LOADDING_CMD);
      /**
       * 投注项数量大于0 
       * is_esports_champion:是电竞冠军 或者 vx_get_bet_category：
       * 3为电竞并且投注类型为冠军 
       * vx_cur_esports_mode：当前电竞查询的模式 false单关模式
       */
      if( (bet_count > 0 && $menu.menu_data.is_esports_champion) || 
          (($menu.menu_data.is_esports ||  this.vx_get_bet_category == '3') && !this.vx_cur_esports_mode)) {
        //投注项id不在虚拟投注列表里面
        if (!_.includes(_.get(this,'vx_get_virtual_bet_list',[]), obj.id)) {
          // 虚拟列表中存在投注项时需要先移除然后添加
          if(_.get(this,'vx_get_virtual_bet_list.length',0)) {
            //清除虚拟投注数据
            this.vx_virtual_bet_clear();
            //增加投注项--首页使用
            this.virtual_bet_item_add(obj, true);
          } else {
            // 不存在时直接添加
            this.virtual_bet_item_add(obj);
          }  
          //打开单关内嵌
          this.$root.$emit(this.emit_cmd.EMIT_OPEN_SINGLE_BET);      
        } else if (_.includes(_.get(this,'vx_get_virtual_bet_list',[]), obj.id)) {
          // 已经存在了选中的投注项，再次点击的时候清除投注项
          this.vx_virtual_bet_clear();
        }        
      } else {          
          let effect = true; //投注项默认不在vx_get_virtual_bet_list中
          let effect_index = -1; //投注项在列表中的位置
          //虚拟投注对象和列表对象都不为空
          if(!_.isEmpty(this.vx_get_virtual_bet_obj) && !_.isEmpty(this.vx_get_virtual_bet_list)) {
            //投注列表长度
            let len = _.get(this,'vx_get_virtual_bet_list.length');
            for(let i = 0; i < len; i++) {
              let oid = _.get(this,`vx_get_virtual_bet_list[${i}]`, '');
              //有cs属性
              if(_.has(this.vx_get_virtual_bet_obj,`${oid}.cs`)) {
                let cs = _.get(this,`vx_get_virtual_bet_obj[${oid}].cs`,{})
                // 点击投注项赛事在投注列表中存在，获取所在赛事在赛事列表中的位置
                if(cs.match_id == match_id) {
                  effect = false; //投注项默认在vx_get_virtual_bet_list中
                  effect_index = i; 
                  break;
                }
              }
            }          
          }
          //投注项不在vx_get_virtual_bet_list中
          if (!_.includes(_.get(this,'vx_get_virtual_bet_list',[]), obj.id) && effect) {
            // 添加投注项对象到虚拟体育投注对象中
            this.virtual_bet_item_add(obj);
            if(_.get(this,'vx_get_virtual_bet_list.length',0) == 1) {
              //打开单关内嵌
              this.$root.$emit(this.emit_cmd.EMIT_OPEN_SINGLE_BET);
            }
          }else if (_.includes(_.get(this,'vx_get_virtual_bet_list',[]), obj.id)) { //投注项在vx_get_virtual_bet_list中
            // 删除指定投注项
            this.virtual_bet_item_del(obj.id);
            // 取消正在处理中的状态
            this.$root.$emit(this.emit_cmd.EMIT_SINGLE_CANCEL_HANDLE_CMD);
          }else if(_.get(this,'vx_get_virtual_bet_list.length',0) == 1 && !_.includes(_.get(this,'vx_get_virtual_bet_list',[]), obj.id) && !effect) {
            // 已经存在了选中的投注项，再次点击的时候清除投注项
            this.vx_virtual_bet_clear();
            // 添加投注项对象到虚拟体育投注对象中
            this.virtual_bet_item_add(obj, true, true);
            //打开单关内嵌
            this.$root.$emit(this.emit_cmd.EMIT_OPEN_SINGLE_BET);
          }else if (_.get(this,'vx_get_virtual_bet_list.length',0) > 1 && !_.includes(_.get(this,'vx_get_virtual_bet_list',[]), obj.id) && !effect) { //串关替换
            //整理投注项信息
            let new_obj = this.tidy_virtual_bet_item(obj);
            //赛事更新
            new_obj.cs.match_update = true;
            // 添加最新的投注对象到投注项对象中
            this.vx_virtual_bet_obj_add(new_obj);
            // 删除已经找到的投注项队对象
            this.vx_virtual_bet_obj_del(this.vx_get_virtual_bet_list[effect_index]);
            // 复制投注列表
            let bet_list = _.clone(this.vx_get_virtual_bet_list);
            // 替换对应位置的id
            bet_list.splice(effect_index, 1, obj.id);       
            // 设置virtual_bet_list列表数据
            this.vx_set_virtual_bet_list(bet_list);
          } else {
            // 删除指定投注项
            this.virtual_bet_item_del(obj.id);
          }
      }
      // 虚拟体育投注项数量大于1个时
      if(_.get(this,'vx_get_virtual_bet_list.length',0) > 1) {    
        // 检测是否可以串关  
        this.virtual_common.check_mix(this);
      }
    },
    /**
     * @description: 增加投注项--首页使用
     * @param {Object} bet_obj 押注对象
     * @return {Boolean} effect 是否有效
     */
    virtual_bet_item_add(bet_obj, effect = true, match_update = false) {
      // 菜单切换为展开状态
      if( this.vx_get_left_menu_toggle) {
        this.vx_set_layout_left_show('bet_list');
      }
      //整理押注对象
      let obj = this.tidy_virtual_bet_item(bet_obj, effect);      
      if(obj && obj.isok) {
         // 判断添加的注单是否已经到达上限
         if(_.get(this,'vx_get_virtual_bet_list.length', 0) == 10) {      
          this.$root.$emit(
            this.emit_cmd.EMIT_SHOW_TOAST_CMD,
            this.$root.$t("bet.bet_max_val_msg")
          ); //投注项数量已达上限
          return;
        }
        obj.cs.match_update = match_update;
        let id = _.get(bet_obj, 'id');
        // 添加投注项对象
        this.vx_virtual_bet_obj_add(obj);
        // 添加id到投注项列表中
        this.vx_virtual_bet_list_push(id);
      }      
    },
    /**
     * @description: 整理押注对象
     * @param {Object} bet_obj 押注对象
     * @return {Boolean} effect 是否有效
     */
    tidy_virtual_bet_item(bet_obj, effect=true) {
      let isok = true,
        item,
        // 要构造的投注项对象
        obj = {"key":"", "bs":{}, "cs":{}},
        // 投注项id           
        id = _.get(bet_obj, 'id'),
        // 盘口值 
        handicap_value = '',
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
         teams: 队伍(为数组第一个为主队，第二个为客队) 
         batchNo: 批次号
         cds: 数据来源
        */
        fields =  ["csid","mid","tid","msc","tn","no","mmp","tlev","ms","mhid","mhn","maid","man","mgt","mcg","mhs", "teams", "batchNo","ispo","cds"],
        /**
          hps_fields 玩法层字段含义说明
          hpid: 玩法id 
          hpn: 玩法名称 
          hsw:支持的盘口(取值1,2,3,4,5,6) 
          title: 标题 
          hl: 盘口对象  
          hps: 玩法对象
         */
        hps_fields = ["hpid","hpn","hsw","title","hl", "hps"], 
        /**
         * hl_fields 盘口层字段含义说明
         * hid: 盘口id 
         * hmt: 盘口类型(1:赛前盘 0:滚球) 
         * hv: 盘口值 
         * hn: 坑位值 
         * ol: 投注项数组对象 
         * hipo:值为0不支持串关 为1支持串关
         */
        hl_fields = ["hid","hmt","hs","hv","hn","ol", "hipo"], 
        bet_omit_obj = {}, match_type, serial_type;

      if(id =="" || id == undefined) {
        isok = false;
        obj.isok = isok;
        return obj;
      }
      // 深度复制对象
      let item_obj = {
        hps: [{}]
      };
      let type_name = this.vx_cur_menu_type.type_name;
      try {
        // 如果来源是赛事列表:match_list,热门推荐:hot,近期关注:recent
        if (['match_list', 'hot' ,'recent', 'banner_hot'].includes(bet_obj.bet_source)) {
          let mid = _.get(bet_obj, 'bet_ids.mid'), 
              hid = _.get(bet_obj, 'bet_ids.hid'), 
              oid = _.get(bet_obj, 'bet_ids.oid');
          // 投注项所在的赛事对象
          let mid_obj = _.get(bet_obj, `mid_obj.${mid}`) || _.get(bet_obj, 'mid_obj');
          // 投注项所在的盘口对象
          let hl_obj = _.get(bet_obj, `hl_obj.${hid}`) || _.get(bet_obj, 'hl_obj');
          // 所选投注项对象
          let ol_obj = _.get(bet_obj, `ol_obj.${oid}`) || _.get(bet_obj, 'ol_obj');  
          item = mid_obj;      
          if(['hot','recent', 'banner_hot'].includes(bet_obj.bet_source)) {            
            item_obj.hps[0] = {
              // 玩法id
              hpid: _.get(mid_obj,'hps[0].hpid'),
              // 玩法名称
              hpn: _.get(mid_obj,'hps[0].hpn'),
              // 玩法支持的盘口
              hsw: _.get(mid_obj,'hps[0].hsw')
            }
          } else {                   
            item_obj.hps[0] = {
              // 玩法id
              hpid: _.get(hl_obj,'_play.hpid'),
              // 玩法名称
              hpn: _.get(hl_obj, '_play.hpn'),
              // 玩法支持的盘口
              hsw: _.get(hl_obj, '_play.hsw')
            };
          }          
          if(_.isEmpty(hl_obj) || _.isEmpty(ol_obj)) {
            isok = false;
            obj.isok = isok;
            return obj;
          }
          // 盘口对象获取
          item_obj.hps[0].hl = _.cloneDeep([hl_obj]);
          // 整理盘口对象，删除不需要的字段
          for(let key of Object.keys(_.get(item_obj,'hps[0].hl[0]'))) {
            if(!hl_fields.includes(key)) {
              delete item_obj.hps[0].hl[0][key];
            }
          }
          // 投注项数据
          item_obj.hps[0].hl[0].ol = _.cloneDeep([ol_obj]);   
          // 获取盘口值
          handicap_value = _.get(item_obj, 'hps[0].hl[0].hv');  
        } else if(bet_obj.bet_source == 'match_details') {//来源赛事详情
          let indexs = _.get(bet_obj, 'bet_path');
          item = _.get(bet_obj, 'match_info');
          item_obj.hps[0] = _.cloneDeep(item.hps[indexs.hps_index]);
          item_obj.hps[0].hl = _.cloneDeep([item.hps[indexs.hps_index].hl[indexs.hl_index]]);          
          item_obj.hps[0].hl[0].ol = _.cloneDeep([item.hps[indexs.hps_index].hl[indexs.hl_index].ol[indexs.ol_index]]);

          for(let key of Object.keys(item_obj.hps[0])) {
            if(!hps_fields.includes(key)) {
              delete item_obj.hps[0][key];
            }
          }
          for(let key of Object.keys(item_obj.hps[0].hl[0])) {
            if(!hl_fields.includes(key)) {
              delete item_obj.hps[0].hl[0][key];
            }
          }       
        }
        // 是否支持串关,0:不支持串关, 1:支持串关 默认为1
        serial_type = _.get(item_obj, 'hps[0].hl[0].hipo', 1); 
        if(_.get(item_obj, 'cds') == "C01"){
          // C01赛事不支持串关
          serial_type=0;
        }
        if($menu.menu_data.is_esports && serial_type == 0 && _.get(this,'vx_get_virtual_bet_list.length',0) >= 1) { 
          this.$root.$emit(
            this.emit_cmd.EMIT_SHOW_TOAST_CMD,
            this.$root.$t("bet.bet_no_support")  //盘口不支持串关
          );
          return;
        }
        // 获取盘口
        handicap_value = _.get(item_obj, 'hps[0].hl[0].hv'); 
        let omit_obj = _.omitBy(item, _.isObject); 
        for(let [key, value] of Object.entries(omit_obj)){
          if(fields.includes(key)) {
            bet_omit_obj[key] = value;
          }
        }
        // 浅拷贝      
        Object.assign(item_obj, {         
          ...bet_omit_obj,
          msc: item.msc,
          teams: item.teams || []
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
        let play_name = _.get(item_obj, 'hps[0].hpn');
        if(!_.isEmpty(play_name) && _.endsWith(play_name,`-${this.$root.$t('match_info.append')}`)) {
          play_name = play_name.replace(`-${this.$root.$t('match_info.append')}`,'');
        }
        // 球种id
        let sport_id = _.get(item_obj, 'csid');
        // 玩法id
        let play_id = _.get(item_obj, 'hps[0].hpid'); 
        let home = '', away = '';        
        // 当为电竞赛事 或者 在现场滚球盘并且是冠军
        if ($menu.menu_data.is_esports || (type_name == 'play' && this.vx_get_bet_category == '3')) {
          // 虚拟早盘赛事
          match_type = 5;
          //客队  
          home = _.get(item_obj, 'mhn',''); 
          //主队      
          away = _.get(item_obj, 'man','');              
        } else {
          // 虚拟早盘赛事
          match_type = 4; 
          //主队
          home = _.get(item_obj, 'teams[0]');
          //客队 
          away = _.get(item_obj, 'teams[1]'); 
        }
        // cs对象封装
        obj.cs = {
          id, // 投注项id
          oid: _.get(item_obj, 'hps[0].hl[0].ol[0].oid'), // 投注项oid
          kid: _.get(item_obj, 'hps[0].hl[0].ol[0]._hn'),  // 坑位id
          match_id: _.get(item_obj, 'mid'), // 赛事id
          handicap_id: _.get(item_obj, 'hps[0].hl[0].hid'), // 盘口id
          play_id, //玩法id
          sport_id, //球种
          match_status: _.get(item_obj, 'mhs'), //赛事状态
          handicap_value, // 盘口         
          handicap_status: _.get(item_obj, 'hps[0].hl[0].hs'), //盘口状态 
          odds_value: _.get(item_obj, 'hps[0].hl[0].ol[0].ov'), //赔率
          active: _.get(item_obj, 'hps[0].hl[0].ol[0].os'), // 投注项状态
          play_name, //玩法名称
          odds_switch: _.get(item_obj, 'hps[0].hsw'),
          break_odds_value: _.get(item_obj, 'hps[0].hl[0].ol[0].obv'), //断档赔率
          target_side: _.get(item_obj, 'hps[0].hl[0].ol[0].ots'), //T1,T2         
          home, //主队
          away, //客队
          effect, // 是否有效
          full_bet: 0, //是否满额投注，1：是，0：否
          money: "", // 投注额
          win_money: "", // 可赢额
          min_money: "", // 最大值
          max_money: "", // 最小值
          source: bet_obj.bet_source,
          hv_ov_change: false, // 盘口值与赔率是否一起变化          
          match_type, // 投注项所在赛事的类型 例如:赛前，滚球，冠军
          is_serial: true,
          market_type: _.get(item_obj, 'hps[0].hl[0].hmt'), // 盘口类型
          match_index: parseInt(_.get(item_obj, 'hps[0].hl[0].ol[0].ot',0))-1,
          cds:_.get(item_obj, 'cds'),//数据源
        };
        // 如果是电竞赛事
        if($menu.menu_data.is_esports|| (type_name == 'play' && this.vx_get_bet_category == '3')) {          
          // 扩展串关类型
          Object.assign(obj.cs, {serial_type});
        } 
        /* console.log(`match_id:${obj.cs.match_id}=====handicap_id:${obj.cs.handicap_id}=====play_id:${obj.cs.play_id}=====hn:${obj.bs.hps[0].hl[0].hn}=====id:${obj.cs.id}=====oid:${obj.cs.oid}`);      */
      }
      obj.isok = isok;
      if(!_.isUndefined(item_obj._index)) {
        // 赛事索引
        obj.cs.match_index = item_obj._index;
      }   
      // console.log(`======tidy_virtual_bet_item=========obj:${JSON.stringify(obj)}`); 
      return obj;
    },
    /**
     * 根据对象id删除押注项
     * @description: 删除投注项 
     * @param {String} id 对象id
     * @return {undefined} undefined 
     */
    virtual_bet_item_del(id) {
      let temp = -1;
      temp = this.virtual_bat_find_index(id);
      if (temp != -1) {
        // 删除对应的投注项对象
        this.vx_virtual_bet_obj_del(id);
        // 删除对应的列表 
        this.vx_virtual_bet_list_del (temp);
      }
    },
    /**
     * @description: 检查是否选中
     * @param {String} 对象id
     * @return {Boolean} 
     */
    virtual_bet_item_select(id) {
      // 检查是否存在投注列表中
      return this.vx_get_virtual_bet_list.includes(id);
    },

    /**
     * @description: 获取对象索引
     * @param {String} id 投注对象id 
     * @return {Integer} 索引
     */
    virtual_bat_find_index(id) {
      // 当前投注项在虚拟体育列表中的位置     
      return this.vx_get_virtual_bet_list.findIndex(item => item == id);
    }
  }
}