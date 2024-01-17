<!--
 * @Description: 复刻版  次要玩法 
-->
<template>
  <div class="m-o-p-wrapper match-container-second-template2" v-show="show_tab_by_data">
    <!--次要玩法 标题主名称-->
    <div class="tab-m-o-w row items-center" ref="sub_play_scroller">
      <div v-for="(t_item, i) of tab_list.filter(x => x.show_tab)" 
        :key="i" 
        ref="sub_play_scroll_item"
        :class="['tab-item-h row items-center', { 'collapsed': t_item.unfold == 1 }]"
        @click="overtime_tab_handle(t_item, undefined, 'is-user', i)">
        <div> {{ t_item.title }} </div>
        <!--折叠得箭头图标-->
        <span class="league-collapse-dir" :class="{ 'collapsed': t_item.unfold == 1 }" :style="compute_css_obj('icon-collapse')" ></span>
      </div>
    </div>
    <!-- 次要玩法   1. 左边队伍名标题   2. 右边 盘口组件  模块 -->
    <div 
      v-if="current_tab_item.hps" 
      :mid="match_info.mid"  
      :class="['transition-w-odd', {
      expanded: any_unfold && any_unfold != '0',
      bodan_wanfa: [18].includes(+ lodash.get(current_tab_item, 'id')) && bold_gaodu_css > 3,
      bodan_wanfa_small: any_unfold && [18].includes(+ lodash.get(current_tab_item, 'id')) && bold_gaodu_css <= 3,
      five_minutes_wanfa: any_unfold && any_unfold != '0' && [19].includes(+ lodash.get(current_tab_item, 'id')),}]">
      <!--次要玩法标 队名 和 比分 和 盘口-->
      <div class="row justify-between" v-if="any_unfold">
        <!--次要玩法标 队名 和 比分  次要玩法 左边的 区域    波胆，5分钟玩法  不显示-->
        <div class="team-title-container" v-if="![18, 19].includes(+ lodash.get(current_tab_item, 'id'))">
          <!--主队名 和 比分-->
          <div :class="['team-t-title-w', { 'is-handicap': current_tab_handicap_index == 1, 'is-handicap-1': current_tab_handicap_index == 2, }]">
            <div class='team-title'> {{ match_info.mhn }}  </div>
            <!--显示次要玩法比分 7,8,9 网,乒,斯-->
            <div class="way-score" v-if="[1, 5, 7, 8, 9].includes(+current_tab_item.id) && match_info.ms == 1"> {{ home_score }} </div>
          </div>
          <!--副队名 和 比分-->
          <div :class="['team-t-title-w', { 'is-handicap': current_tab_handicap_index == 2, 'is-handicap-1': current_tab_handicap_index == 1, }]">
            <div class='team-title'> {{ match_info.man }} </div>
            <!--显示次要玩法比分 7,8,9 网,乒,斯-->
            <div class="way-score" v-if="[1, 5, 7, 8, 9].includes(+current_tab_item.id) && match_info.ms == 1"> {{ away_score }}</div>
          </div>
          <!--  玩法描述图标显示  -->
          <div class="team-t-title-w fight-type" v-if="[1, 3, 5, 7, 8, 9].includes(+match_info.csid)">
            <span v-if="[2, 5, 17].includes(+current_tab_item.id)" 
              @click="info_icon_click($event, match_info.mid)"
              :style="compute_css_obj(show_tips?'icon-tips':'icon-tips-d')"
            ></span>
            {{ match_info.csid == 1 ? current_tab_item.title : mmp_map_title }}
          </div>
        </div>
        <!--次要玩法 盘口 右边的 区域-->
        <OddListWrap 
          :main_source="main_source"
          :match="match_info"
          :hps="current_tab_item.hps"
          :current_tab_item="current_tab_item"
          :invoke_source="'attached'"
          :bold_all_list="bold_all_list"
          :five_minutes_all_list="five_minutes_all_list" />
      </div>
    </div>
  </div>
</template>

<script>
import second_mixin from '../mixins/second.mixin.js';
import OddListWrap from 'src/base-h5/components/match-container/template/app/components/odd-list-wrap.vue';
import { compute_css_obj } from "src/output/index.js"

export default {
  name: "match-container-second-template2",
  mixins: [second_mixin],
  props: {
    main_source:String,   //数据源
    matchCtr:Object,      //数据仓库数据
    i:Number,   //所在位置
  },
  components: {
    OddListWrap
  },
  setup (ctx) {

    return { 
      compute_css_obj
    }
  }
}


</script>
  
<style scoped lang="scss">
.m-o-p-wrapper {
  width: 100%;
  height: auto;
  padding: 0 0.07rem;
  position: relative;
  .wsl_flag_777{
    position: absolute;
    color: red;
    top: .24rem;
    //left: 1.08rem;
  }

  .tab-m-o-w {
    //width: 3.58rem;
    /*height: 0.44rem;*/
    margin: 0 auto;
    padding-left: 0.02rem;
    flex-wrap: nowrap;
    overflow: scroll;

    .tab-item-h {
      width: auto;
      height: 0.24rem;
      margin-right: 0.05rem;
      padding: 0 0.084rem;
      border-radius: 0.04rem;
      margin-bottom: 0.12rem;
      flex-wrap: nowrap;
      white-space: nowrap;
      flex-shrink: 0;
      font-size: 12px;

      &:last-child {
        margin-right: 0;
      }

      &.pena {
        margin-left: 0.2rem;
      }

      .league-collapse-dir {
        width: 0.1rem;
        height: 0.04rem;
        margin-left: 0.07rem;
        display: block;
        transform: rotateZ(180deg);
        transition: transform 0.2s ease-in;
        &.collapsed {
          transform: rotateZ(0);
        }
      }
    }
  }

  .odd-l-head-w {
    width: 1.84rem;
    height: 0.48rem;
    overflow: hidden;

    .o-w-h-c {

      height: 100%;
      flex-shrink: 0;
      flex-wrap: nowrap;

      .hpl-t {
        position: relative;
        width: 0.6rem;
        height: 100%;
        line-height: 1;
        transition: transform 0.2s;
        padding: 0 0.02rem;
        margin-right: 0.02rem;

        &:nth-child(n + 4) {
          margin-right: 0;
        }

        &.status2 {
          transform: translateX(-1.84rem);
        }

        .div-inner-2 {
          width: 0.05rem;
          height: 100%;
          background-color: var(--q-color-com-bg-color-12);
          position: absolute;
          top: 0;
          right: -0.05rem;
          z-index: 1;
        }
      }
    }
  }

  .team-title-container {
    .team-t-title-w {
      width: 1.30rem;
      margin-left: 0.20rem;
      height: 0.31rem;
      font-size: 0.14rem;
      display: flex;
      align-items: center;
      position: relative;

      &.is-handicap {
        font-weight: bold;
      }

      &.fight-type {
        font-size: 0.12rem;
     //   margin-left: 0.04rem;

        img {
          display: block;
          /*width: 0.14rem;*/
          /*height: 0.14rem;*/
          margin-right: 0.055rem;
          margin-left: -0.17rem;

          margin-bottom: 0.02rem
        }
      }

      .team-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 1.07rem;
      }

      .way-score {
        position: absolute;
        right: 0;
      }
    }
  }

  .title-15min  {
    text-align: left;
    display: flex;
    width: 1.4rem;
    display: flex;
    color:var(--p-theme-color) ;
    align-items: center;
    font-size: .12rem
  }

  .transition-w-odd {
    font-size: 0.1rem;
    max-height: 0;

    &.expanded {
      height: auto;
      max-height: none;
      padding-bottom: 0.06rem;
      &.five_minutes_wanfa {
        padding-bottom: 0.085rem;
      }
      &.bodan_wanfa{
        padding-bottom: 0.44rem!important;
      }
      &.bodan_wanfa_small{
        padding-bottom: 0.12rem!important;
      }
    }
  }
}
</style>
