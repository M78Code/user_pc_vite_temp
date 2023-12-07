<!--
 * @Description: 渲染可视区赛事组件
-->

<template>
  <section class="observer-container">
    <div class="observer-item" 
      v-for="item, index in match_list" 
      :key="item.mid" 
      :data-mid="item.mid" 
      :data-index="index"
      :style="get_item_style(item, index)">
      <!-- 赛事卡片 -->
      <slot name="content" :item="item" :index="index"></slot>
      <!-- 骨架图 -->
      <!-- <template v-else>
        <slot name="skeleton"></slot>
      </template> -->
    </div>
  </section>
</template>
 
<script setup>
import lodash from 'lodash'
import { onMounted, computed, watch, ref } from 'vue';
import { compute_local_project_file_path, project_name } from 'src/core'
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { skeleton_white_ouzhou_110, skeleton_white_ouzhou_90 } from 'src/base-h5/core/utils/local-image.js'

const props = defineProps({
  // 渲染数据
  match_list: {
    type: Array,
    required: true
  }
})

// 当前可视区的 mids 用于获取赔率
const active_mids = ref([])

onMounted(() => {
  setTimeout(() => {
    handle_start_observer()
  }, 2000)
})

/**
 * @description 开启 IntersectionObserver 赛事卡片监听
 */
const handle_start_observer = () => {
  const ob = new IntersectionObserver((entries) =>{
    for(const entry of entries) {
      const item = entry.target
      const mid = item.dataset.mid
      // const index = item.dataset.index
      const key = `mid_${mid}`
      if (entry.isIntersecting) {
        // 在可视区内 显示DOM节点
        handler(key, true)
        active_mids.value.push(mid)
        get_match_base_by_mids()
      } else {
        // 可视区外 删除 DOM 节点
        handler(key, false)
        remove_match(mid)
      }
    }
  },
  {
    root: document.querySelector('.observer-container'),
    threshold: 0,
    rootMargin: "300px 0px 300px 0px"
  }
  )
  const nodes = document.querySelectorAll('.observer-container .observer-item')
  const length = lodash.get(nodes, 'length', 0)
  length > 0 && nodes.forEach(node => {
    ob.observe(node)
  })
}

/**
 * @description 删除赛事
 */
const remove_match = (mid) => {
  const index = lodash.findIndex(active_mids.value, (t) => t === mid)
  if (index > -1) {
    active_mids.value.splice(index, 1)
  }
}

/**
 * @description 根据当前可视区 mids 获取赛事赔率
 */
const get_match_base_by_mids = lodash.debounce(() => {
  MatchMeta.get_match_base_hps_by_mids({mids: active_mids.value.join(',')})
}, 1000)

/**
 * @description 依据浏览器帧渲染 赛事DOM， 不影响页面渲染
 */
const handler = (key, falg) => {
  const start = Date.now()
  requestAnimationFrame(() => {
    // 当前渲染帧 有剩余 则 执行渲染任务
    if (Date.now() - start < 30) {
      MatchResponsive.set_show_match_info(key, falg)
    }  else {
      handler(key, falg)
    }
  })
}

// 卡片高度
const get_inner_height = (item, index) => {
  return VirtualList.get_match_total_height(item, index)
}

const get_background_image = (height) => {
  let image_src = ''
  if (project_name === 'ouzhou-h5') {
    if (height > 100) {
      image_src = skeleton_white_ouzhou_110
    } else {
      image_src = skeleton_white_ouzhou_90
    }
  }
  return image_src
}

const get_item_style = (item, index) => {
  const height = get_inner_height(item, index)
  const skeleton = get_background_image(height) 
  return {
    height: `${height}px`,
    backgroundImage: `url(${skeleton})`
  }
}


</script>
 
<style scoped lang="scss">
.observer-container{
  overflow: auto;
  height: 667px;
  .observer-item{
    content-visibility: auto;
    background-size: 100% 100%;
    background-image: url($SCSSPROJECTPATH+'/image/list/skeleton-white.png');
  }
 }
</style>