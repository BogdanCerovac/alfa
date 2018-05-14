import { test } from "@alfa/test";
import { jsx } from "@alfa/jsx";
import { getStyle, Stage } from "../src/get-style";

test("Gets the cascaded color of an element", t => {
  const span = <span style="color: inherit" />;
  const div = <div style="color: red">{span}</div>;

  const style = getStyle(span, div, Stage.Cascaded);

  t.is(style["color"], "inherit");
});

test("Gets the specified color of an element", t => {
  const span = <span style="color: inherit" />;
  const div = <div style="color: red">{span}</div>;

  const style = getStyle(span, div, Stage.Specified);

  t.deepEqual(style["color"], { red: 255, green: 0, blue: 0, alpha: 1 });
});

test("Gets the computed color of an element", t => {
  const span = <span style="color: inherit" />;
  const div = <div style="color: red">{span}</div>;

  const style = getStyle(span, div, Stage.Computed);

  t.deepEqual(style["color"], { red: 255, green: 0, blue: 0, alpha: 1 });
});

test("Gets the cascaded font size of an element", t => {
  const span = <span style="font-size: 1.2em" />;
  const div = <div style="font-size: 16px">{span}</div>;

  const style = getStyle(span, div, Stage.Cascaded);

  t.deepEqual(style["font-size"], {
    type: "percentage",
    value: 1.2,
    unit: "em"
  });
});

test("Gets the specified font size of an element", t => {
  const span = <span style="font-size: 1.2em" />;
  const div = <div style="font-size: 16px">{span}</div>;

  const style = getStyle(span, div, Stage.Specified);

  t.deepEqual(style["font-size"], {
    type: "percentage",
    value: 1.2,
    unit: "em"
  });
});

test("Gets the computed font size of an element", t => {
  const span = <span style="font-size: 1.2em" />;
  const div = <div style="font-size: 16px">{span}</div>;

  const style = getStyle(span, div, Stage.Computed);

  t.deepEqual(style["font-size"], {
    type: "length",
    value: 19.2,
    unit: "px"
  });
});