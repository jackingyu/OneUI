<template>
  <a-form :form="form" class="form">
    <detail-list title="基础信息">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item style="display:none">
            <a-input v-decorator="['id']" />
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
                v-for="(vendor, index) in FormFieldOptions.vendors"
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
    <detail-list title="付款信息">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="付款日期">
            <j-date
              :trigger-change="true"
              placeholder="付款日期"
              format="YYYY-MM-DD HH:mm:ss"
              style="width:100%"
              v-decorator="['paymentDate',{rules: [{ required: true, message: '请选择结算时间'}]}]"
            ></j-date>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="付款方式">
            <j-dict-select-tag
              v-decorator="['paymentMethodCode',{rules: [{ required: true, message: '请选择付款方式'}]}]"
              :triggerChange="true"
              :placeholder="`请选择付款方式`"
              :type="'select'"
              dictCode="payment_method"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="付款金额">
            <a-input
              placeholder="请输入付款金额"
              v-decorator="[
              'paymentAmount',{rules:[ruleWith('money')]}
            ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="付款银行">
            <j-bank-select-tag v-decorator="['bankId' ]" placeholder="请选择银行" />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="付款账号">
            <a-input
              placeholder="请输入付款账号"
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
import FormFieldMixin from '@/mixins/FormFieldMixin'
import ValidationMixin from '@/mixins/ValidationMixin'
import DetailList from '@/components/tools/DetailList'
import JDate from '@/components/jeecg/JDate'
export default {
  name: 'PaymentForm',
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
      model: null,
      banks: [],
      vendors: [],
      projects: [],
      FieldsSet: {
        vendors: {
          key: 'vendors',
          funcName: 'GetVendors'
        }
      }
    }
  },
  created() {
    this.fetchVendorList()
    // contractTypeCode
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record = {}) {
      this.model = { ...record }
      let that = this
      this.$nextTick(() => {
        that.form.setFieldsValue({
          ...pick(
            record,
            'id',
            'vendorId',
            'paymentdebtAmount',
            'paymentDate',
            // 'paymentMethodCode',
            'paymentAmount',
            // 'bankId',
            'bankAccountId'
          ),
          bankId: isNaN(record.bankId) ? record.bankId : '' + record.bankId,
          paymentMethodCode: isNaN(record.paymentMethodCode) ? record.paymentMethodCode : '' + record.paymentMethodCode
        })
      })
    },
    fetchVendorList(word) {
      this.request({
        ...this.FieldsSet.vendors,
        params: {
          vendorName: word ? `*${word}*` : ''
        }
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 24px;
}
</style>