 
  /**
   * @description 数组元素交换
   * @param arr 目标数组
   * @param index1 待交换下标1
   * @param index2 待交换下标2
   * @returns {Array} 交换后的数组
   */
  export function swapArray(arr, index1, index2) {
    // arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    // return arr
    const tmp = arr[index2]
    arr[index2] = arr[index1]
    arr[index1] = tmp
    return arr
  }