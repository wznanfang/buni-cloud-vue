<template>
  <div class="pagination-container">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecords"
        v-bind="$attrs"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'PaginationComponent',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    totalRecords: {
      type: Number,
      required: true
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50, 100]
    }
  },
  methods: {
    handleSizeChange(size) {
      this.$emit('update:pageSize', size);
      this.$emit('change');
    },
    handleCurrentChange(page) {
      this.$emit('update:currentPage', page);
      this.$emit('change');
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  text-align: right;
}
</style>
