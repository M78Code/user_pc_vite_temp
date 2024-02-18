import { ref } from 'vue'

// 定时器
const timer_status = ref("");
// 页面显示字符串
const time_str = ref("");
// 增量临时值
const timer_tmp = ref("");
// 应该是用来判断是否启动定时器的
const replay = ref(null);

let timer = null;
//销毁计时器
const clear = () => {
  timer = false;
};

//开始计时
const start = () => {
  if (props.tconfig.step) {
    if (!timer ) {
      // clearInterval(timer);
      // 设置格式化时间
      if (props.tconfig.time_format) {
        time_str.value = props.tconfig.time_format(
          props.tconfig.time + timer_tmp.value
        );
      } else {
        time_str.value = props.tconfig.time + timer_tmp.value;
      }
      if (props.tconfig.on_time_change) {
        props.tconfig.on_time_change();
      }
      timer_status.value = true;
    }
  } else {
    time_str.value = props.tconfig.time_format(
      props.tconfig.time + timer_tmp.value
    );
  }
};

const use_timer_fn = () => {
  return {
    clear,
    start,
    replay,
    time_str,
    // tconfig,
    timer_tmp
  }
}

export default use_timer_fn;