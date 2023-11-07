
<template>
  <div class="wrapper">
    <div class="tabs"></div>
    <div class="result">
      <div class="left">Fulltime Result</div>
      <div class="right">
        <img src="../svg/arrow.svg">
      </div>
    </div>
    <div class="result-cont">
      <div class="item">
        <div class="left">Levance</div>
        <div class="right" :class="{
          red: false
        }">
          2.62
          <div class="svg">
<!--            <img class="top" src="../svg/arrow-top.svg">-->
            <img class="btm" src="../svg/arrow-btm.svg">
          </div>
        </div>
      </div>
    </div>
    <div class="result">
      <div class="left">Fulltime Result</div>
      <div class="right">
        <img src="../svg/arrow.svg">
      </div>
    </div>
    <div class="result-cont2">
      <div class="item item1">
        1 2.62
        <img class="svg" src="../svg/white-arrow.svg">
      </div>
      <div class="item item2">
        <span class="x">X</span>
        2.62
      </div>
      <div class="item item1 item3">
        1 2.62
        <img class="svg" src="../svg/white-arrow.svg">
      </div>
    </div>
    <div class="result">
      <div class="left">Fulltime Result</div>
      <div class="right">
        <img src="../svg/arrow.svg">
      </div>
    </div>
    <div class="result-cont3">
      <div class="top">
        <div class="item">1 -0.5</div>
        <div class="item">1 +0.5</div>
      </div>
      <div class="btm">
        <div class="item">2.62</div>
        <div class="item">2.62</div>
      </div>
    </div>
  </div>
</template>
<script setup>

</script>

<style scoped lang="scss">
.result{
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 18px;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid #f5f5f5;
  .left{
    color: #1A1A1A;
    font-size: 16px;
    font-weight: 500;
  }
}
.result-cont{
  .item{
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 8px;
    justify-content: space-between;
    height: 60px;
    border-bottom: 1px solid #f5f5f5;
    .left{
      color: #1A1A1A;
      font-size: 16px;
    }
    .right{
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      color: #17A414;
      &.red{
        color: #FF4646;
      }
      .svg{
        width: 8px;
        margin-left: 4px;
        .top{
          transform: translateY(2px);
        }
        .btm{
          transform: translateY(2px);
        }
      }
    }
  }
}
.result-cont2{
  display: flex;
  justify-content: space-between;
  .item{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33.333%;
    height: 60px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }
  .item1{
    background-color: #FF7000;
    .svg{
      margin-left: 4px;
    }
  }
  .item2{
    background-color: #fff;
    color: #FF7000;
    .x{
      margin-right: 8px;
      color: #1A1A1A;
    }
  }
  .item3{
    .svg{
      transform: rotate(180deg);
    }
  }
  border-bottom: 1px solid #FF7000;
}
.result-cont3{
  border-bottom: 1px solid #FF7000;
  .top,.btm{
    display: flex;
    align-items: center;
    text-align: center;
    .item{
      width: 50%;
    }
  }
  .top{
    height: 30px;
    background-color: #F5F5F5;
    color: #8A8986;
    font-size: 14px;
  }
  .btm{
    color: #FF7000;
    font-size: 16px;
    font-weight: 500;
    .item{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      &:not(:last-child){
        border-right: 1px solid #F5F5F5;
      }
    }
  }
}
</style>