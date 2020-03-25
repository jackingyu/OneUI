<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form :form="jform" layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="合同实施内容">
              <a-input v-model="queryParam.contractContent" placeholder="请填写合同实施内容" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="供应商">
              <a-select
                v-model="queryParam.vendorId"
                placeholder="请选择供应商"
                :filterOption="false"
                :showSearch="true"
                @search="fetchVendorList"
              >
                <a-select-option
                  v-for="(vendor, index) in vendors"
                  :key="index"
                  :value="vendor.id"
                >{{vendor.vendorName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label>
              <a-range-picker
                v-decorator="['settlementTime',{rules: [{ required: true, message: '请选择生效日期'}]}]"
                format="YYYY-MM-DD"
                @change="settlementTimeChange"
                :placeholder="['开始时间', '结束时间']"
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
        <!-- <span slot="date" slot-scope="text, record">{{record.createTime + '~' + record.endDate}}</span> -->
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
import { createMaterial, updateMaterial, getVendors } from '@/api/api'
import Rest from '@/config/api-mapper.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import moment from 'moment'
export default {
  name: 'SettlementList',
  mixins: [JeecgListMixin],
  components: {
    // ProjectModal,
    JInput
  },
  data() {
    let now = moment()
    let to = now.format('YYYY-MM-DD+HH:mm:ss')
    let from = now.add(-1, 'year').format('YYYY-MM-DD+HH:mm:ss')
    return {
      description: '',
      queryParam: {},
      materialGroups: [],
      oneTimeFlags: [],
      vendors: [],
      queryParam: {
        settlementTime_start: from,
        settlementTime_end: to
      },
      columns: [
        {
          title: '结算单号',
          align: 'center',
          width: 160,
          dataIndex: 'vendorSettlementId'
        },
        {
          title: '行项目',
          align: 'center',
          dataIndex: 'contractItemNo'
        },
        {
          title: '结算时间',
          align: 'center',
          dataIndex: 'settlementTime'
        },
        {
          title: '单价',
          align: 'center',
          dataIndex: 'unitPrice'
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'unitCode_dictText'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'quantity'
        },
        {
          title: '合价',
          align: 'center',
          dataIndex: 'totalAmount'
        },
        {
          title: '物料',
          align: 'center',
          dataIndex: 'materialId_dictText'
        },
        {
          title: '合同实施内容',
          align: 'center',
          dataIndex: 'contractContent'
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
        list: Rest.GET_SETTLEMENTS_ITEMS.url
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    this.fetchVendorList()
    let to = moment()
    let from = moment().add(-1, 'year')
    this.jform.setFieldsValue({
      settlementTime: [from, to]
    })
  },
  methods: {
    fetchVendorList(word) {
      getVendors({ vendorName: word ? `*${word}*` : '' })
        .then(res => {
          if (res.success) {
            this.vendors = res.result.records
          }
        })
        .finally(() => {})
    },
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
    settlementTimeChange(momentArr, strArr) {
      if (momentArr.length == 0) {
        this.queryParam.settlementTime_start = ''
        this.queryParam.settlementTime_end = ''
      } else {
        let msArr = momentArr.map(item => item.format('YYYY-MM-DD HH:mm:ss'))
        this.queryParam.settlementTime_start = msArr[0]
        this.queryParam.settlementTime_end = msArr[1]
      }
    },
    handleEdit(record) {
      this.$router.push({
        path: '/purchase/settlement',
        query: {
          id: record.vendorSettlementId
        }
      })
    },
    handleAdd() {
      this.$router.push({ path: '/purchase/settlement' })
    },
    handleDelete(id) {}
  }
}
</script>
<style lang="scss" scoped>
@import '~@assets/less/common.less';
</style>
