<script setup name="RecordMenu">
import {onBeforeMount, reactive} from "vue";

const menuArr1 = [
    {id: 1, label: i18n_t('analysis_football_matches.same_game')},
    {id: 2, label: i18n_t('analysis_football_matches.same_host_guest')}
]
const menuArr2 = [
    {name: `${i18n_t('analysis_football_matches.near')}`, value: 5},
    {name: `${i18n_t('analysis_football_matches.near')}`, value: 10},
    {name: `${i18n_t('analysis_football_matches.near')}`, value: 15},
]
const State = reactive({
    CheckedMenuArr1: [],
    flag: 0,
    cps: 5
})

const emit = defineEmits();
const CheckMenu = function (id) {
    /*
    * 实现多选 取消选中 反选功能
    * */
    const isHave = State.CheckedMenuArr1.includes(id)
    if (isHave) {
        State.CheckedMenuArr1 = State.CheckedMenuArr1.filter(item => item != id)
    } else {
        State.CheckedMenuArr1.push(id)
    }

    if (State.CheckedMenuArr1.length === 2) {
        State.flag = 3
    } else if (State.CheckedMenuArr1.length === 1) {
        State.flag = State.CheckedMenuArr1[0]
    } else {
        State.flag = 0
    }
    emit('ChangeCheckbox', State.flag)
}

const RadioMenu = function (cps){
    State.cps = cps
    emit('ChangeRadio',State.cps)
}
</script>

<template>
    <div class="menu-box">
        <ul class="menu-checkbox">
            <li
                :key="menu.id"
                v-for="menu of menuArr1"
                class="menu-checkbox--item"
                :class="{'active': State.CheckedMenuArr1.includes(menu.id)}"
                @click="CheckMenu(menu.id)"
            >
                {{ menu.label }}
            </li>
        </ul>
        <ul class="menu-radio">
            <li
                class="menu-radio--item"
                :class="{'active': State.cps === menu.value}"
                v-for="menu of menuArr2" :key="menu.value"
                @click="RadioMenu(menu.value)"
            >
                {{ menu.name }}{{ menu.value }}
            </li>
        </ul>
    </div>

</template>

<style scoped lang="scss">
.menu-box {
    display: flex;
    align-items: center;

    .menu-checkbox {
        display: flex;
        align-items: center;

        &--item {
            //width: .6rem;
            padding: .02rem .08rem;
            border: .01rem solid #E2E2E2;
            text-align: center;
            color: #8A8986;
            list-style: none;
            border-radius: .04rem;

            &:nth-last-child(1) {
                margin-left: .16rem;
            }

            font: {
                size: .12rem;
                weight: 400;
            };
        }

        .active {
            background: #FF7000;
            color: #ffffff;
            border-color: #FF7000;
        }
    }

    .menu-radio {
        margin-left: .16rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: .01rem solid #E2E2E2;
        border-radius: .04rem;
        overflow: hidden;

        &--item {
            width: .48rem;
            height: .24rem;
            line-height: .24rem;
            text-align: center;
            color: #8A8986;
            font: {
                size: .12rem;
                weight: 400;
            };
        }
        .active {
            background: #FF7000;
            color: #ffffff;
            border-color: #FF7000;
        }
    }
}
</style>