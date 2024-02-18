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
        <span class="triangle-down triangle-up" @click="hide_dialog"></span>
      </div>
    </div>
  </div>
</template>

<script>
import seamlessMarquee from 'src/base-h5/components/details/seamless-marquee.vue' // 详情页头部联赛名文字超出隐藏无缝滚动
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { go_where } from "src/core/utils/project/module/go-where.js"  
import { useRouter, useRoute } from "vue-router";
import { project_name } from "src/output/index.js"
export default {
  name: 'dialog_header',
  data(){
    return {
      // 文本是否溢出
      bool_ellipsis: false,
      route: useRoute(),
      router: useRouter(),
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
    go_where_item(params) {
      if(project_name == 'app-h5'){
       this.router.go(-1)
      }else{
        go_where( {...params, route: this.route, router: this.router} );
      }
      
    },
    // 点击倒三角收起
    hide_dialog(){
      // 显示联赛列表传false
      useMittEmit(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-header {
  // width: 3.75rem;
  width: 100%;
  //background: url($SCSSPROJECTPATH + "/image/svg/go-back-icon.svg") no-repeat 50%/96% 96%;
  height: 0.44rem;
  line-height: 0.44rem;

  position: fixed;
  top: 0;
  z-index: 2;

  .triangle-down {
    width: 0;
    height: 0;
    border: 0.05rem solid;
    border-color: #050505 transparent transparent transparent;
    display: inline-block;
    transform: rotate(180deg);
    &.triangle-up{
      transform: rotate(0);
    }
  }
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
  background: url($SCSSPROJECTPATH + "/image/svg/go-back-icon.svg") no-repeat center / 96% 96%;
  background-size: 100% 100%;
}

/*************** 返回图标icon *************** -E*/
</style>
src/core/utils/common/index.js