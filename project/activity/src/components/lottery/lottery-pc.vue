<!--
 * 奖券
 * @Author: Cable
 * @Date: 2022-03-03 11:57:09
-->
<template>
  <div class="lottery-wrap">
    <div class="card-list" :class="{hide:!is_show_card}">
      <!-- 奖券 -->
      <div class="card-wrap" :class="item.key+'_card'" @click="$emit('select_card',item.type)" v-for="item in lottery_obj" :key="item.type">
        <img class="" :src="item.img" >
        <div class="card-bg"></div>
        <div class="number">
          {{item.name}}<br />{{lotteryNum[item.key]}}
        </div>
        <div class="big-ring" :class="{active: cur_select_card == item.type}"><div class="small-ring"></div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cur_select_card:  '',
    is_show_card: Boolean,
    lotteryNum: {
      type: Object,
      default: ()=>{}
    },
    lottery_obj: Object
  }
};
</script>
<style lang="scss" scoped>
.lottery-wrap {
  width: 900px;
  height: 900px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 150px;
  .card-list {
    width: 600px;
    height: 600px;
    border-radius: 50%;
    position: relative;
    transition: all 1s ease-out;
    &.hide {
      width: 200px;
      height: 200px;
      transform: rotate(-100deg);
      opacity: 0;
    }
  }
}
.card-wrap {
  width: 200px;
  height: 200px;
  position: absolute;
  cursor: pointer;
  /*  钻石奖券 */
  &.diamond_card {
    left: 45%;
    top: -40px;
    .number {
      background-color: rgba(0, 0, 0, 0.7);
    }
    .big-ring {
      background-image: linear-gradient(180deg, #336db5, #e9f0ff);
      &.active:after {
        background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/diamond_active.png");
      }
      .small-ring:after {
        background-image: linear-gradient(180deg, #a8bad2, #bcc5fa);
      }
    }
  }
  /*  黄金奖券 */
  &.gold_card {
    top: 60%;
    left: -50px;

    img {
      animation-delay: 1s;
    }
    .number {
      background-color: rgba(0, 0, 0, 0.7);
    }
    .big-ring {
      background-image: linear-gradient(180deg, #ef8307, #ffd6b9);
      &.active:after {
        background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/gold_active.png");
      }
      .small-ring:after {
        background-image: linear-gradient(180deg, #ffd7a7, #ffb762);
      }
    }
  }
  /*  白银奖券 */
  &.silver_card {
    top: 60%;
    right: -40px;

    img {
      animation-delay: 0.5s;
    }
    .number {
      background-color: rgba(0, 0, 0, 0.7);
    }
    .big-ring {
      background-image: linear-gradient(180deg, #888888, #f7f7f7);
      &.active:after {
        background-image: url($SCSSPROJECTPATH+"/yazhou-pc/activity_imgs/imgs/slot_machine/silver_active.png");
      }
      .small-ring:after {
        background-image: linear-gradient(180deg, #e0e0e0, #fafafa);
      }
    }
  }

  img {
    width: 100%;
    position: absolute;
    top: -10px;
    left: 0;
    z-index: 4;
    animation: card_move 1.5s ease-in-out infinite alternate;
  }
  .number {
    width: 86px;
    padding-top: 3px;
    color: #fff;
    border-radius: 18px;
    line-height: 18px;
    text-align: center;
    position: absolute;
    left: 57px;
    top: 106px;
    z-index: 3;
  }

	/*  大小圆旋转动画 */
  @keyframes ring_move {
    0% {
      transform: translate(20px, 5px);
    }
  }
  .big-ring {
    width: 134px;
    height: 134px;
    position: absolute;
    top: 20px;
    left: 33px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: ring_move 1.5s ease-in-out infinite alternate;
    &:after {
      content: "";
      width: 0px;
      height: 0px;
      position: absolute;
      background-size: 460px auto;
      background-position: center center;
      transition: width 0.5s, height 0.5s;
      pointer-events: none;
      border-radius: 50%;
    }
    &.active {
      .small-ring {
        display: none;
      }
      &:after {
        width: 460px;
        height: 460px;
        animation: xuanzhuan 6s linear infinite;
      }
    }
    .small-ring {
      width: 0px;
      height: 0px;
      position: relative;
      animation: xuanzhuan 3s linear infinite;
      &:after {
        content: "";
        width: 95px;
        height: 95px;
        position: absolute;
        background-color: #555;
        border-radius: 50%;
        left: -28px;
        top: -47.5px;
        animation: xuanzhuan 3s linear infinite;
      }
    }
  }
}
</style>
