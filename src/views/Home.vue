<template>
  <v-container class="fill-height" fluid>
    <v-layout justify-center align-center row wrap>
      <v-flex xs12 sm6 md4>
        <v-card>
          <v-card-title primary-title>Create a new Spreadsheet</v-card-title>
          <v-card-text>
            <AddColumn @success="$router.push('spreadsheet')" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AddColumn from "../components/Add-column.vue";

export default {
  components: { AddColumn }
};
</script>
