<template>
  <div class="response-modal-container">
    <el-dialog
      :title="title"
      :visible.sync="isShow"
      :before-close="handleClose"
      top="1%"
      width="80%"
    >
      <el-form :model="form" ref="form">
        <!-- 域名 -->
        <el-form-item
          :label="$t('modal.form.domain.name')"
          :rules="[
            {
              required: true,
              trigger: 'change',
              message: $t('modal.form.domain.msg'),
            },
          ]"
          prop="domain"
        >
          <el-input
            v-model="form.domain"
            :placeholder="$t('modal.form.domain.placeholder')"
          ></el-input>
        </el-form-item>
        <!-- 重定向 -->
        <el-form-item
          :label="$t('modal.form.redirect.name')"
          :rules="[
            {
              required: true,
              trigger: 'change',
              message: $t('modal.form.redirect.msg'),
            },
          ]"
          prop="redirect"
        >
          <el-input
            v-model="form.redirect"
            :placeholder="$t('modal.form.redirect.placeholder')"
          ></el-input>
        </el-form-item>
        <!-- 请求头 -->
        <el-form-item :label="$t('modal.form.headers.name')">
          <el-input
            v-model="form.headers"
            :placeholder="$t('modal.form.placeholder')"
          >
          </el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('modal.form.remark.name')">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.remark"
            :placeholder="$t('modal.form.placeholder')"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("modal.btn.cancel") }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          $t("modal.btn.confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uniqueId } from "@alrale/common-lib";
import { getTags } from "@/common/store";

export default {
  data() {
    return {
      isShow: false,
      form: {},
      title: "",
      isEdit: false,
      tags: [],
    };
  },
  methods: {
    handleJsonSubmit(json) {
      this.form.override = JSON.stringify(json);
    },
    // 模态展示
    async open(row) {
      // 获取标签
      this.tags = await getTags();
      if (row) {
        this.isEdit = true;
        // 编辑
        this.title = this.$t("modal.title.edit");
      } else {
        this.isEdit = false;
        // 新增
        this.title = this.$t("modal.title.create");
      }
      this.isShow = true;
      this.form = row || { remark: "" };
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    // 模态关闭
    handleClose() {
      this.isShow = false;
    },
    // 表单提交
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) this.createData();
      });
    },
    createData() {
      if (this.isEdit) this.$emit("editData", this.form);
      else
        this.$emit("putData", { ...this.form, switchOn: true, id: uniqueId() });
      this.isShow = false;
    },
  },
};
</script>
