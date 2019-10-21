<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>spreadsheet</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <Spreadsheet />
    </v-content>
  </v-app>
</template>

<script>
import Spreadsheet from "./views/Spreadsheet";

export default {
  name: "App",
  components: {
    Spreadsheet
  },
  data: () => ({
    //
  })
};
</script>
