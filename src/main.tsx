import ReactDOM from "react-dom/client";
import App from "./App";
// Redux
import { Provider } from "react-redux";
import store from "./stores";
// UI style
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { createTheme, TextInput, MantineProvider, Select } from "@mantine/core";
import "./assets/css/tailwind.css";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
  components: {
    TextInput: TextInput.extend({
      defaultProps: {
        radius: 0,
      },
      styles: {
        input: {
          borderColor: '#000',
          borderWidth: '2px',
        },
      },
    }),
    Select: Select.extend({
      defaultProps: {
        radius: 0,
      },
      styles: {
        input: {
          borderColor: '#000',
          borderWidth: '2px',
        },
      },
    }),
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Notifications />
        <App />
      </MantineProvider>
    </Provider>
  </BrowserRouter>
);
