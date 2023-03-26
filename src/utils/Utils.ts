module Utils {
    export enum Enviroment {
      DEVELOP = "DEV",
      PRODUCTION = "PROD",
    }

    export enum HTTPStatus {
      OK = 200,
      CREATED = 201,
      NO_CONTENT = 204,
      BAD_REQUEST = 400,
      UNAUTHORIZED = 401,
      FORBIDDEN = 403,
      NOT_FOUND = 404,
      INTERNAL_SERVER_ERROR = 500,
    }
  
    export function IsNothing(value: any): boolean {
      let flag = false;
      if (value === undefined || value === "" || value === null || value === " ") {
        flag = true;
      }
      return flag;
    }
    
  }
  
  export default Utils;