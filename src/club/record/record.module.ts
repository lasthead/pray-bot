import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {RecordModel} from "./record.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    SequelizeModule.forFeature([RecordModel])
  ]
})
export class RecordModule {}
