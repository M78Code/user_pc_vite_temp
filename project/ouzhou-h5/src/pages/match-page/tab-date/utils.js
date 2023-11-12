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
 * 一周时间
 * @param {*} day 
 * @returns 
 */
export const dateWeekMatchesFormat = (day) => {
    day = day||new Date();
    let result = [];
    Date.prototype.getMonthDay = function (i) {
        let dateVal = i === 0?'Today':i === 1?'Tomorrow':month[this.getMonth()] + ' ' + this.getDate();
        return {
          val:i === 0?"":new Date(this.setHours(12, 0, 0, 0)).getTime(),
          name:dateVal,
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