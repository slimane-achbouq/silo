export interface MockUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  isPro: boolean;
}

export const mockUser: MockUser = {
  id: "user-1",
  name: "Slimane Achbouq",
  email: "slach@dev.me",
  initials: "SA",
  isPro: true,
};
