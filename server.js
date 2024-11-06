const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist', process.env.npm_package_name)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/guilds-retro-frontend/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error("Server startup error:", err);
});
