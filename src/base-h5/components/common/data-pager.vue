<!--
 * @Author:
 * @Date: 2021-06-04
 * @Description: 数据分页
-->
<template>
  <div class="pagination-wrapper">
    <button class="btn_number pre" :disabled="preDisable" @click="goPre">
      <span>&#60;</span>
    </button> <!--上一页按钮-->
    <!--页码列表-->
    <ul>
      <li v-for="index in pages" :key="index"  ref="pages">
        <div class="btn_number" @click="jumpToPage(index)" v-if="isShowBtn(index)" :class="current===index?'active':''">{{index}}</div>
        <div v-else-if="isShowEllipsis (index)" class="ellipsis">&#8230;</div> <!--省略号-->
      </li>
    </ul>
    <button class="btn_number next" :disabled="nextDisable" @click="goNext">
      <span>&#62;</span>
    </button> <!--上一页按钮-->
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  props: {
    total: {
      type: Number,
      default: 200
    },
    // 每页显示数据pageSize
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      current: 1, // 定义当前页current
      pages: [], // 页码列表pages
      pageLength: 0 // 页码长度pageLength
    }
  },
  computed: {
    preDisable () { // 是否禁用上一页
      return current === 1
    },
    nextDisable () { // 是否禁用下一页
      return current === pageLength
    }
  },
  watch: {
    total (val) { // 监听数据总数total的改变在计算页码列表getPagesLength()
      getPagesLength()
    },
    current (val) { // 监听当前页current改变，向父组件传递参数当前页
      $emit('change', val)
    }
  },
  created () { // 初始化计算页码列表getPagesLength()
    getPagesLength()
  },
  methods: {
    getPagesLength () { // 计算页码列表
      pageLength = Math.ceil(total / pageSize)
      pages = new Array(pageLength)
      for (let i = 0; i < pageLength; i++) {
        pages[i] = i + 1
      }
    },
    jumpToPage (index) { // 点击页码
      current = index
    },
    goPre () { // 上一页
      current -= current === 1 ? 0 : 1
    },
    goNext () { // 下一页
      current += current === pageLength ? 0 : 1
    },
    isShowBtn (index) { // 页码是否被省略
      if (pageLength < 8) {
        return true
      } else {
        if (index === 1 || index === pageLength) {
          return true
        } else {
          if (current < 4 && index < 6) {
            return true
          } else if (current > pageLength - 4 && index > pageLength - 6) {
            return true
          } else if (index < current + 2 && index > current - 2) {
            return true
          } else {
            return false
          }
        }
      }
    },
    isShowEllipsis (index) { // 是否显示省略号
      return index === 2 || index === pageLength - 1
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrapper {
  margin: 0 auto;
  display: flex;
  justify-content: center;

  ul {
    display: flex;

    .active {
      background: #e69c41;
      color: #fff;
    }

    .ellipsis {
      font-weight: bold;
      color: #999;
      line-height: 24px;
    }
  }

  .btn_number {
    height: 0.16rem;
    line-height: 0.16rem;
    width: 0.16rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.05rem;
    border-radius: 0.03rem;
    border: solid 1px transparent;
    font-family: dinProRegular;
    color: #666666;
    background: #fff;
    overflow: hidden;
    user-select: none;

    &.pre,
    &.next {
      width: 0.24rem;
      border: 1px solid #d2d2d2;
      background: #ffffff;
      border-radius: 0.08rem;

      span {
        position: relative;
        top: -0.01rem;
      }
    }

    &.pre {
      margin-right: 0.2rem;
    }

    &.next {
      margin-left: 0.2rem;
    }

    &:disabled {
      border: solid 1px #ccc;
      color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>

