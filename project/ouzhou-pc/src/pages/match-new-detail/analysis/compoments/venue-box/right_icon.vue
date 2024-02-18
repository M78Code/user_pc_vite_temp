<!--
 * @Description: 提示语组件，Bug单号：50291
-->
<template>
  <!-- 右上角提示內容 -->
  <div class="right-icon" @click.stop="is_show_content = !is_show_content">
    <!-- 提示消息 -->
    <icon class="icon" :class="is_show_content && 'active'" size="14px" name="icon-tips3" :color="is_show_content ? iconActiveColor : iconNormalColor"/>
    <!-- 提示内容 -->
    <div :class="['tip-content']" v-if="is_show_content" @click.stop>
      <div class="content-wrap relative-position">
        <div class="yb-icon-triangle"></div>
        <!-- 此版面现实的所有直播内容仅供参考........ -->
        <div class="content">{{ i18n_t("common.live_notice") }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import { i18n_t } from "src/output/index.js";
import icon from "src/components/icon/icon-1/index.vue";

const props = defineProps({
  iconNormalColor: {
    type: String,
    default: '#fff'
  },
  iconActiveColor: {
    type: String,
    default: 'rgba(255,255,255,.7)'
  }
})

const is_show_content = ref(false); //是否显示提示信息


</script>

<style lang="scss" scoped>
.right-icon {
  position: absolute;
  width: 100%;
  z-index: 8;
  //声明图标
  .icon {

    position: absolute;
    top: 12px;
    right: 15px;
    cursor: pointer;

  }

  //声明容器
  .tip-content {
    position: absolute;
    top: 32px;
    right: 10px;
    width: 80%;
    &.is-iframe{
      width:95%;
    }
    .content-wrap {
      background-color: rgba(0, 0, 0, 0.8);
      padding: 9px 8px;
      font-size: 12px;
      color: #fff;
    }
    .yb-icon-triangle {
      position: absolute;
      top: -5px;
      right: 7.5px;
      &::before {
        background-color: rgba(0, 0, 0, 0.8);
      }
    }
  }
}
</style>