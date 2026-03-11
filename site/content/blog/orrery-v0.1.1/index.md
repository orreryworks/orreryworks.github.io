+++
title = "Orrery v0.1.1"
date = 2026-03-11
description = "Bug fixes for activation boxes, component labels, and fragment layout — plus adaptive vertical spacing in sequence diagrams."

[taxonomies]
tags = ["release"]

[extra]
show_reading_time = true
+++

Orrery v0.1.1 is a patch release focused on layout correctness and spacing improvements in sequence diagrams.

<!-- more -->

## What changed

### Added

- **Fragment layout accounts for vertical space** — Fragment operations now reserve space for the label header, section title guards, and bottom padding, preventing overlaps with subsequent elements. ([#36](https://github.com/orreryworks/orrery/issues/36))

### Fixed

- **Component labels show the correct name** — Components without an explicit `as "..."` label now display only the final path segment instead of the full qualified path. `Id` was refactored to split into `name` and `namespace`. ([#4](https://github.com/orreryworks/orrery/issues/4))
- **Activation boxes start at the triggering message** — Activation boxes now anchor to the last relation position rather than the current Y cursor, so they visually start at the message that triggers them. ([#11](https://github.com/orreryworks/orrery/issues/11))

### Changed

- **Adaptive vertical spacing** — Sequence diagram vertical spacing is now based on actual element size plus configurable padding, instead of a fixed value for all events. ([#33](https://github.com/orreryworks/orrery/issues/33))
- **MSRV bumped to 1.88** — Minimum supported Rust version moved from 1.86 to 1.88 to allow stable `let` chains syntax. ([#6](https://github.com/orreryworks/orrery/issues/6))

## Update

```bash
cargo install orrery-cli
```

## Links

- [Full changelog](https://github.com/orreryworks/orrery/releases/tag/v0.1.1)
- [Documentation](/docs/)
- [GitHub](https://github.com/orreryworks/orrery)
