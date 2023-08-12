<template>
  <div class="c-main-menu column">
    <menu-wapper use_component_key="PcMenuTemplate1" :base_data="base_data_instance" :version="base_data_instance.base_data_version"></menu-wapper>
  </div>
</template>

<script setup>
import { ref } from "vue"
import base_data_instance from 'src/core/utils/base-data/base-data.js'

import { MenuWapper } from "src/components/menu";



// 格式化用户余额保留2位小数
const format_balance = num => {
  if (num && num > 0) {
    let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/)
    // 保留两位小数
    let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00"

    let _num = _split[1] + '.' + decimal
    return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  }
  return '0.00';
}
</script>