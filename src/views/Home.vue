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
                    :validate-on-blur="true"
                    :rules="[
                      rules.string,
                      column.required ? rules.required : false
                    ]"
                    v-model="spreadsheetData[index].rows[indexRow]"
                    v-if="column.type == 'Text'"
                  />
                  <v-text-field
                    full-width
                    hide-details
                    dense
                    outlined
                    :validate-on-blur="true"
                    :rules="[
                      rules.number,
                      column.required ? rules.required : false
                    ]"
                    v-model="spreadsheetData[index].rows[indexRow]"
                    v-if="column.type == 'Number'"
                  />
                  <v-select
                    v-if="column.type == 'Select'"
                    full-width
                    hide-details
                    dense
                    outlined
                    :rules="[column.required ? rules.required : false]"
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
                        full-width
                        hide-details
                        dense
                        outlined
                        :validate-on-blur="true"
                        :rules="[
                          rules.date,
                          column.required ? rules.required : false
                        ]"
                        v-mask="'####-##-##'"
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
                >Add 10 rows</v-btn
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
import { mask } from "vue-the-mask";
import AddColumn from "../components/Add-column.vue";
import { mapState } from "vuex";

export default {
  components: { AddColumn },
  directives: { mask },
  data: () => ({
    hasSpreadsheet: false,
    showModal: false,
    rules: {
      required: value => !!value || "Required.",
      number: value => {
        const pattern = /^\d+$/;
        return !value || pattern.test(value) || "Only number";
      },
      date: value => {
        const date = new Date(value);
        const day = new Date(value).getDate();
        console.log(Boolean(+date) && date.getDate() == day);
        return (
          !value || (Boolean(+date) && date.getDate() == day) || "Only date"
        );
      },
      string: value => {
        const pattern = /^[a-zA-Z\s]+$/i;
        return !value || pattern.test(value) || "Only string";
      }
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
