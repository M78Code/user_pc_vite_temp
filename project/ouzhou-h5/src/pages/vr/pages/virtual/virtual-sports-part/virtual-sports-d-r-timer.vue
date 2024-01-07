<!--
 * @Description: 赛马动态排行
-->
<template>
  <div class="d-m-i-wrap" v-show="team_obj&&team_list_sort">
    <div class="rank-wrapper">
      <div class="dynamic-l-item" v-for="(item,index) of team_list_sort" :key="index" :ref="`dynamic-dom-item-${index}`"
      :style="{top:`${get_list_i_top(index)}rem`}"
      >
        <div class="row justify-between dynamic-title">
          <div class="row items-center">
            <div class="virtual-num" :class="`virtual-num-${item.id} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type} ${[1010].includes(sub_menu_type) ? `motorcycle-${item.id}` : ''}`"></div>
            <div class="virtual-name">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="team-list-sort">
      <div v-for="(item,index) of team_list_sort" :key="item + index">
        <div class="count-style">{{index + 1}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import virtual_sports_d_r_timer_mixin from "src/core/vr/mixin/pages/virtual/virtual-sports-part/virtual-sports-d-r-timer-mixin.js";
export default {
  mixins:[virtual_sports_d_r_timer_mixin],
  name:'dynamic_ranking_timer',
}
</script>

<style lang="scss" scoped>
/*************** 排名最后一个子元素开始 *************** -S*/
.d-m-i-wrap {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: nowrap;

  .rank-wrapper {
    width: 100%;
    position: relative;
    margin-left: 0.07rem;

    .dynamic-l-item {
      width: 100%;
      position: absolute;
      border-radius: 8px 0 0 8px;
      left: 0;
      top: 0;
      transition: top 0.4s;
      border-radius: 4px 0px 0px 4px;
      background: var(--q-gb-bg-c-28);

      // &::after {
      //   content: '';
      //   position: absolute;
      //   left: 0;
      //   top: 0;
      //   border: 1px solid;
      //   border-right: 0;
      //   border-radius: 0.16rem 0 0 0.16rem;
      //   width: 200%;
      //   height: 200%;
      //   -webkit-transform: scale(0.5);
      //   transform: scale(0.5);
      //   -webkit-transform-origin: left top;
      //   transform-origin: left top;
      // }
    }
  }

  &:last-child {
    border-bottom: none;
  }
}


/*************** 排名最后一个子元素结束 *************** -E*/
/*************** 赛马名称开始 *************** -S*/
.dynamic-title {
  height: 0.48rem;
  line-height: 0.48rem;
}

/*************** 赛马名称结束 *************** -E*/
/*************** 马类编号开始 *************** -S*/
.virtual-num {
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  margin-left: 0.22rem;
  text-align: center;
  background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png") no-repeat 0 0 / 100%;
  --per: -0.3rem;
}


/*************** 马类编号结束 *************** -E*/
/*************** 马名开始 *************** -S*/
.virtual-name {
  margin-left: 0.1rem;
  font-size: 0.14rem;
  line-height: 0.18rem;
  font-weight: bold;
}

/*************** 马名结束 *************** -E*/
/*************** 排名开始 *************** -S*/
.count-style {
  position: relative;
  height: 0.48rem;
  line-height: 0.48rem;
  margin-bottom: 0.08rem;
  width: 0.5rem;
  text-align: center;
  font-size: 0.16rem;
  letter-spacing: 0;
  border-radius: 0 4px 4px 0;
  border-radius: 0px 4px 4px 0;
  background: var(--q-gb-bg-c-28);
  font-weight: 700;
  color: var(--q-gb-t-c-18);

  // &::after {
  //   content: "";
  //   pointer-events: none;
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   width: 200%;
  //   height: 200%;
  //   -webkit-transform: scale(0.5);
  //   transform: scale(0.5);
  //   -webkit-transform-origin: left top;
  //   transform-origin: left top;
  //   border: 1px solid;
  //   border-left: 0;
  //   border-radius: 0 0.16rem 0.16rem 0;
  //   overflow: hidden;
  // }
}


/*************** 排名结束 *************** -E*/
.team-list-sort {
  margin-right: 0.07rem;
}

/*************** 编号背景色开始 *************** -S*/
div[class*="virtual-num"] {
  border-radius: 2px;
}

.virtual-num-1 {
  background-position-y: calc(var(--per) * 6);

  &.csid-1009 {
    background-position-y: calc(var(--per) * 14);
  }
}

.virtual-num-2 {
  background-position-y: calc(var(--per) * 7);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 1);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 15);
  }
}

.virtual-num-3 {
  background-position-y: calc(var(--per) * 8);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 2);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 16);
  }
}

.virtual-num-4 {
  background-position-y: calc(var(--per) * 9);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 3);
  }

  &.csid-1009 {
    background-position-y: calc(var(--per) * 17);
  }
}

.virtual-num-5 {
  background-position-y: calc(var(--per) * 10);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 4);
  }
}

.virtual-num-6 {
  background-position-y: calc(var(--per) * 11);

  &.csid-1002 {
    background-position-y: calc(var(--per) * 5);
  }
}

/*************** 编号背景色结束 *************** -E*/
</style>

src/core/vr/mixin/pages/virtual/virtual-sports_part/virtual_sports_d_r_timer_mixin.js