import React from "react";

import { Refine } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  Layout,
  ThemeProvider,
  LightTheme,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";

import routerProvider from "@pankod/refine-react-router-v6";
import { dataProvider } from "./rest-data-provider";
import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import { MealList } from "./pages/MealList";

function App() {
  return (
    <ThemeProvider theme={LightTheme}>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <Refine
          notificationProvider={notificationProvider}
          Layout={Layout}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          routerProvider={routerProvider}
          dataProvider={dataProvider(
            "https://apis.career.otsimo.xyz/api/restaurant"
          )}
          resources={[
            {
              name: "listMeals",
              list: MealList,
              show: MuiInferencer,
              create: MuiInferencer,
              edit: MuiInferencer,
            },
          ]}
        />
      </RefineSnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
