import ReactDOM from "react-dom/client";
import App from "./App";
// Redux
import { Provider } from "react-redux";
import store from "./stores";
// UI style
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import './assets/css/tailwind.css'
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Provider store={store}>
      <MantineProvider>
        <Notifications />
        <App />
      </MantineProvider>
    </Provider>
  </BrowserRouter>
);
