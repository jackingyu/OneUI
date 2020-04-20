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
                v-for="(project, index) in FormFieldOptions.projects"
                :key="index"
                :value="project.id"
              >{{project.projectName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="客户">
            <a-select
              v-decorator="['customerId',{rules: [{ required: true, message: '请选择客户', whitespace: true}]}]"
              placeholder="请选择客户"
              :filterOption="false"
              :showSearch="true"
              @search="fetchCustomerList"
            >
              <a-select-option
                v-for="(customer, index) in FormFieldOptions.customers"
                :key="index"
                :value="customer.id"
              >{{customer.customerName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="结算类型">
            <j-dict-select-tag
              v-decorator="['salesSettlementTypeCode']"
              dictCode="sales_settlement_type"
              :triggerChange="true"
              placeholder="请选择"
              @change="salesSettlementTypeCodeChange"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="结算时间">
            <j-date
              :trigger-change="true"
              placeholder="结算时间"
              showTime
              dateFormat="YYYY-MM-DD HH:mm:ss"
              style="width:100%"
              v-decorator="['settlementTime',{rules: [{ required: true, message: '请选择结算时间'}]}]"
            ></j-date>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="本次结算总价">
            <a-input placeholder="请输入本次结算总价" v-decorator="['settlementAmount']" />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="财务年度">
            <a-input hidden placeholder="请输入财务年度" v-decorator="['fiscalYear']" />
            <div style="min-height:3rem">{{this.form.getFieldValue('fiscalYear')}}</div>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="滞纳金">
            <a-input placeholder="请输入滞纳金" v-decorator="['lateFee']" />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="中标价格">
            <a-input placeholder="中标价格" v-decorator="['bidAmount']" />
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
import { getVendors, getProjects, getFiscalyear } from '@/api/api'

import FormFieldMixin from '@/mixins/FormFieldMixin'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
import ValidationMixin from '@/mixins/ValidationMixin'
import JDate from '@/components/jeecg/JDate'
export default {
  name: 'SettlementForm',
  mixins: [FormFieldMixin, ValidationMixin, FormPageActionMixin],
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
      FieldsSet: {
        customers: {
          key: 'customers',
          funcName: 'GetCustomers'
        },
        project: {
          key: 'projects',
          funcName: 'GetProjects',
          params: {}
        }
      }
    }
  },
  created() {
    this.fetchProjectList()
    this.getFiscalyear()
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.model = record || {}
      let that = this
      for (let key in this.model) {
        let va = this.model[key]
        if (!isNaN(va) && va != null) {
          this.model[key] = `${va}`
        }
      }
      this.$nextTick(() => {
        that.form.setFieldsValue(
          pick(
            this.model,
            'comments',
            'bidAmount',
            'customerId_dictText',
            'salesSettlementTypeCode',
            'settlementTime',
            'customerId',
            'lateFee',
            'id',
            'settlementAmount',
            'projectId',
            'fiscalYear'
          )
        )
        if (this.model.salesSettlementTypeCode != undefined) {
          that.salesSettlementTypeCodeChange(this.model.salesSettlementTypeCode)
        }
      })
    },
    getFiscalyear() {
      getFiscalyear()
        .then(res => {
          if (res.success) {
            this.form.setFieldsValue({
              fiscalYear: res.result.fiscalYear
            })
          }
        })
        .finally(() => {})
    },
    fetchCustomerList(word) {
      this.request({
        ...this.FieldsSet.customers,
        params: {
          customerName: word ? `*${word}*` : ''
        }
      })
    },
    fetchProjectList(word) {
      this.request({
        ...this.FieldsSet.project,
        params: {
          projectName: word ? `*${word}*` : ''
        }
      })
    },
    salesSettlementTypeCodeChange(v) {
      this.$emit('salesSettlementTypeCodeChange', v)
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