import { IRecipe, getAllRecipes } from "./utils/recipe.js";

const RECIPES_STATE = {
  recipes: [] as IRecipe[],
  search: "",
  filter: "",
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

const buildCardSkeleton = (total: number) => {
  const recipesContainer = document.getElementById("recipes-container") as HTMLDivElement;
  const recipeSkeletonTemplate = document.getElementById(
    "recipe-skeleton-template"
  ) as HTMLTemplateElement;

  const nodes: HTMLElement[] = [];

  for (let i = 0; i < total; i++) {
    const clone = recipeSkeletonTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    nodes.push(clone);
    recipesContainer.appendChild(clone);
  }

  const cleanup = () => {
    nodes.forEach((node) => node.remove());
  };

  return cleanup;
};

const updateRenderRecipes = (recipes: IRecipe[] | Set<IRecipe>, isReplace: boolean = false) => {
  const recipesContainer = document.getElementById("recipes-container") as HTMLDivElement;
  if (isReplace) recipesContainer.innerHTML = "";
  recipes.forEach((recipe) => {
    const card = buildCard(recipe);
    recipesContainer.appendChild(card);
  });
};

const filtering = (recipes: IRecipe[], search: string, filter: string) => {
  return recipes.filter((recipe) => {
    const cond1 =
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(search.toLowerCase())
      ) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const cond2 = recipe.cuisine.toLowerCase() === filter.toLowerCase();
    if (search && filter) return cond1 && cond2;
    if (search) return cond1;
    if (filter) return cond2;
    return true;
  });
};

const debounceSearch = (func: (e: Event) => void, delay: number) => {
  let timeoutId: number | undefined;
  return (e: Event) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func(e);
    }, delay);
  };
};

const onSearch = debounceSearch((e: Event) => {
  const target = e.target as HTMLInputElement;
  RECIPES_STATE.search = target.value;
  updateRenderRecipes(
    filtering(RECIPES_STATE.recipes, RECIPES_STATE.search, RECIPES_STATE.filter),
    true
  );
}, 1000);

const onSelect = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  RECIPES_STATE.filter = target.value;
  updateRenderRecipes(
    filtering(RECIPES_STATE.recipes, RECIPES_STATE.search, RECIPES_STATE.filter),
    true
  );
};

const onViewMore = async (e: Event) => {
  const target = e.target as HTMLButtonElement;
  RECIPES_STATE.currentPage += 1;
  const cleanup = buildCardSkeleton(3);
  try {
    const recipes = await getAllRecipes({
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
  } catch {
  } finally {
    cleanup();
  }
};

const initCarousel = () => {
  const slides = document.querySelectorAll(
    "#home-hero-carousel .carousel-img"
  ) as NodeListOf<HTMLDivElement>;
  if (slides.length === 0) return;
  const prevBtn = document.getElementById("carousel-prev") as HTMLButtonElement;
  const nextBtn = document.getElementById("carousel-next") as HTMLButtonElement;
  const indicators = document.querySelectorAll(
    "#carousel-indicators .indicator"
  ) as NodeListOf<HTMLDivElement>;
  let current = 0;
  const showSlide = (idx: number) => {
    slides.forEach((img, i) => img.classList.toggle("active", i === idx));
    indicators.forEach((dot, i) => dot.classList.toggle("active", i === idx));
    current = idx;
  };
  prevBtn.addEventListener("click", () => {
    showSlide((current - 1 + slides.length) % slides.length);
  });
  nextBtn.addEventListener("click", () => {
    showSlide((current + 1) % slides.length);
  });
  indicators.forEach((dot, i) => {
    dot.addEventListener("click", () => showSlide(i));
  });

  let autoPlay = setInterval(() => nextBtn.click(), 5000);
  document
    .getElementById("home-hero-carousel")!
    .addEventListener("mouseenter", () => clearInterval(autoPlay));
  document.getElementById("home-hero-carousel")!.addEventListener("mouseleave", () => {
    autoPlay = setInterval(() => nextBtn.click(), 5000);
  });
  showSlide(0);
};

document.addEventListener("DOMContentLoaded", async () => {
  recipeModal = document.getElementById("recipe-modal") as HTMLDivElement;
  const viewMoreBtn = document.getElementById("view-more-btn") as HTMLButtonElement;
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const cuisineSelect = document.getElementById("cuisine-select") as HTMLSelectElement;

  initCarousel();
  recipeModal.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.id === "recipe-modal" || target.id === "close-modal-btn") {
      modalClose();
    }
  });

  searchInput.addEventListener("input", onSearch);
  cuisineSelect.addEventListener("change", onSelect);

  const cleanup = buildCardSkeleton(6);
  const recipes = await getAllRecipes();
  cleanup();
  RECIPES_STATE.recipes = recipes;
  updateRenderRecipes(RECIPES_STATE.recipes);

  viewMoreBtn.addEventListener("click", onViewMore);
});
