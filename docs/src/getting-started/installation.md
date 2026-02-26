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

- Rust 1.86 or later (for building from source)
- No runtime dependencies — Orrery is a single static binary
