document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission

  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    fetchDescription(query);
  } else {
    alert('Silakan masukkan istilah untuk dicari.');
  }
});

function fetchDescription(query) {
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Istilah tidak ditemukan.');
      }
      return response.json();
    })
    .then(data => {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.extract || 'Deskripsi tidak tersedia.'}</p>
      `;
    })
    .catch(error => {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
    });
}
