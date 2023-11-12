<!--
 * @Author: cooper
 * @Date: 2023-07-07 14:13:55
 * @Description: 赛事详情页面包屑
-->
<template>
  <div class="detail-bread">
    <div class="detail-bread-item " style="cursor: pointer;" @click="jumpTo">
      <span >{{ detail_info.csna }}</span>
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/t_left.png`" alt="">
    </div>
    <div class="detail-bread-item">
      <span>{{ detail_info.tn }}</span>
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/t_left.png`" alt="">
    </div>
    <div class="text-bread_av_color">
      <span>{{ last_label }}</span>
    </div>
  </div>
</template>
  
<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute,useRouter } from 'vue-router'
import {LOCAL_PROJECT_FILE_PREFIX } from 'src/core/index.js';
const props = defineProps({
  detail_info: {
    type: Object,
    default: () => { }
  },
})
const route = useRoute()
const router = useRouter()
const bread_list = ref([])
const last_label = computed(() => {
  return `${props.detail_info.mhn} vs ${props.detail_info.man}`
})
watch(() => route.path, (newVal) => {
  //  console.log(111111111111111,route)
},
  { immediate: true }
)

const jumpTo = ()=>{
// console.log(111111,route)
 
  router.push({
    name:'home'
  })
}





</script>
<style lang="scss">
.text-bread_color {
  color: #B5B5B5;
}

.text-bread_av_color {
  color: #ffffff;
  font-weight: 500;
  width: 80%;
  text-overflow: ellipsis;
   overflow: hidden;
  white-space: nowrap;
}

.text-bread_chevron {
  color: #B5B5B5;

}
</style>
  
<style lang="scss" scoped>
.detail-bread {
  margin-left: 20px;
  display: flex;
  align-items: center;
  width: 80%;
  text-overflow: ellipsis;
   overflow: hidden;
  white-space: nowrap;

  .detail-bread-item {
    color: #B5B5B5;
    display: flex;
    align-items: center;

    img {
      height: 12px;
      margin: 0 10px 4px 10px;

    }
  }
}
</style>
  