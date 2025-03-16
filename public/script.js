document.getElementById('aspiration-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const aspiration = document.getElementById('aspiration').value;
  const confirmation = document.getElementById('confirmation');
  const errorElement = document.getElementById('error');

  console.log('Mengirim data:', { name, email, aspiration });

  fetch('https://sedoso-form-api.vercel.app/submit-aspiration', {
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
    console.log('Response status:', response.status);
    if (!response.ok) {
      return response.text().then(text => {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch (err) {
          throw new Error(`Server returned non-JSON response: ${text}`);
        }
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Response:', data);
    if (data.message) {
      this.reset();
      confirmation.classList.remove('hidden');
      if (errorElement) errorElement.classList.add('hidden');
    } else {
      throw new Error(data.error || 'Gagal mengirim aspirasi');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    if (errorElement) {
      errorElement.textContent = 'Terjadi kesalahan: ' + error.message;
      errorElement.classList.remove('hidden');
    } else {
      alert('Terjadi kesalahan, silakan coba lagi: ' + error.message);
    }
  });
});