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
          <a-form-item label="财务年度">
            <a-input hidden v-decorator="['fiscalYear']" />
            {{this.form.getFieldValue('fiscalYear')}}
            <!-- fiscalYear -->
          </a-form-item>
        </a-col>
      </a-row>
    </detail-list>
    <a-divider style="margin-bottom: 32px" />
    <!-- <detail-list title="物料信息">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="规格型号">
            <a-select
              v-decorator="['vendorId',{rules: [{ required: true, message: '请选择物料', whitespace: true}]}]"
              placeholder="请选择物料"
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
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="物料描述">
            <a-textarea
              placeholder="请输入物料描述"
              v-decorator="[
              'bankAccountId'
            ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </detail-list>-->
    <detail-list title="开票项目">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="合同实施内容">
            <a-input
              placeholder="请输入合同实施内容"
              v-decorator="[
              'contractContent',{rules:[{ required: true, message: '请输入合同实施内容'}]}
            ]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="开票日期">
            <j-date
              :trigger-change="true"
              placeholder="付款日期"
              format="YYYY-MM-DD"
              style="width:100%"
              v-decorator="['invoiceDate',{rules: [{ required: true, message: '请选择结算时间'}]}]"
            ></j-date>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="开票金额">
            <a-input
              placeholder="请输入付款金额"
              v-decorator="[
              'amount',{rules:[{ required: true, message: '请输入付款金额'},ruleWith('cash')]}
            ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="发票号码">
            <a-input
              placeholder="请输入发票号码"
              v-decorator="[
              'invoiceNumber', {rules: [{ required: true, message: '请输入发票号码'}]} 
            ]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="税率">
            <j-dict-select-tag
              v-decorator="[ 'taxRate', {rules: [{ required: true, message: '请选择税率'}]} ]"
              :triggerChange="true"
              placeholder="请选择税率"
              dictCode="tax_rate"
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
import DetailList from '@/components/tools/DetailList'
import { getVendors, getProjects } from '@/api/api'
import JDate from '@/components/jeecg/JDate'

import FormFieldMixin from '@/mixins/FormFieldMixin'
import ValidationMixin from '@/mixins/ValidationMixin'

export default {
  name: 'InvoiceForm',
  mixins: [FormFieldMixin, ValidationMixin],
  components: {
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
      model: {},
      FieldsSet: {
        vendors: {
          key: 'vendors',
          funcName: 'GetVendors'
        }
      }
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.model = { ...record }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(record, 'id', 'vendorId', 'contractContent', 'invoiceDate', 'amount', 'invoiceNumber')
        )
        this.form.setFieldsValue({
          taxRate: isNaN(record.taxRate) ? record.taxRate : '' + record.taxRate
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
      let vendor = this.FormFieldOptions.vendors.find(item => item.id == v)
      if (vendor) {
        // this.form.setFieldsValue({
        //   contactPerson: vendor.contactPerson,
        //   contactPhone: vendor.contactPhone,
        //   contactPersonId: vendor.contactPersonId
        // })
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