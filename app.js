const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const getSearch = document.getElementById("search-by");
const paginationDiv = document.getElementById("pagination");

let currentPage = 1; // Página inicial
const resultsPerPage = 10; // Número de resultados por página

// Evento para manejar la búsqueda
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim() 
  const type = getSearch.options[getSearch.selectedIndex].value
  if (!query) return;
  currentPage = 1;
  searchBy(query, type, currentPage);
});

//evento para buscar por titulo o autor
searchBy.addEventListener("onChange", async (e) => {
  e.preventDefault();
  return getSearch.options[getSearch.selectedIndex].value;
})


//funcion para buscar
async function searchBy(query, type, page) {
    const url =`https://openlibrary.org/search.json?${type}=${encodeURIComponent(query)}&page=${page}&limit=${resultsPerPage}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.docs);
    setupPagination(data.numFound, query, type);
  } catch (error) {
    resultsDiv.innerHTML =
      "<p>Ocurrió un error al buscar. Por favor, intenta de  nuevo.</p>";
    console.error(error);
  }
}

// Función para mostrar los resultados
function displayResults(books) {
  resultsDiv.innerHTML = "";
  if (books.length === 0) {
    resultsDiv.innerHTML = "<p>No se encontraron libros.</p>";
    return;
  }
  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.innerHTML = `<h3>${book.title}</h3> <p id='author'><strong>Autor:</strong> ${book.author_name ? book.author_name.join(", ") : "Desconocido"}</p> <p><strong>Año:</strong> ${book.first_publish_year || "Desconocido"}</p>`;
    resultsDiv.appendChild(bookElement);
  });
}

function setupPagination(totalResults, query, type) {
  paginationDiv.innerHTML = ""; // Limpiar paginación existente
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  if (currentPage > 1) {
    const prevLink = document.createElement("a");
    prevLink.href = "#";
    prevLink.textContent = "← Anterior";
    prevLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage--;
      searchBy(query, type, currentPage);
    });
    paginationDiv.appendChild(prevLink);
  }

  // Botón "Siguiente"
  if (currentPage < totalPages) {
    const nextLink = document.createElement("a");
    nextLink.href = "#";
    nextLink.textContent = "Siguiente →";
    nextLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage++;
      searchBy(query, type, currentPage);
    });
    paginationDiv.appendChild(nextLink);
  }
}