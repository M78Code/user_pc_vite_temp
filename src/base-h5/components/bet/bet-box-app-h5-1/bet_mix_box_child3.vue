<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show">
    <div class="nonebox4-content">
        <div class="nonebox4-content-left">
            <div class="nonebox4-content-left-title">阿根廷 +0/0.5</div>
            <div class="nonebox4-content-left-content">
                <div class="nonebox4-content-left-content-xian"></div>
                <div class="nonebox4-content-left-content-text">
                    <div>上半场大小-附加盘（3-0）</div>
                    <div>阿根廷 VS 克罗地亚</div>
                    <div>2022 PESI欧洲超级联赛</div>
                </div>
            </div>
        </div>
        <div class="nonebox4-content-right">
            <div class="nonebox4-content-right-profit"><span class="nonebox4-content-right-profit-type">@</span>6.65</div>
            <div class="nonebox4-content-right-num">
                <div>6</div>
            </div>
        </div>
    </div>
  </div>
</template>
<script setup></script>

<style lang="scss" scoped>
.nonebox4-content{
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
}
.nonebox4-content-left-title{
    font-size: 13px;
    color: #000;
}
.nonebox4-content-left-content{
    height: 70px;
    display: flex;
    margin-top: 5px;
}
.nonebox4-content-left-content-xian{
    width: 2px;
    height: 100%;
    background: #2394fc;
    margin-right: 4px;
}
.nonebox4-content-left-content-text{
    font-size: 12px;
    color: #999;
    line-height: 23px;
}
.nonebox4-content-right-profit{
    font-size: 18px;
    font-weight: bold;
}
.nonebox4-content-right-profit-type{
    font-size: 16px;
}
.nonebox4-content-right-num{
    width: 20px;
    height: 20px;
    background: #2394fc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    border-radius: 50%;
    font-size: 16px;
    margin-top: 44px;
    float: right;
}

</style>
