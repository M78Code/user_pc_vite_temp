<template>
  <span>
    <!-- 红升icon -->
    <img class="hps_img" v-if="is_up" :src="ouzhou_hps_up" alt="" />
    <!-- 绿降icon -->
    <img class="hps_img" v-if="is_down" :src="ouzhou_hps_down " alt="" />
  </span>
</template>
<script setup>
import { ref, watch } from "vue";
import {
  odd_lock_ouzhou,
  ouzhou_hps_up,
  ouzhou_hps_down,
  ouzhou_white_down,
  ouzhou_white_up
} from "src/base-h5/core/utils/local-image.js";
const props = defineProps({
  item_ol_data: {
    type: Object,
    default: () => {},
  },
  active: {
    type: Boolean,
    default: false,
  },
});
const is_up = ref(false);
const is_down = ref(false);
watch(
  () => props.item_ol_data?.ov,
  (a, b) => {
    is_up.value = a > b;
    is_down.value = a < b;
    reset_status();
  }
);

const reset_status = () => {
  let timer = setTimeout(() => {
    is_up.value = false;
    is_down.value = false;
    clearTimeout(timer);
    timer = null;
  }, 3000);
};
</script>
<style scoped>
.hps_img {
  width: 6px;
  height: 10px;
  margin-left:4px;
}
</style>
