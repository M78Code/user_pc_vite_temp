<!--
 * @Author: Amor
 * @Date: 2020-08-06 21:27:29
 * @Description: 赛事玩法模板7
-->

<template>
  <div class="c-match-item jingcai">
    <!-- 主盘 -->
    <div class="match-handicap-item">
      <!-- 比赛进程 -->
      <div class="process-col yb-flex-center">
        <!-- 比赛进程 -->
        <match-process v-if="is_mounted && match.api_update_time !=0" :match_props="{match, source: 'match_list'}" show_page="match-list" :rows="2" />
      </div>
      <!-- 赛事基础信息 -->
      <div class="basic-col" :style="`width:${match_list_tpl_size.team_width}px !important;`" @click.stop="on_go_detail">
        <div class="ellipsis-wrap">
          <div class="row no-wrap absolute-full">
            <div class="team-name home ellipsis allow-user-select" v-tooltip="{content:match.mhn,overflow:1}">{{match.mhn}}</div>
          </div>
        </div>

        <img class="team-logo" v-img="[(match.match_logo || {}).home_1_logo,(match.match_logo || {}).home_1_letter]" />

        <div class="score-wrap yb-flex-center">
          <!-- 滚球：比分 -->
          <template v-if="$utils.get_match_status(match.ms,[110]) == 1">
            <div :class="['onset-team',match.mat=='home' &&'active']" />

            <div class="score">{{match.home_score}}</div>
            <div class="separate">:</div>
            <div class="score">{{match.away_score}}</div>
            <div :class="['onset-team',match.mat=='away' &&'active']" />
          </template>
          <!-- 非滚球： VS 图片-->
          <template v-else>
            <div class="font-vs">VS</div>
          </template>
        </div>

        <img class="team-logo" v-img="[(match.match_logo || {}).away_1_logo,(match.match_logo || {}).away_1_letter]" />
        <div class="ellipsis-wrap">
          <div class="row no-wrap absolute-full">
            <div class="team-name away ellipsis allow-user-select" v-tooltip="{content:match.man,overflow:1}">{{match.man}}</div>
          </div>
        </div>
      </div>

      <!-- 让球 -->
      <div class="rangqiu">
        <div 
          class="bet-item-wrap" 
          :style="`width:${match_list_tpl_size.bet_width}px !important; height:35px !important;`"
        >
          0
        </div>
        <div 
          class="bet-item-wrap" 
          :style="`width:${match_list_tpl_size.bet_width}px !important; height:35px !important;`"
        >
          {{hv}}
        </div>
      </div>

      <!-- 赛事盘口投注项 -->
      <match-handicap
        :handicap_list="match.main_handicap_list"
        :match="match"
        :is_show_score="false"
      />
      <div
        @click.stop="on_go_detail"
        class="action-wrap column yb-flex-center cursor-pointer"
      >
        <div class="row1 yb-flex-center">
          <div
            class="yb-flex-center yb-hover-bg"
            @click.stop="collect"
            v-if="get_global_switch.collect_switch"
          >
            <i aria-hidden="true" class="icon-star q-icon c-icon" :class="(match.mf==1 || match.mf==true) && 'active'"></i>
            
          </div>
          <div class="sr-link-icon-w" v-tooltip="{content:$root.$t('common.analysis')}" v-if="$utils.is_show_sr_flg(match)" @click.stop='sr_click_handle(match)'>
            <i aria-hidden="true" class="icon-signal q-icon c-icon"></i>
          </div>
        </div>

        <div class="play-count-wrap row no-wrap">
          <span class="play-count">{{handicap_num}}</span>
          <span class="row" style="align-items:center;margin-left:2px">
            <div class="yb-icon-arrow"></div>
          </span>
        </div>
      </div>
      <!-- 视频按钮 -->
      <div class="media-col" >
        <match-media :match="match" />
      </div>
    </div>
  </div>
</template>

<script>
import match_item_mixin from "src/project/yabo/mixins/match_list/match_item_mixin_new_data.js";
import details from "src/public/utils/detailsClass/details.js";
import { mapGetters} from "vuex"

export default {
  name: "MatchItem",

  mixins: [match_item_mixin],
  inject:['match_list_data'],
  data(){
    return {
      // 让球数量
      hv:'',
      // 让球投注项
      hv_ol:{_hid:-1}
    }
  },
  computed:{
    ...mapGetters({
      //全局开关
       get_global_switch:'get_global_switch'
    }),
    handicap_num(){
        if(this.get_global_switch.handicap_num){
            return `+${ this.match.mc || 0}`
        }else{
          return  this.$root.$t('match_info.more')
        }
    }
  },
  watch:{
    'hv_ol._hid'(){
      this.set_hv()
    }
  },
  created(){
    this.hv_ol = this.match.main_handicap_list[0].ols[1]
  },
  methods:{
    /**
     * @Description 设置让球数量 
     * @param {undefined} undefined
    */
    set_hv(){
      let hl_obj = this.match_list_data.hl_obj['hid_'+this.hv_ol._hid] || {}
      this.hv = hl_obj.hv || -1
    },
    /**
     * @Description 赛事收藏 
     * @param {undefined} undefined
    */
    collect(){
      this.$root.$emit(this.emit_cmd.EMIT_MX_COLLECT_MATCH,this.match)
    },
    /**
     * 跳转至详情
     * @return {undefined} undefined
     */
    on_go_detail() {
      if(this.$utils.is_eports_csid(this.match.csid)){
        this.match.go_detail_type = 'no_switch'
      }
      details.on_go_detail(this.match);
    },
  }
};
</script>

<style lang="scss" scoped>
.basic-col {
  display: flex;
  align-items: center;
  cursor: pointer;
  .team-name {
    width: 100%;
    &.home {
      text-align: right;
      margin-right: 12px;
    }
    &.away {
      margin-left: 12px;
    }
  }
  .team-logo {
    width: 24px;
    max-height: 26px;
  }
  .score-wrap {
    width: 80px;
    margin: 0 8px;
    height: 24px;
    border-radius: 2px;
  }
}
.rangqiu {
  line-height: 35px;
  text-align: center;
}
.action-wrap {
  width: 60px;
  .play-count-wrap {
    margin-top: 5px;
  }
  .sr-link-icon-w {
    margin-right: 0px !important;
    margin-left: 10px;
  }
}
</style>
