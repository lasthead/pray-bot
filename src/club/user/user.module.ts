import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {UserModel} from "./user.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    SequelizeModule.forFeature([UserModel])
  ]
})
export class UserModule {}
