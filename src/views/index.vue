<template>
  <div class="app-container">
    <div class="global-switch">
      <section>
        <i class="el-icon-switch-button"></i>
        <el-switch v-model="switchOn" @change="handleSwitch" />
      </section>
      <section>
        <section v-if="switchOn">
          <el-button
            style="margin-right: 10px"
            type="info"
            round
            plain
            @click="handleDownload"
            >{{ $t("toolbar.backup") }}</el-button
          >
          <el-upload
            action
            :auto-upload="false"
            :on-change="handleUpload"
            :show-file-list="false"
            style="margin-right: 20px"
          >
            <el-button type="info" round>{{ $t("toolbar.restore") }}</el-button>
          </el-upload>
        </section>
        <el-radio-group v-model="language" @change="handleLangChange">
          <el-radio-button label="en">En</el-radio-button>
          <el-radio-button label="zh">汉</el-radio-button>
        </el-radio-group>
      </section>
    </div>
    <transition name="fade" mode="out-in">
      <Table v-if="switchOn" ref="table" />
      <div v-else class="closed-container">
        <i class="el-icon-close-notification"></i>
      </div>
    </transition>
  </div>
</template>
<script>
import Table from "./table";
import {
  getLang,
  setLang,
  setGlobalSwitchOn,
  getGlobalSwitchOn,
  getRoutes,
  setRoutes,
} from "@/common/store";
import { noticeSwitchOn } from "@/common/notice";
import { confirmFunc, simpleDownload } from "@/common";
import { typeIs } from "@alrale/common-lib";
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
    // 下载
    async handleDownload() {
      const jsonArr = await getRoutes();
      if (typeIs(jsonArr) !== "array") return;
      if (jsonArr.length === 0)
        return this.$message.warning(this.$t("toolbar.no_down_data"));
      simpleDownload(JSON.stringify(jsonArr, null, "\t"), "backup.json");
    },
    // 上传
    handleUpload(file) {
      let reader = new FileReader();
      const { override_data, import_empty, read_err } = this.$t("toolbar");
      reader.onload = async (e) => {
        try {
          let _json = JSON.parse(e.target.result);
          const routes = await getRoutes();
          if (!_json) return;
          if (routes.length > 0) {
            // 如果存在
            const { ok } = await confirmFunc({
              message: override_data,
            });
            if (ok) {
              if (typeIs(_json) === "array" && _json.length > 0) {
                setRoutes(_json);
                this.$refs.table.initList();
              } else this.$message.warning(import_empty);
            }
          }
        } catch (err) {
          this.$message.error(read_err);
        }
      };
      reader.readAsText(file.raw);
    },
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
.app-container {
  width: 100%;
  height: 100%;
  // 过渡动画
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.1s;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
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
  .closed-container {
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 50px;
      color: #666;
    }
  }
}
</style>