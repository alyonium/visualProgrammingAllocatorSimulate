<template>
  <div class="page-wrapper">
    <a-form :model="formState" layout="vertical">
      <a-row :gutter="[16, 16]">
        <a-col span="6" offset="6">
          <a-form-item label="Количество памяти (байт)">
            <a-input-number v-model:value="formState.memoryLimit" />
          </a-form-item>
        </a-col>

        <a-col span="6">
          <a-form-item label="Количество задач">
            <a-input-number v-model:value="formState.tasksCount" />
          </a-form-item>
        </a-col>

        <a-col span="6" offset="6">
          <a-form-item label="Размер задачи от (байт)">
            <a-input-number v-model:value="formState.sizeFrom" />
          </a-form-item>
        </a-col>

        <a-col span="6">
          <a-form-item label="Размер задачи до (байт)">
            <a-input-number v-model:value="formState.sizeTo" />
          </a-form-item>
        </a-col>

        <a-col span="6" offset="6">
          <a-form-item label="Время ожидания от (мс)">
            <a-input-number v-model:value="formState.maxWaitTimeFrom" />
          </a-form-item>
        </a-col>

        <a-col span="6">
          <a-form-item label="Время ожидания до (мс)">
            <a-input-number v-model:value="formState.maxWaitTimeTo" />
          </a-form-item>
        </a-col>

        <a-col span="6" offset="6">
          <a-form-item label="Время выполнения от (мс)">
            <a-input-number v-model:value="formState.runTimeFrom" />
          </a-form-item>
        </a-col>

        <a-col span="6">
          <a-form-item label="Время выполнения до (мс)">
            <a-input-number v-model:value="formState.runTimeTo" />
          </a-form-item>
        </a-col>

        <a-col span="24">
          <div class="button-wrapper">
            <a-button type="primary" @click="onSubmit">Начать</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>

import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { getRandomInt } from '@/utils';

export class Task {
  constructor({
    sizeFrom, sizeTo, maxWaitTimeFrom, maxWaitTimeTo, runTimeFrom, runTimeTo,
  }) {
    this.name = uuidv4();
    this.size = getRandomInt(sizeFrom, sizeTo);
    this.maxWaitTime = getRandomInt(maxWaitTimeFrom, maxWaitTimeTo);
    this.runTime = getRandomInt(runTimeFrom, runTimeTo);
  }
}

export default {
  name: 'Home',
  setup() {
    const store = useStore();
    const router = useRouter();
    const formState = reactive({
      memoryLimit: 50,
      tasksCount: 10,
      sizeFrom: 20,
      sizeTo: 30,
      maxWaitTimeFrom: 10000,
      maxWaitTimeTo: 40000,
      runTimeFrom: 5000,
      runTimeTo: 10000,
    });
    const onSubmit = () => {
      store.commit('setMemoryLimit', formState.memoryLimit);
      store.commit('setQueueTasks',
        new Array(formState.tasksCount)
          .fill(0)
          .map(() => new Task({
            sizeFrom: formState.sizeFrom,
            sizeTo: formState.sizeTo,
            maxWaitTimeFrom: formState.maxWaitTimeFrom,
            maxWaitTimeTo: formState.maxWaitTimeTo,
            runTimeFrom: formState.runTimeFrom,
            runTimeTo: formState.runTimeTo,
          })));

      router.push('/simulate');
    };
    return {
      formState,
      onSubmit,
    };
  },
};
</script>

<style lang="scss">
.ant-form-item-label {
  text-align: center !important;
}

.ant-form-item-control-input-content {
  justify-content: center;
  display: flex;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}
</style>
