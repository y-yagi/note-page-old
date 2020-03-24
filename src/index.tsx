import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import "./index.css";
import "semantic-ui-css/semantic.css";
import * as serviceWorker from "./serviceWorker";
import { makeMainRoutes } from "./routes";

Sentry.init({
  dsn: "https://539da2f5e0eb4ed8be5a977b25f9350a@sentry.io/1784876",
});

const routes = makeMainRoutes();
ReactDOM.render(routes, document.getElementById("root"));

serviceWorker.register();
