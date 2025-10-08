BASE_URL = "https://dummyjson.com/recipes";
const RECIPES_STATE = {
  recipes: [],
  currentPage: 1,
  perPage: 21,
  total: 50,
};
const recipeModal = document.getElementById("recipe-modal");

const fetchRecipes = async (page = 1, search = "", filter = "") => {
  const skip = (page - 1) * RECIPES_STATE.perPage;
  try {
    const res = await fetch(`${BASE_URL}?limit=${RECIPES_STATE.perPage}&skip=${skip}`);
    const data = await res.json();
    return data.recipes;
  } catch {
    throw new Error("Something went wrong, try again later");
  }
};

const buildStars = (val) => {
  return "⭐".repeat(Math.floor(val));
};

const buildCard = (recipe) => {
  const recipeCardTemplate = document.getElementById("recipe-card-template");
  const cardNode = recipeCardTemplate.content.cloneNode(true);
  cardNode.querySelector(".recipe-img img").src = recipe.image;
  cardNode.querySelector(".recipe-title").textContent = recipe.name;
  cardNode.querySelector(".recipe-ingredients").textContent =
    "Ingredients: " + recipe.ingredients.join(", ");
  cardNode.querySelector(".recipe-time").textContent =
    recipe.prepTimeMinutes + recipe.cookTimeMinutes + " mins";
  cardNode.querySelector(".recipe-difficulty").textContent = recipe.difficulty;
  cardNode.querySelector(".recipe-cuisine").textContent = recipe.cuisine;
  cardNode.querySelector(".recipe-ratings .recipe-stars").textContent = buildStars(recipe.rating);
  cardNode.querySelector(".recipe-ratings .recipe-rating").textContent = recipe.rating;
  cardNode.querySelector(".recipe-action button").addEventListener("click", () => {
    modalOpen(recipe);
  });

  return cardNode;
};

const modalOpen = (recipe) => {
  recipeModal.querySelector(".recipe-head .title").textContent = recipe.name;
  const body = recipeModal.querySelector(".recipe-body");
  body.querySelector(".highlight-img").src = recipe.image;
  body.querySelector(".prep-time").textContent = recipe.prepTimeMinutes + " mins";
  body.querySelector(".cook-time").textContent = recipe.cookTimeMinutes + " mins";
  body.querySelector(".servings").textContent = recipe.servings;
  body.querySelector(".difficulty").textContent = recipe.difficulty;
  body.querySelector(".cuisine").textContent = recipe.cuisine;
  body.querySelector(".calories").textContent = recipe.calories + " cal/serving";
  body.querySelector(".rating-stars").textContent = buildStars(recipe.rating);
  body.querySelector(".rating-value").textContent = recipe.rating;

  body.querySelector(".tags-info").innerHTML = "";
  for (const tag of recipe.tags) {
    const tagElem = document.createElement("p");
    tagElem.classList.add("tag");
    tagElem.textContent = tag;
    body.querySelector(".tags-info").appendChild(tagElem);
  }

  recipeModal.querySelector(".ingredient-list").innerHTML = "";
  for (const ingredient of recipe.ingredients) {
    const li = document.createElement("li");
    li.textContent = ingredient;
    recipeModal.querySelector(".ingredient-list").appendChild(li);
  }

  recipeModal.querySelector(".instruction-list").innerHTML = "";
  for (const instruction of recipe.instructions) {
    const li = document.createElement("li");
    li.textContent = instruction;
    recipeModal.querySelector(".instruction-list").appendChild(li);
  }

  recipeModal.classList.add("open");
  document.body.style.overflow = "hidden";
};

const modalClose = () => {
  recipeModal.classList.remove("open");
  document.body.style.overflow = "auto";
};

recipeModal.addEventListener("click", (e) => {
  if (e.target.id === "recipe-modal" || e.target.id === "close-modal-btn") {
    modalClose();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const recipesContainer = document.getElementById("recipes-container");
  const viewMoreBtn = document.getElementById("view-more-btn");

  const recipes = await fetchRecipes(RECIPES_STATE.currentPage);
  recipes.forEach((recipe) => {
    const card = buildCard(recipe);
    recipesContainer.appendChild(card);
  });

  viewMoreBtn.addEventListener("click", async () => {
    RECIPES_STATE.currentPage += 1;
    const newRecipes = await fetchRecipes(RECIPES_STATE.currentPage);
    newRecipes.forEach((recipe) => {
      const card = buildCard(recipe);
      recipesContainer.appendChild(card);
    });
    if (RECIPES_STATE.currentPage * RECIPES_STATE.perPage >= RECIPES_STATE.total) {
      viewMoreBtn.style.display = "none";
    }
  });
});
