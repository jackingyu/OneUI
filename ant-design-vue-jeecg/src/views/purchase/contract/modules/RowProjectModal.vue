<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col
            v-for="(item, index) in formItems"
            :key="index"
            :xs="24"
            :md="item.inputType=='textarea'?24: 8"
          >
            <a-form-item :label="item.label">
              <template v-if="item.inputType=='select'">
                <a-select
                  v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请选择'+item.label}]}]"
                  :placeholder="`请选择${item.label}`"
                  :filterOption="false"
                  :disabled="item.readOnly"
                  labelInValue
                  @search="word=>searchWordSelect(word,item.valueKey)"
                  @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                  :showSearch="!item.onlySelect"
                >
                  <a-select-option
                    v-for="option in (FormFieldOptions[item.valueKey]||[])"
                    :key="''+option.key"
                    :value="''+option.key"
                  >{{option.label}}</a-select-option>
                </a-select>
              </template>
              <template v-else-if="item.inputType=='input'">
                <a-input
                  v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请输入'+item.label},{validator:(rule, value, callback)=>validatorFormpsfix(item,rule, value, callback)}]}]"
                  :disabled="item.readOnly"
                  :placeholder="`请输入${item.label}`"
                >
                  <template v-if="item.prefix">
                    <j-dict-select-tag
                      slot="addonAfter"
                      v-if="item.prefix.inputType=='dict'"
                      v-decorator="[item.prefix.valueKey]"
                      :triggerChange="true"
                      :disabled="item.prefix.readOnly"
                      :readOnly="item.prefix.readOnly"
                      :placeholder="`请选择${item.prefix.label}`"
                      :type="'select'"
                      @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                      :dictCode="item.prefix.dict"
                    />
                    <a-select
                      v-else
                      slot="addonAfter"
                      :defaultValue="item.prefix.value"
                      @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                      style="width: 80px"
                    >
                      <a-select-option
                        v-for="option in (FormFieldOptions[item.prefix.valueKey]||[])"
                        :key="option.key"
                        :value="option.key"
                      >{{option.label}}</a-select-option>
                    </a-select>
                  </template>
                  <template v-if="item.suffix">
                    <j-dict-select-tag
                      slot="addonAfter"
                      style="width: 80px"
                      v-if="item.suffix.inputType=='dict'"
                      v-decorator="[item.suffix.valueKey,{rules: [{ required: item.suffix.required, message: '请选择'+item.suffix.label}]}]"
                      :triggerChange="true"
                      :disabled="item.suffix.readOnly"
                      :readOnly="item.suffix.readOnly"
                      @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                      :placeholder="`请选择${item.suffix.label}`"
                      :type="'select'"
                      :dictCode="item.suffix.dict"
                    />
                    <a-select
                      v-decorator="[item.suffix.valueKey,{rules: [{ required: item.suffix.required, message: '请选择'+item.label}]}]"
                      v-else
                      slot="addonAfter"
                      style="width: 80px"
                      @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                      :defaultValue="item.suffix.value"
                    >
                      <a-select-option
                        v-for="option in (FormFieldOptions[item.suffix.valueKey]||[])"
                        :key="option.key"
                        :value="option.key"
                      >{{option.label}}</a-select-option>
                    </a-select>
                  </template>
                </a-input>
              </template>
              <template v-else-if="item.inputType=='textarea'" :disabled="item.readOnly">
                <a-textarea
                  v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请输入'+item.label}]}]"
                  :autosize="{ minRows: 5, maxRows: 10 }"
                  :placeholder="`请输入${item.label}`"
                />
              </template>
              <template v-else-if="item.inputType=='dict'">
                <j-dict-select-tag
                  v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请选择'+item.label}]}]"
                  :triggerChange="true"
                  :disabled="item.readOnly"
                  :readOnly="item.readOnly"
                  :placeholder="`请选择${item.label}`"
                  :type="'select'"
                  @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                  :dictCode="item.dict"
                />
              </template>
              <template v-else>
                <span
                  v-text="item.evalue?item.evalue(form.getFieldValue('unitPrice'),form.getFieldValue('quantity')):item.value"
                ></span>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { getMaterials } from '@/api/api'
import { formItems } from './formOptions'

import FormFieldMixin from '@/mixins/FormFieldMixin'
export default {
  name: 'RowProjectModal',
  mixins: [FormFieldMixin],
  props: {
    type: {
      type: String,
      default: 'st'
    }
  },
  watch: {
    type: function(n, o) {
      this.contractType = n
    }
  },
  computed: {
    formItems() {
      return formItems.filter(item => !item.contractType || item.contractType == this.contractType)
    }
  },
  data() {
    return {
      title: '操作',
      visible: false,
      contractType: this.type,
      model: {},
      col: 3,
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {}
    }
  },
  methods: {
    add(num) {
      this.edit({
        itemNo: num
      })
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'unitPrice',
            'quantity',
            'itemNo',
            'materialDescription',
            'acceptanceCriteria',
            'contractSchedule',
            'qualityStandard',
            'paymentTerm',
            'warranty',
            'warrantyAgreement'
          )
        )
        this.form.setFieldsValue({
          taxRate: isNaN(record.taxRate) ? record.taxRate : '' + record.taxRate,
          materialTypeCode: isNaN(record.materialTypeCode) ? record.materialTypeCode : '' + record.materialTypeCode,
          unitCode: isNaN(record.unitCode) ? record.unitCode : '' + record.unitCode,
          paymentMethodCode: isNaN(record.paymentMethodCode) ? record.paymentMethodCode : '' + record.paymentMethodCode
        })
        if (record.materialCode) {
          if (record.materialCode instanceof Object) {
            this.form.setFieldsValue({ materialCode: record.materialCode })
          } else {
            this.form.setFieldsValue({
              materialCode: {
                key: record.materialCode == undefined ? '' : record.materialCode + '',
                label: record.materialName
              }
            })
          }
        }
      })
      // const demoData = {
      //   unitPrice: '100',
      //   quantity: '33',
      //   itemNo: 10,
      //   materialTypeCode: '2',
      //   materialCode: { key: 'M6', label: '测试物料6' },
      //   comments: '合同内容',
      //   unitCode: '1',
      //   taxRate: '0.225',
      //   // taxRate: { key: 6.25, label: '6.25‰', value: 6.25 },
      //   acceptanceCriteria: 'YE',
      //   contractSchedule: '180天',
      //   qualityStandard: 'ISO9001',
      //   paymentMethodCode: '1',
      //   paymentTerm: '合同期前'
      // }
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          let postData = {
            ...this.model,
            ...values,
            // taxRate: values.taxRate.key,
            materialCode: values.materialCode.key,
            materialName: values.materialCode.label
          }
          this.$emit('submit', postData)
          this.visible = false
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.close()
    },
    searchWordSelect(word, key) {
      if (key == 'materialCode') {
        let code = this.form.getFieldValue('materialTypeCode')
        this.materialList({
          materialGroupCode: code,
          materialName: word ? `*${word}*` : undefined
        })
      }
    },
    onSelectChangeWithKey(val, key) {
      if (key == 'materialTypeCode') {
        this.form.setFieldsValue({ materialCode: {} })
        this.materialList({
          materialGroupCode: val
        })
      } else if (key == 'materialCode') {
        // if (!this.form.getFieldValue('materialDescription')) {
        let findMaterial = this.FormFieldOptions.materialCode.find(item => item.key == val.key)
        if (findMaterial && findMaterial.node && findMaterial.node.materialDescription) {
          this.form.setFieldsValue({ materialDescription: findMaterial.node.materialDescription || '' })
        }
        // }
        // materialDescription
        // this.form.setFieldsValue({ materialCode: {} })
        // this.materialList({
        //   materialGroupCode: val
        // })
      }
    },
    initFields() {
      return [
        {
          key: 'materialCode',
          funcName: 'GetMaterials',
          params: {}
        }
      ]
    },
    materialList(params) {
      this.request({
        key: 'materialCode',
        funcName: 'GetMaterials',
        params
      })
    },
    validatorFormpsfix(item, rule, value, callback) {
      const form = this.form
      if (item.suffix && item.suffix.valueKey) {
        let val = form.getFieldValue(item.suffix.valueKey)
        if (!val) {
          callback('请选择' + item.suffix.label)
          return
        }
      }
      if (item.prefix && item.prefix.valueKey) {
        let val = form.getFieldValue(item.prefix.valueKey)
        if (!val) {
          callback('请选择' + item.prefix.label)
          return
        }
      }
      callback()
    }
  }
}
</script>

<style scoped>
</style>