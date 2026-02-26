# Styling

Orrery provides fine-grained control over the visual appearance of every element through stroke, text, and color attributes.

## Color formats

Four color formats are supported:

```text
fill_color="red"                        // named CSS color
fill_color="#e6f3ff"                     // hex
fill_color="rgb(100, 149, 237)"         // RGB
fill_color="rgba(255, 0, 0, 0.3)"      // RGBA (with transparency)
```

## Stroke attributes

Stroke controls borders, lines, and outlines. Stroke attributes are always grouped under `stroke=[...]`:

```text
type StyledBox = Rectangle [
    fill_color="lightblue",
    stroke=[color="navy", width=2.5, style="solid"]
];
```

Available stroke attributes:

| Attribute | Values | Description |
|-----------|--------|-------------|
| `color` | Any color value | Stroke color |
| `width` | Float (e.g., `2.0`) | Line thickness |
| `style` | `"solid"`, `"dashed"`, `"dotted"`, or custom | Dash pattern |
| `line_cap` | `"butt"`, `"round"`, `"square"` | Line end style |
| `line_join` | `"miter"`, `"round"`, `"bevel"` | Corner join style |

### Custom dash patterns

The `style` attribute accepts custom patterns as comma-separated numbers:

```text
stroke=[style="5,3"]           // 5 units dash, 3 units gap
stroke=[style="10,5,2,5"]     // long dash, gap, short dash, gap
```

### Reusable stroke types

```text
type SolidStroke = Stroke [color="navy", width=2.0, style="solid"];
type DashedStroke = Stroke [color="crimson", width=1.5, style="dashed"];

type Primary = Rectangle [fill_color="#e6f3ff", stroke=SolidStroke];
type Secondary = Rectangle [fill_color="#f0f0f0", stroke=DashedStroke];
```

## Text attributes

Text attributes control labels and are grouped under `text=[...]`:

```text
type StyledBox = Rectangle [
    fill_color="blue",
    text=[font_size=16, font_family="Arial", color="white", padding=8.0]
];
```

Available text attributes:

| Attribute | Values | Description |
|-----------|--------|-------------|
| `font_size` | Float (e.g., `14`) | Text size |
| `font_family` | String (e.g., `"Arial"`) | Font name |
| `color` | Any color value | Text color |
| `background_color` | Any color value | Background behind text |
| `padding` | Float (e.g., `5.0`) | Padding around text |

### Reusable text types

```text
type HeaderText = Text [font_size=18, font_family="Arial", color="darkblue"];
type MonoText = Text [font_size=12, font_family="Courier New", color="#333333"];

type Service = Rectangle [fill_color="#e6f3ff", text=HeaderText];
```

## Styling components

```text
diagram component;

type Service = Rectangle [
    fill_color="#e6f3ff",
    rounded=5,
    stroke=[color="#336699", width=1.5],
    text=[font_size=14, color="#333"]
];

api as "API Gateway": Service;
```

Instance-level overrides:

```text
special_api: Service [fill_color="#ffe0e0", stroke=[color="red"]];
```

## Styling relations

Arrows support stroke and text attributes:

```text
// Via type
type RequestArrow = Arrow [stroke=[color="steelblue", width=1.5]];
type ResponseArrow = Arrow [stroke=[color="seagreen", style="dashed"]];

client -> @RequestArrow server: "Request";
server -> @ResponseArrow client: "Response";

// Inline
client -> [stroke=[color="red", width=2.0], text=[color="red"]] server: "Error";
```

## Styling notes

```text
type WarningNote = Note [
    background_color="#fff3cd",
    stroke=[color="orange", width=2.0],
    text=[color="#856404"]
];

note @WarningNote [on=[server]]: "Token expires in 60s";
```

## Styling activation blocks

```text
type CriticalActivation = Activate [
    fill_color="rgba(255,180,180,0.3)",
    stroke=[color="red", width=2.0]
];

activate @CriticalActivation server {
    server -> db: "Critical operation";
};
```

## Styling fragments

Fragments have additional styling attributes beyond the standard set:

```text
opt [
    background_color="rgba(144, 238, 144, 0.1)",
    border_stroke=[color="seagreen", width=2.0],
    separator_stroke=[color="gray", style="dotted"],
    operation_label_text=[font_size=14, color="seagreen"],
    section_title_text=[font_size=12, color="gray"]
] "cache available" {
    server -> cache: "Lookup";
    cache -> server: "Hit";
};
```

| Attribute | Description |
|-----------|-------------|
| `background_color` | Fragment background |
| `border_stroke` | Outer border styling |
| `separator_stroke` | Line between sections |
| `content_padding` | Padding inside fragment |
| `operation_label_text` | Styling for the keyword label (e.g., "alt") |
| `section_title_text` | Styling for section titles |

## Diagram-level styling

Set a background color on the entire diagram:

```text
diagram component [background_color="#f8f8f8"];
```

Or set defaults in a [configuration file](../reference/configuration.md).

## Next steps

- [Literal Values Reference](../reference/literal-values.md) — complete attribute value documentation
- [Language Specification](../reference/specification.md) — full language reference
