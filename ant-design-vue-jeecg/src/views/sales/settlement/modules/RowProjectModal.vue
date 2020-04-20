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
          <a-col v-for="(item, index) in formItems" :key="index" :xs="24" :md="8">
            <a-form-item :label="item.label">
              <template v-if="item.inputType=='select'">
                <a-select
                  v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请选择'+item.label}]}]"
                  :placeholder="`请选择${item.label}`"
                  :filterOption="false"
                  :disabled="item.readOnly"
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
                  v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请输入'+item.label}]}]"
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
                      v-decorator="[item.suffix.valueKey]"
                      :triggerChange="true"
                      :disabled="item.suffix.readOnly"
                      :readOnly="item.suffix.readOnly"
                      @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                      :placeholder="`请选择${item.suffix.label}`"
                      :type="'select'"
                      :dictCode="item.suffix.dict"
                    />
                    <a-select
                      v-decorator="[item.suffix.valueKey]"
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
                  v-decorator="[item.valueKey,{rules: [{ required: item.required,  message: '请输入'+item.label}]}]"
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
              <template v-else-if="item.inputType=='month'">
                <a-month-picker
                  :trigger-change="true"
                  format="M月"
                  :placeholder="`请选择${item.label}`"
                  style="width:100%"
                  v-decorator="[item.valueKey,{rules: [{ required: item.required, message: '请选择'+item.label}]}]"
                />
              </template>
              <template v-else>
                <span
                  v-text="item.evalue?item.evalue({unitPrice:form.getFieldValue('unitPrice'),quantity:form.getFieldValue('quantity')}):item.value"
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
import JDate from '@/components/jeecg/JDate'
import ValidationMixin from '@/mixins/ValidationMixin'

export default {
  name: 'RowProjectModal',
  components: {
    JDate
  },
  props: {
    type: {
      type: String,
      default: 'st'
    }
  },
  mixins: [FormFieldMixin, ValidationMixin],
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
      FieldsSet: {
        material: {
          key: 'materialId',
          funcName: 'GetMaterials',
          params: {}
        },
        contract: {
          key: 'contractId',
          funcName: 'GetContracts',
          params: {},
          mapper: item => {
            return {
              key: item.id,
              value: item.id,
              label: item.contractTitle
            }
          }
        },
        project: {
          key: 'projectId',
          funcName: 'GetProjects',
          params: {},
          mapper: item => {
            return {
              key: item.id,
              value: item.id,
              label: item.projectName
            }
          }
        }
      },
      visible: false,
      contractType: this.type,
      model: {},
      col: 3,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    window.Z = this
  },
  methods: {
    add(model) {
      this.edit(model || {})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      for (let key in this.model) {
        let va = this.model[key]
        if (!isNaN(va) && va != null) {
          this.model[key] = `${va}`
        }
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(this.model)
        if (this.model.clearPeriod) {
          this.form.setFieldsValue({
            clearPeriod: moment(this.model.clearPeriod)
          })
        }
      })
    },
    close() {
      this.$emit('close')
      this.confirmLoading = false
      this.visible = false
    },
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          let clearPeriod = values.clearPeriod
          clearPeriod = clearPeriod.format('YYYY-MM')
          let postData = {
            ...this.model,
            ...values,
            clearPeriod
          }
          let mat = this.FormFieldOptions.materialId.find(item => item.key == values.materialId)
          if (mat) {
            postData.materialId_dictText = mat.label
          }
          mat = this.FormFieldOptions.projectId.find(item => item.key == values.projectId)
          if (mat) {
            postData.projectId_dictText = mat.label
          }
          mat = this.FormFieldOptions.projectId.find(item => item.key == values.unitCode)
          if (mat) {
            postData.unitCode_dictText = mat.label
          }
          this.$emit('submit', postData)
          this.close()
        }
      })
    },
    handleCancel() {
      this.close()
    },
    searchWordSelect(word, key) {
      if (key == 'materialId') {
        this.materialList({
          materialName: word ? `*${word}*` : undefined
        })
      } else if (key == 'projectId') {
        this.projectList({
          projectName: word ? `*${word}*` : undefined
        })
      }
    },
    onSelectChangeWithKey(val, key) {},
    materialList(params) {
      this.request({
        ...this.FieldsSet.material,
        params
      })
    },
    projectList(params) {
      this.request({
        ...this.FieldsSet.project,
        params
      })
    }
  }
}
</script>

<style scoped>
</style>