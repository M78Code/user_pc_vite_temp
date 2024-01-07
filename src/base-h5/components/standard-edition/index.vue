<template>
    <div class="dialog" v-if="isShow">
        <div class="standard-edition">
            <div class="close" @click="isShow=false">
                <img :src="compute_local_project_file_path('/image/common/dialog_close.png')" alt="">
            </div>
            <div class="item-box">
                <div class="bg">
                    <div class="title">{{ i18n_t('common.zhuanye') }}</div>
                    <div class="desc">{{ i18n_t('common.gongnengwanshan') }}</div>
                    <div class='version_img' :style="compute_css_obj({key: 'h5-new-page'})"></div>
                </div>
                <div class="btn" @click="set_standard_edition(2)">{{ i18n_t('common.use') }}</div>
            </div>
            <div class="item-box">
                <div class="bg">
                    <div class="title">{{ i18n_t('common.xinshou') }}</div>
                    <div class="desc">{{ i18n_t('common.yemianjianjie') }}</div>
                    <div class='version_img' :style="compute_css_obj({key: 'h5-new-page-xs'})"></div>
                </div>
                <div class="btn" @click="set_standard_edition(1)">{{ i18n_t('common.use') }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import UserCtr from "src/core/user-config/user-ctr.js";
import {LocalStorage, SessionStorage, compute_img_url,compute_local_project_file_path,compute_css_obj} from 'src/output/'
const isShow = ref(false);
const emits = defineEmits(["change"])
function set_standard_edition(v) {
    // 关闭弹窗
    confirm_standard_edition()
    UserCtr.set_standard_edition(v)
    UserCtr.set_menu_init_change()
    emits('change', v);
    
}
// =============弹窗开启条件==============
const userid = SessionStorage.get('user_id')
let data = LocalStorage.get('setting_modal_info') || {}
if (data[userid]) {
    isShow.value = false;
} else {
    isShow.value = true;
}
const confirm_standard_edition = (set_default = false) => {
    // 获取用户id
    const userid = SessionStorage.get('user_id');
    // 获取用户是否登录信息
    let data = LocalStorage.get('setting_modal_info') || {};
    if (!data[userid]) {
        data[userid] = {};
    }
    data[userid].isShow = false;
    // 设置用户是否登录过
    LocalStorage.set("setting_modal_info", data);
    if(!set_default){
        isShow.value = false;
    }
}
onMounted(() => {
    confirm_standard_edition(true)
})
// ==============结束==========================
</script>
<style lang="scss" scoped>
.dialog {
    position: fixed;
    z-index: 9999;
    height: 100vh;
    width: 100vw;
    display: flex;
    left: 0;
    top: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #00000050;
}
.standard-edition {
    position: relative;
    display: flex;
    border-radius: 20px;
    padding: 24px 16px 16px;
    justify-content: space-between;
    background-color: var(--q-gb-bg-c-46);
    width: 348px;
    .close{
        position: absolute;
        top: -38px;
        right: 0;
        width: 28px;
        height: 28px;
        img{width: 100%;}
    }
    .item-box {
        text-align: center;
        width: 150px;
    }
    .bg {
        padding-top: 12px;
        background: var(--q-gb-bg-c-18);
        border-radius: 10px;

    }
    .title {
        color: var(--q-gb-t-c-18);
        font-size: 15px;
        font-weight: 600;
        line-height: 21px;
    }

    .desc {
        color: var(--q-gb-t-c-24);
        font-size: 12px;
        line-height: 17px;
        margin-top: 4px;
    }

    .version_img {
        display: block;
        width: 150px;
        height: 90px;
        margin: 10px auto 0;
    }

    .btn {
        background: var(--q-gb-bg-c-13);
        text-align: center;
        margin: 16px auto 0;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        font-weight: 500;
        color: var(--q-gb-t-c-14);
        border-radius: 20px;
        width: 76px;
    }
}</style>