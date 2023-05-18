import {Logger} from '@nestjs/common';
import {Action, InjectBot, Start, Update, On} from "nestjs-telegraf";
import {Context, Telegraf, Scenes, Markup} from "telegraf";
import {I18nService} from "nestjs-i18n";

import {ClubButtons} from "./club.buttons";
import {isUserAdmin, updateMessage} from "../helpers/ctx";
import {UserService} from "./user/user.service";
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "./user/user.model";
import {Repository} from "sequelize-typescript";
import {SettingsModel} from "./settings/settings.model";
import { RecordModel } from "./record/record.model";

@Update ()
export class ClubUpdate {
  constructor(
    @InjectBot('club') private readonly clubBot: Telegraf<Context>,
    @InjectModel(UserModel) private tgGroupsService: Repository<UserModel>,
    @InjectModel(SettingsModel) private settingsService: Repository<SettingsModel>,
    private readonly i18n: I18nService,
    private readonly appButtons: ClubButtons,
    private readonly users: UserService,
  ) {}

  private readonly logger = new Logger(ClubUpdate.name);

  @Start()
  async startCommand(ctx: Context) {
    try {
      const chat_id = ctx.callbackQuery ? ctx.callbackQuery.message.chat.id : ctx.message?.chat?.id;
      const message_id = ctx.callbackQuery ? ctx.callbackQuery.message.message_id : ctx.message?.message_id;
      const user_id = ctx.callbackQuery ? ctx.callbackQuery.from.id : ctx.message.from.id;
      const user_name = ctx.callbackQuery ? ctx.callbackQuery.from?.username : ctx.message.from?.username;
      const first_name = ctx.callbackQuery ? ctx.callbackQuery.from?.first_name : ctx.message.from?.first_name;
      const users = await UserModel.findOrCreate({where: {
        chat_id,
        user_id,
        user_name: user_name || first_name || '',
      }});
      const records = await RecordModel.findAll({where: {chat_id: users[0].chat_id}})
      await this.clubBot.telegram.setMyCommands([
        { command: '/start', description: 'Начать' },
      ]);
      const isAdmin = await isUserAdmin(ctx, this.users);
      const isAdminText = isAdmin ? `\nКстати, ты админ и можешь читать чужие просьбы ⬇️`: '';
      await ctx.reply(
        this.i18n.t('dict.start_description') + isAdminText,
        this.appButtons.actionButtons(records.length > 0 || isAdmin),
      );
      await ctx.tg.deleteMessage(chat_id, message_id);
    } catch (e) {
      console.error(e, 'club_payment_start');
    }
  }

  upsert(values, condition) {
    return this.tgGroupsService
      .findOne({ where: condition })
      .then((obj) => {
        // update
        if(obj)
          return obj.update(values);
        // insert
        return this.tgGroupsService.create(values);
      })
  }

  @Action("start_request")
  async enterScene(ctx: Scenes.SceneContext) {
    ctx.scene.enter('recordScene')
  }

  @Action("show_list")
  async enterListScene(ctx: Scenes.SceneContext) {
    ctx.scene.enter('listScene')
  }

  @Action("to_start")
  async toStart(ctx: Context) {
    await this.startCommand(ctx);
  }

  @Action("description")
  async showDescription(ctx: Context) {
    await updateMessage(
      ctx,
      this.i18n.t('dict.club.description'),
      this.appButtons.buttonPrev()
    )
  }

  @On('message')
  async onUserMessage(ctx: Context) {
    await ctx.deleteMessage();
  }

}
