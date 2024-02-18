<!--
 * @Description:  跳转banner图和猜你喜欢
-->
<template>
  <div class="tiaozhuan-panel" :class="{
    'tiaozhuan-panel2':!show_banner2,
    'show-b2':!(show_banner2 && carousel_src.length)
    }">
    <img  src="public/image/common/close.svg" class="delete" @click.self="show_banner = false" v-show="show_banner2 && carousel_src.length">
    <!-- 轮播图组件 -->
    <q-carousel swipeable animated v-model="slide" infinite :autoplay="7000" transition-prev="slide-right" transition-next="slide-left" width="100%" v-show="show_banner2 && carousel_src.length" class="panel2">
      <template v-for="(item,index) in carousel_src" :key="index" >
        <q-carousel-slide :name="index" :img-src="item.imgUrl" @click="confirm(item)" />
      </template>
      <template v-slot:control v-if="carousel_src.length > 1">
        <!-- 控制按钮 -->
        <q-carousel-control position="bottom" :offset="[0, 8]">
          <span v-for="(item,index) in carousel_src" :key="index" class="tab" :class="{'tab2': index == slide}"></span>
        </q-carousel-control>
      </template>
    </q-carousel>
    <!-- 猜你喜欢 -->
    <may-also-like v-show="!show_banner2" :from_where="101" :show_="Boolean(show_banner2)" v-if="GlobalAccessConfig.get_hotRecommend()"></may-also-like>
  </div>
</template>
 
<script setup>
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import lodash from 'lodash'
import { useRouter, useRoute } from 'vue-router'
import store from "src/store-redux/index.js";
import UserCtr from 'src/core/user-config/user-ctr.js'
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { MenuData } from "src/output/index.js"
import mayAlsoLike from "./may-also-like.vue";  // 列表页猜你喜欢

const route = useRoute()
const router = useRouter()
const store_state = store.getState()
// 计时器
const timer = ref(null)
// 显示banner图
const show_banner = ref(true)
// 轮播初始下标
const slide = ref(0)
 // 轮播图片地址
const carousel_src = ref([])

// 商户配置的图片地址和弹框信息
const get_banner_obj = ref(store_state.get_banner_obj)
// 当前选中的二级菜单id
const get_curr_sub_menu_type = ref(MenuData.current_lv_2_menu.type)
const get_golistpage = ref(store_state.get_golistpage)
const get_hot_list_item = ref(store_state.get_hot_list_item)
const get_access_config = ref(store_state.get_access_config)

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_banner_obj.value = new_state.get_banner_obj
  get_golistpage.value = new_state.get_golistpage
  get_hot_list_item.value = new_state.get_hot_list_item
  get_access_config.value = new_state.get_access_config
})

onMounted(() => {
  fetch_actimg()
})

//滚球才有
watch(() => get_curr_sub_menu_type.value, () => {
  fetch_actimg()
})

watch(() => get_banner_obj.value.type2, () => {
  if (get_menu_type === 1) {
    reset_timer()
  }
})

const show_banner2 = computed(() => get_banner_obj.value.type2 && get_banner_obj.value.type2.length && show_banner.value)
/**
 *@description 获取轮播图片
  *@return {Undefined} undefined
  */
const fetch_actimg = () => {
  if (get_banner_obj.value.type2 && Array.isArray(get_banner_obj.value.type2)) {
    let arr = []
    get_banner_obj.value.type2.forEach(item => {
      arr.push({ ...item, imgUrl: get_server_file_path(item.imgUrl) })
    });
    carousel_src.value = arr
  }
  reset_timer()
}
/**
 *@description 跳转逻辑
  *@return {Undefined} undefined
  */
const confirm = (val) => {
  let _url = lodash.get(val, 'hostUrl')
  let _type = lodash.get(val, 'urlType')
  if (!_url) return
  if (val.comfirmTxt && UserCtr.activity.list) {
    store.dispatch({ type: 'matchReducer/set_activity_msg',  payload: val });
  } else if (_url.startsWith('http') && _type === '2') {
      window.open(_url, '_blank')
  } else if (_type === '1') {
    if (/#*\/*details/.test(_url) && route.name != 'category') {
      const {groups: {mid, csid}} = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(_url) || {groups:{}}
      if (mid && csid) {
        if ([100,101,102,103].includes(+csid)) {  // 如果是电竞赛事，需要设置菜单类型
        store.dispatch({ type: 'matchReducer/set_menu_type',  payload: 3000 })
      }
      store.dispatch({ type: 'matchReducer/set_menu_type',  payload: mid })
      store.dispatch({ type: 'matchReducer/set_menu_type',  payload: 0 })
      router.push({name:'category', params: {mid, csid}});
      }
    } else if (_url == 'act' && UserCtr.activity.list) {
      router.push({ name: 'activity_task', query: { rdm: new Date().getTime() } })
    } else if (_url.startsWith('hot') && !get_golistpage.value) {
      let tid = _url.split('/')[1]
      let is_existtid = get_hot_list_item.value && get_hot_list_item.value.subList && get_hot_list_item.value.subList.find(item => {
        return item.field2 == tid
      })
      if (tid && is_existtid) {
        store.dispatch({ type: 'matchReducer/set_home_tab_item',  payload: {component: 'hot', index: 1, name: '热门'} })
        store.dispatch({ type: 'matchReducer/set_hot_tab_item',  payload: { field2: tid } })
        if (route.name == 'home') {
          useMittEmit(MITT_TYPES.EMIT_HOME_TAB)
        } else {
          router.push({name: 'home'})
        }
      }
    }
  }      
}
/**
 *@description 重置计时器
  *@return {Undefined} undefined
  */
const reset_timer = () => {
  clearTimeout(timer.value)
  show_banner.value = true
  timer.value = setTimeout(() => {
    show_banner.value = false
  }, 7000 * carousel_src.value.length);
}
onUnmounted(() => {
  unsubscribe()
  clearTimeout(timer.value)
  timer.value = null
  for (const key in $data) {
    $data[key] = null
  }
})
</script>
 
<style scoped lang="scss">
 .tiaozhuan-panel {
  width: 3.6rem;
  margin: 0.04rem auto 0;
  position: relative;
  border-radius: 0.1rem;
  overflow: hidden;

  &.tiaozhuan-panel2 {
    box-shadow: none;
    margin: 0.04rem 0 0;
    width: 100%;
    border-radius: 0;
  }

  &.show-b2 {
    margin-top: 0.02rem;
  }

  :deep(.q-carousel__control) {
    display: flex;
    justify-content: center;
  }

  :deep(.q-carousel__slide) {
    background-size: 100% 100%;
  }

  :deep(.q-carousel) {
    background: transparent;
  }

  .panel2 {
    height: 1.48rem;
  }

  .tab {
    width: 0.04rem;
    height: 0.02rem;
    border-radius: 2px;
    display: inline-block;
    margin: 0 2px;
    background-color: var(--q-color-com-bg-color-12);
  }

  .tab2 {
    width: 0.08rem;
  }

  .delete {
    position: absolute;
    z-index: 1;
    right: 0.08rem;
    top: 0.16rem;
    width: 0.14rem;
    box-sizing: initial;
    border: 4px solid transparent;
  }
}
</style>