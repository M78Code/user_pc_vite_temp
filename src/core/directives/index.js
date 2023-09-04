/**
 * @Author: lowen
 * @Date: 2023-09-03 16:39
 * @Description 全局自定义指令
 */
import { get_file_path } from "src/core/file-path/file-path.js";
import loadash from 'lodash'
const useDirective = (app) => {
  app.directive("img", {
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
    beforeMount(el, binding) {
      el.setAttribute("data-src", binding.value[0]);
      el.setAttribute("data-team", binding.value[1]);
      el.setAttribute("data-csid", binding.value[2]);
      el.setAttribute(
        "src",
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      );
      // 先设置透明 防止显示加载图片错误
      el.style.opacity = 0;
    },
    // 当元素被插入到DOM中时
    mounted(el, binding) {
      if (IntersectionObserver) {
        img_observe(el);
      } else {
        load_img_src(el);
      }
    },
    // 当元素更新时
    update(el, binding) {
      if (binding.value[0] == binding.oldValue[0]) {
        return;
      }
      el.setAttribute("data-src", binding.value[0]);
      el.setAttribute("data-team", binding.value[1]);
      el.setAttribute("data-csid", binding.value[2]);
      if (IntersectionObserver) {
        img_observe(el);
      } else {
        load_img_src(el);
      }
    },
    // 组件销毁
    unmounted(el) {
      if (el.is_show_io) {
        el.is_show_io.disconnect();
      }
    },
  });

  app.directive("check-img", {
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
   beforeMount(el, binding) {
      el.setAttribute("data-src", binding.value.src);
      el.setAttribute("data-default", binding.value.default);
      el.setAttribute(
        "src",
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      );
      // 先设置透明 防止显示加载图片错误
      el.style.opacity = 0;
    },
    // 当元素被插入到DOM中时
    mounted(el) {
      load_img_src_common(el);
    },
    // 当元素更新时
    update(el, binding) {
      if (binding.value.src == binding.oldValue.src) {
        return;
      }
      el.setAttribute("data-src", binding.value.src);
      el.setAttribute("data-default", binding.value.default);
      load_img_src_common(el);
    },
  });

  // 利用IntersectionObserver监听el 是否可视
  const img_observe = function (el) {
    el.is_show_io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        load_img_src(el);
        el.is_show_io.disconnect();
      }
    });
    el.is_show_io.observe(el);
  };

  // 字母顺序
  const letter_num = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9,
    K: 10,
    L: 11,
    M: 12,
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
  };

  /**
   * @Description 加载图片
   * @param {object} el dom元素
   * @param {undefined} undefined
   */
  const load_img_src = function (el) {
    let self_img = el.dataset.src;
    // 绝对地址时直接使用，否则需要重新获取地址
    let img_url =
      /^http(s)?/.test(self_img) || /^\/\//.test(self_img)
        ? self_img
        : get_file_path(self_img, el.getAttribute("data-csid"));
    if (img_url) {
      if (img_url.indexOf("?") == -1) {
        img_url = img_url + "?rdm=" + window.src_rdm;
      } else {
        img_url = img_url + "&rdm=" + window.src_rdm;
      }
    }
    image_is_exist(img_url, el).then((res) => {
      el.style.opacity = 1;
      if (res) return;
      el.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      // 队名图标的处理逻辑
      let team_letter = el.dataset.team;
      if (team_letter != "undefined") {
        let default_img = /[a-z]/i.test(team_letter) ? team_letter : "logo";
        el.classList.add("team-logo-" + default_img);
        if (letter_num[default_img]) {
          let width = el.width || el.clientWidth;
          let position =
            parseInt(((letter_num[default_img] * width * 64) / 44) * 100) / 100;
          el.style = `background-position:0 -${position}px`;
        }
        // 联赛图标
      } else {
        el.classList.add("leagues-logo-default");
      }
      el = null;
    });
    el.removeAttribute("data-src");
  };

  /**
   * @Description 加载图片
   * @param {object} el dom元素
   * @param {undefined} undefined
   */
  const load_img_src_common = function (el) {
    let self_img = el.dataset.src;
    // 绝对地址时直接使用，否则需要重新获取地址
    let img_url = /^http(s)?/.test(self_img)
      ? self_img
      : get_file_path(self_img, el.getAttribute("data-csid"));
    image_is_exist(img_url, el).then((res) => {
      el.style.opacity = 1;
      if (res) return;
      el.src = el.dataset.default;
      el = null;
    });
    el.removeAttribute("data-src");
  };

  /**
   * 检测图片是否存在
   * @param url
   */
  let image_is_exist = function (url, img) {
    return new Promise((resolve) => {
      // var img = new Image();
      img.onload = function () {
        if (this.complete == true) {
          resolve(true);
          // img = null;
        }
      };
      img.onerror = function () {
        resolve(false);
        // img = null;
      };
      if (url) {
        img.src = url;
      } else {
        resolve(false);
      }
      img = null;
    });
  };
  // 图片懒加载指令
  app.directive("imgdef", {
    // 当元素被插入到DOM中时
    mounted(el, binding) {
      el.src = binding.value;
    },
    // 当元素更新时
    update(el, binding) {
      el.src = binding.value;
    },
  });

  /**
   * @Description 悬浮气泡鼠标经过
   * @param {object} e 鼠标经过事件
   * @param {undefined} undefined
   */
  const tooltip_enter = function (e) {
    let el = e.target;
    if (el.tip_cancel == 1) {
      return;
    }
    let tipid = el.tip_tipid;
    let content = el.tip_content;
    let time = el.tip_time;
    let overflow = el.overflow;
    let left = e.pageX - e.offsetX + el.offsetWidth / 2;
    let top = e.pageY - e.offsetY - 24;
    let style = `display: block;top:${top}px;left:${left}px;`;
    let m_width = el.m_width;
    let border_width = 0;
    if (overflow) {
      let css = getComputedStyle(el);
      border_width =
        Number(css.borderLeftWidth.replace("px", "")) +
        Number(css.borderRightWidth.replace("px", ""));
      style += `visibility:hidden;font-size:${css.fontSize};line-height:${css.lineHeight};font-weight:${css.fontWeight};`;
    }
    if (overflow == 2) {
      style += `width:${
        el.offsetWidth + 10
      }px;white-space:normal;word-break:break-all;height:auto;`;
    }
    tooltip(
      content,
      style,
      time,
      tipid,
      el.getBoundingClientRect().width - border_width,
      el.offsetHeight,
      overflow,
      m_width
    );
  };

  /**
   * @Description 悬浮气泡鼠标离开
   * @param {undefined} undefined
   */
  const tooltip_leave = function (e) {
    if (e.target.tip_cancel == 1) {
      return;
    }
    tooltip("cancel", 0, 0, 0);
  };

  // 自定义悬浮气泡指令
  app.directive("tooltip", {
    // 指令绑定
   beforeMount(el, bind) {
      el.tip_cancel = bind.value.cancel === true ? 1 : 0;
      el.tip_tipid = loadash.uniqueId();
      el.tip_content = bind.value.content;
      el.tip_time = bind.value.time || 0;
      el.overflow = bind.value.overflow || 0;
      el.m_width = bind.value.m_width || 0;
      el.onmouseenter = tooltip_enter;
      el.onmouseleave = tooltip_leave;
    },
    // 指令参数更新
    update(el, bind) {
      el.tip_cancel = bind.value.cancel === true ? 1 : 0;
      el.tip_content = bind.value.content;
      el.tip_time = bind.value.time || 0;
      if (bind.value.cancel === true) {
        tooltip("cancel", 0, 0, el.tip_tipid);
      }
    },
    // 组件销毁
    unbind(el) {
      tooltip("cancel", 0, 0, el.tip_tipid);
      el.onmouseenter = null;
      el.onmouseleave = null;
    },
  });

  /**
   * @Description v-icon指令，用于将quasar组件中自带的图标（Material Icon）替换为自定义的图标
   * Material Design 的图标是怎么生效的?参见：https://segmentfault.com/q/1010000002811943
   */
  app.directive("icon", {
    mounted(el, binding) {
      // binding.value即为替换icon的映射对象
      // 目标组件类名
      const target_class = el.classList[0];
      // 待替换图标icon名称 如chevron_left、chevron_right
      const replace_keys = Object.keys(binding.value);
      // 查找目标组件下待替换图标的icon元素集合
      const icons =
        target_class === "q-icon"
          ? [el]
          : document.querySelectorAll(`.${target_class} i.material-icons`);

      // 替换目标组件下的icon
      icons.forEach((item) => {
        replace_keys.forEach((key) => {
          if (item.innerHTML === key) {
            item.classList.replace("material-icons", binding.value[key]);
          }
        });
        item.innerHTML = "";
      });
    },
  });
};
export default useDirective;
