<template>
  <a-form :form="form" class="form">
    <detail-list title="基础信息">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item style="display:none">
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-form-item label="公司名称">
            <span>{{this.model.companyName}}</span>
          </a-form-item>
        </a-col>

        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="公司代码">
            <span>{{this.model.companyCode}}</span>
          </a-form-item>
        </a-col>

        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="部门代码">
            <span>{{this.model.orgCode}}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </detail-list>
    <a-divider style="margin-bottom: 32px" />
    <detail-list title="财年信息">
      <a-row class="form-row" :gutter="16">
        <a-col :span="24">
          <a-form-item label="财务年度">
            <!-- fiscalYear -->
            <a-row :gutter="16">
              <a-col :span="8">
                <span>{{fiscalYear?fiscalYear:'未开启财年'}}</span>

                <a-button
                  style="display:inline;margin-left:16px"
                  :loading="openLoading"
                  @click="openFiscal"
                  type="primary"
                >开启财年</a-button>
                <a-button
                  style="display:inline;margin-left:16px"
                  type="danger"
                  :loading="closeLoading"
                  @click="closeFiscal"
                  ghost
                >{{fiscalClosed?'已关闭':'关闭财年'}}</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
    </detail-list>
    <a-divider style="margin-bottom: 32px" />
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import pick from 'lodash.pick'
import JBankSelectTag from '@/components/selector/JBankSelectTag'

import DetailList from '@/components/tools/DetailList'
import { getFiscalyearByCompany, closeFiscalyear, openFiscalyear } from '@/api/api'
import JDate from '@/components/jeecg/JDate'
import FormFieldMixin from '@/mixins/FormFieldMixin'
import ValidationMixin from '@/mixins/ValidationMixin'
export default {
  name: 'CompanyForm',
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
      closeLoading: false,
      openLoading: false,
      fiscalClosed: false,
      fiscalYear: void 0,
      model: {},
      banks: [],
      vendors: [],
      projects: [],
      FieldsSet: {
        customers: {
          key: 'customers',
          funcName: 'GetCustomers'
        },
        bankAccounts: {
          key: 'bankAccounts',
          funcName: 'GetBankAccounts'
        }
      }
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.model = record
      let that = this
      this.getFiscalyear()
      this.$nextTick(() => {
        that.form.setFieldsValue({
          ...pick(record, 'id', 'fiscalYear')
        })
      })
    },
    openFiscal() {
      // let fiscalYear = this.form.getFieldValue('fiscalYear')
      // if (!/^20\d{2}$/.test(fiscalYear)) {
      //   this.$message.warning('请输入正确的年份')
      //   return
      // }
      this.openLoading = true
      openFiscalyear({
        // fiscalYear,
        companyId: this.model.id
      })
        .then(res => {
          if (res.success) {
            this.getFiscalyear()
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.openLoading = false
        })
    },
    closeFiscal() {
      this.closeLoading = true
      // let fiscalYear = this.form.getFieldValue('fiscalYear')
      closeFiscalyear({
        companyId: this.model.id
      })
        .then(res => {
          if (res.success) {
            this.getFiscalyear()
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.closeLoading = false
        })
    },
    getFiscalyear() {
      if (!!this.model.id) {
        getFiscalyearByCompany({ companyId: this.model.id })
          .then(res => {
            if (res.success) {
              this.fiscalYear = res.result.fiscalYear
              // this.form.setFieldsValue({
              //   fiscalYear: res.result.fiscalYear
              // })
            } else {
              this.fiscalClosed = true
            }
          })
          .finally(() => {})
      }
    },
    fetchCustomerList(word) {
      this.request({
        ...this.FieldsSet.customers,
        params: {
          customerName: word ? `*${word}*` : ''
        }
      })
    },
    fetchBankAccountList(word) {
      this.request({
        ...this.FieldsSet.bankAccounts,
        params: {
          accountName: word ? `*${word}*` : ''
        }
      })
    },
    handleBankAccountChange(v) {
      let bankAccount = this.FormFieldOptions.bankAccounts.find(item => item.id == v)
      if (bankAccount) {
        this.form.setFieldsValue({
          bankName: bankAccount.bankName,
          bankAccountId: bankAccount.id
        })
      }
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