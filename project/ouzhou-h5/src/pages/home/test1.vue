<template>
  <section id="container">
    <div class="content" v-for="item, index in match_list" :key="item.mid" :data-mid="item.mid" :data-index="index"
       :style="`height:${get_inner_height(item, index)}px`">
        <MatchItem
          :index="index"
          :item="item">
        </MatchItem>
    </div>
  </section>
</template>
 
<script setup>
import lodash from 'lodash'
import { compute_local_project_file_path } from 'src/output/index.js'
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchItem from "./test-item.vue"; 
import { onMounted, computed, watch, ref } from 'vue';
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
const defer_render = use_defer_render()
const target_entries = ref([])
let timer = null
onMounted(() => {
  MatchMeta.set_origin_match_data()
  setTimeout(() => {
    const ob = new IntersectionObserver(
      (entries) =>{
        handler_observer_intersecting(entries)
      },
      {
        root: document.getElementById('container'),
        threshold: 0,
        rootMargin: "300px 0px 300px 0px"
      }
    )
    const match_list = document.querySelectorAll('#container .content')
    match_list.forEach(match => {
      ob.observe(match)
    })
  }, 2000)
})

const match_list = computed(() => {
  return MatchMeta.complete_matchs.slice(0, 200)
})

const handler_observer_intersecting = (entries) => {
  for(const entry of entries) {
    const match = entry.target
    const mid = match.dataset.mid
    const index = match.dataset.index
    const key = `mid_${mid}`
    if (entry.isIntersecting) {
      handler(key, true)
      // Object.assign(show_match_info.value, {
      //   [key]: true
      // })
    } else {
      handler(key, false)
      // Object.assign(show_match_info.value, {
      //   [key]: false
      // })
    }
  }
}

 const handler = (key, falg) => {
  const start = Date.now()
  requestAnimationFrame(() => {
    // 当前渲染帧 有剩余 则 渲染
    if (Date.now() - start < 30) {
      MatchResponsive.set_show_match_info(key, falg)
    }  else {
      handler(key, falg)
    }
  })
 }

//  watch(() => MatchMeta.complete_matchs, () => {
//     MatchMeta.complete_matchs.forEach((t, index) => {
//       const key = `mid_${t.mid}`
//       Object.assign(show_match_info.value, {
//         [key]: index < 20 ? true : false
//       })
//     })
//  }, { deep: true })


const get_inner_height = (item, index) => {
  return VirtualList.get_match_total_height(item, index)
}


</script>
 
<style scoped lang="scss">
 section{
  overflow: auto;
  height: 667px;
  .content{
    content-visibility: auto;
    background-size: 100% 100%;
    background-image: url($SCSSPROJECTPATH+'/image/list/skeleton-white.png');
  }
 }
</style>