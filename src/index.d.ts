interface IUser {
  id: string;
}

declare namespace Express {
  export interface Request {
    user: IUser;
  }
}
