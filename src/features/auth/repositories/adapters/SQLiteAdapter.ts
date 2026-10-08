import { UserRepository } from "@/features/profile/repositories/userRepositories";
import { SQLiteDatabase } from "expo-sqlite";
import { IAuth } from "../../types/login";

export class SQLiteAuthAdapters implements IAuth {
  constructor(private readonly db: SQLiteDatabase) {}

  public async login(id: number | string, senha: string): Promise<boolean> {
    const userRepository = new UserRepository(this.db);
    const response = await userRepository.getFrist(id);
    if (!response) return false;

    return response.senha === senha;
  }

  logout(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
