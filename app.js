let globalPokemon = [];
const mainContainer = document.querySelector(".main-container");
const searchInput = document.querySelector("#search-input");

const cleanView = () => {
  mainContainer.innerHTML = "";
};

searchInput.addEventListener("keyup", () => {
  const inputText = searchInput.value;
  /*     let globalPokemon2 = globalPokemon.splice(0, globalPokemon.length);
    console.log(inputText);
    searchByName(inputText); */
  // console.log(globalPokemon2);
  let globalPokemon2 = searchByName(inputText); // aqui asigno el parametro de busqueda a la función searchByName
  cleanView();
  renderPokemons(globalPokemon2);
});

const searchByName = (searchingParameter) => {
  const filteredPokemon = globalPokemon.filter((pokemon) => {
    if (pokemon.name.includes(searchingParameter)) {
      return pokemon;
    }
  });
  return filteredPokemon;
};

async function getPokemons() {
  try {
    //consultar la API
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1281"
    );
    const responseJson = await response.json(); //pasar la información a un json (forma en la que puedo procesar los datos de la API) para poder leerla //
    const pokemons = responseJson.results; //solo traer la parte del arreglo ubicadas en el arreglo results
    //   console.log(pokemons);

    for (let i = 0; i < pokemons.length; i++) {
      // crea una variable temporal para cada uno de los pokemons, los recorre por su posición en el array 0 a .lenght
      const pokemon = pokemons[i]; // pokemons[0] = {name: "bulbasor", url: "https://pokeapi.co/api/v2/pokemon/1/"}
      const pokemonUrl = pokemon.url; // capturo la URL del objeto anterior
      const response = await fetch(pokemonUrl); // consultar la API
      const responseJson = await response.json(); // pasar la API consultada a un formato que pueda leer
      normalizePokemons(pokemon.name, responseJson);
    }
  } catch (error) {
    console.log(error);
  }
}

const normalizePokemons = (name, responseJson) => {
  //función que va a extrar la información que necesito
  const img = responseJson.sprites.other["official-artwork"].front_default; // va a la ruta en el responseJson
  const img2 = responseJson.sprites.other.dream_world.front_default;

  let type2 = responseJson.types.map(
    (type) =>
      `<ul> 
        <li>
          <p class='${type.type.name}'>
            ${type.type.name}
          </p>
        </li>
      </ul>`
  );
  const type = type2.join(" ");

  let weight2 = responseJson.weight;
  const weight = weight2 / 10;

  let abilities2 = responseJson.abilities.map(
    (ability) =>
      `<ul> 
        <li>
          <p class='${ability.ability.name}'>
            ${ability.ability.name}
          </p>
        </li>
     </ul>`
  );
  const abilities = abilities2.join("");

  const pokemon = {
    // crea un arreglo
    name: name,
    img: img,
    img2: img2,
    type: type,
    weight: weight,
    abilities: abilities,
    showMore: "+",
    showLess: "-",
  };
  // console.log(pokemon);
  globalPokemon.push(pokemon); // a mi arreglo globalPokemon le va agregando cada uno de los arreglos de cada pokemon iterado
};

const renderPokemonCard = (element) => {
  const cardPokemonDiv = document.createElement("div");
  cardPokemonDiv.classList = "card";

    //innerHTML permite leer un dato o asignarlo al contenido de un div
  cardPokemonDiv.innerHTML = `
    
    <div class='pokemon-image'>
      <img class='image' src ='${element.img}' alt="${element.name}" />
    </div>
    
    <div class= 'pokemonInfo'>
      <div class='pokemon-name'>
        <h2> ${element.name}</h2>
      </div>

      <div class='pokemon-types'>
        <h4> ${element.type}</h4>
      </div>

      <div class='seeMoreSeeLess1'>
        <button id="myBtn"> ${element.showMore} </button>
      </div>
      
    </div>
    
    <div id="myModal" class="modal">
        <div class="modal-content">
          
          <div class='pokemon-image2'>
            <img class='image2' src ='${element.img2}' alt="${element.name}" />
          </div>
          
          <div class='pokemon-name2'>
            <p class="modalTitle">Name:</p>
            <p>${element.name}</p>
          </div>

          <div class='pokemon-types2'>
            <p class="modalTitle">Types:</p>
            <p>${element.type}</p>
          </div>

          <div id="weight">
          <p class="modalTitle" >weight:</p>
          <p>${element.weight} Kg.</p>
          </div>
          
          <div id="abilities">
            <p class="modalTitle">Abilities:</p>
            <p>${element.abilities}</p>
          </div>
                    
          <button class="close"> ${element.showLess} </button>
        </div>
      </div>
      `;

  mainContainer.appendChild(cardPokemonDiv);

  if (element) {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("myBtn");
    const span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
      modal.style.display = "block";
    };
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }

};



const renderPokemons = (array) => {
  // hay que pintar en la pantalla cada uno de los pokemons que esta en el arreglo globalpokemon
  for (let i = 0; i < array.length; i++) {
    // para cada una de las posiciones del globalPokemon crea un card
    renderPokemonCard(array[i]);
  }
};

(async function main() {
  await getPokemons();
  await renderPokemons(globalPokemon);
})();

const loadingPage = window.addEventListener("load", function () {
  console.log("la pagina ha terminado de cargar");
});



