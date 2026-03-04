/**
 * Orrery language definition for highlight.js
 *
 * Registers the "orrery" language with highlight.js for syntax highlighting
 * of .orr diagram source code. Shared by mdBook (docs/) and Zola (site/).
 *
 * Compatible with highlight.js 10.x (mdBook bundled) and 11.x (CDN).
 */

/* global hljs */

hljs.registerLanguage('orrery', function (hljs) {
  var KEYWORDS = {
    keyword:
      'diagram component sequence type as embed ' +
      'activate deactivate ' +
      'fragment section alt else opt loop par break critical ' +
      'note',
    literal: 'inf infinity',
  };

  var STRING = {
    className: 'string',
    begin: '"',
    end: '"',
    contains: [
      {
        className: 'subst',
        begin: /\\[nrtbf\\/'"0]|\\u\{[0-9a-fA-F]{1,6}\}/,
      },
    ],
  };

  var NUMBER = {
    className: 'number',
    variants: [
      { begin: /\b\d+\.?\d*([eE][+-]?\d+)?\b/ },
      { begin: /\.\d+([eE][+-]?\d+)?/ },
    ],
  };

  var LINE_COMMENT = hljs.C_LINE_COMMENT_MODE;

  // @TypeName invocation (e.g. @Arrow, @Note, @Fragment)
  // The @ prefix is styled as meta, the type name as type
  var TYPE_INVOCATION = {
    className: 'meta',
    begin: /@/,
    end: /(?=[^a-zA-Z0-9_]|$)/,
    contains: [
      {
        className: 'type',
        begin: /[A-Z]\w*/,
      },
    ],
    relevance: 10,
  };

  // CamelCase identifiers are always type names in Orrery
  var TYPE_NAME = {
    className: 'type',
    begin: /\b[A-Z][a-zA-Z0-9]+\b/,
  };

  // Element/component names: any lowercase identifier that isn't a keyword.
  // In Orrery, all non-keyword lowercase identifiers are element names — in
  // declarations (server: Rectangle), relations (server -> other), activation
  // (activate server), and note targets ([on=[server]]). A negative lookahead
  // excludes keywords so they still get hljs keyword styling.
  var IDENTIFIER = {
    className: 'title',
    begin:
      /\b(?!(?:diagram|component|sequence|type|as|embed|activate|deactivate|fragment|section|alt|else|opt|loop|par|break|critical|note|inf|infinity)\b)[a-z_]\w*/,
    relevance: 0,
  };

  // Relation operators: <->, ->, <-
  var RELATION_OP = {
    className: 'operator',
    begin: /<->|->|<-/,
  };

  // Plain relation: space-dash-space between identifiers
  var PLAIN_RELATION = {
    className: 'operator',
    begin: / - /,
  };

  // Namespace separator ::
  var NAMESPACE_SEP = {
    className: 'punctuation',
    begin: /::/,
  };

  // Punctuation: { } [ ] ; ,
  var PUNCTUATION = {
    className: 'punctuation',
    begin: /[{}\[\];,]/,
  };

  // Attribute names (snake_case identifier followed by =)
  var ATTR = {
    className: 'attr',
    begin: /\b[a-z_]\w*(?=\s*=)/,
  };

  return {
    name: 'Orrery',
    aliases: ['orr'],
    case_insensitive: false,
    keywords: KEYWORDS,
    contains: [
      LINE_COMMENT,
      STRING,
      NUMBER,
      TYPE_INVOCATION,
      TYPE_NAME,
      ATTR,
      IDENTIFIER,
      RELATION_OP,
      PLAIN_RELATION,
      NAMESPACE_SEP,
      PUNCTUATION,
    ],
  };
});

// Highlight (or re-highlight) orrery code blocks.
// Handles both mdBook (book.js runs first, blocks already processed) and
// Zola (Syntect renders unknown languages as plain text with inline styles).
// Resetting textContent strips any prior spans/styles back to plain text.
//
// Also handles "orrery-norender" blocks: these get syntax highlighting but
// the mdBook preprocessor does not render them to SVG. Useful for partial
// code snippets that aren't complete enough to compile.
document
  .querySelectorAll('code.language-orrery, code.language-orrery-norender')
  .forEach(function (block) {
    block.textContent = block.textContent;
    // Ensure highlight.js treats orrery-norender the same as orrery
    if (block.classList.contains('language-orrery-norender')) {
      block.classList.remove('language-orrery-norender');
      block.classList.add('language-orrery');
    }
    if (hljs.highlightElement) {
      hljs.highlightElement(block);
    } else {
      hljs.highlightBlock(block);
    }
  });
