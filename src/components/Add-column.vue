<template>
  <v-layout warp column>
    <v-text-field
      label="Column title"
      v-model="newColumn.title"
      :rules="[rules.required]"
    />
    <v-select
      :items="typesOptions"
      v-model="newColumn.type"
      label="Column type"
      :rules="[rules.required]"
    ></v-select>
    <v-card column outlined v-if="newColumn.type == 'Select'">
      <v-list disabled>
        <v-subheader>Dropdown items</v-subheader>
        <v-list-item-group>
          <v-list-item
            dense
            v-for="(item, index) in selectOptions"
            :key="index"
          >
            <v-list-item-icon>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-card-text>
        <v-text-field
          label="New item"
          v-model="newOption"
          @keydown.enter="createOptionsList"
          append-icon="mdi-plus-circle"
          @click:append="createOptionsList"
        />
      </v-card-text>
    </v-card>
    <v-checkbox label="This column is required" v-model="newColumn.required" />
    <v-btn color="primary" @click="createNewColumn" :disabled="disableBtn"
      >Create a column</v-btn
    >
  </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({
    selectOptions: [],
    newOption: "",
    newColumn: {
      title: "",
      type: "",
      required: false,
      rows: []
    },
    typesOptions: ["Date", "Select", "Text", "Number"],
    rules: {
      required: value => !!value || "Required."
    }
  }),
  computed: {
    ...mapState({
      spreadsheetData: state => state.spreadsheetData
    }),
    disableBtn() {
      return !this.newColumn.title || !this.newColumn.type;
    }
  },
  methods: {
    ...mapActions({
      commitColumn: "commitSepreadsheetData"
    }),
    createOptionsList() {
      if (!this.newOption) {
        return;
      }
      this.selectOptions.push(this.newOption);
      this.newOption = "";
    },
    createNewColumn() {
      this.newColumn.rows = this.generateRows();
      this.commitColumn(this.newColumn);
      this.$emit("success");
    },
    generateRows() {
      let rows = [];
      let length = this.spreadsheetData.length
        ? this.spreadsheetData[0].rows.length
        : 10;
      for (let i = 0; i < length; i++) {
        if (this.newColumn.type == "Select") {
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
