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
        <a-form-item label="项目编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="!!model.id"
            placeholder="请输入项目编码"
            v-decorator="['projectCode',{rules:[ruleWithDefault('请输入项目编码')]}]"
          />
        </a-form-item>
        <a-form-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入项目名称"
            v-decorator="['projectName',{rules:[ruleWithDefault('请输入项目名称')]}]"
          />
        </a-form-item>
        <a-form-item label="项目分组" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag
            v-decorator="['projectGroupCode',{rules:[ruleWithDefault('请选择项目分组')]}]"
            placeholder="请选择项目分组"
            :triggerChange="true"
            dictCode="project_group"
          />
          <!-- <a-input
            placeholder="请输入项目分组代号"
            v-decorator="['projectGroupCode', validatorRules.projectName]"
          />-->
        </a-form-item>

        <a-form-item label="客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['customerId',{rules:[ruleWithDefault('请选择客户')]}]"
            placeholder="请选择客户"
            :filterOption="false"
            :showSearch="true"
            @search="fetchCustomerList"
            @change="handleChange"
            :notFoundContent="fetching ? undefined : null"
            :disabled="!!model.id"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="customer in FormFieldOptions.customers"
              :key="customer.id"
            >{{customer.customerName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="项目经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入项目经理"
            v-decorator="[
              'projectManagerName',
              {rules: [ruleWithDefault('请输入项目经理')]}
            ]"
          />
        </a-form-item>

        <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入联系电话"
            v-decorator="[
              'contactNumber',
              {rules: [ruleWithDefault('请输入联系电话'),ruleWith('phone')]}
            ]"
          />
        </a-form-item>
        <a-form-item label="项目描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea placeholder="请输入项目描述" :rows="4" v-decorator="[ 'projectDescription']" />
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
import debounce from 'lodash/debounce'
import moment from 'moment'
import Vue from 'vue'
// 引入搜索部门弹出框的组件
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAction } from '@/api/manage'
import { disabledAuthFilter } from '@/utils/authFilter'
import { createProject, updateProject, getCompanies } from '@/api/api'

import FormFieldMixin from '@/mixins/FormFieldMixin'
import ValidationMixin from '@/mixins/ValidationMixin'
export default {
  name: 'projectModal',
  mixins: [FormFieldMixin, ValidationMixin],
  data() {
    this.fetchCustomerList = debounce(this.fetchCustomerList, 800)
    return {
      FieldsSet: {
        vendors: {
          key: 'customers',
          funcName: 'GetCustomers'
        }
      },
      companies: [],
      companyId: '',
      fetching: false,
      modalWidth: 800,
      drawerWidth: 700,
      modaltoggleFlag: true,
      confirmDirty: false,
      disableSubmit: false,
      dateFormat: 'YYYY-MM-DD',
      validatorRules: {
        projectName: {
          rules: [
            {
              required: true,
              message: '请输入项目名称!'
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
    fetchCustomerList(word) {
      this.request({
        ...this.FieldsSet.customers,
        params: {
          customerName: word ? `*${word}*` : ''
        }
      })
    },
    handleChange() {},
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
      this.edit({})
    },
    edit(record = {}) {
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      let that = this
      that.form.resetFields()
      that.visible = true
      that.model = Object.assign({}, record)
      that.$nextTick(() => {
        that.form.setFieldsValue(
          pick(
            this.model,
            // 'companyId',
            'contactNumber',
            'customerId',
            'id',
            'projectCode',
            'projectDescription',
            'projectGroupCode',
            'projectManagerName',
            'projectName'
          )
        )
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
          let formData = {
            ...values
          }
          let obj
          if (!this.model.id) {
            obj = createProject(formData)
          } else {
            formData.id = this.model.id
            obj = updateProject(formData)
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