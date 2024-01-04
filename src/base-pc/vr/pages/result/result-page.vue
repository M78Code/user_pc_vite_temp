<!--
 * @Description: 虚拟体育菜单下，赛马类比赛结束后需要展示一段时间的赛果页面
-->
<template>
  <div class="dynamic-result-page">
    <div class="dynamic-main">

      <!-- 排名 -->
      <div :class="{'border-gray': index <= 2}"
        v-for="(item,index) of rank" :key="index"
        >
        <div class="row justify-between dynamic-title" :class="{'bg-two':index == 1}">
          <div class="row items-center">
            <div class="virtual-num" :class="`virtual-num-${item.no} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type} ${[1010].includes(sub_menu_type) ? `motorcycle-${item.no}` : ''}`"></div>
            <div class="virtual-name">{{item.name}}</div>
          </div>
          <div class="count-style">{{item.ranking}}</div>
        </div>
      </div>
    </div>

    <div class="fat-vir-result">
      <div class="row bg-color">
        <!-- 赛果第一行（3个或者2个） -->
        <div class="bor-btm"
          v-for="(item,index) in best_three_list" :key="index"
          :class="{'distance': index == 1, 'col-6':sub_menu_type == 1009}"
          >
          <div class="play-name">{{item.playName}}</div>
          <div class="row justify-center">
            <div v-for="(ol_item,ol_index) in item.ol" :key="ol_index"
            >
              <div class="row justify-center" :class="{'border_right': ol_item.on.length > 2}">
                <div v-for="(on_item,on_index) in split_on(ol_item.on)" :key="on_index"
                  :class="[`virtual-num-${on_item} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type}`, [1010].includes(sub_menu_type) ? `motorcycle-${on_item}` : '', {'margin_sty': on_index == 1}]" class="virtual-on">
                </div>
              </div>
              <div class="ov-style">
                {{get_odds(ol_item,item)}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row bg-color">
        <!-- 塞果中间二项 -->
        <div class="col-6 bor-btm"
          v-for="(item,index) in best_middle_list" :key="index"
          :class="{'distance-right': index == 0}"
          >
          <div class="play-name">{{item.playName}}</div>
          <div class="row justify-center">
            <div v-for="(ol_item,ol_index) in item.ol" :key="ol_index">
              <div class="row justify-center">
                <div v-for="(on_item,on_index) in split_on(ol_item.on)" :key="on_index"
                  :class="[`virtual-num-${on_item} csid-${[1010].includes(sub_menu_type) ? '1002' : sub_menu_type}`, [1010].includes(sub_menu_type) ? `motorcycle-${on_item}` : '', {'margin_sty': on_index == 1}]" class="virtual-on">
                </div>
              </div>
              <div class="ov-style">
                {{get_odds(ol_item,item)}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row bg-color">
        <!-- 赛果页面最后2项 -->
        <div class="col result-style"
          v-for="(unit,index) in last_three_list" :key="index"
          :class="{borrig : index == 0}"
          >
          <div class="item-ov" v-for="(ol_item,ol_index) in unit.ol" :key="ol_index">
            <div class="result-sty">{{ol_item.on}}</div>
            <div>
              {{get_odds(ol_item,unit)}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import result_page_mixin from "src/core/vr/mixin/pages/result/result-page-mixin.js";
export default {
  mixins:[result_page_mixin],
  name:'result_page',
}
</script>

<style lang="scss" scoped>
.dynamic-result-page {
  // background: #F8F9FA;
  // background: var(--q-gb-bg-c-18);
}
/*************** 给一个内下边距开始 *************** -S*/
.dynamic-main {
  padding-top: 0.09rem;
  padding-bottom: 0.09rem;
  margin: 0 0.08rem;
}

/*************** 给一个内下边距结束 *************** -E*/
/*************** 排名最后一个子元素开始 *************** -S*/
.dynamic-main :last-child {
  border-bottom: none;
}

/*************** 排名最后一个子元素结束 *************** -E*/
/*************** 赛马名称开始 *************** -S*/
.dynamic-title {
  height: 0.48rem;
  line-height: 0.48rem;
  border-radius: 0.08rem;
  background: var(--q-gb-bg-c-28);
  box-shadow: 0px 2px 6px 0px #0000000A;
}

/*************** 赛马名称结束 *************** -E*/
.bg-two {
  margin: 0.08rem 0;
}

/*************** 灰色分割线开始 *************** -S*/
.border-gray {
  position: relative;
  border-radius: .08rem;

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
  //   border-radius: 0.16rem;
  //   overflow: hidden;
  // }
}


/*************** 灰色分割线结束 *************** -E*/
/*************** 马类编号开始 *************** -S*/
.virtual-num {
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  margin-left: 0.22rem;
  text-align: center;
  background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png")  no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

.virtual-on {
  width: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  text-align: center;
  background: url($SCSSPROJECTPATH+"/image/png/virtual_num.png")  no-repeat 0 0 / 100%;
  --per: -0.3rem;
}

.border_right {
  display: flex;
}

.margin_sty {
  margin: 0 0.02rem 0 0.02rem;
}

/*************** 编号结束 *************** -E*/
/*************** 名开始 *************** -S*/
.virtual-name {
  margin-left: 0.1rem;
  font-size: 0.14rem;
  line-height: 0.18rem;
  font-weight: bold;
}

/*************** 名结束 *************** -E*/
/*************** 排名开始 *************** -S*/
.count-style {
  width: 0.5rem;
  text-align: center;
  font-size: 0.16rem;
  letter-spacing: 0;
  font-weight: 600;
  border-radius: 0 8px 8px 0;
}

/*************** 排名结束 *************** -E*/
.fat-vir-result {
  margin: 0 0.08rem;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.1rem;
}
.row {
  gap: 0.08rem
}
/*************** 背景颜色 *************** -E*/
.bg-color {
  text-align: center;
}

/*************** 背景颜色 *************** -E*/
.bor-btm {
  height: 0.84rem;
  // background-color: #fff;
  background: var(--q-gb-bg-c-28);
  flex-grow: 1;
  flex-basis: 31%;
  border-radius: 0.08rem;
  box-shadow: 0px 2px 6px 0px #0000000A;
  margin-bottom: 0.08rem;
}

/*************** 赛果名称开始 *************** -S*/
.play-name {
  font-size: 12px;
  line-height: 12px;
  margin: 0.1rem 0 0.08rem 0;
}

/*************** 赛果名称结束 *************** -E*/
/*************** 赛果单小 *************** -S*/
.result-style {
  height: 0.4rem;
  text-align: center;
}

/*************** 赛果单小 *************** -E*/
.result-sty {
  font-size: 0.12rem;
  line-height: 0.12rem;
  margin: 0.12rem 0 0.13rem 0;
  &+div {
    color: var(--q-gb-t-c-20);
    font-weight: 700;
  }
}

.item-ov {
  padding: 0 0.08rem;
  font-size: 0.14rem;
  letter-spacing: 0;
  line-height: 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  // background-color: #fff;
  background: var(--q-gb-bg-c-28);
  border-radius: 0.08rem;
  box-shadow: 0px 2px 6px 0px #0000000A;
}

.ov-style {
  margin-top: 0.06rem;
  font-size: 0.14rem;
  letter-spacing: 0;
  text-align: center;
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

/*************** 编号背景色结束 *************** -S*/
</style>
src/core/vr/mixin/pages/result/result-page-mixin.js