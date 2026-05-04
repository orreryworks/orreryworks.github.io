# Installation

## From crates.io

The easiest way to install Orrery is via Cargo:

```bash
cargo install orrery-cli
```

This installs the `orrery` binary to your Cargo bin directory (typically `~/.cargo/bin/`).

## From source

Clone the repository and build in release mode:

```bash
git clone https://github.com/orreryworks/orrery.git
cd orrery
cargo install --path crates/orrery-cli
```

## Verify installation

```bash
orrery --version
```

You should see the version number printed. If the command is not found, ensure `~/.cargo/bin` is in your `PATH`.

## Requirements

- Rust 1.88 or later (for building from source)

## Optional dependencies

The CLI binary ships with the `graphviz` layout engine enabled by default. To use it, install [Graphviz](https://graphviz.org/) so that the `dot` command is available on your `PATH`:

| Platform | Command |
|----------|---------|
| macOS | `brew install graphviz` |
| Ubuntu/Debian | `sudo apt install graphviz` |
| Fedora | `sudo dnf install graphviz` |
| Windows | `winget install graphviz` |

If you don't need the Graphviz engine, you can install without it:

```bash
cargo install orrery-cli --no-default-features
```

This builds a binary that uses only the `basic` and `sugiyama` layout engines with no external dependencies.
