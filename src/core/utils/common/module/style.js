/**
 * @description: 参考iphone6,7,8窗口宽度(375)模拟rem
 * @param {Number} value 需要转换的值
 * @return {Number}
 */
export function rem(value) {
  let font_size = (innerWidth * 100) / 375;
  return Math.ceil(value * font_size);
}

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
