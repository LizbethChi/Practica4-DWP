const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchInputAuthor = document.getElementById("search-input-author");
const resultsDiv = document.getElementById("results");
const getSearch = document.getElementById("search-by");

// Evento para manejar la búsqueda
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim() 
  const type = getSearch.options[getSearch.selectedIndex].value
  if (!query) return;
  searchBy(query, type);
});

//evento para buscar por titulo o autor
searchBy.addEventListener("onChange", async (e) => {
  e.preventDefault();
  return getSearch.options[getSearch.selectedIndex].value;
})


//funcion para buscar
async function searchBy(query, type) {
    const url =`https://openlibrary.org/search.json?${type}=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.docs);
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
    bookElement.innerHTML = `<h3>${book.title}</h3> <p><strong>Autor:</strong> ${book.author_name ? book.author_name.join(", ") : "Desconocido"}</p> <p><strong>Año:</strong> ${book.first_publish_year || "Desconocido"}</p>`;
    resultsDiv.appendChild(bookElement);
  });
}

