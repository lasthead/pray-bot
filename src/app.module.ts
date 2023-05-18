import {Module} from '@nestjs/common';

import {TelegrafModule} from "nestjs-telegraf";
import * as LocalSession from "telegraf-session-local"
import * as path from 'path';
import { AcceptLanguageResolver,
    I18nModule,
    QueryResolver, } from 'nestjs-i18n';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import { UserModel } from "./club/user/user.model";
import {RecordModel } from "./club/record/record.model";
import {ClubModule} from "./club/club.module";
import {AppService} from "./app.service";
import {AppController} from "./app.controller";

const session = new LocalSession({ database: "session_db.json" })
const configService = ConfigService
const i18nPath = process.env?.NODE_ENV === 'development' ? '/i18n/' : '/i18n/';

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`
      }),
      TelegrafModule.forRootAsync({
        imports: [ConfigModule],
        botName: 'club',
        useFactory: (ctx) => {
          return {
            token: process.env.BOT_TOKEN,
            middlewares: [ session ],
            include: [ClubModule],
          }
        },
        inject: [ConfigService],
      }),
      SequelizeModule.forRoot({
        dialect: 'mysql',
        host: process.env.HOSTNAME,
        port: Number(process.env.DB_PORT),
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        models: [UserModel, RecordModel],
        autoLoadModels: true,
      }),
      SequelizeModule.forFeature([UserModel, RecordModel]),
      I18nModule.forRoot({
          fallbackLanguage: 'ru',
          loaderOptions: {
              path: path.join(__dirname, i18nPath),
              watch: true,
          },
          resolvers: [
              { use: QueryResolver, options: ['lang'] },
              AcceptLanguageResolver,
          ],
      }),

      ClubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
