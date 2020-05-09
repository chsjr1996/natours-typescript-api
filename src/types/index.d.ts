// Type definitions for natours-typescript
// Project: https://github.com/chsjr1996/natours-typescript
// Definitions by: chsjr1996 <https://github.com/chsjr1996>
// TypeScript Version: 3.8.3

/*
|--------------------------------------------------------------------------
| Extend Express namespace
|--------------------------------------------------------------------------
|
| Inject types for Express namespace allowing use custom properties in
| Request or Response pieces
|
*/
interface IUser {
  id: string;
}

declare namespace Express {
  export interface Request {
    user: IUser;
  }
}
