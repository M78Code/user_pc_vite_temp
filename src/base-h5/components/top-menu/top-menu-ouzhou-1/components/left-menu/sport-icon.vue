<!--
 * @Author: rise
 * @Date: 2023-11-02 16:27:18
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 16:43:49
 * @Description:  
-->
<template>
  <span
    v-if="icon_styles != -1"
    class="q-icon icon c-icon sport-img img36"
    :style="[`width:${size}px;height:${size}px;background-size:${size}px;`,compute_css_obj({key:status? 'eu-menu-sport-active-image' : 'eu-menu-sport-icon-image', position:icon_styles})]"
    :data-id="sport_id"
    >
  </span>
</template>

<script setup>
  import { computed } from 'vue';
  import { MenuData,compute_css_obj } from "src/output/index.js";

// 球种雪碧图序号
  const sport_number = {
    101:0,  //足球
    102:1,  //篮球
    103:9, //棒球
    104:8, //冰球
    105:2, //网球
    106:12, //美足
    107:5, //斯诺克
    108:4, //乒乓球
    109:7, //排球
    110:3, //羽毛球
    111:13, //手球
    112:6, //拳击
    113:15, //沙滩排球
    114:14, //橄榄球
    115:20, //曲棍球
    116:17, //水球
    117:23, //田径  ?
    118:11, //娱乐
    119:24, //游泳
    120:25, //体操
    121:21, //跳水
    122:10, //射击
    123:26, //举重
    124:27, //射箭
    125:29, //击剑
    126:16,//冰壶
    127:40,//跆拳道
    128:22, //高尔夫
    129:38, //自行车
    130:30,//赛马
    131:31,//帆船
    132:37,//划船
    133:33,//赛车运动
    134:41,//柔道
    135:42,//空手道
    136:39,//摔跤
    137:19,//板球
    138:28,//飞镖
    139:18,//沙滩足球
    140:57, //其他 
    150:35, //趣味  ?
    //--------------------新增-------------------//
    190:55, //电子足球
    191:56, //电子篮球
    //---------------------------------------//
    2100:50, //LOL
    2102:53, //CS.GO
    2101:52, //Dota2
    2103:51, //王者荣耀
    30:30, //赛马
    31:31, //帆船
    32:37, //划船
    26:16, //冰壶
    27:40, //跆拳道
    33:33, //赛车  ？
    34:42, //柔道 ？
    35:41, //空手道 ？
    36:39, //摔跤
    37:19, //板球 ?
    38:28, //飞镖 ?
    39:18, //沙球 ?
    1001:44, //VR足球
    1002:47, //VR赛狗
    1004:45, //VR篮球
    1010:48, //VR摩托车
    1011:46, //VR赛马
    1009:49, //VR泥地摩托车
    2000:36, // 电子竞技
    300:43, //VR体育
    400:34, //冠军
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
    // console.log(props.sport_id)
    //雪碧图样式 计算方式参考备注文件
    let number =  sport_number[props.sport_id];
    // 如果是未选中状态Y轴坐标下移一位
    // number = props.status ? number : number + 1;
    // if(!number && number !==0){
    //   if(props.is_esports){
    //     return 54
    //   }else{
    //     return 57
    //   }
    // }
    let size = props.size.replace('px','')
    return parseInt(number * size * 100) / 100
  })

</script>

<style lang="scss" scoped>
.img36 {
  --per:-1px;
  // background-image:url('../../img/icon_sports.png');
  // background-image:url(compute_img_url('eu-menu-sport-active-image'));
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
