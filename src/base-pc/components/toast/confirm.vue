<!--
 * @Description: confirm 确认弹窗
-->
<template>
  <!-- 弹窗封装 -->
  <q-dialog v-model="is_show" :persistent="backDrop">
    <div class="dialog_content">
      <div class="confirm-wrap">
        <div class="row items-center">
          <!-- 左侧文案           -->
          <ul class="text-left">
            <li>{{ text }}</li>
          </ul>
          <!-- 关闭按钮 -->
          <div class="btn" @click="confirm">{{ i18n_t("login.logout_alert_close") }}</div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { i18n_t } from "src/output/index.js";;
import { useMittOn, MITT_TYPES } from 'src/core/mitt/index.js'

/** 国际化 */
;

/* 是否展示 */
const is_show = ref(false)
/* 文本内容 */
const text = ref('')
/* 弹层按钮文字 */
const btn_text = ref('')
/* 是否允许点击背景关闭弹窗 */
const backDrop = ref(false)

onMounted(() => {
  // TODO: 待确定
  if (window.frames.length == parent.frames.length) {
    backDrop.value = true;
  }
})

/* 监听打开弹窗mitt */
const { off } = useMittOn(MITT_TYPES.EMIT_SHOW_CONFIRM_CMD, show_confirm)
/* 销毁mitt */
onUnmounted(off)

/**
 * @Description:显示弹窗
 * @param {object} data 弹窗内容
 * @return {undefined} undefined
 */
function show_confirm(data) {
  text.value = data.text || "";
  if (text.value == "" || is_show.value) return;
  is_show.value = true;

  btn_text.value = data.btn_text || i18n_t('common.confirm')
}

/**
 * @Description:确认弹窗
 * @return {undefined} undefined
 */
function confirm() {
  is_show.value = false;
  text.value = "";
}

</script>


<style lang="scss" scoped>
/** 弹窗样式 -S*/
.dialog_content {
  box-shadow: none !important;
}

.confirm-wrap {
  text-align: center;
  border-radius: 4px;
  width: 280px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .items-center {
    padding: 3px 0 20px;
    background-color: var(--q-gb-bg-c-4);
    position: relative;
    border-radius: 4px;
    width: 280px;
  }

  .text {
    padding: 10px 20px 0;
    color: #343434;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    position: relative;
    width: 100%;
    text-align: center;
    font-weight: 600;
  }

  .text-left {
    width: 100%;
    font-size: 14px;
    text-align: center;
    color: #3c4551;
    list-style: none;
    padding: 30px 20px 20px 30px;
    margin: 0;

    li {
      position: relative;
      margin-bottom: 13px;
      font-family: PingFangSC-Regular;
    }
  }

  .btn {
    width: 184px;
    height: 36px;
    line-height: 36px;
    color: var(--q-gb-t-c-1);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin: 0 auto;
    background: var(--q-gb-bg-c-1) !important;
  }

  .close {
    cursor: pointer;
    position: absolute;
    right: 17.6px;
    top: 17.6px;
  }
}

/** 弹窗样式 -E*/
</style>


src/output/index.js