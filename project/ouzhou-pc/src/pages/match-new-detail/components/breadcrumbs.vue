<!--
 * @Author: cooper
 * @Date: 2023-07-07 14:13:55
 * @Description: 赛事详情页面包屑
-->
<template>
  <div class="detail-bread">
    <div class="detail-bread-item " style="cursor: pointer;" @click="jumpTo">
      <span >{{ breadCrumbs_firstOne() }}</span>
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
import {LOCAL_PROJECT_FILE_PREFIX, MenuData } from 'src/core/index.js'
import BaseData from "src/core/base-data/base-data.js";
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


// 面包屑导航第一项展示

const breadCrumbs_firstOne = function (){
    // console.log(BaseData.left_menu_base_mi,"==BaseData.left_menu_base_mi")
    // console.log(BaseData.menus_i18n_map,"==BaseData.left_menu_base_mi")
    // console.log(MenuData.left_menu_result,"==MenuData.left_menu_result")   // 表示选中的菜单
    const { lv1_mi } = MenuData.left_menu_result
    let firstOneName = ''
    if(!!lv1_mi){
        // MenuData.left_menu_result.lv1_mi  == item.mi && MenuData.left_menu_result.menu_type==1
        // 找出左侧选中菜单
        const leftMenu_selected = BaseData.left_menu_base_mi.find(item=>{
            return item.mi === lv1_mi && MenuData.left_menu_result.menu_type == 1
        })
        firstOneName = BaseData.menus_i18n_map[leftMenu_selected.mi]
    }else {
        let history = JSON.parse(window.sessionStorage.getItem('RouteHistory'))
        firstOneName = ['home','in_play','bet_record'].includes(history[1]?.name) ? history[1]?.title : props.detail_info.csna
    }
    return firstOneName
}

const jumpTo = ()=>{
  router.go(-1)
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
  