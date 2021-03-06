import { h } from "@siteimprove/alfa-dom/h";
import { jsx } from "@siteimprove/alfa-dom/jsx";
import { test } from "@siteimprove/alfa-test";

import { Device } from "@siteimprove/alfa-device";
import { Namespace } from "@siteimprove/alfa-dom";
import { None, Option } from "@siteimprove/alfa-option";

import { Name } from "../src/name";

const device = Device.standard();

test(`.from() determines the name of a text node`, (t) => {
  const text = h.text("Hello world");

  t.deepEqual(Name.from(text, device).toArray(), [
    [Option.of(Name.of("Hello world", [Name.Source.data(text)])), []],
  ]);
});

test(`.from() determines the name of a <button> element with child text content`, (t) => {
  const text = h.text("Hello world");

  const button = <button>{text}</button>;

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            button,
            Name.of("Hello world", [Name.Source.data(text)])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <div> element with a role of button and
      with child text content`, (t) => {
  const text = h.text("Hello world");

  const button = <div role="button">{text}</div>;

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            button,
            Name.of("Hello world", [Name.Source.data(text)])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <button> element with partially hidden
      children`, (t) => {
  const text = h.text("Hello world");

  const span = <span>{text}</span>;

  const button = (
    <button>
      {span}
      <span style={{ display: "none" }}>!</span>
    </button>
  );

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            button,
            Name.of("Hello world", [
              Name.Source.descendant(
                span,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <button> element with a <span> child
      element with child text content`, (t) => {
  const text = h.text("Hello world");

  const span = <span>{text}</span>;

  const button = <button>{span}</button>;

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            button,
            Name.of("Hello world", [
              Name.Source.descendant(
                span,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <button> element with an aria-label
      attribute`, (t) => {
  const button = <button aria-label="Hello world" />;

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.label(button.attribute("aria-label").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <button> element with an empty aria-label
      attribute and child text content`, (t) => {
  const text = h.text("Hello world");

  const button = <button aria-label="">{text}</button>;

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            button,
            Name.of("Hello world", [Name.Source.data(text)])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <button> element with an aria-labelledby
      attribute that points to a <p> element with child text content`, (t) => {
  const button = <button aria-labelledby="foo" />;

  const text = h.text("Hello world");

  const paragraph = <p id="foo">{text}</p>;

  <div>
    {button}
    {paragraph}
  </div>;

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.reference(
            button.attribute("aria-labelledby").get(),
            Name.of("Hello world", [
              Name.Source.descendant(
                paragraph,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <button> element with an aria-labelledby
      attribute that points to two <p> elements with child text content`, (t) => {
  const button = <button aria-labelledby="foo bar" />;

  const text1 = h.text("Hello");

  const text2 = h.text("world");

  const paragraph1 = <p id="foo">{text1}</p>;

  const paragraph2 = <p id="bar">{text2}</p>;

  <div>
    {button}
    {paragraph1}
    {paragraph2}
  </div>;

  const attribute = button.attribute("aria-labelledby").get();

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.reference(
            attribute,
            Name.of("Hello", [
              Name.Source.descendant(
                paragraph1,
                Name.of("Hello", [Name.Source.data(text1)])
              ),
            ])
          ),
          Name.Source.reference(
            attribute,
            Name.of("world", [
              Name.Source.descendant(
                paragraph2,
                Name.of("world", [Name.Source.data(text2)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <button> element with a title attribute
      and no other non-whitespace child text content`, (t) => {
  const button = (
    <button title="Hello world">
      <span> </span>
    </button>
  );

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.label(button.attribute("title").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <img> element with an alt attribute`, (t) => {
  const img = <img alt="Hello world" />;

  t.deepEqual(Name.from(img, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [Name.Source.label(img.attribute("alt").get())])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <a> element with a <img> child element
      with an alt attribute`, (t) => {
  const img = <img alt="Hello world" />;

  const a = <a href="#">{img}</a>;

  t.deepEqual(Name.from(a, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            a,
            Name.of("Hello world", [
              Name.Source.label(img.attribute("alt").get()),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <a> element with a <figure> child element
      with a <img> child element with an alt attribute`, (t) => {
  const img = <img alt="Hello world" />;

  const figure = <figure>{img}</figure>;

  const a = <a href="#">{figure}</a>;

  t.deepEqual(Name.from(a, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            a,
            Name.of("Hello world", [
              Name.Source.descendant(
                figure,
                Name.of("Hello world", [
                  Name.Source.label(img.attribute("alt").get()),
                ])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <area> element with an alt attribute`, (t) => {
  const area = <area alt="Hello world" />;

  t.deepEqual(Name.from(area, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [Name.Source.label(area.attribute("alt").get())])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <fieldset> element with a <legend> child
      element with child text content`, (t) => {
  const text = h.text("Hello world");

  const legend = <legend>{text}</legend>;

  const fieldset = (
    <fieldset>
      {legend}
      This is a fieldset
    </fieldset>
  );

  t.deepEqual(Name.from(fieldset, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            fieldset,
            Name.of("Hello world", [
              Name.Source.descendant(
                legend,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <figure> element with a <figcaption>
      child element with child text content`, (t) => {
  const text = h.text("Hello world");

  const caption = <figcaption>{text}</figcaption>;

  const figure = (
    <figure>
      <img alt="This is an image"></img>
      {caption}
    </figure>
  );

  t.deepEqual(Name.from(figure, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            figure,
            Name.of("Hello world", [
              Name.Source.descendant(
                caption,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <table> element with a <caption> child
      element with child text content`, (t) => {
  const text = h.text("Hello world");

  const caption = <caption>{text}</caption>;

  const table = (
    <table>
      {caption}
      <tr>
        <td>This is a table cell</td>
      </tr>
    </table>
  );

  t.deepEqual(Name.from(table, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            table,
            Name.of("Hello world", [
              Name.Source.descendant(
                caption,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input> element with a <label> parent
      element with child text content`, (t) => {
  const text = h.text("Hello world");

  const input = <input />;

  const label = (
    <label>
      {text}
      {input}
    </label>
  );

  <form>{label}</form>;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.ancestor(
            label,
            Name.of("Hello world", [
              Name.Source.descendant(
                label,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input> element with a <label> element
      whose for attribute points to the <input> element`, (t) => {
  const text = h.text("Hello world");

  const input = <input id="foo" />;

  const label = <label for="foo">{text}</label>;

  <form>
    {label}
    {input}
  </form>;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.reference(
            label.attribute("for").get(),
            Name.of("Hello world", [
              Name.Source.descendant(
                label,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input> element with both a <label>
      parent element with child text content and a <label> element whose for
      attribute points to the <input> element`, (t) => {
  const text1 = h.text("Hello world");
  const text2 = h.text("!");

  const input = <input id="foo" />;

  const label1 = (
    <label>
      {text1}
      {input}
    </label>
  );

  const label2 = <label for="foo">{text2}</label>;

  <form>
    {label1}
    {label2}
  </form>;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world !", [
          Name.Source.ancestor(
            label1,
            Name.of("Hello world", [
              Name.Source.descendant(
                label1,
                Name.of("Hello world", [Name.Source.data(text1)])
              ),
            ])
          ),
          Name.Source.reference(
            label2.attribute("for").get(),
            Name.of("!", [
              Name.Source.descendant(
                label2,
                Name.of("!", [Name.Source.data(text2)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <select> element with a <label> parent
      element with child text content`, (t) => {
  const text = h.text("Hello world");

  const select = <select />;

  const label = (
    <label>
      {text}
      {select}
    </label>
  );

  <form>{label}</form>;

  t.deepEqual(Name.from(select, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.ancestor(
            label,
            Name.of("Hello world", [
              Name.Source.descendant(
                label,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input> element with a placeholder
      attribute`, (t) => {
  const input = <input placeholder="Hello world" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.label(input.attribute("placeholder").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input> element with a placeholder
      and a title attribute, with the title attribute taking precedence`, (t) => {
  const input = <input title="Hello title" placeholder="Hello placeholder" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello title", [
          Name.Source.label(input.attribute("title").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input type="button"> element with a
      value attribute`, (t) => {
  const input = <input type="button" value="Hello world" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.label(input.attribute("value").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input type="submit"> element`, (t) => {
  const input = <input type="submit" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [Option.of(Name.of("Submit")), []],
  ]);
});

test(`.from() determines the name of an <input type="submit"> element with a
      value attribute`, (t) => {
  const input = <input type="submit" value="Hello world" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.label(input.attribute("value").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input type="reset"> element`, (t) => {
  const input = <input type="reset" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [Option.of(Name.of("Reset")), []],
  ]);
});

test(`.from() determines the name of an <input type="reset"> element with a
      value attribute`, (t) => {
  const input = <input type="reset" value="Hello world" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.label(input.attribute("value").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an <input type="image"> element`, (t) => {
  const input = <input type="image" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [Option.of(Name.of("Submit")), []],
  ]);
});

test(`.from() determines the name of an <input type="image"> element with an
      alt attribute`, (t) => {
  const input = <input type="image" alt="Hello world" />;

  t.deepEqual(Name.from(input, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.label(input.attribute("alt").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <button> element with a role of
      presentation`, (t) => {
  const text = h.text("Hello world");

  // Due to presentational role conflict resolution, the role of `presentation`
  // is ignored to ensure that the button, which is focusable, remains operable.
  const button = <button role="presentation">{text}</button>;

  t.deepEqual(Name.from(button, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            button,
            Name.of("Hello world", [Name.Source.data(text)])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of a <img> element with a an empty alt
      attribute and an aria-label attribute`, (t) => {
  // Due to presentational role conflict resolution, the role of `presentation`
  // is ignored to ensure that the `aria-label` attribute, which is a global
  // `aria-*` attribute, is exposed.
  const img = <img alt="" aria-label="Hello world" />;

  t.deepEqual(Name.from(img, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.label(img.attribute("aria-label").get()),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an SVG <svg> element with a <title> child
      element with child text content`, (t) => {
  const text = h.text("Hello world");

  const title = <title xmlns={Namespace.SVG}>{text}</title>;

  const svg = <svg xmlns={Namespace.SVG}>{title}</svg>;

  t.equal(svg.namespace.get(), Namespace.SVG);

  t.deepEqual(Name.from(svg, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            svg,
            Name.of("Hello world", [
              Name.Source.descendant(
                title,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() determines the name of an SVG <a> element with child text content`, (t) => {
  const text = h.text("Hello world");

  const a = (
    <a xmlns={Namespace.SVG} href="#">
      {text}
    </a>
  );

  t.equal(a.namespace.get(), Namespace.SVG);

  t.deepEqual(Name.from(a, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            a,
            Name.of("Hello world", [Name.Source.data(text)])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() correctly handles aria-labelledby references to hidden elements
      with child elements with child text content`, (t) => {
  const text = h.text("Hello world");

  const span = <span>{text}</span>;

  const div = (
    <div id="foo" hidden>
      {span}
    </div>
  );

  const label = <label aria-labelledby="foo"></label>;

  <div>
    {label}
    {div}
  </div>;

  t.deepEqual(Name.from(label, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.reference(
            label.attribute("aria-labelledby").get(),
            Name.of("Hello world", [
              Name.Source.descendant(
                div,
                Name.of("Hello world", [
                  Name.Source.descendant(
                    span,
                    Name.of("Hello world", [Name.Source.data(text)])
                  ),
                ])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() correctly handles circular aria-labelledby references`, (t) => {
  const text = h.text("Bar");

  const foo = (
    <div id="foo" aria-labelledby="bar">
      Foo
    </div>
  );

  const bar = (
    <div id="bar" aria-labelledby="foo">
      {text}
    </div>
  );

  <div>
    {foo}
    {bar}
  </div>;

  t.deepEqual(Name.from(foo, device).toArray(), [
    [
      Option.of(
        Name.of("Bar", [
          Name.Source.reference(
            foo.attribute("aria-labelledby").get(),
            Name.of("Bar", [
              Name.Source.descendant(
                bar,
                Name.of("Bar", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() correctly handles chained aria-labelledby references`, (t) => {
  const text1 = h.text("Bar");
  const text2 = h.text("Baz");

  const foo = (
    <div id="foo" aria-labelledby="bar">
      Foo
    </div>
  );

  const bar = (
    <div id="bar" aria-labelledby="baz">
      {text1}
    </div>
  );

  const baz = <div id="baz">{text2}</div>;

  <div>
    {foo}
    {bar}
    {baz}
  </div>;

  // From the perspective of `foo`, `bar` has a name of "Bar" as the second
  // `aria-labelledby` reference isn't followed.
  t.deepEqual(Name.from(foo, device).toArray(), [
    [
      Option.of(
        Name.of("Bar", [
          Name.Source.reference(
            foo.attribute("aria-labelledby").get(),
            Name.of("Bar", [
              Name.Source.descendant(
                bar,
                Name.of("Bar", [Name.Source.data(text1)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);

  // From the perspective of `bar`, it has a name of "Baz" as `bar` doesn't care
  // about `foo` and therefore only sees a single `aria-labelledby` reference.
  t.deepEqual(Name.from(bar, device).toArray(), [
    [
      Option.of(
        Name.of("Baz", [
          Name.Source.reference(
            bar.attribute("aria-labelledby").get(),
            Name.of("Baz", [
              Name.Source.descendant(
                baz,
                Name.of("Baz", [Name.Source.data(text2)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(".from() ignores nodes that are not exposed when computing name from content", (t) => {
  const text = h.text("Hello ");
  const exposed = <span>{text}</span>;
  const notExposed = <span aria-hidden="true">World!</span>;

  const heading = (
    <h1>
      {exposed}
      {notExposed}
    </h1>
  );

  t.deepEqual(Name.from(heading, device).toArray(), [
    [
      Option.of(
        Name.of("Hello", [
          Name.Source.descendant(
            heading,
            Name.of("Hello", [
              Name.Source.descendant(
                exposed,
                Name.of("Hello ", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});

test(`.from() behaves correctly when encountering a descendant that doesn't
      itself have a name, but should have one when required by an ancestor`, (t) => {
  const text = h.text("Hello world");

  const table = <table>{text}</table>;

  const heading = <h1>{table}</h1>;

  // On its own, the <table> element has no name as it's not named by its
  // contents.
  t.deepEqual(Name.from(table, device).toArray(), [[None, []]]);

  // When part of an <h1> element, which is named by its content, the <table>
  // element also takes its name from its content to ensure that the name
  // propagates to the <h1> element.
  t.deepEqual(Name.from(heading, device).toArray(), [
    [
      Option.of(
        Name.of("Hello world", [
          Name.Source.descendant(
            heading,
            Name.of("Hello world", [
              Name.Source.descendant(
                table,
                Name.of("Hello world", [Name.Source.data(text)])
              ),
            ])
          ),
        ])
      ),
      [],
    ],
  ]);
});
