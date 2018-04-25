import { each, concat, slice, map } from "@alfa/util";
import { parse, Selector, isSelector, isSelectorList } from "@alfa/css";
import { Node, Document, Element, StyleSheet, Rule } from "./types";
import { isElement, isStyleRule, isImportRule, isGroupingRule } from "./guards";
import { traverse } from "./traverse";
import { matches } from "./matches";
import { getAttribute } from "./get-attribute";
import { getTag } from "./get-tag";
import { getClassList } from "./get-class-list";
import { getKeySelector } from "./get-key-selector";
import { getSpecificity } from "./get-specificity";

export interface Cascade {
  get(element: Element): Array<Rule> | undefined;
}

export function getCascade(document: Document): Cascade {
  const cascade: WeakMap<Element, Array<Rule>> = new WeakMap();

  const { styleSheets } = document;

  const selectorMap = new SelectorMap(slice(styleSheets));

  traverse(document, node => {
    if (isElement(node)) {
      const rules = selectorMap.getRules(node, document);

      rules.sort((a, b) => {
        // If the specificities of the rules are equal, the declaration order
        // will determine the cascade. The rule with the highest order gets the
        // highest priority.
        if (a.specificity === b.specificity) {
          return b.order - a.order;
        }

        // Otherwise, the specificity will determine the cascade. The rule with
        // the highest specificity gets the highest priority.
        return b.specificity - a.specificity;
      });

      cascade.set(node, rules.map(({ rule }) => rule));
    }
  });

  return cascade;
}

type SelectorEntry = {
  readonly selector: Selector;
  readonly rule: Rule;
  readonly order: number;
  readonly specificity: number;
};

type SelectorBucket = Map<string, Array<SelectorEntry>>;

function addRule(
  bucket: SelectorBucket,
  key: string,
  entry: SelectorEntry
): void {
  let entries = bucket.get(key);

  if (entries === undefined) {
    entries = [];
    bucket.set(key, entries);
  }

  entries.push(entry);
}

function getRules(bucket: SelectorBucket, key: string): Array<SelectorEntry> {
  let entries = bucket.get(key);

  if (entries === undefined) {
    return [];
  }

  return entries;
}

/**
 * @see http://doc.servo.org/style/selector_map/struct.SelectorMap.html
 */
class SelectorMap {
  private _ids: SelectorBucket = new Map();

  private _classes: SelectorBucket = new Map();

  private _types: SelectorBucket = new Map();

  private _other: Array<SelectorEntry> = [];

  constructor(styleSheets: Array<StyleSheet>) {
    // Every rule encountered in style sheets is assigned an increasing number
    // that denotes declaration order. While rules are stored in buckets in the
    // order in which they were declared, information related to ordering will
    // otherwise no longer be available once rules from different buckets are
    // combined.
    let order: number = 0;

    const queue: Array<Rule> = [];

    for (let i = styleSheets.length - 1; i >= 0; i--) {
      const { cssRules } = styleSheets[i];

      for (let j = cssRules.length - 1; j >= 0; j--) {
        queue.push(cssRules[j]);
      }
    }

    while (queue.length > 0) {
      const rule = queue.pop();

      if (rule === undefined) {
        break;
      }

      if (isStyleRule(rule)) {
        const selectors = parseSelectors(rule.selectorText);

        if (selectors === null) {
          continue;
        }

        each(selectors, selector => {
          const { type, name } = getKeySelector(selector);
          const specificity = getSpecificity(selector);

          const entry: SelectorEntry = {
            selector,
            rule,
            order: order++,
            specificity
          };

          switch (type) {
            case "id-selector":
              addRule(this._ids, name, entry);
              break;
            case "class-selector":
              addRule(this._classes, name, entry);
              break;
            case "type-selector":
              addRule(this._types, name, entry);
              break;
            default:
              this._other.push(entry);
          }
        });
      }

      let children: ArrayLike<Rule> = [];

      if (isImportRule(rule)) {
        children = rule.styleSheet.cssRules;
      }

      if (isGroupingRule(rule)) {
        children = rule.cssRules;
      }

      for (let i = children.length - 1; i >= 0; i--) {
        queue.push(children[i]);
      }
    }
  }

  public getRules(element: Element, context: Node): Array<SelectorEntry> {
    const rules: Array<SelectorEntry> = [
      ...this._other,
      ...getRules(this._types, getTag(element))
    ];

    const id = getAttribute(element, "id");

    if (id !== null) {
      rules.push(...getRules(this._ids, id));
    }

    for (const className of getClassList(element)) {
      rules.push(...getRules(this._classes, className));
    }

    return rules.filter(({ selector }) => matches(element, context, selector));
  }
}

function parseSelectors(selector: string): Array<Selector> | null {
  try {
    const parsed = parse(selector);

    if (parsed === null) {
      return null;
    }

    if (isSelector(parsed)) {
      return [parsed];
    }

    if (isSelectorList(parsed)) {
      return parsed.selectors;
    }
  } catch (err) {}

  return null;
}