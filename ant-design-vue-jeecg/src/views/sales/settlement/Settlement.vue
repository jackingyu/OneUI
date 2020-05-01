<template>
  <page-view :pageTitle="pageTitle">
    <div slot="route-view">
      <a-card>
        <settlement-form
          @salesSettlementTypeCodeChange="salesSettlementTypeCodeChange"
          ref="settlement"
          :showSubmit="false"
        />
        <!-- table -->
        <detail-list title="结算行项目" v-show="hasRowItems">
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
        <a-button type="info" @click="back('/sales/settlements')">返回销售结算列表</a-button>

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
import SettlementForm from './modules/form/SettlementForm'
import SettlementRowProjectForm from './modules/form/SettlementRowProjectForm'
import AttachFilesForm from './modules/form/AttachFilesForm'
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import {
  approveSaleSettlement,
  getSaleSettlements,
  getSaleSettlement,
  createSaleSettlement,
  updateSaleSettlement
} from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
import moment from 'moment'
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
    hasRowItems() {
      return this.cType == '2'
    },
    pageTitle() {
      return this.model.id ? '编辑销售结算' : '新建销售结算'
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
        this.$loadData(id)
      } else {
        this.$refs.settlement.add()
      }
    },
    $loadData(id) {
      getSaleSettlement(id).then(res => {
        if (res.success) {
          this.model = {
            ...res.result,
            id
          }
          this.$refs.settlement.edit(this.model)
          this.$refs.rowproj.edit(res.result.salesBillingDocumentItems)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    salesSettlementTypeCodeChange(v) {
      this.cType = v
      this.rowFields = formItems.filter(item => !item.settlementType || item.settlementType == v)
      this.$refs.rowproj.settlementType(v)
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
      approveSaleSettlement(postData)
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
    submitSettlement(postData) {
      this.loading = true
      let promises
      if (this.model.id) {
        postData.id = this.model.id
        promises = updateSaleSettlement(postData)
      } else {
        promises = createSaleSettlement(postData)
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
    // 最终全页面提交
    validate(isApprove) {
      const canDo =
        (isApprove && this.model.allowedToApprove) || (!isApprove && (!this.model.id || this.model.editable))
      if (!canDo) {
        return
      }
      let that = this
      that.$refs.settlement.form.validateFields((err, values) => {
        if (!err) {
          let postData = {
            ...values
          }
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
                if (element.clearPeriod) {
                  element.clearPeriod = moment(element.clearPeriod + '-01').format('M')
                }
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
              postData.salesBillingDocumentItems = arData
              if (!isApprove) {
                that.submitSettlement(postData)
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