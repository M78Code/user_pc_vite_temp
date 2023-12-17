/*
 * @Author: rise
 * @Date: 2023-10-24 19:10:02
 * @LastEditors: rise
 * @LastEditTime: 2023-10-31 15:21:46
 * @Description:  
 */
/**
 * 一周时间
 * @param {*} day 
 * @returns 
 */
export const dateWeekFormat = (day) => {
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
        day.setDate(day.getDate() + 1);
        result.push(day.getMonthDay())
    }
    return result;
};
/**
 * 时间组件默认值
 * @param {*} day 日期new Date()
 * @param {*} pre tab首位
 * @param {*} next tab末尾
 * @returns 
 */
export const dateTabList = (day,pre={name:"全部",val:""},next={name:"其他",val:'-1703563200000'}) => {
    return [pre,...dateWeekFormat(day),next];
};
/**
 *  tab滚动动画
 * @param {*} dom 
 * @param {*} x 
 */
export const scrollMenuAnimate = (dom, x) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            return setTimeout(callback, 17);
        };
    }
    // 当前滚动距离
    let scrollLeft = dom.scrollLeft;
    // 滚动step方法
    let step = function () {
        // 距离目标滚动距离
        let distance = x - scrollLeft;
        // 目标滚动位置
        scrollLeft = scrollLeft + distance / 5;
        if (Math.abs(distance) < 1) {
            dom.scrollTo(x, 0);
        } else {
            dom.scrollTo(scrollLeft, 0);
            requestAnimationFrame(step);
        }
    };
    step();
};
/**
 * tab滚动
 * @param {*} event 可以传dom或者event
 * @param {*} parentClass  父元素类
 * @param {*} childClass  选中类
 */
export const scrollMenuEvent = (event, parentClass, childClass) => {
    let scrollBox = document.querySelector(parentClass),//父元素
        scrollBoxNav = document.querySelector(parentClass).querySelector(childClass),//子元素
        spanLeft,
        divBox = scrollBoxNav?.clientWidth / 2, // 点击的元素一半宽度
        totalWidths = scrollBox?.clientWidth, // 父元素总宽度
        widths = totalWidths / 2, // 父元素总宽度一半
        spanRight, // 元素的右边距离
        scrollL = scrollBox.scrollLeft; // 滚动条滚动的距离
    // 当元素左边距离 或者 右边距离小于总宽一半
    
    if (event instanceof Event) {spanLeft = event?.clientX} // 当前点击的元素左边距离
    if (event instanceof Element) {spanLeft = event?.offsetLeft} // 当前元素左边距离

    spanRight = totalWidths - spanLeft

    if(!scrollBoxNav)return;
    if (spanRight < widths || spanLeft < widths) {
        let n = scrollL + (spanLeft - widths) + divBox;
        scrollMenuAnimate(scrollBox, n)
    }
}
