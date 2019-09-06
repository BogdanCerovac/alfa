import { Element, NodeType } from "@siteimprove/alfa-dom";
import { jsx } from "@siteimprove/alfa-dom/jsx";
import { test } from "@siteimprove/alfa-test";
import { hasLanguageAttribute } from "../../src/helpers/has-language-attribute";

test("Returns false if tag has no language attribute", t => {
  const tag = <html />;
  t(!hasLanguageAttribute(tag));
});

test("Returns true if tag has an empty language attribute", t => {
  const tag = <html lang="" />;
  t(hasLanguageAttribute(tag));
});

test("Returns true if tag has a language attribute", t => {
  const tag = <html lang="en" />;
  t(hasLanguageAttribute(tag));
});

test("Returns true if tag has a xml language attribute", t => {
  const tag: Element = {
    nodeType: NodeType.Element,
    prefix: null,
    localName: "html",
    attributes: [
      {
        nodeType: NodeType.Attribute,
        prefix: "xml",
        localName: "lang",
        value: "en",
        childNodes: []
      }
    ],
    shadowRoot: null,
    childNodes: []
  };
  t(hasLanguageAttribute(tag));
});
