<template>
  <page-view>
    <div slot="route-view">
      <a-card class="card">
        <contract-form @contractChange="contractChange" ref="contract" :showSubmit="false" />
        <!-- table -->
        <detail-list title="合同行项目">
          <contract-row-project-form ref="rowproj" :showSubmit="false" />
        </detail-list>
        <template v-if="!!model.id">
          <a-divider style="margin-bottom: 32px" />
          <detail-list title="合同附件">
            <attach-files-form ref="rowfiles" :showSubmit="false" />
          </detail-list>
        </template>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/purchase/contracts')">返回采购合同列表</a-button>
        <template v-if="!!model.id && !!model.allowedToApprove">
          <a-divider type="vertical" />
          <a-button type="primary" @click="e=>validate(true)" :loading="loading">提交审批</a-button>
        </template>
        <template v-if="!model.id || !!model.editable">
          <a-divider type="vertical" />
          <a-button type="info" @click="e=>validate(false)" :loading="loading">暂存</a-button>
        </template>
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import ContractForm from './modules/form/ContractForm'
import ContractRowProjectForm from './modules/form/ContractRowProjectForm'
import AttachFilesForm from './modules/form/AttachFilesForm'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import DetailList from '@/components/tools/DetailList'
import PageView from '@comp/layouts/PageView'
import { getContract, getContracts, createContract, updateContract, approveContract } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
export default {
  name: 'Contract',
  components: {
    PageView,
    FooterToolBar,
    ContractRowProjectForm,
    ContractForm,
    AttachFilesForm,
    DetailList
  },
  mixins: [FormPageActionMixin],
  data() {
    return {
      cType: '',
      loading: false,
      model: {},
      rowFields: []
    }
  },
  computed: {
    orgCode() {
      return this.userInfo().orgCode
    }
  },
  mounted() {
    this.initModel()
  },
  updated() {
    if (this.model.id != this.$route.query.id) {
      this.initModel()
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    initModel() {
      let { id = undefined } = this.$route.query
      this.$loadData(id)
    },
    $loadData(id) {
      if (id) {
        getContract(id).then(res => {
          if (res.success) {
            this.model = {
              ...res.result
            }
            this.$refs.contract.edit(this.model)
            this.$refs.rowproj.edit(res.result)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$refs.contract.add()
      }
    },
    contractChange(v) {
      this.cType = v
      this.rowFields = formItems.filter(item => !item.contractType || item.contractType == v)
      this.$refs.rowproj.contract(v)
    },
    submitContract(data) {
      this.loading = true
      let promises
      const postData = {
        ...this.model,
        ...data
      }
      if (postData.id) {
        promises = updateContract(postData)
      } else {
        promises = createContract(postData)
      }
      promises
        .then(res => {
          if (res.success) {
            if (res.result.id && !this.model.id) {
              this.closePathFreshDetail(res.result.id)
            }
            this.$loadData(res.result.id)
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    approve(postData) {
      this.loading = true
      if (!this.model.id) {
        return
      }
      postData = {
        ...this.model,
        ...postData,
        id: this.model.id
      }
      approveContract(postData)
        .then(res => {
          if (res.success) {
            this.$loadData(this.model.id)
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 最终全页面提交
    validate(isApprove = false) {
      const canDo =
        (isApprove && this.model.allowedToApprove) || (!isApprove && (!this.model.id || this.model.editable))
      if (!canDo) {
        return
      }
      let that = this
      that.$refs.contract.form.validateFields((err, values) => {
        console.info('contract', values)
        if (!err) {
          let postData = pick(
            values,
            'id',
            // 'companyId',
            'contractTitle',
            'contractCode',
            'projectId',
            'contractTypeCode',
            'vendorId',
            'contactPerson',
            'contactPhone'
          )
          let spans = values.dateSpan.map(item => item.format('YYYY-MM-DD HH:mm:ss'))
          postData.beginDate = spans[0]
          postData.endDate = spans[1]
          that.$refs.rowproj.form.validateFields((err, values) => {
            if (!err) {
              let arData = []
              if (!(values.data instanceof Array)) {
                try {
                  arData = JSON.parse(values.data)
                } catch (error) {
                  arData = []
                }
              } else {
                arData = values.data
              }
              arData.forEach(element => {
                delete element.key
              })
              let typeFields = that.rowFields
              let fields = typeFields.filter(item => !item.justShow).map(item => item.valueKey)
              let childFields = []
              typeFields
                .filter(item => !!item.suffix || !!item.prefix)
                .forEach(item => {
                  if (!!item.suffix) {
                    childFields.push(item)
                  }
                  if (!!item.prefix) {
                    childFields.push(item)
                  }
                })
              childFields = childFields.map(item => item.valueKey) || []
              fields = fields.concat(childFields)
              for (let i = 0; i < arData.length; i++) {
                let rowData = arData[i]
                let inValidField = fields.find(item => !rowData[item])
                if (inValidField && inValidField.required) {
                  let jRow = typeFields.find(item => item.valueKey == inValidField)
                  that.$message.error(`请检查行项目【${jRow.label}】是否填写完整`)
                  return
                }
              }
              arData.map(item => {
                if (!!that.model.id) {
                  item.contractId = that.model.id
                }
                delete item.materialObj
                return item
              })
              postData.purchaseContractItems = arData
              if (!isApprove) {
                that.submitContract(postData)
              } else {
                that.approve(postData)
              }
            }
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