<template>
  <div id="app">
    <div class="big">
      <div class="bg"></div>
      <div class="text">
        <span class="left">投注 </span>
        <span class="center">可赢655.00</span>
      </div>
      <div @mousedown="onMouseDown($event)" class="hand handler">{{jiantou}}</div>
    </div>
  </div>
</template>
    <script>
export default {
  el: "#app",
  props: {},
  data() {
    return {
      jiantou: '>',
      beginClientX: 0,
      mouseMoveStata: false,
      maxwidth: 258,
      confirmWords: "拖动滑块验证",
      /*滑块文字*/
      confirmSuccess: false /*是否成功*/,

      isDragging: false, // 是否正在拖动滑块
      thumbLeft: 0, // 滑块左边距
      maxWidth: 280, // 滑块最大可移动距离
      dragStartX: 0, // 开始拖动时鼠标的x坐标
      dragOffsetX: 0, // 鼠标相对于滑块左边缘的偏移量
    };
  },
  methods: {
    onMouseDown(e) {
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragOffsetX = e.offsetX;
    },
    onMouseMove(e) {
      console.log(1111111111111111111111)
      if (this.isDragging) {
        const distance = e.clientX - this.dragStartX;
        const thumbLeft = Math.min(
          Math.max(distance - this.dragOffsetX, 0),
          this.maxWidth
        );
        this.thumbLeft = `${thumbLeft}px`;
      }
    },
    onMouseUp(e) {
      console.log(22222222222222)
      this.isDragging = false;
      if (parseInt(this.thumbLeft) === this.maxWidth) {
        this.$emit("success");
      } else {
        this.thumbLeft = "0px";
      }
    },
  },
  mounted() {
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  },
  beforeDestroy() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  },
};
</script>
    <style>
    .left{
      color: var(--q-gb-t-c-14);
    }
    .center{
      margin-left: 0.1rem;
      color: var(--q-gb-t-c-13);
    }
    .text {
      position: absolute;
      top: 0px;
      width: 300px;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      -o-user-select: none;
      -ms-user-select: none;
      text-align: left;
      padding-left: 45px;
    }
.big {
  border-radius: 30px;
  position: relative;
  background-color: var(--q-gb-t-c-1);
  width: 300px;
  height: 34px;
  margin-left: 30px;
  margin-top: 100px;
  line-height: 34px;
  text-align: center;
  z-index: 999999999999999999;
}

.hand {
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.2rem;
  color: var(--q-gb-t-c-1);
}

.handler {
  background: #fff;
}

.handlerFinish {
  background: #ff0000;
}

.bg {
  border-radius: 30px;
  background-color: #13ce66;
  height: 34px;
  width: 0px;
}


</style>