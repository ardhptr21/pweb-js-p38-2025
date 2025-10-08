import { IRecipe, getAllRecipes } from "./utils/recipe.js";

const RECIPES_STATE = {
  recipes: [] as IRecipe[],
  currentPage: 1,
  perPage: 21,
  total: 50,
};

let recipeModal: HTMLDivElement | null = null;

const modalOpen = (recipe: IRecipe) => {
  if (!recipeModal) return;
  recipeModal.querySelector(".recipe-head .title")!.textContent = recipe.name;
  const body = recipeModal.querySelector(".recipe-body") as HTMLDivElement;
  (body.querySelector(".highlight-img") as HTMLImageElement).src = recipe.image;
  body.querySelector(".prep-time")!.textContent = recipe.prepTimeMinutes + " mins";
  body.querySelector(".cook-time")!.textContent = recipe.cookTimeMinutes + " mins";
  body.querySelector(".servings")!.textContent = String(recipe.servings);
  body.querySelector(".difficulty")!.textContent = recipe.difficulty;
  body.querySelector(".cuisine")!.textContent = recipe.cuisine;
  body.querySelector(".calories")!.textContent = String(recipe.caloriesPerServing) + " cal/serving";
  body.querySelector(".rating-stars")!.textContent = buildStars(recipe.rating);
  body.querySelector(".rating-value")!.textContent = String(recipe.rating);

  body.querySelector(".tags-info")!.innerHTML = "";
  for (const tag of recipe.tags) {
    const tagElem = document.createElement("p");
    tagElem.classList.add("tag");
    tagElem.textContent = tag;
    body.querySelector(".tags-info")!.appendChild(tagElem);
  }

  recipeModal.querySelector(".ingredient-list")!.innerHTML = "";
  for (const ingredient of recipe.ingredients) {
    const li = document.createElement("li");
    li.textContent = ingredient;
    recipeModal.querySelector(".ingredient-list")!.appendChild(li);
  }

  recipeModal.querySelector(".instruction-list")!.innerHTML = "";
  for (const instruction of recipe.instructions) {
    const li = document.createElement("li");
    li.textContent = instruction;
    recipeModal.querySelector(".instruction-list")!.appendChild(li);
  }

  recipeModal.classList.add("open");
  document.body.style.overflow = "hidden";
};

const modalClose = () => {
  if (!recipeModal) return;
  recipeModal.classList.remove("open");
  document.body.style.overflow = "auto";
};

const buildStars = (val: number) => {
  return "⭐".repeat(Math.floor(val));
};

const buildCard = (recipe: IRecipe) => {
  const recipeCardTemplate = document.getElementById("recipe-card-template") as HTMLTemplateElement;
  const cardNode = recipeCardTemplate.content.cloneNode(true) as HTMLDivElement;
  (cardNode.querySelector(".recipe-img img") as HTMLImageElement)!.src = recipe.image;
  cardNode.querySelector(".recipe-title")!.textContent = recipe.name;
  cardNode.querySelector(".recipe-ingredients")!.textContent =
    "Ingredients: " + recipe.ingredients.join(", ");
  cardNode.querySelector(".recipe-time")!.textContent =
    recipe.prepTimeMinutes + recipe.cookTimeMinutes + " mins";
  cardNode.querySelector(".recipe-difficulty")!.textContent = recipe.difficulty;
  cardNode.querySelector(".recipe-cuisine")!.textContent = recipe.cuisine;
  cardNode.querySelector(".recipe-ratings .recipe-stars")!.textContent = buildStars(recipe.rating);
  cardNode.querySelector(".recipe-ratings .recipe-rating")!.textContent = String(recipe.rating);
  cardNode
    .querySelector(".recipe-action button")!
    .addEventListener("click", () => modalOpen(recipe));

  return cardNode;
};

document.addEventListener("DOMContentLoaded", async () => {
  recipeModal = document.getElementById("recipe-modal") as HTMLDivElement;
  const recipesContainer = document.getElementById("recipes-container") as HTMLDivElement;
  const viewMoreBtn = document.getElementById("view-more-btn") as HTMLButtonElement;

  recipeModal.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.id === "recipe-modal" || target.id === "close-modal-btn") {
      modalClose();
    }
  });

  const recipes = await getAllRecipes();
  RECIPES_STATE.recipes = recipes;

  recipes.forEach((recipe) => {
    const card = buildCard(recipe);
    recipesContainer.appendChild(card);
  });

  viewMoreBtn.addEventListener("click", async () => {
    RECIPES_STATE.currentPage += 1;
    const recipes = await getAllRecipes({
      page: RECIPES_STATE.currentPage,
    });
    RECIPES_STATE.recipes = RECIPES_STATE.recipes.concat(recipes);
    recipes.forEach((recipe) => {
      const card = buildCard(recipe);
      recipesContainer.appendChild(card);
    });
    if (RECIPES_STATE.currentPage * RECIPES_STATE.perPage >= RECIPES_STATE.total) {
      viewMoreBtn.style.display = "none";
    }
  });
});
