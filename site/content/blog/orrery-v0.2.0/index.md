+++
title = "Orrery v0.2.0"
date = 2026-04-20
description = "Import system, library files, diagram embedding via import, import aliasing, and a breaking change to embedded diagram syntax."

[taxonomies]
tags = ["release"]

[extra]
show_reading_time = true
+++

Orrery `v0.2.0` introduces an import system for sharing types and diagrams across files. See the [Import System tutorial](/docs/tutorial/imports.html) and [reference](/docs/reference/imports.html) for the full details.

<!-- more -->

## What changed

### Added

- **Namespaced import system** — Reuse type definitions across files with `import "path";` and library file headers. Imports use namespace qualification (e.g., `styles::Service`), support transitive chaining, and detect circular dependencies. ([#45](https://github.com/orreryworks/orrery/issues/45))
- **Glob import** — Bring all types from a file flat into the current scope with `import "path"::*;` to eliminate namespace prefixes. Includes last-writer-wins semantics and transitive re-exports. ([#46](https://github.com/orreryworks/orrery/issues/46))
- **Diagram embedding via import** — Reference an imported diagram as component content with `embed <name>` syntax, e.g., `import "auth_flow"; auth_box: Rectangle embed auth_flow;`. ([#49](https://github.com/orreryworks/orrery/issues/49))
- **Import aliasing** — Override the derived namespace name with `import "path" as alias;` so types are accessed as `alias::Type`. ([#48](https://github.com/orreryworks/orrery/issues/48))
- **Text label background layering** — Text label backgrounds now render above all other diagram elements including arrows and lifelines, keeping labels legible over overlapping content. ([#75](https://github.com/orreryworks/orrery/issues/75))

### Changed

- **BREAKING: Embedded diagram syntax** — Embedded diagrams now use `embed { diagram <kind>; ... };` rather than the previous `embed diagram <kind> { ... };`. The diagram header moves inside the braces. ([#53](https://github.com/orreryworks/orrery/issues/53))

## Quick example

Define reusable types in a library file:

```orrery
library;

type Service = Rectangle[fill_color="#e6f3ff", rounded=5];
type Database = Oval[fill_color="#e0f0e0"];
```

Import them in a diagram:

```orrery
diagram component;

import "shared/styles"::*;

api: Service;
db: Database;
api -> db: "Query";
```

## Update

```bash
cargo install orrery-cli
```

## Links

- [Full changelog](https://github.com/orreryworks/orrery/releases/tag/v0.2.0)
- [Documentation](/docs/)
- [GitHub](https://github.com/orreryworks/orrery)
