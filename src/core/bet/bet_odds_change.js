/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-30 20:26:27
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-30 22:01:33
 * @FilePath       : \user-pc-vite\src\core\bet\bet_odds_change.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


const float_3_csid = [100, 101, 102, 103] // 需要显示三位小数点的,赛种编号(电竞)
const all_odds_arr = [] //所有的赔率数组
const cur_odds_arr = [] // 当前允许的赔率数组
let cur_odd = "EU" // 当前赔率
let vx_get_chat_room_type = "EU"  // 聊天室赔率
// arr.push([`${EU}`, HK, MY, GB, US, ID]);
// 欧洲赔率  1  
// 香港赔率  2  
// 马来赔率  3  
// 英式赔率  4  
// 美式赔率  5  
// 印尼赔率  6
const odds_constant = [
    { label: 'EU', value: "EU", icon: 'panda-icon-contryEU', id: 1 },//欧洲盘
    { label: "ID", value: "ID", icon: 'panda-icon-contryYN', id: 6 },//印尼盘
    { label: "US", value: "US", icon: 'panda-icon-contryUS', id: 5 },//美式盘
    { label: "MY", value: "MY", icon: 'panda-icon-contryML', id: 3 },//马来盘
    { label: "GB", value: "GB", icon: 'panda-icon-contryUK', id: 4 },//英式盘
    { label: "HK", value: "HK", icon: 'panda-icon-contryHK', id: 2 },//香港盘
]

const oddsTable = {
    EU: '1',
    HK: '2',
    MY: '3',
    GB: '4',
    US: '5',
    ID: '6',
}

const vx_odds_coversion_map = {}

//赔率展示格式化
const format_odds = val => {
    if (val == '' || val == undefined) {
        return '';
    }
    val = (val || '0').toString();
    let ret = val;
    if (val.includes('.')) {
        if (val >= 100) {
            if (val.split('.')[1] == '00') {
                ret = val.split('.')[0];
            } else {
                let len = val.length;
                if (val.indexOf('.0') == (len - 2)) {
                    ret = val.substring(0, len - 2);
                } else {
                    ret = val;
                }
            }
        } else if (val >= 10) {
            if (val.split('.')[1][1] == '0') {
                ret = val.slice(0, val.length - 1);
            } else {
                ret = val;
            }
        }
    }
    
    return ret;
}


//返回字符串保留两位小数,csid-赛种ID
const calc_odds = (val, csid) => {
    let N = val.toString();
    if (float_3_csid.includes(1 * csid)) {
        //3位小数点处理
        if (N.includes(".")) {
            let S = N.split('.');
            if (S[1][2]) {
                val = S[0] + "." + S[1][0] + S[1][1] + S[1][2];
            } else if (S[1][1]) {
                val = S[0] + "." + S[1][0] + S[1][1] + "0";
            } else {
                val = S[0] + "." + S[1][0] + "00";
            }
        } else {
            val = N + ".000";
        }
    } else {
        if (N.includes(".")) {
            let S = N.split('.');
            if (S[1][1]) {
                val = S[0] + "." + S[1][0] + S[1][1];
            } else {
                val = S[0] + "." + S[1][0] + "0";
            }
        } else {
            val = N + ".00";
        }
    }
    return val;
}

const change_EU_HK = val => {
    if (val) {
        val = val.toString();
        // 小数点的位置
        let index_dot = val.indexOf('.');
        // 整数部分
        let int_part = val.substring(0, index_dot);
        // 小数部分
        let small_part = val.substring(index_dot, val.length);
        return `${int_part - 1}${small_part}`
    }
    return val;
}

const get_accuracy = str => {
    if (str >= 10 && str < 100) {
        str = str.substring(0, str.length - 1);
    } else if (str >= 100) {
        str = str.substring(0, str.length - 3);
    }
    return str;
}

//非欧盘时计算赔率转换
const compute_value_by_odd_type = (val, odd_type, csid) => {
    /**
     * val  : 原始欧洲赔率的 值
     * odd_type ： 需要转换到的赔率类型的 键名
     * csid ：赛种ID
     *
     * 把传入的值，计算为当前赔率
     * 这里必须清楚，我们始终以欧洲赔率作为标准
     * 数据里面永远存在欧洲赔率
     * 此处转换 传入的只能是 欧洲赔率的数值 和另一个赔率的 标识
     *
     * 存在问题 ，传入的必须是 赔率 不是金额
     * 金额需要另外套接
     *
     * 赔率 有粒度 不一定命中 这里需要做处理
     *
     *
     */

    //  EU_1.01
    /**
       * 切换通用规则：a，部分数据源给过来的赔率数据会落在断档区间内，则自动匹配区间值中小的那一个进行其他赔率转换，
       * 从其他赔率转换回欧洲赔率时直接变回源数据欧洲赔率。例如：数据源过来的赔率为2.58，在区间2.55-2.60之间，
       * 则将数据源的赔率匹配为2.55进行其他赔率转换；从其他赔率转换回欧洲赔率的时候直接回2.58。b，赔率负数要红色显示；正数用黑色显示。

       */
    /**
     *
     * 已和产品确认，和上游数据确认，传递给前端的 是 原始 欧洲赔率
     *
     */
    /**
           * 1	1.01-2.50，以0.01为单位，相应赔率转换
              2	2.5-5.0，以0.05为单位，相应赔率转换
              3	5.0-10，以x.2，x.5，x.7，x.0展示，相应赔率转化
              4   10-20，以0.5为单位，相应赔率转换
              5	20-30，以1为单位，相应赔率转换
              6	30-100，以5为单位，相应赔率转换

              和 产品确认， 负数 小于 -10 的 .5 不显示  ，正数 大于20的 .5 不显示
           */
    // console.log(`转换赔率：val : ${val}  odd_type: ${odd_type}`);
    if (!val) {
        return "";
    }

    if (!odd_type) {
        return val;
    }
    // 如果是香港赔率直接减1
    if (odd_type == 'HK') {
        return val - 1;
    }

    // 赔率类型错误
    let index = _.findIndex(odds_constant, o => {
        return o.value == odd_type;
    });
    val = calc_odds(val, csid);
    if (index < 0) {
        return val;
    }

    if (val <= 1) {
        return val;
    }
    // 正常情况
    let obj = ``;
    let real = "";
    obj = vx_odds_coversion_map[`EU_${val}`];
    if (val <= 2.5) {
        // 1	1.01-2.50，以0.01为单位，相应赔率转换
    } else if (val <= 5) {
        // 2.5-5.0，以0.05为单位，相应赔率转换  3.478
        if (!obj) {
            real = (Math.floor(val * 100) - (val)) / 100;
            obj = vx_odds_coversion_map[`EU_${real}`];
        }
    } else if (val <= 10) {
        // 5.0-10，以x.2，x.5，x.7，x.0展示，相应赔率转化 5.478
        if (!obj) {
            let nnn = Math.floor(val * 10);
            let nnn_y = nnn % 10;
            if (nnn_y >= 0 && nnn_y < 2) {
                nnn_y = 0;
            } else if (nnn_y < 5) {
                nnn_y = 2;
            } else if (nnn_y < 7) {
                nnn_y = 5;
            } else if (nnn_y <= 9) {
                nnn_y = 7;
            }
            real = Math.floor(val) + nnn_y / 10;
            // console.log(" real" + real);
            obj = vx_odds_coversion_map[`EU_${real}`];
        }
    } else if (val <= 20) {
        // 4   10-20，以0.5为单位，相应赔率转换   10.476
        // 10.476%5=0.47600000000000087
        if (!obj) {
            // real = (Math.floor(val * 10) - (Math.floor(val * 10) % 5)) / 10;
            obj = vx_odds_coversion_map[`EU_${real}`];
        }
    } else if (val <= 30) {
        // 5	20-30，以1为单位，相应赔率转换
        if (!obj) {
            real = Math.floor(val);
            obj = vx_odds_coversion_map[`EU_${real}`];
        }
    } else if (val <= 100) {
        // 6	30-100，以5为单位，相应赔率转换
        if (!obj) {
            real = Math.floor(val) - (val);
            obj = vx_odds_coversion_map[`EU_${real}`];
        }
    }
    // console.log("转换赔率数值所用的对象");
    // console.log(obj);
    if (obj) {
        return obj[odd_type];
    } else {
        return val;
    }
}

export const use_bet_business = () => {
    const compute_value_by_cur_odd_type = (val, breakVal, arr, csid) => {
        /**
         * 此方法预留  后期 对于 不支持转换赔率的 盘口 做特殊加工
         * 是 对全局 赔率转换的 基础设定
         * arr: 当前盘口 支持的赔率转换类型的 全部值
         * csid ：赛种ID
         */
        if (!val) {
            return;
        }
        // PS-9881赔率优化
        let str = "";
        breakVal = ""; // 断档值废弃
        // 从欧盘转到港盘
        if (!arr || ['2'].includes(oddsTable[cur_odd]) && cur_odd == 'HK') {
            str = calc_odds(val, csid);
            //聊天室跟单特殊处理 
            // 当前不存在聊天室
            // if(arr && arr.includes( oddsTable[cur_odd]) || vx_get_chat_room_type=="HK") {
            //   str = change_EU_HK(str);
            // }
            return str;
        }

        if (!arr || arr.includes(oddsTable[cur_odd]) && cur_odd) {
            cur_odd == 'EU' ? str = calc_odds(val, csid) : str = compute_value_by_odd_type(breakVal ? breakVal : val, cur_odd, csid);
        } else {
            str = calc_odds(val, csid);
        }
        return str;
    }

    return {
        compute_value_by_cur_odd_type
    }
}

