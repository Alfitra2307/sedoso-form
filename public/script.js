document.getElementById('aspiration-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const aspiration = document.getElementById('aspiration').value;
    const confirmation = document.getElementById('confirmation');
  
    console.log('Mengirim data:', { name, email, aspiration });
  
    fetch('http://localhost:3000/submit-aspiration', {
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
    .then(response => response.json())
    .then(data => {
      console.log('Response:', data);
      if (data.message) {
        this.reset();
        confirmation.classList.remove('hidden');
      } else {
        throw new Error(data.error || 'Gagal mengirim aspirasi');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Terjadi kesalahan, silakan coba lagi: ' + error.message);
    });
  });