/**
 *  tab滚动动画
 * @param {*} dom 
 * @param {*} x 
 */
const scrollMenuAnimate = (dom,x) =>{
    
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
        scrollBox.scrollLeft = n;
    }
}
export default {
    scrollMenu:scrollMenu
}