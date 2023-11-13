<!--
 * @Author: harry
 * @Date: 2022-08-09 18:35:53
 * @Description: 首页加载中
-->
<template>
  <div v-show="is_introduce" class="introduce" :style="{'backgroundImage': 'url('+current_obj.img+')'}">
      <div class="introduce-modal" :style="{'backgroundImage': 'url('+current_obj.m_img+')'}">
        <div class="introduce-content">
          <p v-html="current_obj.text"></p>
          <div v-if="active_index < introduce_obj.length-1" class="btn" :class="{'btn-y0': get_theme == 'theme01_y0'}" @click="to_next()">下一步({{active_index+1}}/{{introduce_obj.length}})</div>
          <div v-else class="btn" :class="{'btn-y0': get_theme == 'theme01_y0'}" @click="is_introduce = false">知道了({{active_index+1}}/{{introduce_obj.length}})</div>
        </div>
        <div class="introduce-pointer">
            <ul>
              <li v-for="(item, index) in introduce_obj" :key="index" :class="{ 'active': active_index == index, 'active-y0': get_theme == 'theme01_y0' }"></li>
            </ul>
          </div>
        <div class="close" @click="is_introduce = false"></div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: 'introduce',
  props: {
    top: {
      type: String,
      default: '0',
    },
  },
  data() {
    return {
      // 是否弹出介绍页
      is_introduce: false,
      active_index: 0,
      introduce_data: [
        { id: 0, img:  require('public/image/introduce/1.jpg') , m_img:  require('public/image/introduce/modal/top.png') ,  text: `<span style="color:#FF8500">Hi! </span>今天，我们<span style="color:#FF8500">成功升级</span>了！<br />邀请您一起体验下<span style="color:#FF8500">新功能</span>！` },
        { id: 1, img:  require('public/image/introduce/2.jpg') , m_img:  require('public/image/introduce/modal/top.png') ,  text: `新增<span style="color:#FF8500">篮球预约投注</span>功能！<br />不妨<span style="color:#FF8500">点击</span>试试看！` },
        { id: 2, img:  require('public/image/introduce/3.jpg') , m_img:  require('public/image/introduce/modal/top.png') ,  text: `预约<span style="color:#FF8500">数值调整</span>新体验！<br /><span style="color:#FF8500">长按“+/—”，</span>可连续调整哟！` }
      ],
      introduce_data_y0: [
        { id: 0, img:  require('public/image/introduce/y0-1.jpg') , m_img:  require('public/image/introduce/modal/y0-top.png') ,  text: `<span style="color:#4276FB">Hi! </span>今天，我们<span style="color:#4276FB">成功升级</span>了！<br />邀请您一起体验下<span style="color:#4276FB">新功能</span>！` },
        { id: 1, img:  require('public/image/introduce/y0-2.jpg') , m_img:  require('public/image/introduce/modal/y0-top.png') ,  text: `新增<span style="color:#4276FB">篮球预约投注</span>功能！<br />不妨<span style="color:#4276FB">点击</span>试试看！` },
        { id: 2, img:  require('public/image/introduce/y0-3.jpg') , m_img:  require('public/image/introduce/modal/y0-top.png') ,  text: `预约<span style="color:#4276FB">数值调整</span>新体验！<br /><span style="color:#4276FB">长按“+/—”，</span>可连续调整哟！` },
      ],
      introduce_data_full: [
        { id: 0, img:  require('public/image/introduce/full-1.jpg') , m_img:  require('public/image/introduce/modal/top.png') ,  text: `<span style="color:#FF8500">Hi! </span>今天，我们<span style="color:#FF8500">成功升级</span>了！<br />邀请您一起体验下<span style="color:#FF8500">新功能</span>！` },
        { id: 1, img:  require('public/image/introduce/full-2.jpg') , m_img:  require('public/image/introduce/modal/top.png') ,  text: `新增<span style="color:#FF8500">篮球预约投注</span>功能！<br />不妨<span style="color:#FF8500">点击</span>试试看！` },
        { id: 2, img:  require('public/image/introduce/full-3.jpg') , m_img:  require('public/image/introduce/modal/top.png') ,  text: `预约<span style="color:#FF8500">数值调整</span>新体验！<br /><span style="color:#FF8500">长按“+/—”，</span>可连续调整哟！` },
        { id: 3, img:  require('public/image/introduce/full-4.jpg') , m_img:  require('public/image/introduce/modal/top.png') ,  text: `新增右侧区域<span style="color:#FF8500">收起功能</span>！<br />收起后可展示<span style="color:#FF8500">更多玩法</span>哟！` }
      ],
      introduce_obj: [],
      current_obj: {}
    };
  },
  watch: {
    /**
     * 是否首次登录
     */
    vx_is_new_user: {
      handler(val) {
        if(val) {
          this.introduce_show()
        }
      }
    },
    /**
     * 语言切换
     */
    get_lang: {
      handler(val) {
        if(val == 'zh') {
          this.introduce_show()
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      // 是否首次登录
      vx_is_new_user: "get_is_new_user",
      // 登录是否失效
      vx_get_is_invalid: "get_is_invalid",
      //语言
      get_lang: "get_lang",
      // 商户样式
      get_theme: "get_theme",
      // 是否完成引导页
      get_is_first_introduce_write : "get_is_first_introduce_write"
    })
  },
  created() {
    // this.introduce_show()
  },
  methods: {
    ...mapActions({
      set_is_first_introduce_write: "set_is_first_introduce_write"
    }),
    to_next() {
      this.active_index++
      this.$set(this, 'current_obj', this.introduce_obj[this.active_index])
    },
    introduce_show () {
        // 首次登录，位完成引导页，登录有效，是中文
      if (this.vx_is_new_user && !this.get_is_first_introduce_write && !this.vx_get_is_invalid && this.get_lang == 'zh') {
        // 是否内嵌
        let is_iframe = window.is_iframe
        if (is_iframe) {
          this.is_introduce_true()
        } else if (!is_iframe && this.get_theme != 'theme01_y0') {
          this.is_introduce_true()
        } else {
          this.is_introduce = false
        }

      }
    },
    is_introduce_true() {
        // 内嵌版本黄色，蓝色版本出现，非内嵌只有黄色版本出现
          if (is_iframe) {
            // 嵌套
            if (this.get_theme == 'theme01_y0') {
              // 内嵌蓝色商户
              this.introduce_obj = this.introduce_data_y0
            } else {
              // 内嵌黄色色商户
              this.introduce_obj = this.introduce_data
            }
          } else {
            // 非内嵌
            if (this.get_theme != 'theme01_y0') {
              // 非内嵌蓝色商户
              this.introduce_obj = this.introduce_data_full
            }
          }
          let img = []
          let flag = 0
          let len = this.introduce_obj.length
          this.introduce_obj.forEach((item, index) => {
            img[index] = new Image()
            img[index].src = item.img
            img[index].onload = ()=>{
              flag++
              // 图片加载完成
              if (flag == len) {
                // 弹出介绍页
                this.is_introduce = true
                // 已读完成引导页
                this.set_is_first_introduce_write(true)
                this.$set(this, 'current_obj', this.introduce_obj[0])
              }
            }
          })

    }
  }
}
</script>

<style lang="scss" scoped>
.introduce {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    // background: url('~public/image/introduce/1.jpg') top center no-repeat;
    background-size: 100% auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10011;
    .introduce-modal {
      position: relative;
      display: flex;
      align-items: flex-end;
      width: 320px;
      height: 246px;
      padding-bottom: 16px;
      box-sizing: border-box;
      background: #FFFFFF;
      border-radius: 20px;
      background: url('~public/image/introduce/modal/top.png') center center no-repeat;
      background-size: 320px 246px;
      .introduce-content {
        width: 100%;
        font-size: 14px;
        color: #414655;
        text-align: center;
        line-height: 24px;
        font-weight: 500;
        p {
          margin: 0;
          margin-bottom: 24px;
        }
        .btn {
          width: 120px;
          height: 32px;
          margin: 0 auto;
          font-size: 14px;
          color: #FFFFFF;
          line-height: 32px;
          font-weight: 500;
          background-image: linear-gradient(198deg, #FFB001 0%, #FF7000 95%);
          border-radius: 18px;
          cursor: pointer;
        }
        .btn-y0 {
          background-image: linear-gradient(135deg, #3D72FA 0%, #62B6FF 100%);
        }
      }
      .introduce-pointer {
        width: 100%;
        position: absolute;
        bottom: 50px;
        left: 0;
          ul {
            display: flex;
            justify-content: space-between;
            list-style-type: none;
            padding: 0 140px;
            margin: 8px 0 12px;
          }
          li {
            width: 4px;
            height: 4px;
            background: #A5AEC8;
            border-radius: 50%;
            &.active {
              background-image: linear-gradient(198deg, #FFB001 0%, #FF7000 95%);
            }
            &.active.active-y0 {
              background-image: linear-gradient(135deg, #3D72FA 0%, #62B6FF 100%);
            }
          }
        }
      .close {
        position: absolute;
        left: 146px;
        bottom: -48px;
        width: 28px;
        height: 28px;
        background: url('~public/image/introduce/modal/close.svg') center top no-repeat;
        background-size: cover;
        cursor: pointer;
      }
    }
  }
</style>
