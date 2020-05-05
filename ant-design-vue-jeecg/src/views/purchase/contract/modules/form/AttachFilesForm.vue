<template>
  <a-form :form="form" class="form">
    <a-form-item v-show="false">
      <a-input v-decorator="['data']" />
    </a-form-item>
    <a-table
      :columns="columns.concat((!model.id || model.editable)?operateColumn:[])"
      :dataSource="data"
      :pagination="false"
    >
      <!-- <template
        v-for="(col, i) in ['bankId', 'subBranchId','bankAccount','bankAccountName']"
        :slot="col"
        slot-scope="text, record, index"
      >{{ text }}</template>-->
      <span slot="text" slot-scope="text, record, index">{{ text }}</span>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <a-popconfirm title="是否要删除此行？" @confirm="remove(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      type="dashed"
      icon="plus"
      v-if="!model.id || model.editable"
      @click="newMember"
    >上传附件</a-button>

    <upload-modal :fileScope="'10'" ref="uploadModal" @uploadComplete="uploadComplete" />
  </a-form>
</template>

<script>
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import UploadModal from '@/components/tools/UploadModal.vue'
import { getBanks } from '@/api/api'
import { formItems } from '../formOptions'

import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'AttachFilesForm',
  components: {
    UploadModal
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
      loading: false,
      contractType: '',
      banks: [],
      dicts: {},
      model: {},
      data: [],
      operateColumn: {
        title: '操作',
        key: 'action',
        width: 120,
        scopedSlots: { customRender: 'operation' }
      },
      columns: [
        {
          title: '附件名称',
          dataIndex: 'fileName',
          width: 200,
          key: 'fileName'
        },
        {
          title: '附件URL',
          dataIndex: 'url',
          ellipsis: true,
          key: 'url'
        }
      ]
    }
  },
  mounted() {
    this.initDictConfig()
  },
  watch: {
    data(n) {
      this.setForm(this.data)
    }
  },
  methods: {
    initDictConfig() {
      initDictOptions('payment_method').then(res => {
        if (res.success) {
          this.dicts.payment_method = res.result
        }
      })
    },
    contract(v) {
      this.contractType = v
    },
    edit(model = {}) {
      this.model = {
        ...model
      }
      let rows = model.attachments || []
      this.data = rows.map(item => {
        return {
          ...item,
          key: item.id || `${+new Date()}`
        }
      })
      this.$nextTick(() => {
        this.setForm(this.data)
      })
    },
    setForm(val) {
      this.form.setFieldsValue({ data: JSON.stringify(val) })
    },
    handleSubmit(e) {
      e.preventDefault()
    },
    uploadComplete(row) {
      this.data = [
        ...this.data,
        {
          ...row,
          key: row.id || `${+new Date()}`
        }
      ]
    },
    newMember() {
      this.$refs.uploadModal.show()
    },
    remove(key) {
      const newData = this.data.filter(item => item.id !== key)
      this.data = newData
      this.setForm(this.data)
    }
    // handleChange(value, key, column) {
    //   const newData = [...this.data]
    //   const target = newData.filter(item => key === item.key)[0]
    //   if (target) {
    //     target[column] = value
    //     this.data = newData
    //     this.setForm(this.data)
    //   }
    // }
  }
}
</script>

<style scoped>
</style>