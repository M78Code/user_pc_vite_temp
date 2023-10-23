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
        </div>
    </div>
  </div>
</template>
<script setup></script>

<style lang="scss" scoped>
.nonebox4-content{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.nonebox4-content-left-title{
    font-size: 13px;
}
.nonebox4-content-left-content{
    height: 0.7rem;
    display: flex;
    margin-top: 0.1rem;
}
.nonebox4-content-left-content-xian{
    width: 2px;
    height: 100%;
    background: var(--q-gb-t-c-1);
    margin-right: 4px;
}
.nonebox4-content-left-content-text{
    font-size: 12px;
    color: var(--q-gb-t-c-3);
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
