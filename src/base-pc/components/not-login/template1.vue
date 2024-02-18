<template>
    <div class="no-token-wrap">
        <img class="no-token-img" :src="imgSrc[lang] || imgSrc.en" />
    </div>
</template>
<script setup>
import { compute_local_project_file_path, i18n } from "src/output/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import { ref, reactive } from 'vue'
const lang = ref(LocalStorage.get('lang', UserCtr.lang || i18n.global.fallbackLocale))
/* 退出登录通知-中文 */
const logout_notice = compute_local_project_file_path('/image/image/not_login_zh.jpg')
/* 退出登录通知-英文 */
const logout_notice_en = compute_local_project_file_path('/image/image/not_login_en.jpg')
/* 退出登录通知-越南语 */
const logout_notice_vi = compute_local_project_file_path('/image/image/not_login_en.jpg')
/* 退出登录通知-泰语 */
const logout_notice_th = compute_local_project_file_path('/image/image/not_login_en.jpg')
/* 退出登录通知-马来语 */
// const logout_notice_ma = compute_local_project_file_path('/image/image/logout_notice_ma.png')
const imgSrc = reactive({
    zh: logout_notice,
    tw: logout_notice,
    en: logout_notice_en,
    vi: logout_notice_vi,
    th: logout_notice_th,
    // ma: logout_notice_ma,
})
</script>
<style lang="scss">
.no-token-img {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
</style>
