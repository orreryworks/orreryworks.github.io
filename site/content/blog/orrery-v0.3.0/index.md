+++
title = "Orrery v0.3.0"
date = 2026-05-04
description = "Graphviz layout engine for component diagrams and improved arrow label readability."

[taxonomies]
tags = ["release"]

[extra]
show_reading_time = true
+++

Orrery `v0.3.0` adds **Graphviz** as a layout backend for component diagrams, delegating node placement for cleaner, crossing-minimized graphs.

<!-- more -->

## What changed

### Added

- **Graphviz layout engine for component diagrams** — Component diagrams can now select Graphviz as their layout engine with `layout_engine="graphviz"`, delegating spatial positioning to Graphviz for more balanced placements and fewer relation crossings on non-trivial graphs. Gated behind the optional `graphviz` Cargo feature (disabled by default for library crates, enabled by default in the CLI). ([#88](https://github.com/orreryworks/orrery/issues/88))
- **Default arrow text background** — Relation labels now render with a semi-transparent white background (`rgba(255, 255, 255, 0.85)`) by default, making text readable when overlapping the arrow line. ([#101](https://github.com/orreryworks/orrery/issues/101))

## Quick example

Use the Graphviz layout engine on a component diagram:

```orrery
diagram component [layout_engine="graphviz"];

type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type Database = Rectangle [fill_color="#e0f0e0", rounded=10];

gateway as "API Gateway": Service;
auth as "Auth Service": Service;
users as "User Service": Service;
orders as "Order Service": Service;
db as "Primary DB": Database;
cache as "Cache": Database;

gateway -> auth;
gateway -> users;
gateway -> orders;
auth -> db;
users -> db;
orders -> db;
orders -> cache;
```

### Prerequisites

The `graphviz` engine requires the `dot` CLI from [Graphviz](https://graphviz.org/) to be installed:

```bash
# macOS
brew install graphviz

# Ubuntu/Debian
sudo apt install graphviz
```

If Graphviz is not installed, the `basic` and `sugiyama` engines remain fully available.

## Update

```bash
cargo install orrery-cli
```

## Links

- [Full changelog](https://github.com/orreryworks/orrery/releases/tag/v0.3.0)
- [Documentation](/docs/)
- [GitHub](https://github.com/orreryworks/orrery)
