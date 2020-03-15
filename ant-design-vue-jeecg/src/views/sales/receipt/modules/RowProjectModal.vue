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
                  v-decorator="[`${item.valueKey}`,{rules: [{ required: true, message: '请选择'+item.label}]}]"
                  :placeholder="`请选择${item.label}`"
                  :filterOption="false"
                  :disabled="item.readOnly"
                  labelInValue
                  @search="word=>searchWordSelect(word,item.valueKey)"
                  @change="v=>onSelectChangeWithKey(v,item.valueKey)"
                  :showSearch="!item.onlySelect"
                >
                  <a-select-option
                    v-if="(selectOptions[item.valueKey])"
                    v-for="option in selectOptions[item.valueKey]"
                    :key="option.key"
                    :value="option.key"
                  >{{option.label}}</a-select-option>
                </a-select>
              </template>
              <template v-else-if="item.inputType=='input'">
                <a-input
                  v-decorator="[item.valueKey,{rules: [{ required: true, message: '请输入'+item.label}]}]"
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
                        v-for="option in (selectOptions[item.prefix.valueKey]||[])"
                        :key="option.key"
                        :value="option.key"
                      >{{option.label}}</a-select-option>
                    </a-select>
                  </template>
                  <template v-if="item.suffix">
                    <j-dict-select-tag
                      slot="addonAfter"
                      defaultValue=".com"
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
                        v-for="option in (selectOptions[item.suffix.valueKey]||[])"
                        :key="option.key"
                        :value="option.key"
                      >{{option.label}}</a-select-option>
                    </a-select>
                  </template>
                </a-input>
              </template>
              <template v-else-if="item.inputType=='textarea'" :disabled="item.readOnly">
                <a-textarea
                  v-decorator="[item.valueKey,{rules: [{ required: true, message: '请输入'+item.label}]}]"
                  :autosize="{ minRows: 5, maxRows: 10 }"
                  :placeholder="`请输入${item.label}`"
                />
              </template>
              <template v-else-if="item.inputType=='dict'">
                <j-dict-select-tag
                  v-decorator="[item.valueKey,{rules: [{ required: true, message: '请选择'+item.label}]}]"
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
                <span v-text="item.evalue?item.evalue(form):item.value"></span>
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

export default {
  name: 'RowProjectModal',
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
      selectOptions: {
        taxRate: [
          {
            key: 6.25,
            value: '6.25',
            label: '6.25‰'
          }
        ]
      },
      col: 3,
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: '/test/jeecgDemo/add',
        edit: '/test/jeecgDemo/edit'
      }
    }
  },
  methods: {
    add() {
      this.edit({ })
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(this.model)
      })
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
            ...values,
            taxRate: values.taxRate.key,
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
    searchWordSelect(word, key) {},
    onSelectChangeWithKey(val, key) {
      if (key == 'materialGroupCode') {
        this.form.setFieldsValue({ materialCode: '' })
        this.materialList('', val)
      }
    },
    //
    materialList(keyWord, code) {
      let materialGroupCode = code ? code : this.form.getFieldValue('materialGroupCode')
      if (!materialGroupCode) {
        return
      }
      let that = this
      getMaterials({
        materialGroupCode: materialGroupCode,
        materialName: keyWord || this.model.materialName
      })
        .then(res => {
          if (res.success) {
            that.selectOptions['materialCode'] = res.result.records.map(item => {
              return {
                node: item,
                key: item.materialCode,
                value: item.materialCode,
                label: item.materialName
              }
            })
          }
        })
        .finally(() => {})
    }
  }
}
</script>

<style scoped>
</style>