<!--
 * @Description: alert 弹窗组件
-->

<template>
  <q-dialog :model-value="is_show" v-if="is_show" :persistent="backDrop">
    <div class="dialog_content">
      <div class="alert-wrap">
        <img :src="imgSrc[UserCtr.lang]" alt="" style="width: 100%;">
        <div class="row items-center  relative-position">
          <div class="text">{{ i18n_t("login.login_out_dear_user") }}</div>
          <!-- 域名错误弹窗 -->
          <template v-if="is_domain_error">
            <div class="page-lost">
              <img :src="compute_local_project_file_path('/image/common/png/page_lost.png')" alt="">
              <div class="text1">{{ i18n_t('common.user_api_limited1') }}</div>
              <div class="text2">{{ i18n_t('common.user_api_limited2') }}</div>
            </div>
            <div class="btn" @click="refresh">{{ i18n_t("common.refresh") }}</div>
          </template>
          <!-- 正确弹窗 -->
          <template v-else>
            <ul class="text-left  relative-position">
              <li>{{ i18n_t("login.login_out_text1") }}</li>
              <li>{{ i18n_t("login.login_out_text2") }}</li>
              <li>{{ i18n_t("login.login_out_text3") }}</li>
            </ul>
            <div class="btn" @click="confirm">{{ i18n_t("login.logout_alert_close") }}</div>
          </template>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { i18n_t, compute_local_project_file_path } from "src/output/index.js";
import { useMittEmitterGenerator, useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
/* 退出登录通知-中文 */
const logout_notice = compute_local_project_file_path('/image/image/logout_notice.png')
/* 退出登录通知-英文 */
const logout_notice_en = compute_local_project_file_path('/image/image/logout_notice_en.png')
/* 退出登录通知-越南语 */
const logout_notice_vi = compute_local_project_file_path('/image/image/logout_notice_vi.png')
/* 退出登录通知-泰语 */
const logout_notice_th = compute_local_project_file_path('/image/image/logout_notice_th.png')
/* 退出登录通知-马来语 */
// const logout_notice_ma = compute_local_project_file_path('/image/image/logout_notice_ma.png')

/* 是否展示 */
const is_show = ref(false)
/* 文本内容 */
const text = ref('')
/* 弹层按钮文字 */
const btn_text = ref('')
/* 是否允许点击背景关闭弹窗 */
const backDrop = ref(false)
/* 提示图片集合 */
const imgSrc = reactive({
  zh: logout_notice,
  tw: logout_notice,
  en: logout_notice_en,
  vi: logout_notice_vi,
  th: logout_notice_th,
  // ma: logout_notice_ma,
})
/* 是否域名错误弹窗 */
const is_domain_error = ref(false)
/** 
 * 判断是否是登录状态 default: false
 */
const is_invalid = ref(UserCtr.is_invalid)
onMounted(() => {
  is_show.value = is_invalid.value
  if (utils_info.is_iframe) {
    backDrop.value = true;
  }
})

/* 监听mitt */
const { emitters_off } = useMittEmitterGenerator([
  {
    /* 打开弹窗 */
    type: MITT_TYPES.EMIT_SHOW_ALERT_CMD,
    callback: show_alert
  },
  {
    /* 域名错误弹窗 */
    type: MITT_TYPES.EMIT_DOMAIN_ERROR_ALERT,
    callback: domain_error_alert
  }
])
/* 销毁mitt */
onUnmounted(emitters_off)

/**
 * @Description:显示弹窗
 * @param {object} data 弹窗内容
 * @return {undefined} undefined
 */
function show_alert(data) {
  text.value = data.text || "";
  if (text.value == "" || is_show.value) return;
  is_show.value = true;
  backDrop.value = true;//不允许点击空白关闭
  btn_text.value = data.btn_text || i18n_t('common.confirm')
  // 弹框时,关闭视频播放窗口
  useMittEmit(MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD, { cmd: "colse" })
  // 隐藏loading动画背景
  useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD, 0);
}
/**
 * @Description:域名错误弹窗
 * @return {undefined} undefined
 */
function domain_error_alert() {
  is_domain_error.value = true
  is_show.value = true;
  // 弹框时,关闭视频播放窗口
  useMittEmit(MITT_TYPES.EMIT_VIDEO_ZONE_EVENT_CMD, { cmd: "colse" })
  // 隐藏loading动画背景
  useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD, 0);
}

/**
 * @Description:确认弹窗回调
 * @return {undefined} undefined
 */
function callback() {
  if (window.frames.length != parent.frames.length) {
    console.log('在iframe里面');
  } else {
    console.log('不在 iframe里')
    backDrop.value = true;
    window.close();
  }
}
function refresh() {
  location.reload()
}
/**
 * @Description:确认弹窗
 * @return {undefined} undefined
 */
function confirm() {
  is_show.value = false;
  text.value = "";
  callback()
}

</script>

<style lang="scss" scoped>
/** 弹窗样式 -S*/
.dialog_content {
  box-shadow: none !important;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.alert-wrap {
  text-align: center;
  border-radius: 4px;
  width: 320px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-position: top center;
  background-size: 100%;
  background-repeat: no-repeat;

  .items-center {
    padding: 12px 0 20px;
    // background-color: var(--q-gb-bg-c-1);
    background-color: #fff;
    position: relative;
    border-radius: 0 0 8px 8px;
    width: 320px;
  }

  .text {
    padding: 10px 20px 0;
    color: #343434;
    font-size: 18px;
    font-family: PingFangSC-Medium;
    position: relative;
    width: 100%;
    text-align: left;
    font-weight: 600;

    &::before {
      content: "";
      display: block;
      width: 34px;
      height: 3px;
      background-image: var(--q-gb-bg-lg-13);
      position: absolute;
      top: 37px;
      border-radius: 2px;
      z-index: 9;
    }
  }

  .text-left {
    font-size: 16px;
    color: #3c4551;
    list-style: none;
    padding: 30px 20px 20px 30px;
    margin: 0;

    li {
      position: relative;
      margin-bottom: 13px;
      font-family: PingFangSC-Regular;
    }

    li::before {
      content: "";
      display: block;
      background-image: var(--q-gb-bg-lg-14);
      width: 5px;
      height: 5px;
      position: absolute;
      border-radius: 50%;
      top: 9px;
      left: -10px;
    }
  }

  .page-lost {
    text-align: center;
    margin: auto;

    img {
      width: 170px;
    }

    .text1 {
      color: #666;
      font-size: 14px;
    }

    .text2 {
      color: #999;
      margin-bottom: 10px;
    }
  }

  .btn {
    width: 159px;
    height: 43px;
    line-height: 43px;
    color: #333333;
    border-radius: 22px;
    cursor: pointer;
    font-size: 18px;
    background-image: url($SCSSPROJECTPATH+"/image/image/btn.svg");
    margin: 0 auto;
    background-size: contain;
    background-color: transparent !important;
    background-repeat: no-repeat;
    background-position: center;
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
