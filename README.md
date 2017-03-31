# faster-stable-stringify

Faster deterministic `JSON.stringify()` without bells and whistles.

```js
const stableStringify = require('faster-stable-stringify');

const json = stableStringify({greetings: 'Hello!', apples: 'bananas'});
// json = {"apples":"bananas","greetings":"Hello!"}
```

## Installation

```sh
$ npm install faster-stable-stringify
```

## Features

- `JSON.stringify` that has deterministic output
- Handles edge cases in accordance with the spec
- Replaces cycles with `"[Circular]"` similar to [isaac's
  json-stringify-safe][1]

## API

A single function is exported.

```js
stableStringify(value)
```

The behavior is identical to the native `JSON.stringify`, excluding circular
structures. See [here][2] for an explanation of the `JSON.stringify` behavior.

# Alternatives

If you need to customize the sorting behavior, or want an implementation that
throws on circular references, you may prefer to use [substack's
json-stable-stringify][3].

If you need it to work in the browser or in an environment without a native
`JSON.stringify`, you may prefer to use [nickyout's fast-stable-stringify][4].

[1]: https://github.com/isaacs/json-stringify-safe
[2]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[3]: https://github.com/substack/json-stable-stringify
[4]: https://github.com/nickyout/fast-stable-stringify
