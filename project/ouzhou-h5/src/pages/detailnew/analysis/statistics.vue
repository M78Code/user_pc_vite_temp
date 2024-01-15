<script setup name="statistics">
import {computed, reactive, inject} from "vue"

/*
* provide 和 inject
* 如果提供的数据是响应式的，那么在注入的地方对数据进行修改会触发响应式更新
* match_detail 来自 project/ouzhou-h5/src/pages/detailnew/index.vue
* */
const match_detail = inject('match_detail')

const State = reactive({
    statsList: [
        {
            value: i18n_t('ouzhou.detail.assault'),
            lValue: 20,
            rValue: 40,
            percentage: (40 / (20 + 40)) * 100,
            value_key: 'S104'
        },
        {
            value: i18n_t('match_result.dangerous_offense'),
            lValue: 30,
            rValue: 40,
            percentage: (40 / (30 + 40)) * 100,
            value_key: 'S8'
        },
        {
            value: i18n_t('ouzhou.detail.possession_ball'),
            lValue: 50,
            rValue: 40,
            percentage: (40 / (40 + 40)) * 100,
            value_key: 'S105'
        },
    ],
    sliderList: [
        {
            title: i18n_t('ouzhou.detail.shots_on_goal'),
            lValue: 20,
            rValue: 40,
            value:15,
            value_key:'S18'
        },
        {
            title: i18n_t('ouzhou.detail.shot_wide_goal'),
            lValue: 11,
            rValue: 25,
            value:26,
            value_key:'S17'
        },
    ]
})

/*const detail_info = computed(() => {
    const obj = match_detail.value;
    let result = {};

    if (obj.msc && obj.msc.length > 0) {
        for (const item of obj.msc) {
            const [key, scores] = item?.split('|') || [];
            if (key && scores) {
                const [home, away] = scores.split(':');
                setResult(key, home, away);
            }
        }
    } else if (obj.msc) {
        for (const key in obj.msc) {
            const {home, away} = obj.msc[key];
            setResult(key, home, away);
        }
    }
    return result

    function setResult(key, home, away) {
        const total = Number(home) + Number(away);
        result[key] = {
            home,
            away,
            percentage: (Number(home) / total || 0).toFixed(2) * 100,
            away_percentage: (Number(away) / total || 0).toFixed(2) * 100,
        };
    }
})*/


const detail_info = computed(() => {
    const {msc_obj} = match_detail.value;
    let result = {}
    if (lodash.isEmpty(msc_obj)) return result

    Object.keys(msc_obj).map(key => {
        const {home, away} = msc_obj[key];
        setResult(key, home, away);
    })

    return result

    function setResult(key, home, away) {
        const total = Number(home) + Number(away);
        result[key] = {
            home,
            away,
            percentage: (Number(home) / total || 0).toFixed(2) * 100,
            away_percentage: (Number(away) / total || 0).toFixed(2) * 100,
        };
    }
})
</script>

<template>
<!--    <div class="statistics" v-if="match_detail?.msc?.length">-->
    <div class="statistics" v-if="match_detail?.msc?.length">
        <ul class="statistics-header">
            <li class="statistics-header--item ellipsis">{{ match_detail.mhn }}</li>
            <li class="statistics-header--item ellipsis">{{ match_detail.man }}</li>
        </ul>
        <!--环形统计-->
        <div class="statistics-circle">
            <div class="statistics-col" v-for="item in State.statsList" :key="item">
                <div class="circle-part" v-if="detail_info[item.value_key]">
                    <div class="circle-title">{{ item.value }}</div>
                    <div class="circle-body">
                        <span class="number">{{ detail_info[item.value_key]['home'] }} </span>
                        <q-knob
                            readonly
                            v-model="detail_info[item.value_key].percentage"
                            size="50px"
                            :thickness="0.4"
                            color="amber-7"
                            :track-color="detail_info[item.value_key].percentage == 0 ? 'grey-5' : 'indigo-12'"
                            class="q-ma-md"
                        />
                        <span class="number">{{ detail_info[item.value_key]['away'] }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--线形统计-->
        <template v-for="item in State.sliderList" :key="item">
            <div class="statistics-progress" v-if="detail_info[item.value_key]">
                <div class="progress-title">
                    <span>{{ detail_info[item.value_key]['home'] }}</span>
                    <span>{{ item.title }}</span>
                    <span>{{ detail_info[item.value_key]['away'] }}</span>
                </div>
                <div class="progress-content">
                    <div class="progress">
                        <div class="progressbar">
                            <q-slider readonly reverse v-model="detail_info[item.value_key]['percentage']" :min="0" :max="50" track-size="5px" color="amber-7" thumb-size="'0'" style="margin-right:6px"/>
                            <q-slider readonly   v-model="detail_info[item.value_key]['away_percentage']" :min="0" :max="50" track-size="5px" color="indigo-12" :thumb-size="'0'" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
<!--    <div class="nodata"></div>-->
</template>

<style scoped lang="scss">
.statistics {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;

    .statistics-header{
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #1A1A1A;
        font-size: 12px;
        &--item{
            //flex: 1;
            position: relative;
            padding: 0 16px;

            &:nth-child(1):before{
                content: "";
                width: 6px;
                height: 6px;
                border-radius: 50%;
                position: absolute;
                background: #ffb001;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }

            &:nth-last-child(1):after{
                content: "";
                width: 6px;
                height: 6px;
                border-radius: 50%;
                position: absolute;
                background: #006eff;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .statistics-circle{
        width: 100%;
        display: flex;
        padding: 8px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #E2E2E2;
        .statistics-col{
            flex: 1;
            display: flex;
            align-items: center;
            flex-direction: column;
        }
    }

    .statistics-progress{
        width: 100%;
        height: 48px;
        padding: 8px;
        box-sizing: border-box;
        margin: 16px 0;
        .progress-title{
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        .progress-content {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .progress {
                width: 100%;
                display: flex;
                justify-content: space-between;
                .progressbar {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }
            }
        }
    }
}

.circle-part{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .circle-title{
        color: #8A8986;
    }
    .circle-body{
        .number{
            color: #1A1A1A;
            font-size: 14px;
            font-weight: 500;
        }
    }
}

</style>