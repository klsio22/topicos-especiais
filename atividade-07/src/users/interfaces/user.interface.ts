export interface User {
  id: number;
  name: string;
  age: number;
  address: {
    city: string;
    state: string;
  };
}
