<template>
  <page-view :pageTitle="pageTitle">
    <div slot="route-view">
      <a-card>
        <settlement-form
          @settlementTypeCodeChange="settlementTypeCodeChange"
          ref="settlement"
          :showSubmit="false"
        />
        <!-- table -->
        <detail-list title="结算行项目">
          <settlement-row-project-form @formChange="formChange" ref="rowproj" :showSubmit="false" />
        </detail-list>
        <template>
          <a-divider style="margin-bottom: 32px" />
          <detail-list title="结算附件">
            <attach-files-form :fileScope="'20'" ref="rowfiles" :showSubmit="false" />
          </detail-list>
        </template>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/purchase/settlements')">返回供应商结算列表</a-button>
        <template v-if="!!model.id && model.printable">
          <a-divider type="vertical" />
          <a-button type="info" @click="print">打印</a-button>
        </template>
        <template v-if="!!model.id && !!model.allowedToApprove">
          <a-divider type="vertical" />
          <a-button type="primary" @click="e=>validate(true)" :loading="loading">提交审批</a-button>
        </template>
        <template v-if="!model.id || !!model.editable">
          <a-divider type="vertical" />
          <a-button type="info" @click="e=>validate(false)" :loading="loading">暂存</a-button>
        </template>
      </footer-tool-bar>
      <print-modal :show="showPrintDialog" @close="showPrintDialog=false">
        <div>
          <h2 style="text-align:center">结算单</h2>
          <h4 style="text-align:center">{{this.model.settlementTime}}</h4>
          <a-table
            bordered
            size="small"
            :rowKey="(record,index)=>index"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
          ></a-table>
        </div>
      </print-modal>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import PrintModal from '@/views/printable/PrintModal.vue'
import SettlementForm from './modules/form/SettlementForm'
import SettlementRowProjectForm from './modules/form/SettlementRowProjectForm'
import AttachFilesForm from '@/views/modules/attachment/AttachFilesForm.vue'
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/tools/FooterToolBar'
import JBankSelectTag from '@/components/selector/JBankSelectTag'
import PageView from '@comp/layouts/PageView'
import { getSettlements, approveSettlement, getSettlement, createSettlement, updateSettlement } from '@/api/api'
import { formItems } from './modules/formOptions'
import { mapActions, mapGetters, mapState } from 'vuex'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
import { columns, numToCNY } from './print/helper.js'
import moment from 'moment'
export default {
  name: 'Settlement',
  components: {
    PageView,
    FooterToolBar,
    SettlementRowProjectForm,
    SettlementForm,
    AttachFilesForm,
    DetailList,
    PrintModal
  },
  mixins: [FormPageActionMixin],
  data() {
    let moneyDiv = value => <div style="text-align:left">{value}</div>
    return {
      cType: '',
      showPrintDialog: false,
      loading: false,
      model: {},
      columns: columns(moneyDiv),
      rowFields: []
    }
  },
  computed: {
    pageTitle() {
      return this.model.id ? '编辑供应商结算' : '新建供应商结算'
    },
    orgCode() {
      return this.userInfo().orgCode
    },
    dataSource() {
      let data = this.model.vendorSettlementItems || []
      data.push({
        vendorId: '合计人民币（大写）',
        isTotal: true,
        totalAmount: '￥' + this.model.totalAmount,
        materialId_dictText: numToCNY(this.model.totalAmount)
      })
      return data
    },
    nowDate() {
      return moment().format('YYYY-MM-DD')
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
    print() {
      this.showPrintDialog = true
    },
    initModel() {
      let { id = undefined } = this.$route.query
      if (id) {
        this.$loadData(id)
      } else {
        this.$refs.settlement.add()
      }
    },
    $loadData(id) {
      getSettlement(id).then(res => {
        if (res.success) {
          this.model = {
            ...res.result,
            id
          }
          this.$refs.settlement.edit(this.model)
          let items = this.model.vendorSettlementItems.map(item => {
            return {
              ...item,
              key: item.id,
              materialName: item.materialName
            }
          })
          this.$refs.rowproj.edit(items)
          this.$refs.rowfiles.edit(res.result)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    formChange(rows) {
      let totalAmount = rows.map(item => item.totalAmount).reduce((n, p) => Number(n) + Number(p), 0)
      this.$refs.settlement.totalChange(totalAmount)
    },
    settlementTypeCodeChange(v) {
      this.cType = v
      this.rowFields = formItems.filter(item => !item.settlementTypeCode || item.settlementTypeCode == v)
      this.$refs.rowproj.settlementType(v)
    },
    submitSettlement(postData) {
      this.loading = true
      let promises
      if (this.model.id) {
        promises = updateSettlement({
          ...postData,
          id: this.model.id
        })
      } else {
        promises = createSettlement(postData)
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
      approveSettlement(postData)
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
    validate(isApprove) {
      const canDo =
        (isApprove && this.model.allowedToApprove) || (!isApprove && (!this.model.id || this.model.editable))
      if (!canDo) {
        return
      }
      let that = this
      that.$refs.settlement.form.validateFields((err, values) => {
        console.info('settlement', values)
        if (!err) {
          let postData = pick(values, 'id', 'vendorId', 'totalAmount', 'settlementTime', 'settlementTypeCode')
          postData.settlementTime = postData.settlementTime + ' 00:00:00'
          delete postData.fiscalYear
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
              postData.vendorSettlementItems = arData
              that.$refs.rowfiles.form.validateFields((errrr, files) => {
                if (!errrr) {
                  let arData = []
                  if (!(files.data instanceof Array)) {
                    try {
                      arData = JSON.parse(files.data)
                    } catch (error) {
                      arData = []
                    }
                  } else {
                    arData = files.data
                  }
                  arData.forEach(element => {
                    element.ossFileId = element.id
                    delete element.key
                    delete element.id
                  })
                  postData.attachments = arData
                }
                if (!isApprove) {
                  that.submitSettlement(postData)
                } else {
                  that.approve(postData)
                }
              })
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