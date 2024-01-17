<script setup name="player-distribution">
const props = defineProps(['up_data','lastNumber','football_filtered_data','number_columns'])

const shouldShowItem = function (position){
    const lastNumber = props?.lastNumber
    const isNumber3 = lastNumber === 3;
    const isNumber2 = lastNumber === 2;
    const isNumber1 = lastNumber === 1;

    return (
        (isNumber3 && position > 8) || position === 1 ||
        (isNumber2 && position > 9) || (isNumber1 && position > 10)
    ) && position <= 11;
}

const calculationRadian = function (index) {
    return `five_columns${index + 1 }`
}
const calculationLast = function (item) {

    const numberMapping = {
        1: 'how_many_bits1',
        2: 'how_many_bits2',
        3: 'how_many_bits3'
    };

    return numberMapping[State.number] || ''; // 如果 State.number 不在映射中，返回空字符串或其他默认值
}
</script>

<template>
    <div class="football_field">
        <!-- 加载第一项 和 最后一项-->
        <div class="first_and_last"
             v-for="(item, index) of up_data"
             :key="index + 'f_l'"
             :class="[
                     `location${item.position}`,
                     (lastNumber == 3 && item.position > 8) ? calculationLast(item) : '',
                     (lastNumber == 2 && item.position > 9) ? calculationLast(item) : '',
                     (lastNumber == 1 && item.position > 10 && item.position <=11) ? calculationLast(item) : '',
                 ]"
        >
            <template v-if="shouldShowItem(item.position)">
                <div>
                    <span>{{ item.shirtNumber || 0 }}</span>
                </div>
                <span class="ellipsis">{{ item.thirdPlayerName }}</span>
            </template>

        </div>
        <!--  加载中间的内容  -->
        <!--  如果首发阵容是两列，前面有两列 比如 4-2-4 -->
        <template v-if="number_columns.length == 2">
            <div class="two_columns "
                 v-for="(list, index) in football_filtered_data" :key="index+'middle'"
                 :class="[list.data.length == 5 && calculationRadian(index) && 'five_columns']"
            >
                <div class="first_and_last"
                     v-for="(item, index) in list.data" :key="index+'l_f'"
                     :class="[(index == 0 || index ==4) && list.data.length == 5 ? calculationRadian(index): '']"
                >
                    <div>
                        <span>{{ item.shirtNumber || 0 }}</span>
                    </div>
                    <span class="ellipsis">{{ item.thirdPlayerName }}</span>
                </div>
            </div>
        </template>
        <!--  如果首发阵容是三列，前面有两列  4-2-3-1 -->
        <template v-if="number_columns.length == 3">
            <div class="two_columns "
                 v-for="(list, index) in football_filtered_data" :key="index"
            >
                <div class="first_and_last" v-for="(item, index) in list.data" :key="index+'s'">
                    <div>
                        <span>{{ item.shirtNumber || 0 }}</span>
                    </div>
                    <span class="ellipsis">{{ item.thirdPlayerName }}</span>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.football_field {
    width: 100%;
    height: 3.45rem;
    background-image: url("./football_squad_background.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 0.15rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    padding-top: 0.77rem;
    padding-bottom: 0.63rem;
    overflow: hidden;

    .ellipsis {
        max-width: 0.84rem;
    }

    .first_and_last {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 0.6rem;
        margin: 0 0.17rem;

        &.location1 {
            position: absolute;
            top: 0.19rem;
            left: 32%;
            width: 1rem;
            max-width: unset;
        }

        &.how_many_bits1 {
            position: absolute;
            bottom: 0.01rem;
            left: 31.7%;
            width: 1rem;
            max-width: unset;
        }

        &.how_many_bits2 {
            &.location10 {
                position: absolute;
                bottom: 0.07rem;
                width: 1rem;
                left: 14%;
            }

            &.location11 {
                position: absolute;
                bottom: 0.07rem;
                width: 1rem;
                left: 62%;
            }
        }

        &.how_many_bits3 {
            &.location9 {
                position: absolute;
                bottom: 0.01rem;
                left: 14%;
                width: 1rem;
            }

            &.location10 {
                position: absolute;
                bottom: 0.3rem;
                left: 38%;
                width: 1rem;
            }

            &.location11 {
                position: absolute;
                bottom: 0.01rem;
                left: 62%;
                width: 1rem;
            }
        }

        > div {
            width: 0.36rem;
            height: 0.36rem;


            display: flex;
            align-items: center;
            justify-content: center;

            > span {

                font-size: 0.2rem;
                color: var(--q-color-com-fs-color-8);
                text-align: center;
            }
        }

        > span {

            font-size: 0.12rem;
            color: var(--q-color-com-fs-color-8);
            margin-top: 0.02rem;
        }
    }
}
</style>