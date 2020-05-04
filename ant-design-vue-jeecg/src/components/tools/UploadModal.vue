<template>
  <a-modal
    title="上传附件"
    :width="600"
    :visible="visible"
    :confirmLoading="uploading"
    @cancel="handleClose"
  >
    <a-upload-dragger
      name="file"
      :multiple="false"
      :action="uploadAction"
      :headers="tokenHeader"
      :showUploadList="false"
      :data="params"
      :beforeUpload="beforeUpload"
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">点击或拖拽文件到这里进行上传</p>
      <p class="ant-upload-hint">只能上传单个文件</p>
    </a-upload-dragger>

    <template slot="footer">
      <a-button @click="handleClose">关闭</a-button>
      <a-button
        type="primary"
        @click="handleImport"
        :disabled="fileList.length === 0"
        :loading="uploading"
      >{{ uploading ? '上传中...' : '开始上传' }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { DOMAIN } from '@/config/api-mapper.js'
export default {
  name: 'UploadModal',
  mixins: [JeecgListMixin],
  data() {
    return {
      visible: false,
      uploading: false,
      fileList: [],
      url: {
        upload: '/oss/file/upload',
        list: 0
      }
    }
  },
  computed: {
    uploadAction() {
      return DOMAIN + this.url.upload
    }
  },
  methods: {
    handleClose() {
      this.visible = false
    },
    params(file) {
      if (file) {
        return {
          fileType: '10'
        }
      }
      return null
    },
    show() {
      this.fileList = []
      this.uploading = false
      this.visible = true
    },
    beforeUpload(file) {
      var fileType = file.type
      if (fileType === 'image') {
        if (fileType.indexOf('image') < 0) {
          this.$message.warning('请上传图片')
          return false
        }
      } else if (fileType === 'file') {
        if (fileType.indexOf('image') >= 0) {
          this.$message.warning('请上传文件')
          return false
        }
      }
      return true
    },
    handleImport() {},
    handleChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          debugger
          this.$message.success(`${info.file.name} 上传成功!`)
        } else {
          this.$message.error(`${info.file.name} 上传失败.`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    }
  }
}
</script>

<style scoped>
</style>