import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Repository} from "sequelize-typescript";
import {UserModel} from "./user.model";

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private userRepository: Repository<UserModel>) {}
  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll()
      return users
    } catch (e) {
      return e
    }
  }

  async getAdmins() {
    try {
      const admins = await this.userRepository.findAll({ where: { is_admin: 1 } })
      return admins
    } catch (e) {
      return e
    }
  }
}
