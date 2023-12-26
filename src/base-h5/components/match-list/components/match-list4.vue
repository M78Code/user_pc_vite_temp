<!--
 * @Description: 废弃： app-h5 新手版赛事组件 临时处理，后续全部替换完  会在 match-list2.vue  组件里
-->

<template>
  <!-- <ObserverWrapper :match_list="MatchMeta.complete_matchs" com_type="app-h5-new"></ObserverWrapper> -->
  <BaseVirtualList :dataList="matchs_data" @onUpdate="handlerUpdate" >
    <template #default="{ item, index }">
      <!-- 赛果详情精选赛事 -->
      <template v-if="route.name == 'match_result'">
        <MatchContainerMainTemplate7
          :i="index"
          :match_of_list="MatchDataBaseH5.get_quick_mid_obj(item.mid)">
        </MatchContainerMainTemplate7>
      </template>
      <template v-else-if="is_kemp">
        <MatchContainerMainTemplate2
          :i="index"
          :match_of_list="get_match_item(item)">
        </MatchContainerMainTemplate2>
      </template>
      <template v-else>
        <MatchContainerMainTemplate5
          :i="index"
          :match_of_list="get_match_item(item)">
        </MatchContainerMainTemplate5>
      </template>
    </template>
  </BaseVirtualList>
</template>
 
<script setup>
import lodash from 'lodash'
import { is_results, is_kemp } from 'src/base-h5/mixin/menu.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { BaseVirtualList } from 'src/base-h5/components/base-virtual-list'
import ObserverWrapper from 'src/base-h5/components/observer-wrapper/index.vue';
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, MenuData } from 'src/output/index.js';
import MatchContainerMainTemplate2 from "src/base-h5/components/match-container/template/app/match-container-main-template2.vue"; 
import MatchContainerMainTemplate5 from "src/base-h5/components/match-container/template/app/match-container-main-template5.vue"; 
// app-h5 赛果精选列表
import MatchContainerMainTemplate7 from "src/base-h5/components/match-container/template/app/match-container-main-template7.vue"; 
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const defer_render = use_defer_render()

import { useRoute } from "vue-router";
const route = useRoute()
const matchs_data = computed(() =>{
  return MatchMeta.current_matchs
})

const mids_string = ref('')

// 根据当前可视区 mids 获取赛事赔率
watch(() => mids_string.value, () => {
  MatchMeta.get_match_base_hps_by_mids({mids: mids_string.value})
})

// 获取数据仓库赛事数据
const get_match_item = (item) => {
  let result = {}
  if (MenuData.is_results()) {
    result = item  
  } else {
    result = MatchDataBaseH5.get_quick_mid_obj(item.mid)
  }
  return result || item
}

// 当前可视区数据更新回调
const handlerUpdate = lodash.debounce((data) => {
  const length = lodash.get(data, 'length', 0)
  if (length < 1) return
  const mids = data.map(t => t.mid)
  mids_string.value = mids.join(',')
}, 1000)

</script>
 
<style scoped lang="scss">
 
</style>