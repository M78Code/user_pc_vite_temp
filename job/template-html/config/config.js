// 占位符常量
export const placeholder_const = {
  meta1: "meta1_html_placeholder",
  style1: "style1_html_placeholder",
  script1: "script1_html_placeholder",
  script2: "script2_html_placeholder",
};

// 默认所有占位符  对象
let all_placeholder_obj = {};

for (let i in placeholder_const) {
  all_placeholder_obj[i] = {
    placeholder: placeholder_const[i],
    content: "",
  };
}
// 默认所有占位符  占位对象
export const default_all_placeholder_obj = all_placeholder_obj;
// 默认内容
export const default_content = {
  meta1: `
    <meta name="msapplication-tap-highlight" content="no" />

    <meta name="apple-mobile-web-app-capable" content="no" />
    <meta name="hid-api" content="%VITE_APP_hidApi%" />
    <!-- <meta name="apple-mobile-web-app-capable" content="yes" /> -->
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="portrait" />
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="portrait" />
    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes" />
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true" />
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application" />
    <!-- QQ应用模式 -->
    <meta name="x5-page-mode" content="app" />
    <!-- windows phone 点击无高光  -->
    <meta name="msapplication-tap-highlight" content="no" />
    `,
};
