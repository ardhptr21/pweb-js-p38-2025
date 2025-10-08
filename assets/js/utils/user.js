var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "https://dummyjson.com/users";
export const getUserByUsernameAndPassword = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${BASE_URL}?limit=50`);
        const data = yield res.json();
        const user = data.users.find((user) => user.username === username && user.password === password);
        if (!user)
            return Promise.reject(new Error("Invalid username or password"));
        return user;
    }
    catch (_a) {
        return Promise.reject(new Error("Something went wrong with users, try again later"));
    }
});
