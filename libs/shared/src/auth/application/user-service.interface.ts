export interface IUserService {
  findById(id: string): Promise<any | null>;
  findByEmailHash(emailHash: string): Promise<any | null>;
  changePassword(id: string, newPasswordHash: string): Promise<void>;
}
