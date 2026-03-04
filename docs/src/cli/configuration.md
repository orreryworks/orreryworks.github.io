# Configuration

Orrery can be configured with a TOML file that sets default layout engines and background colors. These defaults apply when attributes are not specified in the diagram source.

## File locations

Orrery searches for a configuration file in this order:

1. **Explicit path** — provided with `-c` or `--config`
2. **Local directory** — `./orrery/config.toml`
3. **User config directory** — platform-specific location following the [directories](https://docs.rs/directories/latest/directories/) crate convention (qualifier `"com"`, organization `"orrery"`, application `"orrery"`)

If no configuration file is found, built-in defaults are used.

## Format

The configuration file uses TOML syntax with two optional sections:

```toml
[layout]
component = "basic"
sequence = "basic"

[style]
background_color = "#f5f5f5"
```

## Sections

### `[layout]`

Default layout engines for each diagram type.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `component` | string | `"basic"` | Layout engine for component diagrams |
| `sequence` | string | `"basic"` | Layout engine for sequence diagrams |

Available layout engines:

| Value | Diagram types | Description |
|-------|--------------|-------------|
| `"basic"` | Component, Sequence | Simple deterministic positioning |
| `"sugiyama"` | Component only | Hierarchical layered layout |

### `[style]`

Default visual settings for diagrams.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `background_color` | string | transparent | Default background color for all diagrams |

Accepts any CSS color string: named colors, `#hex`, `rgb()`, `rgba()`.


## Priority

When the same setting is specified in multiple places, Orrery uses this precedence (highest first):

### Layout engine

1. `layout_engine` attribute in the diagram declaration
2. Default in configuration file
3. Built-in default (`"basic"`)

### Background color

1. `background_color` attribute in the diagram declaration
2. Default in configuration file
3. Built-in default (transparent)

### Embedded diagrams

1. Attributes on the embedded diagram declaration
2. Configuration file defaults
3. Built-in defaults for that diagram type

## Example

A complete configuration file:

```toml
# Use Sugiyama layout for component diagrams by default
[layout]
component = "sugiyama"
sequence = "basic"

# Light gray background for all diagrams
[style]
background_color = "#f8f8f8"
```

Use it with:

```sh
orrery diagram.orr -c config.toml -o output.svg
```
