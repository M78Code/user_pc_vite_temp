<!--
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 球种对应的 icon
-->
<template>
  <span v-if="icon_styles != -1" class="q-icon icon c-icon sport-img"
  :style="[compute_css({key:'pc-left-menu-bg-image', position: `item_${icon_styles}`}),`width:${size};height:${size}`]"
  :class="{img36:size == '18px' && !is_esports,'sport-img-new': isVideoIcon}" >
  </span>
</template>

<script>
import {compute_css} from "src/core/"
// 球种雪碧图序号
const sport_number = {
  0:0,
  1:1,
  2:3,
  3:28,
  4:2,
  5:19,
  6:4,
  7:15,
  8:7,
  9:6,
  10:22,
  11:13,
  12:10,
  13:12,
  14:20,
  15:8,
  16:14,
  17:17,
  18:26,
  19:21,
  20:16,
  21:18,
  23:29,
  24:30,
  25:31,
  28:33,
  29:32,
  40:35,
  50:9,
  100:41,
  101:38,
  102:40,
  103:39,
  10001:36,
  10002:37,
  10003:38,
  30:42,
  31:43,
  32:44,
  26:45,
  27:46,
  33:47,
  34:48,
  35:49,
  36:50,
  37:51,
  38:52,
  39:53,
  22:55,
  1010:56,
  1002:11,
  1001:36,
  1004:37,
  1011:23,
  1009:24,
}




// 热门联赛雪碧图序号
const union_match_number = {
39:0,
79:1,
90:2,
95:3,
103:4,
130:5,
132:6,
137:7,
146:8,
150:9,
160:10,
180:11,
185:12,
208:13,
224:14,
239:15,
244:16,
262:17,
265:18,
276:19,
295:20,
320:21,
333:22,
340:23,
359:24,
427:25,
563:26,
1524:27,
1555:28,
1582:29,
1607:30,
2066:31,
2177:32,
2332:33,
3123:34,
3230:35,
6343:36,
6344:37,
6371:38,
6408:39,
8120:40,
17706:41,
20746:42,
21202:43,
24313:44,
24613:45,
26992:46,
28009:47,
28190:48,
28273:49,
28592:50
}

export default {
  name: "SportIcon",
  data() {
    return {
      compute_css 
    };
  },
  props: {
    // 球种 ID
    sport_id: [Number, String],
    // 选中状态
    status: {
      type: String,
      default: "",
    },
    // 图标大小
    size: {
      type: String,
      default: "20px",
    },
    // 图标色调
    color: {
      type: String,
      default: "",
    },
    // 是否电竞
    is_esports:{
      type: Boolean,
      default: false,
    },

    is_union_match:{
      type: Boolean,
      default: false,
    },

    isVideoIcon:{
      type: Boolean,
      default: false,
    }
  },

  computed: {
    //雪碧图样式 计算方式参考备注文件
    icon_styles(){
      let number =  this.is_union_match?union_match_number[this.sport_id]:sport_number[this.sport_id]
      if(!number && number !==0){
        if(this.is_esports){
          return 54
        }else{
          return 57
        }
      }
      return number
    }
  },
};
</script>

<style lang="scss" scoped>
.c-icon {
  &:before {
    font-size: inherit;
  }
  &.set-color {
    &:before {
      color: inherit;
    }
  }
}
.sport-img {
  background-size: 100% auto;
}
</style>
