<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 默认跳转模板页面-后期扩展使用
-->
<template>
  <div class="main">
    <div class="left">
      <div class="tishi_t">未加密数据</div>
      <textarea id="left_val" cols="30" rows="10" v-model="left_val">

      </textarea>
    </div>
    <div class="centre">
      <div class="ctr">
        <div><span class="tishi">请输入秘钥:</span><input v-model="key"/></div>
        <div><button @click="jiami">加密 &gt;&gt;</button></div>
        <div><button @click="jiemi">&lt;&lt; 解密</button></div>
        <div class="err">{{err}}</div>
      </div>
    </div>
    <div class="right">
      <div class="tishi_t">加密数据</div>
      <textarea id="right_val" cols="30" rows="10" v-model="right_val"></textarea>
    </div>
  </div>
</template>

<script>
// import CryptoJS from "crypto-js";
export default {
  name: "ossJson",
  data() {
    return {
      key:'',
      left_val:'',
      right_val:'',
      err:'',
      const_list:['file_name','type','update_time']
    };
  },
  created () {
    this.key = 'panda1234_1234ob';
    let left = {
        "update_time": "2021-04-20 04:03:36",
        "update_by": "ob",
        "api": ["http://api.sportxxxw1box.com"]
    };
    this.left_val= JSON.stringify(left);
  },
  methods: {
    // 解密字符串
    jiemiStr(){
      const word = '';
      var key = CryptoJS.enc.Utf8.parse(this.key);
      var encrypt = CryptoJS.AES.encrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
      let ret= encrypt.toString();
    },
    // 加密字符串
    jiemiStr(){
      const word = '';
      var key = CryptoJS.enc.Utf8.parse(this.key);
      var encrypt = CryptoJS.AES.encrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
      let ret= encrypt.toString();
    },


    // 加密
    jiami(){
      console.log(this.left_val)
      try {
        let obj = JSON.parse(`${this.left_val}`);
        if(obj){
          this.get_oss_decrypt_obj(obj,1);
          this.right_val= JSON.stringify(obj);
        }
        this.err=''
      } catch (error) {
        console.error(error)
        this.err='转换异常'
      }
    },
    // 解密
    jiemi(){
      try {
        let obj = JSON.parse(`${this.right_val}`);
        if(obj){
          this.get_oss_decrypt_obj(obj);
          this.left_val=JSON.stringify(obj);
        }
        this.err=''
      } catch (error) {
        console.error(error)
        this.err='转换异常'
      }
    }
    ,
    /**
   * @description: 解密数组中的加密数据,并进行赋值操作(获取解密后的信息)
   * @param {*} obj
   * @return {*}
   */
  get_oss_decrypt_obj(obj, type=0) {
      if (_.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          // 解密数据,重新设置数据
          if(typeof(obj[i]) == 'string'){
            obj[i] = this.get_oss_decrypt_str(obj[i],type);
          } else {
            this.get_oss_decrypt_obj(obj[i],type)
          }
        }
      } else if (_.isObject(obj)) {
        for (const key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            // 解密数据,重新设置数据
            if(typeof(obj[key]) == 'string' && !this.const_list.includes(key)){
              obj[key] = this.get_oss_decrypt_str(obj[key],type);
            } else {
              this.get_oss_decrypt_obj(obj[key],type)
            }
          }
        }
      }
    },
    /**
   * @description: 字符串解密函数
   * @param {*} word 加密字符串
   * @return {*}  明码字符串
   */
   get_oss_decrypt_str(word, type) {
      let ret = "";
      console.error("word", word);
      var key = CryptoJS.enc.Utf8.parse(this.key);
      if (word) {
        try {
          if(type){
            // 加密
            var encrypt = CryptoJS.AES.encrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
            ret = encrypt.toString();
            console.log("转字符串-", ret);
            // 去除左右空格
            ret = ret.replace(/(^\s*)|(\s*$)/g, "");
            console.log("转字符串-", ret);
            // 删除结尾的/
            if (ret && ret[ret.length - 1] == "/") {
              ret = ret.substr(0, ret.length - 1);
            }
          } else {
            // 解密
            var decrypt = CryptoJS.AES.decrypt(
              word,
              key,
              { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
            );
            // 转字符串
            ret = CryptoJS.enc.Utf8.stringify(decrypt).toString();
            console.log("转字符串-", ret);
            // 去除左右空格
            ret = ret.replace(/(^\s*)|(\s*$)/g, "");
            console.log("转字符串-", ret);
            // 删除结尾的/
            if (ret && ret[ret.length - 1] == "/") {
              ret = ret.substr(0, ret.length - 1);
            }
          }
        } catch (error) {
          console.error("get_oss_decrypt_str:", error);
        }
      }
      if(!ret){
        ret=word;
      }
      return ret;
    }
  },
  
};
</script>
<style lang="scss" scoped>
textarea {
  width: 400px;
  height: 700px;
  padding: 10px;
  font-size: 16px;
}.tishi {
  display: inline-block;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}.err {
  color: red;
  text-align: center;
  font-size: 16px;
}
input {
  height: 30px;
  font-size: 16px;
}.ctr {
  margin: 300px 30px;
}.tishi_t {
  font-size: 16px;
}
button, .tishi {
  width: 100px;
  height: 30px;
}
button {
  width: 100%;
  margin: 10px 2px;
}.main {
  display: flex;
  margin-top: 60px;
}.left {
  flex: 1;
  text-align: right;
}.right {
  flex: 1;
}
</style>