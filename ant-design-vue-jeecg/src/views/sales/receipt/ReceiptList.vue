<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="8" :sm="12">
            <a-form-item label="客户名称">
              <j-input
                v-model="queryParam.customerName"
                placeholder="请填写客户名称"
                dictCode="vendor_group"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="12">
            <a-form-item label>
              <a-range-picker
                v-decorator="['dateSpan',{rules: [{ required: true, message: '请选择开票日期'}]}]"
                format="YYYY-MM-DD"
                :allowClear="false"
                :placeholder="['开始时间', '结束时间']"
                @change="invoiceDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="date" slot-scope="text, record">{{record.beginDate + '~' + record.endDate}}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <!-- <a-divider type="vertical" /> -->
          <a-dropdown v-if="false">
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- <project-modal ref="modalForm" @ok="modalFormOk"></project-modal> -->
  </a-card>
</template>

<script>
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
// import ProjectModal from './modules/ProjectModal'
import { putAction } from '@/api/manage'
import { createMaterial, updateMaterial, frozenBatch } from '@/api/api'
import Rest from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import moment from 'moment'
export default {
  name: 'ReceiptList',
  mixins: [JeecgListMixin],
  components: {
    // ProjectModal,
    JInput
  },
  data() {
    // let now = moment()
    // let to = now.format('YYYY-MM-DD+HH:mm:ss')
    // let from = now.add(-1, 'year').format('YYYY-MM-DD+HH:mm:ss')
    return {
      description: '',
      queryParam: {
        invoiceDate_start: '',
        invoiceDate_end: ''
      },
      materialGroups: [],
      oneTimeFlags: [],
      columns: [
        {
          title: '付款单编号',
          align: 'center',
          width: 160,
          dataIndex: 'id'
        },
        {
          title: '付款时间',
          align: 'center',
          dataIndex: 'receiptDate'
        },
        {
          title: '付款金额',
          align: 'center',
          dataIndex: 'amount'
        },
        {
          title: '付款方式',
          align: 'center',
          dataIndex: 'paymentMethodCode_dictText'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'delFlag_dictText'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170
        }
      ],
      url: {
        list: Rest.GET_SALERECEIPTS.url
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {
      initDictOptions('material_group').then(res => {
        if (res.success) {
          this.materialGroups = res.result
        }
      })
      initDictOptions('material_property').then(res => {
        if (res.success) {
          this.oneTimeFlags = res.result
        }
      })
    },
    invoiceDateChange(momentArr, strArr) {
      if (momentArr.length == 0) {
        this.queryParam.invoiceDate_start = ''
        this.queryParam.invoiceDate_end = ''
      } else {
        let msArr = momentArr.map(item => item.format('YYYY-MM-DD HH:mm:ss'))
        this.queryParam.invoiceDate_start = msArr[0]
        this.queryParam.invoiceDate_end = msArr[1]
      }
    },
    handleEdit(record) {
      // this.$refs.modalForm.edit(record)
      this.$router.push({
        path: '/sales/receipt',
        query: {
          id: record.id
        }
      })
    },
    handleAdd() {
      // this.$refs.modalForm.add()
      this.$router.push({ path: '/sales/receipt' })
    },
    handleDelete(id) {}
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
 
