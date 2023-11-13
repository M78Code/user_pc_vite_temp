<!--
 * @Author: Amor
 * @Date: 2020-12-23 14:11
 * @Description: 虚拟体育 赛事列表 赛事头
-->
<template>
  <div
    :class="[
      'sticky-wrap virtual-tpl1',
      'match-status' + matchItem.mhs,
      header_highlight && 'header-highlight',
      matchItem.csid == 1001 && 'match-tpl0-bg',
      {'m_top': match_index !==0 }
    ]"
    :style="{'top':sticky_top ? sticky_top+'px' : '128px'}"
    v-if="matchItem._vshow_group"
  >
    <!-- 进行中 -->

    <div class="tr-match-head match-type row">
      <!-- 倒计时 批次 -->
      <div
        v-show="matchItem.mhs != 2"
        class="basic-width row justify-between items-center"
        :style="`width:${match_list_tpl_size.process_team_width}px !important; height:100%;`"
      >
      <!-- key不能去掉 赛事改变 倒计时组件重新加载 -->
        <virtual-match-proccess
          :match="matchItem"
          :stop_bet_callback="stop_bet_callback"
          :begin_callback="begin_callback"
          :end_callback="end_callback"
          :second60_callback="() => (header_highlight = true)"
          :key="matchItem.mid"
        />

      </div>
      <!-- 直播图标 -->
      <div v-if="matchItem.mhs == 2" colspan="5" class="basic-width text-left items-center">
        <div class="match-no-wrap row items-center yb-flex-nowrap">
          <div class="col-left">
            <img class="icon-stage-fold" src="~public/image/yabo/gif/virtual_match_stage.gif" alt=""/>
            <span>LIVE</span>
          </div>
          <!-- 轮数 -->
          <div class="match_no ellipsis-on" >{{ substrName(matchItem.no,matchItem.csid) }}</div>
        </div>
      </div>
      <!-- 玩法列 -->
      <!-- 1001	虚拟足球;1004	虚拟篮球;  不显示玩法 -->
      <!-- <template v-if=" !['1001','1004'].includes(matchItem.csid)"> -->
      <div class="play-col play-name col row">
        <template v-if=" get_version == 1 || !['1001','1004'].includes(matchItem.csid)">
          <template v-for="(item, index) in matchItem.hpsPns">
            <div
              v-if="matchItem.mhs != 2 && !(matchItem.csid =='1009' && index ==3)"
              class="col ellipsis"
              :class="[matchItem.csid =='1001' ? 'bet-col'+index : '',{'highlight-t':(matchItem.csid =='1001' && [3,4,5].includes(index))}]"
              :key="index"
              :style="get_bet_width(index)"
              v-tooltip="{content:matchItem.csid =='1009' && index ==2 ?   _.get(matchItem,'hpsPns.3.hpn','')+ '/' + item.hpn   : item.hpn,overflow:1}"
            >
              {{ matchItem.csid =='1009' && index ==2 ?   _.get(matchItem,'hpsPns.3.hpn','')+ '/' + item.hpn   : item.hpn  }}
            </div>
          </template>
        </template>
      </div>

      <!-- 视频按钮 -->
      <div :style="`width:${match_list_tpl_size.media_width-3}px !important;`">
        <div class="yb-flex-center full-height">
          <!--  1002-赛狗 1004-篮球 1011--赛马 摩托车--1010  泥地摩托车--1009 -->
          <virtual-match-media
            v-if="[1002,1011,1004,1010,1009].includes(Number(matchItem.csid)) || matchItem.mhs == 2"
            :match="matchItem"
            :match_index="match_index"
            :show_icons="['video']"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {  mapActions,mapGetters } from "vuex";

import time_format_mixin from "src/public/mixins/common/time_format";
import match_list_tpl_size from "src/public/utils/dataClassCtr/match_list_tpl_size.js"

export default {
  mixins: [time_format_mixin],

  components: {
    // 赛事阶段
    VirtualMatchProccess: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/public/components/match_list/virtual_match_proccess.vue"),
    // 列表视频icon
    virtualMatchMedia: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/public/components/match_list/virtual_match_media.vue"),
  },
  inject:['match_list_data'],
  props: {
    // 赛事索引
    match_index: Number,
    // 吸顶top
    sticky_top: Number|Object,
    // 赛事ID
    mid:String | Number
  },

  data() {
    // 当场赛事信息
    let matchItem = this.match_list_data.mid_obj['mid_'+this.mid] || {}
    return {
      matchItem,
      header_highlight: false,
      // 赛事模板宽度
      match_list_tpl_size:match_list_tpl_size['template'+matchItem.tpl_id] || {},
    };
  },
  computed: {
    ...mapGetters({
      //获取当前版本状态  // 1专业  2 新手
      get_version: "get_version",
    }),
  },
  created() {
    let remote_time = this.mx_get_remote_time();

    if (Number(this.matchItem.mgt) < remote_time) {
      this.set_cur_stage_mhs(2);
      //
    }
  },
  methods: {
    ...mapActions({
      vx_virtual_bet_obj_add: "virtual_bet_obj_add",//添加虚拟体育投注项对象
      set_vsport_params: "set_vsport_params",// 设置虚拟体育右侧
    }),
    /**
     * 获取投注项宽度
     */
    get_bet_width(index){
      let flex = 'none'
      if(index === 5){
        flex = 1
      }
      let bet_width  = this.match_list_tpl_size.bet_width
      let style = `width:${bet_width}px !important; flex:${flex};`
      if((this.matchItem.tpl_id == 1001 ) && this.$utils.is_iframe){
        if([0,3].includes(index)){
           bet_width = this.match_list_tpl_size.bet_width - 4
        }else{
           bet_width = this.match_list_tpl_size.bet_width + 2
        }
        style = `width:${bet_width}px !important; flex:none;`
      }
     return style
    },
    //滚球虚拟篮球去掉 滚球 赛前
    substrName(test,csid){
      if(this.vx_cur_menu_type.type_name =='play' && csid == '1004'){
        return test.substr(0,test.indexOf('-')-1)
      }else{
        return test
      }
    },

    // 最后 10 秒后停止投注
    stop_bet_callback() {
      this.set_cur_stage_mhs(1);
    },

    // 赛事开赛后
    begin_callback() {
      this.set_cur_stage_mhs(2);
    },


    /**
     * @Description:切换右侧赛事
     * @return {undefined} undefined
     */
    on_switch_match() {
      this.set_vsport_params({
        mid: this.matchItem.mid,
        csid: this.matchItem.csid,
      });
    },

    // 赛事结束后
    end_callback() {
      this.$root.$emit(this.emit_cmd.EMIT_FETCH_MATCH_LIST,true)

    },

    /**
     * @description 设置当前批次相关赛事的  mhs
     * @param  {number} mhs  要设置的 mhs 值
     * @return {undefined} undefined
     */
    set_cur_stage_mhs(mhs) {
      let batch_no = this.matchItem.batchNo;
      for (let match of this.match_list_data.match_list) {
        if (match.batchNo == batch_no) {
          let _mid = match.mid;
          this.match_list_data.set_match_mhs_status(_mid, mhs);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.virtual-tpl1:not(.match-status2){
  .tr-match-head {
    color: var(--qq--y0-text-color5_1) !important;
  }
}
.tr-match-head {
  position: relative;
  height: 100%;
  background: var(--qq--y0-bg-color2);
  &::after{
    content: '';
    position: absolute;
    bottom: -4px;
    height: 4px;
    width: 100%;
    background-color: var(--qq--virtual_theme-bg-common);

  }
  &::before{
    content: '';
    position: absolute;
    top: -4px;
    height: 4px;
    width: 100%;
    background-color: var(--qq--virtual_theme-bg-common);

  }

  .play-col {
    height: 100%;
    .col {
      text-align: center;
      font-size: 13px;
    }
  }
}
.ellipsis-on {
  text-overflow: ellipsis;
  white-space: nowrap;
}
.play-name{
  align-items: center;
  .ellipsis{
    text-align: center;
    vertical-align: middle;
  }
}

.yb-match-list{
  .sticky-wrap{
    transition: height .5s;
    &.match-status0{
      height: 24px;
    }
    &.match-status2{
      position: relative;
      z-index: 999;
      top: 0!important;
    }
  }
}
</style>
