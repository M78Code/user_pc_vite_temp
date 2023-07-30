/*
 * @Description: 为赛事列表(专业版和新手版)提供逻辑方法，拆分组件复杂度
 */
import utils from "src/public/utils/utils.js";
export default{
  methods:{
    /**
     * @description:斯诺克7局显示处理
     * @param {Object} {mct局数 mmp赛事阶段 ms赛事状态}
     * @return {String}
     */
    covert_mct({ mct, mmp, ms }) {
      let result = '';
      if (this.is_match_playing(ms) && mmp == 0) {
        mct = "1";
      } else {
        mct = _.toString(mct);
      }

      let new_num = mct;
      if(this.get_lang == 'zh'){
        new_num = utils.numberToChinese(mct);
      }
      let game_count = this.$root.$t("mmp.7.x")
      let ext = {
        419: this.$root.$t("mmp.7.419"),
        420: this.$root.$t("mmp.7.420"),
        439: this.$root.$t("mmp.7.439"),
      };
      if(mmp == 445){
        result = this.$root.$t("mmp.7.445");
      }
      else{
        let game_count_des = game_count.replace('%s',new_num);
        result = game_count_des + (ext[mmp] || "");
      }
      return result;
    },
    /**
     * @description: mmp映射赛事阶段名，国际化语言
     * @param {Object} match 赛事
     */
    match_period_map(match, has_replace) {
      let {mmp,csid,ms} = match;
      let r = '';
      if([110].includes(+ms)){ // ms == 110: 代表 即将开赛
        r = this.$root.$t(`ms[${ms}]`);
        this.mmp_map_title = r;
        return r;
      }
      try{
        if(mmp == 0 && ms == 1){
          // 篮球
          if(csid == 2){
            mmp = 13;
          }
          // 棒球
          else if(csid == 3){
            mmp = 401;
          }
          // 美式足球6 水球16
          else if([6,16].includes(+csid)){
            mmp = 13;
          }
        }
        // 斯诺克7局显示处理
        if(csid == 7){
          r = this.mmp_map_title = this.covert_mct(match);
          return r;
        }
        let sport_mmp = this.$root.$t('mmp')[csid];
        if(sport_mmp){
          r = sport_mmp[mmp];
          // 如果是篮球的  小节玩法，则转成 上半场
          if([14,301].includes(+mmp) && has_replace && csid == 2){
            r = sport_mmp[1];
          }
        }
      }catch(e){console.error(e)}
      // 篮球3X3滚球时显示"全场"
      if(ms == 1 && csid == 2 && match.mle == 73){
        r = this.$root.$t('mmp.2.21');
      }

      this.mmp_map_title = r;
      return r;
    },
    /**
     * @description: 赛事进行中
     * 0未开始        1滚球阶段 2暂停 7延迟 10比赛中断 110即将开赛        3结束 4关闭 5取消 6比赛放弃 8未知 9延期
     */
    is_match_playing(ms){
      return [1,2,7,10,110].includes(+ms);
    },
    /**
     * @description: 点击球种前置处理 1. 一键折叠情况下 有联赛tid展开 2. 一键展开情况下 所有联赛tid折叠
     */
    before_ball_folding_handle() {
      const { csid } = this.match_of_list
      // 联赛tid折叠map
      let map_collapse = _.cloneDeep(this.get_collapse_map_match)
      // 球种csid折叠map
      let collapse_csid_map = _.cloneDeep(this.get_collapse_csid_map)
      // 当前操作赛种tid列表
      let cur_cid_arr = this.matchCtr.match_list_data_sources.filter(item => item.csid == csid)
      // 当前操作赛种已折叠联赛tid数量
      let collapse_len = 0

      for (let i = 0, len = cur_cid_arr.length; i < len; i++) {
        // 一键折叠情况下 有联赛tid展开
        if (collapse_csid_map[csid] && map_collapse[cur_cid_arr[i].tid] === 0) {
          // console.error('一键折叠情况下 有联赛tid展开');
          collapse_csid_map[csid] = false
          this.set_collapse_csid_map(collapse_csid_map)
          this.need_init_curr_csid_map = true
          break
        }
        // 一键展开情况下 所有联赛tid折叠
        else if (map_collapse[cur_cid_arr[i].tid] === 1){
          // console.error('一键展开情况下 所有联赛tid折叠');
          collapse_len++
        }
        // console.error('csid', csid);


      }
      this.changle_ball_icon_state(csid)
      // 若累加后的长度和当前赛种下联赛长度相等，则改变相应赛种map一键折叠状态
      if (collapse_csid_map.hasOwnProperty(csid) && !collapse_csid_map[csid] && collapse_len === cur_cid_arr.length) {
        collapse_csid_map[csid] = true
        this.set_collapse_csid_map(collapse_csid_map)
        this.need_init_curr_csid_map = true
      }
    },
    /**
     *点击一键收起或者展示时集中修改状态
     */
    changle_ball_icon_state(csid) {
      // 当前操作赛种tid列表
      let cur_cid_arr = this.matchCtr.match_list_data_sources.filter(item => item.csid == csid)
      // 赛事折叠状态集合
      let ball_current_csid_object = _.cloneDeep(this.get_ball_current_csid_object)
      // console.error(cur_cid_arr);
      for (let i = 0, len = cur_cid_arr.length; i < len; i++) {
        // console.error(cur_cid_arr[i].tid);
        // 如果首次进入直接点击一键收起
      if (Object.keys(ball_current_csid_object).length < 1 ) {
        // console.error('全部收起+1', csid);
        this.set_ball_current_csid_object([cur_cid_arr[i].csid, {[cur_cid_arr[i].tid]: 1}])
      } else {
        if (ball_current_csid_object[csid] == undefined) {
          // console.error('全部收起+4', csid);
          this.set_ball_current_csid_object([cur_cid_arr[i].csid, {[cur_cid_arr[i].tid]: 1}])
        } else  if (Object.keys(ball_current_csid_object[csid]).length > 0 && Object.values(ball_current_csid_object[csid]).filter(item => item == 0).length < 1) {
          // 全部赛事收起的
          // console.error('全部展开', csid);
          this.set_ball_current_csid_object([cur_cid_arr[i].csid, {[cur_cid_arr[i].tid]: 0}])
        } else if (Object.keys(ball_current_csid_object[csid]).length > 0 && Object.values(ball_current_csid_object[csid]).filter(item => item == 1).length < 1) {
          // 全部赛事展开的
          // console.error('全部收起+2', csid);
          this.set_ball_current_csid_object([cur_cid_arr[i].csid, {[cur_cid_arr[i].tid]: 1}])
        } else if (Object.keys(ball_current_csid_object[csid]).length > 0 && Object.values(ball_current_csid_object[csid]).filter(item => item == 0).length > 0) {
          // 又一个赛事是收起的
          // console.error('全部收起+3', csid);
          this.set_ball_current_csid_object([cur_cid_arr[i].csid, {[cur_cid_arr[i].tid]: 1}])
        }
      }

      }

    },
    /**
     * @description: 点击球种折叠
     */
    ball_folding_click(csid) {
      if(utils.is_time_limit(200)) {return}

      let collapse_csid_map = _.cloneDeep(this.get_collapse_csid_map)
      let collapse_map_match = _.cloneDeep(this.get_collapse_map_match)
      let conventional_ball_collapse = _.cloneDeep(this.get_conventional_ball_collapse)

      // 滚球全部
      if (this.get_sport_all_selected) {
        // console.error('滚球进入');
        this.before_ball_folding_handle()
      } else {
        // console.error('不是滚球');
        this.changle_ball_icon_state(csid)
      }

      // 更新相应赛种map一键折叠状态
      if (collapse_csid_map.hasOwnProperty(csid)) {
        // console.error('展示mixin');
        let number = conventional_ball_collapse[csid] ? 0 : 1
        collapse_csid_map[csid] = !collapse_csid_map[csid]
        this.set_conventional_ball_collapse([csid, {[csid]: number}])
      } else {
        // console.error('折叠mixin');
        collapse_csid_map[csid] = false
      }

      if(!this.get_sport_all_selected){
        let is_all_fold = false
        let arr_tid = []
        for(let i=0, match_list_len = this.matchCtr.match_list_data_sources.length; i < match_list_len; i++){
          if(arr_tid.indexOf(this.matchCtr.match_list_data_sources[i]['tid']) == -1){
            arr_tid.push(this.matchCtr.match_list_data_sources[i]['tid'])
          }
        }

        // 当前赛种联赛减少后，删除相应联赛折叠状态key
        let collapse_map_match_keys_arr = Object.keys(collapse_map_match)
        if (collapse_map_match_keys_arr.length > arr_tid.length) {
          console.error('联赛减少', collapse_map_match);
          collapse_map_match_keys_arr.forEach(item => {
            if (!arr_tid.includes(item)) {
              delete collapse_map_match[item]
            }
          })

          this.set_collapse_map_match(collapse_map_match)
        }

        // 如果查找到有 赛事折叠过了，点击则全部展开
        if(!_.isEmpty(this.get_collapse_map_match) && Object.keys(this.get_collapse_map_match).length == arr_tid.length){
          for(let item_value in this.get_collapse_map_match){
            if(this.get_collapse_map_match[item_value] == 0){
              is_all_fold = true
              break
            }
          }
          // 如果查找到有 赛事展开过了，点击则全部折叠
          if(is_all_fold){
            this.set_collapse_all_ball(true)
          }else{  // 如果没有查找到 赛事展开过，点击则全部展开
            this.set_collapse_all_ball(false)
          }
        }else{
          // 做兜底处理，初始化 get_collapse_all_ball 值为 true
          this.set_collapse_all_ball(true)
        }

        collapse_csid_map[csid] = this.get_collapse_all_ball
      } else {

      }

      // 如果当前是滚球的全部页面 并且 上次选中的球种id  和 当前的不一样，则重新初始化  get_collapse_all_ball 的值
      // if(this.get_sport_all_selected && this.match_of_list.csid != this.get_last_ball_csid){
      //   this.set_collapse_all_ball(!this.get_collapse_all_ball)
      //   if(!this.get_last_ball_csid){this.set_collapse_all_ball(true)}
      //   // 记录上一次选中的球种 id
      //   this.set_last_ball_csid(this.match_of_list.csid)
      //   // 如果之前有折叠过的话，则初始化为 false
      //
      //   if(this.get_collapse_map_match[this.match_of_list.tid]){
      //     this.set_collapse_all_ball(false)
      //   }
      // }else{
      //   this.set_last_ball_csid('')
      // }


      let cur_cid_arr = this.matchCtr.match_list_data_sources.filter(item => item.csid == this.match_of_list.csid)
      let co_map_match = _.cloneDeep(this.get_collapse_map_match);
      for(let j=0, cur_len = cur_cid_arr.length; j < cur_len; j++){
        let d_key = this.gen_collapse_key(cur_cid_arr[j])
        // 1 是全部折叠， 0 是全部展开
        if (!this.get_sport_all_selected) {
          co_map_match[d_key] = this.get_collapse_all_ball ? 1 : 0
        } else {
          // 在全部赛种中使用collapse_csid_map对象更新联赛折叠状态
          co_map_match[d_key] = !this.get_collapse_csid_map[csid] ? 1 : 0
        }
      }

      // 滚球全部中 需根据 前置处理中的标识状态 更新collapse_csid_map赛种折叠状态
      if (this.need_init_curr_csid_map) {
        collapse_csid_map[csid] = !collapse_csid_map[csid]
        this.need_init_curr_csid_map = false
      }
      this.set_collapse_map_match(co_map_match);
      this.set_collapse_csid_map(collapse_csid_map)
      this.set_collapse_all_ball(!this.get_collapse_all_ball);
      this.$emit('unfold_changed')
    },
    // 组装combination_metches_list_data传回来的数据(合并对象相同项tid/csid)
    groupBy(arr, property) {
      return arr.reduce((accumulator, currentValue) => {
      let key = currentValue[property];
          if (!accumulator[key]) {
        accumulator[key] = []
          }
      accumulator[key].push(currentValue)
      return accumulator
      }, {})
  },

    /**
     * @description: 处理球种赛事数据
     */
    combination_metches_list_data(data) {
      let new_obj = this.groupBy(data, 'csid')
      let object = {}
      let combination_object = {}
      let conventional_ball_collapse = {}
      if (this.get_sport_all_selected) {
        // 滚球全部
        for (let key in new_obj) {
          object[key] = {}
          Object.assign(conventional_ball_collapse, {[key]: 0})
          Object.assign(object[key], this.groupBy(new_obj[key], 'mid'))
          // console.error(this.groupBy(new_obj[key], 'mid'));
        }
        for (let key in object) {
          combination_object[key]= Object.values(object[key]).length
        }
        // console.error(object);
      } else {
        for (let key in new_obj) {
          Object.assign(object, this.groupBy(data, 'tid'))
          // console.error(this.groupBy(data, 'tid'))
        }
        combination_object[data[0].csid]= Object.values(object).length
      }

      // console.error(combination_object, conventional_ball_collapse);
      this.set_conventional_item_number(combination_object || {});
      this.set_conventional_ball_collapse(conventional_ball_collapse || {})
    }
  }
}
