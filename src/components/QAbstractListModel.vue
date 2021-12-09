<template>
  <tbody>
    <tr v-for="el in data" :key="rendererClass.getText(el)">
      <td v-for="elProp in el" :key="elProp">
        {{ rendererClass.getText(elProp) }}
      </td>
    </tr>
  </tbody>
</template>

<script>

export default {
  name: 'QAbstractListModel',
  props: {
    data: Array,
    rendererClass: Function,
  },
};

</script>
