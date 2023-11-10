<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-all-detele">
    <div class="del-info">
      <div class="del-info-icon">删</div>
      <div class="del-info-name">Detele All</div>
    </div>
    <div class="del-info">
      <div class="dropdown">
        <button class="dropbtn">Betting Type</button>
        <div class="dropdown-content">
          <a href="#" :class="type==1?'dropdown-content-che':''">Betting Type</a>
          <a href="#" :class="type==2?'dropdown-content-che':''">Multi Singles</a>
          <a href="#" :class="type==3?'dropdown-content-che':''" @click.stop="set_is_bet_single">System</a>
        </div>
      </div>

      <div class="del-info-dui">√</div>
    </div>
  </div>
</template>
<script setup>
  const type = 1//1:Betting Type  2:  3:System
  // 单关 串关切换
  const set_is_bet_single = () =>{
    BetData.set_is_bet_single()
    useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
  }
</script>

<style lang="scss" scoped>

.dropdown {
  position: relative;
  display: inline-block;
}
 
.dropbtn {
  border: none;
  cursor: pointer;
  background: none;
}
 
.dropdown-content {
  display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    margin-left: -0.7rem;
    width: 1.45rem;
}
 
.dropdown-content a {
  color: var(--q-gb-t-c-18);
    text-decoration: none;
    display: block;
    margin: 0 0.2rem;
    padding: 0.1rem 0;
    border-bottom: 1px solid #999;
    font-size: 0.12rem;
}
.dropdown-content a:last-child {
  border-bottom: none;
}
 
.dropdown:hover .dropdown-content {
  display: block;
}
.dropdown-content-che{
  color: var(--q-gb-t-c-11) !important;
}

    .del-info-dui{
      color: var(--q-gb-t-c-14);
      width: 0.15rem;
      height: 0.15rem;
      background: var(--q-gb-t-c-11);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.1rem;
      border-radius: 50%;
      margin-left: 0.12rem;
    }
    .del-info-name{
      margin-left: 0.15rem;
      color: var(--q-gb-t-c-18);
    }
    .del-info-icon{
      color: var(--q-gb-t-c-18);
    }
    .del-info{
      display: flex;
      font-size: 0.13rem;
    }
    .bet-all-detele{
      display: flex;
      justify-content: space-between;
      padding: 0.15rem;
      background: var(--q-gb-t-c-6);
    }
</style>
