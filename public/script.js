document.getElementById('aspiration-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const aspiration = document.getElementById('aspiration').value.trim();
  const confirmation = document.getElementById('confirmation');
  const error = document.getElementById('error');

  // Validasi tambahan di sisi klien
  if (!name.match(/^[A-Za-z\s]+$/)) {
    error.textContent = 'Nama hanya boleh berisi huruf dan spasi.';
    error.classList.remove('hidden');
    return;
  }

  const wordCount = aspiration.split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount < 10) {
    error.textContent = 'Aspirasi harus minimal 10 kata.';
    error.classList.remove('hidden');
    return;
  }

  error.classList.add('hidden');

  console.log('Mengirim data:', { name, email, aspiration });

  fetch('/submit-aspiration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      aspiration: aspiration
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Gagal mengirim aspirasi');
    }
    return response.json();
  })
  .then(data => {
    console.log('Response:', data);
    if (data.message) {
      this.reset();
      confirmation.classList.remove('hidden');
      setTimeout(() => confirmation.classList.add('hidden'), 3000); // Sembunyikan setelah 3 detik
    } else {
      throw new Error(data.error || 'Gagal mengirim aspirasi');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    error.textContent = 'Terjadi kesalahan, silakan coba lagi: ' + error.message;
    error.classList.remove('hidden');
  });
});