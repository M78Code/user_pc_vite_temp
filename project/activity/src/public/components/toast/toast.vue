<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 消息提示
-->
<template>
  <div>
    <q-dialog v-model="is_show" seamless>
      <q-card class="dialog_content">
        <q-card-section>
          <div class="text-h6">
            <slot name="img">
              <img src="~public/image/wwwassets/yabo/svg/warn.svg" />
            </slot>
          </div>
          <slot name="msg">{{text}}</slot>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      is_show: false,
      text: ""
    };
  },
  created() {
    this.$root.$on(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.show_toast);
  },

  methods: {
    /**
    * @Description:显示消息框
    * @Author Cable
    * @param:msg：消息内容
    * @param:delay:延迟关闭时间 单位毫秒
    * @return:
    */
    show_toast(msg, delay = 2000) {
      this.text = msg || "";
      if (this.text == "" || this.is_show) return;
      this.is_show = true;
       if (this.timer_) {
				clearTimeout(this.timer_)
				this.timer_ =null
				};
      let timer_ = setTimeout(() => {
        this.is_show = false;
        this.text = "";
        if (timer_ != 0) {
          clearTimeout(timer_);
        }
      }, delay);
    }
  },
  destroyed() {
    this.$root.$off(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.show_toast);
  }
};
</script>

<style lang="scss" scoped>
.q-card-section {
  padding: 8px 8px;
}
.text-h6 {
  text-align: center;
}
.q-card {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
}
</style>

