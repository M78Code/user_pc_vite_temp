
<template>
  <div class="q-gutter-xs keyboard-zone" :class="{ 'is_big_vedio': is_big_vedio }">
    <div class="keyboard-btn" :class="{
      'disable-key-btn': item.disabled || [2, 3].includes(status * 1),
      'key-btn-click': is_keydown,
      'big_keyboard-btn': is_big_vedio,
    }" v-for="(item, index) in keyboard_data" :data-num="item.text" :key="`xs-${index + 1}`"
      @click.stop="keypress_handle(item, $event)" @keydown="is_keydown = true" @keyup="is_keydown = false">
      <!--键盘按键文本显示 如果无效则置灰 以及MAX按钮文本显示-->
      <div class="keyboard-btn-text" :class="{ 'text-disable': item.disabled }"><template
          v-if="item.text != 'MAX'">+</template>{{ item.text }}</div>
    </div>
  </div>
</template>

<script setup>
// 公共主题文件引入
import { ref } from "vue"
import { useMittEmit,MITT_TYPES } from 'src/core/mitt/index.js'

const is_keydown = ref(false)

const props = defineProps({
  // 键盘数据以及默认键盘数据
  keyboard_data: {
    type: Array,
    default: () => {
      return [
        {
          text: "10",
          value: 10,
          disabled: false
        },
        {
          text: "50",
          value: 50,
          disabled: false
        },
        {
          text: "100",
          value: 100,
          disabled: false
        },
        {
          text: "200",
          value: 200,
          disabled: false
        },
        {
          text: "300",
          value: 300,
          disabled: false
        },
        {
          text: "500",
          value: 500,
          disabled: false
        }
      ]
    }
  },
  // 当前按键值
  number: String,
  status: {
    type: Number,
    default: 1
  },
  is_big_vedio: {
    type: Boolean,
    default: false
  }
})


/**
 * @description: 键盘按下事件
 * @param {Object} obj 点击的按钮对象
 * @param {Event} e 按钮事件
 * @return {undefined} undefined
 */
const keypress_handle = (obj, e) => {
  //投注按钮是否失效事件
  useMittEmit(MITT_TYPES.EMIT_BTN_CHANGE,false)
  // 如果是enter键按下则不执行
  if (e.qKeyEvent) {
    // 触发enter键执行
    useMittEmit(MITT_TYPES.EMIT_ENTER_PRESS_EVENT,{ keyCode: 13 })
    return;
  }
  if (!obj.disabled) {
    if (obj.text != 'MAX') {
      let num = obj.value;
      let data = {
        keyboard_object: obj,
        number: parseFloat(num).toFixed(2)
      };
      // 触发键盘时间
      useMittEmit(MITT_TYPES.EMIT_MIX_UPDATE_KEYBOARD_STATUS_HANDLE, data)
    } else {
      // 触发使输入框显示最大的金额
      useMittEmit(MITT_TYPES.EMIT_BET_MIX_INPUT_MAX_MONEY)
    }
  }
}

</script>
<style lang="scss" scoped>
/*  键盘区域样式设置 */
.keyboard-zone {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.is_big_vedio {
  justify-content: initial;
}

/*  键盘按钮样式 */
.keyboard-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 58px;
  height: 26px;
  margin-bottom: 2px;
  margin-left: 0px;
  margin-right: -2px;

  /*  键盘文本前面加号的样式 */
  .keyboard-btn-add {
    margin-right: 20px;
  }

  /*  按钮文字样式 */
  .keyboard-btn-text {
    line-height: 24px;
  }
}

/*  按键间距设置 */
.big_keyboard-btn {
  margin-right: 10px;
}
</style>
