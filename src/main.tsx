import ReactDOM from "react-dom/client";
import App from "./App";
// Redux
import { Provider } from "react-redux";
import store from "./stores";
// UI style
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import './assets/css/tailwind.css'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <MantineProvider>
      <App />
    </MantineProvider>
  </Provider>
);
