
import React from "react";
import ReactDOMServer from "react-dom/server";
import * as Icons from "./components/GameIcons";
import { THEMES } from "./constants";

console.log("Testing all icon components...");
for (const [name, Component] of Object.entries(Icons)) {
  try {
    const html = ReactDOMServer.renderToString(React.createElement(Component, { size: 40 }));
    if (!html.includes("<svg")) {
      console.error("FAIL on", name, "-> no svg tag");
    }
  } catch (err) {
    console.error("ERROR rendering", name, ":", err.message);
  }
}
console.log("Testing all theme buckets...");
for (const t of THEMES) {
  for (const b of t.buckets) {
    try {
      const html = ReactDOMServer.renderToString(React.createElement(b.icon, { size: 40 }));
    } catch (err) {
      console.error("ERROR rendering theme", t.name, "bucket", b.label, ":", err.message);
    }
  }
}
console.log("Done checking icons and themes!");
