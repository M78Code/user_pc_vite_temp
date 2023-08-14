// import { api_details } from "src/api/index";
// import { MITT_TYPES, useMittEmit } from "../../mitt";
// const { DOMAIN_RESULT, BUILD_VERSION } = window.BUILD_CONFIG;
const iframe_key_map = {};
function pre_load_iframe(url, timeout = 10000) {
  if (iframe_key_map[url]) return;
  let _iframe = document.createElement("iframe");
  _iframe.style.height = "0px";
  _iframe.style.opacity = 0;
  _iframe.style.display = "none";
  _iframe.onload = function () {
    iframe_key_map[url] = 1;
    setTimeout(() => {
      document.head.removeChild(_iframe);
    }, 10000);
  };
  document.body.appendChild(dplayer_el);
}

export { pre_load_iframe };
