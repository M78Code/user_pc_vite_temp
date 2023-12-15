<!--
 * @Author: Cronus
 * @Date: 2020-07-14 17:46:49
 * @Description: 赛事列表页右下角可拖拽的菜单组件
-->
<template>
  <div class="virtual-footer-menu" v-if="standard_edition == 1" :class="{black2:get_theme.includes('theme02')}">
    <!-- 刷新按钮 -->
    <!-- <div class="refesh-wrap yb-flex-center" @click="set_loading">
      <img :class="{rotate:is_refresh}" src="image/bw3/svg/virtual-sports/refresh.svg">
    </div> -->

    <!--玩法菜单-->
    <div class="sub-m-menu flex justify-around items-center">
      <div v-for="(sub_m,sub_i) of footer_sub_m_list" :key="sub_i"
        @click="sub_menu_changed(sub_m,sub_i)"
        class="wrapper column justify-center items-center"
        :class="{
          'current_sub_menu':sub_i == sub_footer_menu_i,
          'is-favorite':get_show_favorite_list,
        }">
        <div class="wrapper-inner column items-center justify-center">
          <div class="play-icon-wrap relative-position" :class="sub_m.icon">
          </div>
          <div class="title-contain relative-position row">
            <span>{{sub_m.title}}</span>&nbsp;<span class="title0">{{sub_m.title1}}</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { debounce } from "lodash";
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"

export default {
  name: 'floatingMenu',
  data() {
    return {
      is_refresh:false,
      // 选中的子菜单下标
      sub_footer_menu_i:0,
      //上一次的
      prev_floating_sub:'prev-floating-sub-i',
      standard_edition
    }
  },
  created(){
    this.cancel_loading = debounce(this.cancel_loading,500)
  },
  destroyed () {
    this.debounce_throttle_cancel(this.cancel_loading);
  },
  mounted() {
    // 初始化关注按钮显示状态
    this.init_play_way_selected();
  },
  methods:{
    // ...mapMutations([
    //   'set_footer_sub_menu_id',
    // ]),
    set_footer_sub_menu_id(){},
    /**
     * 初始化玩法选中项
     */
    init_play_way_selected(){
      let p_i = sessionStorage.getItem(this.prev_floating_sub);
      if(p_i != null){
        p_i = p_i * 1;
        this.sub_menu_changed(this.footer_sub_m_list[p_i],p_i);
      }
    },
    /**
     * @description: 更新第一个页脚菜单
     * @param {Object} sub_menu
     * @param {Number} i
     * @return {Undefined} Undefined
     */
    sub_menu_changed(sub_menu,i){
      sessionStorage.setItem(this.prev_floating_sub,i);
      this.sub_footer_menu_i = i;
      this.set_footer_sub_menu_id(sub_menu && sub_menu.id);
    },
    set_loading(){
      this.is_refresh = true
      this.cancel_loading()
    },
    /**
     * @Description 取消刷新loading
     * @param {undefined} undefined
    */
    cancel_loading(){
      this.is_refresh = false;
    }
  },
  computed:{
    // ...mapGetters([
    //   "get_show_favorite_list",
    //   "get_curr_sub_menu_type",
    //   "get_newer_standard_edition", // 1新手版 2标准版
    //   "get_theme"
    // ]),
    get_show_favorite_list(){return ''},
    get_curr_sub_menu_type(){ return VR_CTR.get_curr_sub_menu_type() },
    get_theme(){return 'theme01'},

    footer_sub_m_list(){
      return [
        {
          title:this.get_lang=='en'?'':i18n_t('footer_menu.full_time'),
          title1:i18n_t('footer_menu.win_alone'),
          icon0:'f-icon-sub-duying0.svg',
          icon:'f-icon-sub-duying.svg',
          icon1:'f-icon-sub-duying-black.svg',
          id:1   // hpid 独赢
        },
        {
          title:this.get_lang=='en'?'':i18n_t('footer_menu.full_time'),
          title1:i18n_t('footer_menu.rangqiu'),
          icon0:'f-icon-sub-rang0.svg',
          icon:'f-icon-sub-rang.svg',
          icon1:'f-icon-sub-rang-black.svg',
          id:4    // hpid 让球
        },
        {
          title:this.get_lang=='en'?'':i18n_t('footer_menu.full_time'),
          title1:i18n_t('footer_menu.daxiao'),
          icon0:'f-icon-sub-daxiao0.svg',
          icon:'f-icon-sub-daxiao.svg',
          icon1:'f-icon-sub-daxiao-black.svg',
          id:2  // hpid 大小
        }
      ]
    },
  },
  watch:{
    get_curr_sub_menu_type(new_v){
      // 32129 需求中要求默认选中 独赢 因此 if 1 , 后续如果改动不需要可直接去掉
      // if(1 || [1002, 1011, 1010, 1009].includes(+new_v)){ //赛马 摩托车 泥地摩托车强制改为独赢
        let p_i = 0;
        this.sub_menu_changed(this.footer_sub_m_list[p_i],p_i);
      // }
    },
  }
};
</script>

<style lang="scss" scoped>
/*  刷新按钮 */
@keyframes loading-ring-animate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.virtual-footer-menu {
  //height: 0.66rem;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 0.48rem;
  height: calc(0.48rem + env(safe-area-inset-bottom));
  z-index: 100;

  .play-icon-wrap {
    background: var(--q-color-img-bg-13) no-repeat 0 0 / 0.2rem 2.77rem;
  }

  &.black2 {
    .play-icon-wrap {
      background-image: var(--q-color-img-bg-14);
    }
  }

  .refesh-wrap {
    position: fixed;
    width: 0.3rem;
    height: 0.3rem;
    right: 0.2rem;
    bottom: 1rem;
    border-radius: 50%;

    img {
      transition: transform 1s;

      &.rotate {
        animation: 0.5s loading-ring-animate linear infinite;
      }
    }
  }
}

.sub-m-menu {
  width: 100%;
  height: 0.48rem;

  .wrapper {
    width: 25%;
    height: 100%;
    position: relative;

    &.current_sub_menu {
      &:after {
        content: ' ';
        display: block;
        width: 0.44rem;
        height: 0.28rem;
        z-index: 1;
        border-radius: 0.22rem;
        margin-top: 0.14rem;
      }
    }

    .wrapper-inner {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      position: absolute;
    }

    .play-icon-wrap {
      height: 0.2rem;
      width: 0.2rem;
      z-index: 2;

      &[class*='duying'] {
        background-position: 0 -1.5rem !important;
      }

      &[class*='rang'] {
        background-position: 0 -1.8rem !important;
      }

      &[class*='daxiao'] {
        background-position: 0 -2.4rem !important;
      }
    }

    .title-contain {
      max-width: 100%;
      font-size: 0.11rem;
      z-index: 2;
      padding-top: 0.05rem;
      flex-wrap: nowrap;

      span {
        flex-shrink: 0;
      }
    }
  }
}
</style>
