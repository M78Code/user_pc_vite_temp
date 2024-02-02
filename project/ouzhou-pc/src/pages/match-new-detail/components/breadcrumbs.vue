<!--
 * @Author: cooper
 * @Date: 2023-07-07 14:13:55
 * @Description: 赛事详情页面包屑
-->
<template>
  <div class="detail-bread">
    <div class="detail-bread-item " style="cursor: pointer;" @click="jumpTo">
      <span >{{ breadCrumbs_firstOne}}</span>
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/t_left.png`" alt="">
    </div>
    <div class="detail-bread-item" @click="jumpToLeagues()">
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
import {LOCAL_PROJECT_FILE_PREFIX, MenuData } from 'src/output/index.js'
import BaseData from "src/core/base-data/base-data.js";
import lodash_ from "lodash"

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
/*
* 面包屑导航第一项内容展示
* 显示左侧菜单项或这头部导航项
* 页面刷新路由重复添加一次，解决该问题
* 48448 【SIT】【欧洲版二期】【PC】经常访问，足球，详情页面，没有菜单导航
* */
let firstOneName = ref('')
const breadCrumbs_firstOne = computed(()=>{
    const { lv1_mi = void (0) } = MenuData.left_menu_result
    const { csid = 1 } = props.detail_info
    // 电子竞技
    if ([100,101,102,103].includes(+csid)) {
      return BaseData.menus_i18n_map[2000]
    }
    // 经常访问菜单类型为0
    /*
    * 经常访问菜单类型为0
    * 全部菜单类型为1
    * */
    //i18n 球种名称要等 元数据的值 所有要等元数据变化才能拿到i18n的值
    if(!!lv1_mi&&BaseData.base_data_version.value){
        firstOneName = BaseData.menus_i18n_map[lv1_mi]
    }else {
        let history = JSON.parse(window.sessionStorage.getItem('RouteHistory'))
        firstOneName = ['home','in_play','bet_record'].includes(history[1]?.name) ? history[1]?.i18n : props.detail_info.csna
    }
   // 滚球的时候需要i18n_t 国际化转换 ，点击菜单其他球种不用
    return  firstOneName?firstOneName.includes('.')? i18n_t (String(firstOneName)):firstOneName:'-'
})

const jumpTo = ()=>{
  // router.go(-1)
  let route_name = lodash_.get(MenuData.router_info,'pre_route') || 'home'

  let history = JSON.parse(window.sessionStorage.getItem('RouteHistory'))
  if (route_name == 'league') {
    jumpToLeagues()
  } else {
    router.push({name:history[1]?.name})
  }
}
const jumpToLeagues  = () => {
  const { csid = 1, tid, tn } = props.detail_info
  let mid_config = {
    ...MenuData.mid_menu_result,
    md: '',
    filter_tab: 4002
  }
  localStorage.setItem('league_name', props.detail_info.tn)
  MenuData.set_mid_menu_result(mid_config)
  console.log("--------------------------------",MenuData.is_esports())
  if(MenuData.is_esports()){
    jumpTo()
  }else{
    router.push(`/league/${csid}/${tid}/2`)
  }
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
  margin-left: 14px;
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
    cursor: pointer;
    img {
      height: 12px;
      margin: 0 10px 4px 10px;

    }
  }
}
</style>
  src/output/index.js