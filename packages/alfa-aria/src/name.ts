import { Branched } from "@siteimprove/alfa-branched";
import { Cache } from "@siteimprove/alfa-cache";
import { Browser } from "@siteimprove/alfa-compatibility";
import { Device } from "@siteimprove/alfa-device";
import { Attribute, Element, Node, Text } from "@siteimprove/alfa-dom";
import { Equatable } from "@siteimprove/alfa-equatable";
import { Iterable } from "@siteimprove/alfa-iterable";
import { Serializable } from "@siteimprove/alfa-json";
import { Option, None } from "@siteimprove/alfa-option";
import { Predicate } from "@siteimprove/alfa-predicate";
import { Refinement } from "@siteimprove/alfa-refinement";
import { Sequence } from "@siteimprove/alfa-sequence";
import { Style } from "@siteimprove/alfa-style";
import { Thunk } from "@siteimprove/alfa-thunk";

import * as json from "@siteimprove/alfa-json";

import { Feature } from "./feature";
import { Role } from "./role";

import * as predicate from "./name/predicate";

const { hasId, isElement } = Element;
const { isText } = Text;
const { equals } = Predicate;
const { or } = Refinement;

export class Name implements Equatable, Serializable {
  public static of(value: string, sources: Iterable<Name.Source> = []): Name {
    return new Name(value, Array.from(sources));
  }

  private readonly _value: string;
  private readonly _sources: Array<Name.Source>;

  private constructor(value: string, sources: Array<Name.Source>) {
    this._value = value;
    this._sources = sources;
  }

  public get value(): string {
    return this._value;
  }

  public get source(): Iterable<Name.Source> {
    return this._sources[Symbol.iterator]();
  }

  public isEmpty(): boolean {
    return this._value.length === 0;
  }

  public equals(value: unknown): value is this {
    return (
      value instanceof Name &&
      value._value === this._value &&
      value._sources.length === this._sources.length &&
      value._sources.every((source, i) => source.equals(this._sources[i]))
    );
  }

  public toJSON(): Name.JSON {
    return {
      value: this._value,
      sources: this._sources.map((source) => source.toJSON()),
    };
  }

  public toString(): string {
    return this._value;
  }
}

export namespace Name {
  export interface JSON {
    [key: string]: json.JSON;
    value: string;
    sources: Array<Source.JSON>;
  }

  export type Source =
    | Source.Data
    | Source.Descendant
    | Source.Ancestor
    | Source.Label
    | Source.Reference;

  export namespace Source {
    export type JSON =
      | Data.JSON
      | Descendant.JSON
      | Ancestor.JSON
      | Label.JSON
      | Reference.JSON;

    export class Data implements Equatable, Serializable {
      public static of(text: Text): Data {
        return new Data(text);
      }

      private readonly _text: Text;

      private constructor(text: Text) {
        this._text = text;
      }

      public get type(): "data" {
        return "data";
      }

      public get text(): Text {
        return this._text;
      }

      public equals(value: unknown): value is this {
        return value instanceof Data && value._text.equals(this._text);
      }

      public toJSON(): Data.JSON {
        return {
          type: "data",
        };
      }
    }

    export namespace Data {
      export interface JSON {
        [key: string]: json.JSON;
        type: "data";
      }
    }

    export function data(text: Text): Data {
      return Data.of(text);
    }

    export class Descendant implements Equatable, Serializable {
      public static of(element: Element, name: Name): Descendant {
        return new Descendant(element, name);
      }

      private readonly _element: Element;
      private readonly _name: Name;

      private constructor(element: Element, name: Name) {
        this._element = element;
        this._name = name;
      }

      public get type(): "descendants" {
        return "descendants";
      }

      public get element(): Element {
        return this._element;
      }

      public get name(): Name {
        return this._name;
      }

      public equals(value: unknown): value is this {
        return (
          value instanceof Descendant &&
          value._element.equals(this._element) &&
          value._name.equals(this._name)
        );
      }

      public toJSON(): Descendant.JSON {
        return {
          type: "descendant",
          name: this._name.toJSON(),
        };
      }
    }

    export namespace Descendant {
      export interface JSON {
        [key: string]: json.JSON;
        type: "descendant";
        name: Name.JSON;
      }
    }

    export function descendant(element: Element, name: Name): Descendant {
      return Descendant.of(element, name);
    }

    export class Ancestor implements Equatable, Serializable {
      public static of(element: Element, name: Name): Ancestor {
        return new Ancestor(element, name);
      }

      private readonly _element: Element;
      private readonly _name: Name;

      private constructor(element: Element, name: Name) {
        this._element = element;
        this._name = name;
      }

      public get type(): "ancestor" {
        return "ancestor";
      }

      public get element(): Element {
        return this._element;
      }

      public get name(): Name {
        return this._name;
      }

      public equals(value: unknown): value is this {
        return (
          value instanceof Ancestor &&
          value._element.equals(this._element) &&
          value._name.equals(this._name)
        );
      }

      public toJSON(): Ancestor.JSON {
        return {
          type: "ancestor",
          name: this._name.toJSON(),
        };
      }
    }

    export namespace Ancestor {
      export interface JSON {
        [key: string]: json.JSON;
        type: "ancestor";
        name: Name.JSON;
      }
    }

    export function ancestor(element: Element, name: Name): Ancestor {
      return Ancestor.of(element, name);
    }

    export class Label implements Equatable, Serializable {
      public static of(attribute: Attribute): Label {
        return new Label(attribute);
      }

      private readonly _attribute: Attribute;

      private constructor(attribute: Attribute) {
        this._attribute = attribute;
      }

      public get type(): "label" {
        return "label";
      }

      public get attribute(): Attribute {
        return this._attribute;
      }

      public equals(value: unknown): value is this {
        return (
          value instanceof Label && value._attribute.equals(this._attribute)
        );
      }

      public toJSON(): Label.JSON {
        return {
          type: "label",
          attribute: this._attribute.name,
        };
      }
    }

    export namespace Label {
      export interface JSON {
        [key: string]: json.JSON;
        type: "label";
        attribute: string;
      }
    }

    export function label(attribute: Attribute): Label {
      return Label.of(attribute);
    }

    export class Reference implements Equatable, Serializable {
      public static of(attribute: Attribute, name: Name): Reference {
        return new Reference(attribute, name);
      }

      private readonly _attribute: Attribute;
      private readonly _name: Name;

      private constructor(attribute: Attribute, name: Name) {
        this._attribute = attribute;
        this._name = name;
      }

      public get type(): "reference" {
        return "reference";
      }

      public get attribute(): Attribute {
        return this._attribute;
      }

      public get name(): Name {
        return this._name;
      }

      public equals(value: unknown): value is this {
        return (
          value instanceof Reference && value._attribute.equals(this._attribute)
        );
      }

      public toJSON(): Reference.JSON {
        return {
          type: "reference",
          attribute: this._attribute.name,
          name: this._name.toJSON(),
        };
      }
    }

    export namespace Reference {
      export interface JSON {
        [key: string]: json.JSON;
        type: "reference";
        attribute: string;
        name: Name.JSON;
      }
    }

    export function reference(attribute: Attribute, name: Name): Reference {
      return Reference.of(attribute, name);
    }
  }

  /**
   * @internal
   */
  export class State {
    private static _empty = new State([], false, false, false);

    public static empty(): State {
      return this._empty;
    }

    private readonly _visited: Array<Element>;
    private readonly _isRecursing: boolean;
    private readonly _isReferencing: boolean;
    private readonly _isDescending: boolean;

    private constructor(
      visited: Array<Element>,
      isRecursing: boolean,
      isReferencing: boolean,
      isDescending: boolean
    ) {
      this._visited = visited;
      this._isRecursing = isRecursing;
      this._isReferencing = isReferencing;
      this._isDescending = isDescending;
    }

    /**
     * The elements that have been seen by the name computation so far. This is
     * used for detecting circular references resulting from things such as the
     * `aria-labelledby` attribute and form controls that get their name from
     * a containing `<label>` element.
     */
    public get visited(): Iterable<Element> {
      return this._visited;
    }

    /**
     * Whether or not the name computation is the result of recursion.
     */
    public get isRecursing(): boolean {
      return this._isRecursing;
    }

    /**
     * Whether or not the name computation is the result of a reference.
     */
    public get isReferencing(): boolean {
      return this._isReferencing;
    }

    /**
     * Whether or not the name computation is descending into a subtree.
     */
    public get isDescending(): boolean {
      return this._isDescending;
    }

    public hasVisited(element: Element): boolean {
      return this._visited.includes(element);
    }

    public visit(element: Element): State {
      if (this._visited.includes(element)) {
        return this;
      }

      return new State(
        [...this._visited, element],
        this._isRecursing,
        this._isReferencing,
        this._isDescending
      );
    }

    public recurse(isRecursing: boolean): State {
      if (this._isRecursing === isRecursing) {
        return this;
      }

      return new State(
        this._visited,
        isRecursing,
        this._isReferencing,
        this._isDescending
      );
    }

    public reference(isReferencing: boolean): State {
      if (this._isReferencing === isReferencing) {
        return this;
      }

      return new State(
        this._visited,
        this._isRecursing,
        isReferencing,
        this._isDescending
      );
    }

    public descend(isDescending: boolean): State {
      if (this._isDescending === isDescending) {
        return this;
      }

      return new State(
        this._visited,
        this._isRecursing,
        this._isReferencing,
        isDescending
      );
    }
  }

  export function from(
    node: Element | Text,
    device: Device
  ): Branched<Option<Name>, Browser> {
    return fromNode(node, device, State.empty());
  }

  const names = Cache.empty<Node, Branched<Option<Name>, Browser>>();

  /**
   * @internal
   */
  export function fromNode(
    node: Element | Text,
    device: Device,
    state: State
  ): Branched<Option<Name>, Browser> {
    // Construct a thunk with the computed name of the node. We first need to
    // decide whether or not we can pull the name of the node from the cache and
    // so the actual computation of the name must be delayed.
    const name = () =>
      isElement(node) ? fromElement(node, device, state) : fromText(node);

    if (isElement(node)) {
      // As chained references are not allowed, we cannot make use of the cache
      // when computing a referenced name. If, for example, <foo> references
      // <bar> and <bar> references <baz>...
      //
      //   <foo> -> <bar> -> <baz> "Hello world"
      //
      // ...the reference from <bar> to <baz> is only allowed to be followed
      // when computing a name for <bar>:
      //
      //   <bar> "Hello world" -> <baz> "Hello world"
      //
      // When computing the name for <foo>, however, the second reference must
      // be ignored and the name for <bar> computed as if though the reference
      // does not exist:
      //
      //   <foo> null -> <bar> null
      //
      // We therefore cannot make use of whatever is in the cache for <bar>.
      if (state.isReferencing) {
        return name();
      }

      // If we're descending then the name already in the cache may not be
      // relevant due to the last step of the name computation. If, for example,
      // <baz> is a child of <bar> which is a child of <foo>...
      //
      //   <foo>
      //     <bar>
      //       <baz> "Hello world"
      //
      // ...and the name of <baz> has already been computed as "Hello world" and
      // we then compute the name of <bar> and <bar> is not allowed to be named
      // by its contents, it will not have a name:
      //
      //   <bar> null
      //     <baz> "Hello world"
      //
      // However, when we compute the name of <foo> and <foo> is allowed to be
      // named by its contents, the last step of the same computation kicks in
      // and includes all descendant names:
      //
      //   <foo> "Hello world"
      //     <bar> "Hello world"
      //       <baz> "Hello world"
      //
      // We therefore cannot make use of whatever is in the cache for <bar>.
      if (state.isDescending) {
        return name();
      }
    }

    return names.get(node, name);
  }

  /**
   * @internal
   */
  export function fromElement(
    element: Element,
    device: Device,
    state: State
  ): Branched<Option<Name>, Browser> {
    const empty = Branched.of(None);

    if (state.hasVisited(element)) {
      return empty;
    } else {
      state = state.visit(element);
    }

    return Role.from(element).flatMap((role) => {
      // The following code handles the _generic_ steps of the accessible name
      // computation, that is any steps that are shared for all namespaces. All
      // remaining steps are handled by namespace-specific feature mappings.

      // Step 1: Does the role prohibit naming?
      // https://w3c.github.io/accname/#step1
      if (role.some((role) => role.isNameProhibited())) {
        return empty;
      }

      // Step 2A: Is the element hidden and not referenced?
      // https://w3c.github.io/accname/#step2A
      if (!state.isReferencing && isHidden(element, device)) {
        return empty;
      }

      return fromSteps(
        // Step 2B: Use the `aria-labelledby` attribute, if present and allowed.
        // https://w3c.github.io/accname/#step2B
        () => {
          // Chained `aria-labelledby` references, such `foo` -> `bar` -> `baz`,
          // are not allowed. If the element is therefore being referenced
          // already then this step produces an empty name.
          if (state.isReferencing) {
            return empty;
          }

          const attribute = element.attribute("aria-labelledby");

          if (attribute.isNone()) {
            return empty;
          }

          return fromReferences(attribute.get(), device, state);
        },

        // Step 2C: Use the `aria-label` attribute, if present.
        // https://w3c.github.io/accname/#step2C
        () => {
          const attribute = element.attribute("aria-label");

          if (attribute.isNone()) {
            return empty;
          }

          return fromLabel(attribute.get());
        },

        // Step 2D: Use native features, if present and allowed.
        // https://w3c.github.io/accname/#step2D
        () => {
          // Using native features is only allowed if the role, if any, of the
          // element is not presentational and the element has a namespace with
          // which to look up its feature mapping, if it exists. If the role of
          // element therefore is presentational or the element has no namespace
          // then this step produces an empty name.
          if (
            role.some((role) => role.isPresentational()) ||
            element.namespace.isNone()
          ) {
            return empty;
          }

          const feature = Feature.from(element.namespace.get(), element.name);

          if (feature.isNone()) {
            return empty;
          }

          return feature.get().name(element, device, state);
        },

        // Step 2F: Use the subtree content, if referencing or allowed.
        // https://w3c.github.io/accname/#step2F
        () => {
          // Using the subtree content is only allowed if the element is either
          // being referenced or the role, if any, of the element allows it to
          // be named by its content. If the element therefore isn't being
          // referenced and is not allowed to be named by its content then this
          // step produces an empty name.
          if (
            !state.isReferencing &&
            !role.every((role) => role.isNamedBy("contents"))
          ) {
            return empty;
          }

          return fromDescendants(element, device, state);
        },

        // Step 2H: Use the subtree content, if descending.
        // https://w3c.github.io/accname/#step2H
        () => {
          // Unless we're already descending then this step produces an empty
          // name.
          if (!state.isDescending) {
            return empty;
          }

          return fromDescendants(element, device, state);
        }
      );
    });
  }

  /**
   * @internal
   */
  export function fromText(text: Text): Branched<Option<Name>, Browser> {
    // Step 2G: Use the data of the text node.
    // https://w3c.github.io/accname/#step2G
    return fromData(text);
  }

  /**
   * @internal
   */
  export function fromDescendants(
    element: Element,
    device: Device,
    state: State
  ): Branched<Option<Name>, Browser> {
    return Branched.traverse(
      element.children().filter(or(isText, isElement)),
      (element) =>
        fromNode(
          element,
          device,
          state.recurse(true).reference(false).descend(true)
        )
    )
      .map((names) => Sequence.from(names).collect((name) => name))
      .map((names) => {
        const data = names
          .map((name) => name.value)
          .join(" ")
          .trim();

        if (data === "") {
          return None;
        }

        return Option.of(
          Name.of(
            data,
            names.map((name) => Source.descendant(element, name))
          )
        );
      });
  }

  /**
   * @internal
   */
  export function fromLabel(
    attribute: Attribute
  ): Branched<Option<Name>, Browser> {
    const data = flatten(attribute.value).trim();

    if (data === "") {
      return Branched.of(None);
    }

    return Branched.of(Option.of(Name.of(data, [Source.label(attribute)])));
  }

  /**
   * @internal
   */
  export function fromReferences(
    attribute: Attribute,
    device: Device,
    state: State
  ): Branched<Option<Name>, Browser> {
    const root = attribute.owner.get().root();

    const references = root
      .descendants()
      .filter(isElement)
      .filter(hasId(equals(...attribute.tokens())));

    return Branched.traverse(references, (element) =>
      fromNode(
        element,
        device,
        state.recurse(true).reference(true).descend(false)
      )
    )
      .map((names) => Sequence.from(names).collect((name) => name))
      .map((names) => {
        const data = names
          .map((name) => name.value)
          .join(" ")
          .trim();

        if (data === "") {
          return None;
        }

        return Option.of(
          Name.of(
            data,
            names.map((name) => Source.reference(attribute, name))
          )
        );
      });
  }

  /**
   * @internal
   */
  export function fromData(text: Text): Branched<Option<Name>, Browser> {
    const data = flatten(text.data);

    if (data === "") {
      return Branched.of(None);
    }

    return Branched.of(Option.of(Name.of(data, [Source.data(text)])));
  }

  /**
   * @internal
   */
  export function fromSteps(
    ...steps: Array<Thunk<Branched<Option<Name>, Browser>>>
  ): Branched<Option<Name>, Browser> {
    const step = (
      name: Branched<Option<Name>, Browser>,
      i: number = 0
    ): Branched<Option<Name>, Browser> => {
      if (i >= steps.length) {
        return name;
      }

      return name.flatMap((name) => {
        if (name.isSome()) {
          return Branched.of(name);
        }

        return step(steps[i](), i + 1);
      });
    };

    return step(Branched.of(None));
  }

  export const { hasValue } = predicate;
}

function flatten(string: string): string {
  return string.replace(/\s+/g, " ");
}

function isRendered(node: Node, device: Device): boolean {
  if (Element.isElement(node)) {
    const display = Style.from(node, device).computed("display").value;

    const [outside] = display;

    if (outside.value === "none") {
      return false;
    }
  }

  return node
    .parent({ flattened: true })
    .every((parent) => isRendered(parent, device));
}

/**
 * @see https://w3c.github.io/accname/#dfn-hidden
 * @see https://github.com/w3c/accname/issues/30
 */
function isHidden(element: Element, device: Device): boolean {
  return (
    !isRendered(element, device) ||
    element
      .attribute("aria-hidden")
      .some((attribute) => attribute.value === "true")
  );
}
