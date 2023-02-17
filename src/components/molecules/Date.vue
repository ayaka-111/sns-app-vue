<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "Date",
  props: ["date"],
  setup: (props) => {
    const dateToDate = reactive({
      year: "",
      month: "",
      date: "",
      hour: "",
      min: "",
    });
    const timestamp = props.date.toDate();
    dateToDate.year = timestamp.getFullYear();
    dateToDate.month = timestamp.getMonth() + 1;
    dateToDate.date = timestamp.getDate();
    dateToDate.hour = timestamp.getHours();
    dateToDate.min = timestamp.getMinutes();
    return { dateToDate };
  },
});
</script>

<template>
  <div class="date_date">
    {{ dateToDate.month }}月 {{ dateToDate.date }}, {{ dateToDate.year }}
    {{ dateToDate.hour }}:{{ dateToDate.min }}
  </div>
</template>

<style scoped>
.date_date {
  color: #a6a6a6;
  font-size: 0.8rem;
}
</style>
