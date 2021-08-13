export interface IResponse {
  err: string | null;
  status: number;
  data: unknown | null;
}

export function OkResponse(data: unknown): IResponse {
  return {
    err: null,
    status: 200,
    data,
  };
}

export function BadRequest(err: string): IResponse {
  return {
    err,
    status: 400,
    data: null,
  };
}

export function InternalError(err: string): IResponse {
  return {
    err,
    status: 500,
    data: null,
  };
}

export function UnauthorizedError(err: string): IResponse {
  return {
    err,
    status: 401,
    data: null,
  };
}
