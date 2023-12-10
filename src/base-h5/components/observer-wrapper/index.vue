<!--
 * @Description: 渲染可视区赛事组件
-->

<template>
  <main class="main-container">
    <template v-if="match_list">
      <section class="observer-container" ref="container" @scroll="handler_container_scroll">
        
          <div class="observer-item" 
            v-for="item, index in match_list" 
            :key="item.mid" 
            :data-mid="item.mid" 
            :data-index="index"
            :style="get_item_style(item, index)">
            <!-- 赛事卡片 -->
            <slot name="content" :item="item" :index="index">
              <template v-if="is_show_match_item(index)">
                <!-- <ObserverItem3 :index="index" :item="item"></ObserverItem3> -->
                <component :is="target_com" :index="index" :item="item"></component>
              </template>
            </slot>
          </div>
      </section>
    </template>
    <template v-else>
      <NoData class="empty"  :which='which' height='400'></NoData>
    </template>
    <!-- 回到顶部按钮组件 -->
    <ScrollTop :list_scroll_top="scroll_top" @back-top="go_to_top" />
  </main>
</template>
 
<script setup>
import lodash from 'lodash'
import { useMittOn, MITT_TYPES } from "src/core/mitt";
import { compute_css_variables } from "src/core/css-var/index.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list';
import { onMounted, computed, watch, ref, nextTick, onUnmounted } from 'vue';
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { compute_local_project_file_path, project_name } from 'src/output/index.js';
// yazhou-h5 亚洲版
import ObserverItem from 'src/base-h5/components/observer-wrapper/observer-item.vue';
// app-h5 复刻版
import ObserverItem2 from 'src/base-h5/components/observer-wrapper/observer-item2.vue';
// ouzhou-h5 欧洲版
import ObserverItem3 from 'src/base-h5/components/observer-wrapper/observer-item3.vue';
//app-h5 新手版  -- 临时
import ObserverItem4 from 'src/base-h5/components/observer-wrapper/observer-item4.vue';
import NoData from "src/base-h5/components/common/no-data.vue"; 
import ScrollTop from "src/base-h5/components/common/record-scroll/scroll-top.vue";
import { skeleton_white_ouzhou_110, skeleton_white_ouzhou_90, skeleton_white_app_177, skeleton_white_app_117 } from 'src/base-h5/core/utils/local-image.js'

const defer_render = use_defer_render()
const props = defineProps({
  // 渲染数据
  match_list: {
    type: Array,
    required: true
  },
  // 组件类型
  com_type: {
    type: String,
    default: () => 'app-h5'
  }
})

// 组件配置
const com_config = {
  'app-h5': ObserverItem2,
  'yazhou-h5': ObserverItem,
  'ouzhou-h5': ObserverItem3,
  'app-h5-new': ObserverItem4
}

// 所渲染的组件
const target_com = computed(() => {
  return com_config[props.com_type]
})


const container = ref(null)
const observer = ref(null)
const emitters = ref({})
const scroll_top = ref(0)
const page_style = ref(null)
// 当前可视区的 mids 用于获取赔率
const active_mids = ref([])
const which = ref('noMatch')


onMounted(() => {
  emitters.value = {
    // 重新设置监听对象
    emitter_1: useMittOn(MITT_TYPES.EMIT_HANDLE_START_OBSERVER, () => {
      nextTick(() => handle_start_observer())
    }).off,
    // 回到顶部
    emitter_2: useMittOn(MITT_TYPES.EMIT_GOT_TO_TOP, () => {
      nextTick(() => go_to_top())
    }).off,
    emitter_3: useMittOn(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, upd_match_is_empty).off,
  }
})

/**
 * @description: 赛事列表为空通知事件函数
 */
 const upd_match_is_empty = (obj = {}) => {
  // 当是赛果菜单,三级菜单数据没有时,发送列表赛事数据为空消息,收到消息后页面显示为空页面
  const { state = false, type = 'noMatch' } = obj
  which.value = type
  // match_is_empty.value = state;
}

/**
 * @description 开启 IntersectionObserver 赛事卡片监听
 */
const handle_start_observer = () => {
  observer.value = new IntersectionObserver((entries) =>{
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
    observer.value.observe(node)
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

/**
 * @description 不影响渲染的前提下， 加载赛事列表
 */
const is_show_match_item = computed(() => {
  return (index) => {
    // defer_render(index)
    return true
  }
})

// 卡片高度
const get_inner_height = (item, index) => {
  return VirtualList.get_match_total_height(item, index)
}

// 赛事列表容器滚动事件
const handler_container_scroll = lodash.throttle(($ev) => {
  scroll_top.value = lodash.get($ev.target, 'scrollTop', 0)
}, 200)

/**
 * @description: 列表回到顶部
 */
const go_to_top = () => {
  MatchMeta.set_prev_scroll(0)
  let timer = setTimeout(() => {
    container.value.scrollTo({ top: 0, behavior: 'smooth' });
    clearTimeout(timer)
    timer = null
  }, 100)
}

// 显示骨架图
const get_background_image = (item) => {
  let image_src = ''
  if (project_name === 'ouzhou-h5') {
    if (item?.is_show_league) {
      image_src = skeleton_white_ouzhou_110
    } else {
      image_src = skeleton_white_ouzhou_90
    }
  } else if (project_name === 'app-h5') {
    if (item?.is_show_league) {
      image_src = skeleton_white_app_177
    } else {
      image_src = skeleton_white_app_117
    }
  }
  return image_src
}

const get_item_style = (item, index) => {
  const height = get_inner_height(item, index)
  const skeleton = get_background_image(item) 
  return {
    // height: `${height}px`,
    backgroundImage: `url(${skeleton})`
  }
}

// 触发本组件销毁之前回调
onUnmounted(() => {
  observer.value && observer.value.disconnect()
  Object.values(emitters.value).map((x) => x());
})

</script>
 
<style scoped lang="scss">
.main-container{
  flex: 10;
  height: 0;
  .observer-container{
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .observer-item{
      content-visibility: auto;
      background-size: 100% 100%;
      .empty {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: -0.3rem;
      }
    }
  }
}
</style>