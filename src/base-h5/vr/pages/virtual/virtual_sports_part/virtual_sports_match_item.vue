<!--
 * @Author: Cronus
 * @Date: 2021-01-05 21:06:30
 * @Description: 足球赛事项组件
-->

<template>
  <div class="match-item-wrap hairline-border" :class="{standard:standard_edition == 2}">
    <div class="test-line" v-if="show_debugger_line">
      {{match_item.batchNo +'-'+ match_item.mid}}
    </div>

    <div class="match-data-item row"
      :class="{
        standard:standard_edition == 2,
        'items-start':standard_edition == 2,
        'items-center':standard_edition == 1
      }">
      <!-- 赛事信息 -->
      <div class="row items-start team-w-container" @click="goto_details(match_item)" v-if="standard_edition == 2">
        <div class="team-wrapper" :class="{standard:standard_edition == 2}">
          <!-- 战队名称 -->
          <div class="team-title" :class="{over:[2,11].includes(+match_item.match_status)}">
            <img v-img="([lodash.get(match_item,'mhlu'), lodash.get(match_item,'frmhn')])" />
            <div class="ellipsis">{{match_item.teams ? match_item.teams[0] : ''}}</div>
          </div>
          <div class="team-title" :class="{over:[2,11].includes(+match_item.match_status)}">
            <img v-img="([lodash.get(match_item,'malu'), lodash.get(match_item,'frman')])" />
            <div class="ellipsis">
              {{match_item.teams ? match_item.teams[1] : ''}}
            </div>
          </div>

          <div
            v-if="false"
            class="match-play-count standard row justify-start items-center">
            <!-- 比赛时间 -->
            <div class="time-wrap" v-if="match_item.csid != 1004"
              :class="{whistle:[2,11].includes(+match_item.match_status)}"
              v-show="match_item.show_time > 0 || [2,11].includes(+match_item.match_status)" >
              <div class="time">
                {{match_item.show_time}}
              </div>
            </div>
            <!-- 固定60秒 -->
            <div v-if="match_item.csid == 1004 && match_item.mmp != 'PREGAME'" class="time-wrap icon-s-wrap"
              :class="{whistle:[2,11].includes(+match_item.match_status)}"
              v-show="match_item.match_status == 0 && !is_basketball_score">
              <div class="time">
                60
              </div>
            </div>
            <!-- live -->
            <div v-if="match_item.csid == 1004" class="live-icon-pre icon-s-wrap"
              v-show="match_item.match_status == 1 || is_basketball_score">
              live
            </div>
            <!-- 结束 -->
            <div v-if="match_item.csid == 1004" class="finally icon-s-wrap"
              v-show="match_item.match_status == 2">
              Fin.
            </div>
          </div>
        </div>
      </div>
      <!-- 玩法 -->
      <div class="row items-center shrink-0 justify-between m-c-container"
        :class="{standard:standard_edition == 2,simple:standard_edition == 1}"
      >
        <!-- 比分和视频icon -->
        <div class="score-wrap" v-if="false">
          <div class="score"
            v-if="match_item.mmp == 'INGAME' && (match_item.match_status > 0 || show_basketball_score)">
            {{match_item.home}}
          </div>
          <div class="score"
            v-if="match_item.mmp == 'INGAME' && (match_item.match_status > 0 || show_basketball_score)">
            {{match_item.away}}
          </div>
          <!-- 视频icon -->
          <div class="play-icon-wrapper yb-flex-center"
            v-if="standard_edition == 2 && match_item.mms > 0" @click="switch_match_handle(i,match_item)">
            play
            <span class="video-play-icon" :data_si="match_selected_i" :data_i="i"
              :class="get_play_btn_class(match_item,i)" />
          </div>
        </div>
        <div class="simple-time" v-if="false">
          <!-- 比赛时间 -->
          <div class="time-wrap" v-show="match_item.show_time > 0 || match_item.match_status == 2 || match_item.match_status == 11" :class="{whistle:match_item.match_status == 2 || match_item.match_status == 11}">
            <div class="time">{{match_item.show_time}}</div>
          </div>
        </div>
        <!--专业版-->
        <div class="profession" v-if="standard_edition == 2">
          <template v-if="get_hp_list(1).length">
            <img class="slide_icon" :class="{'animate-effect':standard_odd_status == 0,'animate-effect-r':standard_odd_status == 1}" v-if="standard_odd_status == 0" :src="get_theme.includes('y0')?arrows:arrows_default">
            <img class="slide_icon" :class="{'animate-effect':standard_odd_status == 0,'animate-effect-r':standard_odd_status == 1}" :src="get_theme.includes('y0')?arrows_reverse:arrows_default_balck" v-else>
          </template>
           <!-- 玩法数量 -->
           <div v-if="match_item.mc" class="play-count">
              {{lodash.get(get_access_config,'handicapNum') ? `${match_item.mc}+ >`: i18n_t('footer_menu.more')}}
            </div>

          <!--标准版赔率容器-->
          <div class="standard-odd-l-w" v-touch-pan.horizontal.prevent.mouse="odd_wrapper_pan"
            :class="{'status2':standard_odd_status == 1}" v-if="standard_edition == 2">
            <!--标准版-->
            <div class="standard-odd-list row">
              <div class="odd-column-w" :key="hp_i_i"
                v-for="(hp_i,hp_i_i) of get_hp_list(0)">
                <div class="odd-wrap-min" :class="`hp-${get_ol_length(hp_i,hp_i_i)}`"
                  :key="ol_item_i" v-for="(ol_item,ol_item_i) of get_ol_list(hp_i,hp_i_i)">
                  <odd-column-item
                    :placeholder="ol_item.placeholder"
                    :n_s="Number(standard_edition)"
                    :column_ceil="get_ol_length(hp_i)"
                    :odd_item_i="ol_item_i"
                    :match="match_item"
                    :odd_field="hp_i"
                    :hl_hs="get_hl_hs(hp_i)"
                    bet_type="vr_bet"
                    />
                </div>
              </div>
            </div>
            <!--标准版第二部分-->
            <div class="standard-odd-list row second" :class="{'status2':standard_odd_status == 1}" v-if="get_hp_list(1).length">
              <div class="odd-column-w" :key="hp_i_i"
                v-for="(hp_i,hp_i_i) of get_hp_list(1)">
                <div class="odd-wrap-min" :class="`hp-${get_ol_length(hp_i,hp_i_i)}`"
                  :key="ol_item_i" v-for="(ol_item,ol_item_i) of get_ol_list(hp_i,hp_i_i)">
                  <odd-column-item
                    :placeholder="ol_item.placeholder"
                    :n_s="Number(standard_edition)"
                    :column_ceil="get_ol_length(hp_i)"
                    :odd_item_i="ol_item_i"
                    :match="match_item"
                    :odd_field="hp_i"
                    :hl_hs="get_hl_hs(hp_i)"
                    bet_type="vr_bet"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 新手版 -->
        <div class="event-team" v-else-if="standard_edition == 1">
          <div class="name">
            <div class='left'>
              <span>
                {{match_item.teams ? match_item.teams[0] : ''}}
              </span>
              <!-- 1-足球 2-篮球 3-棒球 4-冰球 5-网球 6-美式足球 7-斯诺克 8-乒乓球 9-排球  10-羽毛球 -->
              <image-cache-load v-if="match_item?.mhlu?.length && !([5, 10, 7, 8].includes(Number(match_item.csid)))"
                :csid="+match_item.csid" :path="match_item.mhlu" type="home"></image-cache-load>
              <!-- <img v-if="match?.mhlu?.length" class="logo" v-img="([match_item.mhlu[0], match_item.frmhn[0], match_item.csid])" /> -->
            </div>
            <span class="vs">VS</span>
            <div class='right'>
              <image-cache-load v-if="match_item?.malu?.length && !([5, 10, 7, 8].includes(Number(match_item.csid)))"
                :csid="+match_item.csid" :path="match_item.malu" type="home"></image-cache-load>
              <span>
                {{match_item.teams ? match_item.teams[1] : ''}}
              </span>
            </div>
          </div>
        </div>
        <!--新手版-->
        <div v-if="standard_edition == 1" class="bet-item-wrap row border-radius4">
          <v-s-odd-item :ol_item="ol_item" :hl_item="get_hl_item(match_item)" @click.native="item_click4(match_item,ol_item)"
            :match_invalid="match_item.invalid" :match="match_item"
            v-for="(ol_item,o_i) of get_ol_list_f_match(match_item)" :key="o_i">
          </v-s-odd-item>
        </div>
        <div v-if="standard_edition == 1"
          class="match-play-count column justify-center items-center simple" @click="goto_details(match_item)">
          <div v-if="match_item.mc">{{match_item.mc}}+</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
import v_s_odd_item from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_odd_item.vue"
import v_s_match_timer from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_match_timer.vue"
import odd_column_item from "src/base-h5/components/match-container/template/app/components/odd-column-item.vue"
// import betting from 'project_path/mixins/betting/betting.js';
import virtual_sports_m_item_mixin from 'src/base-h5/vr/mixin/virtual_sports/virtual_sports_m_item_mixin.js'
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import ImageCacheLoad from "src/base-h5/components/match-list/components/public-cache-image.vue";

export default {
  // mixins:[betting,virtual_sports_m_item_mixin],
  mixins:[virtual_sports_m_item_mixin],
  props:{
    i:Number,
    match_item:Object,
    match_selected_i:Number,
    other_status:Number,
  },
  data(){
    return {
      curr_match_map_time:{},
      vsports:null,
      standard_odd_status:0,
      is_basketball_score:false,
      // arrows: "image/wwwassets/bw3/common/slide_icon_y0.svg",
      arrows: "/public/app-h5/image/common/slide_icon_y0.svg",
      // arrows_default: "image/wwwassets/bw3/common/slide_icon.svg",
      arrows_default: "/public/app-h5/image/common/slide_icon.svg",
      // arrows_reverse: "image/wwwassets/bw3/common/slide_icon_reverse_y0.svg",
      arrows_reverse: "/public/app-h5/image/common/slide_icon_reverse_y0.svg",
      // arrows_default_balck:"image/wwwassets/bw3/common/slide_icon_r.svg",
      arrows_default_balck:"/public/app-h5/image/common/slide_icon_r.svg",
      standard_edition  //新手版1    标准版  2
    }
  },
  created(){
  },
  mounted(){
    this.video_process_init_video();
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_VIDEO_PROCESS_DATA_GOT, this.video_process_init_video).off,
      useMittOn(MITT_TYPES.EMIT_PRE_COUNTING_EDN, this.pre_counting_end_handle).off,
      useMittOn(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS, this.xu_ni_ty_standard_odd_status).off,
    ]
  },
  methods:{
    // ...mapActions([
    //   // 设置玩法项默认选中
    //   "set_details_item",
    // ]),
    // ...mapMutations(['set_current_gotodetail_match','set_toast']),
    set_details_item(data){ VR_CTR.set_details_item(data)  },
    set_current_gotodetail_match(data){ return VR_CTR.set_current_gotodetail_match(data) },
    set_toast(){},
    /**
     * 篮球早盘倒计时结束显示列表比分
     */
    pre_counting_end_handle(){
      this.is_basketball_score = true;
    },
    /**
     * 获取hl的hs
     * @param {Number} hp_i
     * @return Undefined Undefined
     */
    get_hl_hs(hp_i){
      let hs = 0;
      if(hp_i && hp_i.hl && hp_i.hl[0]){
        hs = hp_i.hl[0].hs;
      }
      return hs;
    },
    /**
     * 获取ol的length
     * @param {Number} hp_i
     * @param {Number} hp_i_i
     * @return Undefined Undefined
     */
    get_ol_length(hp_i,hp_i_i){
      let ol_list = [];
      if(hp_i && hp_i.hl && hp_i.hl[0] && hp_i.hl[0].ol){
        ol_list = hp_i.hl[0].ol;
      }
      else{
        if([1,4].includes(+this.match_item.csid)){
          if(this.match_item.hps && this.match_item.hps[hp_i_i]){
            if(this.match_item.hps[hp_i_i].hpid == 1){
              return 3;
            }
          }
        }
      }
      return ol_list.length;
    },
    /**
     * 获取hp指定部分
     * @param {Number} type 0 第一部分; 1 第二部分
     * @return Undefined Undefined
     */
    get_hp_list(type){
      if(type == 0){
        let hps = [];
        if(this.match_item && this.match_item.hps){
          hps = this.match_item.hps.slice(0,3);
        }
        return hps;
      }
      else if(type == 1){
        let hps = [];
        if(this.match_item && this.match_item.hps && this.match_item.hps.length > 3){
          hps = this.match_item.hps.slice(3,6);
        }
        return hps;
      }
    },
    /**
     * 滑动赔率容器
     * @param {Number} type 0 第一部分; 1 第二部分
     * @return Undefined Undefined
     */
    odd_wrapper_pan({ direction,isFinal }){
      if (this.get_hp_list(1).length && !isFinal) {
        if(direction == "left"){
          this.standard_odd_status = 1;
        }
        else{
          this.standard_odd_status = 0;
        }
        this.$emit('odd_pan',this.standard_odd_status);
      }
    },
    /**
     * 获取播放按钮图标路径
     */
    get_play_btn_class(match,i){
      if(match.match_status == 1){
        if(this.match_selected_i == i){
          return 'img-playing';
        }
        else{
          return 'img-play';
        }
      }
      else{
        return 'img-disabled';
      }
    },
    /**
     * 切换赛事
     * @param {Number} i 赛事下标
     * @return {Undefined}
     */
    switch_match_handle(i,m){
      //虚拟篮球不允许切换
      if(m.match_status == 2 || this.get_curr_sub_menu_type == 1004) return;
      this.$emit('switch_match',i);
    },
    /**
     * 获取投注项
     * @param {Object} match 赛事
     * @return {Object}
     */
    get_hl_item(match){

      let hp_item = {}
      let hp_id_convert;
      //足球
      if(match.csid == 1001){
        if(this.footer_sub_menu_id == 1){      //独赢
          hp_id_convert = 20001
        }
        else if(this.footer_sub_menu_id == 4){  //让盘
          hp_id_convert = 20004
        }
        else if(this.footer_sub_menu_id == 2){   // 大小
          hp_id_convert = 20002
        }
        else if(this.footer_sub_menu_id == 114){  // 大小
          hp_id_convert = 20001   //角球独赢
        }
      }
      //篮球
      else if(match.csid == 1004){
        if(this.footer_sub_menu_id == 1){      //独赢
          hp_id_convert = 20043
        }
        else if(this.footer_sub_menu_id == 4){  //让盘
          hp_id_convert = 20045
        }
        else if(this.footer_sub_menu_id == 2){   // 大小
          hp_id_convert = 20044
        }
      }

      if(match.hps && match.hps.length){
        hp_item = match.hps.filter(hp => hp.hpid == hp_id_convert)[0];
      }
      return hp_item;
    },
    /**
     * 获取赔率列表
     * @param {Object} match 赛事
     * @return {Array}
     */
    get_ol_list(hp_item){
      let ol_list = [];
      if(hp_item && hp_item.hl && hp_item.hl.length){
        ol_list = hp_item.hl[0].ol;
      }
      return ol_list;
    },
    /**
     * 获取赔率列表
     * @param {Object} match 赛事
     * @return {Array}
     */
    get_ol_list_f_match(match){
      let ol_list = [];

      let hp_id_convert;
      //足球
      if(match.csid == 1001){
        ol_list = [
          {
            invalid:1
          },
          {
            invalid:1
          },
          {
            invalid:1
          }
        ];

        if(this.footer_sub_menu_id == 1){      //独赢
          hp_id_convert = 20001
        }
        else if(this.footer_sub_menu_id == 4){  //让盘
          hp_id_convert = 20004
        }
        else if(this.footer_sub_menu_id == 2){   // 大小
          hp_id_convert = 20002
        }
        else if(this.footer_sub_menu_id == 114){  // 大小
          hp_id_convert = null   //角球独赢
          ol_list = [
            {
              invalid:1
            },
            {
              invalid:1
            }
          ];
        }
      }
      //篮球
      else if(match.csid == 1004){
        ol_list = [
          {
            invalid:1
          },
          {
            invalid:1
          },
          {
            invalid:1
          }
        ];

        if(this.footer_sub_menu_id == 1){      //独赢
          hp_id_convert = 20043
        }
        else if(this.footer_sub_menu_id == 4){  //让分
          hp_id_convert = 20045
        }
        else if(this.footer_sub_menu_id == 2){   // 总分大小
          hp_id_convert = 20044
        }
        else if(this.footer_sub_menu_id == 114){  // 大小
          hp_id_convert = 20043
          // hp_id_convert = null   //角球独赢
          // ol_list = [
          //   {
          //     invalid:1
          //   },
          //   {
          //     invalid:1
          //   }
          // ];
        }

      }

      if(match.hps && match.hps.length && this.footer_sub_menu_id != 114){
        let hp_item = match.hps.filter(hp => hp.hpid == hp_id_convert)[0];
        if(hp_item && hp_item.hl && hp_item.hl.length){
          if(this.footer_sub_menu_id == 1){ //独赢
            let ol_l_list = hp_item.hl[0].ol;
            let m = ol_l_list.filter(ol_item => ol_item.ot == "1")[0];
            let he = ol_l_list.filter(ol_item => ol_item.ot == "X")[0];
            let a = ol_l_list.filter(ol_item => ol_item.ot == "2")[0];
            ol_list = [];
            if(m){
              ol_list.push(m);
            }
            if(he){
              ol_list.push(he);
            }
            if(a){
              ol_list.push(a);
            }
          }
          else{ //非独赢
            ol_list = hp_item.hl[0].ol;
          }
        }
      }
      return ol_list;
    },
    /**
     * 跳转至虚拟体育详情
     * @param {Object} match 赛事
     * @return {String}
     */
    goto_details(match) {
      let mid = match.mid;
      let copied = lodash.cloneDeep(match);
      this.set_current_gotodetail_match(copied);
      this.set_details_item(0);
      this.$router.push({
        name: 'virtual_sports_details',
        query: {
          mid: mid,
          i: this.id,
          home: this.$route.query.home ? this.$route.query.home : 'match'
        }
      })
    },
    xu_ni_ty_standard_odd_status(status) {
      this.standard_odd_status = status;
    },
    /**
     *@description 虚拟体育点击列表小方块投注
     *@param {Object} match_item 最外层赛事数据
     *@param {Object} ol_item 里层ol数据
     *@return {Undefined} undefined
     */
    item_click4(match_item,ol_item){
      //对应没有赔率值或者欧赔小于101000,或者虚拟体育赛事状态不为0
      if (match_item.mhs != 0 || !ol_item.ov || ol_item.ov < 101000 || match_item.match_status){
        return;
      }

      let hl_item = this.get_hl_item(match_item)
      if (!hl_item) return;
      ol_item.id_ = lodash.get(hl_item,'hl[0].hn') ?
        `${match_item.mid}_${hl_item.chpid || hl_item.hpid}_${ol_item.ot}_${hl_item.hl[0].hn}` : ol_item.oid;
      this.bet_click3(match_item, hl_item, ol_item);
    }
  },
  computed:{
    // ...mapGetters({
    //   footer_sub_menu_id:"get_footer_sub_menu_id",
    //   get_video_process_data:"get_video_process_data",
    //   get_newer_standard_edition:"get_newer_standard_edition",
    //   get_n_s_changed_loaded:"get_n_s_changed_loaded",
    //   get_curr_sub_menu_type:"get_curr_sub_menu_type",
    //   get_theme:'get_theme',
    //   get_access_config:'get_access_config',
    // }),
    footer_sub_menu_id(){return false;},
    get_video_process_data(){return VR_CTR.get_video_process_data();},
    get_n_s_changed_loaded(){return false;},
    get_curr_sub_menu_type(){ return VR_CTR.get_curr_sub_menu_type() },
    get_theme(){return 'theme01'},
    get_access_config(){return {handicapNum: true}},
    
    show_debugger_line(){
      let wsl = sessionStorage.getItem('wsl');
      if(wsl == '9999') return true;
      return false;
    },
    show_basketball_score(){
      let flag = false;
      if(this.is_basketball_score){
        flag = true;
      }
      if(this.get_curr_sub_menu_type == 1004){
        if(this.match_item.mmp == "INGAME"){
          flag = true;
        }
      }
      return flag;
    }
  },
  components:{
    "v-s-odd-item":v_s_odd_item,
    'v-s-match-timer':v_s_match_timer,
    "odd-column-item":odd_column_item,
    'image-cache-load': ImageCacheLoad,
  },
  watch:{
    other_status(n){
      this.standard_odd_status = n;
    },
  },
  destroyed(){
    if(this.vsports){
      this.vsports.destroy();
    }
    // this.$root.$off(this.emit_cmd.EMIT_VIDEO_PROCESS_DATA_GOT,this.video_process_init_video);
    // this.$root.$off(this.emit_cmd.EMIT_PRE_COUNTING_EDN,this.pre_counting_end_handle)
    // this.$root.$off(this.emit_cmd.EMIT_XU_NI_TY_STANDARD_ODD_STATUS,this.xu_ni_ty_standard_odd_status)
    this.emitters.map((x) => x());
  }
}
</script>

<style lang="scss" scoped>


@keyframes dir_remind_animate {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  60% {
    transform: translateX(-0.06rem);
    opacity: 1;
  }
  100% {
    transform: translateX(-0.09rem);
    opacity: 0;
  }
}

@keyframes dir_right_remind_animate {
  0% {
    transform: translateX(-0.09rem);
    opacity: 0;
  }
  60% {
    transform: translateX(-0.06rem);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 0;
  }
}

.match-item-wrap {
  width: 3.61rem;
  min-height: 0.9rem;
  margin: 0 auto 0.08rem auto;
  border-radius: 0.08rem;
  border-bottom: 1px solid #e9e9e9;
  position: relative;

  &.standard {
    height: 1.4rem;
  }

  .test-line {
    position: absolute;
    right: 0;
    top: 0;
    color: red;
    z-index: 2;
  }

  .team-title img {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }

  .match-data-item {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    font-size: 0.14rem;
    justify-content: space-between;
    flex-wrap: nowrap;

    &.standard {
      .team-w-container {
        padding-top: 0.21rem;
      }

      .team-title {
        height: 0.32rem;
        line-height: 0.3rem;
        margin-bottom: 0.02rem;

      }
    }

    .team-w-container {
      flex-grow: 1;
      width: 50%
    }

    .team-wrapper {
      flex: 1;
      font-weight: bold;

      &.standard {
        height: 1.07rem;

        .team-title {
          width: 1.4rem;
        }
      }
    }

    .score-w-container {
      height: 0.46rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 0.08rem;
      visibility: hidden;

      &.show-score {
        visibility: visible;
      }

      &.standard {
        height: 0.57rem;
        padding-top: 0.03rem;
        margin-left: 0.32rem;

        .score {
          height: 0.23rem;
        }
      }
    }

    .m-c-container {
      &.standard {
        width: 1.92rem;

        .score-wrap {
          padding-top: 0.13rem;
          width: 0.4rem;

          .score {
            height: 0.3rem;
            line-height: 0.3rem;
            margin-bottom: 0.02rem;
          }
        }
      }

      &.simple {
        display: block;
        .bet-item-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;
        }
      }

      .play-icon-wrapper {
        height: 0.3rem;
        min-width: 0.43rem;
      }

      .score-wrap {
        width: 0.15rem;
        text-align: center;

        .score {
          height: 0.23rem;
          line-height: 0.21rem;
          margin-bottom: 0.03rem;
        }
      }

      .simple-time {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 0.07rem;
        flex-direction: column;

        .time-wrap {
          margin: auto;
          margin-top: 0.08rem;
          margin-bottom: 0.05rem;
        }
      }
    }

    &.standard {
      height: 1.07rem;
    }

    .profession {
      padding-top: 0.13rem;
      // height: 1.21rem;
      overflow: hidden;
      position: relative;

      .play-count {
          font-size: 0.1rem;
          color: #AFB3C8;
          text-align: right;
          padding-right: 0.1rem;
      }

      .slide_icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);

        &.animate-effect {
          animation: dir_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
        }

        &.animate-effect-r {
          animation: dir_right_remind_animate cubic-bezier(0.49, 0.49, 0.61, 0.59) 1.4s infinite;
        }
      }

      .standard-odd-l-w {
        width: 1.92rem;
        flex-shrink: 0;
        display: flex;
        transition: all 0.2s;
        -webkit-transition: all 0.2s;

        &.status2 {
          transform: translateX(-1.84rem);
          -webkit-transform: translateX(-1.84rem);
        }
      }
    }

    .dir-standard {
      width: 100%;
      margin-top: 0.04rem;

      .block {
        width: 0.08rem;
        height: 0.02rem;
        border-radius: 0.01rem;

        &:last-child {
          margin-left: 0.04rem;
        }
      }
    }

    .standard-odd-list {
      width: 1.84rem;
      flex-shrink: 0;
      justify-content: space-between;

      &.second {
        margin-left: 0.08rem;
      }

      &.status2 {
        margin-left: 0;
      }

      .odd-wrap-min {
        width: 0.6rem;
        height: 0.32rem;
        overflow: hidden;
        border-radius: 0.02rem;
        margin-bottom: 0.02rem;
        background-color: var(--q-gb-bg-c-28);
        :deep(.odd-column-item .odd-title){
          color: #AFB3C8;
        }
        &.hp-2, &.hp-0 {
          height: 0.49rem;
        }

        &:last-child {
          margin-bottom: 0;
        }

        &.column2 {
          height: 0.46rem;
        }
      }
    }

    .border-radius4 {
      border-radius: 0.04rem;
      overflow: hidden;
    }

    .video-play-icon {
      width: 0.16rem;
      height: 0.16rem;
      background-size: 100%;
      background-position: center;
    }

    .match-play-count {
      font-weight: normal;

      &.standard {
        line-height: 0.3rem;
        height: 0.3rem;
        font-size: 0.12rem;
      }

      &.simple {
        width: 0.38rem;
        font-size: 0.13rem;

        .yb-icon-arrow {
          margin-top: 0.02rem;
        }
      }
    }

    .team-title {
      height: 0.23rem;
      margin-bottom: 0.03rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      // position: relative;

      // .ellipsis {
        // position: absolute;
        // left: 0;
        // top: 0;
        // width: 100%;
        // height: 100%;
      // }
    }
  }

  .time-wrap {
    width: 0.37rem;
    height: 0.16rem;
    font-size: 0.12rem;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    margin-right: 0.07rem;
    padding-top: 0.02rem;
    padding-left: 0.01rem;

    .time {
      min-width: 0.18rem;
      text-align: center;
      line-height: 1;
    }
  }

  .icon-s-wrap {
    margin-right: 0.07rem;
  }

  .live-icon-pre {
    width: 0.27rem;
    height: 0.12rem;
    line-height: 1;
    border-radius: 0.1rem;
    // background-color: #FFB001;
    font-size: 0.11rem;
    color: #ffffff;
    text-align: center;
    font-style: italic;
  }

  .finally {
    width: 0.27rem;
    height: 0.12rem;
    background-size: contain;
    background-repeat: no-repeat;
    line-height: 1;
    font-size: 0.11rem;
    color: #ffffff;
    background-image: var(--q-color-com-img-bg-111);
  }

  .event-team {
      padding: 8px 0;

      .name {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #303442;
        font-size: 12px;
        font-weight: 400;

        .serving-party {
          border-radius: 2px;
          background: var(--sys-feedback-success-success-400, #4AB06A);
          width: 4px;
          height: 4px;
        }

        .logo {
          width: 20px;
          height: 20px;
        }

        .vs {
          margin: 0 16px;
        }

        >div {
          display: flex;
          align-items: center;
          gap: 4px;
          width: 1.6rem;

          &.left {
            justify-content: flex-end;
          }

          &.right {
            justify-content: flex-start;
          }
        }
      }

      .odds {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: .08rem 0;

        .bet_btn {
          display: flex;
          align-items: center;
          width: 274px;
          gap: 2px;
          justify-content: center;

          .active {
            background: var(--sys-neutral-white-white, #FFF);
          }

          .item {
            padding: 2px 0px;
            flex: 1;
            height: 32px;
            flex-shrink: 0;
            border-radius: 2px;
            background: var(--q-gb-bg-c-15);
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
            &.active {
              background: var(--sys-brand-secodary-secondary-200, #C9CDDB);
            }

            .on {
              color: var(--sys-brand-secodary-secondary-300, #AFB3C8);
              text-align: center;
              font-size: 10px;
              font-weight: 500;
            }

            .num {
              color: var(--sys-brand-secodary-secondary-800, #303442);
              text-align: center;
              font-size: 10px;
              font-weight: 700;
            }
          }
        }
      }



    }
}
</style>
