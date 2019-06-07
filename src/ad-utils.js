/*

Utilities

*/

import { Dimensions, Platform } from "react-native";
import AdLocal from "./ad-localization";

export function isIphoneX() {
  const dim = Dimensions.get("window");

  return (
    // This has to be iOS
    Platform.OS === "ios" &&
    // Check either, iPhone X or XR
    (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
}

export function isIPhoneXSize(dim) {
  return dim.height == 812 || dim.width == 812;
}

export function isIPhoneXrSize(dim) {
  return dim.height == 896 || dim.width == 896;
}

export function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export function currencyFormat(n, cur, c, d, t) {
  var c = isNaN((c = Math.abs(c))) ? 2 : c,
    d = d == undefined ? "," : d,
    t = t == undefined ? "." : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  return (
    s +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : "") +
    " " +
    cur
  );
}

export function formatPhone(number) {
  number = "" + number;

  const rPart0 = number.substr(-2, 2),
    rPart1 = number.substr(-4, 2),
    rPart2 = number.substr(-7, 3),
    rPart3 = number.substr(-10, 3),
    rPart4 = number.substr(0, number.length - 10);

  if (number.length === 7) {
    return rPart2 + " " + rPart1 + " " + rPart0;
  } else {
    return (
      "+" + rPart4 + " (" + rPart3 + ") " + rPart2 + " " + rPart1 + " " + rPart0
    );
  }
}

export function formatDate(date) {
  date = new Date(date);
  var monthNames = AdLocal.getMonthNames();

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + " " + monthNames[monthIndex] + " " + year;
}
