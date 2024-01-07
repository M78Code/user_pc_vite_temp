<template>
    <div class="check_box_warp">
        <div class="check_item" v-for="(item, index) in list" :key="index" @click="check(item)">
          <span :class="{active: currentVal == item.value}"></span>
          <p>{{ item.label }}</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const currentVal = ref('')

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  initVal: {
    type: [String, Number, Boolean],
    default: ''
  }
})

onMounted(() => {
  if(props.initVal) {
    currentVal.value = props.initVal
  }
})

const emit = defineEmits(['emit_value'])
const check = (item) => {
  if(props.list.length == 1) { // 如果只有一项, 多次点击切换选中、非选中
    if(currentVal.value == item.value) {
      currentVal.value = ''
      emit('emit_value', '')
    } else {
      currentVal.value = item.value
      emit('emit_value', item.value)
    }
  } else { // 如果多项，点击哪项就选择哪项； 只有值不同的时候才emit，防止重复点击
    if(currentVal.value != item.value) {
      currentVal.value = item.value
      emit('emit_value', item.value)
    }
  }
}

</script>

<style lang="scss" scoped>
.check_box_warp {
    display: flex;
    align-items: center;
    .check_item {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
      span {
        width: 14px;
        height: 14px;
        background-color: var(--q-gb-bg-c-14);
        border-radius: 2px;
        border: 1px solid #999;
        position: relative;
        &.active {
          background-color: var(--q-gb-t-c-7);
          border: none;
          &:after {
            position: absolute;
            content: "";
            left: 3px;
            width: 7px;
            height: 5px;
            top: 3px;
            border-top: 2px solid #fff;
            border-right: 2px solid #fff;
            transform: rotate(135deg);
          }
        }
      }
      p {
        margin-left: 4px;
        margin-bottom: 0;
      }
    }
}
</style>