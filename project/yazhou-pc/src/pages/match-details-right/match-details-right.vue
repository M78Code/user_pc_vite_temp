<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 列表|详情 右侧
-->
<template>
   <!-- 详情右侧 -->
   <div class="right_details_wrap relative-position" :class="$route.params.video_size == 1 && 'full-screen'" v-show="$route.params.video_size != 1 || get_is_show_full_bet">
     <!-- 加载数据 -->
     <load-data
       v-show="show_load_status"
       :class="['details_data_load', {'details_loading': load_detail_statu == 'loading'}]"
       :state="load_detail_statu"
       :style="{'margin-top': headerHeight + 'px'}"
       :is_detail="true" />
     <div class="screen" :class="{'video-page':$route.name == 'video'}">
       <!-- 滚动区域 -->
       <v-scroll-area :observer_area="1" @on_scroll="$root.$emit('right_details_on_scroll',$event)" ref="v_scroll" page_type="right_details" class="right_details_wrap">
 
         <template v-slot:header>
           <!-- 全屏模式玩法集tab -->
           <div class="full-video-tab" v-if="$route.params.video_size == 1 && handicap_this && get_is_show_full_bet">
             <tab
               :list="handicap_this.category_list"
               tab_name_key="marketName"
               @onclick="switchTabs"
               :currentIndex="currentIndex"
               :is_drag="handicap_this.category_list.length > 4"
               is_show_line
             />
             <div class="tab-arraw" :class="handicap_this.panel_status =='hide' && 'hide'" @click="handicap_this.toggle_panel"></div>
           </div>
           <!-- 非全屏模式-->
           <div class="right_details_header" :class="{'no-bottom-border':$route.name != 'details',is_esports}" v-else>
             <!-- bet 体育竞猜 -->
             <div class="sports-guessing" v-if="$route.name == 'video'">
               <div>
                 <template v-if="$utils.is_iframe">
                   <sport-icon :sport_id="$route.params.csid" :is_esports="is_esports" size="18px" class="icon sport-img-new" status="2" />
                   <span class="home-vs-away">
                     <span>{{ match_infoData.mhn }}</span>
                     <span class="vs">v</span>
                     <span>{{ match_infoData.man }}</span>
                   </span>
                 </template>
                 <template v-else>
                   <span>{{$root.$t('common.sports_guessing')}}</span>
                 </template>
               </div>
               <!-- 刷新按钮 -->
               <div class="refresh">
                 <refresh :other_icon="true" icon_name="icon-balance_refresh" :loaded="refresh_loading" @click="refresh()" />
               </div>
             </div>
             <!-- 多媒体控制头 -->
             <video-ctrl
               :match_info="match_infoData"
               :refresh_loading="refresh_loading"
               @refresh="refresh()"
               @setfoldStatus="setfoldStatus"
               v-if="$route.name != 'video' && !is_esports" />
             <!-- 电竞多媒体控制头 -->
             <video-ctrl-esports :match_info="match_infoData" v-if="$route.name != 'video' && is_esports" />
             <!-- 战队信息 start -->
             <match-info
               v-if="$route.name != 'video'"
               v-show="vx_get_is_fold_status  || is_esports"
               :screen="vx_cur_expand_layout"
               :match_info="match_infoData"
               :refresh_time="refresh_time"
               :background_img="background_img"
             />
             <!-- 精彩回放 -->
             <video-history-line
               v-if="show_video_replay && _.get(match_infoData,'cds')!='C01'"
               :match_info="match_infoData"
               :mid="mid"
               :mmp="+_.get(match_infoData,'mmp')"
               :matchTime="+_.get(match_infoData,'mst')" />
             <!-- 玩法tab -->
             <handicap-tabs-bar
               v-if="(layout_cur_page.cur!=='details' && !is_esports) ||route.name == 'video'"
               :handicap_this="handicap_this"
               :match_info="match_infoData"
               @get_mattch_details="get_mattch_details"
               @on_go_top="on_go_top"
               @change-loading-state="change_loading_state"
               whitchDetail="rightDetails"
             />
           </div>
         </template>
 
         <!-- 【列表】 ------------->
         <template v-if="(layout_cur_page.cur!=='details' && !is_esports) ||route.name == 'video'">
           <div class="cathectic-handicap" v-if="$route.params.video_size == '1' && vx_get_bet_single_list.length==1">
           </div>
           <!-- 盘口模板start -->
           <match-handicap
             :match_info="match_infoData"
             :category_list="category_list"
             :match_details="match_details"
             :plays_list="plays_list"
             :currentRound="round"
             :is_list="true"
             @set_handicap_this="set_handicap_this"
             :close_all_handicap="close_all_handicap"
             :handicap_state="handicap_state"
             pageType="right_details"
           />
           <!-- 盘口模板end -->
         </template>
 
         <!-- 电竞 有视频赛事列表 -->
         <esports-match-list v-if="is_esports &&route.name != 'video'" />
 
         <!-- 【详情信息】 ------------->
         <div v-if="show_more &&route.params.video_size != 1" class="detail_right_model">
           <!-- 聊天室 -->
           <chatroom v-if="show_chatroom" :chatroom_info.sync="chatroom_info" :chatroom_height="chatroom_height"/>
 
           <!-- 如果当前赛事盘口关闭，就给200px 上边距，用来展示 盘口关闭的提示图 -->
           <div class="wrap-total total" :class="($route.name !=='details' && load_detail_statu)" :style="{'margin-top': is_show_margin ? '200px' : '4px'}" v-if="show_wrap_total">
             <div class="w-sub-item">
               <div class="item-title">
                 <div class="panel-title"></div>
                 <!-- 统计 -->
                 <span>{{$root.$t('common.panel_total')}}</span>
               </div>
               <chart class="total_chart" :match_info="match_infoData" />
             </div>
           </div>
           <!-- 撑起盘口关闭高度的 -->
           <div :style="{'margin-top':(!is_show_margin || !(match_infoData.mcg == 1 && [1, 2, 3,4,6,5,7,9,10].includes(+_.get(match_infoData,'csid')))) && !is_esports && layout_cur_page.cur  !=='details'  ? '200px' : 'auto'}"></div>
           <!-- 热门推荐 -->
           <hot  v-if="get_global_switch.hot_recommend"/>
           <!-- 近期关注 -->
           <recents v-if="!is_esports && get_global_switch.recent_switch" />
         </div>
         <!--晒单列表-->
         <saidan-list
         v-if="is_display_saidai"
         :share_order_time.sync="share_order_time"
         @qingkong="is_display_saidai=false"
         />
 
       </v-scroll-area>
       <!-- 全屏投注区域 -->
       <div v-if="$route.params.video_size == '1' &&((!is_esports && vx_get_bet_single_list.length==1) || (is_esports && vx_get_virtual_bet_list.length==1))">
         <div class="big-cathectic-zone">
           <div class="cathectic-shade" v-if="bet_this && bet_this.bet_loadding">
             <div class="shade-fixed">
               <div class="loading-wrap">
                 <div :class="[vx_get_theme.includes('y0')?'img-loading-y0':'img-loading']"></div>
                 <div class="text-center loading-text flex items-end justify-center">
                   {{$root.$t('bet.bet_loading')}}
                 </div>
               </div>
             </div>
           </div>
           <!--组件头部-->
           <div class="bet-scorll-header">
             <q-separator class="bet-top-separator"></q-separator>
             <div class="bet-zone-head" @click.stop="toggle_handle">
               <div class="left">{{$root.$t('common.bets_single')}}</div>
               <div class="right">{{$root.$t('common.balance')}} <span class="balance">{{ (vx_get_user.balance || 0) | format_balance }}</span></div>
             </div>
           </div>
           <template v-if="is_esports">
             <esports-bet-single @set_scroll_this="set_scroll_this" />
           </template>
           <template v-else>
             <bet-single @set_scroll_this="set_scroll_this" />
           </template>
           <bet-scroll-footer :bet_this="bet_this"/>
         </div>
       </div>
     </div>
   </div>
 </template>
<script setup>
// import matchHandicap from "src/components/match-detail/match-handicap/match-handicap.vue";
// import {useRightDetails} from "./match-details-right-config"
import { useRoute } from "vue-router"
import {ref} from 'vue'
const route = useRoute()
import LoadData from 'project_path/src/components/load-data/load-data.vue'
import store from 'src/store-redux/index.js';
let state = store.getState();
   // 获取当前页路由信息
const layout_cur_page = ref(state.layoutReducer.layout_cur_page);
const {
  show_load_status,
} =useRightDetails({route})
</script>
 
 <style lang="scss" scoped>
@import "./index.scss";
 </style>
 