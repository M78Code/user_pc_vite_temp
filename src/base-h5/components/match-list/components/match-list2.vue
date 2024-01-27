<!--
 * @Description: app-h5 赛事列表组件
-->

<template>
  <template v-if="!is_scroll_component">
    <BaseVirtualList :dataList="matchs_data" @onUpdate="handlerUpdate">
      <template #default="{ item, index }">
        <!-- 赛果详情精选赛事 -->
        <template v-if="is_results">
          <template v-if="MenuData.is_results_type === 2">
            <!-- vr 赛果 -->
            <MatchContainerMainTemplate8
              v-if="get_match_item(item).sportId"
              :i="index"
              :match_of_list="get_match_item(item)">
            </MatchContainerMainTemplate8>
          </template>
          <template v-else-if="MenuData.is_results_type === 3">
            <!-- vr 赛果 -->
            <MatchContainerMainTemplate6
              v-if="get_match_item(item).sportId"
              :i="index"
              :match_of_list="get_match_item(item)">
            </MatchContainerMainTemplate6>
          </template>
          <!-- 常规赛果 -->
          <template v-else>
            <MatchContainerMainTemplate3
              :i="index"
              :match_of_list="get_match_item(item)">
            </MatchContainerMainTemplate3>
          </template>
        </template>
        <!-- 常规赛事 -->
        <template v-else>
          <template v-if="standard_edition == 1">
            <MatchContainerMainTemplate5
              :i="index"
              :match_of_list="get_match_item(item)">
            </MatchContainerMainTemplate5>
          </template>
          <template v-else>
            <MatchContainerMainTemplate1
              :i="index"
              :match_of_list="get_match_item(item)">
            </MatchContainerMainTemplate1>
          </template>
        </template>
      </template>
    </BaseVirtualList>
  </template>
  <template v-else>
    <div class="refresh-container">
      <!--冠军玩法 列表页 -->
      <ScrollWrapper>
        <template v-slot="{ match_item, index }">
          <!--此data-mid用于分频订阅赛事,请勿修改-->
          <div class="data_mid" v-if="match_item"> 
            <MatchContainerMainTemplate2
              :i="index"
              :match_of_list="get_match_item(match_item)">
            </MatchContainerMainTemplate2>
          </div>
        </template>
      </ScrollWrapper>
    </div>
  </template>
  
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from "vue-router";
import lodash from 'lodash'

// app-h5 赛事组件
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/app/match-container-main-template1.vue"; 
// app-h5 冠军组件
import MatchContainerMainTemplate2 from "src/base-h5/components/match-container/template/app/match-container-main-template2.vue"; 
// app-h5 赛果
import MatchContainerMainTemplate3 from "src/base-h5/components/match-container/template/app/match-container-main-template3.vue"; 
// app-h5 新手版
import MatchContainerMainTemplate5 from "src/base-h5/components/match-container/template/app/match-container-main-template5.vue"; 
// app-h5 冠军赛果
import MatchContainerMainTemplate6 from "src/base-h5/components/match-container/template/app/match-container-main-template6.vue"; 
// app-h 赛果vr
import MatchContainerMainTemplate8 from "src/base-h5/components/match-container/template/app/match-container-main-template8.vue"; 

// 赛事滚动组件
import ScrollWrapper from 'src/base-h5/components/scroll-wraper/scroll-wrapper.vue'; 

// 新手版赛事滚动容器
import { BaseVirtualList } from 'src/base-h5/components/base-virtual-list'

import { is_kemp, is_results } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, MenuData } from 'src/output/index.js';

// 是否使用 BaseVirtualList 组件  BaseVirtualList 试运行， 稳定后替换其他模板
const is_scroll_component = computed(() => {
  return MenuData.update_time.value && (is_kemp.value || MenuData.get_mm_is_champion())
  // return MenuData.update_time.value && !MenuData.get_mm_is_champion() && (is_results.value || (standard_edition.value == 1 && !is_kemp.value && route.name !== 'match_result'))
  // return is_results.value || (standard_edition.value == 1 && !is_kemp.value && route.name !== 'match_result')
  // return standard_edition.value == 1 && ! is_results.value && !is_kemp.value && route.name !== 'match_result'
})


// 组件 所需 start ·············································

const mids_string = ref('')

// 组件数据
const matchs_data = computed(() =>{
  return MatchMeta.current_matchs
})

// 根据当前可视区 mids 获取赛事赔率
// watch(() => mids_string.value, (n,o) => {
//   if (n === o) return
//   MatchMeta.get_match_base_hps_by_mids({mids: mids_string.value})
// })

//获取数据仓库赛事数据
const get_match_item1 = (item) => {
  const { source_index = '', is_show_ball_title = false, start_flag = '3' } = item
  const match = MatchDataBaseH5.get_quick_mid_obj(item.mid) || item
  return { ...match, source_index, is_show_ball_title, start_flag }
}

const get_match_item = (item) => {
  // const { source_index = '', is_show_ball_title = false, start_flag = '3' } = item
  // const match = MatchDataBaseH5.get_quick_mid_obj(item.mid) || item
  return MatchDataBaseH5.get_quick_mid_obj(item.mid) || item
}

const get_match_item3 = computed(() => {
  return (item) => {
    return  MatchDataBaseH5.get_quick_mid_obj(item.mid) || item
  }
})


// 当前可视区数据更新回调
const handlerUpdate = lodash.debounce((data) => {
  const length = lodash.get(data, 'length', 0)
  if (length < 1) return
  console.log('当前可视区数据更新数据', data)
  let flag = false
  const mids = []
  data.forEach(t => {
    if (t.is_meta) return
    flag = true
    mids.push(t.mid)
  })
  if (flag && mids_string.value !== mids.join(',')) {
    // 设置当前激活的赛事
    MatchMeta.set_current_match_mids(mids)
    // 更新仓库赛事数据 , merge: 'cover'
    MatchMeta.handle_update_match_info({ list: data })
    // // 根据当前可视区 mids 获取赛事赔率
    MatchMeta.get_match_base_hps_by_mids({mids: mids.join(',')})
    
    mids_string.value = mids.join(',')
  }
}, 800)

// 一级菜单改变 重置 当前 mids, 当早盘 和 滚球 前几场赛事相同时  会存在不调用 赔率接口的情况
watch(() => MenuData.current_lv_1_menu_mi.value, () => {
  mids_string.value = ''
})

// BaseVirtualList 组件 所需 end ·············································

</script>
 
<style scoped lang="scss">
@import "../styles//match-list";
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}
</style>
