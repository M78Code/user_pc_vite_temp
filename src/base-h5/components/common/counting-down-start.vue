<!-- @Description: 一小时以内的开赛计时器（累加计时|倒计时）-->
<template>
  <!--凡是小于一个小时开赛的都显示为 * 分钟后开赛-->
        <div v-show="show && +start_minutes > 0" style="color:#7d87a5">
          <div :class="{ 'counting-down-start': get_lang != 'en' }">
            {{ i18n_tc('list.after_time_start', [+start_minutes]) }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useMittEmit, MITT_TYPES } from "src/core/mitt"
import { i18n_t, i18n_tc } from "src/boot/i18n.js";
import PageSourceData from "src/core/page-source/page-source.js";

const props = defineProps({
  /** 赛事对象 */
  match: {
    type: Object,
    default: () => { }
  },
  /** 毫秒数，还有多久开赛 */
  mgt_time: {
    type: [String, Number],
    default: ''
  }
})
/** 滚动赛事列表时切换赛事重启倒计时 */
watch(() => props.match, counting_down)
const emit = defineEmits(['is_show'])

/** 开赛时间 */
const start_minutes = ref(1)
/** 开赛时间大于当前时间则显示本组件 */
const show = ref(false)

const get_lang = ref('')
const get_current_menu = ref('')

const timeout = ref(null)
onBeforeUnmount(() => {
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
})
/**
 * @description: 凡是小于一个小时开赛的都显示为 * 分钟后开赛
 * @param {Undefined} Undefined
 * @return {Undefined} Undefined
 */
function counting_down() {
  if (props.mgt_time) {
    let start_time = props.mgt_time * 1;

    let init_server = PageSourceData.init_time.server_time * 1;
    let init_local = PageSourceData.init_time.local_time;
    let now_local = new Date().getTime();
    let sub_local_time = now_local - init_local;
    let now_server_time = init_server + sub_local_time;

    let sub_time = start_time - now_server_time;
    show.value = false;
    emit('is_show', show.value);

    // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
    if (props.match.mcg != 1 && sub_time < 60 * 60 * 1000) { // 开赛时间小于1小时
      let time_waiting

      // 5分钟内时间间隔1s, 1小时内时间间隔1分钟
      if (sub_time > 5 * 60 * 1000) {
        time_waiting = 60 * 1000
      } else {
        time_waiting = 1000
      }

      if (sub_time > 0) {
        show.value = true;
        let sub_date = new Date(sub_time);
        start_minutes.value = sub_date.getMinutes();
        if (start_minutes.value < 1) {
          start_minutes.value = 1;
        }

        clearTimeout(timeout.value);
        timeout.value = setTimeout(() => {
          counting_down();
        }, 1000);
      }
      else {
        useMittEmit(MITT_TYPES.EMIT_COUNTING_DOWN_START_ENDED, props.match.mid)
      }
    }
  }
}
onMounted(counting_down)

</script>


<style lang="scss" scoped>
.counting-down-start {
  padding-bottom: 2px;
  font-size: 0.1rem;
}
</style>
