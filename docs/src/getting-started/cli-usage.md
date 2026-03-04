# CLI Usage

## Basic command

```bash
orrery <input.orr> [OPTIONS]
```

## Options

```text
Arguments:
  <INPUT>  Path to the input Orrery file

Options:
  -o, --output <OUTPUT>        Path to output SVG file [default: out.svg]
  -c, --config <CONFIG>        Path to configuration file (TOML)
      --log-level <LOG_LEVEL>  Log level (off, error, warn, info, debug, trace)
                               [default: info]
  -h, --help                   Print help
  -V, --version                Print version
```

## Examples

```bash
# Render a diagram to SVG
orrery diagram.orr -o output.svg

# Use a custom configuration file
orrery diagram.orr -o output.svg --config my-config.toml

# Silence log output
orrery diagram.orr -o output.svg --log-level off

# Debug output for troubleshooting
orrery diagram.orr -o output.svg --log-level debug
```

## Configuration

Orrery looks for a configuration file in several locations. See the [Configuration](../cli/configuration.md) reference for the full details.

Quick setup for a project:

```bash
mkdir orrery
cat > orrery/config.toml << 'EOF'
[layout]
component = "sugiyama"

[style]
background_color = "#ffffff"
EOF
```

Now any `orrery` command run from this directory will use the Sugiyama layout engine for component diagrams and a white background by default.

## Exit codes

- `0` — success
- `1` — error (parse failure, invalid input, I/O error)

Error messages include file location, error code, and a help message pointing to the source of the problem.
