<template>
  <span
    v-if="icon_styles != -1"
    class="q-icon icon c-icon sport-img img36"
    :style="`width:${size}px;height:${size}px; background-size:${size}px; background-position:0 -${icon_styles}px`"
    :data-id="sport_id"
    >
  </span>
</template>

<script setup>

  import { computed } from 'vue';

// 球种雪碧图序号
  const sport_number = {
    101:0,  //足球
    102:2,  //篮球
    103:18, //棒球
    104:16, //冰球
    105:4, //网球
    106:24, //美足
    107:10, //斯诺克
    108:8, //乒乓球
    109:14, //排球
    110:6, //羽毛球
    111:26, //手球
    112:12, //拳击
    113:30, //沙滩排球
    114:28, //橄榄球
    115:40, //曲棍球
    116:34, //水球
    117:17, //田径  ?
    118:22, //政治娱乐
    119:48, //游泳
    120:50, //体操
    121:42, //跳水
    123:52, //举重
    124:54, //射箭
    125:58, //击剑
    128:44, //高尔夫
    129:76, //自行车
    140:35, //其他  ?
    150:9, //趣味  ?
    2100:100, //LOL
    2102:106, //CS.GO
    2101:104, //Dota2
    2103:102, //王者荣耀
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
  // background-image:url('../../assets/common/icon_sports.png');
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
