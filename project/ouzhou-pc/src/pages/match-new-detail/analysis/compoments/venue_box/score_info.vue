<!--
 * @Author: cooper
 * @Date: 2023-07-07 17:13:55
 * @Description: 赛事分析页赛事比分
-->
<template>
    <div class="box-bc">
        <q-table :rows="data" separator="none" :columns="columns" row-key="name" hide-pagination :table-header-style="{
            backgroundColor: '#F1F1F1',
            height: '28px',
            color: '#8A8986',
            fontSize: '13px',
            fontWeight: 500,

        }">
            <!-- 头部插槽 足球用 -->
            <template v-slot:header="props">
                <q-tr :props="props" style="background-color: #F5F5F5;">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props">
                        <div>
                            <div v-if="!col.icon">
                                <span :style="{'line-height': '30px',color:['p','t'].includes(col.field)?'#ff7000': '#8A8986'}" v-if="col.field !== 'name'">{{ col.label }}</span>
                                <div v-else style="color:#8A8986">
                                    <span style="margin-right: 6px;">{{ detail_info.course }}</span>
                                    <span> {{ detail_info.mst<=0?'00:00':detail_info.mstValue }}</span>
                                </div>

                            </div>

                            <div v-else >
                                <img :src="get_icon(col.icon)" alt="" class="top-icon">
                            </div>
                        </div>

                    </q-th>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="name" :props="props">
                        <span class="table-name">{{ props.row.name }}</span>
                    </q-td>
                    <q-td key="q1" :props="props">
                        <span>{{ props.row.q1 }}</span>
                    </q-td>
                    <q-td key="q2" :props="props">
                        <span>{{ props.row.q2 }}</span>
                    </q-td>
                    <q-td key="ht" :props="props">
                        <span>{{ props.row.ht }}</span>
                    </q-td>
                    <q-td key="q3" :props="props">
                        <span>{{ props.row.q3 }}</span>
                    </q-td>
                    <q-td key="q4" :props="props">
                        <span>{{ props.row.q4 }}</span>
                    </q-td>
                    <q-td key="q5" :props="props">
                        <span>{{ props.row.q5 }}</span>
                    </q-td>
                    <q-td key="set" :props="props">
                        <span>{{ props.row.set }}</span>
                    </q-td>
                    <q-td key="t" :props="props">
                        <span style="font-weight: 500;color:#ff7000;">{{ props.row.t }}</span>
                    </q-td>
                    <q-td key="p" :props="props">
                        <span style="font-weight: 500;color:#ff7000;">{{ props.row.p }}</span>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </div>
</template>
  
<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { sport_columns, socre_dict } from './score_config'
import _ from "lodash"

const props = defineProps({
    detail_info: {  // 赛事详情
        type: Object,
        default: () => { }
    },
    score_list: {  // 赛事详情
        type: Object,
        default: () => { }
    },
})

const data = ref([])

const padding_value = ref('1px 0px 1px 6px')

const columns = ref([
])

watch(() => props.detail_info, res => {
    if (res.csid==1) {
        padding_value.value = '1px 0px 1px 6px'
    }else{
        padding_value.value = '1px 0px 1px 0px'
    }
    const msc_data = [];
    // let active_index = "";
    let current_data = {
        home: 0,
        away: 0,
    };
    if (res.ms != 0 && res.mmp == "0") {
        Object.assign(res, {
            mmp: "8",
            mct: 1,
        });
    }
    if (res.csid == "5") {//网球
        let dict = socre_dict(5);
        let msc = props.score_list
        for (var k in dict) {
            if (msc[dict[k]]) {
                msc_data.push(msc[dict[k]]);
            } else if (k == parseInt(res.mmp) && !msc[dict[k]]) {
                msc_data.push({
                    home: 0,
                    away: 0,
                });
            } else if (
                ["8", "9", "10", "11", "12"].includes(res.mmp) &&
                k < parseInt(res.mmp) &&
                !msc[dict[k]]
            ) {
                msc_data.push({
                    home: "",
                    away: "",
                });
            }
        }

        if (msc_data.length > res.mft) {
            msc_data.splice(res.mft, msc_data.length);
        }

        let num_title = [];
        for (let i = 0; i < res.mft; i++) {
            num_title.push(i + 1);
        }
        //   this.num_title = num_title;

        // 补全比分和总盘数|总局数的列数
        for (var i = 0; i < res.mft; i++) {
            if (msc_data.length - 1 < i) {
                msc_data.push({
                    home: "",
                    away: "",
                });
            }
        }

        //   active_index = this.stage_dict(res.csid, res.mmp, res.mct) - 1
        if (res.msc.S103) {
            current_data = res.msc.S103;
        }
        get_msc_data(msc_data, current_data)
    } else {
       if (!['1','2','3'].includes(res.csid)) {
        format_msc(res)
       }
      
        //   computed_score(res)// 计算总分
    }
})





watch(() => props.score_list, val => {
    const detail_info = props.detail_info
    columns.value = sport_columns[detail_info.csid]
    get_base_data(val)
})
//   足球篮球
const get_base_data = (val) => {
    const detail_info = props.detail_info
    const list = [
        {
            name: detail_info['mhn'],
            key: 'home'
        },
        {
            name: detail_info['man'],
            key: 'away',
        },
    ]
    let res = ''
    if (!_.isEmpty(val) && ['1', '2','3'].includes(detail_info.csid)) {
        console.log(111111111111111111)
        res = get_score_result(list, val)
    } else {
        //   篮球 赛前无数据
        if (detail_info.csid == 2) {
            res = list.map(item => {
                return {
                    name: item.name,
                    q1: '',  // 
                    q2: '', // 
                    ht: '', // 
                    q3: '',  // 
                    q4: '',   // 
                    t: ''  // 
                }
            })
        }
    }

    data.value = res || []

}

const get_score_result = (list, val) => {
    let result = []
    const detail_info = props.detail_info
    result = list.map(item => {
        if (detail_info.csid == 1 ||detail_info.csid == 3) {
            return {
                name: item.name,
                q1: val.S5 ? val.S5[item.key] : 0,  // 角球
                q2: val.S12 ? val?.S12[item.key] : 0, // 黄牌
                ht: val.S11 ? val?.S11[item.key] : 0, // 红牌
                q3: val.S10 ? val?.S10[item.key] : 0,  // 点球
                q4: val.S2 ? val?.S2[item.key] : 0,   // 半场
                t: val.S1 ? val?.S1[item.key] : 0  // 全场
            }

        } else if (detail_info.csid == 2) {
            return {
                name: item.name,
                q1: val.S19 ? val.S19[item.key] : 0,  // Q1
                q2: val.S20 ? val?.S20[item.key] : 0, // Q2
                ht: val.S2 ? val?.S2[item.key] : 0, // 半场
                q3: val.S21 ? val?.S21[item.key] : 0,  //Q3
                q4: val.S22 ? val?.S22[item.key] : 0,   // Q4
                t: val.S1 ? val?.S1[item.key] : 0  // 全场
            }
        }
        else {
            return {}
        }
    })
    return result
}

const get_msc_data = (msc_data, current_data) => {

    const detail_info = props.detail_info
    const score_list = props.score_list
    let res = ''
    const list = [
        {
            name: detail_info['mhn'],
            key: 'home'
        },
        {
            name: detail_info['man'],
            key: 'away',
        },
    ]
    if ( msc_data.length>0) {
            //   网球
    if (detail_info.csid == 5) {
        res = list.map(item => {
            return {
                name: item.name,
                q1: msc_data[0][item.key],  // 
                q2: msc_data[1][item.key],
                q3: msc_data[2][item.key],
                set: score_list.S1 ? score_list?.S1[item.key] : 0,   // 
                p: current_data[item.key],  // 
            }
        })
    }
      //乒乓球
    if (['7','8','9'].includes( detail_info.csid)) {
        res = list.map(item => {
            return {
                name: item.name,
                q1: msc_data[0]?msc_data[0][item.key]:'', // 
                q2: msc_data[1]?msc_data[1][item.key]:'',
                q3:msc_data[2]?msc_data[2][item.key]:'',
                q4:  msc_data[3]?msc_data[3][item.key]:'',
                q5:  msc_data[4]?msc_data[4][item.key]:'',
                set: score_list.S1 ? score_list?.S1[item.key] : 0,   // 
                p: current_data[item.key],  // 
            }
        })
        
    }
        
    }
    data.value = res || []


}

/**
* @description: 比分排序、添加0:0、添加横向滚动条件
* @param {Object} detials 赛事详情
* @return {undefined} undefined
*/
const format_msc = (detials) => {
    /**
     * csid 比赛阶段的对象变量名
     * msc比分数据
     * mmp 赛事阶段
     * mft 比赛总局数|总盘数
     * mct 当前第几局
     * mat 发球方
     */
    let { csid, mmp, mft, mct, mat } = detials

    let msc_data = [];
    let msc = props.score_list
    const current_data  =  computed_score(detials)// 计算总分


    csid == '4' && (mft = mft || 3)
    let dict = socre_dict(csid);
    //斯诺比赛阶段字段为mct，其他球种为mmp
    let is_sinuoke = csid == '7'
    mmp = parseInt(is_sinuoke ? mct : mmp)
    for (var k in dict) {
        if (!msc[dict[k]] && k <= mft && is_sinuoke) {
            msc[dict[k]] = {
                home: "",
                away: "",
            };
        }
        if (k == mmp && !msc[dict[k]]) {
            msc[dict[k]] = {
                home: 0,
                away: 0,
            };
        }
    }

    let both_data = [];
    Object.keys(msc)
        .sort()
        .map((key) => {
            both_data[key] = msc[key];
        });
    for (let i in both_data) {
        let item = parseInt(i.replace("S", ""));
        if (item >= 120 && item < 160) {
            // 羽毛球、乒乓球、斯洛克，排球，冰球，棒球，沙滩排球 会出现不返回某一局比分的情况，所以手动计算排序
            // http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=12817576       S120-S159 所对应的比分阶段是连续的，所以允许这样处理
            both_data[item - 120] = msc[i];
            // both_data.push(msc[i]);
        }
    }
    if (mft) {
        let num_title = [];
        for (var i = 0; i < mft; i++) {
            num_title.push(i + 1);
            // 补全比分和总盘数|总局数的列数
            if (both_data.length - 1 < i) {
                both_data.push({
                    home: "",
                    away: "",
                });
            }
        }
    }

    msc_data = both_data;
    get_msc_data(msc_data,current_data)

}

/**
* @description: 计算总分
* @param {}
* @return {undefined} undefined
*/
const computed_score = (res) => {
    let score =props.score_list
    let current_data = {
            home: 0,
            away: 0,
        }
    if (!Object.keys(score).length) {
        current_data = {
            home: 0,
            away: 0,
        }
        return false
    }
    for (var i in score) {
        if (["S120", "S121", "S122", "S123", "S124", "S125", "S126"].includes(i)) {
            current_data.home += parseInt(score[i].home || 0);
            current_data.away += parseInt(score[i].away || 0);
        }
    }
   return current_data
}


const get_icon = (icon)=>{
    return new URL(`../../../../../../assets/images/video/${icon}.png`,import.meta.url).href

}
onMounted(() => {
})

</script>
  
<style lang="scss" scoped>
.box-bc {
    background: #ffffff;
    margin-bottom: 10px;

    &:deep(.q-table) {
        padding-bottom: 10px !important;
    }


    &:deep(.q-table th) {
        padding: 1px 0px !important;
    }

    &:deep(.q-table td) {
        padding: v-bind('padding_value')  !important;
    }

    &:deep(.q-table tbody td) {
        height: 30px !important;
    }

    &:deep(.q-table thead tr) {
        height: 30px !important;
    }

    :deep(.q-table__card) {
        box-shadow: none;
    }
}

.top-icon{
    height: 16px;
    margin-top:4px
}
.table-name{
    margin-left: 15px;
    width:180px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
}
</style>
  