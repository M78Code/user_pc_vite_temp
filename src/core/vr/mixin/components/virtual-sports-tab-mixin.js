/*
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 虚拟体育中部期数+轮次tab(列表+详情共用)
 */
import { api_common } from "src/api/index.js";
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
export default {
  name: 'virtual_sports_tab',
  data(){
    return {
      // 默认显示虚拟体育分析按钮
      analyse:true,
      // 渲染的数据
      data_list:[],
    }
  },
  computed:{
    // ...mapGetters([
    //   'get_details_item',
    //   'get_uid',
    //   'get_tab_fix',
    //   "get_fewer",
    //   "get_current_league",
    //   "get_detail_data",
    //   'get_access_config',
    // ]),
    // ...mapGetters({
    //   matchid: "get_goto_detail_matchid",
    //   sub_menu_id: 'get_current_sub_menuid',
    //   sub_menu_type: 'get_curr_sub_menu_type',
    //   is_show_analyse: 'get_is_show_details_analyse'
    // }),
    get_details_item(){return VR_CTR.state.details_item  },
    get_uid(){return },
    get_tab_fix(){return },
    get_fewer(){return },
    get_current_league(){return VR_CTR.state.current_league},
    get_detail_data(){return VR_CTR.state.detail_data},
    get_access_config(){return {}},
    matchid(){return VR_CTR.state.goto_detail_matchid},
    sub_menu_id(){return VR_CTR.state.current_sub_menuid},
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type},
    is_show_analyse(){return VR_CTR.state.is_show_details_analyse},

    // 历史战绩：标准赛事详情页的时候不显示,只在虚拟体育详情显示历史战绩(其中篮球不显示历史战绩)
    anlyse_show(){
      return lodash.get(this.get_access_config, 'statisticsSwitch') && this.$route.name != 'virtual_sports' && this.get_detail_data.csid != 1004
    }
  },
  watch: {
    "batch"(){
      this.play_list()
    }
  },
  props:[
    "virtual_match_list",
    "batch", //赛马期
    "mid"
  ],
  created(){
    // 延时器
    this.timer1_ = null;
    this.timer_ = null;
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB, this.initEvent).off,
      useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB_BET, this.initEvent).off,
    ]
    this.initEvent();
    this.play_list()
    this.set_is_show_details_analyse(false)
  },
  methods:{
    // ...mapMutations([
    //   'set_details_item',
    //   'set_first_details_item',
    //   'set_fewer',
    //   'set_is_show_details_analyse'
    // ]),
    set_details_item(data){ return VR_CTR.state.details_item = data },
    set_first_details_item(data){},
    set_fewer(data){},
    set_is_show_details_analyse(data){},

    /**
     *@description: 虚拟体育分析按钮
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    analyse_btn() {
      this.analyse = !this.analyse
      this.set_is_show_details_analyse(!this.is_show_analyse)
    },
    change_btn(){
      // 设置vuex变量值
      if(this.get_fewer == 1 || this.get_fewer == 3){
        this.set_fewer(2)
      }else{
        this.set_fewer(1)
      }
    },
    // 单击玩法集
    selete_item(uId,e){
      // 点击的玩法是当前选中的玩法
      if(this.get_details_item == uId) return false;
      if(this.is_show_analyse){
        this.analyse = true
      }
      this.set_is_show_details_analyse(false)
      //实现动态效果
      try {
        let dom = this.$refs.reset_scroll_dom;
        if(!dom) return;

        let start_ = dom.scrollLeft;
        let end_ = e.target.offsetLeft + e.target.clientWidth/2 - dom.offsetWidth/2;
        if(start_ > end_ && end_ > 0){
          let s = start_;
          this.timer_ = setInterval(() => {
            dom.scrollLeft = s;
            s -= 7;
            if(s <= end_){
              clearInterval(this.timer_);
            }
          }, 18);
        }else if(start_ <= end_ && end_ > 0){
          let s = start_;
          this.timer_ = setInterval(() => {
            dom.scrollLeft = s;
            s += 7;
            if(s >= end_){
              clearInterval(this.timer_);
            }
          }, 18);
        }else if(end_ < 0){
          this.timer_ = setInterval(() => {
            dom.scrollLeft -= 7
            if(dom.scrollLeft <= 0){
              clearInterval(this.timer_);
            }
          }, 18);
        }
      } catch (error) {
        console.error(error)
      }

      this.set_details_item(uId);
      // 点击玩法对页面吸顶tab做高度处理
      useMittEmit(MITT_TYPES.EMIT_DETAILILS_TAB_CHANGED);
      // 虚拟体育切换玩法集,滚动条高度默认恢复为0
      this.$emit('virtual_play_height')
      if(this.get_fewer == 3){
        this.set_fewer(1)
      }
    },
    initEvent(){
      if(this.timer1_) { clearTimeout(this.timer1_) }
      this.timer1_ = setTimeout(() => {
        try{
          this.$refs && (this.$refs.reset_scroll_dom.scrollLeft = 0)
        }catch(e){
          console.error(e)
        }
      }, 400);
    },
    /**
     *@description: 调用玩法集的接口
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    play_list(){
      // 1.在足球页进入详情需要调用玩法集合接口
      // 2.在赛马页需要调用玩法集合接口
      if(![1001,1004].includes(this.sub_menu_type) || this.$route.name == 'virtual_sports_details'){
        let new_mid = ''
        if(this.batch){
          new_mid =  this.batch
        }else{
          new_mid = this.$route.query.mid || this.mid;
        }
        let params = { sportId: this.sub_menu_type,mid: new_mid};
        api_common.get_category_list(params).then(res =>{
          if(res.code == 200 && res.data){
            this.data_list = lodash.get(res, "data");
            let first_data_item = this.data_list[0];
            if(first_data_item){
              // 将玩法集第一个存入store，后续赛种/赛事期数跳转时做判断用
              this.set_first_details_item(first_data_item.id);
              this.set_details_item(first_data_item.id);
            }
          }
        })
      }
    }
  },
  unmounted() {
    this.emitters.map((x) => x())
    this.set_fewer(1);
    clearTimeout(this.timer1_)
    clearInterval(this.timer_);
  }
}