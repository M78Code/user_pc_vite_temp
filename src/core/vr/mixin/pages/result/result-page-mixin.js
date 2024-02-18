/*
 * @Description: 虚拟体育菜单下，赛马类比赛结束后需要展示一段时间的赛果页面
 */
// import odd_convert from "src/base-h5/vr/mixin/odds_conversion/odds_conversion.js";
import { compute_value_by_cur_odd_type } from "src/output/index.js";
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
// 引入接口封装文件
import { api_common } from "src/api/index.js";
export default {
  // mixins:[odd_convert],
  name:'result_page',
  data(){
    return {
      // 接口返回的play字段的内容
      plays: null,
      // 接口返回的rank字段的内容
      rank: null,
      // 赛果前面三项
      best_three_list: [],
      // 塞果中间二项
      best_middle_list: [],
      // 赛果最后二项
      last_three_list: [],
    }
  },
  props:{
    match_mid:String,
    current_match:Object
  },
  computed: {
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type}
  },
  created() {
    if(this.current_match.match_status == 2){
      // 加载赛果结果
      this.load_result(()=>{
        // 获取前三项的数据
        this.best_three(),
        // 获取中间二项的数据
        this.best_middle(),
        // 获取最后二项的数据
        this.last_three()

        // 虚拟泥地摩托车赛果只有6个结果,每行展示2个
        if(this.sub_menu_type == 1009 && this.plays && this.plays.length == 6) {
          let arr = lodash.chunk(this.plays, 2);
          this.best_three_list = arr[0]
          this.best_middle_list = arr[1]
          this.last_three_list = arr[2]
        }
      })
    }
  },
  methods: {
    // 赔率切换显示对应的赔率
    get_odds(item,play_obj){
      let val = item.ov, hsw = play_obj.hsw;
      let csid = lodash.get(item, '_csid');
      let hpid = lodash.get(item, '_hpid');
      let ov = compute_value_by_cur_odd_type(val, hpid, hsw, csid);
      return ov ? ov : '';
    },
    /**
     * 获取赛马最终结果
     */
    get_score_list(){
      let res = [];
      if(this.current_match && this.current_match.list && this.current_match.list.length){
        let last_win_obj = this.current_match.list[this.current_match.list.length - 1];
        if(last_win_obj){
          res.push(last_win_obj.ranking1);
          res.push(last_win_obj.ranking2);
          res.push(last_win_obj.ranking3);
        }
      }
      return res;
    },
    sort_plays(plays_){
      let new_plays = lodash.sortBy(plays_,(item)=>{
        return item.playId
      })
      this.plays = new_plays
    },
    /**
     *@description: 加载赛果页面
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    load_result(callback){
      // console.warn("虚拟体育赛果接口:get_virtual_matchResult");
      let params = {
        mid: this.match_mid
      }
      // 传值赛事id: mid
      api_common.get_virtual_matchResult(params).then( res => {
        let code = lodash.get(res,'code')
        if(code == 200){
          this.rank = lodash.get(res,'data.rank') || []
          this.plays = lodash.get(res,'data.plays')
          this.$emit('send_virtual_result_rank_data', this.rank)
          this.sort_plays(this.plays)
          if(callback){
            callback();
          }
        }else{
          this.rank = []
          this.plays = []
        }
      }).catch( err=> {
        console.error(err);
        this.rank = []
        this.plays = []
      })
    },

    // 赛果页面前三项
    best_three(){
      if(this.plays){
        this.best_three_list = this.plays.slice(0,3)
      }
    },

    // 赛果页面中间三项
    best_middle(){
      if(this.plays){
        this.best_middle_list = this.plays.slice(3,5)
      }
    },

    // 赛果页面最后2项
    last_three(){
        this.last_three_list = this.plays.slice(5,7)
    },

    // 对字段on:1/2加工为数组
    split_on(val){
      return val.split('/');
    }
  },
}