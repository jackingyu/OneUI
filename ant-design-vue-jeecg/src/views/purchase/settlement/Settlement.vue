<template>
  <page-view :pageTitle="pageTitle">
    <div slot="route-view">
      <a-card>
        <settlement-form @contractChange="contractChange" ref="contract" :showSubmit="false" />
        <!-- table -->
        <detail-list title="结算行项目">
          <settlement-row-project-form ref="rowproj" :showSubmit="false" />
        </detail-list>
        <template v-if="!!model.id">
          <a-divider style="margin-bottom: 32px" />
          <detail-list v-if="!!model.id" title="结算附件">
            <attach-files-form ref="rowfiles" :showSubmit="false" />
          </detail-list>
        </template>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="primary" @click="validate" :loading="loading">提交审批</a-button>
        <a-divider type="vertical" />
        <a-button type="info" @click="validate" :loading="loading">暂存</a-button>
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import SettlementForm from './modules/form/SettlementForm'
import SettlementRowProjectForm from './modules/form/SettlementRowProjectForm'
import AttachFilesForm from './modules/form/AttachFilesForm'
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import { getContract, getContracts, createContract, updateContract } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'Settlement',
  components: {
    PageView,
    FooterToolBar,
    SettlementRowProjectForm,
    SettlementForm,
    AttachFilesForm,
    DetailList
  },
  data() {
    return {
      cType: '',
      loading: false,
      model: {},
      rowFields: []
    }
  },
  computed: {
    pageTitle() {
      return this.model.id ? '编辑供应商结算' : '新建供应商结算'
    },
    orgCode() {
      return this.userInfo().orgCode
    }
  },
  mounted() {
    this.initModel()
  },
  created() {},
  methods: {
    ...mapGetters(['userInfo']),
    initModel() {
      let { id = undefined } = this.$route.query
      if (id) {
        // getContract(id).then(res => {
        //   if (res.success) {
        //     this.model = {
        //       ...res.result,
        //       id
        //     }
        //     this.$refs.contract.edit(this.model)
        //     this.$refs.rowproj.edit(res.result.purchaseContractItems)
        //   } else {
        //     this.$message.warning(res.message)
        //   }
        // })
      } else {
        this.$refs.contract.add()
      }
    },
    contractChange(v) {
      this.cType = v
      this.rowFields = formItems.filter(item => !item.contractType || item.contractType == v)
      this.$refs.rowproj.contract(v)
    },
    submitContract(postData) {
      this.loading = true
      let promises
      if (postData.id) {
        promises = updateContract(postData)
      } else {
        promises = createContract(postData)
      }
      promises
        .then(res => {
          if (res.success) {
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
    validate() {
      let that = this
      that.$refs.contract.form.validateFields((err, values) => {
        console.info('contract', values)
        if (!err) {
          let postData = pick(
            values,
            'id',
            'companyId',
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
              let childFields =
                typeFields.filter(item => !!item.suffix || !!item.prefix).map(item => item.valueKey) || []
              fields = fields.concat(childFields)
              for (let i = 0; i < arData.length; i++) {
                let rowData = arData[i]
                let inValidField = fields.find(item => !rowData[item])
                if (inValidField) {
                  let jRow = typeFields.find(item => item.valueKey == inValidField)
                  that.$message.error(`请检查行项目【${jRow.label}】是否填写完整`)
                  return
                }
              }
              arData.map(item => {
                item.materialId = item.materialCode
                return item
              })
              postData.purchaseContractItems = arData
              that.submitContract(postData)
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