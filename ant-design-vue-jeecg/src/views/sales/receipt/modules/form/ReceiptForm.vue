<template>
  <a-form :form="form" class="form">
    <detail-list title="基础信息">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item style="display:none">
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-form-item label="客户">
            <a-select
              v-decorator="['customerId',{rules:[ruleWithDefault('请选择客户')]}]"
              placeholder="请选择客户"
              :filterOption="false"
              :showSearch="true"
              @search="fetchCustomerList"
              :disabled="!!model.id"
            >
              <a-select-option
                v-for="customer in FormFieldOptions.customers"
                :key="customer.id"
              >{{customer.customerName}}</a-select-option>
            </a-select>
          </a-form-item>
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
          <a-form-item label="当前累计欠款">
            <a-input
              placeholder="当前累计欠款"
              disabled
              v-decorator="[
              'paymentdebtAmount',
              {rules: [{ required: true, message: '请输入当前累计欠款', whitespace: false}]}
            ]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="财务年度">
            <!-- fiscalYear -->
          </a-form-item>
        </a-col>
      </a-row>
    </detail-list>
    <a-divider style="margin-bottom: 32px" />
    <detail-list title="收款信息">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="收款日期">
            <j-date
              :trigger-change="true"
              placeholder="收款日期"
              format="YYYY-MM-DD"
              style="width:100%"
              v-decorator="['paymentDate',{rules: [{ required: true, message: '请选择结算时间'}]}]"
            ></j-date>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="收款方式">
            <j-dict-select-tag
              v-decorator="['paymentMethodCode',{rules: [{ required: true, message: '请选择收款方式'}]}]"
              :triggerChange="true"
              :placeholder="`请选择收款方式`"
              :type="'select'"
              dictCode="payment_method"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="收款金额">
            <a-input
              disabled
              placeholder="请输入收款金额"
              v-decorator="[
              'paymentAmount'
            ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="收款银行">
            <j-bank-select-tag v-decorator="['bankId' ]" placeholder="请选择银行" />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="收款账号">
            <a-input
              placeholder="请输入收款账号"
              v-decorator="[
              'bankAccountId'
            ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </detail-list>
    <a-divider style="margin-bottom: 32px" />
    <detail-list title="附件"></detail-list>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import pick from 'lodash.pick'
import JBankSelectTag from '@/components/selector/JBankSelectTag'

import DetailList from '@/components/tools/DetailList'
import { getVendors, getProjects } from '@/api/api'
import JDate from '@/components/jeecg/JDate'
import FormFieldMixin from '@/mixins/FormFieldMixin'
import ValidationMixin from '@/mixins/ValidationMixin'
export default {
  name: 'ReceiptForm',
  components: {
    JBankSelectTag,
    DetailList,
    JDate
  },
  mixins: [FormFieldMixin, ValidationMixin],
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
      banks: [],
      vendors: [],
      projects: [],
      FieldsSet: {
        customers: {
          key: 'customers',
          funcName: 'GetCustomers'
        }
      }
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
        that.form.setFieldsValue(
          pick(
            record,
            'id',
            'vendorCode',
            'vendorName',
            'vendorGroupCode',
            'contactPerson',
            'contactPhone',
            'contactPersonId',
            'socialCreditCode',
            'taxSubject',
            'businessLicense',
            'taxCode'
          )
        )
      })
    },
    fetchCustomerList(word) {
      this.request({
        ...this.FieldsSet.customers,
        params: {
          customerName: word ? `*${word}*` : ''
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
      let vendor = this.vendors.find(item => item.id == v)
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