<template>
  <div class="page-wrapper">
    <a-row :gutter="[16, 16]">
        <a-col span="12" offset="6">
        <label>Очередь задач</label>
        <div class="block-wrapper">
          <table v-if="store.state.queueTasks.length > 0">
            <tr>
              <th>Имя</th>
              <th>Размер</th>
              <th>Время начала</th>
              <th>Длительность</th>
            </tr>
            <tr v-for="task in store.state.queueTasks" :key="task.name">
              <td>
                {{ task.name }}
              </td>
              <td> {{ task.size }}</td>
              <td>{{ task.maxWaitTime }}</td>
              <td>{{ task.runTime }}</td>
            </tr>
          </table>
          <div v-else class="empty">
            Пусто
          </div>
        </div>
      </a-col>

          <a-col span="12" offset="6">
        <label>Выполняемые задачи</label>
        <p>
          Используемая память: {{store.getters.memoryUsage}} / {{store.state.memoryLimit}}
        </p>
        <div class="block-wrapper">
          <table v-if="store.state.currentTasks.length > 0">
            <tr>
              <th>Имя</th>
              <th>Размер</th>
              <th>Время начала</th>
              <th>Длительность</th>
            </tr>
            <tr v-for="task in store.state.currentTasks" :key="task.name">
              <td>
                {{ task.name }}
              </td>
              <td> {{ task.size }}</td>
              <td>{{ task.maxWaitTime }}</td>
              <td>{{ task.runTime }}</td>
            </tr>
          </table>
          <div v-else class="empty">
            Пусто
          </div>
        </div>
      </a-col>

      <a-col span="12" offset="6">
        <label>Завершенные задачи</label>
        <div class="block-wrapper">
          <table v-if="store.state.doneTasks.length > 0">
            <tr>
              <th>Имя</th>
              <th>Размер</th>
              <th>Время начала</th>
              <th>Длительность</th>
            </tr>
            <tr v-for="task in store.state.doneTasks" :key="task.name">
              <td>
                {{ task.name }}
              </td>
              <td> {{ task.size }}</td>
              <td>{{ task.maxWaitTime }}</td>
              <td>{{ task.runTime }}</td>
            </tr>
          </table>
          <div v-else class="empty">
            Пусто
          </div>
        </div>
      </a-col>

      <a-col span="12" offset="6">
        <label>Истекло время начала выполнения</label>
        <div class="block-wrapper">
          <table v-if="store.state.lostTasks.length > 0">
            <tr>
              <th>Имя</th>
              <th>Размер</th>
              <th>Время начала</th>
              <th>Длительность</th>
            </tr>
            <tr v-for="task in store.state.lostTasks" :key="task.name">
              <td>
                {{ task.name }}
              </td>
              <td> {{ task.size }}</td>
              <td>{{ task.maxWaitTime }}</td>
              <td>{{ task.runTime }}</td>
            </tr>
          </table>
          <div v-else class="empty">
            Пусто
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>

import { useStore } from 'vuex';
import { onMounted } from 'vue';

export default {
  name: 'Simulate',
  setup() {
    const store = useStore();

    const moveToDone = (task) => {
      store.commit(
        'setCurrentTasks',
        store.state.currentTasks.filter((el) => el.name !== task.name),
      );

      store.commit(
        'setDoneTasks',
        [...store.state.doneTasks, task],
      );
    };

    const moveToLost = (task) => {
      if (store.state.queueTasks.find((el) => el.name === task.name)) {
        store.commit(
          'setQueueTasks',
          store.state.queueTasks.filter((el) => el.name !== task.name),
        );

        store.commit(
          'setLostTasks',
          [...store.state.lostTasks, task],
        );
      }
    };

    const updateMemory = () => {
      const currentTasks = [...store.state.currentTasks];
      let queueTasks = [...store.state.queueTasks];
      let { freeMemory } = store.getters;
      store.state.queueTasks.forEach((task) => {
        if (task.size < freeMemory) {
          queueTasks = queueTasks.filter((el) => el.name !== task.name);
          currentTasks.push(task);
          freeMemory -= task.size;

          setTimeout(() => moveToDone(task), task.runTime);
        }
      });
      store.commit('setQueueTasks', queueTasks);
      store.commit('setCurrentTasks', currentTasks);

      setTimeout(updateMemory, 1000);
    };

    const setLostTimers = () => {
      store.state.queueTasks.forEach((task) => {
        setTimeout(() => moveToLost(task), task.maxWaitTime);
      });
    };

    onMounted(setLostTimers);
    onMounted(updateMemory);

    return {
      store,
    };
  },
};

</script>

<style lang="scss">
.block-wrapper {
  width: 780px;
  border: 1px solid #40a9ff;
  min-height: 30px;
  background: #fff;
  border-radius: 4px;
  padding: 8px;
}

.empty {
  text-align: center;
}

table {
  width: 100%;
}
</style>
