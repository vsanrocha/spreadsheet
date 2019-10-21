<template>
  <v-container
    justify="center"
    align="center"
  >
    <v-card max-width="344">
      <v-card-title primary-title>
        Create a new Spreadsheet
      </v-card-title>
      <v-card-text>
        <AddColumn />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import AddColumn from "../components/Add-column.vue";
export default {
  components: { AddColumn }
};
</script>
