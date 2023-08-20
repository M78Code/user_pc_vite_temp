### .doc.json说明 

##### 参数关键词说明
> **definition**	属性
> **params**		参数		
> **scope**		范围		(slots插槽使用)
> **returns** 返回值

##### 配置说明
```
具体参考QTable.doc.json

{
  "leftmenu": {
    "project": 1, // 所属项目   1: 亚洲版 H5（旧版） 2:亚洲版 PC（旧版）  3:亚洲版 H5（新版） 4:亚洲版 PC（新版）
  },
  "meta": {
    "docsUrl": "https://v2.quasar.dev/vue-components/table"
  },
  "props": {              // 大分类（必填）  示例：props / slots / events / methods / computedProps
    "columns": {          // 字段（必填）
      "type": "Array",    // 类型（必填）   示例：[ "String", "Object" ]  
      "desc": "The column definitions (Array of Objects)",  // 描述（必填）
      "examples": [ "desc" ],  // 示例/例子     示例： [ "row-key=\"name\"", ":row-key=\"row => row.name\"" ]
      "category": "column", // 分类（必填）    "column|content"
      "default": "horizontal",   // 默认值
      "values": [ "ad", "da" ],  // 接受的值
      "params": {           // type==Function 函数参数  (rows, sortBy, descending) => Array
        "rows": {               // 参数值
          "type": "Array",           
          "desc": "Array with rows"  
        },
        "sortBy": {                         // 参数值   
          "type": "String",                 // type==Function  参数类型
          "desc": "Column name (from column definition)",   // type==Function  参数说明
          "examples": [ "calories" ]   // type==Function  参数示例
        },
        "descending": {
          "type": "Boolean",
          "desc": "Is sorting in descending order?"
        }
      },
      "returns": {          // type==Function 函数返回值
        "type": "Array",       // type==Function 函数返回值-类型
        "desc": "Sorted rows"  // type==Function 函数返回值-说明
      },
  
      "definition": {         // 属性
        "name": {
          "type": "String",     // 类型
          "required": true,     // 表示必填 - required!
          "desc": "Unique id, identifies column, (used by pagination.sortBy, 'body-cell-[name]' slot, ...)",            // 说明
          "examples": [ "desc" ]   // 例子
        },
        "field": {
          "type": [ "String", "Function" ],
          "required": true,
          "desc": "Row Object property to determine value for this column or function which maps to the required property",
          "params": {                                                   // type==Function 函数参数                
            "row": {                                                    // 参数值
              "type": "Object",                                         // 类型
              "required": true,                                         // 是否必填
              "desc": "The current row being processed",                // 说明
              "examples": [ "{ name: 'Lorem Ipsum', prices: { active: 19, old: 25, list: 29 } }" ]   // 例子
            }
          },
          "returns": {                                                  // type==Function 函数返回值   
            "type": "Any",                                              // 类型
            "desc": "Value for this column",                            // 说明
            "examples": [ "19" ]                                        // 例子
          },
          "examples": [ "name", "row => row.prices.active" ]            // 例子
        },
        "required": {
          "type": "Boolean",
          "desc": "If we use visible-columns, this col will always be visible"
        },
        "align": {
          "type": "String",
          "desc": "Horizontal alignment of cells in this column",
          "values": [ "left", "right", "center" ],   // 接受的值
          "default": "right"        // 默认值
        },
        "sortable": {
          "type": "Boolean",
          "desc": "Tell QTable you want this column sortable",
          "default": false
        },
        "sort": {
          "type": "Function",           
          "desc": "Compare function if you have some custom data or want a specific way to compare two rows",
          "examples": ["(a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10)"],
          "params": {
            "a": {
              "type": "Any",
              "required": true,
              "desc": "Value of the first comparison term",
              "examples": [ 123, "abc" ]
            },
            "b": {
              "type": "Any",
              "required": true,
              "desc": "Value of the second comparison term",
              "examples": [ 123, "abc" ]
            },
            "rowA": {
              "type": "Object",
              "required": true,
              "desc": "Full Row object in which is contained the first term",
              "examples": [ "{ name: 'Potassium', value: 'K' }" ]
            },
            "rowB": {
              "type": "Object",
              "required": true,
              "desc": "Full Row object in which is contained the second term",
              "examples": [ "{ name: 'Fluorine', value: 'F' }" ]
            }
          },
          "returns": {
            "type": "Number",
            "desc": "Comparison result of term 'a' with term 'b'. Less than 0 when 'a' should come first; greater than 0 if 'b' should come first; equal to 0 if their position must not be changed with respect to each other",
            "examples": [ "-1", "0", "1" ]
          }
        },
        "sortOrder": {
          "type": "String",
          "desc": "Set column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending); Overrides the 'column-sort-order' prop",
          "values": [ "ad", "da" ],
          "default": "ad"
        },
        "format": {
          "type": "Function",
          "desc": "Function you can apply to format your data",
          "examples": [ "(val, row) => `${val}%`", "val => val ? /* Unicode checkmark checked */ '\u2611' : /* Unicode checkmark unchecked */ '\u2610'" ],
          "params": {
            "val": {
              "type": "Any",
              "required": true,
              "desc": "Value of the cell",
              "examples": [ 123, "abc" ]
            },
            "row": {
              "type": "Object",
              "required": true,
              "desc": "Full Row object in which the cell is contained",
              "examples": [ "{ name: 'Potassium', value: 'K' }" ]
            }
          },
          "returns": {
            "type": "Any",
            "desc": "The resulting formatted value",
            "examples": [ "20%" ]
          }
        },
        "style": {
          "type": [ "String", "Function" ],
          "desc": "Style to apply on normal cells of the column",
          "params": {
            "row": {
              "type": "Object",
              "required": true,
              "desc": "The current row being processed",
              "examples": [ "{ name: 'Frozen Yogurt', calories: 159 }" ]
            }
          },
          "returns": {
            "type": "String",
            "exemption": [ "desc" ]  // 示例
          },
          "examples": [
            "'width: 500px'",
            "row => (row.calories % 2 === 0 ? 'width: 10px' : 'font-size: 2em; font-weight: bold')"
          ]
        },
        "classes": {
          "type": [ "String", "Function" ],
          "desc": "Classes to add on normal cells of the column",
          "params": {
            "row": {
              "type": "Object",
              "required": true,
              "desc": "The current row being processed",
              "examples": [ "{ name: 'Frozen Yogurt', calories: 159 }" ]
            }
          },
          "returns": {
            "type": "String",
            "exemption": [ "desc" ]  // 示例
          },
          "examples": [
            "'my-special-class bg-primary'",
            "row => (row.calories % 2 === 0 ? 'bg-green text-white' : 'bg-yellow')"
          ]
        },
        "headerStyle": {
          "type": "String",
          "desc": "Style to apply on header cells of the column",
          "examples": [ "width: 500px" ]
        },
        "headerClasses": {
          "type": "String",
          "desc": "Classes to add on header cells of the column",
          "examples": [ "my-special-class" ]
        }
      }
    }
  },
  "slots": {

  },
  "events": {

  }
}

```










