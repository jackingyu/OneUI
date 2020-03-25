<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
  >
    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span
          style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right"
        >
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="物料名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入物料名称"
            v-decorator="['materialName', validatorRules.materialName]"
          />
        </a-form-item>
        <a-form-item label="物料代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="!!model.id"
            placeholder="请输入物料代码"
            v-decorator="['materialCode', validatorRules.materialCode]"
          />
        </a-form-item>

        <template v-if="!model.id"></template>

        <a-form-item label="物料组" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag
            v-decorator="['materialGroupCode']"
            :triggerChange="true"
            placeholder="请选择物料组"
            :type="'select'"
            dictCode="material_group"
          />
        </a-form-item>

        <a-form-item label="物料描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            placeholder="请输入物料描述"
            :rows="4"
            v-decorator="[ 'materialDescription']"
          />
        </a-form-item>

        <a-form-item label="一次性物料" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag
            v-decorator="['oneTimeFlag']"
            placeholder
            :type="'radio'"
            :triggerChange="true"
            :disabled="!!model.id"
            dictCode="material_property"
          />
        </a-form-item>
      </a-form>
    </a-spin>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
// 引入搜索部门弹出框的组件
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAction } from '@/api/manage'
import { disabledAuthFilter } from '@/utils/authFilter'
import { createMaterial, updateMaterial, frozenBatch } from '@/api/api'
export default {
  name: 'projectModal',
  data() {
    return {
      materialGroups: [],
      modalWidth: 800,
      drawerWidth: 700,
      modaltoggleFlag: true,
      confirmDirty: false,
      disableSubmit: false,
      dateFormat: 'YYYY-MM-DD',
      validatorRules: {
        materialName: {
          rules: [
            {
              required: true,
              message: '请输入物料名称!'
            },
            {
              validator: void 0
            }
          ]
        },
        materialCode: {
          rules: [
            {
              required: true,
              message: '请输入物料名称!'
            }
          ]
        },
        roles: {}
        //  sex:{initialValue:((!this.model.sex)?"": (this.model.sex+""))}
      },
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      headers: {},
      form: this.$form.createForm(this),
      picUrl: ''
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },
  methods: {
    isDisabledAuth(code) {
      return disabledAuthFilter(code)
    },
    //窗口最大化切换
    toggleScreen() {
      if (this.modaltoggleFlag) {
        this.modalWidth = window.innerWidth
      } else {
        this.modalWidth = 800
      }
      this.modaltoggleFlag = !this.modaltoggleFlag
    },
    add() {
      this.picUrl = ''
      this.edit({ oneTimeFlag: '0' })
    },
    edit(record) {
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      let that = this
      that.form.resetFields()
      that.visible = true
      that.model = Object.assign({}, record)
      that.$nextTick(() => {
        that.form.setFieldsValue(pick(this.model, 'materialName', 'materialCode', 'materialDescription'))
        that.form.setFieldsValue({
          materialGroupCode: isNaN(this.model.materialGroupCode)
            ? this.model.materialGroupCode
            : '' + this.model.materialGroupCode
        })
        that.form.setFieldsValue({
          oneTimeFlag: isNaN(this.model.oneTimeFlag) ? this.model.oneTimeFlag : '' + this.model.oneTimeFlag
        })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
    },
    moment,
    handleSubmit() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('-😪--values---', values)
          let formData = {
            materialCode: values.materialCode,
            materialDescription: values.materialDescription,
            materialGroupCode: values.materialGroupCode,
            materialName: values.materialName,
            oneTimeFlag: values.oneTimeFlag
          }
          let obj
          if (!this.model.id) {
            obj = createMaterial(formData)
          } else {
            formData.id = this.model.id
            obj = updateMaterial(formData)
          }
          obj
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    }
  }
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>