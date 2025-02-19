fetch('/visit')
  .then(res => res.json())
  .then(data => {
    document.getElementById('counter').textContent = data.count;
  });
