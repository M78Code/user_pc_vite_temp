<!--
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 右侧电竞有视频的赛事列表
-->
<template>
  <div class="c-esports-match-list">
    <div 
      class="match-item" 
      v-for="(match,index) in match_list" :key="index" 
      :class="{active:vx_detail_params.mid == match.mid}" 
      v-show="index < 5"
      @click="match_switch(match)"
    >
      <img class="team-logo home" :key="match.mid" v-img="[_.get(match,'mhlu'),_.get(match,'frmhn'),_.get(match,'csid')]" />
      <div class="team-name ellipsis home">{{match.mhn}}</div>
      <div class="score din-medium" >{{get_score_text(match)}}</div>
      <div class="team-name ellipsis away">{{match.man}}</div>
      <img class="team-logo away"  v-img="[_.get(match,'malu'),_.get(match,'frman'),_.get(match,'csid')]" />
    </div>
  </div>
</template>

<script>
import { api_match } from "src/public/api/index.js";
import details from "src/public/utils/detailsClass/details.js";
import MatchCtr from "src/public/utils/dataClassCtr/match_ctr.js";
import skt_data_esports_score from "src/public/mixins/websocket/data/skt_data_esports_score.js";
import { mapGetters, mapActions } from "vuex"
export default {
  name:'esportsMatchList',
  mixins: [skt_data_esports_score],
  data() {
    return {
      // 菜单数据
      menu_data: $menu.menu_data,
      // 赛事列表
      match_list:[],
      match_ctr: new MatchCtr( 'esport_match_list'),
      skt_mid: {}, // 需要订阅的赛事id
      skt_hpid: "", // 需要订阅的玩法
      socket_name: "esports_score_list"
    }
  },
  computed: {
    ...mapGetters({
      // 左侧详情参数
      vx_detail_params: "get_match_details_params",
      //获取当前菜单信息
      vx_cur_menu_type: "get_cur_menu_type",
      vx_layout_cur_page: "get_layout_cur_page",
    }),
  },
  watch:{
    // 监听球种变化
    'menu_data.cur_level3_menu':{
      handler(){
        let csid = $menu.get_match_list_api_params().csid 
        if(this.$utils.is_eports_csid(csid) && !['hot','play'].includes(this.vx_cur_menu_type.type_name)){
          this.get_match_list()
        }
      },
      immediate: true
    },
    // 监听滚球电竞 球种变化
    'menu_data.cur_level2_menu':{
      handler(){
        if(['hot','play'].includes(this.vx_cur_menu_type.type_name)){
          let csid = $menu.get_match_list_api_params().csid 
          if(this.$utils.is_eports_csid(csid)){
            this.get_match_list()
          }
        }
        
      },
      immediate: true
    }
  },
  created(){
    this.set_is_pause_video(this.vx_layout_cur_page.from != 'video')
    if(this.$route.name =='details'){
        if(this.$utils.is_eports_csid(+this.$route.params.csid)){
            this.get_match_list()
          }
    }
    //更新电竞右侧视频
    this.$root.$on(MITT_TYPES.GET_ESPORTS_VIDEO_LIST, this.get_match_list)
  },
  methods:{
    ...mapActions({
      set_is_pause_video:"set_is_pause_video"
    }),
    // 是否展示为比分判定中 
    get_score_text(match_info) {
      const { mmp } = match_info
      const home_score = _.get(match_info,'msc[S1].home')
      const away_score = _.get(match_info,'msc[S1].away')
      let score_text = `${home_score} - ${away_score}`
      // 电竞未开赛 展示为 第一局
      const mmp_state = mmp || 1
      // 当前局数不等于 比分总和加一，則提示比分判定中
      if (mmp_state != (Number(home_score) + Number(away_score) + 1)) {
        score_text = this.$root.$t('mmp.100.scoring')
      }
      return score_text
    },
    /**
     * @Description 获取赛事列表 
     * @param {undefined} undefined
    */
    get_match_list(){
      let params = {
        csid: $menu.get_match_list_api_params().csid || this.$route.params.csid
      }
      api_match.get_esports_match(params).then( res => {
        let code = _.get(res, "data.code");
        let data = _.get(res, "data.data") || []
        let timestap = _.get(res, "data.ts");
        if(code == 200 && data.length > 0){
          // 格式化比分
          data.forEach((item) => {
            let obj = {};
            for (let i in item.msc) {
              let format = item.msc[i].split("|");
              obj[format[0]] = {
                home: format[1].split(":")[0],
                away: format[1].split(":")[1],
              };
            }
            item.msc = obj;
          });
          this.match_ctr.set_list_obj(data, timestap);
          this.match_list = this.match_ctr.list;
          let match_c8 = null;
          let _skt_mid_obj = this.$utils.ws_c8_obj_format(this.match_ctr.list);
          this.match_ctr.list.map((item) => {
            match_c8 = _skt_mid_obj[item.mid];
            if(match_c8)
            {
              item.hps &&
              item.hps.map((item2) => {
                if (item2.hpid) {
                  match_c8.hpids.push(item2.hpid);
                }
              });
            }
          });
          this.skt_mid = _skt_mid_obj;
          this.SCMD_C8();
        }else{
          this.match_list = []
        }
        // 检测正在播放的视频是否在最新的列表中
        let find = false;
        // 获取返回的赛事列表信息
        let list_data = _.get(res, "data.data",[])
        for (let i = 0; i < list_data.length; i++) {
          // 匹配是否是正在播放的赛事
          if(this.vx_detail_params.mid && (this.vx_detail_params.mid == _.get(list_data,`[${i}].mid`))){
            find = true;
            break;
          }
        }
        // 当正在播放的视频不在最新的赛事列表时,自动切换赛事
        if(!find){
          let first_match = _.get(res, "data.data[0]",{mid:-1});
          details.on_switch_match('auto', first_match)
        }
      }).catch( err => {
        console.error(err);
        this.match_list = []
        details.on_switch_match('auto', {mid:-1})
      })
    },
    /**
     * @Description 赛事切换 
     * @param {undefined} undefined
    */
    match_switch(match){
      this.set_is_pause_video(false)
      // details.on_switch_match('auto', match)
      details.on_go_detail(match)
    }
  },
  beforeUnmount() {
    //更新电竞右侧视频
    this.$root.$off(MITT_TYPES.GET_ESPORTS_VIDEO_LIST, this.get_match_list)
    this.match_ctr.destroy();
  },
};
</script>

<style lang="scss" scoped>
.c-esports-match-list {
  border-radius: 0 0 6px 6px;
  .match-item {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 20px;
    cursor: pointer;
    &:first-child {
      border-top: none;
    }
    &.active {
      font-size: 13px;
    }
    .team-name {
      flex: 1;
      margin: 0 12px;
      &.away {
        text-align: right;
      }
    }
    .team-logo {
      width: 28px;
    }
    .score {
      font-size: 14px;
      min-width: 30px;
      text-align: center;
    }
  }
}
</style>