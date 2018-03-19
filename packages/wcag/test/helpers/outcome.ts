import { Test } from "@alfa/test";
import {
  Outcome,
  Result,
  Target,
  Aspect,
  Question,
  isResult
} from "@alfa/rule";
import { serialize } from "@alfa/dom";

export function outcome<T extends Target, A extends Aspect>(
  t: Test,
  results: Array<Result<T, A> | Question<T>>,
  assert: { [O in Outcome]?: Array<T | null> }
) {
  const outcomes: Array<Outcome> = ["passed", "failed", "inapplicable"];

  for (const outcome of outcomes) {
    const actual = results
      .filter(isResult)
      .filter(result => result.outcome === outcome);
    const expected = assert[outcome] || [];

    t.is(
      actual.length,
      expected.length,
      `There must be ${expected.length} ${outcome} results`
    );

    for (const target of expected) {
      if (target === null) {
      } else {
        const holds = actual.some(
          result =>
            result.outcome === "inapplicable" || result.target === target
        );

        t.true(holds, `${serialize(target)} must be ${outcome}, was `);
      }
    }
  }
}
