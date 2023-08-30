<!-- @Description: 网络不给力，空空如也这些信息展示 -->
<template>
    <div class="no-data"
        :style="{ 'min-height': top_height + 'px', paddingTop: is_detail && top_height < 500 ? '.6rem' : '80px' }">

        <template v-if="['暂无,此处逻辑产品暂时说放弃'].includes(which)">
            <div class="empty-favorite-bg"
                :style="{ backgroundImage: UserCtr.theme.includes('theme01') ? `url(${arr.noMatchNew.url})` : `url(${arr.noMatchNew.url2})` }">
            </div>
            <p class="title" :style="{ color: UserCtr.theme.includes('theme01') ? '#666666' : ' #B9B9B9' }">{{
                arr.noMatchNew.txt[0]
            }}</p>
            <p class="title-tint" :style="{ color: UserCtr.theme.includes('theme01') ? '#999999' : ' #999999' }">{{
                arr.noMatchNew.txt[1] }}</p>
            <p>
                <span class="btn" @click="refresh_data"
                    :style="{ color: UserCtr.theme.includes('y0') ? '#4987FB' : '#FF9124', borderColor: UserCtr.theme.includes('y0') ? '#569FFD' : '#FF9124' }">
                    {{ arr.noMatchNew.txt[2] }}</span>
            </p>
        </template>

        <template v-if="['noMatch', 'noWifi', 'noMessage'].includes(which)">
            <div class="empty-favorite-bg"
                :style="{ backgroundImage: UserCtr.theme.includes('theme01') ? `url(${arr.noMatch.url})` : `url(${arr.noMatch.url2})` }">
            </div>
            <p style="color:#A5A9B3;">{{ which === 'noMessage' ? arr.noMessage.txt : arr.noMatch.txt }}</p>
        </template>

        <template v-if="which === 'nolive'">
            <div class="empty-favorite-bg"
                :style="{ backgroundImage: UserCtr.theme.includes('theme01') ? `url(${arr.nolive.url})` : `url(${arr.nolive.url2})` }">
            </div>
            <p style="color:#A5A9B3;"> {{ arr.nolive.txt }} </p>
        </template>

        <template v-if="which === 'collect'">
            <div class="empty-favorite-bg"
                :style="{ backgroundImage: UserCtr.theme.includes('theme01') ? `url(${arr.collect.url})` : `url(${arr.collect.url2})` }">
            </div>
            <p style="color:#A5A9B3;">{{ arr.collect.txt }}</p>
        </template>
    </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { i18n_t } from "src/boot/i18n.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
// const noMatch2 = () => import("public/image/png/noMatch2.png")

// ==========图片===============
import noMatchSvg from 'public/image/svg/noMatch.svg'
import noMatch2Png from 'public/image/png/noMatch2.png'
import noShoucSvg from 'public/image/svg/no_shouc.svg'
import noShouc2Svg from 'public/image/svg/no_shouc2.svg'
import noMatchNewPng from 'public/image/png/noMatch_new.png'
import noMatch2NewPng from 'public/image/png/noMatch2_new.png'
import noLivedataSvg from 'public/image/svg/no_livedata.svg'
import no_livedata2Svg from 'public/image/svg/no_livedata2.svg'
import nowifiSvg from 'public/image/svg/nowifi.svg'
// TODO:


// TODO: 临时用

const arr_const = {
    collect: {
        url: noShoucSvg,
        url2: noShouc2Svg,
        // '暂无关注的赛事哦',
        txt: i18n_t('msg.msg_nodata_08'),
    },
    noWifi: {
        url: nowifiSvg,
        //'网络不给力',
        txt: i18n_t('msg.msg_nodata_09'),
    },
    noMatch: {
        url: noMatchSvg,
        url2: noMatch2Png,
        //'空空如也~',
        txt: i18n_t('msg.msg_nodata_02'),
    },
    noMatchNew: {
        url: noMatchNewPng,
        url2: noMatch2NewPng,
        //'数组 对应 标题 提示文字 刷新',
        txt: i18n_t('msg.msg_nodata_02_new'),
    },
    noMessage: {
        url: noMatchSvg,
        url2: noMatch2Png,
        //'暂无消息记录~',
        txt: i18n_t('msg.msg_nodata_17'),
    },
    nolive: {
        url: noLivedataSvg,
        url2: no_livedata2Svg,
        //'暂无直播的赛事哦',
        txt: i18n_t('msg.msg_nodata_14'),
    }
}

 const props = defineProps({
        which: {
            type: String,
            required: true
        },
        height: {
            required: true
        },
    })
    const arr = ref(arr_const)
    const top_height = ref(0)
    const is_detail = ref(false)

    const route = useRoute()
    function init() {
        top_height.value = window.innerHeight - props.height;
        is_detail.value = route.name === 'category';
    }
    onMounted(init)

    // 监听国际化语种变化,一旦变化修正国际化字符串
    watch(
        // () => $i18n.locale,
        () => arr.value = arr_const
    )

    function refresh_data() {
        // TODO: mitt?
        useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {
            text: "footer-refresh"
        });
    }


    // beforeUnmount() {
    //     // TODO: 暂不清楚$data用途
    //     for (const key in this.$data) {
    //         this.$data[key] = null
    //     }
    // },

</script>

<style lang="scss" scoped>
.no-data {
    border-bottom: 1px solid transparent;
    min-height: 100%;
    text-align: center;
    color: #a5a9b3;

    .empty-favorite-bg {
        width: 1.8rem;
        height: 1.61rem;
        margin: 0 auto;
        background-size: contain;
        background-repeat: no-repeat;
        user-select: none;
    }

    .title {
        font-family: PingFangSC-Medium;
        font-size: 0.14rem;
        color: #666666;
        margin-bottom: 0rem;
    }

    .title-tint {
        margin-top: 0.03rem;
        font-size: 0.12rem;
        color: #999999;
    }

    .btn {
        display: inline-block;
        width: 1.2rem;
        height: 0.34rem;
        border: 1px solid transparent;
        border-radius: 0.17rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.14rem;
        margin: auto;
    }


    p {
        margin: 0.14rem;
        font-size: 0.14rem;

        span {
            display: inline-block;
            width: 1.4rem;
            height: 0.4rem;
            line-height: 0.4rem;
            border-radius: 0.05rem;
            color: #ffb001;
            border: 1px solid #ffb001;
        }
    }
}
</style>
