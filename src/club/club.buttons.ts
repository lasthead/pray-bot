import {Markup} from "telegraf";
import {I18nService} from "nestjs-i18n";
import {Injectable} from "@nestjs/common";

function truncate(str, n){
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
}

@Injectable()
export class ClubButtons {
  constructor(
    private readonly i18n: I18nService,
  ) {}

  public actionButtons(showListBtn = false) {
    let btns = [
      Markup.button.callback(this.i18n.t("dict.button_start"), "start_request"),
    ]

    if (showListBtn) {
      btns = [
        ...btns,
        Markup.button.callback(this.i18n.t("dict.show_list"), "show_list"),
      ]
    }
    return Markup.inlineKeyboard(btns, { columns: 1 })
  }

  public buttonPrev() {
    return Markup.inlineKeyboard([
        Markup.button.callback(this.i18n.t("dict.back"), "to_start"),
      ],
    )
  }

  public buttonToStart() {
    return Markup.inlineKeyboard([
        Markup.button.callback(this.i18n.t("dict.to_start"), "to_start"),
      ],
    )
  }

  public buttonToList(id) {
    return Markup.inlineKeyboard([
        Markup.button.callback(this.i18n.t("dict.back"), "to_list"),
        Markup.button.callback(this.i18n.t("dict.remove"), `remove-${id}`),
      ],
    )
  }

  recordsListButtons(list) {
    return {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          ...list.map((item, index) => ([{
            text: `🗒️ ${index + 1}: ${truncate(item.text, 14)}`,
            callback_data: `show_record_${item.id}`,
          }])),
          [{ text: this.i18n.t("dict.to_start"), callback_data: "to_start", }]
        ]
      })
    }
  }

  public buttonPassphrase(key) {
    return Markup.inlineKeyboard([
        Markup.button.callback(key, "dummy"),
        Markup.button.callback(this.i18n.t("dict.club.buttons.back"), "to_start"),
      ],
    )
  }

  public buttonPayment(link) {
    return Markup.inlineKeyboard([
        Markup.button.url(this.i18n.t("dict.club.buttons.button_transaction"), link),
      ],
    )
  }

  public buttonClubLink(link) {
    return Markup.inlineKeyboard([
        Markup.button.url(this.i18n.t("dict.club.buttons.go_to_club"), link),
      ],
    )
  }
}
