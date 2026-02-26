+++
title = "Announcing Orrery v0.1.0"
date = 2026-02-25
description = "First release of the Orrery diagram language — a text-based DSL for creating component and sequence diagrams, rendered to SVG."

[taxonomies]
tags = ["release"]

[extra]
show_reading_time = true
+++

Orrery v0.1.0 is out. It's a domain-specific language for creating software architecture diagrams from plain text.

<!-- more -->

## What is Orrery?

Orrery is a text-based diagram language. You write `.orr` files describing your system architecture, and the CLI renders them to SVG. No GUI, no drag-and-drop — just text that lives in your repository alongside your code.

```text
diagram component;

type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type Database = Rectangle [fill_color="#e0f0e0", rounded=10];

api as "API Gateway": Service;
auth as "Auth Service": Service;
db as "Users DB": Database;

api -> auth: "Verify";
auth -> db: "Query";
db -> auth: "Result";
auth -> api: "Token";
```

The name comes from [orreries](https://en.wikipedia.org/wiki/Orrery) — mechanical models of the solar system that make invisible orbital relationships visible and tangible. Orrery the language does the same for software architecture.

## What's in v0.1.0

This initial release includes:

- **Orrery DSL** — a text-based language for describing diagrams
- **Component diagrams** — nodes, relations, and nesting for system structure
- **Sequence diagrams** — participants, messages, activation blocks, fragments, and notes for interaction flows
- **Type system** — user-defined types with attribute inheritance and 8 built-in shape types (Rectangle, Oval, Actor, Boundary, Control, Entity, Interface, Component)
- **Layout engines** — basic layout for both diagram types, plus Sugiyama hierarchical layout for component diagrams
- **SVG rendering** — configurable styling with stroke, text, and color attributes
- **Full parsing pipeline** — tokenizer, parser, desugaring, validation, and elaboration with structured error diagnostics (error codes, labeled spans, help text)
- **CLI** — `orrery` command-line tool for rendering `.orr` files
- **Configuration** — layered TOML config via CLI flags, project-local files, and platform-specific directories

## Install

```bash
cargo install orrery-cli
```

Then render a diagram:

```bash
orrery diagram.orr -o output.svg
```

## Links

- [Documentation](/docs/)
- [Language Specification](/docs/reference/specification.html)
- [Examples](/docs/examples/component-diagrams.html)
- [GitHub](https://github.com/orreryworks/orrery)
- [crates.io](https://crates.io/crates/orrery)
- [API docs (docs.rs)](https://docs.rs/orrery)

## What's next

The [roadmap](https://github.com/orreryworks/orrery/blob/main/docs/roadmap.md) includes imports, class diagrams, an LSP, editor integrations, and more. Feedback and contributions are welcome.

Licensed under MIT or Apache-2.0, at your option.
