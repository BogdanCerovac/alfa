import { Rule, Outcome } from "@siteimprove/alfa-act";
import { Record } from "@siteimprove/alfa-record";
import { Page } from "@siteimprove/alfa-web";

export function passed<T, Q>(
  rule: Rule<Page, T, Q>,
  target: T,
  expectations: Iterable<[string, Rule.Expectation]>
): Outcome.Passed<Page, T, Q> {
  return Outcome.Passed.of(rule, target, Record.from(expectations));
}

export function failed<T, Q>(
  rule: Rule<Page, T, Q>,
  target: T,
  expectations: Iterable<[string, Rule.Expectation]>
): Outcome.Failed<Page, T, Q> {
  return Outcome.Failed.of(rule, target, Record.from(expectations));
}

export function inapplicable<T, Q>(
  rule: Rule<Page, T, Q>
): Outcome.Inapplicable<Page, T, Q> {
  return Outcome.Inapplicable.of(rule);
}
