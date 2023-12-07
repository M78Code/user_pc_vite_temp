<template>
  <section id="container">
    <div class="content" v-for="item, index in MatchMeta.complete_matchs" :key="item.mid" :data-mid="item.mid" :data-index="index"
       :style="`height:${get_inner_height(item, index)}px`">
      <template v-if="defer_render(index) && is_show(item)">
        <MatchContainerMainTemplate1
          :i="index"
          :match_of_list="item">
        </MatchContainerMainTemplate1>
      </template>
      <template v-else>
        <img class="standard-img" :src="compute_local_project_file_path('/image/list/list-bg-standard-white.jpg')" alt="">
      </template>
    </div>
  </section>
</template>
 
<script setup>
import { compute_local_project_file_path } from "src/output/index.js"
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template1.vue"; 
import { onMounted, computed, watch, ref } from 'vue';
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';
const defer_render = use_defer_render()
const show_match_info = ref({})
let timer = null
onMounted(() => {
  MatchMeta.set_origin_match_data()
  setTimeout(() => {
    const ob = new IntersectionObserver(
      (entries) =>{
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
      },
      {
        root:  document.getElementById('container'),
        threshold: 0,
        rootMargin: "500px 0px 500px 0px"
      }
    )
    const match_list = document.querySelectorAll('#container .content')
    match_list.forEach(match => {
      ob.observe(match)
    })
  }, 2000)
})

 const handler = (key, falg) => {
  const start = Date.now()
  requestAnimationFrame(() => {
    // 当前渲染帧 有剩余 则 渲染
    if (Date.now() - start < 16.6) {
      Object.assign(show_match_info.value, {
        [key]: falg
      })
    }  else {
      handler(key, falg)
    }
  })
 }

 watch(() => MatchMeta.complete_matchs, () => {
    MatchMeta.complete_matchs.forEach((t, index) => {
      const key = `mid_${t.mid}`
      Object.assign(show_match_info.value, {
        [key]: index < 20 ? true : false
      })
    })
 }, { deep: true })

const is_show = (item) => {
  const key = `mid_${item.mid}`
  return show_match_info.value[key]
}

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
    .standard-img{
      height: 100%;
      width: 100%;
    }
  }
 }
</style>