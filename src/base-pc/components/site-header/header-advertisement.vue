<!--
 * @Description: 站点页眉 - 广告部分
-->
<template >
    <div class="swipper">
        <transition-group tag="div" class='swipper_wrap' :name="isPre ? 'listPre' : 'list'">
            <div v-for="(list, index) in currentSwipperArr" :key="`o_${index}`" v-show="index === currentSwipperIndex"
                @mouseenter="stop" @mouseleave="go" class="swipper_item">
                <img :src="list.img" />
            </div>
        </transition-group>

        <!-- 右边运营广告图 点击占位盒子 -->
        <div v-if="currentSwipperArr.length > 0" class="adv-box-r" :class="{ mini: main_menu_toggle == 'mini' }"
            @mouseenter="stop" @mouseleave="go" @click="menu_change('R')" ref="adv_box"
            :style="{ 'cursor': lodash.get(currentSwipperArr, `[${currentSwipperIndex}].isClick`) ? 'pointer' : 'unset' }">
           
            <p v-show="currentSwipperArr.length > 1 && showArrow" class="day_arrow">
                <img class="img" :src="compute_img_url('icon-left')" alt="" @click.stop="boxMouseup('pre')">
                <img class="img" :csrc="compute_img_url('icon-rigth')" alt="" @click.stop="boxMouseup('next')">
             </p>
            
            <!-- <p v-if="('day') && currentSwipperArr.length > 1 && showArrow" class="day_arrow">
                <img :src="day_left" alt="" @click.stop="boxMouseup('pre')">
                <img :src="day_right" alt="" @click.stop="boxMouseup('next')">
            </p>
            <p v-if="('night') && currentSwipperArr.length > 1 && showArrow" class="night_arrow">
                <img :src="night_left" alt="" @click.stop="boxMouseup('pre')">
                <img :src="night_right" alt="" @click.stop="boxMouseup('next')">
            </p> -->
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue'
import lodash from 'lodash'
import UserCtr from "src/core/user-config/user-ctr.js";
////import store from "src/store-redux/index.js";
import { i18n_t ,compute_img_url} from "src/output/index.js"

/** api */
import { api_account } from "src/api/index.js";

/** stroe仓库 */
// const { menuReducer, themeReducer } = store.getState()
// const unsubscribe = store.subscribe(() => {
    // theme.value = themeReducer.theme
    // main_menu_toggle.value = menuReducer.main_menu_toggle
// })
/** 销毁监听 */
// onUnmounted(unsubscribe)
/** 
 * 左侧列表显示形式 normal：展开 mini：收起
* 路径: project_path\src\store\module\menu.js
 */
const main_menu_toggle = ref()

/** 
* 用户余额是否展示状态 default: day
* 路径: src/base-pc/store/module/theme.js
*/
const theme = ref()

/**
 * 切换皮肤的时候重新启动计时器
 */
watch(
    () => theme.value,
    (o) => {
        clearInterval(showBannerSwipperTimer);
        currentSwipperArr = []
        if (o && o.includes('day')) {
            if (daySwipper.length > 0) {
                currentSwipperArr = daySwipper;
            }
        } else {
            if (nightSwipper.length > 0) {
                currentSwipperArr = nightSwipper;
            }
        }
        // 图片大于一张开启轮播
        if (currentSwipperArr.length > 1) {
            showBannerSwipperTimer = setInterval(() => {
                autoPlay()
            }, 7000)
        }
    }
)

/** 是否切换到上一张图片 */
const isPre = ref(false)

/** 日间版轮播图 */
let daySwipper = reactive([])
/** 夜间版轮播图 */
let nightSwipper = reactive([])
/** 当前轮播图索引 */
const currentSwipperIndex = ref(0)
/** 当前资源图片数组 */
let currentSwipperArr = reactive([])

/** 展示右侧图片资源上的左右箭头 */
const showArrow = ref(false)

let showBannerSwipperTimer_timeout = null
let showBannerSwipperTimer = null
/**
 * 鼠标移出--3s后重新开始轮播
 */
function go() {
    showArrow.value = false;
    clearTimeout(showBannerSwipperTimer_timeout)
    clearInterval(showBannerSwipperTimer)
    // 图片不止一张的时候才触发轮播
    if (currentSwipperArr.length > 1) {
        // 3秒之后立即切换一次图片
        showBannerSwipperTimer_timeout = setTimeout(() => {
            autoPlay()
            nextTick(() => {
                // 然后恢复每7秒一次的轮播
                showBannerSwipperTimer = setInterval(() => {
                    // autoPlay()
                }, 7000)
            })
        }, 3000)
    }
}

/**
 * 鼠标移入--暂停轮播
 */
function stop() {
    clearInterval(showBannerSwipperTimer);
    clearTimeout(showBannerSwipperTimer_timeout);
    showBannerSwipperTimer = null;
    showArrow.value = true;
}

/**
* 点击箭头切换图片
*/
function boxMouseup(type) {
    return lodash.debounce(() => {
        let timer_ = null
        if (timer_) {
            clearTimeout(timer_)
            timer_ = null
        }
        // 上一张
        if (type == 'pre') {
            isPre.value = true;
            if (currentSwipperIndex.value == 0) {
                change(currentSwipperArr.length - 1)
            } else {
                change(currentSwipperIndex.value - 1)
            }
            timer_ = setTimeout(() => {
                isPre.value = false;
            }, 400);
        }
        // 下一张
        if (type == 'next') {
            if (currentSwipperIndex.value == currentSwipperArr.length - 1) {
                change(0)
            } else {
                change(currentSwipperIndex.value + 1)
            }
        }
    }, 300)
}

/**
 * 点击左右按钮--切换图片
 */
function change(index) {
    currentSwipperIndex.value = index
}

/** TODO:
 * 运营位活动弹窗
 */
 function activity_dialog() {
  let token = get(computed_data.get_user, "token");
  // 兼容hk时接口获取不到数据
  let config = {
    lang: UserCtr.lang
  }
  api_account.get_BannersUrl({ type: 5, token }, config).then((res) => {
    let code = get(res, "data.code");
    let data = get(res, "data.data");
    if (code == 200) {
      let isShow = false;
      if (data && data.length > 0) {
        data.forEach((item) => {
          if (item.tType && item.tType == 5) {
            // 去掉一个自然日展示一次的判断，有值就展示
            if (data_ref.showActivityTime) {
              // 判断日期如果不在同一天就展示弹窗
              if (
                new Date(data_ref.showActivityTime).getDate() !==
                new Date().getDate()
              ) {
                isShow = true;
              }
            } else {
              isShow = true;
              sessionStorage.setItem("showActivityTime", new Date().getTime());
            }
            // 获取图片地址
            data_ref.imgUrl = get_server_file_path(item.imgUrl);
            data_ref.hostUrl = item.hostUrl;
            data_ref.urlType = item.urlType;
            // 是否允许点击跳转 ayx_act 爱游戏  act1 乐鱼
            data_ref.allowClick =
              ["act", "zr", "ayx_act", "act1"].includes(item.hostUrl) ||
              item.hostUrl != "";
          }
        });
      } else {
        isShow = false;
      }
      data_ref.showActivity = isShow;
      if (data_ref.showActivity) {
        // 5秒后自动消失
        let time = 5;
        // data_ref.userBannerTimer = i18n_t("common.auto_close").replace("%s", time);
        let timer = setInterval(() => {
          time--;
        //   data_ref.userBannerTimer = i18n_t("common.auto_close").replace("%s", time);
          if (time == 0) {
            data_ref.showActivity = false;
            clearInterval(timer);
          }
        }, 1000);
      }
    }
  });
}

</script>
<style lang="scss" scoped>
@import './site-header.scss';
</style>