import * as Lang from "@siteimprove/alfa-lang";
import { Grammar } from "@siteimprove/alfa-lang";
import { Token, Whitespace, Ident } from "../alphabet";
import { Visibility } from "../property/visibility";

type Production<T extends Token, R = never> = Lang.Production<Token, R, T>;

const whitespace: Production<Whitespace> = {
  token: "whitespace",
  prefix() {
    return null;
  },
  infix() {
    return null;
  }
};

const ident: Production<Ident, Visibility> = {
  token: "ident",
  prefix(token) {
    switch (token.value) {
      case "visible":
      case "hidden":
      case "collapse":
        return token.value;
    }

    return null;
  }
};

export const VisibilityGrammar: Grammar<Token, Visibility> = new Grammar([
  whitespace,
  ident
]);
