import { Module } from '@nestjs/common';
import { ClubUpdate } from "./club.update";
import {ClubButtons} from "./club.buttons";
import {RecordScene, ListScene, AdminListScene} from "./club.scenes";
import {SequelizeModule} from "@nestjs/sequelize";
import {HttpModule} from "@nestjs/axios";
import {UserModel} from "./user/user.model";
import {UserModule} from "./user/user.module";
import {UserService} from "./user/user.service";
import {SettingsModel} from "./settings/settings.model";
import {RecordModel} from "./record/record.model";
import {RecordModule} from "./record/record.module";
import {RecordService} from "./record/record.service";

@Module({
  providers: [
    ClubUpdate,
    ClubButtons,
    RecordScene,
    ListScene,
    AdminListScene,
    UserService,
    UserService,
    SettingsModel,
    RecordService,
  ],
  imports: [
    UserModule,
    RecordModule,
    SequelizeModule.forFeature([
      UserModel,
      RecordModel,
      SettingsModel,
    ]),
    HttpModule,
  ],
})
export class ClubModule {}
