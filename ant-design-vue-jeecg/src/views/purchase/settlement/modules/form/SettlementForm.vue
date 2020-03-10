<template>
  <a-form :form="form" class="form">
    <detail-list title="基础信息">
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
          <a-form-item label="结算时间">
            <j-date
              :trigger-change="true"
              placeholder="结算时间"
              format="YYYY-MM-DD"
              style="width:100%"
              v-decorator="['settlementTime',{rules: [{ required: true, message: '请选择结算时间'}]}]"
            ></j-date>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="本次结算总价">
            <a-input placeholder="请输入本次结算总价" v-decorator="[
              'total'
            ]" />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="财务年度">
            <a-select
              v-decorator="['annual']"
              placeholder="请选择财务年度"
              :filterOption="false"
              disabled
              :showSearch="true"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="结算类型">
            <j-dict-select-tag
              v-decorator="['settlementTypeCode']"
              dictCode="settlement_type"
              :triggerChange="true"
              placeholder="请选择"
              @change="settlementTypeCodeChange"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </detail-list>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
    <a-divider style="margin-bottom: 32px" />
  </a-form>
</template>
<script>
import pick from 'lodash.pick'
import moment from 'moment'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import DetailList from '@/components/tools/DetailList'
import { getVendors, getProjects } from '@/api/api'

import JDate from '@/components/jeecg/JDate'
export default {
  name: 'SettlementForm',
  components: {
    JBankSelectTag,
    DetailList,
    JDate
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
      model: {},
      vendors: [],
      projects: []
    }
  },
  created() {
    this.fetchVendorList()
    this.fetchProjectList()
    window.F = this.form
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.model = record || {}
      let that = this
      this.$nextTick(() => {
        that.form.setFieldsValue(pick(this.model, 'id', 'contractCode', 'contractTitle', 'projectId'))
        if (this.model.settlementTypeCode) {
          that.form.setFieldsValue({
            settlementTypeCode: '' + this.model.settlementTypeCode
          })
          that.settlementTypeCodeChange(this.model.settlementTypeCode)
        }
        let vendor = this.model.vendor
        if (vendor) {
          that.form.setFieldsValue({
            contactPhone: vendor.contactPhone,
            contactPerson: vendor.contactPerson,
            vendorId: vendor.id != undefined ? '' + vendor.id : ''
          })
        }
        if (this.model.beginDate) {
          that.form.setFieldsValue({
            dateSpan: [moment(this.model.beginDate), moment(this.model.endDate)]
          })
        }
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
    settlementTypeCodeChange(v) {
      this.$emit('settlementTypeCodeChange', v)
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