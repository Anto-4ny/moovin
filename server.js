const express = require('express');
const path = require('path');
const app = express();

// Serve HTML pages without requiring .html extension
app.get('/:page', (req, res, next) => {
  const filePath = path.join(__dirname, 'public', `${req.params.page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) next(); 
  });
});

// Serve static HTML pages and assets
app.use(express.static(path.join(__dirname, 'public')));

// Serve React dashboard statically
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard/dist')));

// Support React routing (SPA fallback)
app.get('/dashboard/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
