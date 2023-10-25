/*
 * @Author: rise
 * @Date: 2023-10-24 19:10:02
 * @LastEditors: rise
 * @LastEditTime: 2023-10-25 11:43:17
 * @Description:  
 */

/**
 *  tab滚动动画
 * @param {*} dom 
 * @param {*} x 
 */
const scrollMenuAnimate = (dom,x) =>{
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
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
            dom.scrollTo(scrollLeft,0);
            requestAnimationFrame(step);
        }
    };
    step();
}
/**
 * tab滚动
 * @param {*} event
 * @param {*} parentClass  父元素类
 * @param {*} childClass  选中类
 */
 export const scrollMenu = (event,parentClass,childClass) =>{
    let scrollBox = document.querySelector(parentClass),//父元素
        scrollBoxNav = document.querySelector(childClass),//子元素
        spanLeft = event.clientX, // 当前点击的元素左边距离
        divBox = scrollBoxNav.clientWidth / 2, // 点击的元素一半宽度
        totalWidths = scrollBox.clientWidth, // 父元素总宽度
        widths = totalWidths / 2, // 父元素总宽度一半
        spanRight = totalWidths - spanLeft, // 元素的右边距离
        scrollL = scrollBox.scrollLeft; // 滚动条滚动的距离
    // 当元素左边距离 或者 右边距离小于总宽一半
    if (spanRight < widths || spanLeft < widths) {
         let n = scrollL + (spanLeft - widths) + divBox;
        scrollMenuAnimate(scrollBox,n)
    }
}
export default {
    scrollMenu:scrollMenu
}