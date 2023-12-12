<template>
  <div class="component odds-list-container">
    <template v-if="match_odds_info && match_odds_info.length > 0 && match_detail?.ms != 2">
      <TransitionGroup>
        <template v-for="item in match_odds_info" :key="item.topKey">
          <OddsItem v-if="item.hton != '0'" :data="item"></OddsItem>
        </template>
        <template v-for="item in match_odds_info" :key="item.topKey">
          <OddsItem v-if="item.hton == '0'" :data="item"></OddsItem>
        </template>
      </TransitionGroup>
    </template>
    <template v-else>
      <div v-if="!loading" class="no-data-wrap">
        <img class="no-data" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/detail/handcip_lock.png`" alt="">
        <div class="no-data-text"> {{ i18n_t('detail.odd_all_closed') }}</div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, markRaw, watch, nextTick, computed } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";
import OddsItem from './OddsItem.vue';

type Props = {
  match_odds_info: TYPES.OddInfo[]
  match_detail: TYPES.MatchDetail
  loading?: boolean
  allCloseState?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  allCloseState: false,
})

const emit = defineEmits<{
  (e:'update:allCloseState',param:boolean)
}>()


//#region 展开收起功能
const topKey_active = ref({});
/** 监听一键展开/收起 */
function useWatchAllCloseState() {
  return watch(() => props.allCloseState, useWatchAllCloseState.watch)
}
useWatchAllCloseState.watch = (val) => {
  if (!val) topKey_active.value = {}
}
let watchAllCloseStateHandle = useWatchAllCloseState()
/** 切换展开/收起 */
function ToggleExpend() {
  // if (props.allCloseState) {
  //   watchAllCloseStateHandle()
  //   emit('update:allCloseState', false)
  //   props.match_odds_info.forEach(v => topKey_active.value[v.topKey] = true)
  //   delete topKey_active.value[item.topKey]
  //   nextTick(() => watchAllCloseStateHandle = useWatchAllCloseState())
  //   return
  // }
  // if (topKey_active.value[item.topKey]) {
  //   delete topKey_active.value[item.topKey]
  // } else {
  //   topKey_active.value[item.topKey] = true
  // }
  // if (Object.keys(topKey_active.value).length == props.match_odds_info.length) {
  //   emit('update:allCloseState', true)
  // }
}
function updateUnfold(unfold: boolean){
  emit('update:allCloseState',unfold)
}

//#endregion

</script>

<style scoped lang="scss">
.component.odds-list-container{
  display: flex;
  flex-direction: column;
}
.v-move{
  transition: all .5s ease;
}
.v-enter-active{
  transition: all .2s ease;
}
.v-enter-from,.v-leave-to {
  opacity: 0;
}
.no-data-wrap{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.no-data {
  width: 140px;
  height: 140px;
}

.no-data-text {
  text-align: center;
  color: #A1A3A5;
  font-size: 16px;
}
</style>