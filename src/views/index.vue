<template>
  <div>
    <div class="global-switch">
      <section>
        <i class="el-icon-switch-button"></i>
        <el-switch v-model="switchOn" @change="handleSwitch" />
      </section>
      <el-radio-group v-model="language" @change="handleLangChange">
        <el-radio-button label="en">En</el-radio-button>
        <el-radio-button label="zh">汉</el-radio-button>
      </el-radio-group>
    </div>
    <Table v-if="switchOn" />
  </div>
</template>
<script>
import Table from "./table";
export default {
  components: {
    Table,
  },
  data() {
    return {
      switchOn: false,
      proxy_routes: [],
      language: "en",
    };
  },
  methods: {
    // 国际化
    handleLangChange(name) {
      this.$i18n.locale = name;
    },
    handleSwitch(bool) {
      // 发送给background.js
      chrome.runtime.sendMessage(chrome.runtime.id, {
        type: "__ajax_proxy",
        to: "background",
        key: "globalSwitchOn",
        value: bool,
      });
      chrome.storage && chrome.storage.local.set({ globalSwitchOn: bool });
    },
    initData() {
      chrome.storage &&
        chrome.storage.local.get("globalSwitchOn", (result) => {
          if (result.hasOwnProperty("globalSwitchOn"))
            this.switchOn = result.globalSwitchOn;
        });
    },
  },
  created() {
    this.initData();
  },
};
</script>
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.global-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 0 15px;
  section {
    display: flex;
    align-items: center;
    i {
      font-size: 20px;
      font-weight: bold;
      color: #e84749;
      margin-right: 10px;
    }
  }
}
</style>