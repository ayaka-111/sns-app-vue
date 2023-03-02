<script lang="ts">
import { defineComponent, reactive } from "vue";

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
    dateToDate.date = timestamp.getDate().toString().padStart(2, "0");
    dateToDate.hour = timestamp.getHours().toString().padStart(2, "0");
    dateToDate.min = timestamp.getMinutes().toString().padStart(2, "0");
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
