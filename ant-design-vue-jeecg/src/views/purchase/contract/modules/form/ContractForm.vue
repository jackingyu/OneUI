<template>
  <a-form :form="form" class="form">
    <a-card class="card" title="基础信息" :bordered="false">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item style="display:none">
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-form-item label="合同编号">
            <a-input
              placeholder="请输入合同编号"
              v-decorator="[
              'contractCode',
              {rules: [{ required: true, message: '请输入合同编号', whitespace: false}]}
            ]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="合同名称">
            <a-input
              placeholder="合同名称"
              v-decorator="[
              'contractTitle',
              {rules: [{ required: true, message: '请输入合同名称', whitespace: false}]}
            ]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="合同类型">
            <j-dict-select-tag
              v-decorator="[ 'contractTypeCode', {rules: [{ required: true, message: '请选择合同类型'}]} ]"
              :triggerChange="true"
              placeholder="请选择合同类型"
              dictCode="contract_type"
              :disabled="model && !!model.id"
              @change="contractChange"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="项目名称">
            <a-select
              v-decorator="['projectId',{rules: [{ required: true, message: '请选择项目', whitespace: true}]}]"
              placeholder="请选择项目"
              :filterOption="false"
              :showSearch="true"
              @search="fetchProjectList"
            >
              <a-select-option
                v-for="(project, index) in projects"
                :key="index"
                :value="project.id"
              >{{project.projectName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="生效日期">
            <a-range-picker
              v-decorator="['dateSpan',{rules: [{ required: true, message: '请选择生效日期'}]}]"
              format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
            />
          </a-form-item>
        </a-col>
        <!-- <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="状态">
            <j-dict-select-tag
              v-decorator="[ 'status', {rules: [{ required: true, message: '请选择状态'}]} ]"
              :triggerChange="true"
              placeholder="请选择合同状态"
              dictCode="bpm_status"
              disabled
            />
          </a-form-item>
        </a-col>-->
      </a-row>
    </a-card>
    <a-card class="card" title="供应商信息" :bordered="false">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="供应商">
            <a-select
              v-decorator="['vendorId',{rules: [{ required: true, message: '请选择供应商', whitespace: true}]}]"
              placeholder="请选择供应商"
              :filterOption="false"
              :showSearch="true"
              @search="fetchVendorList"
              @change="handleVendorChange"
            >
              <a-select-option
                v-for="(vendor, index) in vendors"
                :key="index"
                :value="vendor.id"
              >{{vendor.vendorName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="联络人">
            <a-input
              placeholder="请输入联络人"
              disabled
              v-decorator="[
              'contactPerson'
            ]"
            />
          </a-form-item>
          <a-form-item v-if="false">
            <a-input disabled v-decorator="[
              'contactPersonId'
            ]" />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="联系电话">
            <a-input
              disabled
              placeholder="请输入联系电话"
              v-decorator="[
              'contactPhone'
            ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import pick from 'lodash.pick'
import moment from 'moment'
import JBankSelectTag from '@/components/selector/JBankSelectTag'

import { getVendors, getProjects } from '@/api/api'

export default {
  name: 'ContractForm',
  components: {
    JBankSelectTag
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      contractType: 'Null',
      model: null,
      vendors: [],
      projects: []
    }
  },
  created() {
    this.fetchVendorList()
    this.fetchProjectList()
    // contractTypeCode
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.model = record
      let that = this
      this.$nextTick(() => {
        that.form.setFieldsValue(pick(record, 'id', 'contractCode', 'contractTitle', 'projectId'))
        that.form.setFieldsValue({
          contractTypeCode: '' + record.contractTypeCode
        })
        that.contractChange(record.contractTypeCode)
        let vendor = record.vendor
        that.form.setFieldsValue({
          contactPhone: vendor.contactPhone,
          contactPerson: vendor.contactPerson,
          vendorId: '' + vendor.id
        })

        that.form.setFieldsValue({
          dateSpan: [moment(record.beginDate), moment(record.endDate)]
        })
      })
    },
    fetchVendorList(word) {
      getVendors()
        .then(res => {
          if (res.success) {
            this.vendors = res.result.records
          }
        })
        .finally(() => {})
    },
    fetchProjectList(word) {
      getProjects()
        .then(res => {
          if (res.success) {
            this.projects = res.result.records
          }
        })
        .finally(() => {})
    },
    contractChange(v) {
      if (v == 1) {
        //外包
        this.contractType = 'subpack'
      } else if (v == 2) {
        this.contractType = 'material'
      } else if (v == 3) {
        this.contractType = 'st'
      } else {
        this.contractType = ''
      }
      this.$emit('contractChange', this.contractType)
    },
    handleVendorChange(v) {
      let vendor = this.vendors.find(item => (item.id = v))
      if (vendor) {
        this.form.setFieldsValue({
          contactPerson: vendor.contactPerson,
          contactPhone: vendor.contactPhone,
          contactPersonId: vendor.contactPersonId
        })
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    validate(rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        callback('需要以 user- 开头')
      }
      callback()
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 24px;
}
</style>