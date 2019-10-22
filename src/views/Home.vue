<template>
  <v-container class="fill-height" fluid>
    <v-layout justify-center align-center row wrap v-if="!hasSpreadsheet">
      <v-flex xs12 md4>
        <v-card>
          <v-card-title primary-title>
            Create a new Spreadsheet
          </v-card-title>
          <v-card-text>
            <AddColumn @newColumn="hasSpreadsheet = true" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else justify-center>
      <v-flex xs12 md10>
        <v-card flat color="pink lighten-4">
          <v-layout row wrap>
            <v-flex xs2 v-for="(column, index) in spreadsheetData" :key="index">
              <v-subheader class="text-center">{{ column.title }}</v-subheader>
              <div
                class="spreadsheet-row"
                v-for="(row, indexRow) in column.data"
                :key="indexRow"
              >
                <div class="row-number" v-if="index == 0">
                  {{ Number(indexRow) + 1 }}
                </div>
                <v-card outlined>
                  <v-text-field
                    full-width
                    hide-details
                    dense
                    v-if="column.type.match(/text|number/i)"
                  />
                  <v-select
                    v-if="column.type == 'Select'"
                    :options="row.options"
                  />
                </v-card>
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AddColumn from "../components/Add-column.vue";
import { mapState } from "vuex";

export default {
  components: { AddColumn },
  data: () => ({
    hasSpreadsheet: true
  }),
  computed: {
    ...mapState({
      spreadsheetData: state => state.spreadsheetData
    })
  }
};
</script>

<style lang="scss">
.spreadsheet {
  display: flex;
  padding-left: 35px;
  .custom-select,
  .form-control {
    border-radius: 0;
    &:focus {
      box-shadow: none;
    }
  }
}
.spreadsheet-column {
  display: flex;
  flex-direction: column;
  width: 24%;
}
.spreadsheet-row {
  position: relative;
}
.row-number {
  position: absolute;
  left: -19px;
  top: 6px;
}
</style>
