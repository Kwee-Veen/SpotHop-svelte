export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    _id: string;
    admin: boolean;
  };

  export type Spot = {
    name: string;
    description?: string;
    img?: string;
    category?: string;
    latitude?: number;
    longitude?: number;
    _id: string;
    userid: User | string;
  };
