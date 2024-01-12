<!--
 * @Author: cooper cooper@123.com
 * @Date: 2023-08-04 16:24:27
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-08-04 18:33:55
 * @FilePath: \user-pc-vite\src\components\pagination\pagination-1\index.vue
 * @Description: 详情区--玩法集 Tab 选项
-->
<template>
  <div class="component tabs-bar-index">
    <div v-if="handicap_this && handicap_this.category_list.length" class="scroll-fixed-header wrap-tabs">
    <div class="tabs-panel relative-position" ref="warp">
      <tab ref="tab" :list="handicap_this.category_list" :is_show_btn="is_details"  tab_name_key="marketName" @onclick="toggle_play" :currentIndex="currentIndex" :is_drag="!is_details" />
      {{ handicap_this.category_list.length }}
    </div>
    <!-- 详情右侧 排序、单列、双列 || 右侧详情视频区域-->
    <div v-if="is_details || whitchDetail == 'rightDetails'" class="row">
      <div class="right-icons" @click="handicap_this.toggle_panel">
        <icon-wapper
          :name="handicap_this.panel_status =='hide'?'icon-open':'icon-hide'"
          color="#5A6074"
          size="14px"
        />
        <q-tooltip
          anchor="top middle"
          self="center middle"
          :content-style="tooltip_style"
        >{{handicap_this.panel_status =='hide'?i18n_t('icon_tips.unfold'):i18n_t('icon_tips.fold')}}</q-tooltip>
        <!-- 展开：收起 -->
      </div>
      <!-- 一栏/两栏布局按钮在页面宽度 < 1680 的时候和内嵌版里不展示 -->
      <div
        class="tabs-handel"
        v-if="handicap_this.check_half()&&handicap_this.get_layout_list_size.width>=1680"
      >
        <span>
          <icon-wapper
            name="icon-play_stop"
            size="14px"
            class="icon-toggle"
            color="#5A6074"
            :class="!get_layout_statu && 'active'"
            @click="handicap_this.toggele_layout(0)"
          />
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('icon_tips.column')}}</q-tooltip>
          <!-- 一栏布局 -->
        </span>
        <span>
          <icon-wapper
            name="icon-play_pause"
            size="14px"
            class="icon-toggle"
            color="#5A6074"
            :class="get_layout_statu && 'active'"
            @click="handicap_this.toggele_layout(1)"
          />
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :content-style="tooltip_style"
          >{{ i18n_t('icon_tips.multicolumn')}}</q-tooltip>
          <!-- 两栏布局 -->
        </span>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper} from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
import { useGetValue } from './use-get-value'
import { watch } from 'vue'
import { IconWapper } from 'src/components/icon'


useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps(
  {
    ...useProps,
    handicap_this: {
      type: Object,
      default: ()=>{},
    },
    match_info: {
      type: Object,
      default: ()=>{},
    },
    whitchDetail: {
      type: String,
      default: "",
    },
  }
)
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

//-------------------- 组件内ref  -------------------- 
const {currentIndex,tabs ,isRouterAlive,is_details,category_list_length } = useGetValue(props)





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


<style  lang="scss" scoped>
.table-footer-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  height: 36px;
  font-size: 14px;

  span {
    margin-left: 20px;
    .footer-text {
      margin: 0;
      font-weight: 500;
    }
  }
}
.pagination-wrap {
  display: flex;
  justify-content: center;
  height: 60px;
  font-size: 12px;
  .pagination-select {
    display: flex;
    align-items: center;
    margin: 0 30px 0 18px;
    :deep(.q-field--focused .q-field__control:after) {
      transform: scale3d(0, 1, 1);
    }
    .select {
      margin-right: 5px;
      padding: 0;
      width: 60px;
      height: 24px;
      border-radius: 2px;
    }
  }
  .pagination-link {
    display: flex;
    align-items: center;

    input {
      margin: 0 6px;
      padding: 0 5px;
      width: 32px;
      height: 24px;
      border-radius: 2px;
      text-align: center;
      font-weight: 500;
      font-size: 12px;
      outline: medium;
    }
  }
  :deep(.q-field--auto-height) {
    .q-field__control {
      padding: 0;
      min-height: 0px;
      height: 24px;
      &:before {
        border-radius: 2px;
      }
      .q-field__native {
        padding: 0;
        min-height: 0px;
      }
      .q-field__marginal {
        margin-right: 6px;
        padding: 2px 0 0 0;
        height: auto;
        &.q-anchor--skip {
          display: none;
        }
      }
    }
  }
  :deep(.q-field--auto-height .q-field__native span) {
    margin: 0 auto;
    font-weight: 500;
    font-size: 12px;
  }
}
.q-pagination {
  :deep(.q-btn) {
    margin: 0 3px;
    width: 24px;
    height: 24px;
    line-height: 1;
    .q-btn__wrapper {
      min-height: 0px;
      &:before {
        box-shadow: none;
      }
    }
  }
}
.select-item {
  height: 24px;
  text-align: center;
  line-height: 24px;
  cursor: pointer;
}
</style>
