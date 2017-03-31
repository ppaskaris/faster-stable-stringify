# Benchmarks

Disappointed with the performance of [substack's implementation][1] and with
[nickyout's faster implementation][2] lacking circular detection, I have created
my own which is benchmarked here in comparison.

Notably, this implementation emits `"[Circular]"` when it detects a circular
structure rather than throwing like substack's implementation.

That said, it should still be faster on Node.

## License

This portion is licensed as GPL-3.0. It is a derivative of [nickyout's
benchmark][3]. It is not included in the NPM package. The module proper is not a
derivative of [nickyout's implementation][2] and is licensed as Apache-2.0.

[1]: https://github.com/substack/json-stable-stringify
[2]: https://github.com/nickyout/fast-stable-stringify
[3]: https://github.com/nickyout/fast-stable-stringify#test-results
