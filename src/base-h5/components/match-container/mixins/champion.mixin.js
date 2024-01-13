 
 
import lodash from 'lodash'
import { api_common } from "src/api/index.js";
import UserCtr from 'src/core/user-config/user-ctr.js'
import {MatchDataWarehouse_H5_List_Common as MatchDataBaseH5,get_odds_active, MenuData } from "src/output/index.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt";
import { menu_type } from 'src/base-h5/mixin/menu.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchFold from 'src/core/match-fold'
import MatchCollect from 'src/core/match-collect'
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js" 
import { default_league_icon } from 'src/base-h5/core/utils/local-image'
import { get_server_file_path } from "src/core/file-path/file-path.js";


// i: 每个组件的 props 赛事下标， 来源 === 组件
// match_of_list: 每个组件的 props 赛事对象， 来源 === 组件
export default {
  data () {
    return {
      image_src: ''
    }
  },
  mounted() {
    this.init_league_src()
  },
  computed: {
    is_show () {
      let flag = true;
      if( lodash.get(this.match_of_list, 'hps')){
        flag = !this.match_of_list.hps.every(item => item.hs == 2)
      }
      return flag
    },
    /**
     * @description 联赛折叠状态
     */
    ball_seed_collapsed ()  {
      return !lodash.get(MatchFold.ball_seed_csid_fold_obj.value, `csid_${this.match_of_list.csid}`, true)
    },
    all_ball_seed_collapsed ()  {
      return MatchFold.all_csid_fold_status.value;
    },
    /**
     * @description 赛事显示/隐藏
     */
    collapsed() {
      const key = MatchFold.get_match_fold_key(this.match_of_list)
      const show_card = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_card`)
      return show_card
    },
    league_collect_state ()  {
      return MatchCollect.get_league_collect_state(this.match_of_list.tid)
    },
    /**
     * @description 赛事收藏
     */
    match_collect_state () {
      return MatchCollect.get_match_collect_state(this.match_of_list)
    },
    is_collect() {
      return Boolean(lodash.get(this.match_of_list, 'tf'))
    },
    // 是否最后一个
    is_last () {
      const complete_matchs = lodash.get(MatchMeta, 'complete_matchs', [])
      const length = lodash.get(complete_matchs, 'length', 0)
      return this.match_of_list.source_index === length - 1
    },
    // 下一场赛事数据
    next_match () {
      const match_mids = lodash.get( MatchMeta, 'match_mids', [])
      const length = lodash.get( match_mids, 'length', 0)
      if (length < 1) return { tid: '' }
      return match_mids[this.i + 1] ? MatchDataBaseH5.get_quick_mid_obj(match_mids[this.i + 1]) : { tid: '' }
    },
    // 是否显示底部圆角  冠军  id  有重复的  在通过 is_last 判断
    is_show_border_raduis () {
      return this.match_of_list?.tid !== this.next_match?.tid
    },
  },
  methods: {
    /**
     * @description: 设置 赛事收藏与否
     */
    async handle_match_collect () {
      const { mid,tid } = this.match_of_list
      const match_state = MatchCollect.get_match_collect_state(this.match_of_list)
      api_common.add_or_cancel_tournament({
        mid,
        cf: match_state ? 0 : 1,
        cuid: UserCtr.get_uid()
      }).then(res => {
        if (+res.code !== 200) return
      })
      // 收藏页手动处理数据
      MenuData.is_collect() && MatchMeta.set_collect_match(this.match_of_list, 2)
      MatchCollect.set_match_collect_state(this.match_of_list, !match_state)
    },
    /**
     * @description 全部联赛折叠
     */
    handle_all_ball_seed_fold () {
      MatchFold.handler_fold_all_matchs_csid()
    },
    /**
     * @description 球种折叠
     */
    handle_ball_seed_fold() {
      MatchFold.set_ball_seed_match_fold(this.match_of_list)
    },
    /**
     * @description 联赛折叠
     */
    handle_league_fold() {
      const { tid, csid } = this.match_of_list
      MatchFold.set_league_fold(this.match_of_list)
    },

    /**
     * @description 判断是否显示联赛标题
     * @param {Number} i 赛事处于列表中的下标
     * @returns {Boolean}
     */
    is_show_league(i) {
      let flag = false;
      // 当前赛事
      let curr = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i])
      if (!curr) {
        return false;
      }
      
      // 虚拟体育没有tid而是tnameCode
      let property_key = "tnameCode";
      if(!curr[property_key]) {
        property_key = "tid";
      }
      if (i == 0) {
        flag = true;
      } else {
        // 前一个赛事
        let prev = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i - 1])
        // 如果显示  赛事未开赛标题， 或者是  上一次和这一次tid 不一样  则显示联赛标题高度
        if (!prev) return
        if (curr[property_key] != prev[property_key]) {
          flag = true;
        }
      }
      
      return flag;
    },
    /**
     * 判断是否显示体育类型
     * @param {Object} match 赛事对象
     * @returns {Boolean}
     */
    get_sport_show(i) {
      const c = MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i])
      const p = i > 0 && MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[i - 1])
      if (!menu_type.value) {
        if (i > 0) {
          if (p && c) {
            return p.csid !== c.csid;
          }
        } else {
          return true;
        }
      } else if ([1, 2, 3, 4, 11, 12,100].includes(menu_type.value)) {
        if (i > 0) {
          if (p && c) {
            return p.csid !== c.csid;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    get_key_by_obg(obj) {
      let r = "";
      if(sessionStorage.getItem('wsl') != '9999') return r;
      if(obj.hid){
        r = `hid:${obj.hid}`;
      }
      return r;
    },
    /**
     * @description: 获取赔率
     * @param {Object} ol_item 投注项
     * @param {Object} hsw
     * @return {Undefined}
     */
    get_odds_value(ol_item,hsw) {
      let ov = ol_item.ov;hsw='1';  //冠军玩法只支持欧赔
      let r1 = compute_value_by_cur_odd_type(ov,ov._hpid, hsw );
      return r1 || 0;
    },

    /**
     * @description: 冠军投注,内嵌版走这里逻辑
     * @param {Object} match 赛事对象
     * @param {Object} hp 盘口级别对象
     * @param {Object} ol_item 赔率对象
     * @return {String}
     */
    item_click(match,hp,ol_item) {
      console.log(match,hp,ol_item)
      if (!ol_item.ov || ol_item.ov < 101000) return;   //对应没有赔率值或者欧赔小于101000
      let flag = get_odds_active(0, hp.hs, ol_item.os);
      if (flag == 1 || flag == 4) {   //开盘和锁盘可以点击弹起来
        const { match_data_type = 'h5_list' } = match
        const {oid,_hid,_hn,_mid } = ol_item
        let params = {
          oid, // 投注项id ol_obj
          _hid, // hl_obj 
          _hn,  // hn_obj
          _mid,  //赛事id mid_obj
        }
        let bet_type = 'guanjun_bet'
        // 电竞下的冠军属于 电竞 特例
        if(MenuData.is_esports()){
          bet_type = 'esports_bet'
        }
        let other = {
          is_detail: false,
          // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
          // 根据赛事纬度判断当前赛事属于 那种投注类型
          bet_type,
          // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
          device_type: 1,  
          // 数据仓库类型
          match_data_type: match_data_type
        }
        console.log('score-list.vue ',params)
        set_bet_obj_config(params,other)
      }
    },
    /**
     * @description: 冠军玩法联赛收藏与取消收藏
     * @param {Object} match 赛事
     * @return {String}
     */
    toggle_collect(match) {
      let item_ = i;

      let param = {
        match,
        index:item_,
        type:'tf',
        type2:true,
      };
      useMittEmit(MITT_TYPES.TOGGLE_COLLECT_LEAGUE,param);
    },
    /**
     * @description 初始化 联赛 图标
     */
    init_league_src () {
      this.image_src = get_server_file_path(this.match_of_list.lurl)
      console.log(this.image_src)
    },
    /**
     * @description 图片加载出错
     * @param {*} $ev 
     */
    league_icon_error ($ev) {
      $ev.target.src = default_league_icon
    }
  }
}



