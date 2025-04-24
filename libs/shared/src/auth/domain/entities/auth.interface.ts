export interface JwtPayload {
  sub: string;
  role: string;
  username: string;
}

export interface IUserRequest {
  userId: string;
  username: string;
  role: string;
}
