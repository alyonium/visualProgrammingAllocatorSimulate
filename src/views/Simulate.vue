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
            <QAbstractListModel :renderer-class="instanse" :data="store.state.queueTasks"/>
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
            <QAbstractListModel :renderer-class="instanse" :data="store.state.currentTasks"/>
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
            <QAbstractListModel :renderer-class="instanse" :data="store.state.doneTasks"/>
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
            <QAbstractListModel :renderer-class="instanse" :data="store.state.lostTasks"/>
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
import QAbstractListModel from '@/components/QAbstractListModel.vue';

class TextGetter {
  constructor(func) {
    this.innerFunc = func;
  }

  getText(el) {
    const res = this.innerFunc(el);

    return res;
  }
}

class DataMapper {
  constructor(store, mapper) {
    this.data = mapper(store);
  }

  makeData() {
    return this.data;
  }
}

export default {
  name: 'Simulate',
  components: {
    QAbstractListModel,
  },
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

    const getText = (el) => el;

    const instanse = new TextGetter(getText);

    const mapData = (savedStore) => savedStore.state.lostTasks;

    const data = new DataMapper(store, mapData);

    return {
      store,
      instanse,
      data,
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
