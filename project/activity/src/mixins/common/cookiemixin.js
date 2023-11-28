/*
 * @Author: success
 * @Date: 2020-08-04 17:13:54
 * @Description: cookies操作工具类
 */
export default {

    methods: {
        get_cookies() {
            let cookies = [];
            if (document.cookie) {
                let cookieArr = document.cookie.split(';');
                for (let i = 0; i < cookieArr.length; i++) {
                    let keyArr = cookieArr[i].split("=");
                    let name = keyArr[0].trim();
                    let val = keyArr[1].trim();


                    cookies.push({
                        name: name,
                        value: val,
                    });
                }
            } else {
                return false;
            }
            // console.log(cookies)
            return cookies;
        },
        get_cookie(name) {
            let cookies = this.get_cookies();
            let value = "";
            if (cookies) {
                for (let i = 0; i < cookies.length; i++) {
                    if (cookies[i].name == name) {
                        value = cookies[i]['value'];
                        break;
                    }
                }
            }
            return value;
        },
        set_cookie(name, value, day) {
            let expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + day);
            document.cookie = `${name}=${value};expires=${expireDate.toGMTString()};path=/`;
        },
        remove_cookie(name) {
            let cookies = this.get_cookies();
            if (cookies) {
                for (let i = 0; i < cookies.length; i++) {
                    if (cookies[i].name == name) {
                        this.set_cookie(name, null, -99);
                        break;
                    }
                }
            } else {
                return false;
            }
        }
    },
}