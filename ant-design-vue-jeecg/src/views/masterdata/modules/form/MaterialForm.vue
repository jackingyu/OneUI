<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form" >
      <a-form-item label="物料名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input placeholder="请输入物料名称" v-decorator="['materialName', validatorRules.materialName]" />
      </a-form-item>
      <a-form-item label="物料代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          :disabled="!!model.id"
          placeholder="请输入物料代码"
          v-decorator="['materialCode', validatorRules.materialCode]"
        />
      </a-form-item>

      <a-form-item label="物料组" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <j-dict-select-tag
          v-decorator="['materialGroupCode',validatorRules.materialGroupCode]"
          :triggerChange="true"
          placeholder="请选择物料组"
          :type="'select'"
          dictCode="material_group"
        />
      </a-form-item>

      <a-form-item label="物料描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea placeholder="请输入物料描述" :rows="4" v-decorator="[ 'materialDescription']" />
      </a-form-item>

      <a-form-item label="一次性物料" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <j-dict-select-tag
          v-decorator="['oneTimeFlag', {}]"
          placeholder
          :type="'radio'"
          :triggerChange="true"
          :disabled="!!model.id"
          dictCode="material_property"
        />
      </a-form-item>

      <a-form-item :wrapperCol="submitCol">
        <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
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
  name: 'CustomerForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
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
              message: '请输入物料代码!'
            }
          ]
        },
        materialGroupCode: {
          rules: [
            {
              required: true,
              message: '请选择物料组!'
            }
          ]
        }
      },
      title: '操作',
      visible: false,
      model: {},
      submitCol: {
        xs: { span: 24 },
        sm: { span: 5, offset: 5 }
      },
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
  methods: {
    add() {
      this.picUrl = ''
      this.edit({ oneTimeFlag: '0' })
    },
    edit(record) {
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
    }
  }
}
</script>

<style scoped>
</style>