<!-- @Description: 网络不给力，空空如也这些信息展示 -->
<template>
    <div class="no-data" :style="{ 'min-height': top_height + 'px', paddingTop: is_detail && top_height < 500 ? '.6rem' : '0px' }">

        <!-- <template v-if="['暂无,此处逻辑产品暂时说放弃'].includes(which)">
            <div class="empty-favorite-bg"
                :style="{ backgroundImage: ('day') ? `url(${arr.noMatchNew.url})` : `url(${arr.noMatchNew.url2})` }">
            </div>
            <p class="title" :style="{ color: ('day') ? '#666666' : ' #B9B9B9' }">{{
                arr.noMatchNew.txt[0]
            }}</p>
            <p class="title-tint" :style="{ color: ('day') ? '#999999' : ' #999999' }">{{
                arr.noMatchNew.txt[1] }}</p>
            <p>
                <span class="btn" @click="refresh_data"
                    :style="{ color: ('y0') ? '#4987FB' : '#FF9124', borderColor: ('y0') ? '#569FFD' : '#FF9124' }">
                    {{ arr.noMatchNew.txt[2] }}</span>
            </p>
        </template> -->
        <!-- <div class="empty-favorite-bg" :style="compute_css_obj(lodash.get(arr_const[which], 'key'))"> </div> -->
        <img class="no_data_img" :class="[{ 'no-wifi': which === 'noWifi' }]" :src="no_data_icon" alt="">
         <!-- 有消息用消息 没有信息 用默认信息 -->
        <p> {{ msg ? i18n_t(msg) : lodash.get(arr_const[which], 'txt') }} </p>
    </div>
</template>

<script setup>
import { watch, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import { i18n_t ,} from "src/boot/i18n.js";
import { useMittEmit, MITT_TYPES, PROJECT_NAME } from "src/output/index.js"
import { no_data_new_app, no_data_collect, no_data_ouzhou, coming_soon, no_wifi } from 'src/base-h5/core/utils/local-image.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { is_collect } from 'src/base-h5/mixin/menu.js'

// const noMatch2 = () => import(`${LOCAL_PROJECT_FILE_PREFIX}/image/png/noMatch2.png`)

// ==========图片===============
// const noMatchSvg = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/noMatch.svg`
// const noMatch2Png = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/noMatch2.png`
// const noShoucSvg = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/no_shouc.svg`
// const noShouc2Svg = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/no_shouc2.svg`
// const noMatchNewPng = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/noMatch_new.png`
// const noMatch2NewPng = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/noMatch2_new.png`
// const noLivedataSvg = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/no_livedata.svg`
// const no_livedata2Svg = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/no_livedata2.svg`
// const nowifiSvg = `${LOCAL_PROJECT_FILE_PREFIX}/image/svg/nowifi.svg`


// TODO: 临时用

const arr_const = {
    comingSoon: {
        key:'coming-soon',
        // '暂无关注的赛事哦',
        txt: i18n_t('msg.msg_nodata_23'),
    },
    collect: {
        key:'no-collect',
        // '暂无关注的赛事哦',
        txt: i18n_t('msg.msg_nodata_08'),
    },
    noWifi: { 
        key:'no-wifi',
        //'网络不给力',
        txt: i18n_t('msg.msg_nodata_09'),
    },
    noMatch: {
        key:'no-match',
        //'空空如也~',
        txt: i18n_t('analysis_football_matches.no_data'),
    },
    noMatchNew: {
        key:'no-match',
        //'数组 对应 标题 提示文字 刷新',
        txt: i18n_t('msg.msg_nodata_02_new'),
    },
    noMessage: {
        key:'no-match',
        //'暂无消息记录~',
        txt: i18n_t('msg.msg_nodata_17'),
    },
    nolive: {
        key:'no-live',
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
    msg: {
        type: String,
        default: ''
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

const no_data_icon = computed(() => {
    if (PROJECT_NAME === 'ouzhou-h5') {
        if (props.which === 'comingSoon') {
            return coming_soon
        }
        if (props.which === 'noWifi') {
            return no_wifi
        }
        return no_data_ouzhou
    } else {
        if (is_collect.value) {
            return no_data_collect
        } else {
            return no_data_new_app
        }
    }
})

// 监听国际化语种变化,一旦变化修正国际化字符串
// watch(
//     // () => $i18n.locale,
//     () => arr.value = arr_const
// )

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
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom: 1px solid transparent;
    min-height: 100%;
    text-align: center;
    color: #a5a9b3;
    animation: an_scale 0.25s;

    .no_data_img{
        width: 180px;
        height: 180px;
    }

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
        color: var(--q-gb-t-c-19);
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
    @keyframes an_scale {
      0% {
        transform: scale(0.6);
      }
      100% {
        transform: scale(1);
      }
    }
}
</style>