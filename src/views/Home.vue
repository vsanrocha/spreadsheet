<template>
  <v-container class="fill-height" fluid>
    <v-btn color="warning" @click="hasSpreadsheet = !hasSpreadsheet" fixed
      >TESTE</v-btn
    >
    <v-layout justify-center align-center row wrap v-if="!hasSpreadsheet">
      <v-flex xs12 md4>
        <v-card>
          <v-card-title primary-title>Create a new Spreadsheet</v-card-title>
          <v-card-text>
            <AddColumn @newColumn="hasSpreadsheet = true" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else justify-center>
      <v-flex xs12 md10>
        <v-card flat class="pa-9">
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
                v-model="spreadsheetData[index].title"
              />
              <div
                class="spreadsheet-row"
                v-for="(row, indexRow) in column.rows"
                :key="indexRow"
              >
                <div class="row-number" v-if="index == 0">
                  {{ Number(indexRow) + 1 }}
                </div>
                <div>
                  <v-text-field
                    full-width
                    hide-details
                    dense
                    outlined
                    :rules="[rules.string]"
                    v-model="spreadsheetData[index].rows[indexRow]"
                    v-if="column.type == 'Text'"
                  />
                  <v-text-field
                    full-width
                    hide-details
                    dense
                    outlined
                    :rules="[validationRules.number]"
                    v-model="spreadsheetData[index].rows[indexRow]"
                    v-if="column.type == 'Number'"
                  />
                  <v-select
                    v-if="column.type == 'Select'"
                    full-width
                    hide-details
                    dense
                    outlined
                    v-model="spreadsheetData[index].rows[indexRow].data"
                    :items="row.options"
                  />
                  <v-menu
                    v-if="column.type == 'Date'"
                    :ref="`menu${index}${indexRow}`"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="spreadsheetData[index].rows[indexRow]"
                        readonly
                        full-width
                        hide-details
                        dense
                        outlined
                        prepend-inner-icon="mdi-calendar-range"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="spreadsheetData[index].rows[indexRow]"
                      no-title
                      scrollable
                      @input="$refs[`menu${index}${indexRow}`][0].save()"
                    />
                  </v-menu>
                </div>
              </div>
              <v-btn color="primary" outlined @click="addRows"
                >Add more rows</v-btn
              >
            </v-sheet>
            <v-flex xs2>
              <v-btn
                color="primary"
                fixed
                outlined
                @click.stop="showModal = true"
                >Add a new column</v-btn
              >
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="showModal" max-width="350">
      <v-card class="pa-4">
        <AddColumn @newColumn="showModal = false" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddColumn from "../components/Add-column.vue";
import { mapState } from "vuex";

export default {
  components: { AddColumn },
  data: () => ({
    hasSpreadsheet: false,
    showModal: false,
    rules: {
      required: value => !!value || "Required.",
      counter: value => value.length <= 20 || "Max 20 characters",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
      number: value => {
        const pattern = /^\w+$/;
        !!value && value.teste(pattern);
      },
      string: value => !!value && !!value.match(/^[a-zA-Z]+$/)
    },
    validationRules: {}
  }),
  computed: {
    ...mapState({
      spreadsheetData: state => state.spreadsheetData
    })
  },
  methods: {
    addRows() {
      let newArr = [...this.spreadsheetData];
      newArr.map(item => {
        const arrLength = item.rows.length;
        item.rows.length = item.rows.length + 10;
        item.rows.fill("", arrLength);
      });
      this.$store.commit("setSpreadsheetData", newArr);
    }
  },
  mounted() {
    console.log("TCL: mounted -> this.$refs.menu", this.$refs);
  }
};
</script>

<style lang="scss">
.spreadsheet-row {
  position: relative;
}
.row-number {
  position: absolute;
  left: -26px;
  top: 9px;
}
</style>
