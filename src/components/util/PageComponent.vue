<template>
  <div class="pagination-container">
    <el-pagination
        v-model:current-page="props.currentPage"
        v-model:page-size="props.pageSize"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="props.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  'update:current-page',
  'update:page-size',
  'page-change',
]);

// 修改每页条数
const handleSizeChange = (val) => {
  emit('update:page-size', val);
  emit('page-change');
};

// 修改当前页
const handleCurrentChange = (val) => {
  emit('update:current-page', val);
  emit('page-change');
};
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
