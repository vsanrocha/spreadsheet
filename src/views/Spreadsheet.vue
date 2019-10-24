<template>
  <v-container justify-center align-center>
    <v-layout justify-center>
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
                        @keydown.enter="
                          $refs[`menu${index}${indexRow}`][0].save()
                        "
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
              <v-btn color="primary" outlined @click="addRows" block
                >Add 10 rows</v-btn
              >
            </v-sheet>
            <v-flex xs2>
              <v-btn
                color="primary"
                fixed
                outlined
                min-height="440"
                @click.stop="showModal = true"
                >Add a new column</v-btn
              >
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-btn color="primary" @click="sendData">Send Data</v-btn>
    </v-layout>

    <v-dialog v-model="showModal" max-width="350">
      <v-card class="pa-4">
        <AddColumn @success="showModal = false" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddColumn from "../components/Add-column.vue";
import { mask } from "vue-the-mask";
import { mapState } from "vuex";

export default {
  components: { AddColumn },
  directives: { mask },
  data: () => ({
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
        return (
          !value || (Boolean(+date) && date.getDate() == day) || "Only date"
        );
      },
      string: value => {
        const pattern = /^[a-zA-Z\s]+$/i;
        return !value || pattern.test(value) || "Only string";
      }
    }
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
    },
    sendData() {
      // this.$axios.post('url-api', {data: this.spreadsheetData}).then((res) => {
      //   // doSomething
      // })
    }
  },
  created() {
    !this.spreadsheetData.length && this.$router.push("/");
  }
};
</script>

<style lang="scss">
.spreadsheet-row {
  position: relative;
}
.row-number {
  position: absolute;
  left: -35px;
  top: 0px;
  height: 40px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border: solid 1px #b7b7b7;
  border-radius: 4px;
}
</style>
