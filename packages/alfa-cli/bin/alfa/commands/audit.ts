import * as fs from "fs";
import * as path from "path";
import * as url from "url";

import { Command, flags } from "@oclif/command";

import { Audit, Oracle, Outcome, Rule } from "@siteimprove/alfa-act";
import { Cache } from "@siteimprove/alfa-cache";
import { Orientation } from "@siteimprove/alfa-device";
import { Future } from "@siteimprove/alfa-future";
import { Iterable } from "@siteimprove/alfa-iterable";
import { None, Option } from "@siteimprove/alfa-option";
import { Rules, Question } from "@siteimprove/alfa-rules";
import { Scraper } from "@siteimprove/alfa-scraper";
import { Page } from "@siteimprove/alfa-web";
import { evaluate } from "@siteimprove/alfa-xpath";

import enquirer from "enquirer";

import { Formatter } from "../../../src/formatter";

const { first } = Iterable;

export default class Subcommand extends Command {
  static flags = {
    help: flags.help({ char: "h" }),

    interactive: flags.boolean({ char: "i", default: false }),

    timeout: flags.integer({ default: 10000 }),

    wait: flags.enum({
      options: ["ready", "loaded", "idle"],
      default: "ready"
    }),

    format: flags.string({ char: "f", default: "json" }),

    output: flags.string({ char: "o" }),

    outcomes: flags.enum({
      options: ["ready", "loaded", "idle"],
      default: "ready"
    }),

    width: flags.integer({ char: "w", default: 800 }),
    height: flags.integer({ char: "h", default: 600 }),

    orientation: flags.enum({
      options: ["landscape", "portrait"],
      default: "landscape"
    }),

    resolution: flags.integer({ default: 1 })
  };

  static args = [{ name: "url" }];

  async run() {
    const { args, flags } = this.parse(Subcommand);

    const scraper = await Scraper.of();

    const { timeout, width, height, resolution } = flags;

    let wait = Scraper.Wait.Ready;

    if (flags.wait === "loaded") {
      wait = Scraper.Wait.Loaded;
    } else if (flags.wait === "idle") {
      wait = Scraper.Wait.Idle;
    }

    let orientation = Orientation.Landscape;

    if (flags.orientation === "portrait") {
      orientation = Orientation.Portrait;
    }

    let page: Page;
    try {
      page = await scraper.scrape(
        new URL(args.url, url.pathToFileURL(process.cwd() + path.sep)),
        {
          timeout,
          wait,
          viewport: { width, height, orientation },
          display: { resolution }
        }
      );
    } catch (err) {
      throw err;
    } finally {
      scraper.close();
    }

    const answers = Cache.empty<unknown, Cache<string, Future<any>>>();

    const oracle: Oracle<Question> = (rule, question) => {
      if (flags.interactive) {
        return answers
          .get(question.subject, Cache.empty)
          .get(question.uri, () => {
            process.stdout.write(`\n${question.subject}\n\n`);

            if (question.type === "boolean") {
              return Future.of(settle => {
                enquirer
                  .prompt<{ [key: string]: boolean }>({
                    name: question.uri,
                    type: "toggle",
                    message: question.message
                  })
                  .then(answer => {
                    settle(Option.of(question.answer(answer[question.uri])));
                  })
                  .catch(() => {
                    settle(None);
                  });
              });
            }

            if (question.type === "node") {
              return Future.of(settle => {
                enquirer
                  .prompt<{ [key: string]: string }>({
                    name: question.uri,
                    type: "input",
                    message: question.message,
                    validate: expression => {
                      if (expression === "") {
                        return true;
                      }

                      const nodes = [
                        ...evaluate(page.document, expression, {
                          composed: true,
                          nested: true
                        })
                      ];

                      if (nodes.length === 1) {
                        return true;
                      }

                      return "Invalid XPath expression";
                    }
                  })
                  .then(answer => {
                    const expression = answer[question.uri];

                    const node = first(
                      evaluate(page.document, expression, {
                        composed: true,
                        nested: true
                      })
                    );

                    settle(Option.of(question.answer(node)));
                  })
                  .catch(() => {
                    settle(None);
                  });
              });
            }

            return Future.settle(None);
          });
      }

      return Future.settle(None);
    };

    const audit = Rules.reduce(
      (audit, rule) => audit.add(rule as Rule<Page, unknown, Question>),
      Audit.of(page, oracle)
    );

    const outcomes = await audit.evaluate();

    // if (args.outcomes !== null) {
    //   results = [...results].filter(result =>
    //     args.outcomes!.includes(result.outcome)
    //   );
    // }

    let output = await report(outcomes, formatter(flags.format));

    output += "\n";

    if (flags.output === undefined) {
      process.stdout.write(output);
    } else {
      fs.writeFileSync(flags.output, output);
    }
  }
}

async function report<I, T, Q>(
  outcomes: Iterable<Outcome<I, T, Q>>,
  formatter: Formatter<I, T, Q>
): Promise<string> {
  return formatter(outcomes);
}

function formatter<I, T, Q>(format: string): Formatter<I, T, Q> {
  switch (format) {
    case "earl":
      return Formatter.EARL();

    case "json":
      return Formatter.JSON();

    default:
      try {
        return require(format) as Formatter<I, T, Q>;
      } catch (err) {
        throw new Error(`No such formatter found: ${format}`);
      }
  }
}
