import { jsx } from "@siteimprove/alfa-dom/jsx";
import { test } from "@siteimprove/alfa-test";

import { Browser } from "@siteimprove/alfa-compatibility";
import { Device } from "@siteimprove/alfa-device";
import { None, Some } from "@siteimprove/alfa-option";
import { getAccessibleName } from "../src/get-accessible-name";

const device = Device.getDefaultDevice();

test("getAccessibleName() computes the text alternative of a button with text", t => {
  const button = <button>Button</button>;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Button"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() correctly resolves explicit roles", t => {
  const button = <div role="button">Button</div>;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Button"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a button with text within a span", t => {
  const button = (
    <button>
      <span>Button</span>
    </button>
  );

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Button"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() ignores non-visible nodes", t => {
  const button = (
    <button>
      Button <span style="display: none">Hidden</span>
    </button>
  );

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Button"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a button with a title and no text", t => {
  const button = <button title="Hello world" />;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a button with an aria-label", t => {
  const button = <button aria-label="Hello world">Button</button>;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() falls through when aria-label is the empty string", t => {
  const button = <button aria-label="">Button</button>;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Button"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a button with an aria-labelledby", t => {
  const button = <button aria-labelledby="h w">Button</button>;

  <div>
    {button}
    <p id="h">Hello</p>
    <p id="w">world</p>
  </div>;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() falls through when no text alternative is found in aria-labelledby", t => {
  const button = <button aria-labelledby="h w">Button</button>;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Button"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() does not infitely recurse when recursive aria-labelledby references are encountered", t => {
  const button = (
    <button id="button">
      Hello <span aria-labelledby="button">world</span>
    </button>
  );

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() returns none when a button has no text alternative", t => {
  const button = <button />;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: None,
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an image with an alt", t => {
  const img = <img src="foo.png" alt="Hello world" />;

  t.deepEqual(getAccessibleName(img, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an image with a title", t => {
  const img = <img src="foo.png" title="Hello world" />;

  t.deepEqual(getAccessibleName(img, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() returns none when an image has no text alternative", t => {
  const img = <img src="foo.png" />;

  t.deepEqual(getAccessibleName(img, device).toJSON(), {
    values: [
      {
        value: None,
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a paragraph with a title", t => {
  const p = <p title="Hello world">Paragraph</p>;

  t.deepEqual(getAccessibleName(p, device).toJSON(), {
    values: [
      {
        value: None,
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a paragraph with an aria-label", t => {
  const p = <p aria-label="Hello world">Paragraph</p>;

  t.deepEqual(getAccessibleName(p, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() returns none when a paragraph has no text alternative", t => {
  const p = <p>Paragraph</p>;

  t.deepEqual(getAccessibleName(p, device).toJSON(), {
    values: [
      {
        value: None,
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an anchor with an href", t => {
  const a = <a href="http://foo.com">Hello world</a>;

  t.deepEqual(getAccessibleName(a, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an anchor without an href", t => {
  const a = <a>Hello world</a>;

  t.deepEqual(getAccessibleName(a, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a table with a caption", t => {
  const table = (
    <table>
      <caption>Hello world</caption>
      <tbody>
        <tr>
          <td>Table row</td>
        </tr>
      </tbody>
    </table>
  );

  t.deepEqual(getAccessibleName(table, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a figure with a figcaption", t => {
  const figure = (
    <figure>
      <img src="foo.png" alt="Foo" />
      <figcaption>Hello world</figcaption>
    </figure>
  );

  t.deepEqual(getAccessibleName(figure, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of a fieldset with a legend", t => {
  const fieldset = (
    <fieldset>
      <legend>Hello world</legend>
      <input type="submit" />
    </fieldset>
  );

  t.deepEqual(getAccessibleName(fieldset, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an input with an explicit label", t => {
  const input = <input type="text" id="test" />;

  <div>
    <label for="test">Hello world</label>
    {input}
  </div>;

  t.deepEqual(getAccessibleName(input, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an input with an implicit label", t => {
  const input = <input type="text" id="test" />;

  <label>
    Hello world
    {input}
  </label>;

  t.deepEqual(getAccessibleName(input, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an input with an explicit label that includes an embedded control", t => {
  const input = <input type="text" id="test" />;

  <div>
    <label for="test">
      <textarea>Hello world</textarea>
    </label>
    {input}
  </div>;

  t.deepEqual(getAccessibleName(input, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an SVG with a title element", t => {
  const svg = (
    <svg>
      <title>Hello world</title>
      <g>
        <text>Hi there</text>
      </g>
    </svg>
  );

  t.deepEqual(getAccessibleName(svg, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() computes the text alternative of an element with content in Shadow DOM", t => {
  const button = <button aria-labelledby="foo" />;

  <div>
    <p id="foo">
      <shadow>Hello world</shadow>
    </p>
    {button}
  </div>;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});

test("getAccessibleName() correctly handles browser specific case sensitivity of roles", t => {
  const button = <div role="Button">Button</div>;

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Button"),
        branches: null
      },
      {
        value: None,
        branches: [...Browser.query(["firefox"])]
      }
    ]
  });
});

test("getAccessibleName() correctly handles aria-labelledby that points to aria-hidden=true", t => {
  const button = (
    <button aria-labelledby="foo">
      <span id="foo" aria-hidden="true">
        Hello world
      </span>
    </button>
  );

  t.deepEqual(getAccessibleName(button, device).toJSON(), {
    values: [
      {
        value: Some.of("Hello world"),
        branches: null
      }
    ]
  });
});