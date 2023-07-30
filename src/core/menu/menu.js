/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-30 13:16:32
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-30 13:42:33
 * @FilePath       : \user-pc-vite\src\core\menu\menu.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { ref } from "vue"

// 菜单默认数据
const menu = [ 101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114, 104, 106, 118 ]

// 电子竞技 菜单
const esports = [2100,2101,2102,2103]

// 菜单核心方法
export const useMenu = () =>{
  // 菜单列表
  const menu_list = ref(menu)
  
  /**
   * 根据  一级 菜单ID 计算 赛种 ID
   * @param {*} mi 菜单id
   */
  const compute_sport_id = mi => {
    const obj = {
      101: 1,
      102: 2,
      103: 3,
      104: 4,
      105: 5,
      106: 6,
      107: 7,
      108: 8,
      109: 9,
      110: 10,
      111: 11,
      112: 12,
      113: 13,
      114: 14,
      115: 15,
      116: 16,
      118: 18,
      300: 300,
      400: 400,
      2000: 2000,
    };
    return obj[mi];
  }

  return {
    menu_list,
    compute_sport_id
  }
}