const recommended = require("stylelint-config-recommended");
const standard = require("stylelint-config-standard");

require("stylelint").lint({
  files: "**/*.{js,css}",
  config: {
    "rules": {
      ...recommended.rules,
      ...standard.rules,
      "selector-type-no-unknown": [true, {
        "ignore": ["custom-elements"],
      }],
    },
    "ignoreFiles": [
      "vendor/**/*.{js,css}",
      "map_assets/**/*.{js,css}",
      "**/index.dist.{js,css}",
    ],
  },
}).then((linted) => {
  if (!linted.output) {
    return;
  }

  JSON.parse(linted.output).filter((o) => o.warnings.length || o.errored)
    .forEach((o) =>
      console.log(`
  ${o.source}:
  warnings: ${
        o.warnings.map((w) => `${w.line}:${w.column} ${w.rule} ${w.text}`).join(
          "\n",
        )
      }
  parseErrors: ${JSON.stringify(o.parseErrors)}
  `)
    );

  if (
    JSON.parse(linted.output).filter((o) => o.warnings.length || o.errored)
      .length
  ) {
    process.exitCode = 1;
  }
});
