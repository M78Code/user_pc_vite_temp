/*
 * @Author: rise
 * @Date: 2023-10-24 19:10:02
 * @LastEditors: rise
 * @LastEditTime: 2023-11-10 15:21:46
 * @Description:  
 */
/**
 * 一周时间
 * @param {*} day 
 * @param {*} reverse 是否倒序
 * @returns 
 */
export const dateWeekFormat = (day,reverse) => {
    let result = [];
    Date.prototype.getMonthDay = function () {
        let dateVal = (this.getMonth() + 1) + '/' + this.getDate();
        return {
          val:new Date(this.setHours(12, 0, 0, 0)).getTime(),
          name:dateVal
        };
    }
    result.push(day.getMonthDay());
    for (let i = 0; i < 6; i++) {
        reverse?day.setDate(day.getDate() - 1):day.setDate(day.getDate() + 1);
        result.push(day.getMonthDay())
    }
    return result;
};