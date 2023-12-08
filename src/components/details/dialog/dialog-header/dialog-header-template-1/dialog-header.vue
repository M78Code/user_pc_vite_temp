<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 赛事详情头部点击下拉后显示  "↑ 收起" + "< 返回按钮"
-->
<template>
<!-- 头部整体盒子 -->
  <div @touchmove.prevent.stop class='dialog-header' v-cloak>
    <div class="row mx-15">
      <!-- 返回按钮 -->
      <div class="col-1 details-t-color5 parent-back-icon" @click="go_where_item({back_to: 'go_to_back'})">
        <div class="go-back"></div>
      </div>
      <!-- 显示赛事名称 -->
      <div class="col-10 ellipsis text-center dialog-text-style details-t-color5" ref="content"  @click="hide_dialog">
        <!-- <div class="over-hide">{{tn}}</div> -->
        <seamless-marquee :content="tn"/>
        &nbsp;
        <!-- 倒三角收起图标 -->
        <span class="triangle-down" @click="hide_dialog"></span>
      </div>
    </div>
  </div>
</template>

<script>
import seamlessMarquee from 'src/project/components/common/seamless_marquee.vue' // 详情页头部联赛名文字超出隐藏无缝滚动
import { go_where } from "src/core/utils/project/module/go-where.js"  
export default {
  name: 'dialog_header',
  data(){
    return {
      // 文本是否溢出
      bool_ellipsis: false
    }
  },
  props: {
    tn: {
      type: String,
      default:''
    }
  },
  components:{
    seamlessMarquee
  },
  methods: {
    // 点击倒三角收起
    hide_dialog(){
      // 显示联赛列表传false
      useMittEmit(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, false)
    },
    go_where_item(params) {
      go_where( {...params, route: this.route, router: this.router} );
    },
  }
}
</script>

<style lang="scss" scoped>
.dialog-header {
  width: 3.75rem;

  height: 0.44rem;
  line-height: 0.44rem;

  position: fixed;
  top: 0;
  z-index: 2;

  .triangle-down {
    width: 0;
    height: 0;
    border-width: 0.05rem;
    border-style: solid;
    display: inline-block;
    transform: translateY(-0.02rem);
  }
}

.details-t-color5 {

}

.dialog-text-style {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.16rem;

  padding-left: 0.16rem;
}

.dialog-header-icon {
  font-size: 0.2rem;
  margin-left: -0.06rem;
}

.over-hide {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}


/*************** 返回按钮 *************** -S*/
.parent-back-icon {
  display: flex;
  align-items: center;
  border-right: .15rem solid transparent;   /*扩大可点击范围*/
}

/*************** 返回按钮 *************** -E*/

/*************** 返回图标icon *************** -S*/
.back-icon {
  font-size: 0.25rem;
}

.go-back {
  display: inline-block;
  width: 0.12rem;
  height: 0.2rem;
  background: var(--q-color-com-img-bg-82) no-repeat center / 96% 96%;
  background-size: 100% 100%;
}

/*************** 返回图标icon *************** -E*/
</style>
src/core/utils/common/index.js