<!--
 * @Author: cooper cooper@123.com
 * @Date: 2023-08-04 16:24:27
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-08-04 17:50:42
 * @FilePath: \user-pc-vite\src\components\pagination\pagination-1\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="table-footer-bar" v-if="is_bet_record">
      <span>
        {{ $root.$t('bet_record.total_count') }}
        <!-- 总计单数 -->
        ：
        <span class="footer-text">{{ count }}</span>
      </span>
      <span>
        {{ toolSelected == 2 ? $root.$t('bet.bet_book_total') : $root.$t('bet_record.total_v') }}
        <!-- 总投注额/预约总投资额 -->
        ：
        <span class="footer-text">{{ betTotalAmount | format_balance }}</span>
      </span>
      <template v-if="recordType">
        <!-- 目前屏蔽有效流水展示 -->
        <span v-if="0">
          {{ $root.$t('bet_record.effective_water') }}
          <!-- 有效流水 -->
          ：{{ effectiveFlow }}
        </span>
        <span>
          {{ profit.indexOf("-") != -1 ? $root.$t('bet_record.lose') : $root.$t('bet_record.win') }}：
          <span class="footer-text">{{ profit }}</span>
        </span>
        <!-- <span>{{profit.indexOf("-")!=-1?'输':'赢'}}：{{profit}}</span> -->
      </template>
    </div>
    <div class="pagination-wrap" :style="results_table">
      <q-pagination v-model="page" color="#788299" text-color="panda-text-3" :max="max" size="sm" :max-pages="9"
        direction-links ellipses icon-prev="icon-triangle2" icon-next="icon-triangle3" />
      <div class="pagination-select">
        <q-select class="select" :class="{ 'select-page-input': icon_name == 'icon-triangle' }" outlined
          v-model="perPageNum" :options="perPageNumOptions" popup-content-style="border:1px solid #d0d8de;background:#fff"
          @popup-show="icon_name = 'icon-triangle'" @popup-hide="icon_name = 'icon-triangle1'">
          <template v-slot:option="scope">
            <div class="select-item" v-bind="scope.itemProps" v-on="scope.itemEvents">{{ scope.opt.value }}</div>
          </template>
          <template v-slot:append>
            <icon :name="icon_name" color="#99A3B1" size="14px" />
          </template>
        </q-select>
        <span>
          {{ $root.$t('common.page_') }}
          <!-- 条/页 -->
        </span>
      </div>

      <div class="pagination-link">
        <span>
          {{ $root.$t('common.goto') }}
          <!-- 跳转至 -->
        </span>
        <input type="text" v-model="goPage" @blur="goToPage(goPage)" @keyup.enter="goToPage(goPage)" :max="max" />
        <span v-show="lang != 'vi'">
          {{ $root.$t('common.page') }}
          <!-- 页 -->
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper, useProps, useComputed } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
import { useGetValue } from './use-value'
import { watch } from 'vue'



useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps(
  {
    ...useProps,
    count: {
      type: Number,
      default: 0,
    },
    betTotalAmount: {
      type: String,
      default: "",
    },
    effectiveFlow: {
      type: String,
      default: "",
    },
    profit: {
      type: String,
      default: "",
    },
    recordType: {
      type: Number,
      default: 0,
    },
    random: {
      type: Number,
      default: 0,
    },
    toolSelected: {
      type: Number,
      default: 0,
    },
    is_bet_record: {
      type: Boolean,
      default: true,
    },
    results_table: {
      type: onBlur,
      default: () => { },
    },
    reset_pagination: {
      type: Number,
      default: 1,
    },

  }
)
const tableClass_computed = useComputed.tableClass_computed(props)
const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

//-------------------- 组件内ref  -------------------- 
const { goPage, pagination, perPageNumOptions, pageChangeFlag, page, max } = useGetValue(props)





//-------------------- 对外事件  -------------------- 
const emit = defineEmits(['pageChange'])

watch(() => pagination, val => {
  if (!pageChangeFlag) {
    emit(
      "pageChange",
      agination.limit,
      pagination.offset,
      page
    );
  } else {
    pageChangeFlag = false;
  }

})

 // 跳转页面
const goToPage = (val) => {
  if (page.value != val && val <= max.value && val > 0) page.value = val;
  else if (val > max.value || val <= 0) goPage = "";
}

</script>
