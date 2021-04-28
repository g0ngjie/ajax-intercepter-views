<template>
  <div class="request-container">
    <el-button type="primary" @click="handleCreate">{{
      $t("create")
    }}</el-button>

    <Modal ref="modal" @putData="putData" @editData="editData" />

    <!-- 表格 -->
    <el-table :data="tableData" stripe style="margin-top: 20px">
      <el-table-column :label="$t('table.columns.switch')" width="100">
        <template slot-scope="{ row }">
          <el-switch v-model="row.switchOn" @change="handleSwitch" />
        </template>
      </el-table-column>
      <el-table-column
        prop="match"
        :label="$t('table.columns.match')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="override"
        :label="$t('table.columns.res')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        :label="$t('table.columns.remark')"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('table.columns.tag')"
        :formatter="fmtTag"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        :label="$t('table.columns.hit')"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-tag
            type="info"
            v-if="row.hit"
            closable
            @close="handleTagClose(row)"
          >
            {{ row.hit }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.columns.options')"
        align="center"
        width="150"
      >
        <template slot-scope="{ row }">
          <el-button @click="handleEdit(row)" plain>{{
            $t("table.btn.edit")
          }}</el-button>
          <el-button type="danger" @click="handleDel(row)" plain>{{
            $t("table.btn.del")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Modal from "./modal";
import { confirmFunc } from "@/common/index";
import { arrayToObject, deepClone, typeIs } from "@alrale/common-lib";
import { getRoutes, getTags, setRoutes } from "@/common/store";
import { noticeRoutes, noticeBadge } from "@/common/notice";

export default {
  components: {
    Modal,
  },
  data() {
    return {
      searchForm: {},
      tableData: [],
      // tag ORM
      tagMapping: {},
    };
  },
  methods: {
    // 删除hit
    handleTagClose(row) {
      delete row.hit;
      setRoutes(this.tableData);
      noticeBadge();
      this.initList();
    },
    // 父级刷新 tags
    initTags() {
      this.$refs.tag.initList();
    },
    // 获取tag名称
    fmtTag({ tagId }) {
      const map = this.tagMapping;
      if (typeIs(map) === "object" && tagId) {
        // 可能存在tag被删除找不到name
        return map[tagId]?.name;
      }
    },
    handleSearch() {
      const { match, remark } = this.searchForm;
      if (!match && !remark) {
        this.initList();
        return;
      }
      const newList = [];
      if (match) {
        this.tableData.forEach((item) => {
          if (item.match && item.match.includes(match)) newList.push(item);
        });
      }
      if (remark) {
        this.tableData.forEach((item) => {
          if (item.remark && item.remark.includes(remark)) newList.push(item);
        });
      }
      if (newList.length > 0) this.initList(newList);
      else this.initList();
    },
    handleReset() {
      this.searchForm = {};
      this.initList();
    },
    handleCreate() {
      this.$refs.modal.open();
    },
    handleEdit(row) {
      const newRow = deepClone(row);
      this.$refs.modal.open(newRow);
    },
    handleSwitch() {
      this.modifyNotice(this.tableData);
    },
    async handleDel({ id }) {
      const { ok } = await confirmFunc({ message: this.$t("confirMsg") });
      if (ok) {
        const newList = [];
        this.tableData.forEach((item) => {
          if (item.id != id) newList.push(item);
        });
        this.tableData = newList;
        this.modifyNotice(newList);
      }
    },
    putData(row) {
      this.tableData.push(row);
      this.modifyNotice(this.tableData);
    },
    async editData(row) {
      const routes = await getRoutes();
      const newList = [];
      routes.forEach((item) => {
        if (item.id == row.id) newList.push(row);
        else newList.push(item);
      });
      this.tableData = newList;
      this.modifyNotice(newList);
      this.initList(newList);
    },
    // 通知
    modifyNotice(proxy_routes) {
      setRoutes(proxy_routes);
      noticeRoutes(proxy_routes);
    },
    async initList(tables) {
      // tag search 级联
      if (!tables) this.searchForm = {};
      const tags = await getTags();
      this.tagMapping = arrayToObject("id", tags);
      const routes = tables || (await getRoutes());
      if (typeIs(tags) === "array") {
        if (tags.length === 0) {
          this.tableData = routes;
          return;
        } else {
          // 如果不为启用状态，展示全部
          const emptyHits = [];
          for (let k = 0; k < tags.length; k++) {
            const { used } = tags[k];
            if (used) emptyHits.push(used);
          }
          if (emptyHits.length === 0) {
            this.tableData = routes;
            return;
          }
        }
        // 过滤 tag
        const newTables = [];
        for (let i = 0; i < routes.length; i++) {
          const routeData = routes[i];
          for (let j = 0; j < tags.length; j++) {
            const { used, id } = tags[j];
            if (used && routeData.tagId === id) {
              newTables.push(routeData);
              break;
            }
          }
        }
        this.tableData = newTables;
      } else this.tableData = routes;
    },
    // 监听 准备刷新
    listenerFix() {
      chrome.runtime &&
        chrome.runtime.onMessage.addListener(({ type, to }) => {
          if (type === "__ajax_proxy" && to === "page") this.initList();
        });
    },
  },
  mounted() {
    this.initList();
    this.listenerFix();
  },
};
</script>

<style lang="scss" scoped>
.request-container {
  padding: 0 10px;
}
</style>
