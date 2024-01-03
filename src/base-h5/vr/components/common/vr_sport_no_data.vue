<!--
 * @Author: Router
 * @Description: 网络不给力，空空如也这些信息展示
-->
<template>
  <div class="no-data" :style="{'min-height':top_height +'px',paddingTop:is_detail && top_height < 500 ? '.6rem' : '80px'}">
    <template v-if="['noMatch', 'noWifi', 'noMessage'].includes(which)">
      <div class="empty-favorite-bg" :style="{backgroundImage:get_theme.includes('theme01') ?`url(${arr.noMatch.url})`:`url(${arr.noMatch.url2})` }"></div>
      <p style="color:#A5A9B3;">{{ which === 'noMessage' ? arr.noMessage.txt : arr.noMatch.txt }}</p>
    </template>

    <template v-if="which === 'nolive'">
      <div class="empty-favorite-bg" :style="{backgroundImage:get_theme.includes('theme01')?`url(${arr.nolive.url})`:`url(${arr.nolive.url2})`}"></div>
      <p style="color:#A5A9B3;"> {{arr.nolive.txt}} </p>
    </template>

    <template v-if="which === 'collect'">
      <div class="empty-favorite-bg" :style="{backgroundImage:get_theme.includes('theme01')?`url(${arr.collect.url})`:`url(${arr.collect.url2})`}"></div>
      <p style="color:#A5A9B3;">{{arr.collect.txt}}</p>
    </template>
  </div>
</template>

<script>
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
export default {
  name: "no_data",
  data() {
    return {
      arr: {
        collect: {
          url:    "image/bw3/svg/no_shouc.svg",
          url2:    "image/bw3/svg/no_shouc2.svg",
          txt: i18n_t('msg.msg_nodata_08'),// '暂无关注的赛事哦',
        },
        noWifi: {
          url:    "image/bw3/svg/nowifi.svg",
          txt: i18n_t('msg.msg_nodata_09'),//'网络不给力',
        },
        noMatch: {
          url:    "image/bw3/svg/noMatch.svg",
          url2:    "image/bw3/png/noMatch2.png",
          txt: i18n_t('msg.msg_nodata_02'),//'空空如也~',
        },
        noMatchNew: {
          url:    "image/bw3/png/noMatch_new.png",
          url2:    "image/bw3/png/noMatch2_new.png",
          txt: i18n_t('msg.msg_nodata_02_new'),//'数组 对应 标题 提示文字 刷新',
        },
        noMessage: {
          url:    "image/bw3/svg/noMatch.svg",
          url2:    "image/bw3/png/noMatch2.png",
          txt: i18n_t('msg.msg_nodata_17'),//'暂无消息记录~',
        },
        nolive: {
          url:    "image/bw3/svg/no_livedata.svg",
          url2:    "image/bw3/svg/no_livedata2.svg",
          txt: i18n_t('msg.msg_nodata_14'),//'暂无直播的赛事哦',
        }
      },
      top_height: 0,
      is_detail: false,
    }
  },
  props: {
    which: {
      type: String,
      required: true
    },
    height: {
      required: true
    },
  },
  unmounted() {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },

  created() {
    this.top_height = window.innerHeight - this.height;
    this.is_detail = this.$route.name === 'category';
  },
  watch: {
    // 监听国际化语种变化,一旦变化修正国际化字符串
    '$i18n.locale'(){
      this.arr = {
        collect: {
          url:    "image/bw3/svg/no_shouc.svg",
          url2:    "image/bw3/svg/no_shouc2.svg",
          txt: i18n_t('msg.msg_nodata_08'),// '暂无关注的赛事哦',
        },
        noWifi: {
          url:    "image/bw3/svg/nowifi.svg",
          txt: i18n_t('msg.msg_nodata_09'),//'网络不给力',
        },
        noMatch: {
          url:    "image/bw3/svg/noMatch.svg",
          url2:    "image/bw3/png/noMatch2.png",
          txt: i18n_t('msg.msg_nodata_02'),//'空空如也~',
        },
        noMatchNew: {
          url:    "image/bw3/png/noMatch_new.png",
          url2:    "image/bw3/png/noMatch2_new.png",
          txt: i18n_t('msg.msg_nodata_02_new'),//'数组 对应 标题 提示文字 刷新',
        },
        noMessage: {
          url:    "image/bw3/svg/noMatch.svg",
          url2:    "image/bw3/png/noMatch2.png",
          txt: i18n_t('msg.msg_nodata_17'),//'暂无消息记录~',
        },
        nolive: {
          url:    "image/bw3/svg/no_livedata.svg",
          url2:    "image/bw3/svg/no_livedata2.svg",
          txt: i18n_t('msg.msg_nodata_14'),//'暂无直播的赛事哦',
        }
      };
    }
  },
  computed: {
    // ...mapGetters(['get_theme']),
    get_theme(){ return 'theme01' }
  },
  methods: {
    refresh_data(){
      useMittEmit(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, {text: "footer-refresh"});
    }
  }
}
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

  .title{
    font-family: PingFangSC-Medium;
    font-size: 0.14rem;
    color: #666666;
    margin-bottom: 0rem;
  }
  .title-tint{
    margin-top: 0.03rem;
    font-size: 0.12rem;
    color: #999999;
  }

  .btn{
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
