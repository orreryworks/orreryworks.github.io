# Commands & Options

The `orrery` command reads an `.orr` source file and renders it as an SVG diagram.

## Usage

```
orrery <input> [options]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<input>` | Yes | Path to the `.orr` source file |

## Options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--output <path>` | `-o` | `out.svg` | Path for the output SVG file |
| `--config <path>` | `-c` | — | Path to a TOML [configuration file](configuration.md) |
| `--log-level <level>` | — | `info` | Logging verbosity |

### Log levels

| Level | Description |
|-------|-------------|
| `off` | No output |
| `error` | Errors only |
| `warn` | Errors and warnings |
| `info` | General progress information (default) |
| `debug` | Detailed processing information |
| `trace` | Full diagnostic output |

## Examples

Render a diagram with default settings:

```sh
orrery diagram.orr
```

Specify an output file:

```sh
orrery diagram.orr -o architecture.svg
```

Use a custom configuration file:

```sh
orrery diagram.orr -c orrery/config.toml -o output.svg
```

Quiet mode (errors only):

```sh
orrery diagram.orr --log-level error
```

## Output

Orrery produces a single SVG file. The SVG includes all shapes, relations, text labels, and styling defined in the source file.

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success — SVG file written |
| `1` | Error — syntax error, semantic error, or I/O failure |

When errors occur, Orrery prints diagnostic messages to stderr with error locations, descriptions, and visual highlighting of the relevant source code. Multiple errors can be reported at once, so you may see several diagnostics from a single run.

## Error output

Each error includes a precise source location with visual context:

```
  × Undefined component 'cache' in relation
   ╭─[diagram.orr:12:1]
12 │ server -> cache: "Lookup";
   ·           ─────
   ╰────
  help: Did you mean to declare 'cache' as a component?
```
