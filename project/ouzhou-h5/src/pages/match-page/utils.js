import { format_M_D_PC } from "src/core/format/common"
import { i18n_t } from "src/output/index.js"

// 月份数组
const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
/**
 * 球种背景图
 */
const sportImg = [
    "101",//"足球",
    "102",//"篮球",
    "108",//"乒乓",
    "109",//"排球",
    "110",//"羽毛球",
    "103",//"棒球",
    "105",//"网球",
    "-1",//"综合",//无id
    "106",//"美式足球",
    "112",//"格斗",
    "104",//"冰球",
    "426",//"冰壶",
    "411",//"手球",
    "107",//"斯诺克",
    "413",//"沙滩排球",
    "414",//"联合式橄榄球",
    "415",//"曲棍球",
    "423",//"举重",
    "425",//"击剑",
    "50101",//"竞足",
    "-2",//"水上排球",//无id
    "419",//"游泳",
    "422",//"射击",
    "428",//"高尔夫",
    "438",//"飞镖",
    "437",//"板球",
    "420",//"体操",
    "429",//"自行车",
    "430",//"赛马",
    "432",//"划船",
    // "431",//"帆船",//图上无
    "427",//"跆拳道",
    "2100",//"LOL",
    "2102",//"CSGO",
    "2101",//"DATA2",
    "-3",//"KOG",//无id
    "118",//"娱乐",
    "439",//"沙滩足球",
    "-4",//"FUN",//无id
    "435",//"空手道",
    "436",//"摔跤",
    "400",//"冠军",//无id
    "421",//"跳水",
    "427",//"跆拳道",
    "433",//"赛车"
];
/**
 *赛事列表背景图
 * @param {*} mi 
 * @returns 
 */
export const farmatSportImg = (mi) =>{
    const voidNum = 10,//图片上下间距
        cardinal = (2587-43*voidNum)/sportImg.length,//单个高度
        index = sportImg.findIndex((n)=>{return n == mi}),//目前为止
        y = index*cardinal+(index)*voidNum;//移动距离
    return index>0?-y:index == 0?0:cardinal;
}
/**
 * 一周时间
 * @param {*} day 
 * @returns 
 */
export const dateWeekMatchesFormat = (day) => {
    day = day||new Date();
    let result = [];
    Date.prototype.getMonthDay = function (i) {
        let date_time = i === 0 ? "" : new Date(this.setHours(12, 0, 0, 0)).getTime()
        return {
          val: date_time,
          name:  i == 0 ? i18n_t('ouzhou.match.today') : i == 1 ? i18n_t('ouzhou.match.tomorrow') : `${format_M_D_PC(date_time)}`,
          type:i === 0?0:1
        };
    }
    result.push(day.getMonthDay(0));
    for (let i = 0; i < 6; i++) {
        day.setDate(day.getDate() + 1);
        result.push(day.getMonthDay(i+1))
    }
    return result;
};