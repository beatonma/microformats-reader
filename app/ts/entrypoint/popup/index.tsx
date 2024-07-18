import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import React from "react";
import { Popup } from "./popup";

initEntrypointUi("extension_name", "container", <Popup />);
