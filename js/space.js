document.getElementById('btnBuscar').addEventListener('click', function () {
    const query = document.getElementById('inputBuscar').value;
  
    if (query.trim() === '') {
      alert('Por favor, ingresa un término de búsqueda.');
      return;
    }
  
    // Construir la URL con el parámetro de búsqueda
    const url = `https://images-api.nasa.gov/search?q=${query}`;
  
    // Realizar la solicitud a la API de la NASA
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Limpiar el contenedor antes de mostrar nuevos resultados
        const contenedor = document.getElementById('contenedor');
        contenedor.innerHTML = '';
  
        // Verificar si hay resultados
        if (data.collection.items.length === 0) {
          contenedor.innerHTML = '<p>No se encontraron imágenes para la búsqueda realizada.</p>';
          return;
        }
  
        // Crear una fila de Bootstrap para las tarjetas
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('row', 'g-3');
  
        // Iterar sobre los resultados y crear las tarjetas
        data.collection.items.forEach((item, index) => {
          const imageUrl = item.links ? item.links[0].href : '';
          const title = item.data[0].title || 'Sin título';
          const description = item.data[0].description || 'Sin descripción';
          const date = item.data[0].date_created || 'Fecha no disponible';
  
          // Crear la tarjeta
          const cardDiv = document.createElement('div');
          cardDiv.classList.add('col-md-4'); // Tres tarjetas por fila
  
          cardDiv.innerHTML = `
            <div class="card h-100">
              <img src="${imageUrl}" class="card-img-top" alt="${title}">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <div class="card-text" style="max-height: 150px; overflow-y: auto;">
                  ${description}
                </div>
              </div>
              <div class="card-footer">
                <small class="text-muted">Fecha: ${new Date(date).toLocaleDateString()}</small>
              </div>
            </div>
          `;
  
          // Añadir la tarjeta a la fila
          rowDiv.appendChild(cardDiv);
  
          // Cada 3 tarjetas, crear una nueva fila
          if ((index + 1) % 3 === 0) {
            contenedor.appendChild(rowDiv);
            rowDiv = document.createElement('div');
            rowDiv.classList.add('row', 'g-3');
          }
        });
  
        // Añadir la fila al contenedor si hay elementos restantes
        if (rowDiv.children.length > 0) {
          contenedor.appendChild(rowDiv);
        }
      })
      .catch(error => {
        console.error('Error al realizar la solicitud a la API de la NASA:', error);
        const contenedor = document.getElementById('contenedor');
        contenedor.innerHTML = '<p>Ocurrió un error al obtener los datos.</p>';
      });
  });