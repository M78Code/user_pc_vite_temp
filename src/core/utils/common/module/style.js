 

/**
 * rem 转换 像素值
 */
export function rem_2_px(rem) {
  let rem1px = window.innerWidth / 3.75; //1rem的像素值
  return rem * rem1px.toFixed(2);
}
/**
 * 像素值转为rem
 */
export function px_2_rem(px) {
  let rem1px = window.innerWidth / 3.75; //1rem的像素值
  return px / rem1px;
}

/**
 * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
 * @param {Number} value 需要转换的值
 * @return {Number}
 */
export const rem = (value) => {
  let font_size = ( window.innerWidth * 100) / 375;
  return Math.ceil(value * font_size);
};
/**
 * @description: 参考iphone6,7,8窗口高度(667)模拟rem
 * @param {Number} value 需要转换的值
 * @return {Number}
 */
export const rem_height = (value) => {
  let limit = 170;
  let font_size = (innerHeight * 100) / 667;
  // 注释掉，放开响应式变化限制
  /*if(font_size > limit){
    font_size = limit
  }*/
  return Math.ceil(value * font_size);
};





