import { get_server_file_path } from "src/core/file-path/file-path.js";
const src_rdm = Date.now();
const installer = (app) => {
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
        img_observe(el, binding);
      } else {
        load_img_src(el, binding);
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
        img_observe(el, binding);
      } else {
        load_img_src(el, binding);
      }
    },
    // 组件销毁
    unbind(el) {
      if (el.is_show_io) {
        el.is_show_io.disconnect();
      }
    },
  });

  // 利用IntersectionObserver监听el 是否可视
  const img_observe = function (el, binding) {
    el.is_show_io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        load_img_src(el, binding);
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
  const load_img_src = function (el, binding) {
    let self_img = el.dataset.src;
    // 绝对地址时直接使用，否则需要重新获取地址
    let img_url =
      /^http(s)?/.test(self_img) || /^\/\//.test(self_img)
        ? self_img
        : get_server_file_path(self_img, el.getAttribute("data-csid"));
    if (img_url) {
      if (img_url.indexOf("?") == -1) {
        img_url = img_url + "?rdm=" + src_rdm;
      } else {
        img_url = img_url + "&rdm=" + src_rdm;
      }
    }
    image_is_exist(img_url, el).then((res) => {
      el.style.opacity = 1;
      const update_show_default = binding.value[3];
      // 图片Onload成功，不显示默认图片
      update_show_default && update_show_default(false)
      if (res) return;
      el.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      // 图片error时，才显示默认图
      update_show_default && update_show_default(true)
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
};

export default installer;
