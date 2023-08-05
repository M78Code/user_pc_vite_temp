<!--
 * @Author: Cronus
 * @Date: 2020-07-14 17:46:47
 * @Description: 赛事列表组件，共用于搜索结果、旧版收藏页、赛事列表页展示赛事列表
-->

<template>
  <div class="refresh-container">
    <!--列表页-->
    <scroll-wrapper ref="scroll_wrapper" :matchCtr="matchCtr" :data_source="matchCtr.list" :class="{'data-get-empty':data_get_empty}"
      v-if="matchCtr" :main_source="source" :is_goto_top_random="is_goto_top_random"
      :match_list_wrapper_height="match_list_wrapper_height">
      <template v-slot="{ item:match_item, index:i}">
        <!--虚拟体育(赛果)-->
        <v-match-container :match="match_item"
          :i_list="i"
          :match_list="matchCtr.list"
          :sport_id="match_item.sportId"
          v-if="[1001,1002,1004,1011,1010,1009].includes(+match_item.sportId)">
        </v-match-container>
        <div class="data_mid" v-else> <!--此data-mid用于分频订阅赛事,请勿修改-->
          <!--真实体育赛果 -->
          <match-container-result
            v-if="menu_type ==28 && 100 == get_curr_sub_menu_type"
            :match_of_list="match_item"
            :matchCtr="matchCtr"
            :i="i"
            :menu_type="menu_type"
            :main_source="source"
            @unfold_changed="unfold_changed_handle"
            @toggle_collect_league="toggle_collect"
            @toggle_collect_match="toggle_collect"
          />
          <!--真实体育玩法 -->
          <match-container
            v-if="(_.get(get_current_menu, 'main.menuType') == 28 ||
            !is_champion && match_item.ms != 3 ) && !(menu_type ==28 && 100 == get_curr_sub_menu_type)"
            :match_of_list="match_item"
            :matchCtr="matchCtr"
            :i="i"
            :menu_type="menu_type"
            :main_source="source"
            @unfold_changed="unfold_changed_handle"
            @toggle_collect_league="toggle_collect"
            @toggle_collect_match="toggle_collect">
          </match-container>
          <!--冠军玩法-->
          <match-container-champion
            :match_of_list="match_item"
            :matchCtr="matchCtr"
            :i="i"
            :menu_type="menu_type"
            :key="i"
            @toggle_collect_league="toggle_collect"
            v-if="is_champion">
          </match-container-champion>
        </div>
      </template>
    </scroll-wrapper>

    <!-- 次要玩法描述 -->
    <div class="pg-wrapper" v-show="other_way_info_show" @click="close_other_w_info" ref="other_way_info">
      <div class="other-way-info-wrapper"  :class="arr_top_down"
        :style="{left:`${other_way_style.left}px`,top:`${other_way_style.top}px`}"
        >
        <div class="row justify-between info-head">
          <div class="o-title">
            {{current_way_name}}
          </div>
          <img class='close-o-info-icon' @click="close_other_w_info"
            :src="(`${ $g_image_preffix }/image/wwwassets/bw3/menu/set_close_${get_theme.includes('theme01')?'theme01':'theme02'}.svg`)" />
        </div>

          <!-- 次要玩法如果是数组 例如15分钟展开 -->
          <div v-if="Array.isArray(play_way_info)">
            <div 
              class="s-table" 
              v-if="!(show_Xth_title && index === 5)"
              v-for="(item,index) in play_way_info" :key="index"
            >
              <template v-if="item.title =='5min-icon'">
                <div class="wrap-box yb-flex-center">
                  <div :class="['item-icon',`item-icon-${index}`]" v-for="index in 4" :key="`${index}_before`"></div>
                  <div class="item-content">{{item.content}}</div>
                  <div :class="['item-icon',`item-icon-${index}`]" v-for="index in [4,3,2,1]" :key="`${index}_after`"></div>
                </div>
              </template>
              <template v-else>
                <div v-if="show_15min_data">
                  <div>{{show_Xth_title && index === 4 ? item.Xth_title : item.title}}</div>
                  <div>{{item.content}}</div>
                </div>
                <div v-else>
                  <div :class="{'full-width': index > 3}">{{show_Xth_title && index === 4 ? item.Xth_title : item.title}}</div>
                  <div v-if="index < 4">{{item.content}}</div>
                </div>
              </template>
            </div>
          </div>
          <div v-else v-html="play_way_info" />
      </div>
    </div>

    <no-data class="data-get-empty1" v-if='data_get_empty && !get_show_favorite_list' which='noMatch' height='400'></no-data>
    <no-data class="data-get-empty2" v-if='data_get_empty && get_show_favorite_list' :which='menu_type === 28 ? "noMatch" : "collect"' height='400'></no-data>

  </div>
</template>

<script>
  import no_data from 'src/project/components/common/no_data.vue';   // 无网络展示组件
  import odd_convert from "src/public/mixins/odds_conversion/odds_conversion.js";   // 此文件 主要是应对 赔率转换(在转换为其他赔率时候，必须做欧洲赔率的配分)
  import formartmixin from 'src/project/mixins/module/formartmixin.js';    // 时间格式化处理
  import bettings from 'src/project/mixins/betting/betting.js';    // 押注动作相关的所有方法写到这里
  import match_list_mixin from 'src/project/mixins/match_list/match_list_mixin.js';  // 为赛事列表提供逻辑方法，拆分组件复杂度
  import msc from 'src/public/mixins/common/msc.js';    // 国际化比赛阶段比分转换工具
  import {mapMutations, mapGetters} from "vuex";
  import {add_or_cancel_tournament, add_or_cancel_match} from 'src/project/api/module/common/index';
  import utils from 'src/public/utils/utils.js'
  import common  from "src/project/mixins/constant";   // 所有import路径替换成相对路径
  import match_container from "src/project/pages/match-list/components/match_container.vue";  // 赛事组件，用于赛事列表展示赛事信息
  import v_match_container from "src/project/pages/match-list/components/virtual_match_container.vue";  // 虚拟体育赛狗赛马赛果项
  import match_container_champion from "src/project/pages/match-list/components/match_container_champion.vue";    // 冠军赛事组件，用于赛事列表展示赛事信息
  import scroll_wrapper from 'src/project/components/common/scroll_wraper/scroll_wrapper.vue';    // 滚动操作处理
  import match_container_result from "src/project/pages/match-list/components/match_container_result.vue" //赛果冠军

  export default {
    name: 'matchList',
    mixins: [formartmixin, odd_convert, bettings, match_list_mixin, msc,common],
    props: {
      data_get_empty: Boolean,  // 赛事列表无数据
      menu_type: Number | String, // 6 收藏页,
      matchCtr:Object,                //处理赛事列表数据的类型封装
      source:String,
      window_scrolly:Number | String,
      match_list_wrapper_height:Number,
    },
    data() {
      return {
        arr_top_down:'arr-top', // 默认箭头向上
        // 收藏|取消收藏是否请求中
        favorite_loading:false,
        // 罚牌 玩法信息展示
        other_way_info_show:false,
        other_way_style:{
          left:0,
          top:0,
        },
        pre_info_clicked_mid:'',
        play_way_info:'',
        current_way_name:'',
        //回到顶部
        is_goto_top_random:0,
        // 次要玩法info tips----当前展开的次要玩法tab信息
        curr_play_info: {
          // 当前赛事状态，默认为滚球
          ms: 1,
          // 当前展开的次要玩法tab
          menu_id: '',
          show_15min_data:false // 15分钟玩法数据
        },
      }
    },
    created () {
      // 防止频繁切换收藏与取消收藏
      this.timer_super12 = null;
    },
    // 组件销毁
    deactivated() {
      utils.del(this.msc_map);
      clearTimeout(this.timer_super12)
      this.timer_super12 = null

      this.$root.$off(this.emit_cmd.EMIT_INFO_ICON_CLICK,this.info_icon_click_h);
      this.$root.$off(this.emit_cmd.EMIT_TAB_HOT_CHANGING,this.tab_changing_handle);
      // console.log('match_list.vue destroy')
    },
    activated() {
      this.$root.$on(this.emit_cmd.EMIT_INFO_ICON_CLICK,this.info_icon_click_h);
      this.$root.$on(this.emit_cmd.EMIT_TAB_HOT_CHANGING,this.tab_changing_handle);
    },
    computed: {
      ...mapGetters([
        // 投注成功的赛事id
        "get_match_id_bet_success",
        "get_theme",
        // 投注项id集合
        "get_bet_list",
        // 用户信息,用户金额,userId 需要监听变化
        "get_user",
        // 当用户未登录时返回uuid, 当用户登录时返回userId
        "get_uid",
        // 收藏菜单为6
        "get_menu_type",
        // 当前选中的菜单
        'get_current_menu',
        // 控制内容是否高亮用作新手引导使用(home页使用)
        'get_show_content',
        // 获取高亮元素高(match-list页使用)
        'get_element_height',

        // 滚到顶部
        'get_goto_list_top',
        // 显示收藏列表
        'get_show_favorite_list',
        // 当前语言
        'get_lang',
        // 三级菜单id
        'get_curr_third_menu_id',
        // 折叠展开与赛事对应
        'get_collapse_map_match',
        // 简版还是标准版
        'get_newer_standard_edition',
        //二级菜单type
        'get_curr_sub_menu_type',
        'get_access_config',
      ]),
      /**
       * 当前为冠军或电竞冠军
       */
      is_champion(){
        let flag = 100 == this.menu_type || // 冠军
          (3000 == this.menu_type && _.get(this.get_current_menu, 'date_menu.menuType') == 100); //电竞冠军
        return flag;
      },
      /**
       * 是否显示无第 {X} 个进球 title----次要玩法tips(5分钟次要玩法)
       */
      show_Xth_title() {
        return [1,2,7,10].includes(+this.curr_play_info.ms) && this.curr_play_info.menu_id === 19
      }
    },
    methods: {
      ...mapMutations([
        /**
         * 押注状态0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,
         * 4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,
         * 7-有投注项锁盘，8-单关投注失败(bet接口返回200)
         */
        "set_bet_status",
        // 赛事id
        'set_goto_detail_matchid',
        // 玩法tab 所有投注 - 进球 - 上半场 - 球队 - 让球&大小
        'set_details_item',
        // 提醒内容
        'set_toast',
        // 控制内容是否高亮用作新手引导使用(home页使用)
        'set_show_content',
        ]),
      tab_changing_handle(){
        this.close_other_w_info();
      },
      /**
       * 关闭玩法描述
       */
      close_other_w_info(){
        this.other_way_info_show = false;
      },
      /**
       * 玩法信息图标点击
       */
      info_icon_click_h(e,mid,menu,match){
        if(!e){
          this.other_way_info_show = false;
          return;
        }

        // 获取当前赛事状态
        this.curr_play_info = {
          ms: _.get(match, 'ms', 1),
          menu_id: menu.id
        }

        this.current_way_name = menu.title;
        let menu_id = menu.id;
        this.other_way_style.left = this.rem(0.1);
        this.other_way_style.top = e.clientY + this.rem(.16);
        if(mid != this.pre_info_clicked_mid){
          this.other_way_info_show = true;
        }
        else{
          this.other_way_info_show = !this.other_way_info_show;
        }

        let arr_top_off_set=0; //偏移量  滑动到快底部时 显示不下,向上显示
        let arr_to_down=false; // 默认向上显示
        if([19,17,5].includes(menu_id)){ // 如果是17 15分钟玩法 // 后续可能会加新玩法 所以大判断在前
          // 5分钟
          if (19 == menu_id) {
            arr_top_off_set = 2 // 单位rem
            this.show_15min_data = false
          }
          // 15分钟
          else if(17==menu_id){
            arr_top_off_set=1.8 // 单位rem
            this.show_15min_data = true
          }
          // 罚牌
          else if(5==menu_id){
            arr_top_off_set=1.1 // 单位rem
          }

          if(document.body.offsetHeight-e.clientY <this.rem(arr_top_off_set)+ this.rem(0.1)){
              // 如果当前点击的位置超过 弹框本身的大小 则变成向上显示
              this.other_way_style.top = e.clientY -this.rem(.16) -this.rem(arr_top_off_set);
              arr_to_down=true;
          }
        }
        this.arr_top_down=arr_to_down?'arr-down':'arr-top'; // 箭头向上向下显示 // 赋值给this

        this.play_way_info = this.$root.$t(`play_way_info.${menu_id}`);
        this.pre_info_clicked_mid = mid;
      },
      /**
       * 收藏与取消收藏（联赛与赛事）
       * @param {Object} $event {match index type type2}
       * @return {Undefined} Undefined
       */
      toggle_collect($event) {
        if( !utils.judge_collectSwitch( _.get(this.get_access_config,'collectSwitch'),this ) ) return

        if(this.favorite_loading) {
          clearTimeout(this.timer_super12);
          this.timer_super12 = setTimeout(() => {
            this.favorite_loading = false;
          },3000);
          return;
        }

        let match = $event.match, index = $event.index,item = $event.type,type2= $event.type2;

        let api, txt, number = 0;
        let params = {
          cuid: this.get_user ? this.get_user.userId:this.get_uid,
        };
        if (item == 'tf') {
          //联赛收藏或取消收藏
          api = add_or_cancel_tournament;
          if (match.tf) {
            txt = this.$root.$t('common.cancel');//'取消';
          } else {
            txt = this.$root.$t('collect.betted_title');//'收藏';
          }
          if(type2){  //冠军联赛收藏
            //电竞冠军收藏dota2传非空
            if(this.menu_type == 3000){
              params.dota2 = 1;
              params.tid = match.tid;
            }
            else{
              let mids = []
              _.each(this.matchCtr.match_list_data_sources,cur_match=>{
                if(cur_match.tid == match.tid){
                  mids.push(cur_match.mid)
                }
              })
              params.mid = mids.join(',');
            }
            params.cf = Number(!match.tf);
          }else{    //其他联赛收藏
            Object.assign(params, {cf: Number(!match.tf), tid: match.tid})
          }
        }
        else
        {
          //赛事收藏或取消收藏
          api = add_or_cancel_match;
          number = 1;
          if (match.mf) {
            txt = this.$root.$t('common.cancel');//'取消';
          } else {
            txt = this.$root.$t('collect.betted_title');//'收藏';
          }
          Object.assign(params, {cf: Number(!match.mf), mid: match.mid})
        }

        let changedParam = {
          index: index,
          item: item,
          bool: !match[item],
          number: number,
          sportId: match.csid,
        };
        this.$emit('change_favorite_state', changedParam);

        this.favorite_loading = true;
        api(params).then(res => {
          this.favorite_loading = false;
          if(res.code == 200){
          }
          else if(res.msg){
            this.set_toast({ 'txt': res.msg });
          }
        });
      },
      /**
       * 折叠状态变化
       */
      unfold_changed_handle($event){
        this.$emit('unfold_changed',$event);
      },
    },
    watch: {
      other_way_info_show(curr){
        this.$root.$emit(this.emit_cmd.EMIT_FAPAI_WAY_TIPS_STATUS_CHANGE,curr);
      },
      window_scrolly(n,o){
        this.other_way_info_show = false;
      },
      // 投注成功收藏赛事
      get_match_id_bet_success:{
        handler(curr){
          if(curr){
            let id_s = curr.split('-')[0];
            let favorite = curr.split('-')[1];
            let match_id_list = id_s.split(',');
            let found = null;
            match_id_list.forEach(id => {
              for(let i = 0; i < this.matchCtr.list.length;i++){
                let match = this.matchCtr.list[i];
                if(match.mid == id){
                  if(favorite == 1 || favorite == 0){
                    match.mf = favorite == 1;
                  }
                  else{
                    match.mf = true;
                  }
                  //如果是冠军玩法,投注成功后收藏赛事同也收藏联赛
                  if(this.is_champion){
                    if(favorite == 1 || favorite == 0){
                      match.tf = favorite == 1;
                    }
                    else{
                      match.tf = true;
                    }
                  }
                  found = match;
                  break;
                }
              }
              if(this.matchCtr.mid_obj[id]){
                if(favorite == 1 || favorite == 0){
                  this.matchCtr.mid_obj[id].mf = favorite == 1;
                }
                else{
                  this.matchCtr.mid_obj[id].mf = true;
                }
              }

            });
          }
        },
        deep: true
      },
      /**
       * @description: 回到顶部
       * @param {string} curr
       * @return {Undefined} Undefined
       */
      get_goto_list_top(){
        this.is_goto_top_random = Math.random();
      },
      // 简版时隐藏罚牌提示
      get_newer_standard_edition(newValue){
        if (newValue == 1) {
          this.other_way_info_show = false
        }
      }
    },
    components: {
      "no-data": no_data, // 无数据组件
      "match-container":match_container, // 赛事容器组件
      "match-container-result": match_container_result, //  冠军赛果组件
      "v-match-container":v_match_container, // 虚拟赛事容器组件
      "match-container-champion":match_container_champion,
      "scroll-wrapper":scroll_wrapper, // 滚动容器组件
    }
  }
</script>

<style lang="scss" scoped>
.refresh-container {
  width: 100%;
  height: auto;
  position: relative;

  .pg-wrapper{
    width: 100%;
    height: 100%;
    top: 0;
    position: fixed;
    z-index: 502;
    background-color: var(--q-color-com-bg-color-35);
  }

  .arr-top{
    &:before{
      content: "";
      width: 0px;
      height: 0px;
      border-left: 0.1rem solid transparent;
      border-right: 0.1rem solid transparent;
      border-bottom: 0.1rem solid var(--q-color-border-color-42);
      position: absolute;
      top: -0.1rem;
      left: 0.12rem;
    }

    &:after{
      content: "";
      width: 0px;
      height: 0px;
      border-left: 0.095rem solid transparent;
      border-right: 0.095rem solid transparent;
      border-bottom: 0.095rem solid var(--q-color-page-bg-color-95);
      position: absolute;
      top: -0.09rem;
      left: 0.115rem;
    }
  }

  .arr-down{
    &:before{
      content: "";
      width: 0px;
      height: 0px;
      border-left: 0.1rem solid transparent;
      border-right: 0.1rem solid transparent;
      border-top: 0.1rem solid var(--q-color-border-color-42);
      position: absolute;
      bottom: -0.1rem;
      left: 0.12rem;
    }

    &:after{
      content: "";
      width: 0px;
      height: 0px;
      border-left: 0.095rem solid transparent;
      border-right: 0.095rem solid transparent;
      border-top: 0.095rem solid var(--q-color-page-bg-color-95);
      position: absolute;
      bottom: -0.09rem;
      left: 0.115rem;
    }
  }

  .other-way-info-wrapper {
    position: fixed;
    min-width: 2.82rem;
    max-width: 94vw;
    height: auto;
    background-color: var(--q-color-page-bg-color-95);
    border: 0.01rem solid  var(--q-color-border-color-42);
    border-radius: 0.04rem;
    padding: 0.15rem 0.18rem;
    color:var(--q-color-fs-color-38);
    z-index: 1000;

    .triangle-icon {
      width: 0.1rem;
      height: 0.06rem;
      background-image: var(--q-color-com-img-bg-14);
      position: absolute;
      top: -0.06rem;
      left: 0.13rem;
    }

    .info-head {
      margin-bottom: 0.1rem;
    }

    .o-title {
      font-size: 0.14rem;
    }

    .close-o-info-icon {
      width: 0.1rem;
      height: 0.1rem;
    }
  }
}

.match-list {
  width: 100%;
  padding-bottom: 0.1rem;

  .football_text {
    color: var(--q-color-com-fs-color-37);
  }

  .football_num {
    margin-left: 0.02rem;
  }
}


  .s-table {
    &:last-child{
      border-bottom:0.005rem solid  var(--q-color-border-color-42);
    }
    .wrap-box{
      flex: 1;
      padding: .1rem 0;
      .item-content{
        margin: 0 .08rem;
      }
      .item-icon {
        border-radius: 50%;
        background-color: var(--q-color-fs-color-6);
        margin:0 .03rem;
        &.item-icon-1 {
          width: .04rem;
          height: .04rem;
        }
        &.item-icon-2 {
          width: .06rem;
          height: .06rem;
        }
        &.item-icon-3 {
          width: .075rem;
          height: .075rem;
        }
        &.item-icon-4 {
          width: .082rem;
          height: .082rem;
        }
      }
    }
    >div{
      border: 0.005rem solid  var(--q-color-border-color-42);
      width: 100%;
      display: flex;
      border-bottom: none;
      >div{
        text-align: center;
        border-bottom: none;
        &:first-child{
          width: 47.5%;
          background: var(--q-color-page-bg-color-9);
        }
        &:nth-child(2){
          width: 52.5%;
          background: var(--q-color-page-bg-color-9);
        }
      }
    }
    
    .full-width {
      width: 100% !important;
    }
  }
</style>
