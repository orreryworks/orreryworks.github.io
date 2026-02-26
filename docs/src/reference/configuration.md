# Configuration

Orrery supports configuration through a TOML file that specifies default settings for diagram rendering.

## Configuration File Locations

Orrery searches for configuration files in the following order (first found wins):

1. **Explicit path** — provided with `-c` / `--config` flag
2. **Local project** — `./orrery/config.toml` in the current directory
3. **Platform-specific user config directory:**
   - Linux: `~/.config/orrery/config.toml`
   - macOS: `~/Library/Application Support/com.orrery.orrery/config.toml`
   - Windows: `%APPDATA%\orrery\orrery\config.toml`

If no configuration file is found, built-in defaults are used.

## Configuration File Format

```toml
# Layout engine configuration
[layout]
# Default layout engine for component diagrams (basic, sugiyama)
component = "basic"
# Default layout engine for sequence diagrams (basic)
sequence = "basic"

# Style configuration
[style]
# Default background color for diagrams
background_color = "#f5f5f5"

# Lifeline stroke configuration for sequence diagrams
[lifeline]
color = "black"
width = 1.0
style = "dashed"
line_cap = "butt"
line_join = "miter"
```

## Layout Engines

| Value | Layout Engine | Supported Diagram Types |
|-------|--------------|------------------------|
| `"basic"` | Basic layout (default) | Component, Sequence |
| `"sugiyama"` | Hierarchical layout | Component |

Layout engine names are case-sensitive.

## Style Configuration

- `background_color`: Sets the default background color for all diagrams. Accepts any valid CSS color string (e.g., `"#f5f5f5"`, `"white"`, `"rgb(240,240,240)"`). Can be overridden by the `background_color` attribute in individual diagram declarations.

## Lifeline Configuration

Controls the appearance of lifelines in sequence diagrams:

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `color` | String | Lifeline stroke color | `"black"` |
| `width` | Float | Lifeline stroke width | `1.0` |
| `style` | String | `"solid"`, `"dashed"`, `"dotted"`, or custom pattern | `"dashed"` |
| `line_cap` | String | `"butt"`, `"round"`, `"square"` | `"butt"` |
| `line_join` | String | `"miter"`, `"round"`, `"bevel"` | `"miter"` |

## Priority Order

### Layout Engine Priority

1. Explicit `layout_engine` attribute in diagram declaration
2. Value in configuration file
3. Built-in default (`basic`)

### Style Priority

1. Explicit attribute in diagram declaration
2. Value in configuration file
3. Built-in default (transparent)

### Embedded Diagram Priority

1. Attributes in the embedded diagram declaration (highest)
2. Configuration file settings
3. Type-specific built-in defaults (lowest)
