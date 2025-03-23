const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/kamus-laundry', (req, res) => {
  res.render('layout', {
    title: 'Kamus Laundry',
    description: 'Cari istilah terkait laundry.',
    content: '<p>Masukkan istilah untuk mendapatkan deskripsi.</p>',
  });
});

// Dynamic route for individual terms
app.get('/kamus-laundry/:term', async (req, res) => {
  const term = req.params.term;
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    res.render('layout', {
      title: `${data.title} - Kamus Laundry`,
      description: data.extract || 'Deskripsi tidak tersedia.',
      content: `
        <h1>${data.title}</h1>
        <p>${data.extract || 'Deskripsi tidak tersedia.'}</p>
      `,
    });
  } catch (error) {
    res.status(404).render('layout', {
      title: 'Halaman Tidak Ditemukan - Kamus Laundry',
      description: 'Istilah yang Anda cari tidak ditemukan.',
      content: '<p>Istilah tidak ditemukan. Silakan coba istilah lain.</p>',
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle search redirection
app.get('/kamus-laundry/search', (req, res) => {
  const query = req.query.q.trim().toLowerCase();
  if (query) {
    res.redirect(`/kamus-laundry/${encodeURIComponent(query)}`);
  } else {
    res.redirect('/kamus-laundry');
  }
});
