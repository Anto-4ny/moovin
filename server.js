const express = require('express');
const path = require('path');
const app = express();

// Serve static HTML pages
app.use(express.static(path.join(__dirname, 'public')));

// Serve React dashboard
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard/dist')));

// Support React routing
app.get('/dashboard/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
