<template>
  <page-view :pageTitle="pageTitle">
    <div slot="route-view">
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card
            :hasFooter="false"
            :hasContent="false"
            :loading="loading"
            title="当年付款总额"
            :total="`￥${this.model.paidAmount||0}`"
          ></chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card
            :hasFooter="false"
            :hasContent="false"
            :loading="loading"
            title="当年结算总额"
            :total="`￥${this.model.settlementAmount||0}`"
          ></chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card
            :hasFooter="false"
            :hasContent="false"
            :loading="loading"
            title="上年度未收到发票结转"
            :total="`￥${this.model.cfUninvoicedAmount||0}`"
          ></chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card
            :hasFooter="false"
            :hasContent="false"
            :loading="loading"
            title="上年度未付款结转"
            :total="`￥${this.model.cfUnpaidAmount||0}`"
          ></chart-card>
        </a-col>
      </a-row>

      <a-card>
        <!-- table -->
        <detail-list title="供应商付款">
          <VendorPayTable ref="tableVendor" />
        </detail-list>
        <a-divider style="margin-top:12px" />
        <detail-list title="供应商发票">
          <VendorInvoiceTable ref="tableVendor2" />
        </detail-list>
        <a-divider style="margin-top:12px" />
        <detail-list title="供应商结算">
          <!-- <VendorSettlementTable ref="tableVendor3" /> -->
          <VendorSettlementItemTable ref="tableVendor3" />
        </detail-list>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar>
        <a-button type="info" @click="back('/vendor/report')">返回供应商总账报表</a-button>
      </footer-tool-bar>
    </div>
  </page-view>
</template>

<script>
import pick from 'lodash.pick'
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/tools/FooterToolBar'
import PageView from '@comp/layouts/PageView'
import VendorPayTable from './vendorTables/VendorPayTable'
import VendorInvoiceTable from './vendorTables/VendorInvoiceTable'
// import VendorSettlementTable from './vendorTables/VendorSettlementTable'
import VendorSettlementItemTable from './vendorTables/VendorSettlementItemTable'
// import {
//   getVendorPayReport,
//   getVendorSettlementsReport,
//   getVendorSettlementItemReport,
//   getVendorInvoiceReport,
//   getSaleBillingReport
// } from '@/api/api'
import ChartCard from '@/components/ChartCard'
import { mapActions, mapGetters, mapState } from 'vuex'
import FormPageActionMixin from '@/mixins/FormPageActionMixin'
import moment from 'moment'
export default {
  name: 'VendorReport',
  components: {
    ChartCard,
    PageView,
    FooterToolBar,
    DetailList,
    VendorPayTable,
    VendorInvoiceTable,
    VendorSettlementItemTable
  },
  mixins: [FormPageActionMixin],
  data() {
    return {
      loading: false,
      model: {}
    }
  },
  computed: {
    pageTitle() {
      return this.model.vendorName
        ? `${this.model.vendorName} - ${this.model.year ? this.model.year + '财年' : ''}报表明细`
        : '供应商报表明细'
    }
  },
  mounted() {
    this.initModel()
  },
  activated() {
    this.initModel()
  },
  methods: {
    initModel() {
      let { year, vendorId } = this.$route.query
      if (!!year && !!vendorId) {
        this.model = this.$route.query || {}
        this.$loadData(year, vendorId)
      }
    },
    $loadData(year, vendorId) {
      this.$refs.tableVendor.loadTable(year, vendorId)
      this.$refs.tableVendor2.loadTable(year, vendorId)
      this.$refs.tableVendor3.loadTable(year, vendorId)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 24px;
}
</style>