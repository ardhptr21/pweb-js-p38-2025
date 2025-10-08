var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllRecipes } from "./utils/recipe.js";
const RECIPES_STATE = {
    recipes: [],
    search: "",
    filter: "",
    currentPage: 1,
    perPage: 21,
    total: 50,
};
let recipeModal = null;
const modalOpen = (recipe) => {
    if (!recipeModal)
        return;
    recipeModal.querySelector(".recipe-head .title").textContent = recipe.name;
    const body = recipeModal.querySelector(".recipe-body");
    body.querySelector(".highlight-img").src = recipe.image;
    body.querySelector(".prep-time").textContent = recipe.prepTimeMinutes + " mins";
    body.querySelector(".cook-time").textContent = recipe.cookTimeMinutes + " mins";
    body.querySelector(".servings").textContent = String(recipe.servings);
    body.querySelector(".difficulty").textContent = recipe.difficulty;
    body.querySelector(".cuisine").textContent = recipe.cuisine;
    body.querySelector(".calories").textContent = String(recipe.caloriesPerServing) + " cal/serving";
    body.querySelector(".rating-stars").textContent = buildStars(recipe.rating);
    body.querySelector(".rating-value").textContent = String(recipe.rating);
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
    if (!recipeModal)
        return;
    recipeModal.classList.remove("open");
    document.body.style.overflow = "auto";
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
    cardNode.querySelector(".recipe-ratings .recipe-rating").textContent = String(recipe.rating);
    cardNode
        .querySelector(".recipe-action button")
        .addEventListener("click", () => modalOpen(recipe));
    return cardNode;
};
const updateRenderRecipes = (recipes, isReplace = false) => {
    const recipesContainer = document.getElementById("recipes-container");
    if (isReplace)
        recipesContainer.innerHTML = "";
    recipes.forEach((recipe) => {
        const card = buildCard(recipe);
        recipesContainer.appendChild(card);
    });
};
const filtering = (recipes, search, filter) => {
    return recipes.filter((recipe) => {
        const cond1 = recipe.name.toLowerCase().includes(search.toLowerCase()) ||
            recipe.cuisine.toLowerCase().includes(search.toLowerCase()) ||
            recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(search.toLowerCase())) ||
            recipe.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
        const cond2 = recipe.cuisine.toLowerCase() === filter.toLowerCase();
        if (search && filter)
            return cond1 && cond2;
        if (search)
            return cond1;
        if (filter)
            return cond2;
        return true;
    });
};
const debounceSearch = (func, delay) => {
    let timeoutId;
    return (e) => {
        if (timeoutId)
            clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            func(e);
        }, delay);
    };
};
const onSearch = debounceSearch((e) => {
    const target = e.target;
    RECIPES_STATE.search = target.value;
    updateRenderRecipes(filtering(RECIPES_STATE.recipes, RECIPES_STATE.search, RECIPES_STATE.filter), true);
}, 1000);
const onSelect = (e) => {
    const target = e.target;
    RECIPES_STATE.filter = target.value;
    updateRenderRecipes(filtering(RECIPES_STATE.recipes, RECIPES_STATE.search, RECIPES_STATE.filter), true);
};
const onViewMore = (e) => __awaiter(void 0, void 0, void 0, function* () {
    const target = e.target;
    RECIPES_STATE.currentPage += 1;
    try {
        const recipes = yield getAllRecipes({
            page: RECIPES_STATE.currentPage,
        });
        RECIPES_STATE.recipes = RECIPES_STATE.recipes.concat(recipes);
        let renderedRecipes = Array.from(recipes);
        if (RECIPES_STATE.search || RECIPES_STATE.filter) {
            renderedRecipes = filtering(recipes, RECIPES_STATE.search, RECIPES_STATE.filter);
        }
        updateRenderRecipes(renderedRecipes);
        if (RECIPES_STATE.currentPage * RECIPES_STATE.perPage >= RECIPES_STATE.total) {
            target.style.display = "none";
        }
    }
    catch (_a) { }
});
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    recipeModal = document.getElementById("recipe-modal");
    const viewMoreBtn = document.getElementById("view-more-btn");
    const searchInput = document.getElementById("search-input");
    const cuisineSelect = document.getElementById("cuisine-select");
    recipeModal.addEventListener("click", (e) => {
        const target = e.target;
        if (target.id === "recipe-modal" || target.id === "close-modal-btn") {
            modalClose();
        }
    });
    searchInput.addEventListener("input", onSearch);
    cuisineSelect.addEventListener("change", onSelect);
    const recipes = yield getAllRecipes();
    RECIPES_STATE.recipes = recipes;
    updateRenderRecipes(RECIPES_STATE.recipes);
    viewMoreBtn.addEventListener("click", onViewMore);
}));
