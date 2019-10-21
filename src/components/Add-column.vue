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
export default {
  data: () => ({
    columnTitle: "",
    selectedType: "",
    selectOptions: [],
    newOption: "",
    isRequired: false,
    typesOptions: ["Date", "Select", "Text", "Number"]
  }),
  methods: {
    createOptionsList() {
      this.selectOptions.push(this.newOption);
      this.newOption = "";
    },
    createNewColumn() {
      let newColumn = {};
      newColumn.title = this.columnTitle;
      newColumn.type = this.selectedType;
      newColumn.required = this.isRequired;
      newColumn.data = this.generateRows(this.selectedType, this.selectOptions);
      this.$emit("newColumn", newColumn);
    },
    generateRows(type, options) {
      let rows = {};
      for (let i = 0; i < 9; i++) {
        if (type.match(/text|number/)) {
          rows[i] = "";
        } else {
          rows[i] = { data: "", options: options };
        }
      }
      return rows;
    }
  }
};
</script>
