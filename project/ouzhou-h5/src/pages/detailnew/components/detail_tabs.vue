<template>
  <div>
    <div class="component detail-tabs">
      <div class="match-detail-tabs" ref="reset_scroll_dom">
        <template v-for="(item, index) in category_list" :key="item.id" >
          <span class="tabs-item" @click="tabClick(item, index)"
          :class="[{ 'is-active': item.id === active.id }]"
          >{{ item.marketName}}</span>
        </template>
      </div>
      <div class="separator"></div>
      <div class="all-change" @click="AllCloseControl.unfold = !AllCloseControl.unfold">
        <span class="odds-hpn-icon" :class="AllCloseControl.unfold?'down':'up'"></span>
      </div>
    </div>
    <q-separator color="orange"/>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AllCloseControl from "./AllCloseControl";

const props = defineProps({
  category_list: {
    type: Array,
    default: () => [],
  },
  active: {
    type: Object,
    default: () => ({}),
  },
});
const reset_scroll_dom = ref(null);
const emit = defineEmits(['detail_tabs_change','update:allCloseState'])
// 事件执行函数

/**
 *@description // 触发切换玩法tab
 *@param {obj} item 请求参数
 *@return {obj}
 */
const tabClick = (item, index) => {
  // active.value = item.id
  emit('detail_tabs_change', item)
  // console.log("reset_scroll_dom", reset_scroll_dom.value.clientWidth);
  tabMove(index)
  // tab_move2(index, reset_scroll_dom.value);
}
const offset = window.screen.availWidth/2
function tabMove(index){
  /** @type {HTMLElement} */ const scrollDom = reset_scroll_dom.value
  /** @type {HTMLElement} */ const activeItem = scrollDom.children[index]
  scrollDom.scrollTo(activeItem.offsetLeft - offset + activeItem.offsetWidth/2,0)
}
//#region 一个破动画怎么要写这么多代码啊, 写的真变态啊 看我写一个tabMove
/**
 * 点击自定义的tab 选项滑动到中间动画
 * 1)先让选中的元素滚到可视区域的最左边 scrollLeft
 * 2)接着向右移动容器一半的距离 containWidth / 2
 * 3)最后向左移动item一半的距离 offsetWidth / 2
 * @param  {Object} （currentIndex 点击的下标，scrollBox 点击下标的父元素）
 * @return {Undefined} undefined
 * @deprecated 怎么要写这么多代码啊, 写的真变态啊 看我写一个tabMove
 * 
 */
const tab_move2 = (currentIndex, scrollBox, whether_to_slide) => {
  // debugger
  if(!scrollBox || !scrollBox.children || !scrollBox.children[currentIndex]) return
  let item = scrollBox.children[currentIndex]
  let lastSpot = scrollBox.scrollLeft
  let nextSpace = whether_to_slide ? 70 : 7 //每次移动距离
  if(whether_to_slide == 'no_fast') nextSpace = 7
  let scrollItemTimer2 = null;
  clearInterval(scrollItemTimer2)
  scrollItemTimer2 = setInterval(() => {
    if(!item) return;
    let offsetWidth = item.offsetWidth //item
    let scrollLeft = item.offsetLeft //选中的元素滚到可视区域的最左边
    const containWidth = scrollBox.offsetWidth //容器的宽度
    let resultSpot = scrollLeft + offsetWidth / 2 - containWidth / 2 //最终要停留的点
    if (Math.abs(lastSpot - resultSpot) < nextSpace) {
      clearInterval(scrollItemTimer2)
    }
    if (resultSpot >= lastSpot) {
      lastSpot = lastSpot + nextSpace
    } else {
      lastSpot = lastSpot - nextSpace
    }
    try {
      scrollBox.scrollTo(lastSpot, 0)
    } catch (error) {
      console.error(error)
    }
  }, whether_to_slide ? '' : 15)
};
//#endregion

//#endregion

onMounted(() => {
  // console.log("reset_scroll_dom", reset_scroll_dom.value);
});
</script>

<style lang="scss" scoped>
.component.detail-tabs{
  display: flex;
  align-items: center;
  background-color: var(--q-gb-bg-c-2);
  padding-left: 16px;
  height: 50px;
}
.separator{
 width: 8px; 
 height: 100%;
 color: #D9D9D9;
}
.all-change{
  width: 44px;
  height: 100%;
  background-color: var(--q-gb-bg-c-2);
  display: flex;
  justify-content: center;
  align-items: center;
  .odds-hpn-icon{
    width: 0.14rem;
    height: 0.14rem;
    background: url($SCSSPROJECTPATH+"/image/detail/down.png") no-repeat center;
    transition: transform .5s cubic-bezier(0, 0.5, 0, 1);
    &.up{
      transform: scaleY(-1);
    }
  }
}

.match-detail-tabs {

  flex: 1;
  height: 50px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  // border-bottom: 1px solid #FF7000;
  transition: 2s all;
  display: flex;
  align-items: center;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  .tabs-item {
    margin-right: 10px;
     display: block;
    //  min-width: 50px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    width: auto;
    padding: 0 10px;
    white-space: nowrap;
    text-transform: capitalize;
    color: var(--q-gb-t-c-4);
    cursor: pointer;
    scroll-snap-align: center center;
  }

  .is-active {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-transform: capitalize;
    // color: #FF7000;
    background: var(--q-gb-bg-c-1);
    //color: #fff;
    color: var(--q-gb-t-c-2);
    position: relative;
    border-radius: 15px;
    padding: 4px 10px;
    // &::before{
    //   content:'';
    //   position: absolute;
    //   bottom: -14px;
    //   left: 5%;
    //   right:5%;
    //   width:90%;
    //   height: 3px;
    //   background: #FF7000;
    // }
    .match-detail-line {
      height: 1px;
      //background: #FF7000;
      background-color: var(--q-gb-bg-c-1);
      position: fixed;
      width: 100vw;
    }
  }
}
</style>
