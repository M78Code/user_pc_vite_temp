
<!--
 * @Author: Cooper
 * @Date: 2023-06-22 17:13:55
 * @Description: 球种对应的 icon
-->
<template>
  <span 
    v-if="icon_styles != -1" 
    class="q-icon icon c-icon sport-img" 
    :class="{img36: !is_esports}" 
    :style="`width:${size};height:${size};background-size:${size};background-position:0 -${icon_styles}px`"
    :data-id="sport_id"
    >
  </span>
</template>

<script setup>

  import { computed } from 'vue';

// 球种雪碧图序号
  const sport_number = {
    1:0,  //足球
    2:2,  //篮球
    3:18, //棒球
    4:16, //冰球
    5:4, //网球
    6:24, //美足
    7:10, //斯诺克
    8:8, //乒乓球
    9:14, //排球
    10:6, //羽毛球
    11:26, //手球
    12:12, //拳击
    13:30, //沙滩排球
    14:28, //橄榄球
    15:40, //曲棍球
    16:34, //水球
    17:17, //田径  ?
    18:22, //政治娱乐
    19:48, //游泳
    20:50, //体操
    21:42, //跳水
    23:52, //举重
    24:54, //射箭
    25:58, //击剑
    28:44, //高尔夫
    29:76, //自行车
    40:35, //其他  ?
    50:9, //趣味  ?
    100:100, //LOL
    101:106, //CS.GO
    102:104, //Dota2
    103:102, //王者荣耀
    30:60, //赛马
    31:62, //帆船
    32:74, //划船
    26:32, //冰壶
    27:46, //跆拳道
    33:47, //赛车  ？
    34:48, //柔道 ？
    35:49, //空手道 ？
    36:50, //摔跤 
    37:51, //板球 ?
    38:52, //飞镖 ?
    39:53, //沙球 ?
    22:55, //射击 ？
    1001:88, //VR足球
    1002:94, //VR赛狗
    1004:90, //VR篮球
    1010:96, //VR摩托车
    1011:92, //VR赛马
    1009:98, //VR泥地摩托车
    2000:72, // 电子竞技
    300:86, //VR体育
    400:68, //冠军
  } // 0 - 54个  
  // 足球 - 棒球 10   射击= 类似棒球 20  击剑 30  摔跤 40  英雄联盟上面那个 50 

  const props = defineProps({
    // 球种 ID
    sport_id: [Number, String],
      // 选中状态
    status: {
      type: [Boolean],
      default: () => true,
    },
    // 图标大小
    size: {
      type: String,
      default: () => "20px",
    },
    // 图标色调
    color: {
      type: String,
      default: () => "",
    },
    // 是否电竞
    is_esports:{
      type: Boolean,
      default: () => false,
    },
  })

  const icon_styles = computed(() => {
    //雪碧图样式 计算方式参考备注文件
    let number =  sport_number[props.sport_id]
    // 如果是未选中状态Y轴坐标下移一位
    number = props.status ? number : number + 1;
    if(!number && number !==0){
      if(props.is_esports){
        return 54
      }else{
        return 57
      }
    }
    let size = props.size.replace('px','')
    return parseInt(number * size * 100) / 100
  }) 
</script>

<style lang="scss" scoped>
.img36 {
  background-image:url('../../../assets/images/icon_sports.png');
}
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
