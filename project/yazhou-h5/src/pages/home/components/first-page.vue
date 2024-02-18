<!--
 * @Author:
 * @Date:
 * @Description: 包网3首页下边（轮播 + 跑马灯 + 赛事框）
-->
<template>
    <div class="home-wrap">
      <carousel />
      <!-- 跑马灯、余额 -->
      <div class="wrap-notice">
        <div class="money-wrap" @click="get_balance">
          <div class="balance-wrap">
            <i class="icon-balance" :style="compute_css_obj('icon-balance')"></i>
            <span class="balance">{{ i18n_t("common.money") }}</span>
          </div>
          <div class="money">
            <span class="int">{{ balance_obj.int || "0" }}</span>
            <span class="dec">{{ balance_obj.dec || ".00" }}</span>
          </div>
        </div>
  
        <div class="wrap-marquee">
          <div class="marquee-left-wrap">
            <div class="marquee-icon">
              <i class="icon-notice" :style="compute_css_obj('icon-notice')"></i>
            </div>
          </div>
          <v-marquee />
        </div>
      </div>
      <!-- 跑马灯、余额 -->
      <home_menu />
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, computed, onUnmounted, reactive } from "vue";
  import home_menu from "src/base-h5/components/home/first-page/menu.vue";
  import carousel from "src/base-h5/components/home/first-page/carousel.vue";
  // TODO:后续修改调整
  // import { mapGetters, mapActions, mapMutations } from "vuex";
  // bw3版首页websocket逻辑处理
  // import skt_home_bw3 from "src/base-h5/mixins/websocket/data/skt_home_bw3.js";
  // 公告栏跑马灯
  import VMarquee from 'src/base-h5/components/marquee/marquee.vue'
  import { compute_css_obj } from "src/output/index.js";
  // mixins: [skt_home_bw3, match_list_mixin],
  //余额
  let balance_obj = ref({});
  // 定时器
  let home_timer1_ = ref(null);
  // 请求国际化
  const get_lang_v3 = () => {
    // base_data.get_load_lang_v3(get_lang.value)
  };
  onUnmounted(() => {
    // useMittOn(MITT_TYPES.EMIT_WINDOW_RESIZE, window_resize_on).off;
    if (home_timer1_) {
      clearTimeout(home_timer1_);
      home_timer1_ = null;
    }
  });
  //首页加载时初始化数据
  // set_bet_obj({});
  // set_bet_list([]);
  // set_show_favorite_list(false);
  get_lang_v3();
  </script>
  <style lang="scss">
  /* @import "project_path/src/css/pages/first-page.scss"; */
  
  .home-wrap {
    padding: 0 0.1rem;
  
    /* ************** 轮播icon *************** -E */
    /* 跑马灯、余额 */
    .wrap-notice {
      display: flex;
      align-items: center;
      margin: 0.14rem 0 0.1rem 0;
  
      .money-wrap {
        margin-right: 0.2rem;
  
        .balance-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 0.04rem;
  
          .icon-balance {
            width: 0.14rem;
            height: 0.14rem;
          }
  
          .balance {
            font-size: 0.12rem;
  
            margin: 0.03rem 0 0 0.05rem;
            line-height: 0.17rem;
          }
        }
  
        .money {
  
          line-height: 0.12rem;
  
          .int {
            font-size: 0.14rem;
          }
  
          .dec {
            font-size: 0.12rem;
          }
        }
      }
  
      .wrap-marquee {
        flex: 1;
        height: 0.3rem;
        border-radius: 0.15rem;
  
        display: flex;
        align-items: center;
        padding: 0 0.13rem 0 0.04rem;
        overflow: hidden;
        position: relative;
  
        .marquee-left-wrap {
          border-right-radius: 50%;
        }
  
        .marquee-icon {
          width: 0.24rem;
          height: 0.24rem;
  
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.24rem;
          margin-right: 0.04rem;
  
          .icon-notice {
            width: 0.14rem;
            height: 0.14rem;
          }
        }
  
        .marquee {
          flex: 1;
          height: 0.3rem;
          overflow: hidden;
        }
      }
    }
  
    :deep(.q-scrollarea__thumb) {
      opacity: 0 !important;
    }
  
    .wrap-loading {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: calc(var(--vh, 1vh) * 100);
    }
  }
  </style>
  
  <style lang="scss">
  .wrap-notice {
  
    .money-wrap {
      .balance-wrap {
        .icon-balance {
          background: var(--q-color-img-bg-5) no-repeat center / cover;
        }
  
        .balance {
          color: var(--q-gb-t-c-18);
        }
      }
  
      .money {
        color: var(--q-gb-t-c-18);
      }
    }
  
    .wrap-marquee {
      background: var(--q-gb-bd-c-15);
  
      .marquee-icon {
        background: var(--q-color-page-bg-color-120);
  
        .icon-notice {
          background: var(--q-color-img-bg-6) no-repeat center / cover;
        }
      }
  
      .marquee {
        color: var(--q-color-fs-color-5);
      }
  
      .user-list {
        li {
  
          color: var(--q-color-fs-color-7);
        }
      }
    }
  }</style>