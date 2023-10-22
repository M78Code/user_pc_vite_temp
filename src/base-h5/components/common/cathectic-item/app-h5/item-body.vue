<!--
 * @Author:
 * @Date:
 * @Description: bw3新版矩形框中部
-->
<template>
  <!-- 单关内容显示 -->
  <item-simple-body v-if="item_data.seriesType == '1'" :is_pre="is_pre" :data_b="item_data"></item-simple-body>
  <!-- 串关内容显示 -->
  <item-multiple-body v-else :is_pre="is_pre" :data_b="item_data"></item-multiple-body>
</template>

<script setup>
import itemSimpleBody from "src/base-h5/components/common/cathectic-item/app-h5/item-simple-body.vue";
import itemMultipleBody from "src/base-h5/components/common/cathectic-item/app-h5/item-multiple-body.vue";

let props = defineProps({
    item_data: {
      type: Object
    },
    is_pre: {
      type: Boolean
    }
  })
</script>
