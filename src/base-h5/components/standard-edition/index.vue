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
                    <img class='version_img' :src="compute_img_url('vocational_version')" alt="" />
                </div>
                <div class="btn" @click="set_standard_edition(2)">{{ i18n_t('common.use') }}</div>
            </div>
            <div class="item-box">
                <div class="bg">
                    <div class="title">{{ i18n_t('common.xinshou') }}</div>
                    <div class="desc">{{ i18n_t('common.yemianjianjie') }}</div>
                    <img class='version_img' :src="compute_img_url('noob_version')" alt="" />
                </div>
                <div class="btn" @click="set_standard_edition(1)">{{ i18n_t('common.use') }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import UserCtr from "src/core/user-config/user-ctr.js";
import {LocalStorage,compute_img_url,compute_local_project_file_path} from 'src/output/'
const isShow = ref(!LocalStorage.get('standard_edition'));
const emits = defineEmits(["change"])
function set_standard_edition(v) {
    isShow.value = false
    UserCtr.set_standard_edition(v)
    UserCtr.set_menu_init_change()
    emits('change', v);
    
}
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
    background-color: var(--q-gb-bg-c-15);
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
        background: var(--q-gb-bg-c-11);
    }
    .title {
        color: var(--q-gb-t-c-20);
        font-size: 15px;
        font-weight: 600;
        line-height: 21px;
    }

    .desc {
        color: var(--q-gb-t-c-11);
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