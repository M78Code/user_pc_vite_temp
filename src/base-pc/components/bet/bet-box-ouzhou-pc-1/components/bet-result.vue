
<template>
    <div class="bet-result" >
        <div class="w-100 fw-s-b">
            <div class="w-100 bet-result-info fw-b-c">
                <div class="font12 font400 bet-returm f-s-c">Total Stake</div>
                <div class="font12 font500 bet-money f-s-c">{{ (items.betMoney).toFixed(2) || '0.00' }}</div>
            </div>
            <div class="w-100 bet-result-info fw-b-c mt-8">
                <div class="font12 font400 bet-returm f-s-c">Highest Win</div>
                <div class="font12 font500 bet-money f-s-c">{{ (items.maxWinMoney).toFixed(2) || '0.00' }}</div>
            </div>
        </div>
    </div>
</template>

<script setup> 
const props = defineProps({
    items:{
        type: [Object] ,
        default : () => {}
    }
})
</script>

<style scoped lang="scss">
@import "../css/bet.scss";
</style>

<style scoped lang="scss">
    .bet-result{
        width: 99px;
        border-left: 0.5px solid #E4E4E4;
        padding-left: 16px;
        .bet-result-info{
            height: 30px;
            .bet-returm{
                height: 16px;
                margin-bottom: 4px;
                color: #8A8986;
            }
            .bet-money{
                color: #1A1A1A;
                height: 12px;
            }
        }
    }
</style>