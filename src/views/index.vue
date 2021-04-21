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
import {
  getLang,
  setLang,
  setGlobalSwitchOn,
  getGlobalSwitchOn,
} from "@/common/store";
import { noticeSwitchOn } from "@/common/notice";
export default {
  components: {
    Table,
  },
  data() {
    return {
      switchOn: false,
      language: "en",
    };
  },
  methods: {
    // 国际化
    handleLangChange(name) {
      this.$i18n.locale = name;
      setLang(name);
      this.syncDocTitle();
    },
    handleSwitch(bool) {
      // 同步
      noticeSwitchOn(bool);
      // 数据处理
      setGlobalSwitchOn(bool);
    },
    // 同步标题
    syncDocTitle() {
      document.title = this.$t("document.title");
    },
    async initData() {
      // 获取 开关状态
      this.switchOn = await getGlobalSwitchOn();
      // 初始化国际化
      const lang = await getLang();
      this.language = lang;
      this.$i18n.locale = lang;
      this.syncDocTitle();
    },
  },
  created() {
    this.initData();
  },
};
</script>
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