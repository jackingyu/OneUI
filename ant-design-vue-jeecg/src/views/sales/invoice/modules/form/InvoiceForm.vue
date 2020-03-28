<template>
  <a-form :form="form" class="form">
    <detail-list title="基础信息">
      <a-row class="form-row" :gutter="16">
        <a-col v-show="!!this.model.id" :lg="8" :md="12" :sm="24">
          <a-form-item style="display:none">
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-form-item label="发票号码">
            <span>{{this.model.invoiceNumber}}</span>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="客户">
            <a-select
              v-decorator="['customerId',{rules: [{ required: true, message: '请选择客户', whitespace: true}]}]"
              placeholder="请选择客户"
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
          <a-form-item label="财务年度">
            <a-input hidden v-decorator="['fiscalYear']" />
            <div style="min-height:3rem">{{this.form.getFieldValue('fiscalYear')}}</div>
            <!-- fiscalYear -->
          </a-form-item>
        </a-col>
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
      </a-row>
    </detail-list>
    <a-divider style="margin-bottom: 32px" />
    <detail-list title="物料信息">
      <a-row class="form-row" :gutter="16">
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="物料分组">
            <j-dict-select-tag
              v-model="materialGroupCode"
              placeholder="请选择物料组"
              :type="'select'"
              dictCode="material_group"
              :triggerChange="true"
              @change="materialGroupChange"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="规格型号">
            <a-select
              v-decorator="['materialId',{rules: [{ required: true, message: '请选择物料', whitespace: true}]}]"
              placeholder="请选择物料"
              :filterOption="false"
              :showSearch="true"
              allowClear
              @search="fetchMaterialList"
              @change="materialChange"
            >
              <a-select-option
                v-for="(material, index) in FormFieldOptions.materials"
                :key="index"
                :value="material.value"
              >{{material.label}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="物料描述">
            <a-input
              placeholder="请输入物料描述"
              v-decorator="[
              'materialDescription'
            ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </detail-list>
    <a-divider style="margin-bottom: 32px" />
    <detail-list title="开票项目">
      <a-row class="form-row" :gutter="16">
        <a-col v-show="!this.model.id" :lg="8" :md="12" :sm="24">
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
          <a-form-item label="开票日期">
            <j-date
              showTime
              :trigger-change="true"
              placeholder="开票日期"
              dateFormat="YYYY-MM-DD HH:mm:ss"
              style="width:100%"
              v-decorator="['invoiceDate',{rules: [{ required: true, message: '请选择结算时间'}]}]"
            />
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

        <a-col :lg="8" :md="12" :sm="24">
          <a-form-item label="备注">
            <a-input placeholder="请输入备注" v-decorator="[
              'comments'
            ]" />
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
      materialGroupCode: void 0,
      model: {},
      FieldsSet: {
        materials: {
          key: 'materials',
          funcName: 'GetMaterials'
        },
        customers: {
          key: 'customers',
          funcName: 'GetCustomers'
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
          pick(
            record,
            'id',
            'customerId',
            'fiscalYear',
            'vendorId',
            'contractContent',
            'invoiceDate',
            'amount',
            'invoiceNumber',
            'materialId',
            'materialDescription',
            'comments'
          )
        )
        this.form.setFieldsValue({
          taxRate: isNaN(record.taxRate) ? record.taxRate : '' + record.taxRate
        })
      })
    },
    fetchMaterialList(word) {
      this.request({
        ...this.FieldsSet.materials,
        params: {
          materialName: word ? `*${word}*` : '',
          materialGroupCode: this.materialGroupCode
        }
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
    materialChange(v) {
      let material = this.FormFieldOptions.materials.find(item => item.value == v)
      if (material) {
        this.form.setFieldsValue({
          materialDescription: material.node.materialDescription
        })
      }
    },
    materialGroupChange(v) {
      this.materialGroupCode = v
      this.form.clearField('materialId')
      this.fetchMaterialList()
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