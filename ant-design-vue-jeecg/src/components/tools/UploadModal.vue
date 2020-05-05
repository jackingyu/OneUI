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
      :multiple="true"
      :action="uploadAction"
      :headers="tokenHeader"
      :showUploadList="true"
      :fileList="fileList"
      :data="params"
      :beforeUpload="beforeUpload"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">点击或拖拽文件到这里进行上传</p>
      <!-- <p class="ant-upload-hint">只能上传单个文件</p> -->
    </a-upload-dragger>

    <template slot="footer">
      <a-button @click="handleClose">关闭</a-button>
      <a-button
        type="primary"
        @click="handleImport"
        :disabled="fileList.length !== 1"
        :loading="uploading"
      >{{ uploading ? '上传中...' : '开始上传' }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { DOMAIN } from '@/config/api-mapper.js'
import { postAction } from '@/api/manage'
export default {
  name: 'UploadModal',
  mixins: [JeecgListMixin],
  props: {
    fileScope: {
      type: String,
      default: ''
    }
  },
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
          fileType: this.fileScope
        }
      }
      return null
    },
    show() {
      this.fileList = []
      this.uploading = false
      this.visible = true
      window.thiz = this
    },
    beforeUpload(file) {
      // this.fileList = [...this.fileList, file]
      this.fileList = [file]
      // var fileType = file.type
      // if (fileType === 'image') {
      //   if (fileType.indexOf('image') < 0) {
      //     this.$message.warning('请上传图片')
      //     return false
      //   }
      // } else if (fileType === 'file') {
      //   if (fileType.indexOf('image') >= 0) {
      //     this.$message.warning('请上传文件')
      //     return false
      //   }
      // }
      return false
    },
    handleImport() {
      const { fileList } = this
      if (fileList.length != 1) {
        return
      }
      const formData = new FormData()
      // fileList.forEach(file => {
      //   formData.append('files[]', file)
      // })
      formData.append('file', fileList[0])
      formData.append('fileType', this.fileScope)
      this.uploading = true
      postAction(this.uploadAction, formData).then(res => {
        this.uploading = false
        if (res.success) {
          let { id, url, fileName } = res.result
          let result = {
            id,
            url,
            fileName
          }
          console.log(result)
          this.$emit('uploadComplete', result)
          this.$message.success(res.message)
          this.visible = false
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          let { id, url, fileName } = info.file.response.result
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