import {Ctx, On, Scene, SceneEnter, SceneLeave, Action} from 'nestjs-telegraf';
import {I18nService} from "nestjs-i18n";
import {ClubButtons} from "./club.buttons";
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "./user/user.model";
import {RecordModel} from "./record/record.model";
import {Repository} from "sequelize-typescript";
import { isUserAdmin, updateMessage } from "../helpers/ctx";
import { UserService } from "./user/user.service";

const textValidator = (text) => {
  if (!text) return false;
  if (text.length < 1) return false;
  if (text[0] === '/') return false;
  return text;
}

@Scene('recordScene')
export class RecordScene {
  constructor(
    private readonly i18n: I18nService,
    private readonly appButtons: ClubButtons,
    // private prevBotMessageId: number,
  ) {
    // let prevBotMessageId: number = 0;
  }
  prevBotMessageId: number = 0;

  @SceneEnter()
  async enter(@Ctx() ctx) {
    await updateMessage(
      ctx,
      this.i18n.t('dict.request_process'),
      this.appButtons.buttonPrev()
    )
    this.prevBotMessageId = ctx.update.callback_query.message.message_id;
    console.log(this.prevBotMessageId);
  }

  @SceneLeave()
  async leave() {
    console.log('leave')
  }

  @On('message')
  async onUserMessage(ctx) {
    if (ctx.message && ctx.message.text === '/start') {
      try {
        await ctx.scene.leave();
        await ctx.reply(this.i18n.t('dict.start_description'), this.appButtons.actionButtons());
      } catch (e) {
        console.error(e, 'on valid email');
      }
      return
    }
    const formattedText = textValidator(ctx.update.message && ctx.update.message?.text);
    const chat_id = ctx.message.chat.id;
    const message_id = ctx.message.message_id;
    if (formattedText) {
      try {
        const record = await RecordModel.create({
          chat_id,
          text: formattedText,
        });
        if (this.prevBotMessageId) {
          await ctx.tg.deleteMessage(chat_id, this.prevBotMessageId);
        }
        // await ctx.tg.deleteMessage(chat_id, message_id);

        await ctx.scene.leave();
        await ctx.reply(this.i18n.t('dict.request_success'), this.appButtons.buttonToStart());
      } catch (e) {
        console.log(e);
        await ctx.scene.leave();
      }
    } else {
      try {
        await ctx.tg.deleteMessage(chat_id, message_id);
        await ctx.reply(this.i18n.t('dict.only_text'), this.appButtons.buttonPrev());
      } catch (e) {}
    }
  }
}

@Scene('listScene')
export class ListScene {
  constructor(
    private readonly i18n: I18nService,
    private readonly appButtons: ClubButtons,
    private readonly users: UserService,
    @InjectModel(UserModel) private userService: Repository<UserModel>,
  ) {}

  async showList(ctx) {

    const isAdmin = await isUserAdmin(ctx, this.users);
    const chat_id = ctx.update.callback_query.message.chat.id;
    const params = isAdmin ? {} : { where: { chat_id } };
    const list = await RecordModel.findAll(params);
    try {
      await updateMessage(
        ctx,
        this.i18n.t('dict.list'),
        this.appButtons.recordsListButtons(list)
      )
    } catch (e) {
    }
  }

  @SceneEnter()
  async enter(@Ctx() ctx) {
    await this.showList(ctx);
  }

  @Action(/^show_record_(\d+)$/)
  async onShowRecord(@Ctx() ctx) {
    try {
      await ctx.deleteMessage();
      // @ts-ignore
      const recordId = ctx.match[1];
      const record = await RecordModel.findOne({ where: { id: recordId } });
      await ctx.reply(this.i18n.t('dict.my_request') + record.id + '\n\n' + record.text, this.appButtons.buttonToList(recordId));
    } catch (e) {
      console.error(e);
    }
  }

  @Action(/^remove-(\d+)$/)
  async onRemove(@Ctx() ctx) {
    try {
      // @ts-ignore
      const recordId = ctx.match[1];
      const record = await RecordModel.destroy({ where: { id: recordId } });
      // ctx.deleteMessage();
      await this.showList(ctx);
    } catch (e) {
      console.error(e);
    }
  }

  @Action('to_list')
  async onShowList(ctx) {
    await this.showList(ctx);
  }

  @On('message')
  async validEmail(ctx) {
    if (ctx.message.text === '/start') {
      try {
        await ctx.scene.leave();
        await ctx.reply(this.i18n.t('dict.start_description'), this.appButtons.actionButtons());
      } catch (e) {
        console.error(e, 'on valid email');
      }
      return
    } else {
      await ctx.deleteMessage();
    }
  }

  @SceneLeave()
  async leave() {
    console.log('leave')
  }
}

@Scene('adminListScene')
export class AdminListScene {
  constructor(
    private readonly i18n: I18nService,
    private readonly appButtons: ClubButtons,
    @InjectModel(UserModel) private userService: Repository<UserModel>,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx) {
  }

  @SceneLeave()
  async leave() {
    console.log('leave')
  }
}
