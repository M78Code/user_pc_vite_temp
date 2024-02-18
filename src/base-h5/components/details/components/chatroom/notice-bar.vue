<template>
    <div id="box" ref="box">
      <div class="marquee-box" ref="marquee" @mouseover="menter" @mouseleave="mleave">
        <img :src="compute_img_url('icon-bell')" alt="">
        <p ref="notice_list" id="pWidth">
          <span ref="notice_content">{{text}}</span>
        </p>
      </div>
    </div>
</template>

<script>
// #TODO vuex
// import {mapGetters} from "vuex";
import {compute_img_url} from "src/output/index.js"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent, nextTick } from "vue";
export default defineComponent({
  name: 'notice_bar',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  components: {},
  setup(props, evnet) {
    let data = reactive({
      value: 0,
      pwidth:0,//公告文本的宽度
    });

    onMounted(() => {
      let element = $refs.notice_content;
      pwidth = element.clientWidth;

      notice_move_timer = setInterval(clickCommend, 20);
      // 延迟显示，避免视觉跳闪
      show_notice_content_timer = setTimeout(() => {
        element.style.visibility = 'visible';
      }, 30)

    })
    watch(
      () => value,
      (newValue, oldValue) => {
        let allWidth= parseInt(pwidth) * 2;
        if(newValue <= -allWidth){
          $refs.notice_list.style.marginLeft = pwidth + "px";
          value = 0;
        }
      }
    );
    const clickCommend = (e) =>  {
      let _this = this;
      nextTick(() => {
        value -=1;
        $refs.notice_list.style.marginLeft = _this.pwidth + value + "px";
      });
    };
    const menter = () => {
      clearInterval(notice_move_timer);
    };
    const mleave = () => {
      notice_move_timer = setInterval(clickCommend, 20);
    };
    onUnmounted(() => {
      clearInterval(notice_move_timer);
      notice_move_timer = null
      clearTimeout(show_notice_content_timer)
      show_notice_content_timer = null
    })
    return {
      ...toRefs(data),
      clickCommend,
      menter,
      mleave,compute_css_obj
    }
  }
})
</script>

<style lang="scss" scoped>
#box {
  width: 100%;
  height: .34rem;
  position: relative;
}
.marquee-box  {
  position: relative;
  width: 100%;
  height: 100%;
  overflow:auto;
  background-color: #f8f8f8;
}
#pWidth{
  width: 3.36rem;
  height: .34rem;
  padding: 0;
  margin: 0;
  line-height: .34rem;
  display: inline-block;
  word-break: keep-all;
  white-space: nowrap;
  //overflow:hidden;
  background-color: #f8f8f8;
  span {
    display: inline-block;
    visibility: hidden;
  }
}
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
</style>