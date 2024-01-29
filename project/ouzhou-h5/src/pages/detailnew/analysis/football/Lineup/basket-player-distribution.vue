<script setup name="basket-player-distribution">
import {inject} from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

const props = defineProps(['basketball_data'])
const match_detail = inject('match_detail')
</script>

<template>
    <div class="basket-ball-field" :style="'background-image: url(' + `${LOCAL_PROJECT_FILE_PREFIX}/image/detail/basketball_squad_background.png` + ');'">
        <div
            v-for="(item, index) in basketball_data" :key="index + 's'"
            :class="[`location${index+1}`,'basket-ball-item']"
        >
            <div>
                <span>{{ item?.shirtNumber ?? 0 }}</span>
            </div>
            <span class="ellipsis">{{ item?.thirdPlayerName }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.basket-ball-field {
    width: 100%;
    height: 3.75rem;
    // background-image: url("./basketball_squad_background.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    margin-bottom: 0.15rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    padding-top: 0.77rem;
    overflow: hidden;

    .basket-ball-item {
        display: flex;
        width: 1rem;
        flex-direction: column;
        align-items: center;
        max-width: 0.6rem;
        margin: 0 0.17rem;

        &.location1 {
            position: absolute;
            top: 0.38rem;
            left: 32%;
            max-width: unset;
        }

        &.location2 {
            position: absolute;
            top: 1.52rem;
            left: 2%;
            max-width: unset;
        }

        &.location3 {
            position: absolute;
            top: 1.52rem;
            left: 63%;
            max-width: unset;
        }

        &.location4 {
            position: absolute;
            bottom: 0.61rem;
            left: 17%;
            max-width: unset;
        }

        &.location5 {
            position: absolute;
            bottom: 0.61rem;
            left: 47%;
            max-width: unset;
        }

        > div {
            width: 0.36rem;
            height: 0.36rem;
            background: var(--q-color-com-img-bg-89) no-repeat center;
            background-size: 100% 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            > span {

                font-size: 0.2rem;
                color: var(--q-color-com-bg-color-12);
                text-align: center;
            }
        }

        > .ellipsis {
            color: var(--q-color-com-bg-color-12);
            font-weight: bold;
        }
    }
}
</style>