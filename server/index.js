const express = require('express');
const app = express();
const PORT = 5000;

// Your first API endpoint
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the Node.js backend!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
