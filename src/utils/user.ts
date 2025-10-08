export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface IUserResponse {
  users: IUser[];
  total: number;
  skip: number;
  limit: number;
}

const BASE_URL = "https://dummyjson.com/users";

export const getUserByUsernameAndPassword = async (
  username: string,
  password: string
): Promise<IUser> => {
  try {
    const res = await fetch(`${BASE_URL}?limit=50`);
    const data: IUserResponse = await res.json();
    const user = data.users.find(
      (user) => user.username === username && user.password === password
    );
    if (!user) return Promise.reject(new Error("Invalid username or password"));
    return user;
  } catch {
    return Promise.reject(new Error("Something went wrong with users, try again later"));
  }
};
