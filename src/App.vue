<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
/* 取消窗口滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>