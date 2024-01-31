<!--
 * @Author: ledron
 * @Date: 2021-01-13 11:34:53
 * @Description: 赛果详情 事件 组件
-->
<template>
  <div class="match-results-stage">
    <slot name="left">
      <div class="left" style="opacity: 0">
        <div class="substitution">
          <p></p>
        </div>
        <img src="image/bw3/svg/match-results/penalty.svg" alt="">
      </div>
    </slot>
    <slot>
      <template #middle>  <div class="middle"  >6P</div>   </template>
    
    </slot>
    <slot name="right">
      <div class="right" style="opacity: 0">
        <img src="image/bw3/svg/match-results/penalty.svg" alt="">
        <div class="substitution">
          <p></p>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "match_results_stage",
  components: {},
  data() {
    return {}
  },
};
</script>

<style lang="scss" scoped>
.match-results-stage {
  display: flex;
  align-items: center;
  justify-content: center;

  .left {
    width: 1.56rem;
    text-align: right;

    padding: 0.06rem 0.1rem 0.06rem 0;
    border-radius: 0.04rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    > .substitution {
      align-items: flex-end;
    }

    > span {

      font-size: 0.12rem;

      letter-spacing: 0;
      line-height: 0.12rem;
      margin-left: 0.1rem;
      font-weight: bold;
    }

    img {
      width: 0.14rem;
      margin-left: 0.1rem;
    }
  }

  .middle {
    width: 0.2rem;
    height: 0.2rem;

    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    font-size: 0.12rem;

    letter-spacing: 0;
    text-align: center;
    line-height: 0.12rem;
    margin: 0 0.07rem;
    position: relative;

    &:after {
      content: "";
      width: 0.01rem;
      height: 0.2rem;
      opacity: 0.4;
      position: absolute;
      top: 24px;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      color: var(--q-color-com-fs-color-24);

      border-radius: 1px;
    }
  }

  .right {
    width: 1.56rem;
    text-align: left;

    padding: 0.06rem 0 0.06rem 0.1rem;
    border-radius: 0.04rem;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    > span {

      font-size: 0.12rem;

      letter-spacing: 0;
      line-height: 0.12rem;
      margin-right: 0.1rem;
      font-weight: bold;
    }

    img {
      width: 0.14rem;
      margin-right: 0.1rem;
    }
  }
}

.substitution {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  p {

    font-size: 0.12rem;
    line-height: 0.16rem;

    letter-spacing: 0;

    span {
      display: block;
      width: 1rem;
      font-weight: 550;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  > span {
    display: block;
    width: 0.995rem;

    font-size: 0.1rem;

    letter-spacing: 0;
    line-height: 0.12rem;
    min-height: 0.11rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
