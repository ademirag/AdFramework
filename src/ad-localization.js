/*

It's about localization in terms of strings. Persistence language selection
is enabled.

*/

import { NativeModules, Platform } from "react-native";
import AdSettings from "./ad-settings";

export default class AdLocal {
  static load(stringObj, callback) {
    AdLocal.strings = stringObj;

    AdSettings.get("lang")
      .then(cl => {
        if (cl === null) {
          AdLocal.setLanguage(AdLocal.getDeviceLang());
        } else {
          AdLocal.setLanguage(cl);
        }
        callback();
      })
      .catch(e => {
        AdLocal.setLanguage(AdLocal.getDeviceLang());
        callback();
      });
  }

  static getDeviceLang() {
    if (Platform.OS === "ios")
      return NativeModules.SettingsManager.settings.AppleLocale.split("_")[0];
    else return NativeModules.I18nManager.localeIdentifier.split("_")[0];
  }

  static setLanguage(lng, forceUpdateComponent = null) {
    AdLocal.lang = lng;
    if (forceUpdateComponent) {
      forceUpdateComponent.forceUpdate();
    }
    AdSettings.store("lang", lng);
  }

  static str(key) {
    if (typeof AdLocal.lang === "undefined")
      throw "Language is not defined for Localization";

    let val = AdLocal.strings[AdLocal.lang][key];

    if (typeof val === "undefined") {
      return "";
    }

    return val;
  }

  static getMonthNames() {
    let val = AdLocal.strings["_months"][AdLocal.lang];

    return val;
  }
}
