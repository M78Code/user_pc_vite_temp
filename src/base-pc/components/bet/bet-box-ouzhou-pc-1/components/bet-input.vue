

<template>
    <div @click="set_bet_click(false)" >
        <!-- <q-input class="bet-input" v-model="item.betAmount" :placeholder="`Limits ${item.min}~${item.max}`"/> -->
        <input class="bet-input" @focus="set_bet_focus(true)" @input="set_bet_amount" v-model="bet_amount" :placeholder="`Limits ${items.minBet}~${items.orderMaxPay}`"/>
    </div>
</template>

<script setup> 

</script>

<style scoped lang="scss">
.bet-input-focus{
    position: relative;
    background: #FFF6F0;
    transition: .3s;
    &:after{
         //width: 1px;
         //height: 14px;
        // transition: .3s;
        // content: '';
        // position: absolute;
        //left: 8px;
        // top: 50%;
       //  margin-top: -7px;
      //  background: #FF7000;
        // z-index: 9;
    }
     .bet-input{
        // padding-left: 14px;
     }
}
.bet-input{
    width: 130px;
    height: 34px;
    background: none;
    border: 0.5px solid #A4A4A4;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    transition: .3s;
    caret-color:#FF7000;
     
    &:focus,&:focus-visible{
        transition: .02s;
        outline: none;   
       // padding-left: 14px;
        border: 0.5px solid #FF7000;
        box-shadow: 0px 1px 4px rgba(255, 112, 0, 0.1)
    }
    &::-webkit-input-placeholder {/*Chrome/Safari*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: #8A8986;
    }
    &::-moz-placeholder {/*Firefox*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: #8A8986;
    }
    &::-ms-input-placeholder {/*IE*/
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: #8A8986;
    }
}
</style>