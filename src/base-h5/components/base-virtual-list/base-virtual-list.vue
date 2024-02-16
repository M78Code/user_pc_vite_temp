
<template>
  <div :class="['outContainer', { 'skeletonContainer': show_skeleton_screen }]">
    <!-- 骨架图 -->
    <template v-if="show_skeleton_screen">
      <div class="skeletonBox"><SList :loading_body="true" /></div>
    </template>
    <!-- 滚动容器 -->
    <div class="scrollerContainer" ref="scrollerContainerRef" @scroll="onScroll">
      <!-- <div class="pillarDom" :style="get_container_style"></div> -->
      <div class="pillarDom" :style="{ height: `${pillarDomHeight}px` }"></div>
      <div class="contentList" :style="styleTranslate" ref="contentListRef">
        <!-- :data-mid="item.mid" :data-index="index" :data-source-index="item.source_index" -->
        <div class="item" v-for="item, index in renderData" :key="item.mid" :data-mid="item.mid" :data-pos="get_match_pos(item.mid)">
          <slot name="default" :item="item" :index="index"></slot>
        </div>
        <!-- 到底了容器-->
        <!-- <div :class="['loading-more-container']" v-if="isScrolledRealBottom && isShowMoreWrapper">
          <div style="color:#AAAEB8;font-size:.12rem;"> {{ i18n_t("scroll_wrapper.is_footer") }} </div>
        </div> -->
      </div>
    </div>
  
  </div>
  <!-- 回到顶部按钮组件 -->
  <template v-if="isShowGoTop">
    <ScrollTop :list_scroll_top="rollingHeight" to_com=".outContainer" @back-top="gotTop" />
  </template>
</template>

<script setup>
import { computed, markRaw, nextTick, onMounted, onUnmounted, onUpdated, ref, toRefs, watch } from 'vue'

import { useMittEmit, useMittOn, MITT_TYPES, MenuData, compute_css_obj } from "src/output"

import SList from "src/base-h5/components/skeleton/skeleton-list.vue" 
import ScrollTop from "src/base-h5/components/common/record-scroll/scroll-top.vue";


const props = defineProps({
  cacheCount: {
    type: Number,
    default: 5,
  },
  dataList: {
    type: Array,
    default: () => []
  },
  isShowGoTop: {
    type: Boolean,
    default: true
  },
  // （预估高度）
  estimateHeight: {
    type: Number,
    default: 100
  }
})

const emits = defineEmits(["onUpdate"]);

const { cacheCount, dataList, estimateHeight } = toRefs(props)

const rollingHeight = ref(0)
const show_skeleton_screen = ref(false)

// 所有数据
const allData = ref([])
let positionDataArr = []

/**
 * 子节点高度: allData最后一个元素的endPos值
 * 用于撑开滚动容器的高度
 */
const pillarDomHeight = ref(0)
/**
 * 内容列表容器dom
 */
const contentListRef = ref()
/**
 * 滚动容器. 支持显示滚动条的容器。确定虚拟列表的可视区高度
 */
const scrollerContainerRef = ref()
/**
 * 滚动容器高度(视口高度)。采用计算属性方式动态获取滚动容器高度
 */
const scrollerContainerRefHeight = computed(() => {
  return scrollerContainerRef.value ? scrollerContainerRef.value.offsetHeight : 0
})
/**
 * 当前视口第一个数据在allData数组的索引位置. 默认:0
 */
const start = ref(0)
/**
 * 视口第一个元素底部位置与与视口顶部(scrollTop)的偏移量
 */
let startOffset = 0
/**
 * 是否正在修正scrollTop位置
 */
let fixingScrollTop = false
let lastScrollTop = 0
/**
 * 是否向下滚动
 */
let isPositive = true
/**
 * 当前视口最后一个数据在positionDataArr数组的索引位置
 */
const end = computed(() => {
  if (!allData.value || allData.value.length <= 0) return 15

  // 将start.value作为遍历positionDataArr的开始位置
  let endPos = start.value || 0
  // contentDomTotalHeight存放从start位置开始的dom节点总高度
  let contentDomTotalHeight = positionDataArr[endPos]?.height
  // 获取视口高度
  const viewPortHeight = scrollerContainerRefHeight.value
  // 从start位置开始遍历positionDataArr的同时，统计数据dom节点的累计高度，直至累计高度超过了视口高度
  while (contentDomTotalHeight < viewPortHeight) {
    endPos++
    contentDomTotalHeight += positionDataArr[endPos]?.height
  }
  // 因为数组的slice方法是包头不包尾的所以还需要再endPos上+1，才会是预期的元素数量
  endPos += 1
  // 因为存在在某个元素位置开区间滚动的情况，此时该元素不会完全移出视口，但又使得视口多出了位置，因此要再+1，渲染下一个元素来占满视口区域
  return endPos + 1
})
/**
 * 内容容器的y轴偏移量。当渲染区域第一个元素完全移到了可视区域之外时，需要重新计算startOffset，将第一个元素移动回可视区域
 */
const contentListOffset = ref(0)
const styleTranslate = computed(() => {
  return `transform:translate(0,${contentListOffset.value}px)`
})
/**
 * 当前视口需要显示的数据
 */
const renderData = computed(() => {
  const _cacheCount = cacheCount.value
  const realStart = Math.max(0, start.value - _cacheCount)
  // 避免最后一个元素的数组下标超出实际的数组长度
  const realEnd = Math.min(end.value + _cacheCount, allData.value.length)
  const resultData = allData.value.slice(realStart, realEnd)
  emits("onUpdate", resultData);
  return resultData
})

const emitters = ref({})

onMounted(() => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_GOT_TO_TOP, gotTop).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_SHOW_SKELETON_DIAGRAM, (val) => {
      show_skeleton_screen.value = val
      show_skeleton_screen.value && reset_show_skeleton_state()
    }).off,
    // 重置赛事位置
    emitter_3: useMittOn(MITT_TYPES.EMIT_RESET_POSITION, () => {
      positionDataArr = []
    }).off,
  };
})

onUpdated(() => {
  nextTick(() => {
    updateHeightAndPos()
  })
})

watch(dataList, (v, o) => {
  //如果是排序的话 length不会变化 但是mid集合顺序会变 列表变也是一样  赔率变化mid顺序是一样就是一样 不进入
  // if (lodash.map(v, 'mid').join() != lodash.map(o, 'mid').join()) {
    nextTick(() => {
      initDataPostion()
    })
  // }
}, { immediate: true })

// 初始化 DOM 节点位置信息
const initDataPostion = () => {
  if (dataList.value.length < 1) return
  allData.value = dataList.value.map((item, idx) => markRaw({ ...item, arrPos: idx }))
  const length = lodash.get(positionDataArr, 'length', 0)
  // ws 触发的赛事新增 赛事移除 做的是 补偿修正操作
  if (length > 0) {
    let startPosition = 0
    const length = lodash.get(positionDataArr, 'length', 0)
    if (length < 1) return
    allData.value.forEach((t, index) => {
      const list = positionDataArr.find(l => l.mid === t.mid)
      t.sHeight = list?.height || t.estimateHeight
      t.startPos = startPosition
      t.endPos = startPosition + t.sHeight
      startPosition = t.endPos
      // // 赛事新增
      // if (!list) {
      //   const prev_item = positionDataArr[index -1]
      //   if (prev_item) {
      //     startPosition += list.estimateHeight
      //     t.startPos = prev_item.endPos
      //     t.endPos = prev_item.endPos + list.estimateHeight
      //   }
      // } else {
      //   t.startPos = list.startPos + startPosition
      //   t.endPos = list.endPos + startPosition
      // }
    })
    positionDataArr = allData.value.map((item, idx) => {
      return {
        arrPos: idx,
        mid: item.mid,
        height: item.sHeight || item.estimateHeight,
        startPos: item.startPos,
        endPos: item.endPos
      }
    })
  } else {
    positionDataArr = allData.value.map((item, idx) => {
      return {
        arrPos: idx,
        mid: item.mid,
        height: item.estimateHeight || estimateHeight.value,
        startPos: (item.estimateHeight || estimateHeight.value) * idx,
        endPos: (item.estimateHeight || estimateHeight.value) * idx + (item.estimateHeight || estimateHeight.value),
      }
    })
  }
}

/**
 * 更新DOM位置信息
 */
const updateHeightAndPos = () => {
  const contentListDom = contentListRef.value
  if (!contentListDom) return

  const childrenElementArr = contentListDom.children
  for (let i = 0; i < childrenElementArr.length; i++) {
    const childEle = childrenElementArr[i]
    // 获取当前数据dom节点的数据再allData数组中的索引位置
    const dataStrMid = childEle.dataset['mid']
    if (!dataStrMid) continue

    // 从allData数据中获取到该数据
    const dataItem = positionDataArr.find(t => t.mid == dataStrMid)
    if (!dataItem) continue

    const dataIndex = positionDataArr.findIndex(t => t.mid == dataStrMid)

    // 获取元素的实际高度
    // const { height } = childEle.getBoundingClientRect()
    const { offsetHeight: height } = childEle
    const oldHeight = dataItem.height
    /*
     * 计算当前数据dom元素的旧高度和当前高度的差值
     * 如：
     * oldHeight为100px，height为50px, 那么dffVal为 50px，那么 oldHeight - dffVal 为 50px
     * oldHeight为50px，height为100px, 那么dffVal为 -50px，那么 oldHeight - dffVal 为 100px
     */
    const dffVal = oldHeight - height
    if (dffVal != 0) {
      // 当前dom元素的实际高度与allData中记录的高度不一致，则更新高度以及元素位置信息
      dataItem.height = height
      dataItem.endPos = dataItem.endPos - dffVal

      for (let j = dataIndex + 1; j < positionDataArr.length; j++) {
        const jPosDataItem = positionDataArr[j]
        // j位置的上一个位置的元素
        const jPrevPosDataItem = positionDataArr[j - 1]

        jPosDataItem.startPos = jPrevPosDataItem.endPos
        jPosDataItem.endPos = jPosDataItem.startPos + jPosDataItem.height
      }
    }
  }
  pillarDomHeight.value = positionDataArr.length > 0 ? positionDataArr[positionDataArr.length - 1]?.endPos : 0
}

/**
 * 当向上滚动时修正scrollTop值
 */
const fixScrollTopWhenNotPositive = () => {
  if (fixingScrollTop) return

  const scrollerContainerDom = scrollerContainerRef.value
  if (!scrollerContainerDom) return

  // 视口第一个元素底部位置与视口顶部位置存在偏移量，且是向上滚动，则需要修正scrollTop值
  if (startOffset > 0 && !isPositive) {
    // 无论新增动态项的实际高度是比记录的高度高还是比记录的高度低，这里都将scrollTop的位置修正为视觉上视口顶部距离视口第一个元素底部有startOffset个间隔的位置
    const newScrollTop = positionDataArr[start.value]?.endPos - startOffset
    fixingScrollTop = true
    nextTick(() => {
      scrollerContainerDom.scrollTo({ top: newScrollTop })
      fixingScrollTop = false
    })
  }
}
/**
 * 判断滚动容器是否滚动到了真正的最底部
 */
const isScrolledRealBottom = computed(() => {
  const scrollerContainerDom = scrollerContainerRef.value
  if (!scrollerContainerDom) return false

  const { scrollTop, scrollHeight, clientHeight } = scrollerContainerDom
  return isRealScrollEnd(scrollTop, scrollHeight, clientHeight)
})

/**
 * 滚动容器是否大于父元素高度
 */
const isShowMoreWrapper = computed(() => {
  return pillarDomHeight.value >= scrollerContainerRef.value?.offsetHeight
})

/**
 * 是否滚动到最底部
 */
const isRealScrollEnd = (scrollTop, scrollHeight, clientHeight) => {
  Math.abs(scrollHeight - clientHeight - scrollTop) < 1
  return Math.abs(scrollHeight - clientHeight - scrollTop) < 1
}

const onScroll = (evt) => {
  // 如果处于修正scrollTop的状态，则不执行scroll回调
  if (fixingScrollTop) return

  const scrollerContainerDom = evt.target
  if (!scrollerContainerDom) return

  const { scrollTop } = scrollerContainerDom
  
  const length = lodash.get(positionDataArr, 'length', 0)

  if (length < 1) {
    start.value = 0
    contentListOffset.value = 0
  } else {
    handler_render_data(scrollTop)
    useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_SCROLLING);
  }
}

/**
 * 计算 end index
 */
const handler_render_data = (scrollTop = 0) => {

  rollingHeight.value = scrollTop

  // 正数或0表示向下滚动
  isPositive = scrollTop - lastScrollTop >= 0
  lastScrollTop = scrollTop

  start.value = findStartByBinarySearch(positionDataArr, scrollTop)

  // 记录视口第一个元素底部位置与scrollTop之间的偏移量，用于onUpdate中修正scrollTop
  startOffset = positionDataArr[start.value]?.endPos - scrollTop

  const _cacheCount = cacheCount.value
  const realStart = Math.max(0, start.value - _cacheCount)
  contentListOffset.value = positionDataArr[realStart]?.startPos
}

/**
 * 通过二分查找来获取start值
 *
 * @param   {ContentPosition[]}  _positionDataArr  [_positionDataArr description]
 * @param   {number}             scrollTop         [scrollTop description]
 *
 * @return  {[]}                                   [return description]
 */
const findStartByBinarySearch = (_positionDataArr, scrollTop) => {
  let startIdx = 0
  let endIdx = _positionDataArr.length - 1
  let resultIdx;
  while (startIdx <= endIdx) {
    // Math.trunc 去除小数部分，只取整数部分. 取startIdx 到 endIdx的中间索引号
    const middleIdx = Math.trunc((startIdx + endIdx) / 2)
    // 获取中间索引号对应元素的位置信息
    const middleEle = _positionDataArr[middleIdx]
    // 获取中间索引号对应元素的底部位置
    const middleEleEndPos = middleEle.endPos
    if (middleEleEndPos === scrollTop) {
      // 当前滚动高度等于中间索引号对应元素的底部位置，则start为中间索引号的下一个位置
      return middleIdx + 1
    } else if (middleEleEndPos < scrollTop) {
      // 当前滚动高度大于中间索引号对应元素的底部位置，则调整查找区间为右区间
      startIdx = middleIdx + 1
    } else if (middleEleEndPos > scrollTop) {
      // 当前滚动高度大于中间索引号对应元素的底部位置，则调整查找区间为左区间
      if (resultIdx === undefined || resultIdx > middleIdx) {
        // 存储元素 middleEleEndPos>scrollTop 元素的最小数组索引号
        resultIdx = middleIdx
      }
      // 调整查找区间为左区间
      endIdx = middleIdx - 1
    }
  }
  return resultIdx
}

/**
 * 列表回到顶部
 */
const gotTop = () => {
  start.value = 0
  contentListOffset.value = 0
  let timer = setTimeout(() => {
    scrollerContainerRef.value && scrollerContainerRef.value.scrollTo({ top: 0 });
    clearTimeout(timer)
    timer = null
  }, 100)
}

// 骨架图隐藏兜底
const reset_show_skeleton_state = lodash.debounce(() => {
  if (show_skeleton_screen.value) show_skeleton_screen.value = false
}, 8000)


const get_match_pos = (mid) => {
  const item = positionDataArr.find(t => t.mid === mid)
  return lodash.get(item, 'startPos', 0)
}

// 早盘 今日 key 不能一样
const get_match_key = (item) => {
  const menu_lv1 = lodash.get(MenuData, 'current_lv_1_menu_i', 2)
  return `${menu_lv1}_${item?.mid}`
}

const get_container_style = computed(() => {
  const style_obj = { 'height': `${pillarDomHeight.value}px` }
  Object.assign(style_obj, {
    ...compute_css_obj({key: 'h5-kyapp-speciality-bg' })
  })
  return style_obj
})

onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
})

</script>

<style lang="scss" scoped>
.outContainer {
  height: 100%;
  position: relative;
  overflow-y: auto;
  &.skeletonContainer{
    overflow: hidden;
    .skeletonBox{
      height: 100%;
    }
  }
  :deep(.skeleton-wrap){
    position: absolute;
    overflow: hidden;
    margin-top: 0.1rem;
    width: 100%;
    height: calc(100% - 0.1rem);
    padding-top: 0 !important;
    .version_biaozhun{
      padding: 0 5px;
    }
  }
}

.scrollerContainer {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling: touch; /*解决移动端滑动卡顿问题*/
  -webkit-transform: translateZ(0px);/*开启GPU加速*/
}

.pillarDom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
  // background-repeat: repeat-y !important;
}

.contentList {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  // will-change: transform;
  .loading-more-container {
    width: 100%;
    height: 181px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: var(--q-gb-bg-c-18);
  }
}

.item {
  width: 100%;
  // 这里同样很重要，盒模型必须为border-box，item元素的高度才不会因为border值而超出设置的高度
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }
}</style>
