<!--
 * @Description: 虚拟体育列表页批次tab切换组件
-->
<template>
  <div class="match-tab row justify-end">
    <!-- 足球联赛league_type 0 -->
    <div class="row items-center part-nav" ref="scrollBox" :class="{'part-nav-full': lodash.get(get_access_config, 'statisticsSwitch') && sub_menu_type != 1004}">
      <div ref="scrollItem" v-for="(item,i) in no_list" class="row sub-nav-item" @click="sub_nav_click_handle(item.batchNo, true)"
        :class="{focus:item.batchNo === sub_focus_batch_no,footbal:[1001,1004].includes(sub_menu_type)}"
        v-show="sub_menu_type != '1004' || item.mmp != 'PREGAME' || !pre_to_playing || i != 0"
        :key="i">
        {{item.no}}
        <div v-if="i+1<no_list.length" class="line"></div>
      </div>
      <div v-if="no_list.length" class="row sub-nav-item footbal rank_click_icon" @click="change_tab('rank')">
        <img :src="img"/>
      </div>
    </div>
    <!-- 分析icon显示 -->
    <div class="sr-icon-wrapper row justify-center items-center" @click.stop="trend_event"  v-if="lodash.get(get_access_config,'statisticsSwitch') && sub_menu_type != 1004">
      <img class="sub-item-trend-icon2" v-if="[1002, 1011, 1010, 1009].includes(sub_menu_type) && trend_is_show"
            src="image/wwwassets/bw3/common/analyse_icon.svg" alt="" />
      <img class="sub-item-trend-icon1" v-if="[1001,1004].includes(sub_menu_type) && trend_is_show"
            src="image/wwwassets/bw3/common/analyse_icon.svg" alt="" />
      <img class="sub-item-close-icon" v-if="!trend_is_show"
            src="image/wwwassets/bw3/common/sub_item_list_close.svg" alt="">
    </div>
  </div>
</template>
<script>
import match_tab_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/match-tab-mixin.js";
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js'
export default {
  mixins:[match_tab_mixin],
  name:'match_tab',
  setup(){
    return {
      LOCAL_PROJECT_FILE_PREFIX
    }
  },
  data(){
    return {
      rank_turnon: false,
      img: `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/virtual-sports/rank_click_icon.svg`,
    }
  },
  methods: {
    /**
     * 批次变化
     * @param {String|Number} batchNo 当前最新期号
     * @param {Undefined}
     */
     sub_nav_click_handle(batchNo, is_user_lick = false){
      // 期号相同 且 是用户点击 则直接退出
      if(batchNo == this.sub_focus_batch_no && is_user_lick){
        return;
      }
      this.sub_nav_focus_i = lodash.findIndex(this.no_list,{batchNo:batchNo});
      this.sub_focus_batch_no = batchNo;
      // utils.tab_move2(this.sub_nav_focus_i, this.$refs.scrollBox)
      let current_sub_nav = this.no_list[this.sub_nav_focus_i];

      this.rank_turnon = false
      this.img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/virtual-sports/rank_click_icon.svg`;
      this.$emit('change_tab','list')

      this.$emit('sub_nav_change',{
        nav:current_sub_nav,
        i:this.sub_nav_focus_i
      });

      //将赛马赛事信息跟新到vuex
      let match_info = lodash.get(current_sub_nav,'match[0]')
      match_info && this.set_detail_data(lodash.cloneDeep(match_info))

      //赛马传递赛事集合唯一赛事的赛事id
      if([1002, 1011, 1010, 1009].includes(this.sub_menu_type)){
        let mid = '';
        try{
          mid = current_sub_nav.match[0].mid;
        }catch(e){console.error(e)}
        if(mid){
          this.set_current_mid(mid);
        }
      }
    },
    change_tab(val){
      if(this.rank_turnon){
        this.rank_turnon = false
        this.img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/virtual-sports/rank_click_icon.svg`;
        this.$emit('change_tab','list')
      }else{
        this.rank_turnon = true
        this.img = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/virtual-sports/lszj_click_turnoff_icon.svg`;
        this.$emit('change_tab','rank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.match-tab {
  width: 100%;
  height: 0.4rem;
  position: sticky;
  top: 0.3rem;
  z-index: 99;
  display: flex;
  align-items: center;
  background: #fff;
}

.part-nav {
  overflow-y: hidden;
  overflow-x: auto;
  width: 100%;
  height: 0.4rem;
  line-height: 0.4rem;
  padding-right: 0.2rem;
  padding-left: 0.08rem;
  flex-wrap: nowrap;
  
  &.part-nav-full {
    width: 3.25rem;
  }
  
  // &:after {
  //   content: ' ';
  //   display: block;
  //   width: 0.16rem;
  //   height: 0.1rem;
  //   flex-shrink: 0;
  // }

  .sub-nav-item {
    min-width: fit-content;
    font-size: 0.14rem;
    margin-right: 0.19rem;
    letter-spacing: -0.01rem;
    height: 100%;
    position: relative;
    padding-left: 0.08rem;
    color: #8A8986;
    font-weight: 500;
    .line {
      width: 1px;
      height: 0.12rem;
      background: #D9D9D9;
      position: relative;
      left: 0.14rem;
      top: 0.14rem;
    }

    &.focus {
      color: #FF7000;
      &:after {
        display: block;
      }
    }

    &:last-child {
      margin-right: 0;
    }

    &.footbal {
      font-size: 0.13rem;
      line-height: 0.41rem;
    }

    &:after {
      content: '';
      width: 8px;
      height: 4px;
      position: absolute;
      left: 50%;
      bottom: 0;
      // transform: translateY(-2px);
      display: none;
      background: url($SCSSPROJECTPATH+"/image/vr/circle.png") no-repeat center;
      background-size: 100% 100%;
    }
  }

  .rank_click_icon{
    // margin-left: 0.6rem;
    // background-color: red;
    // border-radius: 100px;
    background-color: var(--q-gb-bg-c-2);
    // opacity: 0.8;
    box-shadow: 0px 0px 0.4rem 0.01rem var(--q-gb-bg-c-2);
    position: absolute;
    padding: 0 0.1rem;
    right: 0;
    // left: 0;
  }
}

.sr-icon-wrapper {
  flex: 1;
  height: 0.4rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0.1rem;
    height: 0.2rem;
    width: 1px;
  }

  .sub-item-trend-icon1 {
    width: 0.18rem;
    height: 0.2rem;
  }

  .sub-item-trend-icon2 {
    width: 0.18rem;
    height: 0.2rem;
  }

  .sub-item-close-icon {
    width: 0.2rem;
    height: 0.2rem;
    display: block;
  }
}
</style>
src/core/vr/mixin/pages/virtual/virtual-sports_part/match_tab_mixin.js