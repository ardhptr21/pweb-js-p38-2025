var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "https://dummyjson.com/recipes";
export const getAllRecipes = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* ({ page = 1, limit = 21, search = "", filter = "", } = {}) {
    const skip = (page - 1) * limit;
    try {
        const res = yield fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
        const data = yield res.json();
        if (!data.recipes.length)
            return Promise.reject(new Error("No recipes is available"));
        return data.recipes;
    }
    catch (_a) {
        return Promise.reject(new Error("Something went wrong with recipes, try again later"));
    }
});
