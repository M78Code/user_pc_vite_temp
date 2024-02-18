/**
 * 主要是玩法集 滚动
 */
class TabMove {
  constructor() {
    this.init();
  }
  init() {
    this.scrollItemTimer = "";
    this.scrollItemTimer2 = "";
  }

  /**
   * 点击自定义的tab 选项滑动到中间动画
   * 1)先让选中的元素滚到可视区域的最左边 scrollLeft
   * 2)接着向右移动容器一半的距离 containWidth / 2
   * 3)最后向左移动item一半的距离 offsetWidth / 2
   * @param  {Object} （currentIndex 点击的下标，scrollBox 点击下标的父元素，scrollItem 点击下标的元素 ）
   * @return {Undefined} undefined
   */
  tab_move(currentIndex, scrollBox, scrollItem, whether_to_slide) {
    if (!scrollBox || !scrollItem || !scrollItem[currentIndex]) return;
    let lastSpot = scrollBox.scrollLeft;
    let nextSpace = whether_to_slide ? 70 : 7; //每次移动距离
    if (whether_to_slide == "no_fast") nextSpace = 7;

    clearInterval(this.scrollItemTimer);
    this.scrollItemTimer = setInterval(
      () => {
        if (!scrollItem || !scrollItem[currentIndex]) return;
        let offsetWidth = scrollItem[currentIndex].offsetWidth; //item
        let scrollLeft = scrollItem[currentIndex].offsetLeft; //选中的元素滚到可视区域的最左边
        const containWidth = scrollBox.offsetWidth; //容器的宽度
        let resultSpot = scrollLeft + offsetWidth / 2 - containWidth / 2; //最终要停留的点
        if (Math.abs(lastSpot - resultSpot) < nextSpace) {
          clearInterval(this.scrollItemTimer);
        }
        if (resultSpot >= lastSpot) {
          lastSpot = lastSpot + nextSpace;
        } else {
          lastSpot = lastSpot - nextSpace;
        }
        try {
          scrollBox.scrollTo(lastSpot, 0);
        } catch (error) {
          console.error(error);
        }
      },
      whether_to_slide ? "" : 15
    );
  }
  /**
   * 点击自定义的tab 选项滑动到中间动画
   * 1)先让选中的元素滚到可视区域的最左边 scrollLeft
   * 2)接着向右移动容器一半的距离 containWidth / 2
   * 3)最后向左移动item一半的距离 offsetWidth / 2
   * @param  {Object} （currentIndex 点击的下标，scrollBox 点击下标的父元素）
   * @return {Undefined} undefined
   */
  tab_move2(currentIndex, scrollBox, whether_to_slide) {
    if (!scrollBox || !scrollBox.children || !scrollBox.children[currentIndex])
      return;
    let item = scrollBox.children[currentIndex];
    let lastSpot = scrollBox.scrollLeft;
    let nextSpace = whether_to_slide ? 70 : 7; //每次移动距离
    if (whether_to_slide == "no_fast") nextSpace = 7;

    clearInterval(this.scrollItemTimer2);
    this.scrollItemTimer2 = setInterval(
      () => {
        if (!item) return;
        let offsetWidth = item.offsetWidth; //item
        let scrollLeft = item.offsetLeft; //选中的元素滚到可视区域的最左边
        const containWidth = scrollBox.offsetWidth; //容器的宽度
        let resultSpot = scrollLeft + offsetWidth / 2 - containWidth / 2; //最终要停留的点
        if (Math.abs(lastSpot - resultSpot) < nextSpace) {
          clearInterval(this.scrollItemTimer2);
        }
        if (resultSpot >= lastSpot) {
          lastSpot = lastSpot + nextSpace;
        } else {
          lastSpot = lastSpot - nextSpace;
        }
        try {
          scrollBox.scrollTo(lastSpot, 0);
        } catch (error) {
          console.error(error);
        }
      },
      whether_to_slide ? "" : 15
    );
  }

  // 批量清除定时器
  clear_timer() {
    const timer_arr = ["scrollItemTimer", "scrollItemTimer2"];

    for (const timer of timer_arr) {
      clearTimeout(this[timer]);
      this[timer] = null;
    }
  }
}

const tab_move = new TabMove();

export default tab_move
