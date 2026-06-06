---
creation_date: 2026-06-06
modification_date: 2026-06-06
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: JavaScript - Capture R Shiny Websocket Messages
tags:
  - Type/Code
  - Status/Complete
  - Topic/R
  - Topic/Development
aliases:
  - Capture R Shiny Websocket Messages
---

```javascript
// run with: node capture_ws.js
const CDP = require('chrome-remote-interface');
const fs = require('fs');
const out = fs.createWriteStream('ws_frames.jsonl', { flags: 'a' });

CDP(async (client) => {
  const { Network } = client;
  await Network.enable();
  Network.webSocketFrameReceived(({ requestId, timestamp, response }) => {
    out.write(JSON.stringify({ dir: 'recv', requestId, timestamp, payload: response.payloadData }) + '\n');
  });
  Network.webSocketFrameSent(({ requestId, timestamp, response }) => {
    out.write(JSON.stringify({ dir: 'sent', requestId, timestamp, payload: response.payloadData }) + '\n');
  });
}).on('error', console.error);

```
