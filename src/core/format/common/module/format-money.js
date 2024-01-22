
/**
 * @description: 用户金额格式化
 * @param {Number} value 用户金额
 * @param {Number} min 最小值
 * @return {Object} 
 */
export const amount_format = (value, min) => {
  let param = {};
  min = min || 100000;
  let k = 10000, sizes = ['', i18n_t("bet.wan"), i18n_t("bet.wanwan"), i18n_t("bet.wanyi")], i;
  if (value < min) {
    param.value = value;
    param.unit = '';
  } else {
    i = Math.floor(Math.log(value) / Math.log(k));
    param.value = ((value / Math.pow(k, i))).toFixed(3).slice(0, -1);
    param.unit = sizes[i];
  }
  return {
    value: param.value + '',
    unit: param.unit
  };
}




/**
 *@description 将金额转化为千位符格式保留2位小数
 *@param {Number} num 待格式化的金额
 *@return {String} 转化后的金额 比如 '64,464.95'
 */
export const format_money2 = function (num) {
  try {
    if (num && num < 0) {
      num = 0;
    }
    num = (num || 0).toString();
    let result = "";
    let [num1, num2 = "00"] = num.split(".");
    num2 = num2.padEnd(2, "0").slice(0,2);;
    while (num1.length > 3) {
      result = "," + num1.slice(-3) + result;
      num1 = num1.slice(0, num1.length - 3);
    }
    if (num1) {
      num1 = num1 + result;
    }
    return num1 + "." + num2;
  } catch (error) {
    console.error(error);
    return "";
  }
};
/**
 *@description 将金额转化为千位符格式 保留整数
 *@param {Number} num 待格式化的金额
 *@return {String} 转化后的金额 比如 '64,464'
 */
 export const format_money = function (num) {
  try {
    if (num && num < 0) {
      num = 0;
    }
    num = (num || 0).toString();
    let result = "";
    let [num1, num2 = ""] = num.split(".");
    // num2 = num2.padEnd(2, "0");
    while (num1.length > 3) {
      result = "," + num1.slice(-3) + result;
      num1 = num1.slice(0, num1.length - 3);
    }
    if (num1) {
      num1 = num1 + result;
    }
    return num1;
  } catch (error) {
    console.error(error);
    return "";
  }
};
/**
 *@description 将金额转化为千位符格式 小数位不做处理
 *@param {Number} num 待格式化的金额
 *@return {String} 转化后的金额 比如 '64,464.95' '1,005'
 */
export const format_money3 = function (num) {
  try {
    num = (num || 0).toString();
    let result = "";
    let [num1, num2] = num.split(".");
    num2 = num2 || "";
    while (num1.length > 3) {
      result = "," + num1.slice(-3) + result;
      num1 = num1.slice(0, num1.length - 3);
    }
    if (num1) {
      num1 = num1 + result;
    }
    if (num.includes(".")) {
      return num1 + "." + num2;
    } else {
      return num1;
    }
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const formatMoney = function (num,bit = 2){
    try {
        num = (num || 0).toString();
        let result = "";
        let [num1, num2 = "00"] = num.split(".");
        num2 = num2.padEnd(2, "0").slice(0,2);
        while (num1.length > 3) {
            result = "," + num1.slice(-3) + result;
            num1 = num1.slice(0, num1.length - 3);
        }
        if (!!num1) {
            num1 = num1 + result;
        }
        let str = num.includes(".") ? num1 + "." + num2 : num1
        if(str == 0){
          str = '0.00'
        }
        return str
    } catch (error) {
        console.error(error);
        return "";
    }
}

/**
 * javascript number.toFixed() 方法会丢失精度
 * 解决数字保留两位 丢失精度问题
* */
export const numberRetain = function (formatNumber,bit = 2){
    if(!formatNumber.toString().includes('.')) return formatNumber
    let [integerPart, decimalPart = ''] = formatNumber.toString().split('.')
    decimalPart = decimalPart.length ? decimalPart.slice(0,bit) : ''
    return integerPart + '.' + decimalPart
}





const money_filter = function (num) {
  return num.toString().indexOf(".") !== -1
    ? num.toLocaleString()
    : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
};

/**
 * @description: 数字转中文
 * @param {Integer} number 形如123的数字
 * @return {String} 返回转换成的形如 一百二十三 的字符串
 */
export const numberToChinese = (number) => {
  // // 单位 字符
  let t = { units: "个十百千万@#%亿^&~", chars: "零一二三四五六七八九" };
  let a = (number + "").split(""),
    s = [];
  if (a.length > 12) {
    throw new Error("too big");
  } else {
    for (var i = 0, j = a.length - 1; i <= j; i++) {
      if (j == 1 || j == 5 || j == 9) {
        //两位数 处理特殊的 1*
        if (i == 0) {
          if (a[i] != "1") s.push(t.chars.charAt(a[i]));
        } else {
          s.push(t.chars.charAt(a[i]));
        }
      } else {
        s.push(t.chars.charAt(a[i]));
      }
      if (i != j) {
        s.push(t.units.charAt(j - i));
      }
    }
  }
  //return s;
  return s
    .join("")
    .replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {
      //优先处理 零百 零千 等
      b = t.units.indexOf(d);
      if (b != -1) {
        if (d == "亿") return d;
        if (d == "万") return d;
        if (a[j - b] == "0") return "零";
      }
      return "";
    })
    .replace(/零+/g, "零")
    .replace(/零([万亿])/g, function (m, b) {
      // 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
      return b;
    })
    .replace(/亿[万千百]/g, "亿")
    .replace(/[零]$/, "")
    .replace(/[@#%^&~]/g, function (m) {
      return {
        "@": "十",
        "#": "百",
        "%": "千",
        "^": "十",
        "&": "百",
        "~": "千",
      }[m];
    })
    .replace(/([亿万])([一-九])/g, function (m, d, b, c) {
      c = t.units.indexOf(d);
      if (c != -1) {
        if (a[j - c] == "0") return d + "零" + b;
      }
      return m;
    });
};

/**
 * 金额格式设置
 */
export const format_balance = (num) => {
  if (num) {
    let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/);
    // 保留两位小数
    let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00";
    let _num = _split[1] + "." + decimal;
    return _num.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  return "0.00";
};

/**
 * 提前结算按钮金额格式设置
 */
export const format_btn_balance = (num) => {
  if (num) {
    let _num = Number(num).toFixed(2);
    return _num.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  return "0.00";
};

/**
 * @description: 四舍六入五成双
 * @param {Number} num 金额
 * @param {Number} digit
 * @return {Number} 转换后的金额
 */
export const four_five_six_double = (num, digit = 2) => {
  var ratio = Math.pow(10, digit),
    _num = num * ratio,
    mod = _num % 1,
    integer = Math.floor(_num);

  if (mod > 0.5) {
    return ((integer + 1) / ratio).toFixed(2);
  } else if (mod < 0.5) {
    return (integer / ratio).toFixed(2);
  } else {
    return ((integer % 2 === 0 ? integer : integer + 1) / ratio).toFixed(2);
  }
};


/**
 * @Description:格式化字符串 小于10的数字 前面补0
 * @param {string} str 格式化前的字符串
 * @return {string} 格式化后的字符串
 */
export const format_str = (str) => {
  return str < 10 ? "0" + str : str;
}