<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-layout
      justify-center
      align-center
      row
      wrap
      v-if="!hasSpreadsheet"
    >
      <v-flex
        xs12
        md4
      >
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
    <v-layout
      v-else
      justify-center
    >
      <v-flex
        xs12
        md10
      >
        <v-card
          flat
          class="pa-7"
        >
          <v-layout>
            <v-sheet
              width="160px"
              v-for="(column, index) in spreadsheetData"
              :key="index"
            >
              <v-text-field
                :value="column.title"
                single-line
                full-width
                hide-details
                dense
                filled
                outlined
                class="text-center"
              ></v-text-field>
              <div
                class="spreadsheet-row"
                v-for="(row, indexRow) in column.data"
                :key="indexRow"
              >
                <div
                  class="row-number"
                  v-if="index == 0"
                >
                  {{ Number(indexRow) + 1 }}
                </div>
                <div>
                  <v-text-field
                    full-width
                    hide-details
                    dense
                    outlined
                    v-if="column.type.match(/text|number/i)"
                  />
                  <v-select
                    v-if="column.type == 'Select'"
                    full-width
                    hide-details
                    dense
                    outlined
                    :items="row.options"
                  />
                  <v-menu
                    v-if="column.type == 'Date'"
                    ref="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date"
                        readonly
                        full-width
                        hide-details
                        dense
                        outlined
                        prepend-inner-icon="event"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      no-title
                      scrollable
                      @input="menu = false"
                    />
                  </v-menu>
                </div>
              </div>
            </v-sheet>
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
    hasSpreadsheet: false,
    date: new Date().toISOString().substr(0, 10),
    menu: false
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
