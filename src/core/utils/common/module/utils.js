/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共方法对象定义
 */
import uid from "src/core/uuid/index.js";
import lodash from 'lodash'
import { date } from "quasar";
import { api_common, api_account } from 'src/api/index';
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { DateForMat } from "src/core/format/common/index.js"


const OL_RESULTS=['r-unkown','r-unkown2','r-tie','r-lose','r-win','r-win-half','r-lose-half'];

//模块之间通信 ，去耦合化的一个 键值对 仓库
export { GLOBAL_CONSTANT } from "src/core/constant/global/index.js";

 

export const utils = {

 

  timer1_: null,
  //用户切换的时间点(用于阻止用户过快点击)
  change_time:null,

  

  /**
   * @Description 获取滚动条宽度  quasar源码复制的
   * @param {undefined} undefined
  */
  getScrollbarWidth () {
    const
      inner = document.createElement('p'),
      outer = document.createElement('div');
    this.css(inner, {
      width: '100%',
      height: '200px'
    })
    this.css(outer, {
      position: 'absolute',
      top: '0px',
      left: '0px',
      visibility: 'hidden',
      width: '200px',
      height: '150px',
      overflow: 'hidden'
    })
    outer.appendChild(inner)
    document.body.appendChild(outer)
    const w1 = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let w2 = inner.offsetWidth
    if (w1 === w2) {
      w2 = outer.clientWidth
    }
    outer.remove()
    return w1 - w2
  },
  /**
   * @Description 设置css quasar源码复制的
   * @param {undefined} undefined
  */
  css (element, css) {
    const style = element.style
    Object.keys(css).forEach(prop => {
      style[prop] = css[prop]
    })
  },
   
  /**
   * 阻止用户频繁点击切换
   */
  is_time_limit(time1=500){
    let flag = true;
    let now = new Date().getTime();
    if(!this.change_time || (now - this.change_time) > time1){
      flag = false;
      this.change_time = now;
    }
    return flag;
  },
  
  to_thousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  },
  // 删除数据,释放内存
  del :function(any){
    if(any&&(typeof any) == 'object')
    {
      if(any instanceof Array){
        for (let i = 0; i < any.length; i++) {
          any.splice(i,1);
          i--;
        }
      } else{
        for (const key in any) {
          delete any[key]
        }
      }
    }
  },

  /**
   * @description: 获取指定时间戳的相应日期格式
   * @param timeStamp 时间戳
   * @param format  日期格式
   * @returns {string} 转换后的日期
   */
  formatDate(timeStamp, format = 'YYYY-MM-DD HH:mm:ss') {
    return date.formatDate(timeStamp, format)
  },
  /**
   * @description 数组元素交换
   * @param arr 目标数组
   * @param index1 待交换下标1
   * @param index2 待交换下标2
   * @returns {Array} 交换后的数组
   */
  swapArray(arr, index1, index2) {
    // arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    // return arr
    const tmp = arr[index2]
    arr[index2] = arr[index1]
    arr[index1] = tmp
    return arr
  },
  /**
   * 上报URL
   * @param {*} params
   */
  upload_url_info(params) {
    return false
    api_account.upload_url_info(params).then(() => {

      console.log('URL上报成功');
    }).catch(error => {

      console.log('URL上报失败');
      console.log(error);
    })
  },
  /**
   * @description: 删除当前url中的指定参数
   * @param {*} key_arr
   * @return {*} url
   */
  remove_url_param(key_arr){
    let url_search = new URLSearchParams(location.search);
    // 删除  api
    if(key_arr){
      key_arr.forEach(key => {
        url_search.delete(key)
      });
    }
    // 旧的哈希  兼容   #/home?rdm=1660636891118 这种形式处理
    let old_hash = location.hash;
    // 新的 哈希
    let new_hash = "";
    if (!old_hash) {
      new_hash = "";
    } else {
      if (old_hash.includes("?")) {
        new_hash = old_hash.split("?")[0];
      } else {
        // '#/home'
        new_hash = old_hash;
      }
    }
    // 新的 搜索参数
    let new_search = url_search.toString();
    // 新的 url
    return location.origin + "?" + new_search + new_hash;
  },
  /**
   * 平板访问时上报信息
   * @param {*} params
   */
  upload_tablet_comput(params) {
    api_account.upload_tablet_comput(params).then(() => {
      console.log('平板上报成功');
    }).catch(error => {
      console.log('平板上报失败');
      console.log(error);
    })
  },
    /**
     * rem 转换 像素值
     */
     rem_2_px(rem){

      let rem1px = window.innerWidth / 3.75; //1rem的像素值
      return  rem*rem1px .toFixed(2)
    },
    /**
     * 像素值转为rem
     */
    px_2_rem(px) {
      let rem1px = window.innerWidth / 3.75; //1rem的像素值
      return px / rem1px;
    },
    /**
     * @description 判断目标是否为整数
     * @param obj
     */
    is_integer(obj) {
      return Math.floor(obj) === obj
    },
    /**
     * 计算图片 路径  用于  img 标签
     * //当
     *  src/css/pro/bw3/variable.js  主题内 有用这张图片 （相当于 public 目录内的静态复制 ）
     *  并且 img 标签内有有用这张图片 的时候 打包方式最终 （webpack 托管哈希打包）是两张
     * 此事可以 使用此方法 让  img 标签 的 src 计算 路径 最终  和 主题内  图片一样 用  public 目录内的静态复制
     *
     * 最终目标是 ，代码打包出来加载的是同一张图片，不管是  webpack托管哈希的 还是 public 目录内的静态复制
     *
     * 特表留意 all_img_preloading 方法 的  预加载图片  两种形式 要和 img 标签 或者  variable.js 内的 统一
     *
     * 实现 方法本身 没有高低贵贱之分 ，没有好坏之分 ，保持单张图片 结果 统一就行
     *
     */
    compute_img_tag_src(path){
    if(BUILD_VERSION){
      return `/${BUILD_VERSION}${path}`
    }else{
      return `${BUILD_VERSION}${path}`
    }

    },
    /**
     * @description 修改dom元素类名
     * @param domClassName string 要获取元素的类名
     * @param newName string 要修改成的类名
     * @return undefined
     */
    modify_dom_classname(domClassName, newName='') {
      let scrollContainerW = document.getElementsByClassName(domClassName)
      if (scrollContainerW.length > 0) {
        for(let i = 0; i < scrollContainerW.length > 0; i++) {
          scrollContainerW[i].className = newName
        }
      }
    },
    
}

