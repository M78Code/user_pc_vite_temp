//模块之间通信 ，去耦合化的一个 键值对 仓库
export { GLOBAL_CONSTANT } from "src/core/constant/global/index.js";
export const utils = {
  //用户切换的时间点(用于阻止用户过快点击)
  change_time: null,
  /**
   * 阻止用户频繁点击切换
   */
  is_time_limit(time1 = 500) {
    let flag = true;
    let now = new Date().getTime();
    if (!this.change_time || (now - this.change_time) > time1) {
      flag = false;
      this.change_time = now;
    }
    return flag;
  },
  to_thousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  },
  // 删除数据,释放内存
  del: function (any) {
    if (any && (typeof any) == 'object') {
      if (any instanceof Array) {
        for (let i = 0; i < any.length; i++) {
          any.splice(i, 1);
          i--;
        }
      } else {
        for (const key in any) {
          delete any[key]
        }
      }
    }
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
  compute_img_tag_src(path) {
    if (BUILD_VERSION) {
      return `/${BUILD_VERSION}${path}`
    } else {
      return `${BUILD_VERSION}${path}`
    }

  },
  /**
   * @description 修改dom元素类名
   * @param domClassName string 要获取元素的类名
   * @param newName string 要修改成的类名
   * @return undefined
   */
  modify_dom_classname(domClassName, newName = '') {
    let scrollContainerW = document.getElementsByClassName(domClassName)
    if (scrollContainerW.length > 0) {
      for (let i = 0; i < scrollContainerW.length > 0; i++) {
        scrollContainerW[i].className = newName
      }
    }
  },
  // 批量清除定时器
  clear_timer() {
    const timer_arr = [
        'timer1_',
        'scrollItemTimer',
        'scrollItemTimer2',
    ]

    for (const timer of timer_arr) {
      clearTimeout(this[timer])
      this[timer] = null
    }
  },
  /**
   * 点击自定义的tab 选项滑动到中间动画
   * 1)先让选中的元素滚到可视区域的最左边 scrollLeft
   * 2)接着向右移动容器一半的距离 containWidth / 2
   * 3)最后向左移动item一半的距离 offsetWidth / 2
   * @param  {Object} （currentIndex 点击的下标，scrollBox 点击下标的父元素，scrollItem 点击下标的元素 ）
   * @return {Undefined} undefined
   */
  tab_move(currentIndex, scrollBox, scrollItem, whether_to_slide) {
    if(!scrollBox || !scrollItem || !scrollItem[currentIndex]) return
    let lastSpot = scrollBox.scrollLeft
    let nextSpace = whether_to_slide ? 70 : 7 //每次移动距离
    if(whether_to_slide == 'no_fast') nextSpace = 7

    clearInterval(this.scrollItemTimer)
    this.scrollItemTimer = setInterval(() => {
      if(!scrollItem || !scrollItem[currentIndex]) return;
      let offsetWidth = scrollItem[currentIndex].offsetWidth //item
      let scrollLeft = scrollItem[currentIndex].offsetLeft //选中的元素滚到可视区域的最左边
      const containWidth = scrollBox.offsetWidth //容器的宽度
      let resultSpot = scrollLeft + offsetWidth / 2 - containWidth / 2 //最终要停留的点
      if (Math.abs(lastSpot - resultSpot) < nextSpace) {
        clearInterval(this.scrollItemTimer)
      }
      if (resultSpot >= lastSpot) {
        lastSpot = lastSpot + nextSpace
      } else {
        lastSpot = lastSpot - nextSpace
      }
      try {
        scrollBox.scrollTo(lastSpot, 0)
      } catch (error) {
        console.error(error)
      }
    }, whether_to_slide ? '' : 15)
  },

}

