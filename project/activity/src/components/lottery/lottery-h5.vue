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
  width: 3rem;
  height: 3rem;
  top: calc((6rem - 3rem) / 2);
  left: calc((100% - 3rem) / 2);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  .card-list {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    position: relative;
    transition: all 1s ease-out;

    &.hide {
      width: 1rem;
      height: 1rem;
      transform: rotate(-100deg);
      opacity: 0;
    }
  }
}

.card-wrap {
  width: 1.2rem;
  height: 1.2rem;
  position: absolute;
  cursor: pointer;
  // 钻石奖券
  &.diamond_card {
    left: calc(50% - 0.6rem);
    top: -0.4rem;

    .big-ring {
      background-image: linear-gradient(180deg, #336db5, #e9f0ff);

      &.active:after {
        background-image:  var(--qq--com-img-bg-161);
      }

      .small-ring:after {
        background-image: linear-gradient(180deg, #a8bad2, #bcc5fa);
      }
    }
  }
  // 黄金奖券
  &.gold_card {
    top: 60%;
    left: -0.3rem;

    img {
      animation-delay: 1s;
    }

    .big-ring {
      background-image: linear-gradient(180deg, #ef8307, #ffd6b9);

      &.active:after {
        background-image:  var(--qq--com-img-bg-162);
      }

      .small-ring:after {
        background-image: linear-gradient(180deg, #ffd7a7, #ffb762);
      }
    }
  }
  // 白银奖券
  &.silver_card {
    top: 60%;
    right: -0.3rem;

    img {
      animation-delay: 0.5s;
    }
  }

  .big-ring {
    background-image: linear-gradient(180deg, #888888, #f7f7f7);

    &.active:after {
      background-image:  var(--qq--com-img-bg-163);
    }

    .small-ring:after {
      background-image: linear-gradient(180deg, #e0e0e0, #fafafa);
    }
  }
}

img {
  width: 100%;
  position: absolute;
  top: -0.05rem;
  left: 0;
  z-index: 4;
  animation: card_move 1.5s ease-in-out infinite alternate;
}

.number {
  width: 66px;
  padding: 2px 0;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 16.5px;
  line-height: 14px;
  text-align: center;
  position: absolute;
  left: calc((1.2rem - 66px) / 2);
  top: 0.65rem;
  z-index: 3;
  font-size: 12px;
}

/* 大小圆旋转动画 */
@keyframes ring_move{
  0% {
    transform: translate(20px, 5px);
  }
}

.big-ring {
  width: 0.86rem;
  height: 0.86rem;
  position: absolute;
  top: 0.15rem;
  left: 0.1rem;
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
    background-size: 2.5rem auto;
    background-position: center center;
    transition: width 0.5s, height 0.5s;
    pointer-events: none;
    border-radius: 50%;
    background-repeat: no-repeat;
  }

  &.active {
    .small-ring {
      display: none;
    }

    &:after {
      width: 2.5rem;
      height: 2.5rem;
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
      width: 0.6rem;
      height: 0.6rem;
      position: absolute;
      border-radius: 50%;
      left: -0.17rem;
      top: -0.3rem;
      animation: xuanzhuan 3s linear infinite;
    }
  }
}
</style>
