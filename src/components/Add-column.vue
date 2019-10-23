<template>
  <v-layout warp column>
    <v-text-field label="Column title" v-model="columnTitle" />
    <v-select
      :items="typesOptions"
      v-model="selectedType"
      label="Column type"
    ></v-select>
    <v-card column outlined v-if="selectedType == 'Select'">
      <v-subheader>Enter a list of options</v-subheader>
      <v-list v-for="(item, index) in selectOptions" :key="index">
        <v-list-item v-text="item" />
      </v-list>

      <v-card-text>
        <v-text-field
          label="New item"
          v-model="newOption"
          @keydown.enter="createOptionsList"
        />
      </v-card-text>
    </v-card>
    <v-checkbox label="This column is required" v-model="isRequired" />
    <v-btn color="primary" @click="createNewColumn">Create a column</v-btn>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";
import { mapState } from "vuex";
export default {
  data: () => ({
    columnTitle: "",
    selectedType: "",
    selectOptions: [],
    newOption: "",
    isRequired: false,
    typesOptions: ["Date", "Select", "Text", "Number"]
  }),
  computed: {
    ...mapState({
      spreadsheetData: state => state.spreadsheetData
    })
  },
  methods: {
    ...mapActions({
      commitColumn: "commitSepreadsheetData"
    }),
    createOptionsList() {
      this.selectOptions.push(this.newOption);
      this.newOption = "";
    },
    createNewColumn() {
      let newColumn = {};
      newColumn.title = this.columnTitle;
      newColumn.type = this.selectedType;
      newColumn.required = this.isRequired;
      newColumn.rows = this.generateRows();
      this.commitColumn(newColumn);
      this.$emit("newColumn");
    },
    generateRows() {
      let rows = [];
      console.log(
        "TCL: generateRows -> this.spreadsheetData",
        this.spreadsheetData
      );
      let length = this.spreadsheetData.length
        ? this.spreadsheetData[0].rows.length
        : 10;
      for (let i = 0; i < length; i++) {
        if (this.selectedType == "Select") {
          rows[i] = { data: "", options: this.selectOptions };
        } else {
          rows[i] = "";
        }
      }
      return rows;
    }
  }
};
</script>
