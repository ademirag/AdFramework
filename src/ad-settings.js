/*

For App settings persistence.

*/

import AsyncStorage from "@react-native-community/async-storage";

export default class AdSettings {
  static async store(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async get(key) {
    try {
      const v = await AsyncStorage.getItem(key);
      if (typeof v === "string") return v;
      else return null;
    } catch (e) {
      return null;
    }
  }
}
