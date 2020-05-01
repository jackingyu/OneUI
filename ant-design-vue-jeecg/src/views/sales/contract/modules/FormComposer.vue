<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <template v-for="(mapper,ind) in columns">
        <a-divider v-if="ind>0" style="margin-bottom: 32px" />
        <detail-list :title="mapper.title">
          <a-row :gutter="24">
            <a-col
              v-for="(item, index) in mapper.fields"
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
                    :disabled="item.readOnly || diabledFunction(item) "
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
                    v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请输入'+item.label},ruleWith(item.ruleKey),{validator:(rule, value, callback)=>validatorFormpsfix(item,rule, value, callback)}]}]"
                    :disabled="item.readOnly || diabledFunction(item)"
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
                <template
                  v-else-if="item.inputType=='textarea'"
                  :disabled="item.readOnly || diabledFunction(item)"
                >
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
                    :disabled="item.readOnly || diabledFunction(item)"
                    :readOnly="item.readOnly || diabledFunction(item)"
                    :placeholder="`请选择${item.label}`"
                    :type="'select'"
                    @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                    :dictCode="item.dict"
                  />
                </template>
                <template v-else-if="item.inputType=='date'">
                  <j-date
                    :trigger-change="true"
                    format="YYYY-MM-DD"
                    :placeholder="`请选择${item.label}`"
                    style="width:100%"
                    v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请选择'+item.label}]}]"
                  ></j-date>
                </template>
                <template v-else>
                  <input hidden v-decorator="[item.valueKey]" />
                  <div style="min-height:2rem">{{form.getFieldValue(item.valueKey)||'-'}}</div>
                </template>
              </a-form-item>
            </a-col>
          </a-row>
        </detail-list>
      </template>
    </a-form>
  </a-spin>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { getMaterials } from '@/api/api'
import DetailList from '@/components/tools/DetailList'
import ValidationMixin from '@/mixins/ValidationMixin'
import FormFieldMixin from '@/mixins/FormFieldMixin'
import { formItems } from './formOptions'
import JDate from '@/components/jeecg/JDate'
export default {
  name: 'FormComposer',
  components: {
    DetailList,
    JDate
  },
  mixins: [FormFieldMixin, ValidationMixin],
  computed: {
    columns() {
      let fis = formItems.filter(item => item.contractType == '' || item.contractType == this.formContractType) || []
      let baseItems = fis.filter(item => item.baseField)
      let otherItems = fis.filter(item => !item.baseField)
      return [
        {
          title: '基础信息',
          fields: baseItems
        },
        {
          title: '其他信息',
          fields: otherItems
        }
      ]
    }
  },
  data() {
    return {
      title: '操作',
      visible: false,
      contractType: this.type,
      model: {},
      formContractType: '',
      fieldMaps: [],
      FieldsSet: {
        customers: {
          key: 'customerId',
          funcName: 'GetCustomers',
          mapper: item => {
            return {
              node: item,
              key: item.id,
              value: item.id,
              label: item.customerName
            }
          }
        },
        project: {
          key: 'projectId',
          funcName: 'GetProjects',
          params: {},
          mapper: item => {
            return {
              node: item,
              key: item.id,
              value: item.id,
              label: item.projectName
            }
          }
        }
      },
      col: 3,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'sale_contract' })
    }
  },
  mounted() {
    this.edit(this.model || {})
  },
  methods: {
    add(num) {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      if (!isNaN(this.model.contractTypeCode)) {
        this.formContractType = this.model.contractTypeCode == 2 ? 'st' : 'js'
      }
      for (let key in this.model) {
        let va = this.model[key]
        if (!isNaN(va) && va != null) {
          this.model[key] = `${va}`
        }
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(this.model)
        setTimeout(() => {
          this.form.setFieldsValue(this.model)
        }, 100)
      })
    },
    diabledFunction({ valueKey }) {
      if (this.model.id) {
        return ['salesContractCode', 'contractTypeCode'].indexOf(valueKey) != -1
      }
      return false
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
            materialId: values.materialId.key,
            materialName: values.materialId.label
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
      if (key == 'customerId') {
         this.fetchCustomerList(word)
      }else if (key == 'projectId') {
         this.fetchProjectList(word)
      }
    },
    onSelectChangeWithKey(val, key) {
      if (key == 'contractTypeCode') {
        this.formContractType = val == 2 ? 'st' : 'js'
      } else if (key == 'customerId') {
        let customer = this.FormFieldOptions[key].find(item => item.key == val)
        if (customer && customer.node) {
          this.form.setFieldsValue({
            contactPerson: customer.node.contactPerson,
            contactPersonMobile: customer.node.contactPhone
          })
        }
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
    fetchProjectList(word) {
      this.request({
        ...this.FieldsSet.project,
        params: {
          projectName: word ? `*${word}*` : ''
        }
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