(function(factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function() {
  "use strict";
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var lib = {};
  var conventions = {};
  var hasRequiredConventions;
  function requireConventions() {
    if (hasRequiredConventions) return conventions;
    hasRequiredConventions = 1;
    function find(list, predicate, ac) {
      if (ac === void 0) {
        ac = Array.prototype;
      }
      if (list && typeof ac.find === "function") {
        return ac.find.call(list, predicate);
      }
      for (var i2 = 0; i2 < list.length; i2++) {
        if (hasOwn(list, i2)) {
          var item = list[i2];
          if (predicate.call(void 0, item, i2, list)) {
            return item;
          }
        }
      }
    }
    function freeze(object, oc) {
      if (oc === void 0) {
        oc = Object;
      }
      if (oc && typeof oc.getOwnPropertyDescriptors === "function") {
        object = oc.create(null, oc.getOwnPropertyDescriptors(object));
      }
      return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
    }
    function hasOwn(object, key) {
      return Object.prototype.hasOwnProperty.call(object, key);
    }
    function assign(target, source) {
      if (target === null || typeof target !== "object") {
        throw new TypeError("target is not an object");
      }
      for (var key in source) {
        if (hasOwn(source, key)) {
          target[key] = source[key];
        }
      }
      return target;
    }
    var HTML_BOOLEAN_ATTRIBUTES = freeze({
      allowfullscreen: true,
      async: true,
      autofocus: true,
      autoplay: true,
      checked: true,
      controls: true,
      default: true,
      defer: true,
      disabled: true,
      formnovalidate: true,
      hidden: true,
      ismap: true,
      itemscope: true,
      loop: true,
      multiple: true,
      muted: true,
      nomodule: true,
      novalidate: true,
      open: true,
      playsinline: true,
      readonly: true,
      required: true,
      reversed: true,
      selected: true
    });
    function isHTMLBooleanAttribute(name) {
      return hasOwn(HTML_BOOLEAN_ATTRIBUTES, name.toLowerCase());
    }
    var HTML_VOID_ELEMENTS = freeze({
      area: true,
      base: true,
      br: true,
      col: true,
      embed: true,
      hr: true,
      img: true,
      input: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true
    });
    function isHTMLVoidElement(tagName) {
      return hasOwn(HTML_VOID_ELEMENTS, tagName.toLowerCase());
    }
    var HTML_RAW_TEXT_ELEMENTS = freeze({
      script: false,
      style: false,
      textarea: true,
      title: true
    });
    function isHTMLRawTextElement(tagName) {
      var key = tagName.toLowerCase();
      return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && !HTML_RAW_TEXT_ELEMENTS[key];
    }
    function isHTMLEscapableRawTextElement(tagName) {
      var key = tagName.toLowerCase();
      return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && HTML_RAW_TEXT_ELEMENTS[key];
    }
    function isHTMLMimeType(mimeType) {
      return mimeType === MIME_TYPE.HTML;
    }
    function hasDefaultHTMLNamespace(mimeType) {
      return isHTMLMimeType(mimeType) || mimeType === MIME_TYPE.XML_XHTML_APPLICATION;
    }
    var MIME_TYPE = freeze({
      /**
       * `text/html`, the only mime type that triggers treating an XML document as HTML.
       *
       * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
       * @see https://en.wikipedia.org/wiki/HTML Wikipedia
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
       * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring
       *      WHATWG HTML Spec
       */
      HTML: "text/html",
      /**
       * `application/xml`, the standard mime type for XML documents.
       *
       * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType
       *      registration
       * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
       * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
       */
      XML_APPLICATION: "application/xml",
      /**
       * `text/xml`, an alias for `application/xml`.
       *
       * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
       * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
       * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
       */
      XML_TEXT: "text/xml",
      /**
       * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
       * but is parsed as an XML document.
       *
       * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType
       *      registration
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
       * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
       */
      XML_XHTML_APPLICATION: "application/xhtml+xml",
      /**
       * `image/svg+xml`,
       *
       * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
       * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
       * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
       */
      XML_SVG_IMAGE: "image/svg+xml"
    });
    var _MIME_TYPES = Object.keys(MIME_TYPE).map(function(key) {
      return MIME_TYPE[key];
    });
    function isValidMimeType(mimeType) {
      return _MIME_TYPES.indexOf(mimeType) > -1;
    }
    var NAMESPACE = freeze({
      /**
       * The XHTML namespace.
       *
       * @see http://www.w3.org/1999/xhtml
       */
      HTML: "http://www.w3.org/1999/xhtml",
      /**
       * The SVG namespace.
       *
       * @see http://www.w3.org/2000/svg
       */
      SVG: "http://www.w3.org/2000/svg",
      /**
       * The `xml:` namespace.
       *
       * @see http://www.w3.org/XML/1998/namespace
       */
      XML: "http://www.w3.org/XML/1998/namespace",
      /**
       * The `xmlns:` namespace.
       *
       * @see https://www.w3.org/2000/xmlns/
       */
      XMLNS: "http://www.w3.org/2000/xmlns/"
    });
    conventions.assign = assign;
    conventions.find = find;
    conventions.freeze = freeze;
    conventions.HTML_BOOLEAN_ATTRIBUTES = HTML_BOOLEAN_ATTRIBUTES;
    conventions.HTML_RAW_TEXT_ELEMENTS = HTML_RAW_TEXT_ELEMENTS;
    conventions.HTML_VOID_ELEMENTS = HTML_VOID_ELEMENTS;
    conventions.hasDefaultHTMLNamespace = hasDefaultHTMLNamespace;
    conventions.hasOwn = hasOwn;
    conventions.isHTMLBooleanAttribute = isHTMLBooleanAttribute;
    conventions.isHTMLRawTextElement = isHTMLRawTextElement;
    conventions.isHTMLEscapableRawTextElement = isHTMLEscapableRawTextElement;
    conventions.isHTMLMimeType = isHTMLMimeType;
    conventions.isHTMLVoidElement = isHTMLVoidElement;
    conventions.isValidMimeType = isValidMimeType;
    conventions.MIME_TYPE = MIME_TYPE;
    conventions.NAMESPACE = NAMESPACE;
    return conventions;
  }
  var errors = {};
  var hasRequiredErrors;
  function requireErrors() {
    if (hasRequiredErrors) return errors;
    hasRequiredErrors = 1;
    var conventions2 = requireConventions();
    function extendError(constructor, writableName) {
      constructor.prototype = Object.create(Error.prototype, {
        constructor: { value: constructor },
        name: { value: constructor.name, enumerable: true, writable: writableName }
      });
    }
    var DOMExceptionName = conventions2.freeze({
      /**
       * the default value as defined by the spec
       */
      Error: "Error",
      /**
       * @deprecated
       * Use RangeError instead.
       */
      IndexSizeError: "IndexSizeError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      DomstringSizeError: "DomstringSizeError",
      HierarchyRequestError: "HierarchyRequestError",
      WrongDocumentError: "WrongDocumentError",
      InvalidCharacterError: "InvalidCharacterError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      NoDataAllowedError: "NoDataAllowedError",
      NoModificationAllowedError: "NoModificationAllowedError",
      NotFoundError: "NotFoundError",
      NotSupportedError: "NotSupportedError",
      InUseAttributeError: "InUseAttributeError",
      InvalidStateError: "InvalidStateError",
      SyntaxError: "SyntaxError",
      InvalidModificationError: "InvalidModificationError",
      NamespaceError: "NamespaceError",
      /**
       * @deprecated
       * Use TypeError for invalid arguments,
       * "NotSupportedError" DOMException for unsupported operations,
       * and "NotAllowedError" DOMException for denied requests instead.
       */
      InvalidAccessError: "InvalidAccessError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      ValidationError: "ValidationError",
      /**
       * @deprecated
       * Use TypeError instead.
       */
      TypeMismatchError: "TypeMismatchError",
      SecurityError: "SecurityError",
      NetworkError: "NetworkError",
      AbortError: "AbortError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      URLMismatchError: "URLMismatchError",
      QuotaExceededError: "QuotaExceededError",
      TimeoutError: "TimeoutError",
      InvalidNodeTypeError: "InvalidNodeTypeError",
      DataCloneError: "DataCloneError",
      EncodingError: "EncodingError",
      NotReadableError: "NotReadableError",
      UnknownError: "UnknownError",
      ConstraintError: "ConstraintError",
      DataError: "DataError",
      TransactionInactiveError: "TransactionInactiveError",
      ReadOnlyError: "ReadOnlyError",
      VersionError: "VersionError",
      OperationError: "OperationError",
      NotAllowedError: "NotAllowedError",
      OptOutError: "OptOutError"
    });
    var DOMExceptionNames = Object.keys(DOMExceptionName);
    function isValidDomExceptionCode(value) {
      return typeof value === "number" && value >= 1 && value <= 25;
    }
    function endsWithError(value) {
      return typeof value === "string" && value.substring(value.length - DOMExceptionName.Error.length) === DOMExceptionName.Error;
    }
    function DOMException(messageOrCode, nameOrMessage) {
      if (isValidDomExceptionCode(messageOrCode)) {
        this.name = DOMExceptionNames[messageOrCode];
        this.message = nameOrMessage || "";
      } else {
        this.message = messageOrCode;
        this.name = endsWithError(nameOrMessage) ? nameOrMessage : DOMExceptionName.Error;
      }
      if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
    }
    extendError(DOMException, true);
    Object.defineProperties(DOMException.prototype, {
      code: {
        enumerable: true,
        get: function() {
          var code = DOMExceptionNames.indexOf(this.name);
          if (isValidDomExceptionCode(code)) return code;
          return 0;
        }
      }
    });
    var ExceptionCode = {
      INDEX_SIZE_ERR: 1,
      DOMSTRING_SIZE_ERR: 2,
      HIERARCHY_REQUEST_ERR: 3,
      WRONG_DOCUMENT_ERR: 4,
      INVALID_CHARACTER_ERR: 5,
      NO_DATA_ALLOWED_ERR: 6,
      NO_MODIFICATION_ALLOWED_ERR: 7,
      NOT_FOUND_ERR: 8,
      NOT_SUPPORTED_ERR: 9,
      INUSE_ATTRIBUTE_ERR: 10,
      INVALID_STATE_ERR: 11,
      SYNTAX_ERR: 12,
      INVALID_MODIFICATION_ERR: 13,
      NAMESPACE_ERR: 14,
      INVALID_ACCESS_ERR: 15,
      VALIDATION_ERR: 16,
      TYPE_MISMATCH_ERR: 17,
      SECURITY_ERR: 18,
      NETWORK_ERR: 19,
      ABORT_ERR: 20,
      URL_MISMATCH_ERR: 21,
      QUOTA_EXCEEDED_ERR: 22,
      TIMEOUT_ERR: 23,
      INVALID_NODE_TYPE_ERR: 24,
      DATA_CLONE_ERR: 25
    };
    var entries = Object.entries(ExceptionCode);
    for (var i2 = 0; i2 < entries.length; i2++) {
      var key = entries[i2][0];
      DOMException[key] = entries[i2][1];
    }
    function ParseError(message, locator) {
      this.message = message;
      this.locator = locator;
      if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
    }
    extendError(ParseError);
    errors.DOMException = DOMException;
    errors.DOMExceptionName = DOMExceptionName;
    errors.ExceptionCode = ExceptionCode;
    errors.ParseError = ParseError;
    return errors;
  }
  var dom = {};
  var grammar = {};
  var hasRequiredGrammar;
  function requireGrammar() {
    if (hasRequiredGrammar) return grammar;
    hasRequiredGrammar = 1;
    function detectUnicodeSupport(RegExpImpl) {
      try {
        if (typeof RegExpImpl !== "function") {
          RegExpImpl = RegExp;
        }
        var match = new RegExpImpl("𝌆", "u").exec("𝌆");
        return !!match && match[0].length === 2;
      } catch (error) {
      }
      return false;
    }
    var UNICODE_SUPPORT = detectUnicodeSupport();
    function chars(regexp) {
      if (regexp.source[0] !== "[") {
        throw new Error(regexp + " can not be used with chars");
      }
      return regexp.source.slice(1, regexp.source.lastIndexOf("]"));
    }
    function chars_without(regexp, search) {
      if (regexp.source[0] !== "[") {
        throw new Error("/" + regexp.source + "/ can not be used with chars_without");
      }
      if (!search || typeof search !== "string") {
        throw new Error(JSON.stringify(search) + " is not a valid search");
      }
      if (regexp.source.indexOf(search) === -1) {
        throw new Error('"' + search + '" is not is /' + regexp.source + "/");
      }
      if (search === "-" && regexp.source.indexOf(search) !== 1) {
        throw new Error('"' + search + '" is not at the first postion of /' + regexp.source + "/");
      }
      return new RegExp(regexp.source.replace(search, ""), UNICODE_SUPPORT ? "u" : "");
    }
    function reg(args) {
      var self2 = this;
      return new RegExp(
        Array.prototype.slice.call(arguments).map(function(part) {
          var isStr = typeof part === "string";
          if (isStr && self2 === void 0 && part === "|") {
            throw new Error("use regg instead of reg to wrap expressions with `|`!");
          }
          return isStr ? part : part.source;
        }).join(""),
        UNICODE_SUPPORT ? "mu" : "m"
      );
    }
    function regg(args) {
      if (arguments.length === 0) {
        throw new Error("no parameters provided");
      }
      return reg.apply(regg, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]));
    }
    var UNICODE_REPLACEMENT_CHARACTER = "�";
    var Char = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
    if (UNICODE_SUPPORT) {
      Char = reg("[", chars(Char), "\\u{10000}-\\u{10FFFF}", "]");
    }
    var _SChar = /[\x20\x09\x0D\x0A]/;
    var SChar_s = chars(_SChar);
    var S = reg(_SChar, "+");
    var S_OPT = reg(_SChar, "*");
    var NameStartChar = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    if (UNICODE_SUPPORT) {
      NameStartChar = reg("[", chars(NameStartChar), "\\u{10000}-\\u{10FFFF}", "]");
    }
    var NameStartChar_s = chars(NameStartChar);
    var NameChar = reg("[", NameStartChar_s, chars(/[-.0-9\xB7]/), chars(/[\u0300-\u036F\u203F-\u2040]/), "]");
    var Name = reg(NameStartChar, NameChar, "*");
    var Nmtoken = reg(NameChar, "+");
    var EntityRef = reg("&", Name, ";");
    var CharRef = regg(/&#[0-9]+;|&#x[0-9a-fA-F]+;/);
    var Reference = regg(EntityRef, "|", CharRef);
    var PEReference = reg("%", Name, ";");
    var EntityValue = regg(
      reg('"', regg(/[^%&"]/, "|", PEReference, "|", Reference), "*", '"'),
      "|",
      reg("'", regg(/[^%&']/, "|", PEReference, "|", Reference), "*", "'")
    );
    var AttValue = regg('"', regg(/[^<&"]/, "|", Reference), "*", '"', "|", "'", regg(/[^<&']/, "|", Reference), "*", "'");
    var NCNameStartChar = chars_without(NameStartChar, ":");
    var NCNameChar = chars_without(NameChar, ":");
    var NCName = reg(NCNameStartChar, NCNameChar, "*");
    var QName = reg(NCName, regg(":", NCName), "?");
    var QName_exact = reg("^", QName, "$");
    var QName_group = reg("(", QName, ")");
    var SystemLiteral = regg(/"[^"]*"|'[^']*'/);
    var PI = reg(/^<\?/, "(", Name, ")", regg(S, "(", Char, "*?)"), "?", /\?>/);
    var PubidChar = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/;
    var PubidLiteral = regg('"', PubidChar, '*"', "|", "'", chars_without(PubidChar, "'"), "*'");
    var COMMENT_START = "<!--";
    var COMMENT_END = "-->";
    var Comment = reg(COMMENT_START, regg(chars_without(Char, "-"), "|", reg("-", chars_without(Char, "-"))), "*", COMMENT_END);
    var PCDATA = "#PCDATA";
    var Mixed = regg(
      reg(/\(/, S_OPT, PCDATA, regg(S_OPT, /\|/, S_OPT, QName), "*", S_OPT, /\)\*/),
      "|",
      reg(/\(/, S_OPT, PCDATA, S_OPT, /\)/)
    );
    var _children_quantity = /[?*+]?/;
    var children = reg(
      /\([^>]+\)/,
      _children_quantity
      /*regg(choice, '|', seq), _children_quantity*/
    );
    var contentspec = regg("EMPTY", "|", "ANY", "|", Mixed, "|", children);
    var ELEMENTDECL_START = "<!ELEMENT";
    var elementdecl = reg(ELEMENTDECL_START, S, regg(QName, "|", PEReference), S, regg(contentspec, "|", PEReference), S_OPT, ">");
    var NotationType = reg("NOTATION", S, /\(/, S_OPT, Name, regg(S_OPT, /\|/, S_OPT, Name), "*", S_OPT, /\)/);
    var Enumeration = reg(/\(/, S_OPT, Nmtoken, regg(S_OPT, /\|/, S_OPT, Nmtoken), "*", S_OPT, /\)/);
    var EnumeratedType = regg(NotationType, "|", Enumeration);
    var AttType = regg(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", EnumeratedType);
    var DefaultDecl = regg(/#REQUIRED|#IMPLIED/, "|", regg(regg("#FIXED", S), "?", AttValue));
    var AttDef = regg(S, Name, S, AttType, S, DefaultDecl);
    var ATTLIST_DECL_START = "<!ATTLIST";
    var AttlistDecl = reg(ATTLIST_DECL_START, S, Name, AttDef, "*", S_OPT, ">");
    var ABOUT_LEGACY_COMPAT = "about:legacy-compat";
    var ABOUT_LEGACY_COMPAT_SystemLiteral = regg('"' + ABOUT_LEGACY_COMPAT + '"', "|", "'" + ABOUT_LEGACY_COMPAT + "'");
    var SYSTEM = "SYSTEM";
    var PUBLIC = "PUBLIC";
    var ExternalID = regg(regg(SYSTEM, S, SystemLiteral), "|", regg(PUBLIC, S, PubidLiteral, S, SystemLiteral));
    var ExternalID_match = reg(
      "^",
      regg(
        regg(SYSTEM, S, "(?<SystemLiteralOnly>", SystemLiteral, ")"),
        "|",
        regg(PUBLIC, S, "(?<PubidLiteral>", PubidLiteral, ")", S, "(?<SystemLiteral>", SystemLiteral, ")")
      )
    );
    var NDataDecl = regg(S, "NDATA", S, Name);
    var EntityDef = regg(EntityValue, "|", regg(ExternalID, NDataDecl, "?"));
    var ENTITY_DECL_START = "<!ENTITY";
    var GEDecl = reg(ENTITY_DECL_START, S, Name, S, EntityDef, S_OPT, ">");
    var PEDef = regg(EntityValue, "|", ExternalID);
    var PEDecl = reg(ENTITY_DECL_START, S, "%", S, Name, S, PEDef, S_OPT, ">");
    var EntityDecl = regg(GEDecl, "|", PEDecl);
    var PublicID = reg(PUBLIC, S, PubidLiteral);
    var NotationDecl = reg("<!NOTATION", S, Name, S, regg(ExternalID, "|", PublicID), S_OPT, ">");
    var Eq = reg(S_OPT, "=", S_OPT);
    var VersionNum = /1[.]\d+/;
    var VersionInfo = reg(S, "version", Eq, regg("'", VersionNum, "'", "|", '"', VersionNum, '"'));
    var EncName = /[A-Za-z][-A-Za-z0-9._]*/;
    var EncodingDecl = regg(S, "encoding", Eq, regg('"', EncName, '"', "|", "'", EncName, "'"));
    var SDDecl = regg(S, "standalone", Eq, regg("'", regg("yes", "|", "no"), "'", "|", '"', regg("yes", "|", "no"), '"'));
    var XMLDecl = reg(/^<\?xml/, VersionInfo, EncodingDecl, "?", SDDecl, "?", S_OPT, /\?>/);
    var DOCTYPE_DECL_START = "<!DOCTYPE";
    var CDATA_START = "<![CDATA[";
    var CDATA_END = "]]>";
    var CDStart = /<!\[CDATA\[/;
    var CDEnd = /\]\]>/;
    var CData = reg(Char, "*?", CDEnd);
    var CDSect = reg(CDStart, CData);
    grammar.chars = chars;
    grammar.chars_without = chars_without;
    grammar.detectUnicodeSupport = detectUnicodeSupport;
    grammar.reg = reg;
    grammar.regg = regg;
    grammar.ABOUT_LEGACY_COMPAT = ABOUT_LEGACY_COMPAT;
    grammar.ABOUT_LEGACY_COMPAT_SystemLiteral = ABOUT_LEGACY_COMPAT_SystemLiteral;
    grammar.AttlistDecl = AttlistDecl;
    grammar.CDATA_START = CDATA_START;
    grammar.CDATA_END = CDATA_END;
    grammar.CDSect = CDSect;
    grammar.Char = Char;
    grammar.Comment = Comment;
    grammar.COMMENT_START = COMMENT_START;
    grammar.COMMENT_END = COMMENT_END;
    grammar.DOCTYPE_DECL_START = DOCTYPE_DECL_START;
    grammar.elementdecl = elementdecl;
    grammar.EntityDecl = EntityDecl;
    grammar.EntityValue = EntityValue;
    grammar.ExternalID = ExternalID;
    grammar.ExternalID_match = ExternalID_match;
    grammar.Name = Name;
    grammar.NotationDecl = NotationDecl;
    grammar.Reference = Reference;
    grammar.PEReference = PEReference;
    grammar.PI = PI;
    grammar.PUBLIC = PUBLIC;
    grammar.PubidLiteral = PubidLiteral;
    grammar.QName = QName;
    grammar.QName_exact = QName_exact;
    grammar.QName_group = QName_group;
    grammar.S = S;
    grammar.SChar_s = SChar_s;
    grammar.S_OPT = S_OPT;
    grammar.SYSTEM = SYSTEM;
    grammar.SystemLiteral = SystemLiteral;
    grammar.UNICODE_REPLACEMENT_CHARACTER = UNICODE_REPLACEMENT_CHARACTER;
    grammar.UNICODE_SUPPORT = UNICODE_SUPPORT;
    grammar.XMLDecl = XMLDecl;
    return grammar;
  }
  var hasRequiredDom;
  function requireDom() {
    if (hasRequiredDom) return dom;
    hasRequiredDom = 1;
    var conventions2 = requireConventions();
    var find = conventions2.find;
    var hasDefaultHTMLNamespace = conventions2.hasDefaultHTMLNamespace;
    var hasOwn = conventions2.hasOwn;
    var isHTMLMimeType = conventions2.isHTMLMimeType;
    var isHTMLRawTextElement = conventions2.isHTMLRawTextElement;
    var isHTMLVoidElement = conventions2.isHTMLVoidElement;
    var MIME_TYPE = conventions2.MIME_TYPE;
    var NAMESPACE = conventions2.NAMESPACE;
    var PDC = Symbol();
    var errors2 = requireErrors();
    var DOMException = errors2.DOMException;
    var DOMExceptionName = errors2.DOMExceptionName;
    var g = requireGrammar();
    function checkSymbol(symbol) {
      if (symbol !== PDC) {
        throw new TypeError("Illegal constructor");
      }
    }
    function notEmptyString(input) {
      return input !== "";
    }
    function splitOnASCIIWhitespace(input) {
      return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
    }
    function orderedSetReducer(current, element) {
      if (!hasOwn(current, element)) {
        current[element] = true;
      }
      return current;
    }
    function toOrderedSet(input) {
      if (!input) return [];
      var list = splitOnASCIIWhitespace(input);
      return Object.keys(list.reduce(orderedSetReducer, {}));
    }
    function arrayIncludes(list) {
      return function(element) {
        return list && list.indexOf(element) !== -1;
      };
    }
    function validateQualifiedName(qualifiedName) {
      if (!g.QName_exact.test(qualifiedName)) {
        throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + qualifiedName + '"');
      }
    }
    function validateAndExtract(namespace, qualifiedName) {
      validateQualifiedName(qualifiedName);
      namespace = namespace || null;
      var prefix = null;
      var localName = qualifiedName;
      if (qualifiedName.indexOf(":") >= 0) {
        var splitResult = qualifiedName.split(":");
        prefix = splitResult[0];
        localName = splitResult[1];
      }
      if (prefix !== null && namespace === null) {
        throw new DOMException(DOMException.NAMESPACE_ERR, "prefix is non-null and namespace is null");
      }
      if (prefix === "xml" && namespace !== conventions2.NAMESPACE.XML) {
        throw new DOMException(DOMException.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
      }
      if ((prefix === "xmlns" || qualifiedName === "xmlns") && namespace !== conventions2.NAMESPACE.XMLNS) {
        throw new DOMException(
          DOMException.NAMESPACE_ERR,
          'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace'
        );
      }
      if (namespace === conventions2.NAMESPACE.XMLNS && prefix !== "xmlns" && qualifiedName !== "xmlns") {
        throw new DOMException(
          DOMException.NAMESPACE_ERR,
          'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"'
        );
      }
      return [namespace, prefix, localName];
    }
    function copy(src, dest) {
      for (var p2 in src) {
        if (hasOwn(src, p2)) {
          dest[p2] = src[p2];
        }
      }
    }
    function _extends(Class, Super) {
      var pt = Class.prototype;
      if (!(pt instanceof Super)) {
        let t2 = function() {
        };
        t2.prototype = Super.prototype;
        t2 = new t2();
        copy(pt, t2);
        Class.prototype = pt = t2;
      }
      if (pt.constructor != Class) {
        if (typeof Class != "function") {
          console.error("unknown Class:" + Class);
        }
        pt.constructor = Class;
      }
    }
    var NodeType = {};
    var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
    var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
    var TEXT_NODE = NodeType.TEXT_NODE = 3;
    var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
    var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
    var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
    var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
    var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
    var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
    var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
    var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
    var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
    var DocumentPosition = conventions2.freeze({
      DOCUMENT_POSITION_DISCONNECTED: 1,
      DOCUMENT_POSITION_PRECEDING: 2,
      DOCUMENT_POSITION_FOLLOWING: 4,
      DOCUMENT_POSITION_CONTAINS: 8,
      DOCUMENT_POSITION_CONTAINED_BY: 16,
      DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32
    });
    function commonAncestor(a2, b) {
      if (b.length < a2.length) return commonAncestor(b, a2);
      var c2 = null;
      for (var n2 in a2) {
        if (a2[n2] !== b[n2]) return c2;
        c2 = a2[n2];
      }
      return c2;
    }
    function docGUID(doc) {
      if (!doc.guid) doc.guid = Math.random();
      return doc.guid;
    }
    function NodeList() {
    }
    NodeList.prototype = {
      /**
       * The number of nodes in the list. The range of valid child node indices is 0 to length-1
       * inclusive.
       *
       * @type {number}
       */
      length: 0,
      /**
       * Returns the item at `index`. If index is greater than or equal to the number of nodes in
       * the list, this returns null.
       *
       * @param index
       * Unsigned long Index into the collection.
       * @returns {Node | null}
       * The node at position `index` in the NodeList,
       * or null if that is not a valid index.
       */
      item: function(index2) {
        return index2 >= 0 && index2 < this.length ? this[index2] : null;
      },
      /**
       * Returns a string representation of the NodeList.
       *
       * @param {unknown} nodeFilter
       * __A filter function? Not implemented according to the spec?__.
       * @returns {string}
       * A string representation of the NodeList.
       */
      toString: function(nodeFilter) {
        for (var buf = [], i2 = 0; i2 < this.length; i2++) {
          serializeToString(this[i2], buf, nodeFilter);
        }
        return buf.join("");
      },
      /**
       * Filters the NodeList based on a predicate.
       *
       * @param {function(Node): boolean} predicate
       * - A predicate function to filter the NodeList.
       * @returns {Node[]}
       * An array of nodes that satisfy the predicate.
       * @private
       */
      filter: function(predicate) {
        return Array.prototype.filter.call(this, predicate);
      },
      /**
       * Returns the first index at which a given node can be found in the NodeList, or -1 if it is
       * not present.
       *
       * @param {Node} item
       * - The Node item to locate in the NodeList.
       * @returns {number}
       * The first index of the node in the NodeList; -1 if not found.
       * @private
       */
      indexOf: function(item) {
        return Array.prototype.indexOf.call(this, item);
      }
    };
    NodeList.prototype[Symbol.iterator] = function() {
      var me = this;
      var index2 = 0;
      return {
        next: function() {
          if (index2 < me.length) {
            return {
              value: me[index2++],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        },
        return: function() {
          return {
            done: true
          };
        }
      };
    };
    function LiveNodeList(node2, refresh) {
      this._node = node2;
      this._refresh = refresh;
      _updateLiveList(this);
    }
    function _updateLiveList(list) {
      var inc = list._node._inc || list._node.ownerDocument._inc;
      if (list._inc !== inc) {
        var ls = list._refresh(list._node);
        __set__(list, "length", ls.length);
        if (!list.$$length || ls.length < list.$$length) {
          for (var i2 = ls.length; i2 in list; i2++) {
            if (hasOwn(list, i2)) {
              delete list[i2];
            }
          }
        }
        copy(ls, list);
        list._inc = inc;
      }
    }
    LiveNodeList.prototype.item = function(i2) {
      _updateLiveList(this);
      return this[i2] || null;
    };
    _extends(LiveNodeList, NodeList);
    function NamedNodeMap() {
    }
    function _findNodeIndex(list, node2) {
      var i2 = 0;
      while (i2 < list.length) {
        if (list[i2] === node2) {
          return i2;
        }
        i2++;
      }
    }
    function _addNamedNode(el, list, newAttr, oldAttr) {
      if (oldAttr) {
        list[_findNodeIndex(list, oldAttr)] = newAttr;
      } else {
        list[list.length] = newAttr;
        list.length++;
      }
      if (el) {
        newAttr.ownerElement = el;
        var doc = el.ownerDocument;
        if (doc) {
          oldAttr && _onRemoveAttribute(doc, el, oldAttr);
          _onAddAttribute(doc, el, newAttr);
        }
      }
    }
    function _removeNamedNode(el, list, attr) {
      var i2 = _findNodeIndex(list, attr);
      if (i2 >= 0) {
        var lastIndex = list.length - 1;
        while (i2 <= lastIndex) {
          list[i2] = list[++i2];
        }
        list.length = lastIndex;
        if (el) {
          var doc = el.ownerDocument;
          if (doc) {
            _onRemoveAttribute(doc, el, attr);
          }
          attr.ownerElement = null;
        }
      }
    }
    NamedNodeMap.prototype = {
      length: 0,
      item: NodeList.prototype.item,
      /**
       * Get an attribute by name. Note: Name is in lower case in case of HTML namespace and
       * document.
       *
       * @param {string} localName
       * The local name of the attribute.
       * @returns {Attr | null}
       * The attribute with the given local name, or null if no such attribute exists.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
       */
      getNamedItem: function(localName) {
        if (this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace()) {
          localName = localName.toLowerCase();
        }
        var i2 = 0;
        while (i2 < this.length) {
          var attr = this[i2];
          if (attr.nodeName === localName) {
            return attr;
          }
          i2++;
        }
        return null;
      },
      /**
       * Set an attribute.
       *
       * @param {Attr} attr
       * The attribute to set.
       * @returns {Attr | null}
       * The old attribute with the same local name and namespace URI as the new one, or null if no
       * such attribute exists.
       * @throws {DOMException}
       * With code:
       * - {@link INUSE_ATTRIBUTE_ERR} - If the attribute is already an attribute of another
       * element.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
       */
      setNamedItem: function(attr) {
        var el = attr.ownerElement;
        if (el && el !== this._ownerElement) {
          throw new DOMException(DOMException.INUSE_ATTRIBUTE_ERR);
        }
        var oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
        if (oldAttr === attr) {
          return attr;
        }
        _addNamedNode(this._ownerElement, this, attr, oldAttr);
        return oldAttr;
      },
      /**
       * Set an attribute, replacing an existing attribute with the same local name and namespace
       * URI if one exists.
       *
       * @param {Attr} attr
       * The attribute to set.
       * @returns {Attr | null}
       * The old attribute with the same local name and namespace URI as the new one, or null if no
       * such attribute exists.
       * @throws {DOMException}
       * Throws a DOMException with the name "InUseAttributeError" if the attribute is already an
       * attribute of another element.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
       */
      setNamedItemNS: function(attr) {
        return this.setNamedItem(attr);
      },
      /**
       * Removes an attribute specified by the local name.
       *
       * @param {string} localName
       * The local name of the attribute to be removed.
       * @returns {Attr}
       * The attribute node that was removed.
       * @throws {DOMException}
       * With code:
       * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given name is found.
       * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
       */
      removeNamedItem: function(localName) {
        var attr = this.getNamedItem(localName);
        if (!attr) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, localName);
        }
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      /**
       * Removes an attribute specified by the namespace and local name.
       *
       * @param {string | null} namespaceURI
       * The namespace URI of the attribute to be removed.
       * @param {string} localName
       * The local name of the attribute to be removed.
       * @returns {Attr}
       * The attribute node that was removed.
       * @throws {DOMException}
       * With code:
       * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given namespace URI and local
       * name is found.
       * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
       */
      removeNamedItemNS: function(namespaceURI, localName) {
        var attr = this.getNamedItemNS(namespaceURI, localName);
        if (!attr) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, namespaceURI ? namespaceURI + " : " + localName : localName);
        }
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      /**
       * Get an attribute by namespace and local name.
       *
       * @param {string | null} namespaceURI
       * The namespace URI of the attribute.
       * @param {string} localName
       * The local name of the attribute.
       * @returns {Attr | null}
       * The attribute with the given namespace URI and local name, or null if no such attribute
       * exists.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
       */
      getNamedItemNS: function(namespaceURI, localName) {
        if (!namespaceURI) {
          namespaceURI = null;
        }
        var i2 = 0;
        while (i2 < this.length) {
          var node2 = this[i2];
          if (node2.localName === localName && node2.namespaceURI === namespaceURI) {
            return node2;
          }
          i2++;
        }
        return null;
      }
    };
    NamedNodeMap.prototype[Symbol.iterator] = function() {
      var me = this;
      var index2 = 0;
      return {
        next: function() {
          if (index2 < me.length) {
            return {
              value: me[index2++],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        },
        return: function() {
          return {
            done: true
          };
        }
      };
    };
    function DOMImplementation() {
    }
    DOMImplementation.prototype = {
      /**
       * Test if the DOM implementation implements a specific feature and version, as specified in
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/core.html#DOMFeatures DOM Features}.
       *
       * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given
       * feature is supported. The different implementations fairly diverged in what kind of
       * features were reported. The latest version of the spec settled to force this method to
       * always return true, where the functionality was accurate and in use.
       *
       * @deprecated
       * It is deprecated and modern browsers return true in all cases.
       * @function DOMImplementation#hasFeature
       * @param {string} feature
       * The name of the feature to test.
       * @param {string} [version]
       * This is the version number of the feature to test.
       * @returns {boolean}
       * Always returns true.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
       * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-5CED94D7 DOM Level 3 Core
       */
      hasFeature: function(feature, version) {
        return true;
      },
      /**
       * Creates a DOM Document object of the specified type with its document element. Note that
       * based on the {@link DocumentType}
       * given to create the document, the implementation may instantiate specialized
       * {@link Document} objects that support additional features than the "Core", such as "HTML"
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML}.
       * On the other hand, setting the {@link DocumentType} after the document was created makes
       * this very unlikely to happen. Alternatively, specialized {@link Document} creation methods,
       * such as createHTMLDocument
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML},
       * can be used to obtain specific types of {@link Document} objects.
       *
       * __It behaves slightly different from the description in the living standard__:
       * - There is no interface/class `XMLDocument`, it returns a `Document`
       * instance (with it's `type` set to `'xml'`).
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       *
       * @function DOMImplementation.createDocument
       * @param {string | null} namespaceURI
       * The
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-namespaceURI namespace URI}
       * of the document element to create or null.
       * @param {string | null} qualifiedName
       * The
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified name}
       * of the document element to be created or null.
       * @param {DocumentType | null} [doctype=null]
       * The type of document to be created or null. When doctype is not null, its
       * {@link Node#ownerDocument} attribute is set to the document being created. Default is
       * `null`
       * @returns {Document}
       * A new {@link Document} object with its document element. If the NamespaceURI,
       * qualifiedName, and doctype are null, the returned {@link Document} is empty with no
       * document element.
       * @throws {DOMException}
       * With code:
       *
       * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
       * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
       * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed, if the qualifiedName has a
       * prefix and the namespaceURI is null, or if the qualifiedName is null and the namespaceURI
       * is different from null, or if the qualifiedName has a prefix that is "xml" and the
       * namespaceURI is different from "{@link http://www.w3.org/XML/1998/namespace}"
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#Namespaces XML Namespaces},
       * or if the DOM implementation does not support the "XML" feature but a non-null namespace
       * URI was provided, since namespaces were defined by XML.
       * - `WRONG_DOCUMENT_ERR`: Raised if doctype has already been used with a different document
       * or was created from a different implementation.
       * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
       * "XML" and the language exposed through the Document does not support XML Namespaces (such
       * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
       * @since DOM Level 2.
       * @see {@link #createHTMLDocument}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument DOM Living Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-2-Core-DOM-createDocument DOM
       *      Level 3 Core
       * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM
       *      Level 2 Core (initial)
       */
      createDocument: function(namespaceURI, qualifiedName, doctype) {
        var contentType = MIME_TYPE.XML_APPLICATION;
        if (namespaceURI === NAMESPACE.HTML) {
          contentType = MIME_TYPE.XML_XHTML_APPLICATION;
        } else if (namespaceURI === NAMESPACE.SVG) {
          contentType = MIME_TYPE.XML_SVG_IMAGE;
        }
        var doc = new Document2(PDC, { contentType });
        doc.implementation = this;
        doc.childNodes = new NodeList();
        doc.doctype = doctype || null;
        if (doctype) {
          doc.appendChild(doctype);
        }
        if (qualifiedName) {
          var root = doc.createElementNS(namespaceURI, qualifiedName);
          doc.appendChild(root);
        }
        return doc;
      },
      /**
       * Creates an empty DocumentType node. Entity declarations and notations are not made
       * available. Entity reference expansions and default attribute additions do not occur.
       *
       * **This behavior is slightly different from the one in the specs**:
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       * - `publicId` and `systemId` contain the raw data including any possible quotes,
       *   so they can always be serialized back to the original value
       * - `internalSubset` contains the raw string between `[` and `]` if present,
       *   but is not parsed or validated in any form.
       *
       * @function DOMImplementation#createDocumentType
       * @param {string} qualifiedName
       * The {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified
       * name} of the document type to be created.
       * @param {string} [publicId]
       * The external subset public identifier.
       * @param {string} [systemId]
       * The external subset system identifier.
       * @param {string} [internalSubset]
       * the internal subset or an empty string if it is not present
       * @returns {DocumentType}
       * A new {@link DocumentType} node with {@link Node#ownerDocument} set to null.
       * @throws {DOMException}
       * With code:
       *
       * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
       * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
       * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed.
       * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
       * "XML" and the language exposed through the Document does not support XML Namespaces (such
       * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
       * @since DOM Level 2.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType
       *      MDN
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living
       *      Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-3-Core-DOM-createDocType DOM
       *      Level 3 Core
       * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM
       *      Level 2 Core
       * @see https://github.com/xmldom/xmldom/blob/master/CHANGELOG.md#050
       * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-Core-DocType-internalSubset
       * @prettierignore
       */
      createDocumentType: function(qualifiedName, publicId, systemId, internalSubset) {
        validateQualifiedName(qualifiedName);
        var node2 = new DocumentType(PDC);
        node2.name = qualifiedName;
        node2.nodeName = qualifiedName;
        node2.publicId = publicId || "";
        node2.systemId = systemId || "";
        node2.internalSubset = internalSubset || "";
        node2.childNodes = new NodeList();
        return node2;
      },
      /**
       * Returns an HTML document, that might already have a basic DOM structure.
       *
       * __It behaves slightly different from the description in the living standard__:
       * - If the first argument is `false` no initial nodes are added (steps 3-7 in the specs are
       * omitted)
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       *
       * @param {string | false} [title]
       * A string containing the title to give the new HTML document.
       * @returns {Document}
       * The HTML document.
       * @since WHATWG Living Standard.
       * @see {@link #createDocument}
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
       * @see https://dom.spec.whatwg.org/#html-document
       */
      createHTMLDocument: function(title) {
        var doc = new Document2(PDC, { contentType: MIME_TYPE.HTML });
        doc.implementation = this;
        doc.childNodes = new NodeList();
        if (title !== false) {
          doc.doctype = this.createDocumentType("html");
          doc.doctype.ownerDocument = doc;
          doc.appendChild(doc.doctype);
          var htmlNode = doc.createElement("html");
          doc.appendChild(htmlNode);
          var headNode = doc.createElement("head");
          htmlNode.appendChild(headNode);
          if (typeof title === "string") {
            var titleNode = doc.createElement("title");
            titleNode.appendChild(doc.createTextNode(title));
            headNode.appendChild(titleNode);
          }
          htmlNode.appendChild(doc.createElement("body"));
        }
        return doc;
      }
    };
    function Node(symbol) {
      checkSymbol(symbol);
    }
    Node.prototype = {
      /**
       * The first child of this node.
       *
       * @type {Node | null}
       */
      firstChild: null,
      /**
       * The last child of this node.
       *
       * @type {Node | null}
       */
      lastChild: null,
      /**
       * The previous sibling of this node.
       *
       * @type {Node | null}
       */
      previousSibling: null,
      /**
       * The next sibling of this node.
       *
       * @type {Node | null}
       */
      nextSibling: null,
      /**
       * The parent node of this node.
       *
       * @type {Node | null}
       */
      parentNode: null,
      /**
       * The parent element of this node.
       *
       * @type {Element | null}
       */
      get parentElement() {
        return this.parentNode && this.parentNode.nodeType === this.ELEMENT_NODE ? this.parentNode : null;
      },
      /**
       * The child nodes of this node.
       *
       * @type {NodeList}
       */
      childNodes: null,
      /**
       * The document object associated with this node.
       *
       * @type {Document | null}
       */
      ownerDocument: null,
      /**
       * The value of this node.
       *
       * @type {string | null}
       */
      nodeValue: null,
      /**
       * The namespace URI of this node.
       *
       * @type {string | null}
       */
      namespaceURI: null,
      /**
       * The prefix of the namespace for this node.
       *
       * @type {string | null}
       */
      prefix: null,
      /**
       * The local part of the qualified name of this node.
       *
       * @type {string | null}
       */
      localName: null,
      /**
       * The baseURI is currently always `about:blank`,
       * since that's what happens when you create a document from scratch.
       *
       * @type {'about:blank'}
       */
      baseURI: "about:blank",
      /**
       * Is true if this node is part of a document.
       *
       * @type {boolean}
       */
      get isConnected() {
        var rootNode = this.getRootNode();
        return rootNode && rootNode.nodeType === rootNode.DOCUMENT_NODE;
      },
      /**
       * Checks whether `other` is an inclusive descendant of this node.
       *
       * @param {Node | null | undefined} other
       * The node to check.
       * @returns {boolean}
       * True if `other` is an inclusive descendant of this node; false otherwise.
       * @see https://dom.spec.whatwg.org/#dom-node-contains
       */
      contains: function(other) {
        if (!other) return false;
        var parent = other;
        do {
          if (this === parent) return true;
          parent = other.parentNode;
        } while (parent);
        return false;
      },
      /**
       * @typedef GetRootNodeOptions
       * @property {boolean} [composed=false]
       */
      /**
       * Searches for the root node of this node.
       *
       * **This behavior is slightly different from the in the specs**:
       * - ignores `options.composed`, since `ShadowRoot`s are unsupported, always returns root.
       *
       * @param {GetRootNodeOptions} [options]
       * @returns {Node}
       * Root node.
       * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
       * @see https://dom.spec.whatwg.org/#concept-shadow-including-root
       */
      getRootNode: function(options) {
        var parent = this;
        do {
          if (!parent.parentNode) {
            return parent;
          }
          parent = parent.parentNode;
        } while (parent);
      },
      /**
       * Checks whether the given node is equal to this node.
       *
       * @param {Node} [otherNode]
       * @see https://dom.spec.whatwg.org/#concept-node-equals
       */
      isEqualNode: function(otherNode) {
        if (!otherNode) return false;
        if (this.nodeType !== otherNode.nodeType) return false;
        switch (this.nodeType) {
          case this.DOCUMENT_TYPE_NODE:
            if (this.name !== otherNode.name) return false;
            if (this.publicId !== otherNode.publicId) return false;
            if (this.systemId !== otherNode.systemId) return false;
            break;
          case this.ELEMENT_NODE:
            if (this.namespaceURI !== otherNode.namespaceURI) return false;
            if (this.prefix !== otherNode.prefix) return false;
            if (this.localName !== otherNode.localName) return false;
            if (this.attributes.length !== otherNode.attributes.length) return false;
            for (var i2 = 0; i2 < this.attributes.length; i2++) {
              var attr = this.attributes.item(i2);
              if (!attr.isEqualNode(otherNode.getAttributeNodeNS(attr.namespaceURI, attr.localName))) {
                return false;
              }
            }
            break;
          case this.ATTRIBUTE_NODE:
            if (this.namespaceURI !== otherNode.namespaceURI) return false;
            if (this.localName !== otherNode.localName) return false;
            if (this.value !== otherNode.value) return false;
            break;
          case this.PROCESSING_INSTRUCTION_NODE:
            if (this.target !== otherNode.target || this.data !== otherNode.data) {
              return false;
            }
            break;
          case this.TEXT_NODE:
          case this.COMMENT_NODE:
            if (this.data !== otherNode.data) return false;
            break;
        }
        if (this.childNodes.length !== otherNode.childNodes.length) {
          return false;
        }
        for (var i2 = 0; i2 < this.childNodes.length; i2++) {
          if (!this.childNodes[i2].isEqualNode(otherNode.childNodes[i2])) {
            return false;
          }
        }
        return true;
      },
      /**
       * Checks whether or not the given node is this node.
       *
       * @param {Node} [otherNode]
       */
      isSameNode: function(otherNode) {
        return this === otherNode;
      },
      /**
       * Inserts a node before a reference node as a child of this node.
       *
       * @param {Node} newChild
       * The new child node to be inserted.
       * @param {Node | null} refChild
       * The reference node before which newChild will be inserted.
       * @returns {Node}
       * The new child node successfully inserted.
       * @throws {DOMException}
       * Throws a DOMException if inserting the node would result in a DOM tree that is not
       * well-formed, or if `child` is provided but is not a child of `parent`.
       * See {@link _insertBefore} for more details.
       * @since Modified in DOM L2
       */
      insertBefore: function(newChild, refChild) {
        return _insertBefore(this, newChild, refChild);
      },
      /**
       * Replaces an old child node with a new child node within this node.
       *
       * @param {Node} newChild
       * The new node that is to replace the old node.
       * If it already exists in the DOM, it is removed from its original position.
       * @param {Node} oldChild
       * The existing child node to be replaced.
       * @returns {Node}
       * Returns the replaced child node.
       * @throws {DOMException}
       * Throws a DOMException if replacing the node would result in a DOM tree that is not
       * well-formed, or if `oldChild` is not a child of `this`.
       * This can also occur if the pre-replacement validity assertion fails.
       * See {@link _insertBefore}, {@link Node.removeChild}, and
       * {@link assertPreReplacementValidityInDocument} for more details.
       * @see https://dom.spec.whatwg.org/#concept-node-replace
       */
      replaceChild: function(newChild, oldChild) {
        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
        if (oldChild) {
          this.removeChild(oldChild);
        }
      },
      /**
       * Removes an existing child node from this node.
       *
       * @param {Node} oldChild
       * The child node to be removed.
       * @returns {Node}
       * Returns the removed child node.
       * @throws {DOMException}
       * Throws a DOMException if `oldChild` is not a child of `this`.
       * See {@link _removeChild} for more details.
       */
      removeChild: function(oldChild) {
        return _removeChild(this, oldChild);
      },
      /**
       * Appends a child node to this node.
       *
       * @param {Node} newChild
       * The child node to be appended to this node.
       * If it already exists in the DOM, it is removed from its original position.
       * @returns {Node}
       * Returns the appended child node.
       * @throws {DOMException}
       * Throws a DOMException if appending the node would result in a DOM tree that is not
       * well-formed, or if `newChild` is not a valid Node.
       * See {@link insertBefore} for more details.
       */
      appendChild: function(newChild) {
        return this.insertBefore(newChild, null);
      },
      /**
       * Determines whether this node has any child nodes.
       *
       * @returns {boolean}
       * Returns true if this node has any child nodes, and false otherwise.
       */
      hasChildNodes: function() {
        return this.firstChild != null;
      },
      /**
       * Creates a copy of the calling node.
       *
       * @param {boolean} deep
       * If true, the contents of the node are recursively copied.
       * If false, only the node itself (and its attributes, if it is an element) are copied.
       * @returns {Node}
       * Returns the newly created copy of the node.
       * @throws {DOMException}
       * May throw a DOMException if operations within {@link Element#setAttributeNode} or
       * {@link Node#appendChild} (which are potentially invoked in this method) do not meet their
       * specific constraints.
       * @see {@link cloneNode}
       */
      cloneNode: function(deep) {
        return cloneNode(this.ownerDocument || this, this, deep);
      },
      /**
       * Puts the specified node and all of its subtree into a "normalized" form. In a normalized
       * subtree, no text nodes in the subtree are empty and there are no adjacent text nodes.
       *
       * Specifically, this method merges any adjacent text nodes (i.e., nodes for which `nodeType`
       * is `TEXT_NODE`) into a single node with the combined data. It also removes any empty text
       * nodes.
       *
       * This method operates recursively, so it also normalizes any and all descendent nodes within
       * the subtree.
       *
       * @throws {DOMException}
       * May throw a DOMException if operations within removeChild or appendData (which are
       * potentially invoked in this method) do not meet their specific constraints.
       * @since Modified in DOM Level 2
       * @see {@link Node.removeChild}
       * @see {@link CharacterData.appendData}
       */
      normalize: function() {
        var child = this.firstChild;
        while (child) {
          var next = child.nextSibling;
          if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
            this.removeChild(next);
            child.appendData(next.data);
          } else {
            child.normalize();
            child = next;
          }
        }
      },
      /**
       * Checks whether the DOM implementation implements a specific feature and its version.
       *
       * @deprecated
       * Since `DOMImplementation.hasFeature` is deprecated and always returns true.
       * @param {string} feature
       * The package name of the feature to test. This is the same name that can be passed to the
       * method `hasFeature` on `DOMImplementation`.
       * @param {string} version
       * This is the version number of the package name to test.
       * @returns {boolean}
       * Returns true in all cases in the current implementation.
       * @since Introduced in DOM Level 2
       * @see {@link DOMImplementation.hasFeature}
       */
      isSupported: function(feature, version) {
        return this.ownerDocument.implementation.hasFeature(feature, version);
      },
      /**
       * Look up the prefix associated to the given namespace URI, starting from this node.
       * **The default namespace declarations are ignored by this method.**
       * See Namespace Prefix Lookup for details on the algorithm used by this method.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} namespaceURI
       * The namespace URI for which to find the associated prefix.
       * @returns {string | null}
       * The associated prefix, if found; otherwise, null.
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
       * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
       * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
       * @see https://github.com/xmldom/xmldom/issues/322
       * @prettierignore
       */
      lookupPrefix: function(namespaceURI) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            for (var n2 in map) {
              if (hasOwn(map, n2) && map[n2] === namespaceURI) {
                return n2;
              }
            }
          }
          el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      /**
       * This function is used to look up the namespace URI associated with the given prefix,
       * starting from this node.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} prefix
       * The prefix for which to find the associated namespace URI.
       * @returns {string | null}
       * The associated namespace URI, if found; otherwise, null.
       * @since DOM Level 3
       * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI
       * @prettierignore
       */
      lookupNamespaceURI: function(prefix) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            if (hasOwn(map, prefix)) {
              return map[prefix];
            }
          }
          el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      /**
       * Determines whether the given namespace URI is the default namespace.
       *
       * The function works by looking up the prefix associated with the given namespace URI. If no
       * prefix is found (i.e., the namespace URI is not registered in the namespace map of this
       * node or any of its ancestors), it returns `true`, implying the namespace URI is considered
       * the default.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} namespaceURI
       * The namespace URI to be checked.
       * @returns {boolean}
       * Returns true if the given namespace URI is the default namespace, false otherwise.
       * @since DOM Level 3
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isDefaultNamespace
       * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
       * @prettierignore
       */
      isDefaultNamespace: function(namespaceURI) {
        var prefix = this.lookupPrefix(namespaceURI);
        return prefix == null;
      },
      /**
       * Compares the reference node with a node with regard to their position in the document and
       * according to the document order.
       *
       * @param {Node} other
       * The node to compare the reference node to.
       * @returns {number}
       * Returns how the node is positioned relatively to the reference node according to the
       * bitmask. 0 if reference node and given node are the same.
       * @since DOM Level 3
       * @see https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-compare
       * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
       */
      compareDocumentPosition: function(other) {
        if (this === other) return 0;
        var node1 = other;
        var node2 = this;
        var attr1 = null;
        var attr2 = null;
        if (node1 instanceof Attr) {
          attr1 = node1;
          node1 = attr1.ownerElement;
        }
        if (node2 instanceof Attr) {
          attr2 = node2;
          node2 = attr2.ownerElement;
          if (attr1 && node1 && node2 === node1) {
            for (var i2 = 0, attr; attr = node2.attributes[i2]; i2++) {
              if (attr === attr1)
                return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
              if (attr === attr2)
                return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
            }
          }
        }
        if (!node1 || !node2 || node2.ownerDocument !== node1.ownerDocument) {
          return DocumentPosition.DOCUMENT_POSITION_DISCONNECTED + DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (docGUID(node2.ownerDocument) > docGUID(node1.ownerDocument) ? DocumentPosition.DOCUMENT_POSITION_FOLLOWING : DocumentPosition.DOCUMENT_POSITION_PRECEDING);
        }
        if (attr2 && node1 === node2) {
          return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }
        if (attr1 && node1 === node2) {
          return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
        }
        var chain1 = [];
        var ancestor1 = node1.parentNode;
        while (ancestor1) {
          if (!attr2 && ancestor1 === node2) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          }
          chain1.push(ancestor1);
          ancestor1 = ancestor1.parentNode;
        }
        chain1.reverse();
        var chain2 = [];
        var ancestor2 = node2.parentNode;
        while (ancestor2) {
          if (!attr1 && ancestor2 === node1) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          }
          chain2.push(ancestor2);
          ancestor2 = ancestor2.parentNode;
        }
        chain2.reverse();
        var ca = commonAncestor(chain1, chain2);
        for (var n2 in ca.childNodes) {
          var child = ca.childNodes[n2];
          if (child === node2) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          if (child === node1) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          if (chain2.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          if (chain1.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }
        return 0;
      }
    };
    function _xmlEncoder(c2) {
      return c2 == "<" && "&lt;" || c2 == ">" && "&gt;" || c2 == "&" && "&amp;" || c2 == '"' && "&quot;" || "&#" + c2.charCodeAt() + ";";
    }
    copy(NodeType, Node);
    copy(NodeType, Node.prototype);
    copy(DocumentPosition, Node);
    copy(DocumentPosition, Node.prototype);
    function _visitNode(node2, callback) {
      if (callback(node2)) {
        return true;
      }
      if (node2 = node2.firstChild) {
        do {
          if (_visitNode(node2, callback)) {
            return true;
          }
        } while (node2 = node2.nextSibling);
      }
    }
    function Document2(symbol, options) {
      checkSymbol(symbol);
      var opt = options || {};
      this.ownerDocument = this;
      this.contentType = opt.contentType || MIME_TYPE.XML_APPLICATION;
      this.type = isHTMLMimeType(this.contentType) ? "html" : "xml";
    }
    function _onAddAttribute(doc, el, newAttr) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns === NAMESPACE.XMLNS) {
        el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
      }
    }
    function _onRemoveAttribute(doc, el, newAttr, remove) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns === NAMESPACE.XMLNS) {
        delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
      }
    }
    function _onUpdateChild(doc, parent, newChild) {
      if (doc && doc._inc) {
        doc._inc++;
        var childNodes = parent.childNodes;
        if (newChild && !newChild.nextSibling) {
          childNodes[childNodes.length++] = newChild;
        } else {
          var child = parent.firstChild;
          var i2 = 0;
          while (child) {
            childNodes[i2++] = child;
            child = child.nextSibling;
          }
          childNodes.length = i2;
          delete childNodes[childNodes.length];
        }
      }
    }
    function _removeChild(parentNode, child) {
      if (parentNode !== child.parentNode) {
        throw new DOMException(DOMException.NOT_FOUND_ERR, "child's parent is not parent");
      }
      var oldPreviousSibling = child.previousSibling;
      var oldNextSibling = child.nextSibling;
      if (oldPreviousSibling) {
        oldPreviousSibling.nextSibling = oldNextSibling;
      } else {
        parentNode.firstChild = oldNextSibling;
      }
      if (oldNextSibling) {
        oldNextSibling.previousSibling = oldPreviousSibling;
      } else {
        parentNode.lastChild = oldPreviousSibling;
      }
      _onUpdateChild(parentNode.ownerDocument, parentNode);
      child.parentNode = null;
      child.previousSibling = null;
      child.nextSibling = null;
      return child;
    }
    function hasValidParentNodeType(node2) {
      return node2 && (node2.nodeType === Node.DOCUMENT_NODE || node2.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node2.nodeType === Node.ELEMENT_NODE);
    }
    function hasInsertableNodeType(node2) {
      return node2 && (node2.nodeType === Node.CDATA_SECTION_NODE || node2.nodeType === Node.COMMENT_NODE || node2.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node2.nodeType === Node.DOCUMENT_TYPE_NODE || node2.nodeType === Node.ELEMENT_NODE || node2.nodeType === Node.PROCESSING_INSTRUCTION_NODE || node2.nodeType === Node.TEXT_NODE);
    }
    function isDocTypeNode(node2) {
      return node2 && node2.nodeType === Node.DOCUMENT_TYPE_NODE;
    }
    function isElementNode(node2) {
      return node2 && node2.nodeType === Node.ELEMENT_NODE;
    }
    function isTextNode(node2) {
      return node2 && node2.nodeType === Node.TEXT_NODE;
    }
    function isElementInsertionPossible(doc, child) {
      var parentChildNodes = doc.childNodes || [];
      if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
        return false;
      }
      var docTypeNode = find(parentChildNodes, isDocTypeNode);
      return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }
    function isElementReplacementPossible(doc, child) {
      var parentChildNodes = doc.childNodes || [];
      function hasElementChildThatIsNotChild(node2) {
        return isElementNode(node2) && node2 !== child;
      }
      if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
        return false;
      }
      var docTypeNode = find(parentChildNodes, isDocTypeNode);
      return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }
    function assertPreInsertionValidity1to5(parent, node2, child) {
      if (!hasValidParentNodeType(parent)) {
        throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent.nodeType);
      }
      if (child && child.parentNode !== parent) {
        throw new DOMException(DOMException.NOT_FOUND_ERR, "child not in parent");
      }
      if (
        // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
        !hasInsertableNodeType(node2) || // 5. If either `node` is a Text node and `parent` is a document,
        // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
        // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
        // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
        isDocTypeNode(node2) && parent.nodeType !== Node.DOCUMENT_NODE
      ) {
        throw new DOMException(
          DOMException.HIERARCHY_REQUEST_ERR,
          "Unexpected node type " + node2.nodeType + " for parent node type " + parent.nodeType
        );
      }
    }
    function assertPreInsertionValidityInDocument(parent, node2, child) {
      var parentChildNodes = parent.childNodes || [];
      var nodeChildNodes = node2.childNodes || [];
      if (node2.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildElements = nodeChildNodes.filter(isElementNode);
        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
        }
        if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
        }
      }
      if (isElementNode(node2)) {
        if (!isElementInsertionPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
        }
      }
      if (isDocTypeNode(node2)) {
        if (find(parentChildNodes, isDocTypeNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
        }
        var parentElementChild = find(parentChildNodes, isElementNode);
        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
        }
        if (!child && parentElementChild) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
        }
      }
    }
    function assertPreReplacementValidityInDocument(parent, node2, child) {
      var parentChildNodes = parent.childNodes || [];
      var nodeChildNodes = node2.childNodes || [];
      if (node2.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildElements = nodeChildNodes.filter(isElementNode);
        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
        }
        if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
        }
      }
      if (isElementNode(node2)) {
        if (!isElementReplacementPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
        }
      }
      if (isDocTypeNode(node2)) {
        let hasDoctypeChildThatIsNotChild = function(node3) {
          return isDocTypeNode(node3) && node3 !== child;
        };
        if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
        }
        var parentElementChild = find(parentChildNodes, isElementNode);
        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
        }
      }
    }
    function _insertBefore(parent, node2, child, _inDocumentAssertion) {
      assertPreInsertionValidity1to5(parent, node2, child);
      if (parent.nodeType === Node.DOCUMENT_NODE) {
        (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node2, child);
      }
      var cp = node2.parentNode;
      if (cp) {
        cp.removeChild(node2);
      }
      if (node2.nodeType === DOCUMENT_FRAGMENT_NODE) {
        var newFirst = node2.firstChild;
        if (newFirst == null) {
          return node2;
        }
        var newLast = node2.lastChild;
      } else {
        newFirst = newLast = node2;
      }
      var pre = child ? child.previousSibling : parent.lastChild;
      newFirst.previousSibling = pre;
      newLast.nextSibling = child;
      if (pre) {
        pre.nextSibling = newFirst;
      } else {
        parent.firstChild = newFirst;
      }
      if (child == null) {
        parent.lastChild = newLast;
      } else {
        child.previousSibling = newLast;
      }
      do {
        newFirst.parentNode = parent;
      } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
      _onUpdateChild(parent.ownerDocument || parent, parent, node2);
      if (node2.nodeType == DOCUMENT_FRAGMENT_NODE) {
        node2.firstChild = node2.lastChild = null;
      }
      return node2;
    }
    Document2.prototype = {
      /**
       * The implementation that created this document.
       *
       * @type DOMImplementation
       * @readonly
       */
      implementation: null,
      nodeName: "#document",
      nodeType: DOCUMENT_NODE,
      /**
       * The DocumentType node of the document.
       *
       * @type DocumentType
       * @readonly
       */
      doctype: null,
      documentElement: null,
      _inc: 1,
      insertBefore: function(newChild, refChild) {
        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var child = newChild.firstChild;
          while (child) {
            var next = child.nextSibling;
            this.insertBefore(child, refChild);
            child = next;
          }
          return newChild;
        }
        _insertBefore(this, newChild, refChild);
        newChild.ownerDocument = this;
        if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
          this.documentElement = newChild;
        }
        return newChild;
      },
      removeChild: function(oldChild) {
        var removed = _removeChild(this, oldChild);
        if (removed === this.documentElement) {
          this.documentElement = null;
        }
        return removed;
      },
      replaceChild: function(newChild, oldChild) {
        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
        newChild.ownerDocument = this;
        if (oldChild) {
          this.removeChild(oldChild);
        }
        if (isElementNode(newChild)) {
          this.documentElement = newChild;
        }
      },
      // Introduced in DOM Level 2:
      importNode: function(importedNode, deep) {
        return importNode(this, importedNode, deep);
      },
      // Introduced in DOM Level 2:
      getElementById: function(id) {
        var rtv = null;
        _visitNode(this.documentElement, function(node2) {
          if (node2.nodeType == ELEMENT_NODE) {
            if (node2.getAttribute("id") == id) {
              rtv = node2;
              return true;
            }
          }
        });
        return rtv;
      },
      /**
       * Creates a new `Element` that is owned by this `Document`.
       * In HTML Documents `localName` is the lower cased `tagName`,
       * otherwise no transformation is being applied.
       * When `contentType` implies the HTML namespace, it will be set as `namespaceURI`.
       *
       * __This implementation differs from the specification:__ - The provided name is not checked
       * against the `Name` production,
       * so no related error will be thrown.
       * - There is no interface `HTMLElement`, it is always an `Element`.
       * - There is no support for a second argument to indicate using custom elements.
       *
       * @param {string} tagName
       * @returns {Element}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
       * @see https://dom.spec.whatwg.org/#dom-document-createelement
       * @see https://dom.spec.whatwg.org/#concept-create-element
       */
      createElement: function(tagName) {
        var node2 = new Element2(PDC);
        node2.ownerDocument = this;
        if (this.type === "html") {
          tagName = tagName.toLowerCase();
        }
        if (hasDefaultHTMLNamespace(this.contentType)) {
          node2.namespaceURI = NAMESPACE.HTML;
        }
        node2.nodeName = tagName;
        node2.tagName = tagName;
        node2.localName = tagName;
        node2.childNodes = new NodeList();
        var attrs = node2.attributes = new NamedNodeMap();
        attrs._ownerElement = node2;
        return node2;
      },
      /**
       * @returns {DocumentFragment}
       */
      createDocumentFragment: function() {
        var node2 = new DocumentFragment(PDC);
        node2.ownerDocument = this;
        node2.childNodes = new NodeList();
        return node2;
      },
      /**
       * @param {string} data
       * @returns {Text}
       */
      createTextNode: function(data) {
        var node2 = new Text(PDC);
        node2.ownerDocument = this;
        node2.childNodes = new NodeList();
        node2.appendData(data);
        return node2;
      },
      /**
       * @param {string} data
       * @returns {Comment}
       */
      createComment: function(data) {
        var node2 = new Comment(PDC);
        node2.ownerDocument = this;
        node2.childNodes = new NodeList();
        node2.appendData(data);
        return node2;
      },
      /**
       * @param {string} data
       * @returns {CDATASection}
       */
      createCDATASection: function(data) {
        var node2 = new CDATASection(PDC);
        node2.ownerDocument = this;
        node2.childNodes = new NodeList();
        node2.appendData(data);
        return node2;
      },
      /**
       * @param {string} target
       * @param {string} data
       * @returns {ProcessingInstruction}
       */
      createProcessingInstruction: function(target, data) {
        var node2 = new ProcessingInstruction(PDC);
        node2.ownerDocument = this;
        node2.childNodes = new NodeList();
        node2.nodeName = node2.target = target;
        node2.nodeValue = node2.data = data;
        return node2;
      },
      /**
       * Creates an `Attr` node that is owned by this document.
       * In HTML Documents `localName` is the lower cased `name`,
       * otherwise no transformation is being applied.
       *
       * __This implementation differs from the specification:__ - The provided name is not checked
       * against the `Name` production,
       * so no related error will be thrown.
       *
       * @param {string} name
       * @returns {Attr}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttribute
       * @see https://dom.spec.whatwg.org/#dom-document-createattribute
       */
      createAttribute: function(name) {
        if (!g.QName_exact.test(name)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in name "' + name + '"');
        }
        if (this.type === "html") {
          name = name.toLowerCase();
        }
        return this._createAttribute(name);
      },
      _createAttribute: function(name) {
        var node2 = new Attr(PDC);
        node2.ownerDocument = this;
        node2.childNodes = new NodeList();
        node2.name = name;
        node2.nodeName = name;
        node2.localName = name;
        node2.specified = true;
        return node2;
      },
      /**
       * Creates an EntityReference object.
       * The current implementation does not fill the `childNodes` with those of the corresponding
       * `Entity`
       *
       * @deprecated
       * In DOM Level 4.
       * @param {string} name
       * The name of the entity to reference. No namespace well-formedness checks are performed.
       * @returns {EntityReference}
       * @throws {DOMException}
       * With code `INVALID_CHARACTER_ERR` when `name` is not valid.
       * @throws {DOMException}
       * with code `NOT_SUPPORTED_ERR` when the document is of type `html`
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-392B75AE
       */
      createEntityReference: function(name) {
        if (!g.Name.test(name)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'not a valid xml name "' + name + '"');
        }
        if (this.type === "html") {
          throw new DOMException("document is an html document", DOMExceptionName.NotSupportedError);
        }
        var node2 = new EntityReference(PDC);
        node2.ownerDocument = this;
        node2.childNodes = new NodeList();
        node2.nodeName = name;
        return node2;
      },
      // Introduced in DOM Level 2:
      /**
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @returns {Element}
       */
      createElementNS: function(namespaceURI, qualifiedName) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var node2 = new Element2(PDC);
        var attrs = node2.attributes = new NamedNodeMap();
        node2.childNodes = new NodeList();
        node2.ownerDocument = this;
        node2.nodeName = qualifiedName;
        node2.tagName = qualifiedName;
        node2.namespaceURI = validated[0];
        node2.prefix = validated[1];
        node2.localName = validated[2];
        attrs._ownerElement = node2;
        return node2;
      },
      // Introduced in DOM Level 2:
      /**
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @returns {Attr}
       */
      createAttributeNS: function(namespaceURI, qualifiedName) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var node2 = new Attr(PDC);
        node2.ownerDocument = this;
        node2.childNodes = new NodeList();
        node2.nodeName = qualifiedName;
        node2.name = qualifiedName;
        node2.specified = true;
        node2.namespaceURI = validated[0];
        node2.prefix = validated[1];
        node2.localName = validated[2];
        return node2;
      }
    };
    _extends(Document2, Node);
    function Element2(symbol) {
      checkSymbol(symbol);
      this._nsMap = /* @__PURE__ */ Object.create(null);
    }
    Element2.prototype = {
      nodeType: ELEMENT_NODE,
      /**
       * The attributes of this element.
       *
       * @type {NamedNodeMap | null}
       */
      attributes: null,
      getQualifiedName: function() {
        return this.prefix ? this.prefix + ":" + this.localName : this.localName;
      },
      _isInHTMLDocumentAndNamespace: function() {
        return this.ownerDocument.type === "html" && this.namespaceURI === NAMESPACE.HTML;
      },
      /**
       * Implementaton of Level2 Core function hasAttributes.
       *
       * @returns {boolean}
       * True if attribute list is not empty.
       * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-NodeHasAttrs
       */
      hasAttributes: function() {
        return !!(this.attributes && this.attributes.length);
      },
      hasAttribute: function(name) {
        return !!this.getAttributeNode(name);
      },
      /**
       * Returns element’s first attribute whose qualified name is `name`, and `null`
       * if there is no such attribute.
       *
       * @param {string} name
       * @returns {string | null}
       */
      getAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        return attr ? attr.value : null;
      },
      getAttributeNode: function(name) {
        if (this._isInHTMLDocumentAndNamespace()) {
          name = name.toLowerCase();
        }
        return this.attributes.getNamedItem(name);
      },
      /**
       * Sets the value of element’s first attribute whose qualified name is qualifiedName to value.
       *
       * @param {string} name
       * @param {string} value
       */
      setAttribute: function(name, value) {
        if (this._isInHTMLDocumentAndNamespace()) {
          name = name.toLowerCase();
        }
        var attr = this.getAttributeNode(name);
        if (attr) {
          attr.value = attr.nodeValue = "" + value;
        } else {
          attr = this.ownerDocument._createAttribute(name);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        }
      },
      removeAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        attr && this.removeAttributeNode(attr);
      },
      setAttributeNode: function(newAttr) {
        return this.attributes.setNamedItem(newAttr);
      },
      setAttributeNodeNS: function(newAttr) {
        return this.attributes.setNamedItemNS(newAttr);
      },
      removeAttributeNode: function(oldAttr) {
        return this.attributes.removeNamedItem(oldAttr.nodeName);
      },
      //get real attribute name,and remove it by removeAttributeNode
      removeAttributeNS: function(namespaceURI, localName) {
        var old = this.getAttributeNodeNS(namespaceURI, localName);
        old && this.removeAttributeNode(old);
      },
      hasAttributeNS: function(namespaceURI, localName) {
        return this.getAttributeNodeNS(namespaceURI, localName) != null;
      },
      /**
       * Returns element’s attribute whose namespace is `namespaceURI` and local name is
       * `localName`,
       * or `null` if there is no such attribute.
       *
       * @param {string} namespaceURI
       * @param {string} localName
       * @returns {string | null}
       */
      getAttributeNS: function(namespaceURI, localName) {
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        return attr ? attr.value : null;
      },
      /**
       * Sets the value of element’s attribute whose namespace is `namespaceURI` and local name is
       * `localName` to value.
       *
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @param {string} value
       * @see https://dom.spec.whatwg.org/#dom-element-setattributens
       */
      setAttributeNS: function(namespaceURI, qualifiedName, value) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var localName = validated[2];
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        if (attr) {
          attr.value = attr.nodeValue = "" + value;
        } else {
          attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        }
      },
      getAttributeNodeNS: function(namespaceURI, localName) {
        return this.attributes.getNamedItemNS(namespaceURI, localName);
      },
      /**
       * Returns a LiveNodeList of all child elements which have **all** of the given class name(s).
       *
       * Returns an empty list if `classNames` is an empty string or only contains HTML white space
       * characters.
       *
       * Warning: This returns a live LiveNodeList.
       * Changes in the DOM will reflect in the array as the changes occur.
       * If an element selected by this array no longer qualifies for the selector,
       * it will automatically be removed. Be aware of this for iteration purposes.
       *
       * @param {string} classNames
       * Is a string representing the class name(s) to match; multiple class names are separated by
       * (ASCII-)whitespace.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
       * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
       */
      getElementsByClassName: function(classNames) {
        var classNamesSet = toOrderedSet(classNames);
        return new LiveNodeList(this, function(base) {
          var ls = [];
          if (classNamesSet.length > 0) {
            _visitNode(base, function(node2) {
              if (node2 !== base && node2.nodeType === ELEMENT_NODE) {
                var nodeClassNames = node2.getAttribute("class");
                if (nodeClassNames) {
                  var matches = classNames === nodeClassNames;
                  if (!matches) {
                    var nodeClassNamesSet = toOrderedSet(nodeClassNames);
                    matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
                  }
                  if (matches) {
                    ls.push(node2);
                  }
                }
              }
            });
          }
          return ls;
        });
      },
      /**
       * Returns a LiveNodeList of elements with the given qualifiedName.
       * Searching for all descendants can be done by passing `*` as `qualifiedName`.
       *
       * All descendants of the specified element are searched, but not the element itself.
       * The returned list is live, which means it updates itself with the DOM tree automatically.
       * Therefore, there is no need to call `Element.getElementsByTagName()`
       * with the same element and arguments repeatedly if the DOM changes in between calls.
       *
       * When called on an HTML element in an HTML document,
       * `getElementsByTagName` lower-cases the argument before searching for it.
       * This is undesirable when trying to match camel-cased SVG elements (such as
       * `<linearGradient>`) in an HTML document.
       * Instead, use `Element.getElementsByTagNameNS()`,
       * which preserves the capitalization of the tag name.
       *
       * `Element.getElementsByTagName` is similar to `Document.getElementsByTagName()`,
       * except that it only searches for elements that are descendants of the specified element.
       *
       * @param {string} qualifiedName
       * @returns {LiveNodeList}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
       * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
       */
      getElementsByTagName: function(qualifiedName) {
        var isHTMLDocument = (this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument).type === "html";
        var lowerQualifiedName = qualifiedName.toLowerCase();
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node2) {
            if (node2 === base || node2.nodeType !== ELEMENT_NODE) {
              return;
            }
            if (qualifiedName === "*") {
              ls.push(node2);
            } else {
              var nodeQualifiedName = node2.getQualifiedName();
              var matchingQName = isHTMLDocument && node2.namespaceURI === NAMESPACE.HTML ? lowerQualifiedName : qualifiedName;
              if (nodeQualifiedName === matchingQName) {
                ls.push(node2);
              }
            }
          });
          return ls;
        });
      },
      getElementsByTagNameNS: function(namespaceURI, localName) {
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node2) {
            if (node2 !== base && node2.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node2.namespaceURI === namespaceURI) && (localName === "*" || node2.localName == localName)) {
              ls.push(node2);
            }
          });
          return ls;
        });
      }
    };
    Document2.prototype.getElementsByClassName = Element2.prototype.getElementsByClassName;
    Document2.prototype.getElementsByTagName = Element2.prototype.getElementsByTagName;
    Document2.prototype.getElementsByTagNameNS = Element2.prototype.getElementsByTagNameNS;
    _extends(Element2, Node);
    function Attr(symbol) {
      checkSymbol(symbol);
      this.namespaceURI = null;
      this.prefix = null;
      this.ownerElement = null;
    }
    Attr.prototype.nodeType = ATTRIBUTE_NODE;
    _extends(Attr, Node);
    function CharacterData(symbol) {
      checkSymbol(symbol);
    }
    CharacterData.prototype = {
      data: "",
      substringData: function(offset, count) {
        return this.data.substring(offset, offset + count);
      },
      appendData: function(text) {
        text = this.data + text;
        this.nodeValue = this.data = text;
        this.length = text.length;
      },
      insertData: function(offset, text) {
        this.replaceData(offset, 0, text);
      },
      deleteData: function(offset, count) {
        this.replaceData(offset, count, "");
      },
      replaceData: function(offset, count, text) {
        var start = this.data.substring(0, offset);
        var end = this.data.substring(offset + count);
        text = start + text + end;
        this.nodeValue = this.data = text;
        this.length = text.length;
      }
    };
    _extends(CharacterData, Node);
    function Text(symbol) {
      checkSymbol(symbol);
    }
    Text.prototype = {
      nodeName: "#text",
      nodeType: TEXT_NODE,
      splitText: function(offset) {
        var text = this.data;
        var newText = text.substring(offset);
        text = text.substring(0, offset);
        this.data = this.nodeValue = text;
        this.length = text.length;
        var newNode = this.ownerDocument.createTextNode(newText);
        if (this.parentNode) {
          this.parentNode.insertBefore(newNode, this.nextSibling);
        }
        return newNode;
      }
    };
    _extends(Text, CharacterData);
    function Comment(symbol) {
      checkSymbol(symbol);
    }
    Comment.prototype = {
      nodeName: "#comment",
      nodeType: COMMENT_NODE
    };
    _extends(Comment, CharacterData);
    function CDATASection(symbol) {
      checkSymbol(symbol);
    }
    CDATASection.prototype = {
      nodeName: "#cdata-section",
      nodeType: CDATA_SECTION_NODE
    };
    _extends(CDATASection, Text);
    function DocumentType(symbol) {
      checkSymbol(symbol);
    }
    DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
    _extends(DocumentType, Node);
    function Notation(symbol) {
      checkSymbol(symbol);
    }
    Notation.prototype.nodeType = NOTATION_NODE;
    _extends(Notation, Node);
    function Entity(symbol) {
      checkSymbol(symbol);
    }
    Entity.prototype.nodeType = ENTITY_NODE;
    _extends(Entity, Node);
    function EntityReference(symbol) {
      checkSymbol(symbol);
    }
    EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
    _extends(EntityReference, Node);
    function DocumentFragment(symbol) {
      checkSymbol(symbol);
    }
    DocumentFragment.prototype.nodeName = "#document-fragment";
    DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
    _extends(DocumentFragment, Node);
    function ProcessingInstruction(symbol) {
      checkSymbol(symbol);
    }
    ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
    _extends(ProcessingInstruction, CharacterData);
    function XMLSerializer() {
    }
    XMLSerializer.prototype.serializeToString = function(node2, nodeFilter) {
      return nodeSerializeToString.call(node2, nodeFilter);
    };
    Node.prototype.toString = nodeSerializeToString;
    function nodeSerializeToString(nodeFilter) {
      var buf = [];
      var refNode = this.nodeType === DOCUMENT_NODE && this.documentElement || this;
      var prefix = refNode.prefix;
      var uri = refNode.namespaceURI;
      if (uri && prefix == null) {
        var prefix = refNode.lookupPrefix(uri);
        if (prefix == null) {
          var visibleNamespaces = [
            { namespace: uri, prefix: null }
            //{namespace:uri,prefix:''}
          ];
        }
      }
      serializeToString(this, buf, nodeFilter, visibleNamespaces);
      return buf.join("");
    }
    function needNamespaceDefine(node2, isHTML, visibleNamespaces) {
      var prefix = node2.prefix || "";
      var uri = node2.namespaceURI;
      if (!uri) {
        return false;
      }
      if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
        return false;
      }
      var i2 = visibleNamespaces.length;
      while (i2--) {
        var ns = visibleNamespaces[i2];
        if (ns.prefix === prefix) {
          return ns.namespace !== uri;
        }
      }
      return true;
    }
    function addSerializedAttribute(buf, qualifiedName, value) {
      buf.push(" ", qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
    }
    function serializeToString(node2, buf, nodeFilter, visibleNamespaces) {
      if (!visibleNamespaces) {
        visibleNamespaces = [];
      }
      var doc = node2.nodeType === DOCUMENT_NODE ? node2 : node2.ownerDocument;
      var isHTML = doc.type === "html";
      if (nodeFilter) {
        node2 = nodeFilter(node2);
        if (node2) {
          if (typeof node2 == "string") {
            buf.push(node2);
            return;
          }
        } else {
          return;
        }
      }
      switch (node2.nodeType) {
        case ELEMENT_NODE:
          var attrs = node2.attributes;
          var len = attrs.length;
          var child = node2.firstChild;
          var nodeName = node2.tagName;
          var prefixedNodeName = nodeName;
          if (!isHTML && !node2.prefix && node2.namespaceURI) {
            var defaultNS;
            for (var ai = 0; ai < attrs.length; ai++) {
              if (attrs.item(ai).name === "xmlns") {
                defaultNS = attrs.item(ai).value;
                break;
              }
            }
            if (!defaultNS) {
              for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                var namespace = visibleNamespaces[nsi];
                if (namespace.prefix === "" && namespace.namespace === node2.namespaceURI) {
                  defaultNS = namespace.namespace;
                  break;
                }
              }
            }
            if (defaultNS !== node2.namespaceURI) {
              for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                var namespace = visibleNamespaces[nsi];
                if (namespace.namespace === node2.namespaceURI) {
                  if (namespace.prefix) {
                    prefixedNodeName = namespace.prefix + ":" + nodeName;
                  }
                  break;
                }
              }
            }
          }
          buf.push("<", prefixedNodeName);
          for (var i2 = 0; i2 < len; i2++) {
            var attr = attrs.item(i2);
            if (attr.prefix == "xmlns") {
              visibleNamespaces.push({
                prefix: attr.localName,
                namespace: attr.value
              });
            } else if (attr.nodeName == "xmlns") {
              visibleNamespaces.push({ prefix: "", namespace: attr.value });
            }
          }
          for (var i2 = 0; i2 < len; i2++) {
            var attr = attrs.item(i2);
            if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
              var prefix = attr.prefix || "";
              var uri = attr.namespaceURI;
              addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
              visibleNamespaces.push({ prefix, namespace: uri });
            }
            serializeToString(attr, buf, nodeFilter, visibleNamespaces);
          }
          if (nodeName === prefixedNodeName && needNamespaceDefine(node2, isHTML, visibleNamespaces)) {
            var prefix = node2.prefix || "";
            var uri = node2.namespaceURI;
            addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
            visibleNamespaces.push({ prefix, namespace: uri });
          }
          var canCloseTag = !child;
          if (canCloseTag && (isHTML || node2.namespaceURI === NAMESPACE.HTML)) {
            canCloseTag = isHTMLVoidElement(nodeName);
          }
          if (canCloseTag) {
            buf.push("/>");
          } else {
            buf.push(">");
            if (isHTML && isHTMLRawTextElement(nodeName)) {
              while (child) {
                if (child.data) {
                  buf.push(child.data);
                } else {
                  serializeToString(child, buf, nodeFilter, visibleNamespaces.slice());
                }
                child = child.nextSibling;
              }
            } else {
              while (child) {
                serializeToString(child, buf, nodeFilter, visibleNamespaces.slice());
                child = child.nextSibling;
              }
            }
            buf.push("</", prefixedNodeName, ">");
          }
          return;
        case DOCUMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE:
          var child = node2.firstChild;
          while (child) {
            serializeToString(child, buf, nodeFilter, visibleNamespaces.slice());
            child = child.nextSibling;
          }
          return;
        case ATTRIBUTE_NODE:
          return addSerializedAttribute(buf, node2.name, node2.value);
        case TEXT_NODE:
          return buf.push(node2.data.replace(/[<&>]/g, _xmlEncoder));
        case CDATA_SECTION_NODE:
          return buf.push(g.CDATA_START, node2.data, g.CDATA_END);
        case COMMENT_NODE:
          return buf.push(g.COMMENT_START, node2.data, g.COMMENT_END);
        case DOCUMENT_TYPE_NODE:
          var pubid = node2.publicId;
          var sysid = node2.systemId;
          buf.push(g.DOCTYPE_DECL_START, " ", node2.name);
          if (pubid) {
            buf.push(" ", g.PUBLIC, " ", pubid);
            if (sysid && sysid !== ".") {
              buf.push(" ", sysid);
            }
          } else if (sysid && sysid !== ".") {
            buf.push(" ", g.SYSTEM, " ", sysid);
          }
          if (node2.internalSubset) {
            buf.push(" [", node2.internalSubset, "]");
          }
          buf.push(">");
          return;
        case PROCESSING_INSTRUCTION_NODE:
          return buf.push("<?", node2.target, " ", node2.data, "?>");
        case ENTITY_REFERENCE_NODE:
          return buf.push("&", node2.nodeName, ";");
        //case ENTITY_NODE:
        //case NOTATION_NODE:
        default:
          buf.push("??", node2.nodeName);
      }
    }
    function importNode(doc, node2, deep) {
      var node22;
      switch (node2.nodeType) {
        case ELEMENT_NODE:
          node22 = node2.cloneNode(false);
          node22.ownerDocument = doc;
        //var attrs = node2.attributes;
        //var len = attrs.length;
        //for(var i=0;i<len;i++){
        //node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
        //}
        case DOCUMENT_FRAGMENT_NODE:
          break;
        case ATTRIBUTE_NODE:
          deep = true;
          break;
      }
      if (!node22) {
        node22 = node2.cloneNode(false);
      }
      node22.ownerDocument = doc;
      node22.parentNode = null;
      if (deep) {
        var child = node2.firstChild;
        while (child) {
          node22.appendChild(importNode(doc, child, deep));
          child = child.nextSibling;
        }
      }
      return node22;
    }
    function cloneNode(doc, node2, deep) {
      var node22 = new node2.constructor(PDC);
      for (var n2 in node2) {
        if (hasOwn(node2, n2)) {
          var v2 = node2[n2];
          if (typeof v2 != "object") {
            if (v2 != node22[n2]) {
              node22[n2] = v2;
            }
          }
        }
      }
      if (node2.childNodes) {
        node22.childNodes = new NodeList();
      }
      node22.ownerDocument = doc;
      switch (node22.nodeType) {
        case ELEMENT_NODE:
          var attrs = node2.attributes;
          var attrs2 = node22.attributes = new NamedNodeMap();
          var len = attrs.length;
          attrs2._ownerElement = node22;
          for (var i2 = 0; i2 < len; i2++) {
            node22.setAttributeNode(cloneNode(doc, attrs.item(i2), true));
          }
          break;
        case ATTRIBUTE_NODE:
          deep = true;
      }
      if (deep) {
        var child = node2.firstChild;
        while (child) {
          node22.appendChild(cloneNode(doc, child, deep));
          child = child.nextSibling;
        }
      }
      return node22;
    }
    function __set__(object, key, value) {
      object[key] = value;
    }
    try {
      if (Object.defineProperty) {
        let getTextContent = function(node2) {
          switch (node2.nodeType) {
            case ELEMENT_NODE:
            case DOCUMENT_FRAGMENT_NODE:
              var buf = [];
              node2 = node2.firstChild;
              while (node2) {
                if (node2.nodeType !== 7 && node2.nodeType !== 8) {
                  buf.push(getTextContent(node2));
                }
                node2 = node2.nextSibling;
              }
              return buf.join("");
            default:
              return node2.nodeValue;
          }
        };
        Object.defineProperty(LiveNodeList.prototype, "length", {
          get: function() {
            _updateLiveList(this);
            return this.$$length;
          }
        });
        Object.defineProperty(Node.prototype, "textContent", {
          get: function() {
            return getTextContent(this);
          },
          set: function(data) {
            switch (this.nodeType) {
              case ELEMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                while (this.firstChild) {
                  this.removeChild(this.firstChild);
                }
                if (data || String(data)) {
                  this.appendChild(this.ownerDocument.createTextNode(data));
                }
                break;
              default:
                this.data = data;
                this.value = data;
                this.nodeValue = data;
            }
          }
        });
        __set__ = function(object, key, value) {
          object["$$" + key] = value;
        };
      }
    } catch (e2) {
    }
    dom._updateLiveList = _updateLiveList;
    dom.Attr = Attr;
    dom.CDATASection = CDATASection;
    dom.CharacterData = CharacterData;
    dom.Comment = Comment;
    dom.Document = Document2;
    dom.DocumentFragment = DocumentFragment;
    dom.DocumentType = DocumentType;
    dom.DOMImplementation = DOMImplementation;
    dom.Element = Element2;
    dom.Entity = Entity;
    dom.EntityReference = EntityReference;
    dom.LiveNodeList = LiveNodeList;
    dom.NamedNodeMap = NamedNodeMap;
    dom.Node = Node;
    dom.NodeList = NodeList;
    dom.Notation = Notation;
    dom.Text = Text;
    dom.ProcessingInstruction = ProcessingInstruction;
    dom.XMLSerializer = XMLSerializer;
    return dom;
  }
  var domParser = {};
  var entities = {};
  var hasRequiredEntities;
  function requireEntities() {
    if (hasRequiredEntities) return entities;
    hasRequiredEntities = 1;
    (function(exports) {
      var freeze = requireConventions().freeze;
      exports.XML_ENTITIES = freeze({
        amp: "&",
        apos: "'",
        gt: ">",
        lt: "<",
        quot: '"'
      });
      exports.HTML_ENTITIES = freeze({
        Aacute: "Á",
        aacute: "á",
        Abreve: "Ă",
        abreve: "ă",
        ac: "∾",
        acd: "∿",
        acE: "∾̳",
        Acirc: "Â",
        acirc: "â",
        acute: "´",
        Acy: "А",
        acy: "а",
        AElig: "Æ",
        aelig: "æ",
        af: "⁡",
        Afr: "𝔄",
        afr: "𝔞",
        Agrave: "À",
        agrave: "à",
        alefsym: "ℵ",
        aleph: "ℵ",
        Alpha: "Α",
        alpha: "α",
        Amacr: "Ā",
        amacr: "ā",
        amalg: "⨿",
        AMP: "&",
        amp: "&",
        And: "⩓",
        and: "∧",
        andand: "⩕",
        andd: "⩜",
        andslope: "⩘",
        andv: "⩚",
        ang: "∠",
        ange: "⦤",
        angle: "∠",
        angmsd: "∡",
        angmsdaa: "⦨",
        angmsdab: "⦩",
        angmsdac: "⦪",
        angmsdad: "⦫",
        angmsdae: "⦬",
        angmsdaf: "⦭",
        angmsdag: "⦮",
        angmsdah: "⦯",
        angrt: "∟",
        angrtvb: "⊾",
        angrtvbd: "⦝",
        angsph: "∢",
        angst: "Å",
        angzarr: "⍼",
        Aogon: "Ą",
        aogon: "ą",
        Aopf: "𝔸",
        aopf: "𝕒",
        ap: "≈",
        apacir: "⩯",
        apE: "⩰",
        ape: "≊",
        apid: "≋",
        apos: "'",
        ApplyFunction: "⁡",
        approx: "≈",
        approxeq: "≊",
        Aring: "Å",
        aring: "å",
        Ascr: "𝒜",
        ascr: "𝒶",
        Assign: "≔",
        ast: "*",
        asymp: "≈",
        asympeq: "≍",
        Atilde: "Ã",
        atilde: "ã",
        Auml: "Ä",
        auml: "ä",
        awconint: "∳",
        awint: "⨑",
        backcong: "≌",
        backepsilon: "϶",
        backprime: "‵",
        backsim: "∽",
        backsimeq: "⋍",
        Backslash: "∖",
        Barv: "⫧",
        barvee: "⊽",
        Barwed: "⌆",
        barwed: "⌅",
        barwedge: "⌅",
        bbrk: "⎵",
        bbrktbrk: "⎶",
        bcong: "≌",
        Bcy: "Б",
        bcy: "б",
        bdquo: "„",
        becaus: "∵",
        Because: "∵",
        because: "∵",
        bemptyv: "⦰",
        bepsi: "϶",
        bernou: "ℬ",
        Bernoullis: "ℬ",
        Beta: "Β",
        beta: "β",
        beth: "ℶ",
        between: "≬",
        Bfr: "𝔅",
        bfr: "𝔟",
        bigcap: "⋂",
        bigcirc: "◯",
        bigcup: "⋃",
        bigodot: "⨀",
        bigoplus: "⨁",
        bigotimes: "⨂",
        bigsqcup: "⨆",
        bigstar: "★",
        bigtriangledown: "▽",
        bigtriangleup: "△",
        biguplus: "⨄",
        bigvee: "⋁",
        bigwedge: "⋀",
        bkarow: "⤍",
        blacklozenge: "⧫",
        blacksquare: "▪",
        blacktriangle: "▴",
        blacktriangledown: "▾",
        blacktriangleleft: "◂",
        blacktriangleright: "▸",
        blank: "␣",
        blk12: "▒",
        blk14: "░",
        blk34: "▓",
        block: "█",
        bne: "=⃥",
        bnequiv: "≡⃥",
        bNot: "⫭",
        bnot: "⌐",
        Bopf: "𝔹",
        bopf: "𝕓",
        bot: "⊥",
        bottom: "⊥",
        bowtie: "⋈",
        boxbox: "⧉",
        boxDL: "╗",
        boxDl: "╖",
        boxdL: "╕",
        boxdl: "┐",
        boxDR: "╔",
        boxDr: "╓",
        boxdR: "╒",
        boxdr: "┌",
        boxH: "═",
        boxh: "─",
        boxHD: "╦",
        boxHd: "╤",
        boxhD: "╥",
        boxhd: "┬",
        boxHU: "╩",
        boxHu: "╧",
        boxhU: "╨",
        boxhu: "┴",
        boxminus: "⊟",
        boxplus: "⊞",
        boxtimes: "⊠",
        boxUL: "╝",
        boxUl: "╜",
        boxuL: "╛",
        boxul: "┘",
        boxUR: "╚",
        boxUr: "╙",
        boxuR: "╘",
        boxur: "└",
        boxV: "║",
        boxv: "│",
        boxVH: "╬",
        boxVh: "╫",
        boxvH: "╪",
        boxvh: "┼",
        boxVL: "╣",
        boxVl: "╢",
        boxvL: "╡",
        boxvl: "┤",
        boxVR: "╠",
        boxVr: "╟",
        boxvR: "╞",
        boxvr: "├",
        bprime: "‵",
        Breve: "˘",
        breve: "˘",
        brvbar: "¦",
        Bscr: "ℬ",
        bscr: "𝒷",
        bsemi: "⁏",
        bsim: "∽",
        bsime: "⋍",
        bsol: "\\",
        bsolb: "⧅",
        bsolhsub: "⟈",
        bull: "•",
        bullet: "•",
        bump: "≎",
        bumpE: "⪮",
        bumpe: "≏",
        Bumpeq: "≎",
        bumpeq: "≏",
        Cacute: "Ć",
        cacute: "ć",
        Cap: "⋒",
        cap: "∩",
        capand: "⩄",
        capbrcup: "⩉",
        capcap: "⩋",
        capcup: "⩇",
        capdot: "⩀",
        CapitalDifferentialD: "ⅅ",
        caps: "∩︀",
        caret: "⁁",
        caron: "ˇ",
        Cayleys: "ℭ",
        ccaps: "⩍",
        Ccaron: "Č",
        ccaron: "č",
        Ccedil: "Ç",
        ccedil: "ç",
        Ccirc: "Ĉ",
        ccirc: "ĉ",
        Cconint: "∰",
        ccups: "⩌",
        ccupssm: "⩐",
        Cdot: "Ċ",
        cdot: "ċ",
        cedil: "¸",
        Cedilla: "¸",
        cemptyv: "⦲",
        cent: "¢",
        CenterDot: "·",
        centerdot: "·",
        Cfr: "ℭ",
        cfr: "𝔠",
        CHcy: "Ч",
        chcy: "ч",
        check: "✓",
        checkmark: "✓",
        Chi: "Χ",
        chi: "χ",
        cir: "○",
        circ: "ˆ",
        circeq: "≗",
        circlearrowleft: "↺",
        circlearrowright: "↻",
        circledast: "⊛",
        circledcirc: "⊚",
        circleddash: "⊝",
        CircleDot: "⊙",
        circledR: "®",
        circledS: "Ⓢ",
        CircleMinus: "⊖",
        CirclePlus: "⊕",
        CircleTimes: "⊗",
        cirE: "⧃",
        cire: "≗",
        cirfnint: "⨐",
        cirmid: "⫯",
        cirscir: "⧂",
        ClockwiseContourIntegral: "∲",
        CloseCurlyDoubleQuote: "”",
        CloseCurlyQuote: "’",
        clubs: "♣",
        clubsuit: "♣",
        Colon: "∷",
        colon: ":",
        Colone: "⩴",
        colone: "≔",
        coloneq: "≔",
        comma: ",",
        commat: "@",
        comp: "∁",
        compfn: "∘",
        complement: "∁",
        complexes: "ℂ",
        cong: "≅",
        congdot: "⩭",
        Congruent: "≡",
        Conint: "∯",
        conint: "∮",
        ContourIntegral: "∮",
        Copf: "ℂ",
        copf: "𝕔",
        coprod: "∐",
        Coproduct: "∐",
        COPY: "©",
        copy: "©",
        copysr: "℗",
        CounterClockwiseContourIntegral: "∳",
        crarr: "↵",
        Cross: "⨯",
        cross: "✗",
        Cscr: "𝒞",
        cscr: "𝒸",
        csub: "⫏",
        csube: "⫑",
        csup: "⫐",
        csupe: "⫒",
        ctdot: "⋯",
        cudarrl: "⤸",
        cudarrr: "⤵",
        cuepr: "⋞",
        cuesc: "⋟",
        cularr: "↶",
        cularrp: "⤽",
        Cup: "⋓",
        cup: "∪",
        cupbrcap: "⩈",
        CupCap: "≍",
        cupcap: "⩆",
        cupcup: "⩊",
        cupdot: "⊍",
        cupor: "⩅",
        cups: "∪︀",
        curarr: "↷",
        curarrm: "⤼",
        curlyeqprec: "⋞",
        curlyeqsucc: "⋟",
        curlyvee: "⋎",
        curlywedge: "⋏",
        curren: "¤",
        curvearrowleft: "↶",
        curvearrowright: "↷",
        cuvee: "⋎",
        cuwed: "⋏",
        cwconint: "∲",
        cwint: "∱",
        cylcty: "⌭",
        Dagger: "‡",
        dagger: "†",
        daleth: "ℸ",
        Darr: "↡",
        dArr: "⇓",
        darr: "↓",
        dash: "‐",
        Dashv: "⫤",
        dashv: "⊣",
        dbkarow: "⤏",
        dblac: "˝",
        Dcaron: "Ď",
        dcaron: "ď",
        Dcy: "Д",
        dcy: "д",
        DD: "ⅅ",
        dd: "ⅆ",
        ddagger: "‡",
        ddarr: "⇊",
        DDotrahd: "⤑",
        ddotseq: "⩷",
        deg: "°",
        Del: "∇",
        Delta: "Δ",
        delta: "δ",
        demptyv: "⦱",
        dfisht: "⥿",
        Dfr: "𝔇",
        dfr: "𝔡",
        dHar: "⥥",
        dharl: "⇃",
        dharr: "⇂",
        DiacriticalAcute: "´",
        DiacriticalDot: "˙",
        DiacriticalDoubleAcute: "˝",
        DiacriticalGrave: "`",
        DiacriticalTilde: "˜",
        diam: "⋄",
        Diamond: "⋄",
        diamond: "⋄",
        diamondsuit: "♦",
        diams: "♦",
        die: "¨",
        DifferentialD: "ⅆ",
        digamma: "ϝ",
        disin: "⋲",
        div: "÷",
        divide: "÷",
        divideontimes: "⋇",
        divonx: "⋇",
        DJcy: "Ђ",
        djcy: "ђ",
        dlcorn: "⌞",
        dlcrop: "⌍",
        dollar: "$",
        Dopf: "𝔻",
        dopf: "𝕕",
        Dot: "¨",
        dot: "˙",
        DotDot: "⃜",
        doteq: "≐",
        doteqdot: "≑",
        DotEqual: "≐",
        dotminus: "∸",
        dotplus: "∔",
        dotsquare: "⊡",
        doublebarwedge: "⌆",
        DoubleContourIntegral: "∯",
        DoubleDot: "¨",
        DoubleDownArrow: "⇓",
        DoubleLeftArrow: "⇐",
        DoubleLeftRightArrow: "⇔",
        DoubleLeftTee: "⫤",
        DoubleLongLeftArrow: "⟸",
        DoubleLongLeftRightArrow: "⟺",
        DoubleLongRightArrow: "⟹",
        DoubleRightArrow: "⇒",
        DoubleRightTee: "⊨",
        DoubleUpArrow: "⇑",
        DoubleUpDownArrow: "⇕",
        DoubleVerticalBar: "∥",
        DownArrow: "↓",
        Downarrow: "⇓",
        downarrow: "↓",
        DownArrowBar: "⤓",
        DownArrowUpArrow: "⇵",
        DownBreve: "̑",
        downdownarrows: "⇊",
        downharpoonleft: "⇃",
        downharpoonright: "⇂",
        DownLeftRightVector: "⥐",
        DownLeftTeeVector: "⥞",
        DownLeftVector: "↽",
        DownLeftVectorBar: "⥖",
        DownRightTeeVector: "⥟",
        DownRightVector: "⇁",
        DownRightVectorBar: "⥗",
        DownTee: "⊤",
        DownTeeArrow: "↧",
        drbkarow: "⤐",
        drcorn: "⌟",
        drcrop: "⌌",
        Dscr: "𝒟",
        dscr: "𝒹",
        DScy: "Ѕ",
        dscy: "ѕ",
        dsol: "⧶",
        Dstrok: "Đ",
        dstrok: "đ",
        dtdot: "⋱",
        dtri: "▿",
        dtrif: "▾",
        duarr: "⇵",
        duhar: "⥯",
        dwangle: "⦦",
        DZcy: "Џ",
        dzcy: "џ",
        dzigrarr: "⟿",
        Eacute: "É",
        eacute: "é",
        easter: "⩮",
        Ecaron: "Ě",
        ecaron: "ě",
        ecir: "≖",
        Ecirc: "Ê",
        ecirc: "ê",
        ecolon: "≕",
        Ecy: "Э",
        ecy: "э",
        eDDot: "⩷",
        Edot: "Ė",
        eDot: "≑",
        edot: "ė",
        ee: "ⅇ",
        efDot: "≒",
        Efr: "𝔈",
        efr: "𝔢",
        eg: "⪚",
        Egrave: "È",
        egrave: "è",
        egs: "⪖",
        egsdot: "⪘",
        el: "⪙",
        Element: "∈",
        elinters: "⏧",
        ell: "ℓ",
        els: "⪕",
        elsdot: "⪗",
        Emacr: "Ē",
        emacr: "ē",
        empty: "∅",
        emptyset: "∅",
        EmptySmallSquare: "◻",
        emptyv: "∅",
        EmptyVerySmallSquare: "▫",
        emsp: " ",
        emsp13: " ",
        emsp14: " ",
        ENG: "Ŋ",
        eng: "ŋ",
        ensp: " ",
        Eogon: "Ę",
        eogon: "ę",
        Eopf: "𝔼",
        eopf: "𝕖",
        epar: "⋕",
        eparsl: "⧣",
        eplus: "⩱",
        epsi: "ε",
        Epsilon: "Ε",
        epsilon: "ε",
        epsiv: "ϵ",
        eqcirc: "≖",
        eqcolon: "≕",
        eqsim: "≂",
        eqslantgtr: "⪖",
        eqslantless: "⪕",
        Equal: "⩵",
        equals: "=",
        EqualTilde: "≂",
        equest: "≟",
        Equilibrium: "⇌",
        equiv: "≡",
        equivDD: "⩸",
        eqvparsl: "⧥",
        erarr: "⥱",
        erDot: "≓",
        Escr: "ℰ",
        escr: "ℯ",
        esdot: "≐",
        Esim: "⩳",
        esim: "≂",
        Eta: "Η",
        eta: "η",
        ETH: "Ð",
        eth: "ð",
        Euml: "Ë",
        euml: "ë",
        euro: "€",
        excl: "!",
        exist: "∃",
        Exists: "∃",
        expectation: "ℰ",
        ExponentialE: "ⅇ",
        exponentiale: "ⅇ",
        fallingdotseq: "≒",
        Fcy: "Ф",
        fcy: "ф",
        female: "♀",
        ffilig: "ﬃ",
        fflig: "ﬀ",
        ffllig: "ﬄ",
        Ffr: "𝔉",
        ffr: "𝔣",
        filig: "ﬁ",
        FilledSmallSquare: "◼",
        FilledVerySmallSquare: "▪",
        fjlig: "fj",
        flat: "♭",
        fllig: "ﬂ",
        fltns: "▱",
        fnof: "ƒ",
        Fopf: "𝔽",
        fopf: "𝕗",
        ForAll: "∀",
        forall: "∀",
        fork: "⋔",
        forkv: "⫙",
        Fouriertrf: "ℱ",
        fpartint: "⨍",
        frac12: "½",
        frac13: "⅓",
        frac14: "¼",
        frac15: "⅕",
        frac16: "⅙",
        frac18: "⅛",
        frac23: "⅔",
        frac25: "⅖",
        frac34: "¾",
        frac35: "⅗",
        frac38: "⅜",
        frac45: "⅘",
        frac56: "⅚",
        frac58: "⅝",
        frac78: "⅞",
        frasl: "⁄",
        frown: "⌢",
        Fscr: "ℱ",
        fscr: "𝒻",
        gacute: "ǵ",
        Gamma: "Γ",
        gamma: "γ",
        Gammad: "Ϝ",
        gammad: "ϝ",
        gap: "⪆",
        Gbreve: "Ğ",
        gbreve: "ğ",
        Gcedil: "Ģ",
        Gcirc: "Ĝ",
        gcirc: "ĝ",
        Gcy: "Г",
        gcy: "г",
        Gdot: "Ġ",
        gdot: "ġ",
        gE: "≧",
        ge: "≥",
        gEl: "⪌",
        gel: "⋛",
        geq: "≥",
        geqq: "≧",
        geqslant: "⩾",
        ges: "⩾",
        gescc: "⪩",
        gesdot: "⪀",
        gesdoto: "⪂",
        gesdotol: "⪄",
        gesl: "⋛︀",
        gesles: "⪔",
        Gfr: "𝔊",
        gfr: "𝔤",
        Gg: "⋙",
        gg: "≫",
        ggg: "⋙",
        gimel: "ℷ",
        GJcy: "Ѓ",
        gjcy: "ѓ",
        gl: "≷",
        gla: "⪥",
        glE: "⪒",
        glj: "⪤",
        gnap: "⪊",
        gnapprox: "⪊",
        gnE: "≩",
        gne: "⪈",
        gneq: "⪈",
        gneqq: "≩",
        gnsim: "⋧",
        Gopf: "𝔾",
        gopf: "𝕘",
        grave: "`",
        GreaterEqual: "≥",
        GreaterEqualLess: "⋛",
        GreaterFullEqual: "≧",
        GreaterGreater: "⪢",
        GreaterLess: "≷",
        GreaterSlantEqual: "⩾",
        GreaterTilde: "≳",
        Gscr: "𝒢",
        gscr: "ℊ",
        gsim: "≳",
        gsime: "⪎",
        gsiml: "⪐",
        Gt: "≫",
        GT: ">",
        gt: ">",
        gtcc: "⪧",
        gtcir: "⩺",
        gtdot: "⋗",
        gtlPar: "⦕",
        gtquest: "⩼",
        gtrapprox: "⪆",
        gtrarr: "⥸",
        gtrdot: "⋗",
        gtreqless: "⋛",
        gtreqqless: "⪌",
        gtrless: "≷",
        gtrsim: "≳",
        gvertneqq: "≩︀",
        gvnE: "≩︀",
        Hacek: "ˇ",
        hairsp: " ",
        half: "½",
        hamilt: "ℋ",
        HARDcy: "Ъ",
        hardcy: "ъ",
        hArr: "⇔",
        harr: "↔",
        harrcir: "⥈",
        harrw: "↭",
        Hat: "^",
        hbar: "ℏ",
        Hcirc: "Ĥ",
        hcirc: "ĥ",
        hearts: "♥",
        heartsuit: "♥",
        hellip: "…",
        hercon: "⊹",
        Hfr: "ℌ",
        hfr: "𝔥",
        HilbertSpace: "ℋ",
        hksearow: "⤥",
        hkswarow: "⤦",
        hoarr: "⇿",
        homtht: "∻",
        hookleftarrow: "↩",
        hookrightarrow: "↪",
        Hopf: "ℍ",
        hopf: "𝕙",
        horbar: "―",
        HorizontalLine: "─",
        Hscr: "ℋ",
        hscr: "𝒽",
        hslash: "ℏ",
        Hstrok: "Ħ",
        hstrok: "ħ",
        HumpDownHump: "≎",
        HumpEqual: "≏",
        hybull: "⁃",
        hyphen: "‐",
        Iacute: "Í",
        iacute: "í",
        ic: "⁣",
        Icirc: "Î",
        icirc: "î",
        Icy: "И",
        icy: "и",
        Idot: "İ",
        IEcy: "Е",
        iecy: "е",
        iexcl: "¡",
        iff: "⇔",
        Ifr: "ℑ",
        ifr: "𝔦",
        Igrave: "Ì",
        igrave: "ì",
        ii: "ⅈ",
        iiiint: "⨌",
        iiint: "∭",
        iinfin: "⧜",
        iiota: "℩",
        IJlig: "Ĳ",
        ijlig: "ĳ",
        Im: "ℑ",
        Imacr: "Ī",
        imacr: "ī",
        image: "ℑ",
        ImaginaryI: "ⅈ",
        imagline: "ℐ",
        imagpart: "ℑ",
        imath: "ı",
        imof: "⊷",
        imped: "Ƶ",
        Implies: "⇒",
        in: "∈",
        incare: "℅",
        infin: "∞",
        infintie: "⧝",
        inodot: "ı",
        Int: "∬",
        int: "∫",
        intcal: "⊺",
        integers: "ℤ",
        Integral: "∫",
        intercal: "⊺",
        Intersection: "⋂",
        intlarhk: "⨗",
        intprod: "⨼",
        InvisibleComma: "⁣",
        InvisibleTimes: "⁢",
        IOcy: "Ё",
        iocy: "ё",
        Iogon: "Į",
        iogon: "į",
        Iopf: "𝕀",
        iopf: "𝕚",
        Iota: "Ι",
        iota: "ι",
        iprod: "⨼",
        iquest: "¿",
        Iscr: "ℐ",
        iscr: "𝒾",
        isin: "∈",
        isindot: "⋵",
        isinE: "⋹",
        isins: "⋴",
        isinsv: "⋳",
        isinv: "∈",
        it: "⁢",
        Itilde: "Ĩ",
        itilde: "ĩ",
        Iukcy: "І",
        iukcy: "і",
        Iuml: "Ï",
        iuml: "ï",
        Jcirc: "Ĵ",
        jcirc: "ĵ",
        Jcy: "Й",
        jcy: "й",
        Jfr: "𝔍",
        jfr: "𝔧",
        jmath: "ȷ",
        Jopf: "𝕁",
        jopf: "𝕛",
        Jscr: "𝒥",
        jscr: "𝒿",
        Jsercy: "Ј",
        jsercy: "ј",
        Jukcy: "Є",
        jukcy: "є",
        Kappa: "Κ",
        kappa: "κ",
        kappav: "ϰ",
        Kcedil: "Ķ",
        kcedil: "ķ",
        Kcy: "К",
        kcy: "к",
        Kfr: "𝔎",
        kfr: "𝔨",
        kgreen: "ĸ",
        KHcy: "Х",
        khcy: "х",
        KJcy: "Ќ",
        kjcy: "ќ",
        Kopf: "𝕂",
        kopf: "𝕜",
        Kscr: "𝒦",
        kscr: "𝓀",
        lAarr: "⇚",
        Lacute: "Ĺ",
        lacute: "ĺ",
        laemptyv: "⦴",
        lagran: "ℒ",
        Lambda: "Λ",
        lambda: "λ",
        Lang: "⟪",
        lang: "⟨",
        langd: "⦑",
        langle: "⟨",
        lap: "⪅",
        Laplacetrf: "ℒ",
        laquo: "«",
        Larr: "↞",
        lArr: "⇐",
        larr: "←",
        larrb: "⇤",
        larrbfs: "⤟",
        larrfs: "⤝",
        larrhk: "↩",
        larrlp: "↫",
        larrpl: "⤹",
        larrsim: "⥳",
        larrtl: "↢",
        lat: "⪫",
        lAtail: "⤛",
        latail: "⤙",
        late: "⪭",
        lates: "⪭︀",
        lBarr: "⤎",
        lbarr: "⤌",
        lbbrk: "❲",
        lbrace: "{",
        lbrack: "[",
        lbrke: "⦋",
        lbrksld: "⦏",
        lbrkslu: "⦍",
        Lcaron: "Ľ",
        lcaron: "ľ",
        Lcedil: "Ļ",
        lcedil: "ļ",
        lceil: "⌈",
        lcub: "{",
        Lcy: "Л",
        lcy: "л",
        ldca: "⤶",
        ldquo: "“",
        ldquor: "„",
        ldrdhar: "⥧",
        ldrushar: "⥋",
        ldsh: "↲",
        lE: "≦",
        le: "≤",
        LeftAngleBracket: "⟨",
        LeftArrow: "←",
        Leftarrow: "⇐",
        leftarrow: "←",
        LeftArrowBar: "⇤",
        LeftArrowRightArrow: "⇆",
        leftarrowtail: "↢",
        LeftCeiling: "⌈",
        LeftDoubleBracket: "⟦",
        LeftDownTeeVector: "⥡",
        LeftDownVector: "⇃",
        LeftDownVectorBar: "⥙",
        LeftFloor: "⌊",
        leftharpoondown: "↽",
        leftharpoonup: "↼",
        leftleftarrows: "⇇",
        LeftRightArrow: "↔",
        Leftrightarrow: "⇔",
        leftrightarrow: "↔",
        leftrightarrows: "⇆",
        leftrightharpoons: "⇋",
        leftrightsquigarrow: "↭",
        LeftRightVector: "⥎",
        LeftTee: "⊣",
        LeftTeeArrow: "↤",
        LeftTeeVector: "⥚",
        leftthreetimes: "⋋",
        LeftTriangle: "⊲",
        LeftTriangleBar: "⧏",
        LeftTriangleEqual: "⊴",
        LeftUpDownVector: "⥑",
        LeftUpTeeVector: "⥠",
        LeftUpVector: "↿",
        LeftUpVectorBar: "⥘",
        LeftVector: "↼",
        LeftVectorBar: "⥒",
        lEg: "⪋",
        leg: "⋚",
        leq: "≤",
        leqq: "≦",
        leqslant: "⩽",
        les: "⩽",
        lescc: "⪨",
        lesdot: "⩿",
        lesdoto: "⪁",
        lesdotor: "⪃",
        lesg: "⋚︀",
        lesges: "⪓",
        lessapprox: "⪅",
        lessdot: "⋖",
        lesseqgtr: "⋚",
        lesseqqgtr: "⪋",
        LessEqualGreater: "⋚",
        LessFullEqual: "≦",
        LessGreater: "≶",
        lessgtr: "≶",
        LessLess: "⪡",
        lesssim: "≲",
        LessSlantEqual: "⩽",
        LessTilde: "≲",
        lfisht: "⥼",
        lfloor: "⌊",
        Lfr: "𝔏",
        lfr: "𝔩",
        lg: "≶",
        lgE: "⪑",
        lHar: "⥢",
        lhard: "↽",
        lharu: "↼",
        lharul: "⥪",
        lhblk: "▄",
        LJcy: "Љ",
        ljcy: "љ",
        Ll: "⋘",
        ll: "≪",
        llarr: "⇇",
        llcorner: "⌞",
        Lleftarrow: "⇚",
        llhard: "⥫",
        lltri: "◺",
        Lmidot: "Ŀ",
        lmidot: "ŀ",
        lmoust: "⎰",
        lmoustache: "⎰",
        lnap: "⪉",
        lnapprox: "⪉",
        lnE: "≨",
        lne: "⪇",
        lneq: "⪇",
        lneqq: "≨",
        lnsim: "⋦",
        loang: "⟬",
        loarr: "⇽",
        lobrk: "⟦",
        LongLeftArrow: "⟵",
        Longleftarrow: "⟸",
        longleftarrow: "⟵",
        LongLeftRightArrow: "⟷",
        Longleftrightarrow: "⟺",
        longleftrightarrow: "⟷",
        longmapsto: "⟼",
        LongRightArrow: "⟶",
        Longrightarrow: "⟹",
        longrightarrow: "⟶",
        looparrowleft: "↫",
        looparrowright: "↬",
        lopar: "⦅",
        Lopf: "𝕃",
        lopf: "𝕝",
        loplus: "⨭",
        lotimes: "⨴",
        lowast: "∗",
        lowbar: "_",
        LowerLeftArrow: "↙",
        LowerRightArrow: "↘",
        loz: "◊",
        lozenge: "◊",
        lozf: "⧫",
        lpar: "(",
        lparlt: "⦓",
        lrarr: "⇆",
        lrcorner: "⌟",
        lrhar: "⇋",
        lrhard: "⥭",
        lrm: "‎",
        lrtri: "⊿",
        lsaquo: "‹",
        Lscr: "ℒ",
        lscr: "𝓁",
        Lsh: "↰",
        lsh: "↰",
        lsim: "≲",
        lsime: "⪍",
        lsimg: "⪏",
        lsqb: "[",
        lsquo: "‘",
        lsquor: "‚",
        Lstrok: "Ł",
        lstrok: "ł",
        Lt: "≪",
        LT: "<",
        lt: "<",
        ltcc: "⪦",
        ltcir: "⩹",
        ltdot: "⋖",
        lthree: "⋋",
        ltimes: "⋉",
        ltlarr: "⥶",
        ltquest: "⩻",
        ltri: "◃",
        ltrie: "⊴",
        ltrif: "◂",
        ltrPar: "⦖",
        lurdshar: "⥊",
        luruhar: "⥦",
        lvertneqq: "≨︀",
        lvnE: "≨︀",
        macr: "¯",
        male: "♂",
        malt: "✠",
        maltese: "✠",
        Map: "⤅",
        map: "↦",
        mapsto: "↦",
        mapstodown: "↧",
        mapstoleft: "↤",
        mapstoup: "↥",
        marker: "▮",
        mcomma: "⨩",
        Mcy: "М",
        mcy: "м",
        mdash: "—",
        mDDot: "∺",
        measuredangle: "∡",
        MediumSpace: " ",
        Mellintrf: "ℳ",
        Mfr: "𝔐",
        mfr: "𝔪",
        mho: "℧",
        micro: "µ",
        mid: "∣",
        midast: "*",
        midcir: "⫰",
        middot: "·",
        minus: "−",
        minusb: "⊟",
        minusd: "∸",
        minusdu: "⨪",
        MinusPlus: "∓",
        mlcp: "⫛",
        mldr: "…",
        mnplus: "∓",
        models: "⊧",
        Mopf: "𝕄",
        mopf: "𝕞",
        mp: "∓",
        Mscr: "ℳ",
        mscr: "𝓂",
        mstpos: "∾",
        Mu: "Μ",
        mu: "μ",
        multimap: "⊸",
        mumap: "⊸",
        nabla: "∇",
        Nacute: "Ń",
        nacute: "ń",
        nang: "∠⃒",
        nap: "≉",
        napE: "⩰̸",
        napid: "≋̸",
        napos: "ŉ",
        napprox: "≉",
        natur: "♮",
        natural: "♮",
        naturals: "ℕ",
        nbsp: " ",
        nbump: "≎̸",
        nbumpe: "≏̸",
        ncap: "⩃",
        Ncaron: "Ň",
        ncaron: "ň",
        Ncedil: "Ņ",
        ncedil: "ņ",
        ncong: "≇",
        ncongdot: "⩭̸",
        ncup: "⩂",
        Ncy: "Н",
        ncy: "н",
        ndash: "–",
        ne: "≠",
        nearhk: "⤤",
        neArr: "⇗",
        nearr: "↗",
        nearrow: "↗",
        nedot: "≐̸",
        NegativeMediumSpace: "​",
        NegativeThickSpace: "​",
        NegativeThinSpace: "​",
        NegativeVeryThinSpace: "​",
        nequiv: "≢",
        nesear: "⤨",
        nesim: "≂̸",
        NestedGreaterGreater: "≫",
        NestedLessLess: "≪",
        NewLine: "\n",
        nexist: "∄",
        nexists: "∄",
        Nfr: "𝔑",
        nfr: "𝔫",
        ngE: "≧̸",
        nge: "≱",
        ngeq: "≱",
        ngeqq: "≧̸",
        ngeqslant: "⩾̸",
        nges: "⩾̸",
        nGg: "⋙̸",
        ngsim: "≵",
        nGt: "≫⃒",
        ngt: "≯",
        ngtr: "≯",
        nGtv: "≫̸",
        nhArr: "⇎",
        nharr: "↮",
        nhpar: "⫲",
        ni: "∋",
        nis: "⋼",
        nisd: "⋺",
        niv: "∋",
        NJcy: "Њ",
        njcy: "њ",
        nlArr: "⇍",
        nlarr: "↚",
        nldr: "‥",
        nlE: "≦̸",
        nle: "≰",
        nLeftarrow: "⇍",
        nleftarrow: "↚",
        nLeftrightarrow: "⇎",
        nleftrightarrow: "↮",
        nleq: "≰",
        nleqq: "≦̸",
        nleqslant: "⩽̸",
        nles: "⩽̸",
        nless: "≮",
        nLl: "⋘̸",
        nlsim: "≴",
        nLt: "≪⃒",
        nlt: "≮",
        nltri: "⋪",
        nltrie: "⋬",
        nLtv: "≪̸",
        nmid: "∤",
        NoBreak: "⁠",
        NonBreakingSpace: " ",
        Nopf: "ℕ",
        nopf: "𝕟",
        Not: "⫬",
        not: "¬",
        NotCongruent: "≢",
        NotCupCap: "≭",
        NotDoubleVerticalBar: "∦",
        NotElement: "∉",
        NotEqual: "≠",
        NotEqualTilde: "≂̸",
        NotExists: "∄",
        NotGreater: "≯",
        NotGreaterEqual: "≱",
        NotGreaterFullEqual: "≧̸",
        NotGreaterGreater: "≫̸",
        NotGreaterLess: "≹",
        NotGreaterSlantEqual: "⩾̸",
        NotGreaterTilde: "≵",
        NotHumpDownHump: "≎̸",
        NotHumpEqual: "≏̸",
        notin: "∉",
        notindot: "⋵̸",
        notinE: "⋹̸",
        notinva: "∉",
        notinvb: "⋷",
        notinvc: "⋶",
        NotLeftTriangle: "⋪",
        NotLeftTriangleBar: "⧏̸",
        NotLeftTriangleEqual: "⋬",
        NotLess: "≮",
        NotLessEqual: "≰",
        NotLessGreater: "≸",
        NotLessLess: "≪̸",
        NotLessSlantEqual: "⩽̸",
        NotLessTilde: "≴",
        NotNestedGreaterGreater: "⪢̸",
        NotNestedLessLess: "⪡̸",
        notni: "∌",
        notniva: "∌",
        notnivb: "⋾",
        notnivc: "⋽",
        NotPrecedes: "⊀",
        NotPrecedesEqual: "⪯̸",
        NotPrecedesSlantEqual: "⋠",
        NotReverseElement: "∌",
        NotRightTriangle: "⋫",
        NotRightTriangleBar: "⧐̸",
        NotRightTriangleEqual: "⋭",
        NotSquareSubset: "⊏̸",
        NotSquareSubsetEqual: "⋢",
        NotSquareSuperset: "⊐̸",
        NotSquareSupersetEqual: "⋣",
        NotSubset: "⊂⃒",
        NotSubsetEqual: "⊈",
        NotSucceeds: "⊁",
        NotSucceedsEqual: "⪰̸",
        NotSucceedsSlantEqual: "⋡",
        NotSucceedsTilde: "≿̸",
        NotSuperset: "⊃⃒",
        NotSupersetEqual: "⊉",
        NotTilde: "≁",
        NotTildeEqual: "≄",
        NotTildeFullEqual: "≇",
        NotTildeTilde: "≉",
        NotVerticalBar: "∤",
        npar: "∦",
        nparallel: "∦",
        nparsl: "⫽⃥",
        npart: "∂̸",
        npolint: "⨔",
        npr: "⊀",
        nprcue: "⋠",
        npre: "⪯̸",
        nprec: "⊀",
        npreceq: "⪯̸",
        nrArr: "⇏",
        nrarr: "↛",
        nrarrc: "⤳̸",
        nrarrw: "↝̸",
        nRightarrow: "⇏",
        nrightarrow: "↛",
        nrtri: "⋫",
        nrtrie: "⋭",
        nsc: "⊁",
        nsccue: "⋡",
        nsce: "⪰̸",
        Nscr: "𝒩",
        nscr: "𝓃",
        nshortmid: "∤",
        nshortparallel: "∦",
        nsim: "≁",
        nsime: "≄",
        nsimeq: "≄",
        nsmid: "∤",
        nspar: "∦",
        nsqsube: "⋢",
        nsqsupe: "⋣",
        nsub: "⊄",
        nsubE: "⫅̸",
        nsube: "⊈",
        nsubset: "⊂⃒",
        nsubseteq: "⊈",
        nsubseteqq: "⫅̸",
        nsucc: "⊁",
        nsucceq: "⪰̸",
        nsup: "⊅",
        nsupE: "⫆̸",
        nsupe: "⊉",
        nsupset: "⊃⃒",
        nsupseteq: "⊉",
        nsupseteqq: "⫆̸",
        ntgl: "≹",
        Ntilde: "Ñ",
        ntilde: "ñ",
        ntlg: "≸",
        ntriangleleft: "⋪",
        ntrianglelefteq: "⋬",
        ntriangleright: "⋫",
        ntrianglerighteq: "⋭",
        Nu: "Ν",
        nu: "ν",
        num: "#",
        numero: "№",
        numsp: " ",
        nvap: "≍⃒",
        nVDash: "⊯",
        nVdash: "⊮",
        nvDash: "⊭",
        nvdash: "⊬",
        nvge: "≥⃒",
        nvgt: ">⃒",
        nvHarr: "⤄",
        nvinfin: "⧞",
        nvlArr: "⤂",
        nvle: "≤⃒",
        nvlt: "<⃒",
        nvltrie: "⊴⃒",
        nvrArr: "⤃",
        nvrtrie: "⊵⃒",
        nvsim: "∼⃒",
        nwarhk: "⤣",
        nwArr: "⇖",
        nwarr: "↖",
        nwarrow: "↖",
        nwnear: "⤧",
        Oacute: "Ó",
        oacute: "ó",
        oast: "⊛",
        ocir: "⊚",
        Ocirc: "Ô",
        ocirc: "ô",
        Ocy: "О",
        ocy: "о",
        odash: "⊝",
        Odblac: "Ő",
        odblac: "ő",
        odiv: "⨸",
        odot: "⊙",
        odsold: "⦼",
        OElig: "Œ",
        oelig: "œ",
        ofcir: "⦿",
        Ofr: "𝔒",
        ofr: "𝔬",
        ogon: "˛",
        Ograve: "Ò",
        ograve: "ò",
        ogt: "⧁",
        ohbar: "⦵",
        ohm: "Ω",
        oint: "∮",
        olarr: "↺",
        olcir: "⦾",
        olcross: "⦻",
        oline: "‾",
        olt: "⧀",
        Omacr: "Ō",
        omacr: "ō",
        Omega: "Ω",
        omega: "ω",
        Omicron: "Ο",
        omicron: "ο",
        omid: "⦶",
        ominus: "⊖",
        Oopf: "𝕆",
        oopf: "𝕠",
        opar: "⦷",
        OpenCurlyDoubleQuote: "“",
        OpenCurlyQuote: "‘",
        operp: "⦹",
        oplus: "⊕",
        Or: "⩔",
        or: "∨",
        orarr: "↻",
        ord: "⩝",
        order: "ℴ",
        orderof: "ℴ",
        ordf: "ª",
        ordm: "º",
        origof: "⊶",
        oror: "⩖",
        orslope: "⩗",
        orv: "⩛",
        oS: "Ⓢ",
        Oscr: "𝒪",
        oscr: "ℴ",
        Oslash: "Ø",
        oslash: "ø",
        osol: "⊘",
        Otilde: "Õ",
        otilde: "õ",
        Otimes: "⨷",
        otimes: "⊗",
        otimesas: "⨶",
        Ouml: "Ö",
        ouml: "ö",
        ovbar: "⌽",
        OverBar: "‾",
        OverBrace: "⏞",
        OverBracket: "⎴",
        OverParenthesis: "⏜",
        par: "∥",
        para: "¶",
        parallel: "∥",
        parsim: "⫳",
        parsl: "⫽",
        part: "∂",
        PartialD: "∂",
        Pcy: "П",
        pcy: "п",
        percnt: "%",
        period: ".",
        permil: "‰",
        perp: "⊥",
        pertenk: "‱",
        Pfr: "𝔓",
        pfr: "𝔭",
        Phi: "Φ",
        phi: "φ",
        phiv: "ϕ",
        phmmat: "ℳ",
        phone: "☎",
        Pi: "Π",
        pi: "π",
        pitchfork: "⋔",
        piv: "ϖ",
        planck: "ℏ",
        planckh: "ℎ",
        plankv: "ℏ",
        plus: "+",
        plusacir: "⨣",
        plusb: "⊞",
        pluscir: "⨢",
        plusdo: "∔",
        plusdu: "⨥",
        pluse: "⩲",
        PlusMinus: "±",
        plusmn: "±",
        plussim: "⨦",
        plustwo: "⨧",
        pm: "±",
        Poincareplane: "ℌ",
        pointint: "⨕",
        Popf: "ℙ",
        popf: "𝕡",
        pound: "£",
        Pr: "⪻",
        pr: "≺",
        prap: "⪷",
        prcue: "≼",
        prE: "⪳",
        pre: "⪯",
        prec: "≺",
        precapprox: "⪷",
        preccurlyeq: "≼",
        Precedes: "≺",
        PrecedesEqual: "⪯",
        PrecedesSlantEqual: "≼",
        PrecedesTilde: "≾",
        preceq: "⪯",
        precnapprox: "⪹",
        precneqq: "⪵",
        precnsim: "⋨",
        precsim: "≾",
        Prime: "″",
        prime: "′",
        primes: "ℙ",
        prnap: "⪹",
        prnE: "⪵",
        prnsim: "⋨",
        prod: "∏",
        Product: "∏",
        profalar: "⌮",
        profline: "⌒",
        profsurf: "⌓",
        prop: "∝",
        Proportion: "∷",
        Proportional: "∝",
        propto: "∝",
        prsim: "≾",
        prurel: "⊰",
        Pscr: "𝒫",
        pscr: "𝓅",
        Psi: "Ψ",
        psi: "ψ",
        puncsp: " ",
        Qfr: "𝔔",
        qfr: "𝔮",
        qint: "⨌",
        Qopf: "ℚ",
        qopf: "𝕢",
        qprime: "⁗",
        Qscr: "𝒬",
        qscr: "𝓆",
        quaternions: "ℍ",
        quatint: "⨖",
        quest: "?",
        questeq: "≟",
        QUOT: '"',
        quot: '"',
        rAarr: "⇛",
        race: "∽̱",
        Racute: "Ŕ",
        racute: "ŕ",
        radic: "√",
        raemptyv: "⦳",
        Rang: "⟫",
        rang: "⟩",
        rangd: "⦒",
        range: "⦥",
        rangle: "⟩",
        raquo: "»",
        Rarr: "↠",
        rArr: "⇒",
        rarr: "→",
        rarrap: "⥵",
        rarrb: "⇥",
        rarrbfs: "⤠",
        rarrc: "⤳",
        rarrfs: "⤞",
        rarrhk: "↪",
        rarrlp: "↬",
        rarrpl: "⥅",
        rarrsim: "⥴",
        Rarrtl: "⤖",
        rarrtl: "↣",
        rarrw: "↝",
        rAtail: "⤜",
        ratail: "⤚",
        ratio: "∶",
        rationals: "ℚ",
        RBarr: "⤐",
        rBarr: "⤏",
        rbarr: "⤍",
        rbbrk: "❳",
        rbrace: "}",
        rbrack: "]",
        rbrke: "⦌",
        rbrksld: "⦎",
        rbrkslu: "⦐",
        Rcaron: "Ř",
        rcaron: "ř",
        Rcedil: "Ŗ",
        rcedil: "ŗ",
        rceil: "⌉",
        rcub: "}",
        Rcy: "Р",
        rcy: "р",
        rdca: "⤷",
        rdldhar: "⥩",
        rdquo: "”",
        rdquor: "”",
        rdsh: "↳",
        Re: "ℜ",
        real: "ℜ",
        realine: "ℛ",
        realpart: "ℜ",
        reals: "ℝ",
        rect: "▭",
        REG: "®",
        reg: "®",
        ReverseElement: "∋",
        ReverseEquilibrium: "⇋",
        ReverseUpEquilibrium: "⥯",
        rfisht: "⥽",
        rfloor: "⌋",
        Rfr: "ℜ",
        rfr: "𝔯",
        rHar: "⥤",
        rhard: "⇁",
        rharu: "⇀",
        rharul: "⥬",
        Rho: "Ρ",
        rho: "ρ",
        rhov: "ϱ",
        RightAngleBracket: "⟩",
        RightArrow: "→",
        Rightarrow: "⇒",
        rightarrow: "→",
        RightArrowBar: "⇥",
        RightArrowLeftArrow: "⇄",
        rightarrowtail: "↣",
        RightCeiling: "⌉",
        RightDoubleBracket: "⟧",
        RightDownTeeVector: "⥝",
        RightDownVector: "⇂",
        RightDownVectorBar: "⥕",
        RightFloor: "⌋",
        rightharpoondown: "⇁",
        rightharpoonup: "⇀",
        rightleftarrows: "⇄",
        rightleftharpoons: "⇌",
        rightrightarrows: "⇉",
        rightsquigarrow: "↝",
        RightTee: "⊢",
        RightTeeArrow: "↦",
        RightTeeVector: "⥛",
        rightthreetimes: "⋌",
        RightTriangle: "⊳",
        RightTriangleBar: "⧐",
        RightTriangleEqual: "⊵",
        RightUpDownVector: "⥏",
        RightUpTeeVector: "⥜",
        RightUpVector: "↾",
        RightUpVectorBar: "⥔",
        RightVector: "⇀",
        RightVectorBar: "⥓",
        ring: "˚",
        risingdotseq: "≓",
        rlarr: "⇄",
        rlhar: "⇌",
        rlm: "‏",
        rmoust: "⎱",
        rmoustache: "⎱",
        rnmid: "⫮",
        roang: "⟭",
        roarr: "⇾",
        robrk: "⟧",
        ropar: "⦆",
        Ropf: "ℝ",
        ropf: "𝕣",
        roplus: "⨮",
        rotimes: "⨵",
        RoundImplies: "⥰",
        rpar: ")",
        rpargt: "⦔",
        rppolint: "⨒",
        rrarr: "⇉",
        Rrightarrow: "⇛",
        rsaquo: "›",
        Rscr: "ℛ",
        rscr: "𝓇",
        Rsh: "↱",
        rsh: "↱",
        rsqb: "]",
        rsquo: "’",
        rsquor: "’",
        rthree: "⋌",
        rtimes: "⋊",
        rtri: "▹",
        rtrie: "⊵",
        rtrif: "▸",
        rtriltri: "⧎",
        RuleDelayed: "⧴",
        ruluhar: "⥨",
        rx: "℞",
        Sacute: "Ś",
        sacute: "ś",
        sbquo: "‚",
        Sc: "⪼",
        sc: "≻",
        scap: "⪸",
        Scaron: "Š",
        scaron: "š",
        sccue: "≽",
        scE: "⪴",
        sce: "⪰",
        Scedil: "Ş",
        scedil: "ş",
        Scirc: "Ŝ",
        scirc: "ŝ",
        scnap: "⪺",
        scnE: "⪶",
        scnsim: "⋩",
        scpolint: "⨓",
        scsim: "≿",
        Scy: "С",
        scy: "с",
        sdot: "⋅",
        sdotb: "⊡",
        sdote: "⩦",
        searhk: "⤥",
        seArr: "⇘",
        searr: "↘",
        searrow: "↘",
        sect: "§",
        semi: ";",
        seswar: "⤩",
        setminus: "∖",
        setmn: "∖",
        sext: "✶",
        Sfr: "𝔖",
        sfr: "𝔰",
        sfrown: "⌢",
        sharp: "♯",
        SHCHcy: "Щ",
        shchcy: "щ",
        SHcy: "Ш",
        shcy: "ш",
        ShortDownArrow: "↓",
        ShortLeftArrow: "←",
        shortmid: "∣",
        shortparallel: "∥",
        ShortRightArrow: "→",
        ShortUpArrow: "↑",
        shy: "­",
        Sigma: "Σ",
        sigma: "σ",
        sigmaf: "ς",
        sigmav: "ς",
        sim: "∼",
        simdot: "⩪",
        sime: "≃",
        simeq: "≃",
        simg: "⪞",
        simgE: "⪠",
        siml: "⪝",
        simlE: "⪟",
        simne: "≆",
        simplus: "⨤",
        simrarr: "⥲",
        slarr: "←",
        SmallCircle: "∘",
        smallsetminus: "∖",
        smashp: "⨳",
        smeparsl: "⧤",
        smid: "∣",
        smile: "⌣",
        smt: "⪪",
        smte: "⪬",
        smtes: "⪬︀",
        SOFTcy: "Ь",
        softcy: "ь",
        sol: "/",
        solb: "⧄",
        solbar: "⌿",
        Sopf: "𝕊",
        sopf: "𝕤",
        spades: "♠",
        spadesuit: "♠",
        spar: "∥",
        sqcap: "⊓",
        sqcaps: "⊓︀",
        sqcup: "⊔",
        sqcups: "⊔︀",
        Sqrt: "√",
        sqsub: "⊏",
        sqsube: "⊑",
        sqsubset: "⊏",
        sqsubseteq: "⊑",
        sqsup: "⊐",
        sqsupe: "⊒",
        sqsupset: "⊐",
        sqsupseteq: "⊒",
        squ: "□",
        Square: "□",
        square: "□",
        SquareIntersection: "⊓",
        SquareSubset: "⊏",
        SquareSubsetEqual: "⊑",
        SquareSuperset: "⊐",
        SquareSupersetEqual: "⊒",
        SquareUnion: "⊔",
        squarf: "▪",
        squf: "▪",
        srarr: "→",
        Sscr: "𝒮",
        sscr: "𝓈",
        ssetmn: "∖",
        ssmile: "⌣",
        sstarf: "⋆",
        Star: "⋆",
        star: "☆",
        starf: "★",
        straightepsilon: "ϵ",
        straightphi: "ϕ",
        strns: "¯",
        Sub: "⋐",
        sub: "⊂",
        subdot: "⪽",
        subE: "⫅",
        sube: "⊆",
        subedot: "⫃",
        submult: "⫁",
        subnE: "⫋",
        subne: "⊊",
        subplus: "⪿",
        subrarr: "⥹",
        Subset: "⋐",
        subset: "⊂",
        subseteq: "⊆",
        subseteqq: "⫅",
        SubsetEqual: "⊆",
        subsetneq: "⊊",
        subsetneqq: "⫋",
        subsim: "⫇",
        subsub: "⫕",
        subsup: "⫓",
        succ: "≻",
        succapprox: "⪸",
        succcurlyeq: "≽",
        Succeeds: "≻",
        SucceedsEqual: "⪰",
        SucceedsSlantEqual: "≽",
        SucceedsTilde: "≿",
        succeq: "⪰",
        succnapprox: "⪺",
        succneqq: "⪶",
        succnsim: "⋩",
        succsim: "≿",
        SuchThat: "∋",
        Sum: "∑",
        sum: "∑",
        sung: "♪",
        Sup: "⋑",
        sup: "⊃",
        sup1: "¹",
        sup2: "²",
        sup3: "³",
        supdot: "⪾",
        supdsub: "⫘",
        supE: "⫆",
        supe: "⊇",
        supedot: "⫄",
        Superset: "⊃",
        SupersetEqual: "⊇",
        suphsol: "⟉",
        suphsub: "⫗",
        suplarr: "⥻",
        supmult: "⫂",
        supnE: "⫌",
        supne: "⊋",
        supplus: "⫀",
        Supset: "⋑",
        supset: "⊃",
        supseteq: "⊇",
        supseteqq: "⫆",
        supsetneq: "⊋",
        supsetneqq: "⫌",
        supsim: "⫈",
        supsub: "⫔",
        supsup: "⫖",
        swarhk: "⤦",
        swArr: "⇙",
        swarr: "↙",
        swarrow: "↙",
        swnwar: "⤪",
        szlig: "ß",
        Tab: "	",
        target: "⌖",
        Tau: "Τ",
        tau: "τ",
        tbrk: "⎴",
        Tcaron: "Ť",
        tcaron: "ť",
        Tcedil: "Ţ",
        tcedil: "ţ",
        Tcy: "Т",
        tcy: "т",
        tdot: "⃛",
        telrec: "⌕",
        Tfr: "𝔗",
        tfr: "𝔱",
        there4: "∴",
        Therefore: "∴",
        therefore: "∴",
        Theta: "Θ",
        theta: "θ",
        thetasym: "ϑ",
        thetav: "ϑ",
        thickapprox: "≈",
        thicksim: "∼",
        ThickSpace: "  ",
        thinsp: " ",
        ThinSpace: " ",
        thkap: "≈",
        thksim: "∼",
        THORN: "Þ",
        thorn: "þ",
        Tilde: "∼",
        tilde: "˜",
        TildeEqual: "≃",
        TildeFullEqual: "≅",
        TildeTilde: "≈",
        times: "×",
        timesb: "⊠",
        timesbar: "⨱",
        timesd: "⨰",
        tint: "∭",
        toea: "⤨",
        top: "⊤",
        topbot: "⌶",
        topcir: "⫱",
        Topf: "𝕋",
        topf: "𝕥",
        topfork: "⫚",
        tosa: "⤩",
        tprime: "‴",
        TRADE: "™",
        trade: "™",
        triangle: "▵",
        triangledown: "▿",
        triangleleft: "◃",
        trianglelefteq: "⊴",
        triangleq: "≜",
        triangleright: "▹",
        trianglerighteq: "⊵",
        tridot: "◬",
        trie: "≜",
        triminus: "⨺",
        TripleDot: "⃛",
        triplus: "⨹",
        trisb: "⧍",
        tritime: "⨻",
        trpezium: "⏢",
        Tscr: "𝒯",
        tscr: "𝓉",
        TScy: "Ц",
        tscy: "ц",
        TSHcy: "Ћ",
        tshcy: "ћ",
        Tstrok: "Ŧ",
        tstrok: "ŧ",
        twixt: "≬",
        twoheadleftarrow: "↞",
        twoheadrightarrow: "↠",
        Uacute: "Ú",
        uacute: "ú",
        Uarr: "↟",
        uArr: "⇑",
        uarr: "↑",
        Uarrocir: "⥉",
        Ubrcy: "Ў",
        ubrcy: "ў",
        Ubreve: "Ŭ",
        ubreve: "ŭ",
        Ucirc: "Û",
        ucirc: "û",
        Ucy: "У",
        ucy: "у",
        udarr: "⇅",
        Udblac: "Ű",
        udblac: "ű",
        udhar: "⥮",
        ufisht: "⥾",
        Ufr: "𝔘",
        ufr: "𝔲",
        Ugrave: "Ù",
        ugrave: "ù",
        uHar: "⥣",
        uharl: "↿",
        uharr: "↾",
        uhblk: "▀",
        ulcorn: "⌜",
        ulcorner: "⌜",
        ulcrop: "⌏",
        ultri: "◸",
        Umacr: "Ū",
        umacr: "ū",
        uml: "¨",
        UnderBar: "_",
        UnderBrace: "⏟",
        UnderBracket: "⎵",
        UnderParenthesis: "⏝",
        Union: "⋃",
        UnionPlus: "⊎",
        Uogon: "Ų",
        uogon: "ų",
        Uopf: "𝕌",
        uopf: "𝕦",
        UpArrow: "↑",
        Uparrow: "⇑",
        uparrow: "↑",
        UpArrowBar: "⤒",
        UpArrowDownArrow: "⇅",
        UpDownArrow: "↕",
        Updownarrow: "⇕",
        updownarrow: "↕",
        UpEquilibrium: "⥮",
        upharpoonleft: "↿",
        upharpoonright: "↾",
        uplus: "⊎",
        UpperLeftArrow: "↖",
        UpperRightArrow: "↗",
        Upsi: "ϒ",
        upsi: "υ",
        upsih: "ϒ",
        Upsilon: "Υ",
        upsilon: "υ",
        UpTee: "⊥",
        UpTeeArrow: "↥",
        upuparrows: "⇈",
        urcorn: "⌝",
        urcorner: "⌝",
        urcrop: "⌎",
        Uring: "Ů",
        uring: "ů",
        urtri: "◹",
        Uscr: "𝒰",
        uscr: "𝓊",
        utdot: "⋰",
        Utilde: "Ũ",
        utilde: "ũ",
        utri: "▵",
        utrif: "▴",
        uuarr: "⇈",
        Uuml: "Ü",
        uuml: "ü",
        uwangle: "⦧",
        vangrt: "⦜",
        varepsilon: "ϵ",
        varkappa: "ϰ",
        varnothing: "∅",
        varphi: "ϕ",
        varpi: "ϖ",
        varpropto: "∝",
        vArr: "⇕",
        varr: "↕",
        varrho: "ϱ",
        varsigma: "ς",
        varsubsetneq: "⊊︀",
        varsubsetneqq: "⫋︀",
        varsupsetneq: "⊋︀",
        varsupsetneqq: "⫌︀",
        vartheta: "ϑ",
        vartriangleleft: "⊲",
        vartriangleright: "⊳",
        Vbar: "⫫",
        vBar: "⫨",
        vBarv: "⫩",
        Vcy: "В",
        vcy: "в",
        VDash: "⊫",
        Vdash: "⊩",
        vDash: "⊨",
        vdash: "⊢",
        Vdashl: "⫦",
        Vee: "⋁",
        vee: "∨",
        veebar: "⊻",
        veeeq: "≚",
        vellip: "⋮",
        Verbar: "‖",
        verbar: "|",
        Vert: "‖",
        vert: "|",
        VerticalBar: "∣",
        VerticalLine: "|",
        VerticalSeparator: "❘",
        VerticalTilde: "≀",
        VeryThinSpace: " ",
        Vfr: "𝔙",
        vfr: "𝔳",
        vltri: "⊲",
        vnsub: "⊂⃒",
        vnsup: "⊃⃒",
        Vopf: "𝕍",
        vopf: "𝕧",
        vprop: "∝",
        vrtri: "⊳",
        Vscr: "𝒱",
        vscr: "𝓋",
        vsubnE: "⫋︀",
        vsubne: "⊊︀",
        vsupnE: "⫌︀",
        vsupne: "⊋︀",
        Vvdash: "⊪",
        vzigzag: "⦚",
        Wcirc: "Ŵ",
        wcirc: "ŵ",
        wedbar: "⩟",
        Wedge: "⋀",
        wedge: "∧",
        wedgeq: "≙",
        weierp: "℘",
        Wfr: "𝔚",
        wfr: "𝔴",
        Wopf: "𝕎",
        wopf: "𝕨",
        wp: "℘",
        wr: "≀",
        wreath: "≀",
        Wscr: "𝒲",
        wscr: "𝓌",
        xcap: "⋂",
        xcirc: "◯",
        xcup: "⋃",
        xdtri: "▽",
        Xfr: "𝔛",
        xfr: "𝔵",
        xhArr: "⟺",
        xharr: "⟷",
        Xi: "Ξ",
        xi: "ξ",
        xlArr: "⟸",
        xlarr: "⟵",
        xmap: "⟼",
        xnis: "⋻",
        xodot: "⨀",
        Xopf: "𝕏",
        xopf: "𝕩",
        xoplus: "⨁",
        xotime: "⨂",
        xrArr: "⟹",
        xrarr: "⟶",
        Xscr: "𝒳",
        xscr: "𝓍",
        xsqcup: "⨆",
        xuplus: "⨄",
        xutri: "△",
        xvee: "⋁",
        xwedge: "⋀",
        Yacute: "Ý",
        yacute: "ý",
        YAcy: "Я",
        yacy: "я",
        Ycirc: "Ŷ",
        ycirc: "ŷ",
        Ycy: "Ы",
        ycy: "ы",
        yen: "¥",
        Yfr: "𝔜",
        yfr: "𝔶",
        YIcy: "Ї",
        yicy: "ї",
        Yopf: "𝕐",
        yopf: "𝕪",
        Yscr: "𝒴",
        yscr: "𝓎",
        YUcy: "Ю",
        yucy: "ю",
        Yuml: "Ÿ",
        yuml: "ÿ",
        Zacute: "Ź",
        zacute: "ź",
        Zcaron: "Ž",
        zcaron: "ž",
        Zcy: "З",
        zcy: "з",
        Zdot: "Ż",
        zdot: "ż",
        zeetrf: "ℨ",
        ZeroWidthSpace: "​",
        Zeta: "Ζ",
        zeta: "ζ",
        Zfr: "ℨ",
        zfr: "𝔷",
        ZHcy: "Ж",
        zhcy: "ж",
        zigrarr: "⇝",
        Zopf: "ℤ",
        zopf: "𝕫",
        Zscr: "𝒵",
        zscr: "𝓏",
        zwj: "‍",
        zwnj: "‌"
      });
      exports.entityMap = exports.HTML_ENTITIES;
    })(entities);
    return entities;
  }
  var sax = {};
  var hasRequiredSax;
  function requireSax() {
    if (hasRequiredSax) return sax;
    hasRequiredSax = 1;
    var conventions2 = requireConventions();
    var g = requireGrammar();
    var errors2 = requireErrors();
    var isHTMLEscapableRawTextElement = conventions2.isHTMLEscapableRawTextElement;
    var isHTMLMimeType = conventions2.isHTMLMimeType;
    var isHTMLRawTextElement = conventions2.isHTMLRawTextElement;
    var hasOwn = conventions2.hasOwn;
    var NAMESPACE = conventions2.NAMESPACE;
    var ParseError = errors2.ParseError;
    var DOMException = errors2.DOMException;
    var S_TAG = 0;
    var S_ATTR = 1;
    var S_ATTR_SPACE = 2;
    var S_EQ = 3;
    var S_ATTR_NOQUOT_VALUE = 4;
    var S_ATTR_END = 5;
    var S_TAG_SPACE = 6;
    var S_TAG_CLOSE = 7;
    function XMLReader() {
    }
    XMLReader.prototype = {
      parse: function(source, defaultNSMap, entityMap) {
        var domBuilder = this.domBuilder;
        domBuilder.startDocument();
        _copy(defaultNSMap, defaultNSMap = /* @__PURE__ */ Object.create(null));
        parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
        domBuilder.endDocument();
      }
    };
    var ENTITY_REG = /&#?\w+;?/g;
    function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
      var isHTML = isHTMLMimeType(domBuilder.mimeType);
      if (source.indexOf(g.UNICODE_REPLACEMENT_CHARACTER) >= 0) {
        errorHandler.warning("Unicode replacement character detected, source encoding issues?");
      }
      function fixedFromCharCode(code) {
        if (code > 65535) {
          code -= 65536;
          var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
          return String.fromCharCode(surrogate1, surrogate2);
        } else {
          return String.fromCharCode(code);
        }
      }
      function entityReplacer(a3) {
        var complete = a3[a3.length - 1] === ";" ? a3 : a3 + ";";
        if (!isHTML && complete !== a3) {
          errorHandler.error("EntityRef: expecting ;");
          return a3;
        }
        var match = g.Reference.exec(complete);
        if (!match || match[0].length !== complete.length) {
          errorHandler.error("entity not matching Reference production: " + a3);
          return a3;
        }
        var k = complete.slice(1, -1);
        if (hasOwn(entityMap, k)) {
          return entityMap[k];
        } else if (k.charAt(0) === "#") {
          return fixedFromCharCode(parseInt(k.substr(1).replace("x", "0x")));
        } else {
          errorHandler.error("entity not found:" + a3);
          return a3;
        }
      }
      function appendText(end2) {
        if (end2 > start) {
          var xt = source.substring(start, end2).replace(ENTITY_REG, entityReplacer);
          locator && position(start);
          domBuilder.characters(xt, 0, end2 - start);
          start = end2;
        }
      }
      function position(p2, m2) {
        while (p2 >= lineEnd && (m2 = linePattern.exec(source))) {
          lineStart = m2.index;
          lineEnd = lineStart + m2[0].length;
          locator.lineNumber++;
        }
        locator.columnNumber = p2 - lineStart + 1;
      }
      var lineStart = 0;
      var lineEnd = 0;
      var linePattern = /.*(?:\r\n?|\n)|.*$/g;
      var locator = domBuilder.locator;
      var parseStack = [{ currentNSMap: defaultNSMapCopy }];
      var unclosedTags = [];
      var start = 0;
      while (true) {
        try {
          var tagStart = source.indexOf("<", start);
          if (tagStart < 0) {
            if (!isHTML && unclosedTags.length > 0) {
              return errorHandler.fatalError("unclosed xml tag(s): " + unclosedTags.join(", "));
            }
            if (!source.substring(start).match(/^\s*$/)) {
              var doc = domBuilder.doc;
              var text = doc.createTextNode(source.substr(start));
              if (doc.documentElement) {
                return errorHandler.error("Extra content at the end of the document");
              }
              doc.appendChild(text);
              domBuilder.currentElement = text;
            }
            return;
          }
          if (tagStart > start) {
            var fromSource = source.substring(start, tagStart);
            if (!isHTML && unclosedTags.length === 0) {
              fromSource = fromSource.replace(new RegExp(g.S_OPT.source, "g"), "");
              fromSource && errorHandler.error("Unexpected content outside root element: '" + fromSource + "'");
            }
            appendText(tagStart);
          }
          switch (source.charAt(tagStart + 1)) {
            case "/":
              var end = source.indexOf(">", tagStart + 2);
              var tagNameRaw = source.substring(tagStart + 2, end > 0 ? end : void 0);
              if (!tagNameRaw) {
                return errorHandler.fatalError("end tag name missing");
              }
              var tagNameMatch = end > 0 && g.reg("^", g.QName_group, g.S_OPT, "$").exec(tagNameRaw);
              if (!tagNameMatch) {
                return errorHandler.fatalError('end tag name contains invalid characters: "' + tagNameRaw + '"');
              }
              if (!domBuilder.currentElement && !domBuilder.doc.documentElement) {
                return;
              }
              var currentTagName = unclosedTags[unclosedTags.length - 1] || domBuilder.currentElement.tagName || domBuilder.doc.documentElement.tagName || "";
              if (currentTagName !== tagNameMatch[1]) {
                var tagNameLower = tagNameMatch[1].toLowerCase();
                if (!isHTML || currentTagName.toLowerCase() !== tagNameLower) {
                  return errorHandler.fatalError('Opening and ending tag mismatch: "' + currentTagName + '" != "' + tagNameRaw + '"');
                }
              }
              var config = parseStack.pop();
              unclosedTags.pop();
              var localNSMap = config.localNSMap;
              domBuilder.endElement(config.uri, config.localName, currentTagName);
              if (localNSMap) {
                for (var prefix in localNSMap) {
                  if (hasOwn(localNSMap, prefix)) {
                    domBuilder.endPrefixMapping(prefix);
                  }
                }
              }
              end++;
              break;
            // end element
            case "?":
              locator && position(tagStart);
              end = parseProcessingInstruction(source, tagStart, domBuilder, errorHandler);
              break;
            case "!":
              locator && position(tagStart);
              end = parseDoctypeCommentOrCData(source, tagStart, domBuilder, errorHandler, isHTML);
              break;
            default:
              locator && position(tagStart);
              var el = new ElementAttributes();
              var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
              var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler, isHTML);
              var len = el.length;
              if (!el.closed) {
                if (isHTML && conventions2.isHTMLVoidElement(el.tagName)) {
                  el.closed = true;
                } else {
                  unclosedTags.push(el.tagName);
                }
              }
              if (locator && len) {
                var locator2 = copyLocator(locator, {});
                for (var i2 = 0; i2 < len; i2++) {
                  var a2 = el[i2];
                  position(a2.offset);
                  a2.locator = copyLocator(locator, {});
                }
                domBuilder.locator = locator2;
                if (appendElement(el, domBuilder, currentNSMap)) {
                  parseStack.push(el);
                }
                domBuilder.locator = locator;
              } else {
                if (appendElement(el, domBuilder, currentNSMap)) {
                  parseStack.push(el);
                }
              }
              if (isHTML && !el.closed) {
                end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
              } else {
                end++;
              }
          }
        } catch (e2) {
          if (e2 instanceof ParseError) {
            throw e2;
          } else if (e2 instanceof DOMException) {
            throw new ParseError(e2.name + ": " + e2.message, domBuilder.locator, e2);
          }
          errorHandler.error("element parse error: " + e2);
          end = -1;
        }
        if (end > start) {
          start = end;
        } else {
          appendText(Math.max(tagStart, start) + 1);
        }
      }
    }
    function copyLocator(f2, t2) {
      t2.lineNumber = f2.lineNumber;
      t2.columnNumber = f2.columnNumber;
      return t2;
    }
    function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler, isHTML) {
      function addAttribute(qname, value2, startIndex) {
        if (hasOwn(el.attributeNames, qname)) {
          return errorHandler.fatalError("Attribute " + qname + " redefined");
        }
        if (!isHTML && value2.indexOf("<") >= 0) {
          return errorHandler.fatalError("Unescaped '<' not allowed in attributes values");
        }
        el.addValue(
          qname,
          // @see https://www.w3.org/TR/xml/#AVNormalize
          // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
          // - recursive replacement of (DTD) entity references
          // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
          value2.replace(/[\t\n\r]/g, " ").replace(ENTITY_REG, entityReplacer),
          startIndex
        );
      }
      var attrName;
      var value;
      var p2 = ++start;
      var s2 = S_TAG;
      while (true) {
        var c2 = source.charAt(p2);
        switch (c2) {
          case "=":
            if (s2 === S_ATTR) {
              attrName = source.slice(start, p2);
              s2 = S_EQ;
            } else if (s2 === S_ATTR_SPACE) {
              s2 = S_EQ;
            } else {
              throw new Error("attribute equal must after attrName");
            }
            break;
          case "'":
          case '"':
            if (s2 === S_EQ || s2 === S_ATTR) {
              if (s2 === S_ATTR) {
                errorHandler.warning('attribute value must after "="');
                attrName = source.slice(start, p2);
              }
              start = p2 + 1;
              p2 = source.indexOf(c2, start);
              if (p2 > 0) {
                value = source.slice(start, p2);
                addAttribute(attrName, value, start - 1);
                s2 = S_ATTR_END;
              } else {
                throw new Error("attribute value no end '" + c2 + "' match");
              }
            } else if (s2 == S_ATTR_NOQUOT_VALUE) {
              value = source.slice(start, p2);
              addAttribute(attrName, value, start);
              errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c2 + ")!!");
              start = p2 + 1;
              s2 = S_ATTR_END;
            } else {
              throw new Error('attribute value must after "="');
            }
            break;
          case "/":
            switch (s2) {
              case S_TAG:
                el.setTagName(source.slice(start, p2));
              case S_ATTR_END:
              case S_TAG_SPACE:
              case S_TAG_CLOSE:
                s2 = S_TAG_CLOSE;
                el.closed = true;
              case S_ATTR_NOQUOT_VALUE:
              case S_ATTR:
                break;
              case S_ATTR_SPACE:
                el.closed = true;
                break;
              //case S_EQ:
              default:
                throw new Error("attribute invalid close char('/')");
            }
            break;
          case "":
            errorHandler.error("unexpected end of input");
            if (s2 == S_TAG) {
              el.setTagName(source.slice(start, p2));
            }
            return p2;
          case ">":
            switch (s2) {
              case S_TAG:
                el.setTagName(source.slice(start, p2));
              case S_ATTR_END:
              case S_TAG_SPACE:
              case S_TAG_CLOSE:
                break;
              //normal
              case S_ATTR_NOQUOT_VALUE:
              //Compatible state
              case S_ATTR:
                value = source.slice(start, p2);
                if (value.slice(-1) === "/") {
                  el.closed = true;
                  value = value.slice(0, -1);
                }
              case S_ATTR_SPACE:
                if (s2 === S_ATTR_SPACE) {
                  value = attrName;
                }
                if (s2 == S_ATTR_NOQUOT_VALUE) {
                  errorHandler.warning('attribute "' + value + '" missed quot(")!');
                  addAttribute(attrName, value, start);
                } else {
                  if (!isHTML) {
                    errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                  }
                  addAttribute(value, value, start);
                }
                break;
              case S_EQ:
                if (!isHTML) {
                  return errorHandler.fatalError(`AttValue: ' or " expected`);
                }
            }
            return p2;
          /*xml space '\x20' | #x9 | #xD | #xA; */
          case "":
            c2 = " ";
          default:
            if (c2 <= " ") {
              switch (s2) {
                case S_TAG:
                  el.setTagName(source.slice(start, p2));
                  s2 = S_TAG_SPACE;
                  break;
                case S_ATTR:
                  attrName = source.slice(start, p2);
                  s2 = S_ATTR_SPACE;
                  break;
                case S_ATTR_NOQUOT_VALUE:
                  var value = source.slice(start, p2);
                  errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                  addAttribute(attrName, value, start);
                case S_ATTR_END:
                  s2 = S_TAG_SPACE;
                  break;
              }
            } else {
              switch (s2) {
                //case S_TAG:void();break;
                //case S_ATTR:void();break;
                //case S_ATTR_NOQUOT_VALUE:void();break;
                case S_ATTR_SPACE:
                  if (!isHTML) {
                    errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                  }
                  addAttribute(attrName, attrName, start);
                  start = p2;
                  s2 = S_ATTR;
                  break;
                case S_ATTR_END:
                  errorHandler.warning('attribute space is required"' + attrName + '"!!');
                case S_TAG_SPACE:
                  s2 = S_ATTR;
                  start = p2;
                  break;
                case S_EQ:
                  s2 = S_ATTR_NOQUOT_VALUE;
                  start = p2;
                  break;
                case S_TAG_CLOSE:
                  throw new Error("elements closed character '/' and '>' must be connected to");
              }
            }
        }
        p2++;
      }
    }
    function appendElement(el, domBuilder, currentNSMap) {
      var tagName = el.tagName;
      var localNSMap = null;
      var i2 = el.length;
      while (i2--) {
        var a2 = el[i2];
        var qName = a2.qName;
        var value = a2.value;
        var nsp = qName.indexOf(":");
        if (nsp > 0) {
          var prefix = a2.prefix = qName.slice(0, nsp);
          var localName = qName.slice(nsp + 1);
          var nsPrefix = prefix === "xmlns" && localName;
        } else {
          localName = qName;
          prefix = null;
          nsPrefix = qName === "xmlns" && "";
        }
        a2.localName = localName;
        if (nsPrefix !== false) {
          if (localNSMap == null) {
            localNSMap = /* @__PURE__ */ Object.create(null);
            _copy(currentNSMap, currentNSMap = /* @__PURE__ */ Object.create(null));
          }
          currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
          a2.uri = NAMESPACE.XMLNS;
          domBuilder.startPrefixMapping(nsPrefix, value);
        }
      }
      var i2 = el.length;
      while (i2--) {
        a2 = el[i2];
        if (a2.prefix) {
          if (a2.prefix === "xml") {
            a2.uri = NAMESPACE.XML;
          }
          if (a2.prefix !== "xmlns") {
            a2.uri = currentNSMap[a2.prefix];
          }
        }
      }
      var nsp = tagName.indexOf(":");
      if (nsp > 0) {
        prefix = el.prefix = tagName.slice(0, nsp);
        localName = el.localName = tagName.slice(nsp + 1);
      } else {
        prefix = null;
        localName = el.localName = tagName;
      }
      var ns = el.uri = currentNSMap[prefix || ""];
      domBuilder.startElement(ns, localName, tagName, el);
      if (el.closed) {
        domBuilder.endElement(ns, localName, tagName);
        if (localNSMap) {
          for (prefix in localNSMap) {
            if (hasOwn(localNSMap, prefix)) {
              domBuilder.endPrefixMapping(prefix);
            }
          }
        }
      } else {
        el.currentNSMap = currentNSMap;
        el.localNSMap = localNSMap;
        return true;
      }
    }
    function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
      var isEscapableRaw = isHTMLEscapableRawTextElement(tagName);
      if (isEscapableRaw || isHTMLRawTextElement(tagName)) {
        var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd);
        var text = source.substring(elStartEnd + 1, elEndStart);
        if (isEscapableRaw) {
          text = text.replace(ENTITY_REG, entityReplacer);
        }
        domBuilder.characters(text, 0, text.length);
        return elEndStart;
      }
      return elStartEnd + 1;
    }
    function _copy(source, target) {
      for (var n2 in source) {
        if (hasOwn(source, n2)) {
          target[n2] = source[n2];
        }
      }
    }
    function parseUtils(source, start) {
      var index2 = start;
      function char(n2) {
        n2 = n2 || 0;
        return source.charAt(index2 + n2);
      }
      function skip(n2) {
        n2 = n2 || 1;
        index2 += n2;
      }
      function skipBlanks() {
        var blanks = 0;
        while (index2 < source.length) {
          var c2 = char();
          if (c2 !== " " && c2 !== "\n" && c2 !== "	" && c2 !== "\r") {
            return blanks;
          }
          blanks++;
          skip();
        }
        return -1;
      }
      function substringFromIndex() {
        return source.substring(index2);
      }
      function substringStartsWith(text) {
        return source.substring(index2, index2 + text.length) === text;
      }
      function substringStartsWithCaseInsensitive(text) {
        return source.substring(index2, index2 + text.length).toUpperCase() === text.toUpperCase();
      }
      function getMatch(args) {
        var expr = g.reg("^", args);
        var match = expr.exec(substringFromIndex());
        if (match) {
          skip(match[0].length);
          return match[0];
        }
        return null;
      }
      return {
        char,
        getIndex: function() {
          return index2;
        },
        getMatch,
        getSource: function() {
          return source;
        },
        skip,
        skipBlanks,
        substringFromIndex,
        substringStartsWith,
        substringStartsWithCaseInsensitive
      };
    }
    function parseDoctypeInternalSubset(p2, errorHandler) {
      function parsePI(p3, errorHandler2) {
        var match = g.PI.exec(p3.substringFromIndex());
        if (!match) {
          return errorHandler2.fatalError("processing instruction is not well-formed at position " + p3.getIndex());
        }
        if (match[1].toLowerCase() === "xml") {
          return errorHandler2.fatalError(
            "xml declaration is only allowed at the start of the document, but found at position " + p3.getIndex()
          );
        }
        p3.skip(match[0].length);
        return match[0];
      }
      var source = p2.getSource();
      if (p2.char() === "[") {
        p2.skip(1);
        var intSubsetStart = p2.getIndex();
        while (p2.getIndex() < source.length) {
          p2.skipBlanks();
          if (p2.char() === "]") {
            var internalSubset = source.substring(intSubsetStart, p2.getIndex());
            p2.skip(1);
            return internalSubset;
          }
          var current = null;
          if (p2.char() === "<" && p2.char(1) === "!") {
            switch (p2.char(2)) {
              case "E":
                if (p2.char(3) === "L") {
                  current = p2.getMatch(g.elementdecl);
                } else if (p2.char(3) === "N") {
                  current = p2.getMatch(g.EntityDecl);
                }
                break;
              case "A":
                current = p2.getMatch(g.AttlistDecl);
                break;
              case "N":
                current = p2.getMatch(g.NotationDecl);
                break;
              case "-":
                current = p2.getMatch(g.Comment);
                break;
            }
          } else if (p2.char() === "<" && p2.char(1) === "?") {
            current = parsePI(p2, errorHandler);
          } else if (p2.char() === "%") {
            current = p2.getMatch(g.PEReference);
          } else {
            return errorHandler.fatalError("Error detected in Markup declaration");
          }
          if (!current) {
            return errorHandler.fatalError("Error in internal subset at position " + p2.getIndex());
          }
        }
        return errorHandler.fatalError("doctype internal subset is not well-formed, missing ]");
      }
    }
    function parseDoctypeCommentOrCData(source, start, domBuilder, errorHandler, isHTML) {
      var p2 = parseUtils(source, start);
      switch (isHTML ? p2.char(2).toUpperCase() : p2.char(2)) {
        case "-":
          var comment = p2.getMatch(g.Comment);
          if (comment) {
            domBuilder.comment(comment, g.COMMENT_START.length, comment.length - g.COMMENT_START.length - g.COMMENT_END.length);
            return p2.getIndex();
          } else {
            return errorHandler.fatalError("comment is not well-formed at position " + p2.getIndex());
          }
        case "[":
          var cdata = p2.getMatch(g.CDSect);
          if (cdata) {
            if (!isHTML && !domBuilder.currentElement) {
              return errorHandler.fatalError("CDATA outside of element");
            }
            domBuilder.startCDATA();
            domBuilder.characters(cdata, g.CDATA_START.length, cdata.length - g.CDATA_START.length - g.CDATA_END.length);
            domBuilder.endCDATA();
            return p2.getIndex();
          } else {
            return errorHandler.fatalError("Invalid CDATA starting at position " + start);
          }
        case "D": {
          if (domBuilder.doc && domBuilder.doc.documentElement) {
            return errorHandler.fatalError("Doctype not allowed inside or after documentElement at position " + p2.getIndex());
          }
          if (isHTML ? !p2.substringStartsWithCaseInsensitive(g.DOCTYPE_DECL_START) : !p2.substringStartsWith(g.DOCTYPE_DECL_START)) {
            return errorHandler.fatalError("Expected " + g.DOCTYPE_DECL_START + " at position " + p2.getIndex());
          }
          p2.skip(g.DOCTYPE_DECL_START.length);
          if (p2.skipBlanks() < 1) {
            return errorHandler.fatalError("Expected whitespace after " + g.DOCTYPE_DECL_START + " at position " + p2.getIndex());
          }
          var doctype = {
            name: void 0,
            publicId: void 0,
            systemId: void 0,
            internalSubset: void 0
          };
          doctype.name = p2.getMatch(g.Name);
          if (!doctype.name)
            return errorHandler.fatalError("doctype name missing or contains unexpected characters at position " + p2.getIndex());
          if (isHTML && doctype.name.toLowerCase() !== "html") {
            errorHandler.warning("Unexpected DOCTYPE in HTML document at position " + p2.getIndex());
          }
          p2.skipBlanks();
          if (p2.substringStartsWith(g.PUBLIC) || p2.substringStartsWith(g.SYSTEM)) {
            var match = g.ExternalID_match.exec(p2.substringFromIndex());
            if (!match) {
              return errorHandler.fatalError("doctype external id is not well-formed at position " + p2.getIndex());
            }
            if (match.groups.SystemLiteralOnly !== void 0) {
              doctype.systemId = match.groups.SystemLiteralOnly;
            } else {
              doctype.systemId = match.groups.SystemLiteral;
              doctype.publicId = match.groups.PubidLiteral;
            }
            p2.skip(match[0].length);
          } else if (isHTML && p2.substringStartsWithCaseInsensitive(g.SYSTEM)) {
            p2.skip(g.SYSTEM.length);
            if (p2.skipBlanks() < 1) {
              return errorHandler.fatalError("Expected whitespace after " + g.SYSTEM + " at position " + p2.getIndex());
            }
            doctype.systemId = p2.getMatch(g.ABOUT_LEGACY_COMPAT_SystemLiteral);
            if (!doctype.systemId) {
              return errorHandler.fatalError(
                "Expected " + g.ABOUT_LEGACY_COMPAT + " in single or double quotes after " + g.SYSTEM + " at position " + p2.getIndex()
              );
            }
          }
          if (isHTML && doctype.systemId && !g.ABOUT_LEGACY_COMPAT_SystemLiteral.test(doctype.systemId)) {
            errorHandler.warning("Unexpected doctype.systemId in HTML document at position " + p2.getIndex());
          }
          if (!isHTML) {
            p2.skipBlanks();
            doctype.internalSubset = parseDoctypeInternalSubset(p2, errorHandler);
          }
          p2.skipBlanks();
          if (p2.char() !== ">") {
            return errorHandler.fatalError("doctype not terminated with > at position " + p2.getIndex());
          }
          p2.skip(1);
          domBuilder.startDTD(doctype.name, doctype.publicId, doctype.systemId, doctype.internalSubset);
          domBuilder.endDTD();
          return p2.getIndex();
        }
        default:
          return errorHandler.fatalError('Not well-formed XML starting with "<!" at position ' + start);
      }
    }
    function parseProcessingInstruction(source, start, domBuilder, errorHandler) {
      var match = source.substring(start).match(g.PI);
      if (!match) {
        return errorHandler.fatalError("Invalid processing instruction starting at position " + start);
      }
      if (match[1].toLowerCase() === "xml") {
        if (start > 0) {
          return errorHandler.fatalError(
            "processing instruction at position " + start + " is an xml declaration which is only at the start of the document"
          );
        }
        if (!g.XMLDecl.test(source.substring(start))) {
          return errorHandler.fatalError("xml declaration is not well-formed");
        }
      }
      domBuilder.processingInstruction(match[1], match[2]);
      return start + match[0].length;
    }
    function ElementAttributes() {
      this.attributeNames = /* @__PURE__ */ Object.create(null);
    }
    ElementAttributes.prototype = {
      setTagName: function(tagName) {
        if (!g.QName_exact.test(tagName)) {
          throw new Error("invalid tagName:" + tagName);
        }
        this.tagName = tagName;
      },
      addValue: function(qName, value, offset) {
        if (!g.QName_exact.test(qName)) {
          throw new Error("invalid attribute:" + qName);
        }
        this.attributeNames[qName] = this.length;
        this[this.length++] = { qName, value, offset };
      },
      length: 0,
      getLocalName: function(i2) {
        return this[i2].localName;
      },
      getLocator: function(i2) {
        return this[i2].locator;
      },
      getQName: function(i2) {
        return this[i2].qName;
      },
      getURI: function(i2) {
        return this[i2].uri;
      },
      getValue: function(i2) {
        return this[i2].value;
      }
      //	,getIndex:function(uri, localName)){
      //		if(localName){
      //
      //		}else{
      //			var qName = uri
      //		}
      //	},
      //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
      //	getType:function(uri,localName){}
      //	getType:function(i){},
    };
    sax.XMLReader = XMLReader;
    sax.parseUtils = parseUtils;
    sax.parseDoctypeCommentOrCData = parseDoctypeCommentOrCData;
    return sax;
  }
  var hasRequiredDomParser;
  function requireDomParser() {
    if (hasRequiredDomParser) return domParser;
    hasRequiredDomParser = 1;
    var conventions2 = requireConventions();
    var dom2 = requireDom();
    var errors2 = requireErrors();
    var entities2 = requireEntities();
    var sax2 = requireSax();
    var DOMImplementation = dom2.DOMImplementation;
    var hasDefaultHTMLNamespace = conventions2.hasDefaultHTMLNamespace;
    var isHTMLMimeType = conventions2.isHTMLMimeType;
    var isValidMimeType = conventions2.isValidMimeType;
    var MIME_TYPE = conventions2.MIME_TYPE;
    var NAMESPACE = conventions2.NAMESPACE;
    var ParseError = errors2.ParseError;
    var XMLReader = sax2.XMLReader;
    function normalizeLineEndings(input) {
      return input.replace(/\r[\n\u0085]/g, "\n").replace(/[\r\u0085\u2028]/g, "\n");
    }
    function DOMParser2(options) {
      options = options || {};
      if (options.locator === void 0) {
        options.locator = true;
      }
      this.assign = options.assign || conventions2.assign;
      this.domHandler = options.domHandler || DOMHandler;
      this.onError = options.onError || options.errorHandler;
      if (options.errorHandler && typeof options.errorHandler !== "function") {
        throw new TypeError("errorHandler object is no longer supported, switch to onError!");
      } else if (options.errorHandler) {
        options.errorHandler("warning", "The `errorHandler` option has been deprecated, use `onError` instead!", this);
      }
      this.normalizeLineEndings = options.normalizeLineEndings || normalizeLineEndings;
      this.locator = !!options.locator;
      this.xmlns = this.assign(/* @__PURE__ */ Object.create(null), options.xmlns);
    }
    DOMParser2.prototype.parseFromString = function(source, mimeType) {
      if (!isValidMimeType(mimeType)) {
        throw new TypeError('DOMParser.parseFromString: the provided mimeType "' + mimeType + '" is not valid.');
      }
      var defaultNSMap = this.assign(/* @__PURE__ */ Object.create(null), this.xmlns);
      var entityMap = entities2.XML_ENTITIES;
      var defaultNamespace = defaultNSMap[""] || null;
      if (hasDefaultHTMLNamespace(mimeType)) {
        entityMap = entities2.HTML_ENTITIES;
        defaultNamespace = NAMESPACE.HTML;
      } else if (mimeType === MIME_TYPE.XML_SVG_IMAGE) {
        defaultNamespace = NAMESPACE.SVG;
      }
      defaultNSMap[""] = defaultNamespace;
      defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
      var domBuilder = new this.domHandler({
        mimeType,
        defaultNamespace,
        onError: this.onError
      });
      var locator = this.locator ? {} : void 0;
      if (this.locator) {
        domBuilder.setDocumentLocator(locator);
      }
      var sax3 = new XMLReader();
      sax3.errorHandler = domBuilder;
      sax3.domBuilder = domBuilder;
      var isXml = !conventions2.isHTMLMimeType(mimeType);
      if (isXml && typeof source !== "string") {
        sax3.errorHandler.fatalError("source is not a string");
      }
      sax3.parse(this.normalizeLineEndings(String(source)), defaultNSMap, entityMap);
      if (!domBuilder.doc.documentElement) {
        sax3.errorHandler.fatalError("missing root element");
      }
      return domBuilder.doc;
    };
    function DOMHandler(options) {
      var opt = options || {};
      this.mimeType = opt.mimeType || MIME_TYPE.XML_APPLICATION;
      this.defaultNamespace = opt.defaultNamespace || null;
      this.cdata = false;
      this.currentElement = void 0;
      this.doc = void 0;
      this.locator = void 0;
      this.onError = opt.onError;
    }
    function position(locator, node2) {
      node2.lineNumber = locator.lineNumber;
      node2.columnNumber = locator.columnNumber;
    }
    DOMHandler.prototype = {
      /**
       * Either creates an XML or an HTML document and stores it under `this.doc`.
       * If it is an XML document, `this.defaultNamespace` is used to create it,
       * and it will not contain any `childNodes`.
       * If it is an HTML document, it will be created without any `childNodes`.
       *
       * @see http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
       */
      startDocument: function() {
        var impl = new DOMImplementation();
        this.doc = isHTMLMimeType(this.mimeType) ? impl.createHTMLDocument(false) : impl.createDocument(this.defaultNamespace, "");
      },
      startElement: function(namespaceURI, localName, qName, attrs) {
        var doc = this.doc;
        var el = doc.createElementNS(namespaceURI, qName || localName);
        var len = attrs.length;
        appendElement(this, el);
        this.currentElement = el;
        this.locator && position(this.locator, el);
        for (var i2 = 0; i2 < len; i2++) {
          var namespaceURI = attrs.getURI(i2);
          var value = attrs.getValue(i2);
          var qName = attrs.getQName(i2);
          var attr = doc.createAttributeNS(namespaceURI, qName);
          this.locator && position(attrs.getLocator(i2), attr);
          attr.value = attr.nodeValue = value;
          el.setAttributeNode(attr);
        }
      },
      endElement: function(namespaceURI, localName, qName) {
        this.currentElement = this.currentElement.parentNode;
      },
      startPrefixMapping: function(prefix, uri) {
      },
      endPrefixMapping: function(prefix) {
      },
      processingInstruction: function(target, data) {
        var ins = this.doc.createProcessingInstruction(target, data);
        this.locator && position(this.locator, ins);
        appendElement(this, ins);
      },
      ignorableWhitespace: function(ch, start, length) {
      },
      characters: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        if (chars) {
          if (this.cdata) {
            var charNode = this.doc.createCDATASection(chars);
          } else {
            var charNode = this.doc.createTextNode(chars);
          }
          if (this.currentElement) {
            this.currentElement.appendChild(charNode);
          } else if (/^\s*$/.test(chars)) {
            this.doc.appendChild(charNode);
          }
          this.locator && position(this.locator, charNode);
        }
      },
      skippedEntity: function(name) {
      },
      endDocument: function() {
        this.doc.normalize();
      },
      /**
       * Stores the locator to be able to set the `columnNumber` and `lineNumber`
       * on the created DOM nodes.
       *
       * @param {Locator} locator
       */
      setDocumentLocator: function(locator) {
        if (locator) {
          locator.lineNumber = 0;
        }
        this.locator = locator;
      },
      //LexicalHandler
      comment: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        var comm = this.doc.createComment(chars);
        this.locator && position(this.locator, comm);
        appendElement(this, comm);
      },
      startCDATA: function() {
        this.cdata = true;
      },
      endCDATA: function() {
        this.cdata = false;
      },
      startDTD: function(name, publicId, systemId, internalSubset) {
        var impl = this.doc.implementation;
        if (impl && impl.createDocumentType) {
          var dt = impl.createDocumentType(name, publicId, systemId, internalSubset);
          this.locator && position(this.locator, dt);
          appendElement(this, dt);
          this.doc.doctype = dt;
        }
      },
      reportError: function(level, message) {
        if (typeof this.onError === "function") {
          try {
            this.onError(level, message, this);
          } catch (e2) {
            throw new ParseError("Reporting " + level + ' "' + message + '" caused ' + e2, this.locator);
          }
        } else {
          console.error("[xmldom " + level + "]	" + message, _locator(this.locator));
        }
      },
      /**
       * @see http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
       */
      warning: function(message) {
        this.reportError("warning", message);
      },
      error: function(message) {
        this.reportError("error", message);
      },
      /**
       * This function reports a fatal error and throws a ParseError.
       *
       * @param {string} message
       * - The message to be used for reporting and throwing the error.
       * @returns {never}
       * This function always throws an error and never returns a value.
       * @throws {ParseError}
       * Always throws a ParseError with the provided message.
       */
      fatalError: function(message) {
        this.reportError("fatalError", message);
        throw new ParseError(message, this.locator);
      }
    };
    function _locator(l2) {
      if (l2) {
        return "\n@#[line:" + l2.lineNumber + ",col:" + l2.columnNumber + "]";
      }
    }
    function _toString(chars, start, length) {
      if (typeof chars == "string") {
        return chars.substr(start, length);
      } else {
        if (chars.length >= start + length || start) {
          return new java.lang.String(chars, start, length) + "";
        }
        return chars;
      }
    }
    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
      /\w+/g,
      function(key) {
        DOMHandler.prototype[key] = function() {
          return null;
        };
      }
    );
    function appendElement(handler, node2) {
      if (!handler.currentElement) {
        handler.doc.appendChild(node2);
      } else {
        handler.currentElement.appendChild(node2);
      }
    }
    function onErrorStopParsing(level) {
      if (level === "error") throw "onErrorStopParsing";
    }
    function onWarningStopParsing() {
      throw "onWarningStopParsing";
    }
    domParser.__DOMHandler = DOMHandler;
    domParser.DOMParser = DOMParser2;
    domParser.normalizeLineEndings = normalizeLineEndings;
    domParser.onErrorStopParsing = onErrorStopParsing;
    domParser.onWarningStopParsing = onWarningStopParsing;
    return domParser;
  }
  var hasRequiredLib;
  function requireLib() {
    if (hasRequiredLib) return lib;
    hasRequiredLib = 1;
    var conventions2 = requireConventions();
    lib.assign = conventions2.assign;
    lib.hasDefaultHTMLNamespace = conventions2.hasDefaultHTMLNamespace;
    lib.isHTMLMimeType = conventions2.isHTMLMimeType;
    lib.isValidMimeType = conventions2.isValidMimeType;
    lib.MIME_TYPE = conventions2.MIME_TYPE;
    lib.NAMESPACE = conventions2.NAMESPACE;
    var errors2 = requireErrors();
    lib.DOMException = errors2.DOMException;
    lib.DOMExceptionName = errors2.DOMExceptionName;
    lib.ExceptionCode = errors2.ExceptionCode;
    lib.ParseError = errors2.ParseError;
    var dom2 = requireDom();
    lib.Attr = dom2.Attr;
    lib.CDATASection = dom2.CDATASection;
    lib.CharacterData = dom2.CharacterData;
    lib.Comment = dom2.Comment;
    lib.Document = dom2.Document;
    lib.DocumentFragment = dom2.DocumentFragment;
    lib.DocumentType = dom2.DocumentType;
    lib.DOMImplementation = dom2.DOMImplementation;
    lib.Element = dom2.Element;
    lib.Entity = dom2.Entity;
    lib.EntityReference = dom2.EntityReference;
    lib.LiveNodeList = dom2.LiveNodeList;
    lib.NamedNodeMap = dom2.NamedNodeMap;
    lib.Node = dom2.Node;
    lib.NodeList = dom2.NodeList;
    lib.Notation = dom2.Notation;
    lib.ProcessingInstruction = dom2.ProcessingInstruction;
    lib.Text = dom2.Text;
    lib.XMLSerializer = dom2.XMLSerializer;
    var domParser2 = requireDomParser();
    lib.DOMParser = domParser2.DOMParser;
    lib.onErrorStopParsing = domParser2.onErrorStopParsing;
    lib.onWarningStopParsing = domParser2.onWarningStopParsing;
    return lib;
  }
  var libExports = requireLib();
  var raf = { exports: {} };
  var performanceNow$1 = { exports: {} };
  var performanceNow = performanceNow$1.exports;
  var hasRequiredPerformanceNow;
  function requirePerformanceNow() {
    if (hasRequiredPerformanceNow) return performanceNow$1.exports;
    hasRequiredPerformanceNow = 1;
    (function() {
      var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;
      if (typeof performance !== "undefined" && performance !== null && performance.now) {
        performanceNow$1.exports = function() {
          return performance.now();
        };
      } else if (typeof process !== "undefined" && process !== null && process.hrtime) {
        performanceNow$1.exports = function() {
          return (getNanoSeconds() - nodeLoadTime) / 1e6;
        };
        hrtime = process.hrtime;
        getNanoSeconds = function() {
          var hr;
          hr = hrtime();
          return hr[0] * 1e9 + hr[1];
        };
        moduleLoadTime = getNanoSeconds();
        upTime = process.uptime() * 1e9;
        nodeLoadTime = moduleLoadTime - upTime;
      } else if (Date.now) {
        performanceNow$1.exports = function() {
          return Date.now() - loadTime;
        };
        loadTime = Date.now();
      } else {
        performanceNow$1.exports = function() {
          return (/* @__PURE__ */ new Date()).getTime() - loadTime;
        };
        loadTime = (/* @__PURE__ */ new Date()).getTime();
      }
    }).call(performanceNow);
    return performanceNow$1.exports;
  }
  var hasRequiredRaf;
  function requireRaf() {
    if (hasRequiredRaf) return raf.exports;
    hasRequiredRaf = 1;
    var now = requirePerformanceNow(), root = typeof window === "undefined" ? commonjsGlobal : window, vendors = ["moz", "webkit"], suffix = "AnimationFrame", raf$1 = root["request" + suffix], caf = root["cancel" + suffix] || root["cancelRequest" + suffix];
    for (var i2 = 0; !raf$1 && i2 < vendors.length; i2++) {
      raf$1 = root[vendors[i2] + "Request" + suffix];
      caf = root[vendors[i2] + "Cancel" + suffix] || root[vendors[i2] + "CancelRequest" + suffix];
    }
    if (!raf$1 || !caf) {
      var last = 0, id = 0, queue = [], frameDuration = 1e3 / 60;
      raf$1 = function(callback) {
        if (queue.length === 0) {
          var _now = now(), next = Math.max(0, frameDuration - (_now - last));
          last = next + _now;
          setTimeout(function() {
            var cp = queue.slice(0);
            queue.length = 0;
            for (var i3 = 0; i3 < cp.length; i3++) {
              if (!cp[i3].cancelled) {
                try {
                  cp[i3].callback(last);
                } catch (e2) {
                  setTimeout(function() {
                    throw e2;
                  }, 0);
                }
              }
            }
          }, Math.round(next));
        }
        queue.push({
          handle: ++id,
          callback,
          cancelled: false
        });
        return id;
      };
      caf = function(handle) {
        for (var i3 = 0; i3 < queue.length; i3++) {
          if (queue[i3].handle === handle) {
            queue[i3].cancelled = true;
          }
        }
      };
    }
    raf.exports = function(fn) {
      return raf$1.call(root, fn);
    };
    raf.exports.cancel = function() {
      caf.apply(root, arguments);
    };
    raf.exports.polyfill = function(object) {
      if (!object) {
        object = root;
      }
      object.requestAnimationFrame = raf$1;
      object.cancelAnimationFrame = caf;
    };
    return raf.exports;
  }
  var rafExports = requireRaf();
  const requestAnimationFrame = /* @__PURE__ */ getDefaultExportFromCjs(rafExports);
  var rgbcolor;
  var hasRequiredRgbcolor;
  function requireRgbcolor() {
    if (hasRequiredRgbcolor) return rgbcolor;
    hasRequiredRgbcolor = 1;
    rgbcolor = function(color_string) {
      this.ok = false;
      this.alpha = 1;
      if (color_string.charAt(0) == "#") {
        color_string = color_string.substr(1, 6);
      }
      color_string = color_string.replace(/ /g, "");
      color_string = color_string.toLowerCase();
      var simple_colors = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "00ffff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000000",
        blanchedalmond: "ffebcd",
        blue: "0000ff",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "00ffff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dodgerblue: "1e90ff",
        feldspar: "d19275",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "ff00ff",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgrey: "d3d3d3",
        lightgreen: "90ee90",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslateblue: "8470ff",
        lightslategray: "778899",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "00ff00",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "ff00ff",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370d8",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "d87093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "ff0000",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        violetred: "d02090",
        wheat: "f5deb3",
        white: "ffffff",
        whitesmoke: "f5f5f5",
        yellow: "ffff00",
        yellowgreen: "9acd32"
      };
      color_string = simple_colors[color_string] || color_string;
      var color_defs = [
        {
          re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
          example: ["rgba(123, 234, 45, 0.8)", "rgba(255,234,245,1.0)"],
          process: function(bits2) {
            return [
              parseInt(bits2[1]),
              parseInt(bits2[2]),
              parseInt(bits2[3]),
              parseFloat(bits2[4])
            ];
          }
        },
        {
          re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
          example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
          process: function(bits2) {
            return [
              parseInt(bits2[1]),
              parseInt(bits2[2]),
              parseInt(bits2[3])
            ];
          }
        },
        {
          re: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
          example: ["#00ff00", "336699"],
          process: function(bits2) {
            return [
              parseInt(bits2[1], 16),
              parseInt(bits2[2], 16),
              parseInt(bits2[3], 16)
            ];
          }
        },
        {
          re: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
          example: ["#fb0", "f0f"],
          process: function(bits2) {
            return [
              parseInt(bits2[1] + bits2[1], 16),
              parseInt(bits2[2] + bits2[2], 16),
              parseInt(bits2[3] + bits2[3], 16)
            ];
          }
        }
      ];
      for (var i2 = 0; i2 < color_defs.length; i2++) {
        var re = color_defs[i2].re;
        var processor = color_defs[i2].process;
        var bits = re.exec(color_string);
        if (bits) {
          var channels = processor(bits);
          this.r = channels[0];
          this.g = channels[1];
          this.b = channels[2];
          if (channels.length > 3) {
            this.alpha = channels[3];
          }
          this.ok = true;
        }
      }
      this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
      this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
      this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b;
      this.alpha = this.alpha < 0 ? 0 : this.alpha > 1 || isNaN(this.alpha) ? 1 : this.alpha;
      this.toRGB = function() {
        return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
      };
      this.toRGBA = function() {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
      };
      this.toHex = function() {
        var r2 = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r2.length == 1) r2 = "0" + r2;
        if (g.length == 1) g = "0" + g;
        if (b.length == 1) b = "0" + b;
        return "#" + r2 + g + b;
      };
      this.getHelpXML = function() {
        var examples = new Array();
        for (var i3 = 0; i3 < color_defs.length; i3++) {
          var example = color_defs[i3].example;
          for (var j = 0; j < example.length; j++) {
            examples[examples.length] = example[j];
          }
        }
        for (var sc in simple_colors) {
          examples[examples.length] = sc;
        }
        var xml = document.createElement("ul");
        xml.setAttribute("id", "rgbcolor-examples");
        for (var i3 = 0; i3 < examples.length; i3++) {
          try {
            var list_item = document.createElement("li");
            var list_color = new RGBColor(examples[i3]);
            var example_div = document.createElement("div");
            example_div.style.cssText = "margin: 3px; border: 1px solid black; background:" + list_color.toHex() + "; color:" + list_color.toHex();
            example_div.appendChild(document.createTextNode("test"));
            var list_item_value = document.createTextNode(
              " " + examples[i3] + " -> " + list_color.toRGB() + " -> " + list_color.toHex()
            );
            list_item.appendChild(example_div);
            list_item.appendChild(list_item_value);
            xml.appendChild(list_item);
          } catch (e2) {
          }
        }
        return xml;
      };
    };
    return rgbcolor;
  }
  var rgbcolorExports = requireRgbcolor();
  const RGBColor$1 = /* @__PURE__ */ getDefaultExportFromCjs(rgbcolorExports);
  /*! *****************************************************************************
  	Copyright (c) Microsoft Corporation.
  
  	Permission to use, copy, modify, and/or distribute this software for any
  	purpose with or without fee is hereby granted.
  
  	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  	PERFORMANCE OF THIS SOFTWARE.
  	***************************************************************************** */
  var t = function(r2, e2) {
    return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t2, r3) {
      t2.__proto__ = r3;
    } || function(t2, r3) {
      for (var e3 in r3) Object.prototype.hasOwnProperty.call(r3, e3) && (t2[e3] = r3[e3]);
    })(r2, e2);
  };
  function r(r2, e2) {
    if ("function" != typeof e2 && null !== e2) throw new TypeError("Class extends value " + String(e2) + " is not a constructor or null");
    function i2() {
      this.constructor = r2;
    }
    t(r2, e2), r2.prototype = null === e2 ? Object.create(e2) : (i2.prototype = e2.prototype, new i2());
  }
  function e(t2) {
    var r2 = "";
    Array.isArray(t2) || (t2 = [t2]);
    for (var e2 = 0; e2 < t2.length; e2++) {
      var i2 = t2[e2];
      if (i2.type === _.CLOSE_PATH) r2 += "z";
      else if (i2.type === _.HORIZ_LINE_TO) r2 += (i2.relative ? "h" : "H") + i2.x;
      else if (i2.type === _.VERT_LINE_TO) r2 += (i2.relative ? "v" : "V") + i2.y;
      else if (i2.type === _.MOVE_TO) r2 += (i2.relative ? "m" : "M") + i2.x + " " + i2.y;
      else if (i2.type === _.LINE_TO) r2 += (i2.relative ? "l" : "L") + i2.x + " " + i2.y;
      else if (i2.type === _.CURVE_TO) r2 += (i2.relative ? "c" : "C") + i2.x1 + " " + i2.y1 + " " + i2.x2 + " " + i2.y2 + " " + i2.x + " " + i2.y;
      else if (i2.type === _.SMOOTH_CURVE_TO) r2 += (i2.relative ? "s" : "S") + i2.x2 + " " + i2.y2 + " " + i2.x + " " + i2.y;
      else if (i2.type === _.QUAD_TO) r2 += (i2.relative ? "q" : "Q") + i2.x1 + " " + i2.y1 + " " + i2.x + " " + i2.y;
      else if (i2.type === _.SMOOTH_QUAD_TO) r2 += (i2.relative ? "t" : "T") + i2.x + " " + i2.y;
      else {
        if (i2.type !== _.ARC) throw new Error('Unexpected command type "' + i2.type + '" at index ' + e2 + ".");
        r2 += (i2.relative ? "a" : "A") + i2.rX + " " + i2.rY + " " + i2.xRot + " " + +i2.lArcFlag + " " + +i2.sweepFlag + " " + i2.x + " " + i2.y;
      }
    }
    return r2;
  }
  function i(t2, r2) {
    var e2 = t2[0], i2 = t2[1];
    return [e2 * Math.cos(r2) - i2 * Math.sin(r2), e2 * Math.sin(r2) + i2 * Math.cos(r2)];
  }
  function a() {
    for (var t2 = [], r2 = 0; r2 < arguments.length; r2++) t2[r2] = arguments[r2];
    for (var e2 = 0; e2 < t2.length; e2++) if ("number" != typeof t2[e2]) throw new Error("assertNumbers arguments[" + e2 + "] is not a number. " + typeof t2[e2] + " == typeof " + t2[e2]);
    return true;
  }
  var n = Math.PI;
  function o(t2, r2, e2) {
    t2.lArcFlag = 0 === t2.lArcFlag ? 0 : 1, t2.sweepFlag = 0 === t2.sweepFlag ? 0 : 1;
    var a2 = t2.rX, o2 = t2.rY, s2 = t2.x, u2 = t2.y;
    a2 = Math.abs(t2.rX), o2 = Math.abs(t2.rY);
    var h2 = i([(r2 - s2) / 2, (e2 - u2) / 2], -t2.xRot / 180 * n), c2 = h2[0], y2 = h2[1], p2 = Math.pow(c2, 2) / Math.pow(a2, 2) + Math.pow(y2, 2) / Math.pow(o2, 2);
    1 < p2 && (a2 *= Math.sqrt(p2), o2 *= Math.sqrt(p2)), t2.rX = a2, t2.rY = o2;
    var m2 = Math.pow(a2, 2) * Math.pow(y2, 2) + Math.pow(o2, 2) * Math.pow(c2, 2), O2 = (t2.lArcFlag !== t2.sweepFlag ? 1 : -1) * Math.sqrt(Math.max(0, (Math.pow(a2, 2) * Math.pow(o2, 2) - m2) / m2)), l2 = a2 * y2 / o2 * O2, T2 = -o2 * c2 / a2 * O2, v2 = i([l2, T2], t2.xRot / 180 * n);
    t2.cX = v2[0] + (r2 + s2) / 2, t2.cY = v2[1] + (e2 + u2) / 2, t2.phi1 = Math.atan2((y2 - T2) / o2, (c2 - l2) / a2), t2.phi2 = Math.atan2((-y2 - T2) / o2, (-c2 - l2) / a2), 0 === t2.sweepFlag && t2.phi2 > t2.phi1 && (t2.phi2 -= 2 * n), 1 === t2.sweepFlag && t2.phi2 < t2.phi1 && (t2.phi2 += 2 * n), t2.phi1 *= 180 / n, t2.phi2 *= 180 / n;
  }
  function s(t2, r2, e2) {
    a(t2, r2, e2);
    var i2 = t2 * t2 + r2 * r2 - e2 * e2;
    if (0 > i2) return [];
    if (0 === i2) return [[t2 * e2 / (t2 * t2 + r2 * r2), r2 * e2 / (t2 * t2 + r2 * r2)]];
    var n2 = Math.sqrt(i2);
    return [[(t2 * e2 + r2 * n2) / (t2 * t2 + r2 * r2), (r2 * e2 - t2 * n2) / (t2 * t2 + r2 * r2)], [(t2 * e2 - r2 * n2) / (t2 * t2 + r2 * r2), (r2 * e2 + t2 * n2) / (t2 * t2 + r2 * r2)]];
  }
  var u, h = Math.PI / 180;
  function c$1(t2, r2, e2) {
    return (1 - e2) * t2 + e2 * r2;
  }
  function y(t2, r2, e2, i2) {
    return t2 + Math.cos(i2 / 180 * n) * r2 + Math.sin(i2 / 180 * n) * e2;
  }
  function p(t2, r2, e2, i2) {
    var a2 = 1e-6, n2 = r2 - t2, o2 = e2 - r2, s2 = 3 * n2 + 3 * (i2 - e2) - 6 * o2, u2 = 6 * (o2 - n2), h2 = 3 * n2;
    return Math.abs(s2) < a2 ? [-h2 / u2] : function(t3, r3, e3) {
      var i3 = t3 * t3 / 4 - r3;
      if (i3 < -1e-6) return [];
      if (i3 <= e3) return [-t3 / 2];
      var a3 = Math.sqrt(i3);
      return [-t3 / 2 - a3, -t3 / 2 + a3];
    }(u2 / s2, h2 / s2, a2);
  }
  function m$1(t2, r2, e2, i2, a2) {
    var n2 = 1 - a2;
    return t2 * (n2 * n2 * n2) + r2 * (3 * n2 * n2 * a2) + e2 * (3 * n2 * a2 * a2) + i2 * (a2 * a2 * a2);
  }
  !function(t2) {
    function r2() {
      return u2(function(t3, r3, e3) {
        return t3.relative && (void 0 !== t3.x1 && (t3.x1 += r3), void 0 !== t3.y1 && (t3.y1 += e3), void 0 !== t3.x2 && (t3.x2 += r3), void 0 !== t3.y2 && (t3.y2 += e3), void 0 !== t3.x && (t3.x += r3), void 0 !== t3.y && (t3.y += e3), t3.relative = false), t3;
      });
    }
    function e2() {
      var t3 = NaN, r3 = NaN, e3 = NaN, i2 = NaN;
      return u2(function(a2, n3, o2) {
        return a2.type & _.SMOOTH_CURVE_TO && (a2.type = _.CURVE_TO, t3 = isNaN(t3) ? n3 : t3, r3 = isNaN(r3) ? o2 : r3, a2.x1 = a2.relative ? n3 - t3 : 2 * n3 - t3, a2.y1 = a2.relative ? o2 - r3 : 2 * o2 - r3), a2.type & _.CURVE_TO ? (t3 = a2.relative ? n3 + a2.x2 : a2.x2, r3 = a2.relative ? o2 + a2.y2 : a2.y2) : (t3 = NaN, r3 = NaN), a2.type & _.SMOOTH_QUAD_TO && (a2.type = _.QUAD_TO, e3 = isNaN(e3) ? n3 : e3, i2 = isNaN(i2) ? o2 : i2, a2.x1 = a2.relative ? n3 - e3 : 2 * n3 - e3, a2.y1 = a2.relative ? o2 - i2 : 2 * o2 - i2), a2.type & _.QUAD_TO ? (e3 = a2.relative ? n3 + a2.x1 : a2.x1, i2 = a2.relative ? o2 + a2.y1 : a2.y1) : (e3 = NaN, i2 = NaN), a2;
      });
    }
    function n2() {
      var t3 = NaN, r3 = NaN;
      return u2(function(e3, i2, a2) {
        if (e3.type & _.SMOOTH_QUAD_TO && (e3.type = _.QUAD_TO, t3 = isNaN(t3) ? i2 : t3, r3 = isNaN(r3) ? a2 : r3, e3.x1 = e3.relative ? i2 - t3 : 2 * i2 - t3, e3.y1 = e3.relative ? a2 - r3 : 2 * a2 - r3), e3.type & _.QUAD_TO) {
          t3 = e3.relative ? i2 + e3.x1 : e3.x1, r3 = e3.relative ? a2 + e3.y1 : e3.y1;
          var n3 = e3.x1, o2 = e3.y1;
          e3.type = _.CURVE_TO, e3.x1 = ((e3.relative ? 0 : i2) + 2 * n3) / 3, e3.y1 = ((e3.relative ? 0 : a2) + 2 * o2) / 3, e3.x2 = (e3.x + 2 * n3) / 3, e3.y2 = (e3.y + 2 * o2) / 3;
        } else t3 = NaN, r3 = NaN;
        return e3;
      });
    }
    function u2(t3) {
      var r3 = 0, e3 = 0, i2 = NaN, a2 = NaN;
      return function(n3) {
        if (isNaN(i2) && !(n3.type & _.MOVE_TO)) throw new Error("path must start with moveto");
        var o2 = t3(n3, r3, e3, i2, a2);
        return n3.type & _.CLOSE_PATH && (r3 = i2, e3 = a2), void 0 !== n3.x && (r3 = n3.relative ? r3 + n3.x : n3.x), void 0 !== n3.y && (e3 = n3.relative ? e3 + n3.y : n3.y), n3.type & _.MOVE_TO && (i2 = r3, a2 = e3), o2;
      };
    }
    function O2(t3, r3, e3, i2, n3, o2) {
      return a(t3, r3, e3, i2, n3, o2), u2(function(a2, s2, u3, h2) {
        var c2 = a2.x1, y2 = a2.x2, p2 = a2.relative && !isNaN(h2), m2 = void 0 !== a2.x ? a2.x : p2 ? 0 : s2, O3 = void 0 !== a2.y ? a2.y : p2 ? 0 : u3;
        function l3(t4) {
          return t4 * t4;
        }
        a2.type & _.HORIZ_LINE_TO && 0 !== r3 && (a2.type = _.LINE_TO, a2.y = a2.relative ? 0 : u3), a2.type & _.VERT_LINE_TO && 0 !== e3 && (a2.type = _.LINE_TO, a2.x = a2.relative ? 0 : s2), void 0 !== a2.x && (a2.x = a2.x * t3 + O3 * e3 + (p2 ? 0 : n3)), void 0 !== a2.y && (a2.y = m2 * r3 + a2.y * i2 + (p2 ? 0 : o2)), void 0 !== a2.x1 && (a2.x1 = a2.x1 * t3 + a2.y1 * e3 + (p2 ? 0 : n3)), void 0 !== a2.y1 && (a2.y1 = c2 * r3 + a2.y1 * i2 + (p2 ? 0 : o2)), void 0 !== a2.x2 && (a2.x2 = a2.x2 * t3 + a2.y2 * e3 + (p2 ? 0 : n3)), void 0 !== a2.y2 && (a2.y2 = y2 * r3 + a2.y2 * i2 + (p2 ? 0 : o2));
        var T2 = t3 * i2 - r3 * e3;
        if (void 0 !== a2.xRot && (1 !== t3 || 0 !== r3 || 0 !== e3 || 1 !== i2)) if (0 === T2) delete a2.rX, delete a2.rY, delete a2.xRot, delete a2.lArcFlag, delete a2.sweepFlag, a2.type = _.LINE_TO;
        else {
          var v2 = a2.xRot * Math.PI / 180, f2 = Math.sin(v2), N2 = Math.cos(v2), x = 1 / l3(a2.rX), d = 1 / l3(a2.rY), E = l3(N2) * x + l3(f2) * d, A = 2 * f2 * N2 * (x - d), C = l3(f2) * x + l3(N2) * d, M = E * i2 * i2 - A * r3 * i2 + C * r3 * r3, R = A * (t3 * i2 + r3 * e3) - 2 * (E * e3 * i2 + C * t3 * r3), g = E * e3 * e3 - A * t3 * e3 + C * t3 * t3, I = (Math.atan2(R, M - g) + Math.PI) % Math.PI / 2, S = Math.sin(I), L = Math.cos(I);
          a2.rX = Math.abs(T2) / Math.sqrt(M * l3(L) + R * S * L + g * l3(S)), a2.rY = Math.abs(T2) / Math.sqrt(M * l3(S) - R * S * L + g * l3(L)), a2.xRot = 180 * I / Math.PI;
        }
        return void 0 !== a2.sweepFlag && 0 > T2 && (a2.sweepFlag = +!a2.sweepFlag), a2;
      });
    }
    function l2() {
      return function(t3) {
        var r3 = {};
        for (var e3 in t3) r3[e3] = t3[e3];
        return r3;
      };
    }
    t2.ROUND = function(t3) {
      function r3(r4) {
        return Math.round(r4 * t3) / t3;
      }
      return void 0 === t3 && (t3 = 1e13), a(t3), function(t4) {
        return void 0 !== t4.x1 && (t4.x1 = r3(t4.x1)), void 0 !== t4.y1 && (t4.y1 = r3(t4.y1)), void 0 !== t4.x2 && (t4.x2 = r3(t4.x2)), void 0 !== t4.y2 && (t4.y2 = r3(t4.y2)), void 0 !== t4.x && (t4.x = r3(t4.x)), void 0 !== t4.y && (t4.y = r3(t4.y)), void 0 !== t4.rX && (t4.rX = r3(t4.rX)), void 0 !== t4.rY && (t4.rY = r3(t4.rY)), t4;
      };
    }, t2.TO_ABS = r2, t2.TO_REL = function() {
      return u2(function(t3, r3, e3) {
        return t3.relative || (void 0 !== t3.x1 && (t3.x1 -= r3), void 0 !== t3.y1 && (t3.y1 -= e3), void 0 !== t3.x2 && (t3.x2 -= r3), void 0 !== t3.y2 && (t3.y2 -= e3), void 0 !== t3.x && (t3.x -= r3), void 0 !== t3.y && (t3.y -= e3), t3.relative = true), t3;
      });
    }, t2.NORMALIZE_HVZ = function(t3, r3, e3) {
      return void 0 === t3 && (t3 = true), void 0 === r3 && (r3 = true), void 0 === e3 && (e3 = true), u2(function(i2, a2, n3, o2, s2) {
        if (isNaN(o2) && !(i2.type & _.MOVE_TO)) throw new Error("path must start with moveto");
        return r3 && i2.type & _.HORIZ_LINE_TO && (i2.type = _.LINE_TO, i2.y = i2.relative ? 0 : n3), e3 && i2.type & _.VERT_LINE_TO && (i2.type = _.LINE_TO, i2.x = i2.relative ? 0 : a2), t3 && i2.type & _.CLOSE_PATH && (i2.type = _.LINE_TO, i2.x = i2.relative ? o2 - a2 : o2, i2.y = i2.relative ? s2 - n3 : s2), i2.type & _.ARC && (0 === i2.rX || 0 === i2.rY) && (i2.type = _.LINE_TO, delete i2.rX, delete i2.rY, delete i2.xRot, delete i2.lArcFlag, delete i2.sweepFlag), i2;
      });
    }, t2.NORMALIZE_ST = e2, t2.QT_TO_C = n2, t2.INFO = u2, t2.SANITIZE = function(t3) {
      void 0 === t3 && (t3 = 0), a(t3);
      var r3 = NaN, e3 = NaN, i2 = NaN, n3 = NaN;
      return u2(function(a2, o2, s2, u3, h2) {
        var c2 = Math.abs, y2 = false, p2 = 0, m2 = 0;
        if (a2.type & _.SMOOTH_CURVE_TO && (p2 = isNaN(r3) ? 0 : o2 - r3, m2 = isNaN(e3) ? 0 : s2 - e3), a2.type & (_.CURVE_TO | _.SMOOTH_CURVE_TO) ? (r3 = a2.relative ? o2 + a2.x2 : a2.x2, e3 = a2.relative ? s2 + a2.y2 : a2.y2) : (r3 = NaN, e3 = NaN), a2.type & _.SMOOTH_QUAD_TO ? (i2 = isNaN(i2) ? o2 : 2 * o2 - i2, n3 = isNaN(n3) ? s2 : 2 * s2 - n3) : a2.type & _.QUAD_TO ? (i2 = a2.relative ? o2 + a2.x1 : a2.x1, n3 = a2.relative ? s2 + a2.y1 : a2.y2) : (i2 = NaN, n3 = NaN), a2.type & _.LINE_COMMANDS || a2.type & _.ARC && (0 === a2.rX || 0 === a2.rY || !a2.lArcFlag) || a2.type & _.CURVE_TO || a2.type & _.SMOOTH_CURVE_TO || a2.type & _.QUAD_TO || a2.type & _.SMOOTH_QUAD_TO) {
          var O3 = void 0 === a2.x ? 0 : a2.relative ? a2.x : a2.x - o2, l3 = void 0 === a2.y ? 0 : a2.relative ? a2.y : a2.y - s2;
          p2 = isNaN(i2) ? void 0 === a2.x1 ? p2 : a2.relative ? a2.x : a2.x1 - o2 : i2 - o2, m2 = isNaN(n3) ? void 0 === a2.y1 ? m2 : a2.relative ? a2.y : a2.y1 - s2 : n3 - s2;
          var T2 = void 0 === a2.x2 ? 0 : a2.relative ? a2.x : a2.x2 - o2, v2 = void 0 === a2.y2 ? 0 : a2.relative ? a2.y : a2.y2 - s2;
          c2(O3) <= t3 && c2(l3) <= t3 && c2(p2) <= t3 && c2(m2) <= t3 && c2(T2) <= t3 && c2(v2) <= t3 && (y2 = true);
        }
        return a2.type & _.CLOSE_PATH && c2(o2 - u3) <= t3 && c2(s2 - h2) <= t3 && (y2 = true), y2 ? [] : a2;
      });
    }, t2.MATRIX = O2, t2.ROTATE = function(t3, r3, e3) {
      void 0 === r3 && (r3 = 0), void 0 === e3 && (e3 = 0), a(t3, r3, e3);
      var i2 = Math.sin(t3), n3 = Math.cos(t3);
      return O2(n3, i2, -i2, n3, r3 - r3 * n3 + e3 * i2, e3 - r3 * i2 - e3 * n3);
    }, t2.TRANSLATE = function(t3, r3) {
      return void 0 === r3 && (r3 = 0), a(t3, r3), O2(1, 0, 0, 1, t3, r3);
    }, t2.SCALE = function(t3, r3) {
      return void 0 === r3 && (r3 = t3), a(t3, r3), O2(t3, 0, 0, r3, 0, 0);
    }, t2.SKEW_X = function(t3) {
      return a(t3), O2(1, 0, Math.atan(t3), 1, 0, 0);
    }, t2.SKEW_Y = function(t3) {
      return a(t3), O2(1, Math.atan(t3), 0, 1, 0, 0);
    }, t2.X_AXIS_SYMMETRY = function(t3) {
      return void 0 === t3 && (t3 = 0), a(t3), O2(-1, 0, 0, 1, t3, 0);
    }, t2.Y_AXIS_SYMMETRY = function(t3) {
      return void 0 === t3 && (t3 = 0), a(t3), O2(1, 0, 0, -1, 0, t3);
    }, t2.A_TO_C = function() {
      return u2(function(t3, r3, e3) {
        return _.ARC === t3.type ? function(t4, r4, e4) {
          var a2, n3, s2, u3;
          t4.cX || o(t4, r4, e4);
          for (var y2 = Math.min(t4.phi1, t4.phi2), p2 = Math.max(t4.phi1, t4.phi2) - y2, m2 = Math.ceil(p2 / 90), O3 = new Array(m2), l3 = r4, T2 = e4, v2 = 0; v2 < m2; v2++) {
            var f2 = c$1(t4.phi1, t4.phi2, v2 / m2), N2 = c$1(t4.phi1, t4.phi2, (v2 + 1) / m2), x = N2 - f2, d = 4 / 3 * Math.tan(x * h / 4), E = [Math.cos(f2 * h) - d * Math.sin(f2 * h), Math.sin(f2 * h) + d * Math.cos(f2 * h)], A = E[0], C = E[1], M = [Math.cos(N2 * h), Math.sin(N2 * h)], R = M[0], g = M[1], I = [R + d * Math.sin(N2 * h), g - d * Math.cos(N2 * h)], S = I[0], L = I[1];
            O3[v2] = { relative: t4.relative, type: _.CURVE_TO };
            var H = function(r5, e5) {
              var a3 = i([r5 * t4.rX, e5 * t4.rY], t4.xRot), n4 = a3[0], o2 = a3[1];
              return [t4.cX + n4, t4.cY + o2];
            };
            a2 = H(A, C), O3[v2].x1 = a2[0], O3[v2].y1 = a2[1], n3 = H(S, L), O3[v2].x2 = n3[0], O3[v2].y2 = n3[1], s2 = H(R, g), O3[v2].x = s2[0], O3[v2].y = s2[1], t4.relative && (O3[v2].x1 -= l3, O3[v2].y1 -= T2, O3[v2].x2 -= l3, O3[v2].y2 -= T2, O3[v2].x -= l3, O3[v2].y -= T2), l3 = (u3 = [O3[v2].x, O3[v2].y])[0], T2 = u3[1];
          }
          return O3;
        }(t3, t3.relative ? 0 : r3, t3.relative ? 0 : e3) : t3;
      });
    }, t2.ANNOTATE_ARCS = function() {
      return u2(function(t3, r3, e3) {
        return t3.relative && (r3 = 0, e3 = 0), _.ARC === t3.type && o(t3, r3, e3), t3;
      });
    }, t2.CLONE = l2, t2.CALCULATE_BOUNDS = function() {
      var t3 = function(t4) {
        var r3 = {};
        for (var e3 in t4) r3[e3] = t4[e3];
        return r3;
      }, i2 = r2(), a2 = n2(), h2 = e2(), c2 = u2(function(r3, e3, n3) {
        var u3 = h2(a2(i2(t3(r3))));
        function O3(t4) {
          t4 > c2.maxX && (c2.maxX = t4), t4 < c2.minX && (c2.minX = t4);
        }
        function l3(t4) {
          t4 > c2.maxY && (c2.maxY = t4), t4 < c2.minY && (c2.minY = t4);
        }
        if (u3.type & _.DRAWING_COMMANDS && (O3(e3), l3(n3)), u3.type & _.HORIZ_LINE_TO && O3(u3.x), u3.type & _.VERT_LINE_TO && l3(u3.y), u3.type & _.LINE_TO && (O3(u3.x), l3(u3.y)), u3.type & _.CURVE_TO) {
          O3(u3.x), l3(u3.y);
          for (var T2 = 0, v2 = p(e3, u3.x1, u3.x2, u3.x); T2 < v2.length; T2++) {
            0 < (w = v2[T2]) && 1 > w && O3(m$1(e3, u3.x1, u3.x2, u3.x, w));
          }
          for (var f2 = 0, N2 = p(n3, u3.y1, u3.y2, u3.y); f2 < N2.length; f2++) {
            0 < (w = N2[f2]) && 1 > w && l3(m$1(n3, u3.y1, u3.y2, u3.y, w));
          }
        }
        if (u3.type & _.ARC) {
          O3(u3.x), l3(u3.y), o(u3, e3, n3);
          for (var x = u3.xRot / 180 * Math.PI, d = Math.cos(x) * u3.rX, E = Math.sin(x) * u3.rX, A = -Math.sin(x) * u3.rY, C = Math.cos(x) * u3.rY, M = u3.phi1 < u3.phi2 ? [u3.phi1, u3.phi2] : -180 > u3.phi2 ? [u3.phi2 + 360, u3.phi1 + 360] : [u3.phi2, u3.phi1], R = M[0], g = M[1], I = function(t4) {
            var r4 = t4[0], e4 = t4[1], i3 = 180 * Math.atan2(e4, r4) / Math.PI;
            return i3 < R ? i3 + 360 : i3;
          }, S = 0, L = s(A, -d, 0).map(I); S < L.length; S++) {
            (w = L[S]) > R && w < g && O3(y(u3.cX, d, A, w));
          }
          for (var H = 0, U = s(C, -E, 0).map(I); H < U.length; H++) {
            var w;
            (w = U[H]) > R && w < g && l3(y(u3.cY, E, C, w));
          }
        }
        return r3;
      });
      return c2.minX = 1 / 0, c2.maxX = -1 / 0, c2.minY = 1 / 0, c2.maxY = -1 / 0, c2;
    };
  }(u || (u = {}));
  var O, l = function() {
    function t2() {
    }
    return t2.prototype.round = function(t3) {
      return this.transform(u.ROUND(t3));
    }, t2.prototype.toAbs = function() {
      return this.transform(u.TO_ABS());
    }, t2.prototype.toRel = function() {
      return this.transform(u.TO_REL());
    }, t2.prototype.normalizeHVZ = function(t3, r2, e2) {
      return this.transform(u.NORMALIZE_HVZ(t3, r2, e2));
    }, t2.prototype.normalizeST = function() {
      return this.transform(u.NORMALIZE_ST());
    }, t2.prototype.qtToC = function() {
      return this.transform(u.QT_TO_C());
    }, t2.prototype.aToC = function() {
      return this.transform(u.A_TO_C());
    }, t2.prototype.sanitize = function(t3) {
      return this.transform(u.SANITIZE(t3));
    }, t2.prototype.translate = function(t3, r2) {
      return this.transform(u.TRANSLATE(t3, r2));
    }, t2.prototype.scale = function(t3, r2) {
      return this.transform(u.SCALE(t3, r2));
    }, t2.prototype.rotate = function(t3, r2, e2) {
      return this.transform(u.ROTATE(t3, r2, e2));
    }, t2.prototype.matrix = function(t3, r2, e2, i2, a2, n2) {
      return this.transform(u.MATRIX(t3, r2, e2, i2, a2, n2));
    }, t2.prototype.skewX = function(t3) {
      return this.transform(u.SKEW_X(t3));
    }, t2.prototype.skewY = function(t3) {
      return this.transform(u.SKEW_Y(t3));
    }, t2.prototype.xSymmetry = function(t3) {
      return this.transform(u.X_AXIS_SYMMETRY(t3));
    }, t2.prototype.ySymmetry = function(t3) {
      return this.transform(u.Y_AXIS_SYMMETRY(t3));
    }, t2.prototype.annotateArcs = function() {
      return this.transform(u.ANNOTATE_ARCS());
    }, t2;
  }(), T = function(t2) {
    return " " === t2 || "	" === t2 || "\r" === t2 || "\n" === t2;
  }, v = function(t2) {
    return "0".charCodeAt(0) <= t2.charCodeAt(0) && t2.charCodeAt(0) <= "9".charCodeAt(0);
  }, f = function(t2) {
    function e2() {
      var r2 = t2.call(this) || this;
      return r2.curNumber = "", r2.curCommandType = -1, r2.curCommandRelative = false, r2.canParseCommandOrComma = true, r2.curNumberHasExp = false, r2.curNumberHasExpDigits = false, r2.curNumberHasDecimal = false, r2.curArgs = [], r2;
    }
    return r(e2, t2), e2.prototype.finish = function(t3) {
      if (void 0 === t3 && (t3 = []), this.parse(" ", t3), 0 !== this.curArgs.length || !this.canParseCommandOrComma) throw new SyntaxError("Unterminated command at the path end.");
      return t3;
    }, e2.prototype.parse = function(t3, r2) {
      var e3 = this;
      void 0 === r2 && (r2 = []);
      for (var i2 = function(t4) {
        r2.push(t4), e3.curArgs.length = 0, e3.canParseCommandOrComma = true;
      }, a2 = 0; a2 < t3.length; a2++) {
        var n2 = t3[a2], o2 = !(this.curCommandType !== _.ARC || 3 !== this.curArgs.length && 4 !== this.curArgs.length || 1 !== this.curNumber.length || "0" !== this.curNumber && "1" !== this.curNumber), s2 = v(n2) && ("0" === this.curNumber && "0" === n2 || o2);
        if (!v(n2) || s2) if ("e" !== n2 && "E" !== n2) if ("-" !== n2 && "+" !== n2 || !this.curNumberHasExp || this.curNumberHasExpDigits) if ("." !== n2 || this.curNumberHasExp || this.curNumberHasDecimal || o2) {
          if (this.curNumber && -1 !== this.curCommandType) {
            var u2 = Number(this.curNumber);
            if (isNaN(u2)) throw new SyntaxError("Invalid number ending at " + a2);
            if (this.curCommandType === _.ARC) {
              if (0 === this.curArgs.length || 1 === this.curArgs.length) {
                if (0 > u2) throw new SyntaxError('Expected positive number, got "' + u2 + '" at index "' + a2 + '"');
              } else if ((3 === this.curArgs.length || 4 === this.curArgs.length) && "0" !== this.curNumber && "1" !== this.curNumber) throw new SyntaxError('Expected a flag, got "' + this.curNumber + '" at index "' + a2 + '"');
            }
            this.curArgs.push(u2), this.curArgs.length === N[this.curCommandType] && (_.HORIZ_LINE_TO === this.curCommandType ? i2({ type: _.HORIZ_LINE_TO, relative: this.curCommandRelative, x: u2 }) : _.VERT_LINE_TO === this.curCommandType ? i2({ type: _.VERT_LINE_TO, relative: this.curCommandRelative, y: u2 }) : this.curCommandType === _.MOVE_TO || this.curCommandType === _.LINE_TO || this.curCommandType === _.SMOOTH_QUAD_TO ? (i2({ type: this.curCommandType, relative: this.curCommandRelative, x: this.curArgs[0], y: this.curArgs[1] }), _.MOVE_TO === this.curCommandType && (this.curCommandType = _.LINE_TO)) : this.curCommandType === _.CURVE_TO ? i2({ type: _.CURVE_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x2: this.curArgs[2], y2: this.curArgs[3], x: this.curArgs[4], y: this.curArgs[5] }) : this.curCommandType === _.SMOOTH_CURVE_TO ? i2({ type: _.SMOOTH_CURVE_TO, relative: this.curCommandRelative, x2: this.curArgs[0], y2: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === _.QUAD_TO ? i2({ type: _.QUAD_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === _.ARC && i2({ type: _.ARC, relative: this.curCommandRelative, rX: this.curArgs[0], rY: this.curArgs[1], xRot: this.curArgs[2], lArcFlag: this.curArgs[3], sweepFlag: this.curArgs[4], x: this.curArgs[5], y: this.curArgs[6] })), this.curNumber = "", this.curNumberHasExpDigits = false, this.curNumberHasExp = false, this.curNumberHasDecimal = false, this.canParseCommandOrComma = true;
          }
          if (!T(n2)) if ("," === n2 && this.canParseCommandOrComma) this.canParseCommandOrComma = false;
          else if ("+" !== n2 && "-" !== n2 && "." !== n2) if (s2) this.curNumber = n2, this.curNumberHasDecimal = false;
          else {
            if (0 !== this.curArgs.length) throw new SyntaxError("Unterminated command at index " + a2 + ".");
            if (!this.canParseCommandOrComma) throw new SyntaxError('Unexpected character "' + n2 + '" at index ' + a2 + ". Command cannot follow comma");
            if (this.canParseCommandOrComma = false, "z" !== n2 && "Z" !== n2) if ("h" === n2 || "H" === n2) this.curCommandType = _.HORIZ_LINE_TO, this.curCommandRelative = "h" === n2;
            else if ("v" === n2 || "V" === n2) this.curCommandType = _.VERT_LINE_TO, this.curCommandRelative = "v" === n2;
            else if ("m" === n2 || "M" === n2) this.curCommandType = _.MOVE_TO, this.curCommandRelative = "m" === n2;
            else if ("l" === n2 || "L" === n2) this.curCommandType = _.LINE_TO, this.curCommandRelative = "l" === n2;
            else if ("c" === n2 || "C" === n2) this.curCommandType = _.CURVE_TO, this.curCommandRelative = "c" === n2;
            else if ("s" === n2 || "S" === n2) this.curCommandType = _.SMOOTH_CURVE_TO, this.curCommandRelative = "s" === n2;
            else if ("q" === n2 || "Q" === n2) this.curCommandType = _.QUAD_TO, this.curCommandRelative = "q" === n2;
            else if ("t" === n2 || "T" === n2) this.curCommandType = _.SMOOTH_QUAD_TO, this.curCommandRelative = "t" === n2;
            else {
              if ("a" !== n2 && "A" !== n2) throw new SyntaxError('Unexpected character "' + n2 + '" at index ' + a2 + ".");
              this.curCommandType = _.ARC, this.curCommandRelative = "a" === n2;
            }
            else r2.push({ type: _.CLOSE_PATH }), this.canParseCommandOrComma = true, this.curCommandType = -1;
          }
          else this.curNumber = n2, this.curNumberHasDecimal = "." === n2;
        } else this.curNumber += n2, this.curNumberHasDecimal = true;
        else this.curNumber += n2;
        else this.curNumber += n2, this.curNumberHasExp = true;
        else this.curNumber += n2, this.curNumberHasExpDigits = this.curNumberHasExp;
      }
      return r2;
    }, e2.prototype.transform = function(t3) {
      return Object.create(this, { parse: { value: function(r2, e3) {
        void 0 === e3 && (e3 = []);
        for (var i2 = 0, a2 = Object.getPrototypeOf(this).parse.call(this, r2); i2 < a2.length; i2++) {
          var n2 = a2[i2], o2 = t3(n2);
          Array.isArray(o2) ? e3.push.apply(e3, o2) : e3.push(o2);
        }
        return e3;
      } } });
    }, e2;
  }(l), _ = function(t2) {
    function i2(r2) {
      var e2 = t2.call(this) || this;
      return e2.commands = "string" == typeof r2 ? i2.parse(r2) : r2, e2;
    }
    return r(i2, t2), i2.prototype.encode = function() {
      return i2.encode(this.commands);
    }, i2.prototype.getBounds = function() {
      var t3 = u.CALCULATE_BOUNDS();
      return this.transform(t3), t3;
    }, i2.prototype.transform = function(t3) {
      for (var r2 = [], e2 = 0, i3 = this.commands; e2 < i3.length; e2++) {
        var a2 = t3(i3[e2]);
        Array.isArray(a2) ? r2.push.apply(r2, a2) : r2.push(a2);
      }
      return this.commands = r2, this;
    }, i2.encode = function(t3) {
      return e(t3);
    }, i2.parse = function(t3) {
      var r2 = new f(), e2 = [];
      return r2.parse(t3, e2), r2.finish(e2), e2;
    }, i2.CLOSE_PATH = 1, i2.MOVE_TO = 2, i2.HORIZ_LINE_TO = 4, i2.VERT_LINE_TO = 8, i2.LINE_TO = 16, i2.CURVE_TO = 32, i2.SMOOTH_CURVE_TO = 64, i2.QUAD_TO = 128, i2.SMOOTH_QUAD_TO = 256, i2.ARC = 512, i2.LINE_COMMANDS = i2.LINE_TO | i2.HORIZ_LINE_TO | i2.VERT_LINE_TO, i2.DRAWING_COMMANDS = i2.HORIZ_LINE_TO | i2.VERT_LINE_TO | i2.LINE_TO | i2.CURVE_TO | i2.SMOOTH_CURVE_TO | i2.QUAD_TO | i2.SMOOTH_QUAD_TO | i2.ARC, i2;
  }(l), N = ((O = {})[_.MOVE_TO] = 2, O[_.LINE_TO] = 2, O[_.HORIZ_LINE_TO] = 1, O[_.VERT_LINE_TO] = 1, O[_.CLOSE_PATH] = 0, O[_.QUAD_TO] = 4, O[_.SMOOTH_QUAD_TO] = 2, O[_.CURVE_TO] = 6, O[_.SMOOTH_CURVE_TO] = 4, O[_.ARC] = 7, O);
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
  var shgTable = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
  function getImageDataFromCanvas(canvas, topX, topY, width, height) {
    if (typeof canvas === "string") {
      canvas = document.getElementById(canvas);
    }
    if (!canvas || _typeof(canvas) !== "object" || !("getContext" in canvas)) {
      throw new TypeError("Expecting canvas with `getContext` method in processCanvasRGB(A) calls!");
    }
    var context = canvas.getContext("2d");
    try {
      return context.getImageData(topX, topY, width, height);
    } catch (e2) {
      throw new Error("unable to access image data: " + e2);
    }
  }
  function processCanvasRGBA(canvas, topX, topY, width, height, radius) {
    if (isNaN(radius) || radius < 1) {
      return;
    }
    radius |= 0;
    var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
    imageData = processImageDataRGBA(imageData, topX, topY, width, height, radius);
    canvas.getContext("2d").putImageData(imageData, topX, topY);
  }
  function processImageDataRGBA(imageData, topX, topY, width, height, radius) {
    var pixels = imageData.data;
    var div = 2 * radius + 1;
    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    var stackStart = new BlurStack();
    var stack = stackStart;
    var stackEnd;
    for (var i2 = 1; i2 < div; i2++) {
      stack = stack.next = new BlurStack();
      if (i2 === radiusPlus1) {
        stackEnd = stack;
      }
    }
    stack.next = stackStart;
    var stackIn = null, stackOut = null, yw = 0, yi = 0;
    var mulSum = mulTable[radius];
    var shgSum = shgTable[radius];
    for (var y2 = 0; y2 < height; y2++) {
      stack = stackStart;
      var pr = pixels[yi], pg = pixels[yi + 1], pb = pixels[yi + 2], pa = pixels[yi + 3];
      for (var _i = 0; _i < radiusPlus1; _i++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      }
      var rInSum = 0, gInSum = 0, bInSum = 0, aInSum = 0, rOutSum = radiusPlus1 * pr, gOutSum = radiusPlus1 * pg, bOutSum = radiusPlus1 * pb, aOutSum = radiusPlus1 * pa, rSum = sumFactor * pr, gSum = sumFactor * pg, bSum = sumFactor * pb, aSum = sumFactor * pa;
      for (var _i2 = 1; _i2 < radiusPlus1; _i2++) {
        var p2 = yi + ((widthMinus1 < _i2 ? widthMinus1 : _i2) << 2);
        var r2 = pixels[p2], g = pixels[p2 + 1], b = pixels[p2 + 2], a2 = pixels[p2 + 3];
        var rbs = radiusPlus1 - _i2;
        rSum += (stack.r = r2) * rbs;
        gSum += (stack.g = g) * rbs;
        bSum += (stack.b = b) * rbs;
        aSum += (stack.a = a2) * rbs;
        rInSum += r2;
        gInSum += g;
        bInSum += b;
        aInSum += a2;
        stack = stack.next;
      }
      stackIn = stackStart;
      stackOut = stackEnd;
      for (var x = 0; x < width; x++) {
        var paInitial = aSum * mulSum >>> shgSum;
        pixels[yi + 3] = paInitial;
        if (paInitial !== 0) {
          var _a2 = 255 / paInitial;
          pixels[yi] = (rSum * mulSum >>> shgSum) * _a2;
          pixels[yi + 1] = (gSum * mulSum >>> shgSum) * _a2;
          pixels[yi + 2] = (bSum * mulSum >>> shgSum) * _a2;
        } else {
          pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
        }
        rSum -= rOutSum;
        gSum -= gOutSum;
        bSum -= bOutSum;
        aSum -= aOutSum;
        rOutSum -= stackIn.r;
        gOutSum -= stackIn.g;
        bOutSum -= stackIn.b;
        aOutSum -= stackIn.a;
        var _p = x + radius + 1;
        _p = yw + (_p < widthMinus1 ? _p : widthMinus1) << 2;
        rInSum += stackIn.r = pixels[_p];
        gInSum += stackIn.g = pixels[_p + 1];
        bInSum += stackIn.b = pixels[_p + 2];
        aInSum += stackIn.a = pixels[_p + 3];
        rSum += rInSum;
        gSum += gInSum;
        bSum += bInSum;
        aSum += aInSum;
        stackIn = stackIn.next;
        var _stackOut = stackOut, _r = _stackOut.r, _g = _stackOut.g, _b = _stackOut.b, _a = _stackOut.a;
        rOutSum += _r;
        gOutSum += _g;
        bOutSum += _b;
        aOutSum += _a;
        rInSum -= _r;
        gInSum -= _g;
        bInSum -= _b;
        aInSum -= _a;
        stackOut = stackOut.next;
        yi += 4;
      }
      yw += width;
    }
    for (var _x = 0; _x < width; _x++) {
      yi = _x << 2;
      var _pr = pixels[yi], _pg = pixels[yi + 1], _pb = pixels[yi + 2], _pa = pixels[yi + 3], _rOutSum = radiusPlus1 * _pr, _gOutSum = radiusPlus1 * _pg, _bOutSum = radiusPlus1 * _pb, _aOutSum = radiusPlus1 * _pa, _rSum = sumFactor * _pr, _gSum = sumFactor * _pg, _bSum = sumFactor * _pb, _aSum = sumFactor * _pa;
      stack = stackStart;
      for (var _i3 = 0; _i3 < radiusPlus1; _i3++) {
        stack.r = _pr;
        stack.g = _pg;
        stack.b = _pb;
        stack.a = _pa;
        stack = stack.next;
      }
      var yp = width;
      var _gInSum = 0, _bInSum = 0, _aInSum = 0, _rInSum = 0;
      for (var _i4 = 1; _i4 <= radius; _i4++) {
        yi = yp + _x << 2;
        var _rbs = radiusPlus1 - _i4;
        _rSum += (stack.r = _pr = pixels[yi]) * _rbs;
        _gSum += (stack.g = _pg = pixels[yi + 1]) * _rbs;
        _bSum += (stack.b = _pb = pixels[yi + 2]) * _rbs;
        _aSum += (stack.a = _pa = pixels[yi + 3]) * _rbs;
        _rInSum += _pr;
        _gInSum += _pg;
        _bInSum += _pb;
        _aInSum += _pa;
        stack = stack.next;
        if (_i4 < heightMinus1) {
          yp += width;
        }
      }
      yi = _x;
      stackIn = stackStart;
      stackOut = stackEnd;
      for (var _y = 0; _y < height; _y++) {
        var _p2 = yi << 2;
        pixels[_p2 + 3] = _pa = _aSum * mulSum >>> shgSum;
        if (_pa > 0) {
          _pa = 255 / _pa;
          pixels[_p2] = (_rSum * mulSum >>> shgSum) * _pa;
          pixels[_p2 + 1] = (_gSum * mulSum >>> shgSum) * _pa;
          pixels[_p2 + 2] = (_bSum * mulSum >>> shgSum) * _pa;
        } else {
          pixels[_p2] = pixels[_p2 + 1] = pixels[_p2 + 2] = 0;
        }
        _rSum -= _rOutSum;
        _gSum -= _gOutSum;
        _bSum -= _bOutSum;
        _aSum -= _aOutSum;
        _rOutSum -= stackIn.r;
        _gOutSum -= stackIn.g;
        _bOutSum -= stackIn.b;
        _aOutSum -= stackIn.a;
        _p2 = _x + ((_p2 = _y + radiusPlus1) < heightMinus1 ? _p2 : heightMinus1) * width << 2;
        _rSum += _rInSum += stackIn.r = pixels[_p2];
        _gSum += _gInSum += stackIn.g = pixels[_p2 + 1];
        _bSum += _bInSum += stackIn.b = pixels[_p2 + 2];
        _aSum += _aInSum += stackIn.a = pixels[_p2 + 3];
        stackIn = stackIn.next;
        _rOutSum += _pr = stackOut.r;
        _gOutSum += _pg = stackOut.g;
        _bOutSum += _pb = stackOut.b;
        _aOutSum += _pa = stackOut.a;
        _rInSum -= _pr;
        _gInSum -= _pg;
        _bInSum -= _pb;
        _aInSum -= _pa;
        stackOut = stackOut.next;
        yi += width;
      }
    }
    return imageData;
  }
  var BlurStack = (
    /**
     * Set properties.
     */
    function BlurStack2() {
      _classCallCheck(this, BlurStack2);
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
      this.next = null;
    }
  );
  function offscreen() {
    let { DOMParser: DOMParserFallback } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const preset2 = {
      window: null,
      ignoreAnimation: true,
      ignoreMouse: true,
      DOMParser: DOMParserFallback,
      createCanvas(width, height) {
        return new OffscreenCanvas(width, height);
      },
      async createImage(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        const img = await createImageBitmap(blob);
        return img;
      }
    };
    if (typeof globalThis.DOMParser !== "undefined" || typeof DOMParserFallback === "undefined") {
      Reflect.deleteProperty(preset2, "DOMParser");
    }
    return preset2;
  }
  function node(param) {
    let { DOMParser: DOMParser2, canvas, fetch: fetch2 } = param;
    return {
      window: null,
      ignoreAnimation: true,
      ignoreMouse: true,
      DOMParser: DOMParser2,
      fetch: fetch2,
      createCanvas: canvas.createCanvas,
      createImage: canvas.loadImage
    };
  }
  var index = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    offscreen,
    node
  });
  function compressSpaces(str) {
    return str.replace(/(?!\u3000)\s+/gm, " ");
  }
  function trimLeft(str) {
    return str.replace(/^[\n \t]+/, "");
  }
  function trimRight(str) {
    return str.replace(/[\n \t]+$/, "");
  }
  function toNumbers(str) {
    const matches = str.match(/-?(\d+(?:\.\d*(?:[eE][+-]?\d+)?)?|\.\d+)(?=\D|$)/gm);
    return matches ? matches.map(parseFloat) : [];
  }
  function toMatrixValue(str) {
    const numbers = toNumbers(str);
    const matrix = [
      numbers[0] || 0,
      numbers[1] || 0,
      numbers[2] || 0,
      numbers[3] || 0,
      numbers[4] || 0,
      numbers[5] || 0
    ];
    return matrix;
  }
  const allUppercase = /^[A-Z-]+$/;
  function normalizeAttributeName(name) {
    if (allUppercase.test(name)) {
      return name.toLowerCase();
    }
    return name;
  }
  function parseExternalUrl(url) {
    const urlMatch = /url\(('([^']+)'|"([^"]+)"|([^'")]+))\)/.exec(url);
    if (!urlMatch) {
      return "";
    }
    return urlMatch[2] || urlMatch[3] || urlMatch[4] || "";
  }
  function normalizeColor(color) {
    if (!color.startsWith("rgb")) {
      return color;
    }
    let rgbParts = 3;
    const normalizedColor = color.replace(
      /\d+(\.\d+)?/g,
      (num, isFloat) => rgbParts-- && isFloat ? String(Math.round(parseFloat(num))) : num
    );
    return normalizedColor;
  }
  const attributeRegex = /(\[[^\]]+\])/g;
  const idRegex = /(#[^\s+>~.[:]+)/g;
  const classRegex = /(\.[^\s+>~.[:]+)/g;
  const pseudoElementRegex = /(::[^\s+>~.[:]+|:first-line|:first-letter|:before|:after)/gi;
  const pseudoClassWithBracketsRegex = /(:[\w-]+\([^)]*\))/gi;
  const pseudoClassRegex = /(:[^\s+>~.[:]+)/g;
  const elementRegex = /([^\s+>~.[:]+)/g;
  function findSelectorMatch(selector, regex) {
    const matches = regex.exec(selector);
    if (!matches) {
      return [
        selector,
        0
      ];
    }
    return [
      selector.replace(regex, " "),
      matches.length
    ];
  }
  function getSelectorSpecificity(selector) {
    const specificity = [
      0,
      0,
      0
    ];
    let currentSelector = selector.replace(/:not\(([^)]*)\)/g, "     $1 ").replace(/{[\s\S]*/gm, " ");
    let delta = 0;
    [currentSelector, delta] = findSelectorMatch(currentSelector, attributeRegex);
    specificity[1] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, idRegex);
    specificity[0] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, classRegex);
    specificity[1] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoElementRegex);
    specificity[2] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoClassWithBracketsRegex);
    specificity[1] += delta;
    [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoClassRegex);
    specificity[1] += delta;
    currentSelector = currentSelector.replace(/[*\s+>~]/g, " ").replace(/[#.]/g, " ");
    [currentSelector, delta] = findSelectorMatch(currentSelector, elementRegex);
    specificity[2] += delta;
    return specificity.join("");
  }
  const PSEUDO_ZERO = 1e-8;
  function vectorMagnitude(v2) {
    return Math.sqrt(Math.pow(v2[0], 2) + Math.pow(v2[1], 2));
  }
  function vectorsRatio(u2, v2) {
    return (u2[0] * v2[0] + u2[1] * v2[1]) / (vectorMagnitude(u2) * vectorMagnitude(v2));
  }
  function vectorsAngle(u2, v2) {
    return (u2[0] * v2[1] < u2[1] * v2[0] ? -1 : 1) * Math.acos(vectorsRatio(u2, v2));
  }
  function CB1(t2) {
    return t2 * t2 * t2;
  }
  function CB2(t2) {
    return 3 * t2 * t2 * (1 - t2);
  }
  function CB3(t2) {
    return 3 * t2 * (1 - t2) * (1 - t2);
  }
  function CB4(t2) {
    return (1 - t2) * (1 - t2) * (1 - t2);
  }
  function QB1(t2) {
    return t2 * t2;
  }
  function QB2(t2) {
    return 2 * t2 * (1 - t2);
  }
  function QB3(t2) {
    return (1 - t2) * (1 - t2);
  }
  class Property {
    static empty(document2) {
      return new Property(document2, "EMPTY", "");
    }
    split() {
      let separator = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : " ";
      const { document: document2, name } = this;
      return compressSpaces(this.getString()).trim().split(separator).map(
        (value) => new Property(document2, name, value)
      );
    }
    hasValue(zeroIsValue) {
      const value = this.value;
      return value !== null && value !== "" && (zeroIsValue || value !== 0) && typeof value !== "undefined";
    }
    isString(regexp) {
      const { value } = this;
      const result = typeof value === "string";
      if (!result || !regexp) {
        return result;
      }
      return regexp.test(value);
    }
    isUrlDefinition() {
      return this.isString(/^url\(/);
    }
    isPixels() {
      if (!this.hasValue()) {
        return false;
      }
      const asString = this.getString();
      switch (true) {
        case asString.endsWith("px"):
        case /^[0-9]+$/.test(asString):
          return true;
        default:
          return false;
      }
    }
    setValue(value) {
      this.value = value;
      return this;
    }
    getValue(def) {
      if (typeof def === "undefined" || this.hasValue()) {
        return this.value;
      }
      return def;
    }
    getNumber(def) {
      if (!this.hasValue()) {
        if (typeof def === "undefined") {
          return 0;
        }
        return parseFloat(def);
      }
      const { value } = this;
      let n2 = parseFloat(value);
      if (this.isString(/%$/)) {
        n2 /= 100;
      }
      return n2;
    }
    getString(def) {
      if (typeof def === "undefined" || this.hasValue()) {
        return typeof this.value === "undefined" ? "" : String(this.value);
      }
      return String(def);
    }
    getColor(def) {
      let color = this.getString(def);
      if (this.isNormalizedColor) {
        return color;
      }
      this.isNormalizedColor = true;
      color = normalizeColor(color);
      this.value = color;
      return color;
    }
    getDpi() {
      return 96;
    }
    getRem() {
      return this.document.rootEmSize;
    }
    getEm() {
      return this.document.emSize;
    }
    getUnits() {
      return this.getString().replace(/[0-9.-]/g, "");
    }
    getPixels(axisOrIsFontSize) {
      let processPercent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (!this.hasValue()) {
        return 0;
      }
      const [axis, isFontSize] = typeof axisOrIsFontSize === "boolean" ? [
        void 0,
        axisOrIsFontSize
      ] : [
        axisOrIsFontSize
      ];
      const { viewPort } = this.document.screen;
      switch (true) {
        case this.isString(/vmin$/):
          return this.getNumber() / 100 * Math.min(viewPort.computeSize("x"), viewPort.computeSize("y"));
        case this.isString(/vmax$/):
          return this.getNumber() / 100 * Math.max(viewPort.computeSize("x"), viewPort.computeSize("y"));
        case this.isString(/vw$/):
          return this.getNumber() / 100 * viewPort.computeSize("x");
        case this.isString(/vh$/):
          return this.getNumber() / 100 * viewPort.computeSize("y");
        case this.isString(/rem$/):
          return this.getNumber() * this.getRem();
        case this.isString(/em$/):
          return this.getNumber() * this.getEm();
        case this.isString(/ex$/):
          return this.getNumber() * this.getEm() / 2;
        case this.isString(/px$/):
          return this.getNumber();
        case this.isString(/pt$/):
          return this.getNumber() * this.getDpi() * (1 / 72);
        case this.isString(/pc$/):
          return this.getNumber() * 15;
        case this.isString(/cm$/):
          return this.getNumber() * this.getDpi() / 2.54;
        case this.isString(/mm$/):
          return this.getNumber() * this.getDpi() / 25.4;
        case this.isString(/in$/):
          return this.getNumber() * this.getDpi();
        case (this.isString(/%$/) && isFontSize):
          return this.getNumber() * this.getEm();
        case this.isString(/%$/):
          return this.getNumber() * viewPort.computeSize(axis);
        default: {
          const n2 = this.getNumber();
          if (processPercent && n2 < 1) {
            return n2 * viewPort.computeSize(axis);
          }
          return n2;
        }
      }
    }
    getMilliseconds() {
      if (!this.hasValue()) {
        return 0;
      }
      if (this.isString(/ms$/)) {
        return this.getNumber();
      }
      return this.getNumber() * 1e3;
    }
    getRadians() {
      if (!this.hasValue()) {
        return 0;
      }
      switch (true) {
        case this.isString(/deg$/):
          return this.getNumber() * (Math.PI / 180);
        case this.isString(/grad$/):
          return this.getNumber() * (Math.PI / 200);
        case this.isString(/rad$/):
          return this.getNumber();
        default:
          return this.getNumber() * (Math.PI / 180);
      }
    }
    getDefinition() {
      const asString = this.getString();
      const match = /#([^)'"]+)/.exec(asString);
      const name = (match === null || match === void 0 ? void 0 : match[1]) || asString;
      return this.document.definitions[name];
    }
    getFillStyleDefinition(element, opacity) {
      let def = this.getDefinition();
      if (!def) {
        return null;
      }
      if (typeof def.createGradient === "function" && "getBoundingBox" in element) {
        return def.createGradient(this.document.ctx, element, opacity);
      }
      if (typeof def.createPattern === "function") {
        if (def.getHrefAttribute().hasValue()) {
          const patternTransform = def.getAttribute("patternTransform");
          def = def.getHrefAttribute().getDefinition();
          if (def && patternTransform.hasValue()) {
            def.getAttribute("patternTransform", true).setValue(patternTransform.value);
          }
        }
        if (def) {
          return def.createPattern(this.document.ctx, element, opacity);
        }
      }
      return null;
    }
    getTextBaseline() {
      if (!this.hasValue()) {
        return null;
      }
      const key = this.getString();
      return Property.textBaselineMapping[key] || null;
    }
    addOpacity(opacity) {
      let value = this.getColor();
      const len = value.length;
      let commas = 0;
      for (let i2 = 0; i2 < len; i2++) {
        if (value[i2] === ",") {
          commas++;
        }
        if (commas === 3) {
          break;
        }
      }
      if (opacity.hasValue() && this.isString() && commas !== 3) {
        const color = new RGBColor$1(value);
        if (color.ok) {
          color.alpha = opacity.getNumber();
          value = color.toRGBA();
        }
      }
      return new Property(this.document, this.name, value);
    }
    constructor(document2, name, value) {
      this.document = document2;
      this.name = name;
      this.value = value;
      this.isNormalizedColor = false;
    }
  }
  Property.textBaselineMapping = {
    "baseline": "alphabetic",
    "before-edge": "top",
    "text-before-edge": "top",
    "middle": "middle",
    "central": "middle",
    "after-edge": "bottom",
    "text-after-edge": "bottom",
    "ideographic": "ideographic",
    "alphabetic": "alphabetic",
    "hanging": "hanging",
    "mathematical": "alphabetic"
  };
  class ViewPort {
    clear() {
      this.viewPorts = [];
    }
    setCurrent(width, height) {
      this.viewPorts.push({
        width,
        height
      });
    }
    removeCurrent() {
      this.viewPorts.pop();
    }
    getRoot() {
      const [root] = this.viewPorts;
      if (!root) {
        return getDefault();
      }
      return root;
    }
    getCurrent() {
      const { viewPorts } = this;
      const current = viewPorts[viewPorts.length - 1];
      if (!current) {
        return getDefault();
      }
      return current;
    }
    get width() {
      return this.getCurrent().width;
    }
    get height() {
      return this.getCurrent().height;
    }
    computeSize(d) {
      if (typeof d === "number") {
        return d;
      }
      if (d === "x") {
        return this.width;
      }
      if (d === "y") {
        return this.height;
      }
      return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) / Math.sqrt(2);
    }
    constructor() {
      this.viewPorts = [];
    }
  }
  ViewPort.DEFAULT_VIEWPORT_WIDTH = 800;
  ViewPort.DEFAULT_VIEWPORT_HEIGHT = 600;
  function getDefault() {
    return {
      width: ViewPort.DEFAULT_VIEWPORT_WIDTH,
      height: ViewPort.DEFAULT_VIEWPORT_HEIGHT
    };
  }
  class Point {
    static parse(point) {
      let defaultValue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      const [x = defaultValue, y2 = defaultValue] = toNumbers(point);
      return new Point(x, y2);
    }
    static parseScale(scale) {
      let defaultValue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      const [x = defaultValue, y2 = x] = toNumbers(scale);
      return new Point(x, y2);
    }
    static parsePath(path) {
      const points = toNumbers(path);
      const len = points.length;
      const pathPoints = [];
      for (let i2 = 0; i2 < len; i2 += 2) {
        pathPoints.push(new Point(points[i2], points[i2 + 1]));
      }
      return pathPoints;
    }
    angleTo(point) {
      return Math.atan2(point.y - this.y, point.x - this.x);
    }
    applyTransform(transform) {
      const { x, y: y2 } = this;
      const xp = x * transform[0] + y2 * transform[2] + transform[4];
      const yp = x * transform[1] + y2 * transform[3] + transform[5];
      this.x = xp;
      this.y = yp;
    }
    constructor(x, y2) {
      this.x = x;
      this.y = y2;
    }
  }
  class Mouse {
    isWorking() {
      return this.working;
    }
    start() {
      if (this.working) {
        return;
      }
      const { screen, onClick, onMouseMove } = this;
      const canvas = screen.ctx.canvas;
      canvas.onclick = onClick;
      canvas.onmousemove = onMouseMove;
      this.working = true;
    }
    stop() {
      if (!this.working) {
        return;
      }
      const canvas = this.screen.ctx.canvas;
      this.working = false;
      canvas.onclick = null;
      canvas.onmousemove = null;
    }
    hasEvents() {
      return this.working && this.events.length > 0;
    }
    runEvents() {
      if (!this.working) {
        return;
      }
      const { screen: document2, events, eventElements } = this;
      const { style } = document2.ctx.canvas;
      let element;
      if (style) {
        style.cursor = "";
      }
      events.forEach((param, i2) => {
        let { run } = param;
        element = eventElements[i2];
        while (element) {
          run(element);
          element = element.parent;
        }
      });
      this.events = [];
      this.eventElements = [];
    }
    checkPath(element, ctx) {
      if (!this.working || !ctx) {
        return;
      }
      const { events, eventElements } = this;
      events.forEach((param, i2) => {
        let { x, y: y2 } = param;
        if (!eventElements[i2] && ctx.isPointInPath && ctx.isPointInPath(x, y2)) {
          eventElements[i2] = element;
        }
      });
    }
    checkBoundingBox(element, boundingBox) {
      if (!this.working || !boundingBox) {
        return;
      }
      const { events, eventElements } = this;
      events.forEach((param, i2) => {
        let { x, y: y2 } = param;
        if (!eventElements[i2] && boundingBox.isPointInBox(x, y2)) {
          eventElements[i2] = element;
        }
      });
    }
    mapXY(x, y2) {
      const { window: window2, ctx } = this.screen;
      const point = new Point(x, y2);
      let element = ctx.canvas;
      while (element) {
        point.x -= element.offsetLeft;
        point.y -= element.offsetTop;
        element = element.offsetParent;
      }
      if (window2 === null || window2 === void 0 ? void 0 : window2.scrollX) {
        point.x += window2.scrollX;
      }
      if (window2 === null || window2 === void 0 ? void 0 : window2.scrollY) {
        point.y += window2.scrollY;
      }
      return point;
    }
    onClick(event) {
      const { x, y: y2 } = this.mapXY(event.clientX, event.clientY);
      this.events.push({
        type: "onclick",
        x,
        y: y2,
        run(eventTarget) {
          if (eventTarget.onClick) {
            eventTarget.onClick();
          }
        }
      });
    }
    onMouseMove(event) {
      const { x, y: y2 } = this.mapXY(event.clientX, event.clientY);
      this.events.push({
        type: "onmousemove",
        x,
        y: y2,
        run(eventTarget) {
          if (eventTarget.onMouseMove) {
            eventTarget.onMouseMove();
          }
        }
      });
    }
    constructor(screen) {
      this.screen = screen;
      this.working = false;
      this.events = [];
      this.eventElements = [];
      this.onClick = this.onClick.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
    }
  }
  const defaultWindow = typeof window !== "undefined" ? window : null;
  const defaultFetch$1 = typeof fetch !== "undefined" ? fetch.bind(void 0) : void 0;
  class Screen {
    wait(checker) {
      this.waits.push(checker);
    }
    ready() {
      if (!this.readyPromise) {
        return Promise.resolve();
      }
      return this.readyPromise;
    }
    isReady() {
      if (this.isReadyLock) {
        return true;
      }
      const isReadyLock = this.waits.every(
        (_2) => _2()
      );
      if (isReadyLock) {
        this.waits = [];
        if (this.resolveReady) {
          this.resolveReady();
        }
      }
      this.isReadyLock = isReadyLock;
      return isReadyLock;
    }
    setDefaults(ctx) {
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
      ctx.miterLimit = 4;
    }
    setViewBox(param) {
      let { document: document2, ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX = 0, minY = 0, refX, refY, clip = false, clipX = 0, clipY = 0 } = param;
      const cleanAspectRatio = compressSpaces(aspectRatio).replace(/^defer\s/, "");
      const [aspectRatioAlign, aspectRatioMeetOrSlice] = cleanAspectRatio.split(" ");
      const align = aspectRatioAlign || "xMidYMid";
      const meetOrSlice = aspectRatioMeetOrSlice || "meet";
      const scaleX = width / desiredWidth;
      const scaleY = height / desiredHeight;
      const scaleMin = Math.min(scaleX, scaleY);
      const scaleMax = Math.max(scaleX, scaleY);
      let finalDesiredWidth = desiredWidth;
      let finalDesiredHeight = desiredHeight;
      if (meetOrSlice === "meet") {
        finalDesiredWidth *= scaleMin;
        finalDesiredHeight *= scaleMin;
      }
      if (meetOrSlice === "slice") {
        finalDesiredWidth *= scaleMax;
        finalDesiredHeight *= scaleMax;
      }
      const refXProp = new Property(document2, "refX", refX);
      const refYProp = new Property(document2, "refY", refY);
      const hasRefs = refXProp.hasValue() && refYProp.hasValue();
      if (hasRefs) {
        ctx.translate(-scaleMin * refXProp.getPixels("x"), -scaleMin * refYProp.getPixels("y"));
      }
      if (clip) {
        const scaledClipX = scaleMin * clipX;
        const scaledClipY = scaleMin * clipY;
        ctx.beginPath();
        ctx.moveTo(scaledClipX, scaledClipY);
        ctx.lineTo(width, scaledClipY);
        ctx.lineTo(width, height);
        ctx.lineTo(scaledClipX, height);
        ctx.closePath();
        ctx.clip();
      }
      if (!hasRefs) {
        const isMeetMinY = meetOrSlice === "meet" && scaleMin === scaleY;
        const isSliceMaxY = meetOrSlice === "slice" && scaleMax === scaleY;
        const isMeetMinX = meetOrSlice === "meet" && scaleMin === scaleX;
        const isSliceMaxX = meetOrSlice === "slice" && scaleMax === scaleX;
        if (align.startsWith("xMid") && (isMeetMinY || isSliceMaxY)) {
          ctx.translate(width / 2 - finalDesiredWidth / 2, 0);
        }
        if (align.endsWith("YMid") && (isMeetMinX || isSliceMaxX)) {
          ctx.translate(0, height / 2 - finalDesiredHeight / 2);
        }
        if (align.startsWith("xMax") && (isMeetMinY || isSliceMaxY)) {
          ctx.translate(width - finalDesiredWidth, 0);
        }
        if (align.endsWith("YMax") && (isMeetMinX || isSliceMaxX)) {
          ctx.translate(0, height - finalDesiredHeight);
        }
      }
      switch (true) {
        case align === "none":
          ctx.scale(scaleX, scaleY);
          break;
        case meetOrSlice === "meet":
          ctx.scale(scaleMin, scaleMin);
          break;
        case meetOrSlice === "slice":
          ctx.scale(scaleMax, scaleMax);
          break;
      }
      ctx.translate(-minX, -minY);
    }
    start(element) {
      let { enableRedraw = false, ignoreMouse = false, ignoreAnimation = false, ignoreDimensions = false, ignoreClear = false, forceRedraw, scaleWidth, scaleHeight, offsetX, offsetY } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      const { mouse } = this;
      const frameDuration = 1e3 / Screen.FRAMERATE;
      this.isReadyLock = false;
      this.frameDuration = frameDuration;
      this.readyPromise = new Promise((resolve) => {
        this.resolveReady = resolve;
      });
      if (this.isReady()) {
        this.render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY);
      }
      if (!enableRedraw) {
        return;
      }
      let now = Date.now();
      let then = now;
      let delta = 0;
      const tick = () => {
        now = Date.now();
        delta = now - then;
        if (delta >= frameDuration) {
          then = now - delta % frameDuration;
          if (this.shouldUpdate(ignoreAnimation, forceRedraw)) {
            this.render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY);
            mouse.runEvents();
          }
        }
        this.intervalId = requestAnimationFrame(tick);
      };
      if (!ignoreMouse) {
        mouse.start();
      }
      this.intervalId = requestAnimationFrame(tick);
    }
    stop() {
      if (this.intervalId) {
        requestAnimationFrame.cancel(this.intervalId);
        this.intervalId = null;
      }
      this.mouse.stop();
    }
    shouldUpdate(ignoreAnimation, forceRedraw) {
      if (!ignoreAnimation) {
        const { frameDuration } = this;
        const shouldUpdate1 = this.animations.reduce(
          (shouldUpdate, animation) => animation.update(frameDuration) || shouldUpdate,
          false
        );
        if (shouldUpdate1) {
          return true;
        }
      }
      if (typeof forceRedraw === "function" && forceRedraw()) {
        return true;
      }
      if (!this.isReadyLock && this.isReady()) {
        return true;
      }
      if (this.mouse.hasEvents()) {
        return true;
      }
      return false;
    }
    render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY) {
      const { viewPort, ctx, isFirstRender } = this;
      const canvas = ctx.canvas;
      viewPort.clear();
      if (canvas.width && canvas.height) {
        viewPort.setCurrent(canvas.width, canvas.height);
      }
      const widthStyle = element.getStyle("width");
      const heightStyle = element.getStyle("height");
      if (!ignoreDimensions && (isFirstRender || typeof scaleWidth !== "number" && typeof scaleHeight !== "number")) {
        if (widthStyle.hasValue()) {
          canvas.width = widthStyle.getPixels("x");
          if (canvas.style) {
            canvas.style.width = "".concat(canvas.width, "px");
          }
        }
        if (heightStyle.hasValue()) {
          canvas.height = heightStyle.getPixels("y");
          if (canvas.style) {
            canvas.style.height = "".concat(canvas.height, "px");
          }
        }
      }
      let cWidth = canvas.clientWidth || canvas.width;
      let cHeight = canvas.clientHeight || canvas.height;
      if (ignoreDimensions && widthStyle.hasValue() && heightStyle.hasValue()) {
        cWidth = widthStyle.getPixels("x");
        cHeight = heightStyle.getPixels("y");
      }
      viewPort.setCurrent(cWidth, cHeight);
      if (typeof offsetX === "number") {
        element.getAttribute("x", true).setValue(offsetX);
      }
      if (typeof offsetY === "number") {
        element.getAttribute("y", true).setValue(offsetY);
      }
      if (typeof scaleWidth === "number" || typeof scaleHeight === "number") {
        const viewBox = toNumbers(element.getAttribute("viewBox").getString());
        let xRatio = 0;
        let yRatio = 0;
        if (typeof scaleWidth === "number") {
          const widthStyle2 = element.getStyle("width");
          if (widthStyle2.hasValue()) {
            xRatio = widthStyle2.getPixels("x") / scaleWidth;
          } else if (viewBox[2] && !isNaN(viewBox[2])) {
            xRatio = viewBox[2] / scaleWidth;
          }
        }
        if (typeof scaleHeight === "number") {
          const heightStyle2 = element.getStyle("height");
          if (heightStyle2.hasValue()) {
            yRatio = heightStyle2.getPixels("y") / scaleHeight;
          } else if (viewBox[3] && !isNaN(viewBox[3])) {
            yRatio = viewBox[3] / scaleHeight;
          }
        }
        if (!xRatio) {
          xRatio = yRatio;
        }
        if (!yRatio) {
          yRatio = xRatio;
        }
        element.getAttribute("width", true).setValue(scaleWidth);
        element.getAttribute("height", true).setValue(scaleHeight);
        const transformStyle = element.getStyle("transform", true, true);
        transformStyle.setValue("".concat(transformStyle.getString(), " scale(").concat(1 / xRatio, ", ").concat(1 / yRatio, ")"));
      }
      if (!ignoreClear) {
        ctx.clearRect(0, 0, cWidth, cHeight);
      }
      element.render(ctx);
      if (isFirstRender) {
        this.isFirstRender = false;
      }
    }
    constructor(ctx, { fetch: fetch2 = defaultFetch$1, window: window2 = defaultWindow } = {}) {
      this.ctx = ctx;
      this.viewPort = new ViewPort();
      this.mouse = new Mouse(this);
      this.animations = [];
      this.waits = [];
      this.frameDuration = 0;
      this.isReadyLock = false;
      this.isFirstRender = true;
      this.intervalId = null;
      this.window = window2;
      if (!fetch2) {
        throw new Error("Can't find 'fetch' in 'globalThis', please provide it via options");
      }
      this.fetch = fetch2;
    }
  }
  Screen.defaultWindow = defaultWindow;
  Screen.defaultFetch = defaultFetch$1;
  Screen.FRAMERATE = 30;
  Screen.MAX_VIRTUAL_PIXELS = 3e4;
  const { defaultFetch } = Screen;
  const DefaultDOMParser = typeof DOMParser !== "undefined" ? DOMParser : void 0;
  class Parser {
    async parse(resource) {
      if (resource.startsWith("<")) {
        return this.parseFromString(resource);
      }
      return this.load(resource);
    }
    parseFromString(xml) {
      const parser = new this.DOMParser();
      try {
        return this.checkDocument(parser.parseFromString(xml, "image/svg+xml"));
      } catch (err) {
        return this.checkDocument(parser.parseFromString(xml, "text/xml"));
      }
    }
    checkDocument(document2) {
      const parserError = document2.getElementsByTagName("parsererror")[0];
      if (parserError) {
        throw new Error(parserError.textContent || "Unknown parse error");
      }
      return document2;
    }
    async load(url) {
      const response = await this.fetch(url);
      const xml = await response.text();
      return this.parseFromString(xml);
    }
    constructor({ fetch: fetch2 = defaultFetch, DOMParser: DOMParser2 = DefaultDOMParser } = {}) {
      if (!fetch2) {
        throw new Error("Can't find 'fetch' in 'globalThis', please provide it via options");
      }
      if (!DOMParser2) {
        throw new Error("Can't find 'DOMParser' in 'globalThis', please provide it via options");
      }
      this.fetch = fetch2;
      this.DOMParser = DOMParser2;
    }
  }
  class Translate {
    apply(ctx) {
      const { x, y: y2 } = this.point;
      ctx.translate(x || 0, y2 || 0);
    }
    unapply(ctx) {
      const { x, y: y2 } = this.point;
      ctx.translate(-1 * x || 0, -1 * y2 || 0);
    }
    applyToPoint(point) {
      const { x, y: y2 } = this.point;
      point.applyTransform([
        1,
        0,
        0,
        1,
        x || 0,
        y2 || 0
      ]);
    }
    constructor(_2, point) {
      this.type = "translate";
      this.point = Point.parse(point);
    }
  }
  class Rotate {
    apply(ctx) {
      const { cx, cy, originX, originY, angle } = this;
      const tx = cx + originX.getPixels("x");
      const ty = cy + originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.rotate(angle.getRadians());
      ctx.translate(-tx, -ty);
    }
    unapply(ctx) {
      const { cx, cy, originX, originY, angle } = this;
      const tx = cx + originX.getPixels("x");
      const ty = cy + originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.rotate(-1 * angle.getRadians());
      ctx.translate(-tx, -ty);
    }
    applyToPoint(point) {
      const { cx, cy, angle } = this;
      const rad = angle.getRadians();
      point.applyTransform([
        1,
        0,
        0,
        1,
        cx || 0,
        cy || 0
        // this.p.y
      ]);
      point.applyTransform([
        Math.cos(rad),
        Math.sin(rad),
        -Math.sin(rad),
        Math.cos(rad),
        0,
        0
      ]);
      point.applyTransform([
        1,
        0,
        0,
        1,
        -cx || 0,
        -cy || 0
        // -this.p.y
      ]);
    }
    constructor(document2, rotate, transformOrigin) {
      this.type = "rotate";
      const numbers = toNumbers(rotate);
      this.angle = new Property(document2, "angle", numbers[0]);
      this.originX = transformOrigin[0];
      this.originY = transformOrigin[1];
      this.cx = numbers[1] || 0;
      this.cy = numbers[2] || 0;
    }
  }
  class Scale {
    apply(ctx) {
      const { scale: { x, y: y2 }, originX, originY } = this;
      const tx = originX.getPixels("x");
      const ty = originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.scale(x, y2 || x);
      ctx.translate(-tx, -ty);
    }
    unapply(ctx) {
      const { scale: { x, y: y2 }, originX, originY } = this;
      const tx = originX.getPixels("x");
      const ty = originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.scale(1 / x, 1 / y2 || x);
      ctx.translate(-tx, -ty);
    }
    applyToPoint(point) {
      const { x, y: y2 } = this.scale;
      point.applyTransform([
        x || 0,
        0,
        0,
        y2 || 0,
        0,
        0
      ]);
    }
    constructor(_2, scale, transformOrigin) {
      this.type = "scale";
      const scaleSize = Point.parseScale(scale);
      if (scaleSize.x === 0 || scaleSize.y === 0) {
        scaleSize.x = PSEUDO_ZERO;
        scaleSize.y = PSEUDO_ZERO;
      }
      this.scale = scaleSize;
      this.originX = transformOrigin[0];
      this.originY = transformOrigin[1];
    }
  }
  class Matrix {
    apply(ctx) {
      const { originX, originY, matrix } = this;
      const tx = originX.getPixels("x");
      const ty = originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
      ctx.translate(-tx, -ty);
    }
    unapply(ctx) {
      const { originX, originY, matrix } = this;
      const a2 = matrix[0];
      const b = matrix[2];
      const c2 = matrix[4];
      const d = matrix[1];
      const e2 = matrix[3];
      const f2 = matrix[5];
      const g = 0;
      const h2 = 0;
      const i2 = 1;
      const det = 1 / (a2 * (e2 * i2 - f2 * h2) - b * (d * i2 - f2 * g) + c2 * (d * h2 - e2 * g));
      const tx = originX.getPixels("x");
      const ty = originY.getPixels("y");
      ctx.translate(tx, ty);
      ctx.transform(det * (e2 * i2 - f2 * h2), det * (f2 * g - d * i2), det * (c2 * h2 - b * i2), det * (a2 * i2 - c2 * g), det * (b * f2 - c2 * e2), det * (c2 * d - a2 * f2));
      ctx.translate(-tx, -ty);
    }
    applyToPoint(point) {
      point.applyTransform(this.matrix);
    }
    constructor(_2, matrix, transformOrigin) {
      this.type = "matrix";
      this.matrix = toMatrixValue(matrix);
      this.originX = transformOrigin[0];
      this.originY = transformOrigin[1];
    }
  }
  class Skew extends Matrix {
    constructor(document2, skew, transformOrigin) {
      super(document2, skew, transformOrigin);
      this.type = "skew";
      this.angle = new Property(document2, "angle", skew);
    }
  }
  class SkewX extends Skew {
    constructor(document2, skew, transformOrigin) {
      super(document2, skew, transformOrigin);
      this.type = "skewX";
      this.matrix = [
        1,
        0,
        Math.tan(this.angle.getRadians()),
        1,
        0,
        0
      ];
    }
  }
  class SkewY extends Skew {
    constructor(document2, skew, transformOrigin) {
      super(document2, skew, transformOrigin);
      this.type = "skewY";
      this.matrix = [
        1,
        Math.tan(this.angle.getRadians()),
        0,
        1,
        0,
        0
      ];
    }
  }
  function parseTransforms(transform) {
    return compressSpaces(transform).trim().replace(/\)([a-zA-Z])/g, ") $1").replace(/\)(\s?,\s?)/g, ") ").split(/\s(?=[a-z])/);
  }
  function parseTransform(transform) {
    const [type = "", value = ""] = transform.split("(");
    return [
      type.trim(),
      value.trim().replace(")", "")
    ];
  }
  class Transform {
    static fromElement(document2, element) {
      const transformStyle = element.getStyle("transform", false, true);
      if (transformStyle.hasValue()) {
        const [transformOriginXProperty, transformOriginYProperty = transformOriginXProperty] = element.getStyle("transform-origin", false, true).split();
        if (transformOriginXProperty && transformOriginYProperty) {
          const transformOrigin = [
            transformOriginXProperty,
            transformOriginYProperty
          ];
          return new Transform(document2, transformStyle.getString(), transformOrigin);
        }
      }
      return null;
    }
    apply(ctx) {
      this.transforms.forEach(
        (transform) => transform.apply(ctx)
      );
    }
    unapply(ctx) {
      this.transforms.forEach(
        (transform) => transform.unapply(ctx)
      );
    }
    // TODO: applyToPoint unused ... remove?
    applyToPoint(point) {
      this.transforms.forEach(
        (transform) => transform.applyToPoint(point)
      );
    }
    constructor(document2, transform1, transformOrigin) {
      this.document = document2;
      this.transforms = [];
      const data = parseTransforms(transform1);
      data.forEach((transform) => {
        if (transform === "none") {
          return;
        }
        const [type, value] = parseTransform(transform);
        const TransformType = Transform.transformTypes[type];
        if (TransformType) {
          this.transforms.push(new TransformType(this.document, value, transformOrigin));
        }
      });
    }
  }
  Transform.transformTypes = {
    translate: Translate,
    rotate: Rotate,
    scale: Scale,
    matrix: Matrix,
    skewX: SkewX,
    skewY: SkewY
  };
  class Element {
    getAttribute(name) {
      let createIfNotExists = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      const attr = this.attributes[name];
      if (!attr && createIfNotExists) {
        const attr2 = new Property(this.document, name, "");
        this.attributes[name] = attr2;
        return attr2;
      }
      return attr || Property.empty(this.document);
    }
    getHrefAttribute() {
      let href;
      for (const key in this.attributes) {
        if (key === "href" || key.endsWith(":href")) {
          href = this.attributes[key];
          break;
        }
      }
      return href || Property.empty(this.document);
    }
    getStyle(name) {
      let createIfNotExists = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, skipAncestors = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      const style = this.styles[name];
      if (style) {
        return style;
      }
      const attr = this.getAttribute(name);
      if (attr.hasValue()) {
        this.styles[name] = attr;
        return attr;
      }
      if (!skipAncestors) {
        const { parent } = this;
        if (parent) {
          const parentStyle = parent.getStyle(name);
          if (parentStyle.hasValue()) {
            return parentStyle;
          }
        }
      }
      if (createIfNotExists) {
        const style2 = new Property(this.document, name, "");
        this.styles[name] = style2;
        return style2;
      }
      return Property.empty(this.document);
    }
    render(ctx) {
      if (this.getStyle("display").getString() === "none" || this.getStyle("visibility").getString() === "hidden") {
        return;
      }
      ctx.save();
      if (this.getStyle("mask").hasValue()) {
        const mask = this.getStyle("mask").getDefinition();
        if (mask) {
          this.applyEffects(ctx);
          mask.apply(ctx, this);
        }
      } else if (this.getStyle("filter").getValue("none") !== "none") {
        const filter = this.getStyle("filter").getDefinition();
        if (filter) {
          this.applyEffects(ctx);
          filter.apply(ctx, this);
        }
      } else {
        this.setContext(ctx);
        this.renderChildren(ctx);
        this.clearContext(ctx);
      }
      ctx.restore();
    }
    setContext(_2) {
    }
    applyEffects(ctx) {
      const transform = Transform.fromElement(this.document, this);
      if (transform) {
        transform.apply(ctx);
      }
      const clipPathStyleProp = this.getStyle("clip-path", false, true);
      if (clipPathStyleProp.hasValue()) {
        const clip = clipPathStyleProp.getDefinition();
        if (clip) {
          clip.apply(ctx);
        }
      }
    }
    clearContext(_2) {
    }
    renderChildren(ctx) {
      this.children.forEach((child) => {
        child.render(ctx);
      });
    }
    addChild(childNode) {
      const child = childNode instanceof Element ? childNode : this.document.createElement(childNode);
      child.parent = this;
      if (!Element.ignoreChildTypes.includes(child.type)) {
        this.children.push(child);
      }
    }
    matchesSelector(selector) {
      var ref;
      const { node: node2 } = this;
      if (typeof node2.matches === "function") {
        return node2.matches(selector);
      }
      const styleClasses = (ref = node2.getAttribute) === null || ref === void 0 ? void 0 : ref.call(node2, "class");
      if (!styleClasses || styleClasses === "") {
        return false;
      }
      return styleClasses.split(" ").some(
        (styleClass) => ".".concat(styleClass) === selector
      );
    }
    addStylesFromStyleDefinition() {
      const { styles, stylesSpecificity } = this.document;
      let styleProp;
      for (const selector in styles) {
        if (!selector.startsWith("@") && this.matchesSelector(selector)) {
          const style = styles[selector];
          const specificity = stylesSpecificity[selector];
          if (style) {
            for (const name in style) {
              let existingSpecificity = this.stylesSpecificity[name];
              if (typeof existingSpecificity === "undefined") {
                existingSpecificity = "000";
              }
              if (specificity && specificity >= existingSpecificity) {
                styleProp = style[name];
                if (styleProp) {
                  this.styles[name] = styleProp;
                }
                this.stylesSpecificity[name] = specificity;
              }
            }
          }
        }
      }
    }
    removeStyles(element, ignoreStyles) {
      const toRestore1 = ignoreStyles.reduce((toRestore, name) => {
        const styleProp = element.getStyle(name);
        if (!styleProp.hasValue()) {
          return toRestore;
        }
        const value = styleProp.getString();
        styleProp.setValue("");
        return [
          ...toRestore,
          [
            name,
            value
          ]
        ];
      }, []);
      return toRestore1;
    }
    restoreStyles(element, styles) {
      styles.forEach((param) => {
        let [name, value] = param;
        element.getStyle(name, true).setValue(value);
      });
    }
    isFirstChild() {
      var ref;
      return ((ref = this.parent) === null || ref === void 0 ? void 0 : ref.children.indexOf(this)) === 0;
    }
    constructor(document2, node2, captureTextNodes = false) {
      this.document = document2;
      this.node = node2;
      this.captureTextNodes = captureTextNodes;
      this.type = "";
      this.attributes = {};
      this.styles = {};
      this.stylesSpecificity = {};
      this.animationFrozen = false;
      this.animationFrozenValue = "";
      this.parent = null;
      this.children = [];
      if (!node2 || node2.nodeType !== 1) {
        return;
      }
      Array.from(node2.attributes).forEach((attribute) => {
        const nodeName = normalizeAttributeName(attribute.nodeName);
        this.attributes[nodeName] = new Property(document2, nodeName, attribute.value);
      });
      this.addStylesFromStyleDefinition();
      if (this.getAttribute("style").hasValue()) {
        const styles = this.getAttribute("style").getString().split(";").map(
          (_2) => _2.trim()
        );
        styles.forEach((style) => {
          if (!style) {
            return;
          }
          const [name, value] = style.split(":").map(
            (_2) => _2.trim()
          );
          if (name) {
            this.styles[name] = new Property(document2, name, value);
          }
        });
      }
      const { definitions } = document2;
      const id = this.getAttribute("id");
      if (id.hasValue()) {
        if (!definitions[id.getString()]) {
          definitions[id.getString()] = this;
        }
      }
      Array.from(node2.childNodes).forEach((childNode) => {
        if (childNode.nodeType === 1) {
          this.addChild(childNode);
        } else if (captureTextNodes && (childNode.nodeType === 3 || childNode.nodeType === 4)) {
          const textNode = document2.createTextNode(childNode);
          if (textNode.getText().length > 0) {
            this.addChild(textNode);
          }
        }
      });
    }
  }
  Element.ignoreChildTypes = [
    "title"
  ];
  class UnknownElement extends Element {
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
    }
  }
  function wrapFontFamily(fontFamily) {
    const trimmed = fontFamily.trim();
    return /^('|")/.test(trimmed) ? trimmed : '"'.concat(trimmed, '"');
  }
  function prepareFontFamily(fontFamily) {
    return typeof process === "undefined" ? fontFamily : fontFamily.trim().split(",").map(wrapFontFamily).join(",");
  }
  function prepareFontStyle(fontStyle) {
    if (!fontStyle) {
      return "";
    }
    const targetFontStyle = fontStyle.trim().toLowerCase();
    switch (targetFontStyle) {
      case "normal":
      case "italic":
      case "oblique":
      case "inherit":
      case "initial":
      case "unset":
        return targetFontStyle;
      default:
        if (/^oblique\s+(-|)\d+deg$/.test(targetFontStyle)) {
          return targetFontStyle;
        }
        return "";
    }
  }
  function prepareFontWeight(fontWeight) {
    if (!fontWeight) {
      return "";
    }
    const targetFontWeight = fontWeight.trim().toLowerCase();
    switch (targetFontWeight) {
      case "normal":
      case "bold":
      case "lighter":
      case "bolder":
      case "inherit":
      case "initial":
      case "unset":
        return targetFontWeight;
      default:
        if (/^[\d.]+$/.test(targetFontWeight)) {
          return targetFontWeight;
        }
        return "";
    }
  }
  class Font {
    static parse() {
      let font = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", inherit = arguments.length > 1 ? arguments[1] : void 0;
      let fontStyle = "";
      let fontVariant = "";
      let fontWeight = "";
      let fontSize = "";
      let fontFamily = "";
      const parts = compressSpaces(font).trim().split(" ");
      const set = {
        fontSize: false,
        fontStyle: false,
        fontWeight: false,
        fontVariant: false
      };
      parts.forEach((part) => {
        switch (true) {
          case (!set.fontStyle && Font.styles.includes(part)):
            if (part !== "inherit") {
              fontStyle = part;
            }
            set.fontStyle = true;
            break;
          case (!set.fontVariant && Font.variants.includes(part)):
            if (part !== "inherit") {
              fontVariant = part;
            }
            set.fontStyle = true;
            set.fontVariant = true;
            break;
          case (!set.fontWeight && Font.weights.includes(part)):
            if (part !== "inherit") {
              fontWeight = part;
            }
            set.fontStyle = true;
            set.fontVariant = true;
            set.fontWeight = true;
            break;
          case !set.fontSize:
            if (part !== "inherit") {
              fontSize = part.split("/")[0] || "";
            }
            set.fontStyle = true;
            set.fontVariant = true;
            set.fontWeight = true;
            set.fontSize = true;
            break;
          default:
            if (part !== "inherit") {
              fontFamily += part;
            }
        }
      });
      return new Font(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit);
    }
    toString() {
      return [
        prepareFontStyle(this.fontStyle),
        this.fontVariant,
        prepareFontWeight(this.fontWeight),
        this.fontSize,
        // Wrap fontFamily only on nodejs and only for canvas.ctx
        prepareFontFamily(this.fontFamily)
      ].join(" ").trim();
    }
    constructor(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
      const inheritFont = inherit ? typeof inherit === "string" ? Font.parse(inherit) : inherit : {};
      this.fontFamily = fontFamily || inheritFont.fontFamily;
      this.fontSize = fontSize || inheritFont.fontSize;
      this.fontStyle = fontStyle || inheritFont.fontStyle;
      this.fontWeight = fontWeight || inheritFont.fontWeight;
      this.fontVariant = fontVariant || inheritFont.fontVariant;
    }
  }
  Font.styles = "normal|italic|oblique|inherit";
  Font.variants = "normal|small-caps|inherit";
  Font.weights = "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit";
  class BoundingBox {
    get x() {
      return this.x1;
    }
    get y() {
      return this.y1;
    }
    get width() {
      return this.x2 - this.x1;
    }
    get height() {
      return this.y2 - this.y1;
    }
    addPoint(x, y2) {
      if (typeof x !== "undefined") {
        if (isNaN(this.x1) || isNaN(this.x2)) {
          this.x1 = x;
          this.x2 = x;
        }
        if (x < this.x1) {
          this.x1 = x;
        }
        if (x > this.x2) {
          this.x2 = x;
        }
      }
      if (typeof y2 !== "undefined") {
        if (isNaN(this.y1) || isNaN(this.y2)) {
          this.y1 = y2;
          this.y2 = y2;
        }
        if (y2 < this.y1) {
          this.y1 = y2;
        }
        if (y2 > this.y2) {
          this.y2 = y2;
        }
      }
    }
    addX(x) {
      this.addPoint(x, 0);
    }
    addY(y2) {
      this.addPoint(0, y2);
    }
    addBoundingBox(boundingBox) {
      if (!boundingBox) {
        return;
      }
      const { x1, y1, x2, y2 } = boundingBox;
      this.addPoint(x1, y1);
      this.addPoint(x2, y2);
    }
    sumCubic(t2, p0, p1, p2, p3) {
      return Math.pow(1 - t2, 3) * p0 + 3 * Math.pow(1 - t2, 2) * t2 * p1 + 3 * (1 - t2) * Math.pow(t2, 2) * p2 + Math.pow(t2, 3) * p3;
    }
    bezierCurveAdd(forX, p0, p1, p2, p3) {
      const b = 6 * p0 - 12 * p1 + 6 * p2;
      const a2 = -3 * p0 + 9 * p1 - 9 * p2 + 3 * p3;
      const c2 = 3 * p1 - 3 * p0;
      if (a2 === 0) {
        if (b === 0) {
          return;
        }
        const t3 = -c2 / b;
        if (0 < t3 && t3 < 1) {
          if (forX) {
            this.addX(this.sumCubic(t3, p0, p1, p2, p3));
          } else {
            this.addY(this.sumCubic(t3, p0, p1, p2, p3));
          }
        }
        return;
      }
      const b2ac = Math.pow(b, 2) - 4 * c2 * a2;
      if (b2ac < 0) {
        return;
      }
      const t1 = (-b + Math.sqrt(b2ac)) / (2 * a2);
      if (0 < t1 && t1 < 1) {
        if (forX) {
          this.addX(this.sumCubic(t1, p0, p1, p2, p3));
        } else {
          this.addY(this.sumCubic(t1, p0, p1, p2, p3));
        }
      }
      const t2 = (-b - Math.sqrt(b2ac)) / (2 * a2);
      if (0 < t2 && t2 < 1) {
        if (forX) {
          this.addX(this.sumCubic(t2, p0, p1, p2, p3));
        } else {
          this.addY(this.sumCubic(t2, p0, p1, p2, p3));
        }
      }
    }
    // from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
    addBezierCurve(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
      this.addPoint(p0x, p0y);
      this.addPoint(p3x, p3y);
      this.bezierCurveAdd(true, p0x, p1x, p2x, p3x);
      this.bezierCurveAdd(false, p0y, p1y, p2y, p3y);
    }
    addQuadraticCurve(p0x, p0y, p1x, p1y, p2x, p2y) {
      const cp1x = p0x + 2 / 3 * (p1x - p0x);
      const cp1y = p0y + 2 / 3 * (p1y - p0y);
      const cp2x = cp1x + 1 / 3 * (p2x - p0x);
      const cp2y = cp1y + 1 / 3 * (p2y - p0y);
      this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
    }
    isPointInBox(x, y2) {
      const { x1, y1, x2, y2: y22 } = this;
      return x1 <= x && x <= x2 && y1 <= y2 && y2 <= y22;
    }
    constructor(x1 = Number.NaN, y1 = Number.NaN, x2 = Number.NaN, y2 = Number.NaN) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.addPoint(x1, y1);
      this.addPoint(x2, y2);
    }
  }
  class RenderedElement extends Element {
    calculateOpacity() {
      let opacity = 1;
      let element = this;
      while (element) {
        const opacityStyle = element.getStyle("opacity", false, true);
        if (opacityStyle.hasValue(true)) {
          opacity *= opacityStyle.getNumber();
        }
        element = element.parent;
      }
      return opacity;
    }
    setContext(ctx) {
      let fromMeasure = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      if (!fromMeasure) {
        const fillStyleProp = this.getStyle("fill");
        const fillOpacityStyleProp = this.getStyle("fill-opacity");
        const strokeStyleProp = this.getStyle("stroke");
        const strokeOpacityProp = this.getStyle("stroke-opacity");
        if (fillStyleProp.isUrlDefinition()) {
          const fillStyle = fillStyleProp.getFillStyleDefinition(this, fillOpacityStyleProp);
          if (fillStyle) {
            ctx.fillStyle = fillStyle;
          }
        } else if (fillStyleProp.hasValue()) {
          if (fillStyleProp.getString() === "currentColor") {
            fillStyleProp.setValue(this.getStyle("color").getColor());
          }
          const fillStyle = fillStyleProp.getColor();
          if (fillStyle !== "inherit") {
            ctx.fillStyle = fillStyle === "none" ? "rgba(0,0,0,0)" : fillStyle;
          }
        }
        if (fillOpacityStyleProp.hasValue()) {
          const fillStyle = new Property(this.document, "fill", ctx.fillStyle).addOpacity(fillOpacityStyleProp).getColor();
          ctx.fillStyle = fillStyle;
        }
        if (strokeStyleProp.isUrlDefinition()) {
          const strokeStyle = strokeStyleProp.getFillStyleDefinition(this, strokeOpacityProp);
          if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
          }
        } else if (strokeStyleProp.hasValue()) {
          if (strokeStyleProp.getString() === "currentColor") {
            strokeStyleProp.setValue(this.getStyle("color").getColor());
          }
          const strokeStyle = strokeStyleProp.getString();
          if (strokeStyle !== "inherit") {
            ctx.strokeStyle = strokeStyle === "none" ? "rgba(0,0,0,0)" : strokeStyle;
          }
        }
        if (strokeOpacityProp.hasValue()) {
          const strokeStyle = new Property(this.document, "stroke", ctx.strokeStyle).addOpacity(strokeOpacityProp).getString();
          ctx.strokeStyle = strokeStyle;
        }
        const strokeWidthStyleProp = this.getStyle("stroke-width");
        if (strokeWidthStyleProp.hasValue()) {
          const newLineWidth = strokeWidthStyleProp.getPixels();
          ctx.lineWidth = !newLineWidth ? PSEUDO_ZERO : newLineWidth;
        }
        const strokeLinecapStyleProp = this.getStyle("stroke-linecap");
        const strokeLinejoinStyleProp = this.getStyle("stroke-linejoin");
        const strokeMiterlimitProp = this.getStyle("stroke-miterlimit");
        const strokeDasharrayStyleProp = this.getStyle("stroke-dasharray");
        const strokeDashoffsetProp = this.getStyle("stroke-dashoffset");
        if (strokeLinecapStyleProp.hasValue()) {
          ctx.lineCap = strokeLinecapStyleProp.getString();
        }
        if (strokeLinejoinStyleProp.hasValue()) {
          ctx.lineJoin = strokeLinejoinStyleProp.getString();
        }
        if (strokeMiterlimitProp.hasValue()) {
          ctx.miterLimit = strokeMiterlimitProp.getNumber();
        }
        if (strokeDasharrayStyleProp.hasValue() && strokeDasharrayStyleProp.getString() !== "none") {
          const gaps = toNumbers(strokeDasharrayStyleProp.getString());
          if (typeof ctx.setLineDash !== "undefined") {
            ctx.setLineDash(gaps);
          } else if (typeof ctx.webkitLineDash !== "undefined") {
            ctx.webkitLineDash = gaps;
          } else if (typeof ctx.mozDash !== "undefined" && !(gaps.length === 1 && gaps[0] === 0)) {
            ctx.mozDash = gaps;
          }
          const offset = strokeDashoffsetProp.getPixels();
          if (typeof ctx.lineDashOffset !== "undefined") {
            ctx.lineDashOffset = offset;
          } else if (typeof ctx.webkitLineDashOffset !== "undefined") {
            ctx.webkitLineDashOffset = offset;
          } else if (typeof ctx.mozDashOffset !== "undefined") {
            ctx.mozDashOffset = offset;
          }
        }
      }
      this.modifiedEmSizeStack = false;
      if (typeof ctx.font !== "undefined") {
        const fontStyleProp = this.getStyle("font");
        const fontStyleStyleProp = this.getStyle("font-style");
        const fontVariantStyleProp = this.getStyle("font-variant");
        const fontWeightStyleProp = this.getStyle("font-weight");
        const fontSizeStyleProp = this.getStyle("font-size");
        const fontFamilyStyleProp = this.getStyle("font-family");
        const font = new Font(fontStyleStyleProp.getString(), fontVariantStyleProp.getString(), fontWeightStyleProp.getString(), fontSizeStyleProp.hasValue() ? "".concat(fontSizeStyleProp.getPixels(true), "px") : "", fontFamilyStyleProp.getString(), Font.parse(fontStyleProp.getString(), ctx.font));
        fontStyleStyleProp.setValue(font.fontStyle);
        fontVariantStyleProp.setValue(font.fontVariant);
        fontWeightStyleProp.setValue(font.fontWeight);
        fontSizeStyleProp.setValue(font.fontSize);
        fontFamilyStyleProp.setValue(font.fontFamily);
        ctx.font = font.toString();
        if (fontSizeStyleProp.isPixels()) {
          this.document.emSize = fontSizeStyleProp.getPixels();
          this.modifiedEmSizeStack = true;
        }
      }
      if (!fromMeasure) {
        this.applyEffects(ctx);
        ctx.globalAlpha = this.calculateOpacity();
      }
    }
    clearContext(ctx) {
      super.clearContext(ctx);
      if (this.modifiedEmSizeStack) {
        this.document.popEmSize();
      }
    }
    constructor(...args) {
      super(...args);
      this.modifiedEmSizeStack = false;
    }
  }
  class TextElement extends RenderedElement {
    setContext(ctx) {
      let fromMeasure = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      super.setContext(ctx, fromMeasure);
      const textBaseline = this.getStyle("dominant-baseline").getTextBaseline() || this.getStyle("alignment-baseline").getTextBaseline();
      if (textBaseline) {
        ctx.textBaseline = textBaseline;
      }
    }
    initializeCoordinates() {
      this.x = 0;
      this.y = 0;
      this.leafTexts = [];
      this.textChunkStart = 0;
      this.minX = Number.POSITIVE_INFINITY;
      this.maxX = Number.NEGATIVE_INFINITY;
    }
    getBoundingBox(ctx) {
      if (this.type !== "text") {
        return this.getTElementBoundingBox(ctx);
      }
      this.initializeCoordinates();
      this.adjustChildCoordinatesRecursive(ctx);
      let boundingBox = null;
      this.children.forEach((_2, i2) => {
        const childBoundingBox = this.getChildBoundingBox(ctx, this, this, i2);
        if (!boundingBox) {
          boundingBox = childBoundingBox;
        } else {
          boundingBox.addBoundingBox(childBoundingBox);
        }
      });
      return boundingBox;
    }
    getFontSize() {
      const { document: document2, parent } = this;
      const inheritFontSize = Font.parse(document2.ctx.font).fontSize;
      const fontSize = parent.getStyle("font-size").getNumber(inheritFontSize);
      return fontSize;
    }
    getTElementBoundingBox(ctx) {
      const fontSize = this.getFontSize();
      return new BoundingBox(this.x, this.y - fontSize, this.x + this.measureText(ctx), this.y);
    }
    getGlyph(font, text, i2) {
      const char = text[i2];
      let glyph;
      if (font.isArabic) {
        var ref;
        const len = text.length;
        const prevChar = text[i2 - 1];
        const nextChar = text[i2 + 1];
        let arabicForm = "isolated";
        if ((i2 === 0 || prevChar === " ") && i2 < len - 1 && nextChar !== " ") {
          arabicForm = "terminal";
        }
        if (i2 > 0 && prevChar !== " " && i2 < len - 1 && nextChar !== " ") {
          arabicForm = "medial";
        }
        if (i2 > 0 && prevChar !== " " && (i2 === len - 1 || nextChar === " ")) {
          arabicForm = "initial";
        }
        glyph = ((ref = font.arabicGlyphs[char]) === null || ref === void 0 ? void 0 : ref[arabicForm]) || font.glyphs[char];
      } else {
        glyph = font.glyphs[char];
      }
      if (!glyph) {
        glyph = font.missingGlyph;
      }
      return glyph;
    }
    getText() {
      return "";
    }
    getTextFromNode(node2) {
      const textNode = node2 || this.node;
      const childNodes = Array.from(textNode.parentNode.childNodes);
      const index2 = childNodes.indexOf(textNode);
      const lastIndex = childNodes.length - 1;
      let text = compressSpaces(
        // textNode.value
        // || textNode.text
        textNode.textContent || ""
      );
      if (index2 === 0) {
        text = trimLeft(text);
      }
      if (index2 === lastIndex) {
        text = trimRight(text);
      }
      return text;
    }
    renderChildren(ctx) {
      if (this.type !== "text") {
        this.renderTElementChildren(ctx);
        return;
      }
      this.initializeCoordinates();
      this.adjustChildCoordinatesRecursive(ctx);
      this.children.forEach((_2, i2) => {
        this.renderChild(ctx, this, this, i2);
      });
      const { mouse } = this.document.screen;
      if (mouse.isWorking()) {
        mouse.checkBoundingBox(this, this.getBoundingBox(ctx));
      }
    }
    renderTElementChildren(ctx) {
      const { document: document2, parent } = this;
      const renderText = this.getText();
      const customFont = parent.getStyle("font-family").getDefinition();
      if (customFont) {
        const { unitsPerEm } = customFont.fontFace;
        const ctxFont = Font.parse(document2.ctx.font);
        const fontSize = parent.getStyle("font-size").getNumber(ctxFont.fontSize);
        const fontStyle = parent.getStyle("font-style").getString(ctxFont.fontStyle);
        const scale = fontSize / unitsPerEm;
        const text = customFont.isRTL ? renderText.split("").reverse().join("") : renderText;
        const dx = toNumbers(parent.getAttribute("dx").getString());
        const len = text.length;
        for (let i2 = 0; i2 < len; i2++) {
          const glyph = this.getGlyph(customFont, text, i2);
          ctx.translate(this.x, this.y);
          ctx.scale(scale, -scale);
          const lw = ctx.lineWidth;
          ctx.lineWidth = ctx.lineWidth * unitsPerEm / fontSize;
          if (fontStyle === "italic") {
            ctx.transform(1, 0, 0.4, 1, 0, 0);
          }
          glyph.render(ctx);
          if (fontStyle === "italic") {
            ctx.transform(1, 0, -0.4, 1, 0, 0);
          }
          ctx.lineWidth = lw;
          ctx.scale(1 / scale, -1 / scale);
          ctx.translate(-this.x, -this.y);
          this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / unitsPerEm;
          if (typeof dx[i2] !== "undefined" && !isNaN(dx[i2])) {
            this.x += dx[i2];
          }
        }
        return;
      }
      const { x, y: y2 } = this;
      if (ctx.fillStyle) {
        ctx.fillText(renderText, x, y2);
      }
      if (ctx.strokeStyle) {
        ctx.strokeText(renderText, x, y2);
      }
    }
    applyAnchoring() {
      if (this.textChunkStart >= this.leafTexts.length) {
        return;
      }
      const firstElement = this.leafTexts[this.textChunkStart];
      const textAnchor = firstElement.getStyle("text-anchor").getString("start");
      const isRTL = false;
      let shift = 0;
      if (textAnchor === "start" && true || textAnchor === "end" && isRTL) {
        shift = firstElement.x - this.minX;
      } else if (textAnchor === "end" && true || textAnchor === "start" && isRTL) {
        shift = firstElement.x - this.maxX;
      } else {
        shift = firstElement.x - (this.minX + this.maxX) / 2;
      }
      for (let i2 = this.textChunkStart; i2 < this.leafTexts.length; i2++) {
        this.leafTexts[i2].x += shift;
      }
      this.minX = Number.POSITIVE_INFINITY;
      this.maxX = Number.NEGATIVE_INFINITY;
      this.textChunkStart = this.leafTexts.length;
    }
    adjustChildCoordinatesRecursive(ctx) {
      this.children.forEach((_2, i2) => {
        this.adjustChildCoordinatesRecursiveCore(ctx, this, this, i2);
      });
      this.applyAnchoring();
    }
    adjustChildCoordinatesRecursiveCore(ctx, textParent, parent, i1) {
      const child = parent.children[i1];
      if (child.children.length > 0) {
        child.children.forEach((_2, i2) => {
          textParent.adjustChildCoordinatesRecursiveCore(ctx, textParent, child, i2);
        });
      } else {
        this.adjustChildCoordinates(ctx, textParent, parent, i1);
      }
    }
    adjustChildCoordinates(ctx, textParent, parent, i2) {
      const child = parent.children[i2];
      if (typeof child.measureText !== "function") {
        return child;
      }
      ctx.save();
      child.setContext(ctx, true);
      const xAttr = child.getAttribute("x");
      const yAttr = child.getAttribute("y");
      const dxAttr = child.getAttribute("dx");
      const dyAttr = child.getAttribute("dy");
      const customFont = child.getStyle("font-family").getDefinition();
      const isRTL = Boolean(customFont === null || customFont === void 0 ? void 0 : customFont.isRTL);
      if (i2 === 0) {
        if (!xAttr.hasValue()) {
          xAttr.setValue(child.getInheritedAttribute("x"));
        }
        if (!yAttr.hasValue()) {
          yAttr.setValue(child.getInheritedAttribute("y"));
        }
        if (!dxAttr.hasValue()) {
          dxAttr.setValue(child.getInheritedAttribute("dx"));
        }
        if (!dyAttr.hasValue()) {
          dyAttr.setValue(child.getInheritedAttribute("dy"));
        }
      }
      const width = child.measureText(ctx);
      if (isRTL) {
        textParent.x -= width;
      }
      if (xAttr.hasValue()) {
        textParent.applyAnchoring();
        child.x = xAttr.getPixels("x");
        if (dxAttr.hasValue()) {
          child.x += dxAttr.getPixels("x");
        }
      } else {
        if (dxAttr.hasValue()) {
          textParent.x += dxAttr.getPixels("x");
        }
        child.x = textParent.x;
      }
      textParent.x = child.x;
      if (!isRTL) {
        textParent.x += width;
      }
      if (yAttr.hasValue()) {
        child.y = yAttr.getPixels("y");
        if (dyAttr.hasValue()) {
          child.y += dyAttr.getPixels("y");
        }
      } else {
        if (dyAttr.hasValue()) {
          textParent.y += dyAttr.getPixels("y");
        }
        child.y = textParent.y;
      }
      textParent.y = child.y;
      textParent.leafTexts.push(child);
      textParent.minX = Math.min(textParent.minX, child.x, child.x + width);
      textParent.maxX = Math.max(textParent.maxX, child.x, child.x + width);
      child.clearContext(ctx);
      ctx.restore();
      return child;
    }
    getChildBoundingBox(ctx, textParent, parent, i2) {
      const child = parent.children[i2];
      if (typeof child.getBoundingBox !== "function") {
        return null;
      }
      const boundingBox = child.getBoundingBox(ctx);
      if (boundingBox) {
        child.children.forEach((_2, i3) => {
          const childBoundingBox = textParent.getChildBoundingBox(ctx, textParent, child, i3);
          boundingBox.addBoundingBox(childBoundingBox);
        });
      }
      return boundingBox;
    }
    renderChild(ctx, textParent, parent, i3) {
      const child = parent.children[i3];
      child.render(ctx);
      child.children.forEach((_2, i2) => {
        textParent.renderChild(ctx, textParent, child, i2);
      });
    }
    measureText(ctx) {
      const { measureCache } = this;
      if (~measureCache) {
        return measureCache;
      }
      const renderText = this.getText();
      const measure = this.measureTargetText(ctx, renderText);
      this.measureCache = measure;
      return measure;
    }
    measureTargetText(ctx, targetText) {
      if (!targetText.length) {
        return 0;
      }
      const { parent } = this;
      const customFont = parent.getStyle("font-family").getDefinition();
      if (customFont) {
        const fontSize = this.getFontSize();
        const text = customFont.isRTL ? targetText.split("").reverse().join("") : targetText;
        const dx = toNumbers(parent.getAttribute("dx").getString());
        const len = text.length;
        let measure2 = 0;
        for (let i2 = 0; i2 < len; i2++) {
          const glyph = this.getGlyph(customFont, text, i2);
          measure2 += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
          if (typeof dx[i2] !== "undefined" && !isNaN(dx[i2])) {
            measure2 += dx[i2];
          }
        }
        return measure2;
      }
      if (!ctx.measureText) {
        return targetText.length * 10;
      }
      ctx.save();
      this.setContext(ctx, true);
      const { width: measure } = ctx.measureText(targetText);
      this.clearContext(ctx);
      ctx.restore();
      return measure;
    }
    /**
    * Inherits positional attributes from {@link TextElement} parent(s). Attributes
    * are only inherited from a parent to its first child.
    * @param name - The attribute name.
    * @returns The attribute value or null.
    */
    getInheritedAttribute(name) {
      let current = this;
      while (current instanceof TextElement && current.isFirstChild() && current.parent) {
        const parentAttr = current.parent.getAttribute(name);
        if (parentAttr.hasValue(true)) {
          return parentAttr.getString("0");
        }
        current = current.parent;
      }
      return null;
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, new.target === TextElement ? true : captureTextNodes);
      this.type = "text";
      this.x = 0;
      this.y = 0;
      this.leafTexts = [];
      this.textChunkStart = 0;
      this.minX = Number.POSITIVE_INFINITY;
      this.maxX = Number.NEGATIVE_INFINITY;
      this.measureCache = -1;
    }
  }
  class TSpanElement extends TextElement {
    getText() {
      return this.text;
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, new.target === TSpanElement ? true : captureTextNodes);
      this.type = "tspan";
      this.text = this.children.length > 0 ? "" : this.getTextFromNode();
    }
  }
  class TextNode extends TSpanElement {
    constructor(...args) {
      super(...args);
      this.type = "textNode";
    }
  }
  class PathParser extends _ {
    reset() {
      this.i = -1;
      this.command = null;
      this.previousCommand = null;
      this.start = new Point(0, 0);
      this.control = new Point(0, 0);
      this.current = new Point(0, 0);
      this.points = [];
      this.angles = [];
    }
    isEnd() {
      const { i: i2, commands } = this;
      return i2 >= commands.length - 1;
    }
    next() {
      const command = this.commands[++this.i];
      this.previousCommand = this.command;
      this.command = command;
      return command;
    }
    getPoint() {
      let xProp = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "x", yProp = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "y";
      const point = new Point(this.command[xProp], this.command[yProp]);
      return this.makeAbsolute(point);
    }
    getAsControlPoint(xProp, yProp) {
      const point = this.getPoint(xProp, yProp);
      this.control = point;
      return point;
    }
    getAsCurrentPoint(xProp, yProp) {
      const point = this.getPoint(xProp, yProp);
      this.current = point;
      return point;
    }
    getReflectedControlPoint() {
      const previousCommand = this.previousCommand.type;
      if (previousCommand !== _.CURVE_TO && previousCommand !== _.SMOOTH_CURVE_TO && previousCommand !== _.QUAD_TO && previousCommand !== _.SMOOTH_QUAD_TO) {
        return this.current;
      }
      const { current: { x: cx, y: cy }, control: { x: ox, y: oy } } = this;
      const point = new Point(2 * cx - ox, 2 * cy - oy);
      return point;
    }
    makeAbsolute(point) {
      if (this.command.relative) {
        const { x, y: y2 } = this.current;
        point.x += x;
        point.y += y2;
      }
      return point;
    }
    addMarker(point, from, priorTo) {
      const { points, angles } = this;
      if (priorTo && angles.length > 0 && !angles[angles.length - 1]) {
        angles[angles.length - 1] = points[points.length - 1].angleTo(priorTo);
      }
      this.addMarkerAngle(point, from ? from.angleTo(point) : null);
    }
    addMarkerAngle(point, angle) {
      this.points.push(point);
      this.angles.push(angle);
    }
    getMarkerPoints() {
      return this.points;
    }
    getMarkerAngles() {
      const { angles } = this;
      const len = angles.length;
      for (let i2 = 0; i2 < len; i2++) {
        if (!angles[i2]) {
          for (let j = i2 + 1; j < len; j++) {
            if (angles[j]) {
              angles[i2] = angles[j];
              break;
            }
          }
        }
      }
      return angles;
    }
    constructor(path) {
      super(path.replace(/([+\-.])\s+/gm, "$1").replace(/[^MmZzLlHhVvCcSsQqTtAae\d\s.,+-].*/g, ""));
      this.control = new Point(0, 0);
      this.start = new Point(0, 0);
      this.current = new Point(0, 0);
      this.command = null;
      this.commands = this.commands;
      this.i = -1;
      this.previousCommand = null;
      this.points = [];
      this.angles = [];
    }
  }
  class PathElement extends RenderedElement {
    path(ctx) {
      const { pathParser } = this;
      const boundingBox = new BoundingBox();
      pathParser.reset();
      if (ctx) {
        ctx.beginPath();
      }
      while (!pathParser.isEnd()) {
        switch (pathParser.next().type) {
          case PathParser.MOVE_TO:
            this.pathM(ctx, boundingBox);
            break;
          case PathParser.LINE_TO:
            this.pathL(ctx, boundingBox);
            break;
          case PathParser.HORIZ_LINE_TO:
            this.pathH(ctx, boundingBox);
            break;
          case PathParser.VERT_LINE_TO:
            this.pathV(ctx, boundingBox);
            break;
          case PathParser.CURVE_TO:
            this.pathC(ctx, boundingBox);
            break;
          case PathParser.SMOOTH_CURVE_TO:
            this.pathS(ctx, boundingBox);
            break;
          case PathParser.QUAD_TO:
            this.pathQ(ctx, boundingBox);
            break;
          case PathParser.SMOOTH_QUAD_TO:
            this.pathT(ctx, boundingBox);
            break;
          case PathParser.ARC:
            this.pathA(ctx, boundingBox);
            break;
          case PathParser.CLOSE_PATH:
            this.pathZ(ctx, boundingBox);
            break;
        }
      }
      return boundingBox;
    }
    getBoundingBox(_ctx) {
      return this.path();
    }
    getMarkers() {
      const { pathParser } = this;
      const points = pathParser.getMarkerPoints();
      const angles = pathParser.getMarkerAngles();
      const markers = points.map(
        (point, i2) => [
          point,
          angles[i2]
        ]
      );
      return markers;
    }
    renderChildren(ctx) {
      this.path(ctx);
      this.document.screen.mouse.checkPath(this, ctx);
      const fillRuleStyleProp = this.getStyle("fill-rule");
      if (ctx.fillStyle !== "") {
        if (fillRuleStyleProp.getString("inherit") !== "inherit") {
          ctx.fill(fillRuleStyleProp.getString());
        } else {
          ctx.fill();
        }
      }
      if (ctx.strokeStyle !== "") {
        if (this.getAttribute("vector-effect").getString() === "non-scaling-stroke") {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.stroke();
        }
      }
      const markers = this.getMarkers();
      if (markers) {
        const markersLastIndex = markers.length - 1;
        const markerStartStyleProp = this.getStyle("marker-start");
        const markerMidStyleProp = this.getStyle("marker-mid");
        const markerEndStyleProp = this.getStyle("marker-end");
        if (markerStartStyleProp.isUrlDefinition()) {
          const marker = markerStartStyleProp.getDefinition();
          const [point, angle] = markers[0];
          marker.render(ctx, point, angle);
        }
        if (markerMidStyleProp.isUrlDefinition()) {
          const marker = markerMidStyleProp.getDefinition();
          for (let i2 = 1; i2 < markersLastIndex; i2++) {
            const [point, angle] = markers[i2];
            marker.render(ctx, point, angle);
          }
        }
        if (markerEndStyleProp.isUrlDefinition()) {
          const marker = markerEndStyleProp.getDefinition();
          const [point, angle] = markers[markersLastIndex];
          marker.render(ctx, point, angle);
        }
      }
    }
    static pathM(pathParser) {
      const point = pathParser.getAsCurrentPoint();
      pathParser.start = pathParser.current;
      return {
        point
      };
    }
    pathM(ctx, boundingBox) {
      const { pathParser } = this;
      const { point } = PathElement.pathM(pathParser);
      const { x, y: y2 } = point;
      pathParser.addMarker(point);
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.moveTo(x, y2);
      }
    }
    static pathL(pathParser) {
      const { current } = pathParser;
      const point = pathParser.getAsCurrentPoint();
      return {
        current,
        point
      };
    }
    pathL(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point } = PathElement.pathL(pathParser);
      const { x, y: y2 } = point;
      pathParser.addMarker(point, current);
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.lineTo(x, y2);
      }
    }
    static pathH(pathParser) {
      const { current, command } = pathParser;
      const point = new Point((command.relative ? current.x : 0) + command.x, current.y);
      pathParser.current = point;
      return {
        current,
        point
      };
    }
    pathH(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point } = PathElement.pathH(pathParser);
      const { x, y: y2 } = point;
      pathParser.addMarker(point, current);
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.lineTo(x, y2);
      }
    }
    static pathV(pathParser) {
      const { current, command } = pathParser;
      const point = new Point(current.x, (command.relative ? current.y : 0) + command.y);
      pathParser.current = point;
      return {
        current,
        point
      };
    }
    pathV(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point } = PathElement.pathV(pathParser);
      const { x, y: y2 } = point;
      pathParser.addMarker(point, current);
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.lineTo(x, y2);
      }
    }
    static pathC(pathParser) {
      const { current } = pathParser;
      const point = pathParser.getPoint("x1", "y1");
      const controlPoint = pathParser.getAsControlPoint("x2", "y2");
      const currentPoint = pathParser.getAsCurrentPoint();
      return {
        current,
        point,
        controlPoint,
        currentPoint
      };
    }
    pathC(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point, controlPoint, currentPoint } = PathElement.pathC(pathParser);
      pathParser.addMarker(currentPoint, controlPoint, point);
      boundingBox.addBezierCurve(current.x, current.y, point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      if (ctx) {
        ctx.bezierCurveTo(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
    static pathS(pathParser) {
      const { current } = pathParser;
      const point = pathParser.getReflectedControlPoint();
      const controlPoint = pathParser.getAsControlPoint("x2", "y2");
      const currentPoint = pathParser.getAsCurrentPoint();
      return {
        current,
        point,
        controlPoint,
        currentPoint
      };
    }
    pathS(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, point, controlPoint, currentPoint } = PathElement.pathS(pathParser);
      pathParser.addMarker(currentPoint, controlPoint, point);
      boundingBox.addBezierCurve(current.x, current.y, point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      if (ctx) {
        ctx.bezierCurveTo(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
    static pathQ(pathParser) {
      const { current } = pathParser;
      const controlPoint = pathParser.getAsControlPoint("x1", "y1");
      const currentPoint = pathParser.getAsCurrentPoint();
      return {
        current,
        controlPoint,
        currentPoint
      };
    }
    pathQ(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, controlPoint, currentPoint } = PathElement.pathQ(pathParser);
      pathParser.addMarker(currentPoint, controlPoint, controlPoint);
      boundingBox.addQuadraticCurve(current.x, current.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      if (ctx) {
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
    static pathT(pathParser) {
      const { current } = pathParser;
      const controlPoint = pathParser.getReflectedControlPoint();
      pathParser.control = controlPoint;
      const currentPoint = pathParser.getAsCurrentPoint();
      return {
        current,
        controlPoint,
        currentPoint
      };
    }
    pathT(ctx, boundingBox) {
      const { pathParser } = this;
      const { current, controlPoint, currentPoint } = PathElement.pathT(pathParser);
      pathParser.addMarker(currentPoint, controlPoint, controlPoint);
      boundingBox.addQuadraticCurve(current.x, current.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      if (ctx) {
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
    static pathA(pathParser) {
      const { current, command } = pathParser;
      let { rX, rY, xRot, lArcFlag, sweepFlag } = command;
      const xAxisRotation = xRot * (Math.PI / 180);
      const currentPoint = pathParser.getAsCurrentPoint();
      const currp = new Point(Math.cos(xAxisRotation) * (current.x - currentPoint.x) / 2 + Math.sin(xAxisRotation) * (current.y - currentPoint.y) / 2, -Math.sin(xAxisRotation) * (current.x - currentPoint.x) / 2 + Math.cos(xAxisRotation) * (current.y - currentPoint.y) / 2);
      const l2 = Math.pow(currp.x, 2) / Math.pow(rX, 2) + Math.pow(currp.y, 2) / Math.pow(rY, 2);
      if (l2 > 1) {
        rX *= Math.sqrt(l2);
        rY *= Math.sqrt(l2);
      }
      let s2 = (lArcFlag === sweepFlag ? -1 : 1) * Math.sqrt((Math.pow(rX, 2) * Math.pow(rY, 2) - Math.pow(rX, 2) * Math.pow(currp.y, 2) - Math.pow(rY, 2) * Math.pow(currp.x, 2)) / (Math.pow(rX, 2) * Math.pow(currp.y, 2) + Math.pow(rY, 2) * Math.pow(currp.x, 2)));
      if (isNaN(s2)) {
        s2 = 0;
      }
      const cpp = new Point(s2 * rX * currp.y / rY, s2 * -rY * currp.x / rX);
      const centp = new Point((current.x + currentPoint.x) / 2 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (current.y + currentPoint.y) / 2 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y);
      const a1 = vectorsAngle([
        1,
        0
      ], [
        (currp.x - cpp.x) / rX,
        (currp.y - cpp.y) / rY
      ]);
      const u2 = [
        (currp.x - cpp.x) / rX,
        (currp.y - cpp.y) / rY
      ];
      const v2 = [
        (-currp.x - cpp.x) / rX,
        (-currp.y - cpp.y) / rY
      ];
      let ad = vectorsAngle(u2, v2);
      if (vectorsRatio(u2, v2) <= -1) {
        ad = Math.PI;
      }
      if (vectorsRatio(u2, v2) >= 1) {
        ad = 0;
      }
      return {
        currentPoint,
        rX,
        rY,
        sweepFlag,
        xAxisRotation,
        centp,
        a1,
        ad
      };
    }
    pathA(ctx, boundingBox) {
      const { pathParser } = this;
      const { currentPoint, rX, rY, sweepFlag, xAxisRotation, centp, a1, ad } = PathElement.pathA(pathParser);
      const dir = 1 - sweepFlag ? 1 : -1;
      const ah = a1 + dir * (ad / 2);
      const halfWay = new Point(centp.x + rX * Math.cos(ah), centp.y + rY * Math.sin(ah));
      pathParser.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
      pathParser.addMarkerAngle(currentPoint, ah - dir * Math.PI);
      boundingBox.addPoint(currentPoint.x, currentPoint.y);
      if (ctx && !isNaN(a1) && !isNaN(ad)) {
        const r2 = rX > rY ? rX : rY;
        const sx = rX > rY ? 1 : rX / rY;
        const sy = rX > rY ? rY / rX : 1;
        ctx.translate(centp.x, centp.y);
        ctx.rotate(xAxisRotation);
        ctx.scale(sx, sy);
        ctx.arc(0, 0, r2, a1, a1 + ad, Boolean(1 - sweepFlag));
        ctx.scale(1 / sx, 1 / sy);
        ctx.rotate(-xAxisRotation);
        ctx.translate(-centp.x, -centp.y);
      }
    }
    static pathZ(pathParser) {
      pathParser.current = pathParser.start;
    }
    pathZ(ctx, boundingBox) {
      PathElement.pathZ(this.pathParser);
      if (ctx) {
        if (boundingBox.x1 !== boundingBox.x2 && boundingBox.y1 !== boundingBox.y2) {
          ctx.closePath();
        }
      }
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "path";
      this.pathParser = new PathParser(this.getAttribute("d").getString());
    }
  }
  class SVGElement extends RenderedElement {
    setContext(ctx) {
      var ref;
      const { document: document2 } = this;
      const { screen, window: window2 } = document2;
      const canvas = ctx.canvas;
      screen.setDefaults(ctx);
      if ("style" in canvas && typeof ctx.font !== "undefined" && window2 && typeof window2.getComputedStyle !== "undefined") {
        ctx.font = window2.getComputedStyle(canvas).getPropertyValue("font");
        const fontSizeProp = new Property(document2, "fontSize", Font.parse(ctx.font).fontSize);
        if (fontSizeProp.hasValue()) {
          document2.rootEmSize = fontSizeProp.getPixels("y");
          document2.emSize = document2.rootEmSize;
        }
      }
      if (!this.getAttribute("x").hasValue()) {
        this.getAttribute("x", true).setValue(0);
      }
      if (!this.getAttribute("y").hasValue()) {
        this.getAttribute("y", true).setValue(0);
      }
      let { width, height } = screen.viewPort;
      if (!this.getStyle("width").hasValue()) {
        this.getStyle("width", true).setValue("100%");
      }
      if (!this.getStyle("height").hasValue()) {
        this.getStyle("height", true).setValue("100%");
      }
      if (!this.getStyle("color").hasValue()) {
        this.getStyle("color", true).setValue("black");
      }
      const refXAttr = this.getAttribute("refX");
      const refYAttr = this.getAttribute("refY");
      const viewBoxAttr = this.getAttribute("viewBox");
      const viewBox = viewBoxAttr.hasValue() ? toNumbers(viewBoxAttr.getString()) : null;
      const clip = !this.root && this.getStyle("overflow").getValue("hidden") !== "visible";
      let minX = 0;
      let minY = 0;
      let clipX = 0;
      let clipY = 0;
      if (viewBox) {
        minX = viewBox[0];
        minY = viewBox[1];
      }
      if (!this.root) {
        width = this.getStyle("width").getPixels("x");
        height = this.getStyle("height").getPixels("y");
        if (this.type === "marker") {
          clipX = minX;
          clipY = minY;
          minX = 0;
          minY = 0;
        }
      }
      screen.viewPort.setCurrent(width, height);
      if (this.node && (!this.parent || ((ref = this.node.parentNode) === null || ref === void 0 ? void 0 : ref.nodeName) === "foreignObject") && this.getStyle("transform", false, true).hasValue() && !this.getStyle("transform-origin", false, true).hasValue()) {
        this.getStyle("transform-origin", true, true).setValue("50% 50%");
      }
      super.setContext(ctx);
      ctx.translate(this.getAttribute("x").getPixels("x"), this.getAttribute("y").getPixels("y"));
      if (viewBox) {
        width = viewBox[2];
        height = viewBox[3];
      }
      document2.setViewBox({
        ctx,
        aspectRatio: this.getAttribute("preserveAspectRatio").getString(),
        width: screen.viewPort.width,
        desiredWidth: width,
        height: screen.viewPort.height,
        desiredHeight: height,
        minX,
        minY,
        refX: refXAttr.getValue(),
        refY: refYAttr.getValue(),
        clip,
        clipX,
        clipY
      });
      if (viewBox) {
        screen.viewPort.removeCurrent();
        screen.viewPort.setCurrent(width, height);
      }
    }
    clearContext(ctx) {
      super.clearContext(ctx);
      this.document.screen.viewPort.removeCurrent();
    }
    /**
    * Resize SVG to fit in given size.
    * @param width
    * @param height
    * @param preserveAspectRatio
    */
    resize(width) {
      let height = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : width, preserveAspectRatio = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      const widthAttr = this.getAttribute("width", true);
      const heightAttr = this.getAttribute("height", true);
      const viewBoxAttr = this.getAttribute("viewBox");
      const styleAttr = this.getAttribute("style");
      const originWidth = widthAttr.getNumber(0);
      const originHeight = heightAttr.getNumber(0);
      if (preserveAspectRatio) {
        if (typeof preserveAspectRatio === "string") {
          this.getAttribute("preserveAspectRatio", true).setValue(preserveAspectRatio);
        } else {
          const preserveAspectRatioAttr = this.getAttribute("preserveAspectRatio");
          if (preserveAspectRatioAttr.hasValue()) {
            preserveAspectRatioAttr.setValue(preserveAspectRatioAttr.getString().replace(/^\s*(\S.*\S)\s*$/, "$1"));
          }
        }
      }
      widthAttr.setValue(width);
      heightAttr.setValue(height);
      if (!viewBoxAttr.hasValue()) {
        viewBoxAttr.setValue("0 0 ".concat(originWidth || width, " ").concat(originHeight || height));
      }
      if (styleAttr.hasValue()) {
        const widthStyle = this.getStyle("width");
        const heightStyle = this.getStyle("height");
        if (widthStyle.hasValue()) {
          widthStyle.setValue("".concat(width, "px"));
        }
        if (heightStyle.hasValue()) {
          heightStyle.setValue("".concat(height, "px"));
        }
      }
    }
    constructor(...args) {
      super(...args);
      this.type = "svg";
      this.root = false;
    }
  }
  class RectElement extends PathElement {
    path(ctx) {
      const x = this.getAttribute("x").getPixels("x");
      const y2 = this.getAttribute("y").getPixels("y");
      const width = this.getStyle("width", false, true).getPixels("x");
      const height = this.getStyle("height", false, true).getPixels("y");
      const rxAttr = this.getAttribute("rx");
      const ryAttr = this.getAttribute("ry");
      let rx = rxAttr.getPixels("x");
      let ry = ryAttr.getPixels("y");
      if (rxAttr.hasValue() && !ryAttr.hasValue()) {
        ry = rx;
      }
      if (ryAttr.hasValue() && !rxAttr.hasValue()) {
        rx = ry;
      }
      rx = Math.min(rx, width / 2);
      ry = Math.min(ry, height / 2);
      if (ctx) {
        const KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
        ctx.beginPath();
        if (height > 0 && width > 0) {
          ctx.moveTo(x + rx, y2);
          ctx.lineTo(x + width - rx, y2);
          ctx.bezierCurveTo(x + width - rx + KAPPA * rx, y2, x + width, y2 + ry - KAPPA * ry, x + width, y2 + ry);
          ctx.lineTo(x + width, y2 + height - ry);
          ctx.bezierCurveTo(x + width, y2 + height - ry + KAPPA * ry, x + width - rx + KAPPA * rx, y2 + height, x + width - rx, y2 + height);
          ctx.lineTo(x + rx, y2 + height);
          ctx.bezierCurveTo(x + rx - KAPPA * rx, y2 + height, x, y2 + height - ry + KAPPA * ry, x, y2 + height - ry);
          ctx.lineTo(x, y2 + ry);
          ctx.bezierCurveTo(x, y2 + ry - KAPPA * ry, x + rx - KAPPA * rx, y2, x + rx, y2);
          ctx.closePath();
        }
      }
      return new BoundingBox(x, y2, x + width, y2 + height);
    }
    getMarkers() {
      return null;
    }
    constructor(...args) {
      super(...args);
      this.type = "rect";
    }
  }
  class CircleElement extends PathElement {
    path(ctx) {
      const cx = this.getAttribute("cx").getPixels("x");
      const cy = this.getAttribute("cy").getPixels("y");
      const r2 = this.getAttribute("r").getPixels();
      if (ctx && r2 > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, r2, 0, Math.PI * 2, false);
        ctx.closePath();
      }
      return new BoundingBox(cx - r2, cy - r2, cx + r2, cy + r2);
    }
    getMarkers() {
      return null;
    }
    constructor(...args) {
      super(...args);
      this.type = "circle";
    }
  }
  class EllipseElement extends PathElement {
    path(ctx) {
      const KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
      const rx = this.getAttribute("rx").getPixels("x");
      const ry = this.getAttribute("ry").getPixels("y");
      const cx = this.getAttribute("cx").getPixels("x");
      const cy = this.getAttribute("cy").getPixels("y");
      if (ctx && rx > 0 && ry > 0) {
        ctx.beginPath();
        ctx.moveTo(cx + rx, cy);
        ctx.bezierCurveTo(cx + rx, cy + KAPPA * ry, cx + KAPPA * rx, cy + ry, cx, cy + ry);
        ctx.bezierCurveTo(cx - KAPPA * rx, cy + ry, cx - rx, cy + KAPPA * ry, cx - rx, cy);
        ctx.bezierCurveTo(cx - rx, cy - KAPPA * ry, cx - KAPPA * rx, cy - ry, cx, cy - ry);
        ctx.bezierCurveTo(cx + KAPPA * rx, cy - ry, cx + rx, cy - KAPPA * ry, cx + rx, cy);
        ctx.closePath();
      }
      return new BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
    }
    getMarkers() {
      return null;
    }
    constructor(...args) {
      super(...args);
      this.type = "ellipse";
    }
  }
  class LineElement extends PathElement {
    getPoints() {
      return [
        new Point(this.getAttribute("x1").getPixels("x"), this.getAttribute("y1").getPixels("y")),
        new Point(this.getAttribute("x2").getPixels("x"), this.getAttribute("y2").getPixels("y"))
      ];
    }
    path(ctx) {
      const [{ x: x0, y: y0 }, { x: x1, y: y1 }] = this.getPoints();
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      return new BoundingBox(x0, y0, x1, y1);
    }
    getMarkers() {
      const [p0, p1] = this.getPoints();
      const a2 = p0.angleTo(p1);
      return [
        [
          p0,
          a2
        ],
        [
          p1,
          a2
        ]
      ];
    }
    constructor(...args) {
      super(...args);
      this.type = "line";
    }
  }
  class PolylineElement extends PathElement {
    path(ctx) {
      const { points } = this;
      const [{ x: x0, y: y0 }] = points;
      const boundingBox = new BoundingBox(x0, y0);
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
      }
      points.forEach((param) => {
        let { x, y: y2 } = param;
        boundingBox.addPoint(x, y2);
        if (ctx) {
          ctx.lineTo(x, y2);
        }
      });
      return boundingBox;
    }
    getMarkers() {
      const { points } = this;
      const lastIndex = points.length - 1;
      const markers = [];
      points.forEach((point, i2) => {
        if (i2 === lastIndex) {
          return;
        }
        markers.push([
          point,
          point.angleTo(points[i2 + 1])
        ]);
      });
      if (markers.length > 0) {
        markers.push([
          points[points.length - 1],
          markers[markers.length - 1][1]
        ]);
      }
      return markers;
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "polyline";
      this.points = [];
      this.points = Point.parsePath(this.getAttribute("points").getString());
    }
  }
  class PolygonElement extends PolylineElement {
    path(ctx) {
      const boundingBox = super.path(ctx);
      const [{ x, y: y2 }] = this.points;
      if (ctx) {
        ctx.lineTo(x, y2);
        ctx.closePath();
      }
      return boundingBox;
    }
    constructor(...args) {
      super(...args);
      this.type = "polygon";
    }
  }
  class PatternElement extends Element {
    createPattern(ctx, _2, parentOpacityProp) {
      const width = this.getStyle("width").getPixels("x", true);
      const height = this.getStyle("height").getPixels("y", true);
      const patternSvg = new SVGElement(this.document, null);
      patternSvg.attributes.viewBox = new Property(this.document, "viewBox", this.getAttribute("viewBox").getValue());
      patternSvg.attributes.width = new Property(this.document, "width", "".concat(width, "px"));
      patternSvg.attributes.height = new Property(this.document, "height", "".concat(height, "px"));
      patternSvg.attributes.transform = new Property(this.document, "transform", this.getAttribute("patternTransform").getValue());
      patternSvg.children = this.children;
      const patternCanvas = this.document.createCanvas(width, height);
      const patternCtx = patternCanvas.getContext("2d");
      const xAttr = this.getAttribute("x");
      const yAttr = this.getAttribute("y");
      if (xAttr.hasValue() && yAttr.hasValue()) {
        patternCtx.translate(xAttr.getPixels("x", true), yAttr.getPixels("y", true));
      }
      if (parentOpacityProp.hasValue()) {
        this.styles["fill-opacity"] = parentOpacityProp;
      } else {
        Reflect.deleteProperty(this.styles, "fill-opacity");
      }
      for (let x = -1; x <= 1; x++) {
        for (let y2 = -1; y2 <= 1; y2++) {
          patternCtx.save();
          patternSvg.attributes.x = new Property(this.document, "x", x * patternCanvas.width);
          patternSvg.attributes.y = new Property(this.document, "y", y2 * patternCanvas.height);
          patternSvg.render(patternCtx);
          patternCtx.restore();
        }
      }
      const pattern = ctx.createPattern(patternCanvas, "repeat");
      return pattern;
    }
    constructor(...args) {
      super(...args);
      this.type = "pattern";
    }
  }
  class MarkerElement extends Element {
    render(ctx, point, angle) {
      if (!point) {
        return;
      }
      const { x, y: y2 } = point;
      const orient = this.getAttribute("orient").getString("auto");
      const markerUnits = this.getAttribute("markerUnits").getString("strokeWidth");
      ctx.translate(x, y2);
      if (orient === "auto") {
        ctx.rotate(angle);
      }
      if (markerUnits === "strokeWidth") {
        ctx.scale(ctx.lineWidth, ctx.lineWidth);
      }
      ctx.save();
      const markerSvg = new SVGElement(this.document);
      markerSvg.type = this.type;
      markerSvg.attributes.viewBox = new Property(this.document, "viewBox", this.getAttribute("viewBox").getValue());
      markerSvg.attributes.refX = new Property(this.document, "refX", this.getAttribute("refX").getValue());
      markerSvg.attributes.refY = new Property(this.document, "refY", this.getAttribute("refY").getValue());
      markerSvg.attributes.width = new Property(this.document, "width", this.getAttribute("markerWidth").getValue());
      markerSvg.attributes.height = new Property(this.document, "height", this.getAttribute("markerHeight").getValue());
      markerSvg.attributes.overflow = new Property(this.document, "overflow", this.getAttribute("overflow").getValue());
      markerSvg.attributes.fill = new Property(this.document, "fill", this.getAttribute("fill").getColor("black"));
      markerSvg.attributes.stroke = new Property(this.document, "stroke", this.getAttribute("stroke").getValue("none"));
      markerSvg.children = this.children;
      markerSvg.render(ctx);
      ctx.restore();
      if (markerUnits === "strokeWidth") {
        ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth);
      }
      if (orient === "auto") {
        ctx.rotate(-angle);
      }
      ctx.translate(-x, -y2);
    }
    constructor(...args) {
      super(...args);
      this.type = "marker";
    }
  }
  class DefsElement extends Element {
    render() {
    }
    constructor(...args) {
      super(...args);
      this.type = "defs";
    }
  }
  class GElement extends RenderedElement {
    getBoundingBox(ctx) {
      const boundingBox = new BoundingBox();
      this.children.forEach((child) => {
        boundingBox.addBoundingBox(child.getBoundingBox(ctx));
      });
      return boundingBox;
    }
    constructor(...args) {
      super(...args);
      this.type = "g";
    }
  }
  class GradientElement extends Element {
    getGradientUnits() {
      return this.getAttribute("gradientUnits").getString("objectBoundingBox");
    }
    createGradient(ctx, element, parentOpacityProp) {
      let stopsContainer = this;
      if (this.getHrefAttribute().hasValue()) {
        stopsContainer = this.getHrefAttribute().getDefinition();
        this.inheritStopContainer(stopsContainer);
      }
      const { stops } = stopsContainer;
      const gradient = this.getGradient(ctx, element);
      if (!gradient) {
        return this.addParentOpacity(parentOpacityProp, stops[stops.length - 1].color);
      }
      stops.forEach((stop) => {
        gradient.addColorStop(stop.offset, this.addParentOpacity(parentOpacityProp, stop.color));
      });
      if (this.getAttribute("gradientTransform").hasValue()) {
        const { document: document2 } = this;
        const { MAX_VIRTUAL_PIXELS } = Screen;
        const { viewPort } = document2.screen;
        const rootView = viewPort.getRoot();
        const rect = new RectElement(document2);
        rect.attributes.x = new Property(document2, "x", -MAX_VIRTUAL_PIXELS / 3);
        rect.attributes.y = new Property(document2, "y", -MAX_VIRTUAL_PIXELS / 3);
        rect.attributes.width = new Property(document2, "width", MAX_VIRTUAL_PIXELS);
        rect.attributes.height = new Property(document2, "height", MAX_VIRTUAL_PIXELS);
        const group = new GElement(document2);
        group.attributes.transform = new Property(document2, "transform", this.getAttribute("gradientTransform").getValue());
        group.children = [
          rect
        ];
        const patternSvg = new SVGElement(document2);
        patternSvg.attributes.x = new Property(document2, "x", 0);
        patternSvg.attributes.y = new Property(document2, "y", 0);
        patternSvg.attributes.width = new Property(document2, "width", rootView.width);
        patternSvg.attributes.height = new Property(document2, "height", rootView.height);
        patternSvg.children = [
          group
        ];
        const patternCanvas = document2.createCanvas(rootView.width, rootView.height);
        const patternCtx = patternCanvas.getContext("2d");
        patternCtx.fillStyle = gradient;
        patternSvg.render(patternCtx);
        return patternCtx.createPattern(patternCanvas, "no-repeat");
      }
      return gradient;
    }
    inheritStopContainer(stopsContainer) {
      this.attributesToInherit.forEach((attributeToInherit) => {
        if (!this.getAttribute(attributeToInherit).hasValue() && stopsContainer.getAttribute(attributeToInherit).hasValue()) {
          this.getAttribute(attributeToInherit, true).setValue(stopsContainer.getAttribute(attributeToInherit).getValue());
        }
      });
    }
    addParentOpacity(parentOpacityProp, color) {
      if (parentOpacityProp.hasValue()) {
        const colorProp = new Property(this.document, "color", color);
        return colorProp.addOpacity(parentOpacityProp).getColor();
      }
      return color;
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.attributesToInherit = [
        "gradientUnits"
      ];
      this.stops = [];
      const { stops, children } = this;
      children.forEach((child) => {
        if (child.type === "stop") {
          stops.push(child);
        }
      });
    }
  }
  class LinearGradientElement extends GradientElement {
    getGradient(ctx, element) {
      const isBoundingBoxUnits = this.getGradientUnits() === "objectBoundingBox";
      const boundingBox = isBoundingBoxUnits ? element.getBoundingBox(ctx) : null;
      if (isBoundingBoxUnits && !boundingBox) {
        return null;
      }
      if (!this.getAttribute("x1").hasValue() && !this.getAttribute("y1").hasValue() && !this.getAttribute("x2").hasValue() && !this.getAttribute("y2").hasValue()) {
        this.getAttribute("x1", true).setValue(0);
        this.getAttribute("y1", true).setValue(0);
        this.getAttribute("x2", true).setValue(1);
        this.getAttribute("y2", true).setValue(0);
      }
      const x1 = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("x1").getNumber() : this.getAttribute("x1").getPixels("x");
      const y1 = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("y1").getNumber() : this.getAttribute("y1").getPixels("y");
      const x2 = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("x2").getNumber() : this.getAttribute("x2").getPixels("x");
      const y2 = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("y2").getNumber() : this.getAttribute("y2").getPixels("y");
      if (x1 === x2 && y1 === y2) {
        return null;
      }
      return ctx.createLinearGradient(x1, y1, x2, y2);
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "linearGradient";
      this.attributesToInherit.push("x1", "y1", "x2", "y2");
    }
  }
  class RadialGradientElement extends GradientElement {
    getGradient(ctx, element) {
      const isBoundingBoxUnits = this.getGradientUnits() === "objectBoundingBox";
      const boundingBox = element.getBoundingBox(ctx);
      if (isBoundingBoxUnits && !boundingBox) {
        return null;
      }
      if (!this.getAttribute("cx").hasValue()) {
        this.getAttribute("cx", true).setValue("50%");
      }
      if (!this.getAttribute("cy").hasValue()) {
        this.getAttribute("cy", true).setValue("50%");
      }
      if (!this.getAttribute("r").hasValue()) {
        this.getAttribute("r", true).setValue("50%");
      }
      const cx = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("cx").getNumber() : this.getAttribute("cx").getPixels("x");
      const cy = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("cy").getNumber() : this.getAttribute("cy").getPixels("y");
      let fx = cx;
      let fy = cy;
      if (this.getAttribute("fx").hasValue()) {
        fx = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("fx").getNumber() : this.getAttribute("fx").getPixels("x");
      }
      if (this.getAttribute("fy").hasValue()) {
        fy = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("fy").getNumber() : this.getAttribute("fy").getPixels("y");
      }
      const r2 = isBoundingBoxUnits ? (boundingBox.width + boundingBox.height) / 2 * this.getAttribute("r").getNumber() : this.getAttribute("r").getPixels();
      const fr = this.getAttribute("fr").getPixels();
      return ctx.createRadialGradient(fx, fy, fr, cx, cy, r2);
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "radialGradient";
      this.attributesToInherit.push("cx", "cy", "r", "fx", "fy", "fr");
    }
  }
  class StopElement extends Element {
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "stop";
      const offset = Math.max(0, Math.min(1, this.getAttribute("offset").getNumber()));
      const stopOpacity = this.getStyle("stop-opacity");
      let stopColor = this.getStyle("stop-color", true);
      if (stopColor.getString() === "") {
        stopColor.setValue("#000");
      }
      if (stopOpacity.hasValue()) {
        stopColor = stopColor.addOpacity(stopOpacity);
      }
      this.offset = offset;
      this.color = stopColor.getColor();
    }
  }
  class AnimateElement extends Element {
    getProperty() {
      const attributeType = this.getAttribute("attributeType").getString();
      const attributeName = this.getAttribute("attributeName").getString();
      if (attributeType === "CSS") {
        return this.parent.getStyle(attributeName, true);
      }
      return this.parent.getAttribute(attributeName, true);
    }
    calcValue() {
      const { initialUnits } = this;
      const { progress, from, to } = this.getProgress();
      let newValue = from.getNumber() + (to.getNumber() - from.getNumber()) * progress;
      if (initialUnits === "%") {
        newValue *= 100;
      }
      return "".concat(newValue).concat(initialUnits);
    }
    update(delta) {
      const { parent } = this;
      const prop = this.getProperty();
      if (!this.initialValue) {
        this.initialValue = prop.getString();
        this.initialUnits = prop.getUnits();
      }
      if (this.duration > this.maxDuration) {
        const fill = this.getAttribute("fill").getString("remove");
        if (this.getAttribute("repeatCount").getString() === "indefinite" || this.getAttribute("repeatDur").getString() === "indefinite") {
          this.duration = 0;
        } else if (fill === "freeze" && !this.frozen) {
          this.frozen = true;
          if (parent && prop) {
            parent.animationFrozen = true;
            parent.animationFrozenValue = prop.getString();
          }
        } else if (fill === "remove" && !this.removed) {
          this.removed = true;
          if (parent && prop) {
            prop.setValue(parent.animationFrozen ? parent.animationFrozenValue : this.initialValue);
          }
          return true;
        }
        return false;
      }
      this.duration += delta;
      let updated = false;
      if (this.begin < this.duration) {
        let newValue = this.calcValue();
        const typeAttr = this.getAttribute("type");
        if (typeAttr.hasValue()) {
          const type = typeAttr.getString();
          newValue = "".concat(type, "(").concat(newValue, ")");
        }
        prop.setValue(newValue);
        updated = true;
      }
      return updated;
    }
    getProgress() {
      const { document: document2, values } = this;
      let progress = (this.duration - this.begin) / (this.maxDuration - this.begin);
      let from;
      let to;
      if (values.hasValue()) {
        const p2 = progress * (values.getValue().length - 1);
        const lb = Math.floor(p2);
        const ub = Math.ceil(p2);
        let value;
        value = values.getValue()[lb];
        from = new Property(document2, "from", value ? parseFloat(value) : 0);
        value = values.getValue()[ub];
        to = new Property(document2, "to", value ? parseFloat(value) : 0);
        progress = (p2 - lb) / (ub - lb);
      } else {
        from = this.from;
        to = this.to;
      }
      return {
        progress,
        from,
        to
      };
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "animate";
      this.duration = 0;
      this.initialUnits = "";
      this.removed = false;
      this.frozen = false;
      document2.screen.animations.push(this);
      this.begin = this.getAttribute("begin").getMilliseconds();
      this.maxDuration = this.begin + this.getAttribute("dur").getMilliseconds();
      this.from = this.getAttribute("from");
      this.to = this.getAttribute("to");
      this.values = new Property(document2, "values", null);
      const valuesAttr = this.getAttribute("values");
      if (valuesAttr.hasValue()) {
        this.values.setValue(valuesAttr.getString().split(";"));
      }
    }
  }
  class AnimateColorElement extends AnimateElement {
    calcValue() {
      const { progress, from, to } = this.getProgress();
      const colorFrom = new RGBColor$1(from.getColor());
      const colorTo = new RGBColor$1(to.getColor());
      if (colorFrom.ok && colorTo.ok) {
        const r2 = colorFrom.r + (colorTo.r - colorFrom.r) * progress;
        const g = colorFrom.g + (colorTo.g - colorFrom.g) * progress;
        const b = colorFrom.b + (colorTo.b - colorFrom.b) * progress;
        return "rgb(".concat(Math.floor(r2), ", ").concat(Math.floor(g), ", ").concat(Math.floor(b), ")");
      }
      return this.getAttribute("from").getColor();
    }
    constructor(...args) {
      super(...args);
      this.type = "animateColor";
    }
  }
  class AnimateTransformElement extends AnimateElement {
    calcValue() {
      const { progress, from: from1, to: to1 } = this.getProgress();
      const transformFrom = toNumbers(from1.getString());
      const transformTo = toNumbers(to1.getString());
      const newValue = transformFrom.map((from, i2) => {
        const to = transformTo[i2];
        return from + (to - from) * progress;
      }).join(" ");
      return newValue;
    }
    constructor(...args) {
      super(...args);
      this.type = "animateTransform";
    }
  }
  class FontFaceElement extends Element {
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "font-face";
      this.ascent = this.getAttribute("ascent").getNumber();
      this.descent = this.getAttribute("descent").getNumber();
      this.unitsPerEm = this.getAttribute("units-per-em").getNumber();
    }
  }
  class GlyphElement extends PathElement {
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "glyph";
      this.horizAdvX = this.getAttribute("horiz-adv-x").getNumber();
      this.unicode = this.getAttribute("unicode").getString();
      this.arabicForm = this.getAttribute("arabic-form").getString();
    }
  }
  class MissingGlyphElement extends GlyphElement {
    constructor(...args) {
      super(...args);
      this.type = "missing-glyph";
      this.horizAdvX = 0;
    }
  }
  class FontElement extends Element {
    render() {
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "font";
      this.isArabic = false;
      this.glyphs = {};
      this.arabicGlyphs = {};
      this.isRTL = false;
      this.horizAdvX = this.getAttribute("horiz-adv-x").getNumber();
      const { definitions } = document2;
      const { children } = this;
      for (const child of children) {
        if (child instanceof FontFaceElement) {
          this.fontFace = child;
          const fontFamilyStyle = child.getStyle("font-family");
          if (fontFamilyStyle.hasValue()) {
            definitions[fontFamilyStyle.getString()] = this;
          }
        } else if (child instanceof MissingGlyphElement) {
          this.missingGlyph = child;
        } else if (child instanceof GlyphElement) {
          if (child.arabicForm) {
            this.isRTL = true;
            this.isArabic = true;
            const arabicGlyph = this.arabicGlyphs[child.unicode];
            if (typeof arabicGlyph === "undefined") {
              this.arabicGlyphs[child.unicode] = {
                [child.arabicForm]: child
              };
            } else {
              arabicGlyph[child.arabicForm] = child;
            }
          } else {
            this.glyphs[child.unicode] = child;
          }
        }
      }
    }
  }
  class TRefElement extends TextElement {
    getText() {
      const element = this.getHrefAttribute().getDefinition();
      if (element) {
        const firstChild = element.children[0];
        if (firstChild) {
          return firstChild.getText();
        }
      }
      return "";
    }
    constructor(...args) {
      super(...args);
      this.type = "tref";
    }
  }
  class AElement extends TextElement {
    getText() {
      return this.text;
    }
    renderChildren(ctx) {
      if (this.hasText) {
        super.renderChildren(ctx);
        const { document: document2, x, y: y2 } = this;
        const { mouse } = document2.screen;
        const fontSize = new Property(document2, "fontSize", Font.parse(document2.ctx.font).fontSize);
        if (mouse.isWorking()) {
          mouse.checkBoundingBox(this, new BoundingBox(x, y2 - fontSize.getPixels("y"), x + this.measureText(ctx), y2));
        }
      } else if (this.children.length > 0) {
        const g = new GElement(this.document);
        g.children = this.children;
        g.parent = this;
        g.render(ctx);
      }
    }
    onClick() {
      const { window: window2 } = this.document;
      if (window2) {
        window2.open(this.getHrefAttribute().getString());
      }
    }
    onMouseMove() {
      const ctx = this.document.ctx;
      ctx.canvas.style.cursor = "pointer";
    }
    constructor(document2, node1, captureTextNodes) {
      super(document2, node1, captureTextNodes);
      this.type = "a";
      const { childNodes } = node1;
      const firstChild = childNodes[0];
      const hasText = childNodes.length > 0 && Array.from(childNodes).every(
        (node2) => node2.nodeType === 3
      );
      this.hasText = hasText;
      this.text = hasText ? this.getTextFromNode(firstChild) : "";
    }
  }
  class TextPathElement extends TextElement {
    getText() {
      return this.text;
    }
    path(ctx) {
      const { dataArray } = this;
      if (ctx) {
        ctx.beginPath();
      }
      dataArray.forEach((param) => {
        let { type, points } = param;
        switch (type) {
          case PathParser.LINE_TO:
            if (ctx) {
              ctx.lineTo(points[0], points[1]);
            }
            break;
          case PathParser.MOVE_TO:
            if (ctx) {
              ctx.moveTo(points[0], points[1]);
            }
            break;
          case PathParser.CURVE_TO:
            if (ctx) {
              ctx.bezierCurveTo(points[0], points[1], points[2], points[3], points[4], points[5]);
            }
            break;
          case PathParser.QUAD_TO:
            if (ctx) {
              ctx.quadraticCurveTo(points[0], points[1], points[2], points[3]);
            }
            break;
          case PathParser.ARC: {
            const [cx, cy, rx, ry, theta, dTheta, psi, fs] = points;
            const r2 = rx > ry ? rx : ry;
            const scaleX = rx > ry ? 1 : rx / ry;
            const scaleY = rx > ry ? ry / rx : 1;
            if (ctx) {
              ctx.translate(cx, cy);
              ctx.rotate(psi);
              ctx.scale(scaleX, scaleY);
              ctx.arc(0, 0, r2, theta, theta + dTheta, Boolean(1 - fs));
              ctx.scale(1 / scaleX, 1 / scaleY);
              ctx.rotate(-psi);
              ctx.translate(-cx, -cy);
            }
            break;
          }
          case PathParser.CLOSE_PATH:
            if (ctx) {
              ctx.closePath();
            }
            break;
        }
      });
    }
    renderChildren(ctx) {
      this.setTextData(ctx);
      ctx.save();
      const textDecoration = this.parent.getStyle("text-decoration").getString();
      const fontSize = this.getFontSize();
      const { glyphInfo } = this;
      const fill = ctx.fillStyle;
      if (textDecoration === "underline") {
        ctx.beginPath();
      }
      glyphInfo.forEach((glyph, i2) => {
        const { p0, p1, rotation, text: partialText } = glyph;
        ctx.save();
        ctx.translate(p0.x, p0.y);
        ctx.rotate(rotation);
        if (ctx.fillStyle) {
          ctx.fillText(partialText, 0, 0);
        }
        if (ctx.strokeStyle) {
          ctx.strokeText(partialText, 0, 0);
        }
        ctx.restore();
        if (textDecoration === "underline") {
          if (i2 === 0) {
            ctx.moveTo(p0.x, p0.y + fontSize / 8);
          }
          ctx.lineTo(p1.x, p1.y + fontSize / 5);
        }
      });
      if (textDecoration === "underline") {
        ctx.lineWidth = fontSize / 20;
        ctx.strokeStyle = fill;
        ctx.stroke();
        ctx.closePath();
      }
      ctx.restore();
    }
    getLetterSpacingAt() {
      let idx = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      return this.letterSpacingCache[idx] || 0;
    }
    findSegmentToFitChar(ctx, anchor, textFullWidth, fullPathWidth, spacesNumber, inputOffset, dy, c2, charI) {
      let offset = inputOffset;
      let glyphWidth = this.measureText(ctx, c2);
      if (c2 === " " && anchor === "justify" && textFullWidth < fullPathWidth) {
        glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
      }
      if (charI > -1) {
        offset += this.getLetterSpacingAt(charI);
      }
      const splineStep = this.textHeight / 20;
      const p0 = this.getEquidistantPointOnPath(offset, splineStep, 0);
      const p1 = this.getEquidistantPointOnPath(offset + glyphWidth, splineStep, 0);
      const segment = {
        p0,
        p1
      };
      const rotation = p0 && p1 ? Math.atan2(p1.y - p0.y, p1.x - p0.x) : 0;
      if (dy) {
        const dyX = Math.cos(Math.PI / 2 + rotation) * dy;
        const dyY = Math.cos(-rotation) * dy;
        segment.p0 = {
          ...p0,
          x: p0.x + dyX,
          y: p0.y + dyY
        };
        segment.p1 = {
          ...p1,
          x: p1.x + dyX,
          y: p1.y + dyY
        };
      }
      offset += glyphWidth;
      return {
        offset,
        segment,
        rotation
      };
    }
    measureText(ctx, text) {
      const { measuresCache } = this;
      const targetText = text || this.getText();
      if (measuresCache.has(targetText)) {
        return measuresCache.get(targetText);
      }
      const measure = this.measureTargetText(ctx, targetText);
      measuresCache.set(targetText, measure);
      return measure;
    }
    // This method supposes what all custom fonts already loaded.
    // If some font will be loaded after this method call, <textPath> will not be rendered correctly.
    // You need to call this method manually to update glyphs cache.
    setTextData(ctx) {
      if (this.glyphInfo) {
        return;
      }
      const renderText = this.getText();
      const chars = renderText.split("");
      const spacesNumber = renderText.split(" ").length - 1;
      const dx = this.parent.getAttribute("dx").split().map(
        (_2) => _2.getPixels("x")
      );
      const dy = this.parent.getAttribute("dy").getPixels("y");
      const anchor = this.parent.getStyle("text-anchor").getString("start");
      const thisSpacing = this.getStyle("letter-spacing");
      const parentSpacing = this.parent.getStyle("letter-spacing");
      let letterSpacing = 0;
      if (!thisSpacing.hasValue() || thisSpacing.getValue() === "inherit") {
        letterSpacing = parentSpacing.getPixels();
      } else if (thisSpacing.hasValue()) {
        if (thisSpacing.getValue() !== "initial" && thisSpacing.getValue() !== "unset") {
          letterSpacing = thisSpacing.getPixels();
        }
      }
      const letterSpacingCache = [];
      const textLen = renderText.length;
      this.letterSpacingCache = letterSpacingCache;
      for (let i1 = 0; i1 < textLen; i1++) {
        letterSpacingCache.push(typeof dx[i1] !== "undefined" ? dx[i1] : letterSpacing);
      }
      const dxSum = letterSpacingCache.reduce(
        (acc, cur, i2) => i2 === 0 ? 0 : acc + cur || 0,
        0
      );
      const textWidth = this.measureText(ctx);
      const textFullWidth = Math.max(textWidth + dxSum, 0);
      this.textWidth = textWidth;
      this.textHeight = this.getFontSize();
      this.glyphInfo = [];
      const fullPathWidth = this.getPathLength();
      const startOffset = this.getStyle("startOffset").getNumber(0) * fullPathWidth;
      let offset = 0;
      if (anchor === "middle" || anchor === "center") {
        offset = -textFullWidth / 2;
      }
      if (anchor === "end" || anchor === "right") {
        offset = -textFullWidth;
      }
      offset += startOffset;
      chars.forEach((char, i2) => {
        const { offset: nextOffset, segment, rotation } = this.findSegmentToFitChar(ctx, anchor, textFullWidth, fullPathWidth, spacesNumber, offset, dy, char, i2);
        offset = nextOffset;
        if (!segment.p0 || !segment.p1) {
          return;
        }
        this.glyphInfo.push({
          // transposeX: midpoint.x,
          // transposeY: midpoint.y,
          text: chars[i2],
          p0: segment.p0,
          p1: segment.p1,
          rotation
        });
      });
    }
    parsePathData(path) {
      this.pathLength = -1;
      if (!path) {
        return [];
      }
      const pathCommands = [];
      const { pathParser } = path;
      pathParser.reset();
      while (!pathParser.isEnd()) {
        const { current } = pathParser;
        const startX = current ? current.x : 0;
        const startY = current ? current.y : 0;
        const command = pathParser.next();
        let nextCommandType = command.type;
        let points = [];
        switch (command.type) {
          case PathParser.MOVE_TO:
            this.pathM(pathParser, points);
            break;
          case PathParser.LINE_TO:
            nextCommandType = this.pathL(pathParser, points);
            break;
          case PathParser.HORIZ_LINE_TO:
            nextCommandType = this.pathH(pathParser, points);
            break;
          case PathParser.VERT_LINE_TO:
            nextCommandType = this.pathV(pathParser, points);
            break;
          case PathParser.CURVE_TO:
            this.pathC(pathParser, points);
            break;
          case PathParser.SMOOTH_CURVE_TO:
            nextCommandType = this.pathS(pathParser, points);
            break;
          case PathParser.QUAD_TO:
            this.pathQ(pathParser, points);
            break;
          case PathParser.SMOOTH_QUAD_TO:
            nextCommandType = this.pathT(pathParser, points);
            break;
          case PathParser.ARC:
            points = this.pathA(pathParser);
            break;
          case PathParser.CLOSE_PATH:
            PathElement.pathZ(pathParser);
            break;
        }
        if (command.type !== PathParser.CLOSE_PATH) {
          pathCommands.push({
            type: nextCommandType,
            points,
            start: {
              x: startX,
              y: startY
            },
            pathLength: this.calcLength(startX, startY, nextCommandType, points)
          });
        } else {
          pathCommands.push({
            type: PathParser.CLOSE_PATH,
            points: [],
            pathLength: 0
          });
        }
      }
      return pathCommands;
    }
    pathM(pathParser, points) {
      const { x, y: y2 } = PathElement.pathM(pathParser).point;
      points.push(x, y2);
    }
    pathL(pathParser, points) {
      const { x, y: y2 } = PathElement.pathL(pathParser).point;
      points.push(x, y2);
      return PathParser.LINE_TO;
    }
    pathH(pathParser, points) {
      const { x, y: y2 } = PathElement.pathH(pathParser).point;
      points.push(x, y2);
      return PathParser.LINE_TO;
    }
    pathV(pathParser, points) {
      const { x, y: y2 } = PathElement.pathV(pathParser).point;
      points.push(x, y2);
      return PathParser.LINE_TO;
    }
    pathC(pathParser, points) {
      const { point, controlPoint, currentPoint } = PathElement.pathC(pathParser);
      points.push(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    }
    pathS(pathParser, points) {
      const { point, controlPoint, currentPoint } = PathElement.pathS(pathParser);
      points.push(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      return PathParser.CURVE_TO;
    }
    pathQ(pathParser, points) {
      const { controlPoint, currentPoint } = PathElement.pathQ(pathParser);
      points.push(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    }
    pathT(pathParser, points) {
      const { controlPoint, currentPoint } = PathElement.pathT(pathParser);
      points.push(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      return PathParser.QUAD_TO;
    }
    pathA(pathParser) {
      let { rX, rY, sweepFlag, xAxisRotation, centp, a1, ad } = PathElement.pathA(pathParser);
      if (sweepFlag === 0 && ad > 0) {
        ad -= 2 * Math.PI;
      }
      if (sweepFlag === 1 && ad < 0) {
        ad += 2 * Math.PI;
      }
      return [
        centp.x,
        centp.y,
        rX,
        rY,
        a1,
        ad,
        xAxisRotation,
        sweepFlag
      ];
    }
    calcLength(x, y2, commandType, points) {
      let len = 0;
      let p1 = null;
      let p2 = null;
      let t2 = 0;
      switch (commandType) {
        case PathParser.LINE_TO:
          return this.getLineLength(x, y2, points[0], points[1]);
        case PathParser.CURVE_TO:
          len = 0;
          p1 = this.getPointOnCubicBezier(0, x, y2, points[0], points[1], points[2], points[3], points[4], points[5]);
          for (t2 = 0.01; t2 <= 1; t2 += 0.01) {
            p2 = this.getPointOnCubicBezier(t2, x, y2, points[0], points[1], points[2], points[3], points[4], points[5]);
            len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }
          return len;
        case PathParser.QUAD_TO:
          len = 0;
          p1 = this.getPointOnQuadraticBezier(0, x, y2, points[0], points[1], points[2], points[3]);
          for (t2 = 0.01; t2 <= 1; t2 += 0.01) {
            p2 = this.getPointOnQuadraticBezier(t2, x, y2, points[0], points[1], points[2], points[3]);
            len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }
          return len;
        case PathParser.ARC: {
          len = 0;
          const start = points[4];
          const dTheta = points[5];
          const end = points[4] + dTheta;
          let inc = Math.PI / 180;
          if (Math.abs(start - end) < inc) {
            inc = Math.abs(start - end);
          }
          p1 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
          if (dTheta < 0) {
            for (t2 = start - inc; t2 > end; t2 -= inc) {
              p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t2, 0);
              len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
              p1 = p2;
            }
          } else {
            for (t2 = start + inc; t2 < end; t2 += inc) {
              p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t2, 0);
              len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
              p1 = p2;
            }
          }
          p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
          len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
          return len;
        }
      }
      return 0;
    }
    getPointOnLine(dist, p1x, p1y, p2x, p2y) {
      let fromX = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : p1x, fromY = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : p1y;
      const m2 = (p2y - p1y) / (p2x - p1x + PSEUDO_ZERO);
      let run = Math.sqrt(dist * dist / (1 + m2 * m2));
      if (p2x < p1x) {
        run *= -1;
      }
      let rise = m2 * run;
      let pt = null;
      if (p2x === p1x) {
        pt = {
          x: fromX,
          y: fromY + rise
        };
      } else if ((fromY - p1y) / (fromX - p1x + PSEUDO_ZERO) === m2) {
        pt = {
          x: fromX + run,
          y: fromY + rise
        };
      } else {
        let ix = 0;
        let iy = 0;
        const len = this.getLineLength(p1x, p1y, p2x, p2y);
        if (len < PSEUDO_ZERO) {
          return null;
        }
        let u2 = (fromX - p1x) * (p2x - p1x) + (fromY - p1y) * (p2y - p1y);
        u2 /= len * len;
        ix = p1x + u2 * (p2x - p1x);
        iy = p1y + u2 * (p2y - p1y);
        const pRise = this.getLineLength(fromX, fromY, ix, iy);
        const pRun = Math.sqrt(dist * dist - pRise * pRise);
        run = Math.sqrt(pRun * pRun / (1 + m2 * m2));
        if (p2x < p1x) {
          run *= -1;
        }
        rise = m2 * run;
        pt = {
          x: ix + run,
          y: iy + rise
        };
      }
      return pt;
    }
    getPointOnPath(distance) {
      const fullLen = this.getPathLength();
      let cumulativePathLength = 0;
      let p2 = null;
      if (distance < -5e-5 || distance - 5e-5 > fullLen) {
        return null;
      }
      const { dataArray } = this;
      for (const command of dataArray) {
        if (command && (command.pathLength < 5e-5 || cumulativePathLength + command.pathLength + 5e-5 < distance)) {
          cumulativePathLength += command.pathLength;
          continue;
        }
        const delta = distance - cumulativePathLength;
        let currentT = 0;
        switch (command.type) {
          case PathParser.LINE_TO:
            p2 = this.getPointOnLine(delta, command.start.x, command.start.y, command.points[0], command.points[1], command.start.x, command.start.y);
            break;
          case PathParser.ARC: {
            const start = command.points[4];
            const dTheta = command.points[5];
            const end = command.points[4] + dTheta;
            currentT = start + delta / command.pathLength * dTheta;
            if (dTheta < 0 && currentT < end || dTheta >= 0 && currentT > end) {
              break;
            }
            p2 = this.getPointOnEllipticalArc(command.points[0], command.points[1], command.points[2], command.points[3], currentT, command.points[6]);
            break;
          }
          case PathParser.CURVE_TO:
            currentT = delta / command.pathLength;
            if (currentT > 1) {
              currentT = 1;
            }
            p2 = this.getPointOnCubicBezier(currentT, command.start.x, command.start.y, command.points[0], command.points[1], command.points[2], command.points[3], command.points[4], command.points[5]);
            break;
          case PathParser.QUAD_TO:
            currentT = delta / command.pathLength;
            if (currentT > 1) {
              currentT = 1;
            }
            p2 = this.getPointOnQuadraticBezier(currentT, command.start.x, command.start.y, command.points[0], command.points[1], command.points[2], command.points[3]);
            break;
        }
        if (p2) {
          return p2;
        }
        break;
      }
      return null;
    }
    getLineLength(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    getPathLength() {
      if (this.pathLength === -1) {
        this.pathLength = this.dataArray.reduce(
          (length, command) => command.pathLength > 0 ? length + command.pathLength : length,
          0
        );
      }
      return this.pathLength;
    }
    getPointOnCubicBezier(pct, p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
      const x = p4x * CB1(pct) + p3x * CB2(pct) + p2x * CB3(pct) + p1x * CB4(pct);
      const y2 = p4y * CB1(pct) + p3y * CB2(pct) + p2y * CB3(pct) + p1y * CB4(pct);
      return {
        x,
        y: y2
      };
    }
    getPointOnQuadraticBezier(pct, p1x, p1y, p2x, p2y, p3x, p3y) {
      const x = p3x * QB1(pct) + p2x * QB2(pct) + p1x * QB3(pct);
      const y2 = p3y * QB1(pct) + p2y * QB2(pct) + p1y * QB3(pct);
      return {
        x,
        y: y2
      };
    }
    getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi) {
      const cosPsi = Math.cos(psi);
      const sinPsi = Math.sin(psi);
      const pt = {
        x: rx * Math.cos(theta),
        y: ry * Math.sin(theta)
      };
      return {
        x: cx + (pt.x * cosPsi - pt.y * sinPsi),
        y: cy + (pt.x * sinPsi + pt.y * cosPsi)
      };
    }
    // TODO need some optimisations. possibly build cache only for curved segments?
    buildEquidistantCache(inputStep, inputPrecision) {
      const fullLen = this.getPathLength();
      const precision = inputPrecision || 0.25;
      const step = inputStep || fullLen / 100;
      if (!this.equidistantCache || this.equidistantCache.step !== step || this.equidistantCache.precision !== precision) {
        this.equidistantCache = {
          step,
          precision,
          points: []
        };
        let s2 = 0;
        for (let l2 = 0; l2 <= fullLen; l2 += precision) {
          const p0 = this.getPointOnPath(l2);
          const p1 = this.getPointOnPath(l2 + precision);
          if (!p0 || !p1) {
            continue;
          }
          s2 += this.getLineLength(p0.x, p0.y, p1.x, p1.y);
          if (s2 >= step) {
            this.equidistantCache.points.push({
              x: p0.x,
              y: p0.y,
              distance: l2
            });
            s2 -= step;
          }
        }
      }
    }
    getEquidistantPointOnPath(targetDistance, step, precision) {
      this.buildEquidistantCache(step, precision);
      if (targetDistance < 0 || targetDistance - this.getPathLength() > 5e-5) {
        return null;
      }
      const idx = Math.round(targetDistance / this.getPathLength() * (this.equidistantCache.points.length - 1));
      return this.equidistantCache.points[idx] || null;
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "textPath";
      this.textWidth = 0;
      this.textHeight = 0;
      this.pathLength = -1;
      this.glyphInfo = null;
      this.letterSpacingCache = [];
      this.measuresCache = /* @__PURE__ */ new Map([
        [
          "",
          0
        ]
      ]);
      const pathElement = this.getHrefAttribute().getDefinition();
      this.text = this.getTextFromNode();
      this.dataArray = this.parsePathData(pathElement);
    }
  }
  const dataUriRegex = /^\s*data:(([^/,;]+\/[^/,;]+)(?:;([^,;=]+=[^,;=]+))?)?(?:;(base64))?,(.*)$/i;
  class ImageElement extends RenderedElement {
    async loadImage(href) {
      try {
        const image = await this.document.createImage(href);
        this.image = image;
      } catch (err) {
        console.error('Error while loading image "'.concat(href, '":'), err);
      }
      this.loaded = true;
    }
    async loadSvg(href) {
      const match = dataUriRegex.exec(href);
      if (match) {
        const data = match[5];
        if (data) {
          if (match[4] === "base64") {
            this.image = atob(data);
          } else {
            this.image = decodeURIComponent(data);
          }
        }
      } else {
        try {
          const response = await this.document.fetch(href);
          const svg = await response.text();
          this.image = svg;
        } catch (err) {
          console.error('Error while loading image "'.concat(href, '":'), err);
        }
      }
      this.loaded = true;
    }
    renderChildren(ctx) {
      const { document: document2, image, loaded } = this;
      const x = this.getAttribute("x").getPixels("x");
      const y2 = this.getAttribute("y").getPixels("y");
      const width = this.getStyle("width").getPixels("x");
      const height = this.getStyle("height").getPixels("y");
      if (!loaded || !image || !width || !height) {
        return;
      }
      ctx.save();
      ctx.translate(x, y2);
      if (typeof image === "string") {
        const subDocument = document2.canvg.forkString(ctx, image, {
          ignoreMouse: true,
          ignoreAnimation: true,
          ignoreDimensions: true,
          ignoreClear: true,
          offsetX: 0,
          offsetY: 0,
          scaleWidth: width,
          scaleHeight: height
        });
        const { documentElement } = subDocument.document;
        if (documentElement) {
          documentElement.parent = this;
        }
        void subDocument.render();
      } else {
        document2.setViewBox({
          ctx,
          aspectRatio: this.getAttribute("preserveAspectRatio").getString(),
          width,
          desiredWidth: image.width,
          height,
          desiredHeight: image.height
        });
        if (this.loaded) {
          if (!("complete" in image) || image.complete) {
            ctx.drawImage(image, 0, 0);
          }
        }
      }
      ctx.restore();
    }
    getBoundingBox() {
      const x = this.getAttribute("x").getPixels("x");
      const y2 = this.getAttribute("y").getPixels("y");
      const width = this.getStyle("width").getPixels("x");
      const height = this.getStyle("height").getPixels("y");
      return new BoundingBox(x, y2, x + width, y2 + height);
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "image";
      this.loaded = false;
      const href = this.getHrefAttribute().getString();
      if (!href) {
        return;
      }
      const isSvg = href.endsWith(".svg") || /^\s*data:image\/svg\+xml/i.test(href);
      document2.images.push(this);
      if (!isSvg) {
        void this.loadImage(href);
      } else {
        void this.loadSvg(href);
      }
    }
  }
  class SymbolElement extends RenderedElement {
    render(_2) {
    }
    constructor(...args) {
      super(...args);
      this.type = "symbol";
    }
  }
  class SVGFontLoader {
    async load(fontFamily, url) {
      try {
        const { document: document2 } = this;
        const svgDocument = await document2.canvg.parser.load(url);
        const fonts = svgDocument.getElementsByTagName("font");
        Array.from(fonts).forEach((fontNode) => {
          const font = document2.createElement(fontNode);
          document2.definitions[fontFamily] = font;
        });
      } catch (err) {
        console.error('Error while loading font "'.concat(url, '":'), err);
      }
      this.loaded = true;
    }
    constructor(document2) {
      this.document = document2;
      this.loaded = false;
      document2.fonts.push(this);
    }
  }
  class StyleElement extends Element {
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "style";
      const css = compressSpaces(
        Array.from(node2.childNodes).map(
          (_2) => _2.textContent
        ).join("").replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, "").replace(/@import.*;/g, "")
        // remove imports
      );
      const cssDefs = css.split("}");
      cssDefs.forEach((_1) => {
        const def = _1.trim();
        if (!def) {
          return;
        }
        const cssParts = def.split("{");
        const cssClasses = cssParts[0].split(",");
        const cssProps = cssParts[1].split(";");
        cssClasses.forEach((_2) => {
          const cssClass = _2.trim();
          if (!cssClass) {
            return;
          }
          const props = document2.styles[cssClass] || {};
          cssProps.forEach((cssProp) => {
            const prop = cssProp.indexOf(":");
            const name = cssProp.substr(0, prop).trim();
            const value = cssProp.substr(prop + 1, cssProp.length - prop).trim();
            if (name && value) {
              props[name] = new Property(document2, name, value);
            }
          });
          document2.styles[cssClass] = props;
          document2.stylesSpecificity[cssClass] = getSelectorSpecificity(cssClass);
          if (cssClass === "@font-face") {
            const fontFamily = props["font-family"].getString().replace(/"|'/g, "");
            const srcs = props.src.getString().split(",");
            srcs.forEach((src) => {
              if (src.indexOf('format("svg")') > 0) {
                const url = parseExternalUrl(src);
                if (url) {
                  void new SVGFontLoader(document2).load(fontFamily, url);
                }
              }
            });
          }
        });
      });
    }
  }
  StyleElement.parseExternalUrl = parseExternalUrl;
  class UseElement extends RenderedElement {
    setContext(ctx) {
      super.setContext(ctx);
      const xAttr = this.getAttribute("x");
      const yAttr = this.getAttribute("y");
      if (xAttr.hasValue()) {
        ctx.translate(xAttr.getPixels("x"), 0);
      }
      if (yAttr.hasValue()) {
        ctx.translate(0, yAttr.getPixels("y"));
      }
    }
    path(ctx) {
      const { element } = this;
      if (element) {
        element.path(ctx);
      }
    }
    renderChildren(ctx) {
      const { document: document2, element } = this;
      if (element) {
        let tempSvg = element;
        if (element.type === "symbol") {
          tempSvg = new SVGElement(document2);
          tempSvg.attributes.viewBox = new Property(document2, "viewBox", element.getAttribute("viewBox").getString());
          tempSvg.attributes.preserveAspectRatio = new Property(document2, "preserveAspectRatio", element.getAttribute("preserveAspectRatio").getString());
          tempSvg.attributes.overflow = new Property(document2, "overflow", element.getAttribute("overflow").getString());
          tempSvg.children = element.children;
          element.styles.opacity = new Property(document2, "opacity", this.calculateOpacity());
        }
        if (tempSvg.type === "svg") {
          const widthStyle = this.getStyle("width", false, true);
          const heightStyle = this.getStyle("height", false, true);
          if (widthStyle.hasValue()) {
            tempSvg.attributes.width = new Property(document2, "width", widthStyle.getString());
          }
          if (heightStyle.hasValue()) {
            tempSvg.attributes.height = new Property(document2, "height", heightStyle.getString());
          }
        }
        const oldParent = tempSvg.parent;
        tempSvg.parent = this;
        tempSvg.render(ctx);
        tempSvg.parent = oldParent;
      }
    }
    getBoundingBox(ctx) {
      const { element } = this;
      if (element) {
        return element.getBoundingBox(ctx);
      }
      return null;
    }
    elementTransform() {
      const { document: document2, element } = this;
      if (!element) {
        return null;
      }
      return Transform.fromElement(document2, element);
    }
    get element() {
      if (!this.cachedElement) {
        this.cachedElement = this.getHrefAttribute().getDefinition();
      }
      return this.cachedElement;
    }
    constructor(...args) {
      super(...args);
      this.type = "use";
    }
  }
  function imGet(img, x, y2, width, _height, rgba) {
    return img[y2 * width * 4 + x * 4 + rgba];
  }
  function imSet(img, x, y2, width, _height, rgba, val) {
    img[y2 * width * 4 + x * 4 + rgba] = val;
  }
  function m(matrix, i2, v2) {
    const mi = matrix[i2];
    return mi * v2;
  }
  function c(a2, m1, m2, m3) {
    return m1 + Math.cos(a2) * m2 + Math.sin(a2) * m3;
  }
  class FeColorMatrixElement extends Element {
    apply(ctx, _x, _y, width, height) {
      const { includeOpacity, matrix } = this;
      const srcData = ctx.getImageData(0, 0, width, height);
      for (let y2 = 0; y2 < height; y2++) {
        for (let x = 0; x < width; x++) {
          const r2 = imGet(srcData.data, x, y2, width, height, 0);
          const g = imGet(srcData.data, x, y2, width, height, 1);
          const b = imGet(srcData.data, x, y2, width, height, 2);
          const a2 = imGet(srcData.data, x, y2, width, height, 3);
          let nr = m(matrix, 0, r2) + m(matrix, 1, g) + m(matrix, 2, b) + m(matrix, 3, a2) + m(matrix, 4, 1);
          let ng = m(matrix, 5, r2) + m(matrix, 6, g) + m(matrix, 7, b) + m(matrix, 8, a2) + m(matrix, 9, 1);
          let nb = m(matrix, 10, r2) + m(matrix, 11, g) + m(matrix, 12, b) + m(matrix, 13, a2) + m(matrix, 14, 1);
          let na = m(matrix, 15, r2) + m(matrix, 16, g) + m(matrix, 17, b) + m(matrix, 18, a2) + m(matrix, 19, 1);
          if (includeOpacity) {
            nr = 0;
            ng = 0;
            nb = 0;
            na *= a2 / 255;
          }
          imSet(srcData.data, x, y2, width, height, 0, nr);
          imSet(srcData.data, x, y2, width, height, 1, ng);
          imSet(srcData.data, x, y2, width, height, 2, nb);
          imSet(srcData.data, x, y2, width, height, 3, na);
        }
      }
      ctx.clearRect(0, 0, width, height);
      ctx.putImageData(srcData, 0, 0);
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "feColorMatrix";
      let matrix = toNumbers(this.getAttribute("values").getString());
      switch (this.getAttribute("type").getString("matrix")) {
        case "saturate": {
          const s2 = matrix[0];
          matrix = [
            0.213 + 0.787 * s2,
            0.715 - 0.715 * s2,
            0.072 - 0.072 * s2,
            0,
            0,
            0.213 - 0.213 * s2,
            0.715 + 0.285 * s2,
            0.072 - 0.072 * s2,
            0,
            0,
            0.213 - 0.213 * s2,
            0.715 - 0.715 * s2,
            0.072 + 0.928 * s2,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ];
          break;
        }
        case "hueRotate": {
          const a2 = matrix[0] * Math.PI / 180;
          matrix = [
            c(a2, 0.213, 0.787, -0.213),
            c(a2, 0.715, -0.715, -0.715),
            c(a2, 0.072, -0.072, 0.928),
            0,
            0,
            c(a2, 0.213, -0.213, 0.143),
            c(a2, 0.715, 0.285, 0.14),
            c(a2, 0.072, -0.072, -0.283),
            0,
            0,
            c(a2, 0.213, -0.213, -0.787),
            c(a2, 0.715, -0.715, 0.715),
            c(a2, 0.072, 0.928, 0.072),
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ];
          break;
        }
        case "luminanceToAlpha":
          matrix = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0.2125,
            0.7154,
            0.0721,
            0,
            0,
            0,
            0,
            0,
            0,
            1
          ];
          break;
      }
      this.matrix = matrix;
      this.includeOpacity = this.getAttribute("includeOpacity").hasValue();
    }
  }
  class MaskElement extends Element {
    apply(ctx, element) {
      const { document: document2 } = this;
      let x = this.getAttribute("x").getPixels("x");
      let y2 = this.getAttribute("y").getPixels("y");
      let width = this.getStyle("width").getPixels("x");
      let height = this.getStyle("height").getPixels("y");
      if (!width && !height) {
        const boundingBox = new BoundingBox();
        this.children.forEach((child) => {
          boundingBox.addBoundingBox(child.getBoundingBox(ctx));
        });
        x = Math.floor(boundingBox.x1);
        y2 = Math.floor(boundingBox.y1);
        width = Math.floor(boundingBox.width);
        height = Math.floor(boundingBox.height);
      }
      const ignoredStyles = this.removeStyles(element, MaskElement.ignoreStyles);
      const maskCanvas = document2.createCanvas(x + width, y2 + height);
      const maskCtx = maskCanvas.getContext("2d");
      document2.screen.setDefaults(maskCtx);
      this.renderChildren(maskCtx);
      new FeColorMatrixElement(document2, {
        nodeType: 1,
        childNodes: [],
        attributes: [
          {
            nodeName: "type",
            value: "luminanceToAlpha"
          },
          {
            nodeName: "includeOpacity",
            value: "true"
          }
        ]
      }).apply(maskCtx, 0, 0, x + width, y2 + height);
      const tmpCanvas = document2.createCanvas(x + width, y2 + height);
      const tmpCtx = tmpCanvas.getContext("2d");
      document2.screen.setDefaults(tmpCtx);
      element.render(tmpCtx);
      tmpCtx.globalCompositeOperation = "destination-in";
      tmpCtx.fillStyle = maskCtx.createPattern(maskCanvas, "no-repeat");
      tmpCtx.fillRect(0, 0, x + width, y2 + height);
      ctx.fillStyle = tmpCtx.createPattern(tmpCanvas, "no-repeat");
      ctx.fillRect(0, 0, x + width, y2 + height);
      this.restoreStyles(element, ignoredStyles);
    }
    render(_2) {
    }
    constructor(...args) {
      super(...args);
      this.type = "mask";
    }
  }
  MaskElement.ignoreStyles = [
    "mask",
    "transform",
    "clip-path"
  ];
  const noop = () => {
  };
  class ClipPathElement extends Element {
    apply(ctx) {
      const { document: document2 } = this;
      const contextProto = Reflect.getPrototypeOf(ctx);
      const { beginPath, closePath } = ctx;
      if (contextProto) {
        contextProto.beginPath = noop;
        contextProto.closePath = noop;
      }
      Reflect.apply(beginPath, ctx, []);
      this.children.forEach((child) => {
        if (!("path" in child)) {
          return;
        }
        let transform = "elementTransform" in child ? child.elementTransform() : null;
        if (!transform) {
          transform = Transform.fromElement(document2, child);
        }
        if (transform) {
          transform.apply(ctx);
        }
        child.path(ctx);
        if (contextProto) {
          contextProto.closePath = closePath;
        }
        if (transform) {
          transform.unapply(ctx);
        }
      });
      Reflect.apply(closePath, ctx, []);
      ctx.clip();
      if (contextProto) {
        contextProto.beginPath = beginPath;
        contextProto.closePath = closePath;
      }
    }
    render(_2) {
    }
    constructor(...args) {
      super(...args);
      this.type = "clipPath";
    }
  }
  class FilterElement extends Element {
    apply(ctx, element) {
      const { document: document2, children } = this;
      const boundingBox = "getBoundingBox" in element ? element.getBoundingBox(ctx) : null;
      if (!boundingBox) {
        return;
      }
      let px = 0;
      let py = 0;
      children.forEach((child) => {
        const efd = child.extraFilterDistance || 0;
        px = Math.max(px, efd);
        py = Math.max(py, efd);
      });
      const width = Math.floor(boundingBox.width);
      const height = Math.floor(boundingBox.height);
      const tmpCanvasWidth = width + 2 * px;
      const tmpCanvasHeight = height + 2 * py;
      if (tmpCanvasWidth < 1 || tmpCanvasHeight < 1) {
        return;
      }
      const x = Math.floor(boundingBox.x);
      const y2 = Math.floor(boundingBox.y);
      const ignoredStyles = this.removeStyles(element, FilterElement.ignoreStyles);
      const tmpCanvas = document2.createCanvas(tmpCanvasWidth, tmpCanvasHeight);
      const tmpCtx = tmpCanvas.getContext("2d");
      document2.screen.setDefaults(tmpCtx);
      tmpCtx.translate(-x + px, -y2 + py);
      element.render(tmpCtx);
      children.forEach((child) => {
        if (typeof child.apply === "function") {
          child.apply(tmpCtx, 0, 0, tmpCanvasWidth, tmpCanvasHeight);
        }
      });
      ctx.drawImage(tmpCanvas, 0, 0, tmpCanvasWidth, tmpCanvasHeight, x - px, y2 - py, tmpCanvasWidth, tmpCanvasHeight);
      this.restoreStyles(element, ignoredStyles);
    }
    render(_2) {
    }
    constructor(...args) {
      super(...args);
      this.type = "filter";
    }
  }
  FilterElement.ignoreStyles = [
    "filter",
    "transform",
    "clip-path"
  ];
  class FeDropShadowElement extends Element {
    apply(_2, _x, _y, _width, _height) {
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "feDropShadow";
      this.addStylesFromStyleDefinition();
    }
  }
  class FeMorphologyElement extends Element {
    apply(_2, _x, _y, _width, _height) {
    }
    constructor(...args) {
      super(...args);
      this.type = "feMorphology";
    }
  }
  class FeCompositeElement extends Element {
    apply(_2, _x, _y, _width, _height) {
    }
    constructor(...args) {
      super(...args);
      this.type = "feComposite";
    }
  }
  class FeGaussianBlurElement extends Element {
    apply(ctx, x, y2, width, height) {
      const { document: document2, blurRadius } = this;
      const body = document2.window ? document2.window.document.body : null;
      const canvas = ctx.canvas;
      canvas.id = document2.getUniqueId();
      if (body) {
        canvas.style.display = "none";
        body.appendChild(canvas);
      }
      processCanvasRGBA(canvas, x, y2, width, height, blurRadius);
      if (body) {
        body.removeChild(canvas);
      }
    }
    constructor(document2, node2, captureTextNodes) {
      super(document2, node2, captureTextNodes);
      this.type = "feGaussianBlur";
      this.blurRadius = Math.floor(this.getAttribute("stdDeviation").getNumber());
      this.extraFilterDistance = this.blurRadius;
    }
  }
  class TitleElement extends Element {
    constructor(...args) {
      super(...args);
      this.type = "title";
    }
  }
  class DescElement extends Element {
    constructor(...args) {
      super(...args);
      this.type = "desc";
    }
  }
  const elements = {
    "svg": SVGElement,
    "rect": RectElement,
    "circle": CircleElement,
    "ellipse": EllipseElement,
    "line": LineElement,
    "polyline": PolylineElement,
    "polygon": PolygonElement,
    "path": PathElement,
    "pattern": PatternElement,
    "marker": MarkerElement,
    "defs": DefsElement,
    "linearGradient": LinearGradientElement,
    "radialGradient": RadialGradientElement,
    "stop": StopElement,
    "animate": AnimateElement,
    "animateColor": AnimateColorElement,
    "animateTransform": AnimateTransformElement,
    "font": FontElement,
    "font-face": FontFaceElement,
    "missing-glyph": MissingGlyphElement,
    "glyph": GlyphElement,
    "text": TextElement,
    "tspan": TSpanElement,
    "tref": TRefElement,
    "a": AElement,
    "textPath": TextPathElement,
    "image": ImageElement,
    "g": GElement,
    "symbol": SymbolElement,
    "style": StyleElement,
    "use": UseElement,
    "mask": MaskElement,
    "clipPath": ClipPathElement,
    "filter": FilterElement,
    "feDropShadow": FeDropShadowElement,
    "feMorphology": FeMorphologyElement,
    "feComposite": FeCompositeElement,
    "feColorMatrix": FeColorMatrixElement,
    "feGaussianBlur": FeGaussianBlurElement,
    "title": TitleElement,
    "desc": DescElement
  };
  function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  async function createImage(src) {
    let anonymousCrossOrigin = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    const image = document.createElement("img");
    if (anonymousCrossOrigin) {
      image.crossOrigin = "Anonymous";
    }
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (_event, _source, _lineno, _colno, error) => {
        reject(error);
      };
      image.src = src;
    });
  }
  const DEFAULT_EM_SIZE = 12;
  class Document {
    bindCreateImage(createImage1, anonymousCrossOrigin) {
      if (typeof anonymousCrossOrigin === "boolean") {
        return (source, forceAnonymousCrossOrigin) => createImage1(source, typeof forceAnonymousCrossOrigin === "boolean" ? forceAnonymousCrossOrigin : anonymousCrossOrigin);
      }
      return createImage1;
    }
    get window() {
      return this.screen.window;
    }
    get fetch() {
      return this.screen.fetch;
    }
    get ctx() {
      return this.screen.ctx;
    }
    get emSize() {
      const { emSizeStack } = this;
      return emSizeStack[emSizeStack.length - 1] || DEFAULT_EM_SIZE;
    }
    set emSize(value) {
      const { emSizeStack } = this;
      emSizeStack.push(value);
    }
    popEmSize() {
      const { emSizeStack } = this;
      emSizeStack.pop();
    }
    getUniqueId() {
      return "canvg".concat(++this.uniqueId);
    }
    isImagesLoaded() {
      return this.images.every(
        (_2) => _2.loaded
      );
    }
    isFontsLoaded() {
      return this.fonts.every(
        (_2) => _2.loaded
      );
    }
    createDocumentElement(document2) {
      const documentElement = this.createElement(document2.documentElement);
      documentElement.root = true;
      documentElement.addStylesFromStyleDefinition();
      this.documentElement = documentElement;
      return documentElement;
    }
    createElement(node2) {
      const elementType = node2.nodeName.replace(/^[^:]+:/, "");
      const ElementType = Document.elementTypes[elementType];
      if (ElementType) {
        return new ElementType(this, node2);
      }
      return new UnknownElement(this, node2);
    }
    createTextNode(node2) {
      return new TextNode(this, node2);
    }
    setViewBox(config) {
      this.screen.setViewBox({
        document: this,
        ...config
      });
    }
    constructor(canvg, { rootEmSize = DEFAULT_EM_SIZE, emSize = DEFAULT_EM_SIZE, createCanvas: createCanvas1 = Document.createCanvas, createImage: createImage2 = Document.createImage, anonymousCrossOrigin } = {}) {
      this.canvg = canvg;
      this.definitions = {};
      this.styles = {};
      this.stylesSpecificity = {};
      this.images = [];
      this.fonts = [];
      this.emSizeStack = [];
      this.uniqueId = 0;
      this.screen = canvg.screen;
      this.rootEmSize = rootEmSize;
      this.emSize = emSize;
      this.createCanvas = createCanvas1;
      this.createImage = this.bindCreateImage(createImage2, anonymousCrossOrigin);
      this.screen.wait(
        () => this.isImagesLoaded()
      );
      this.screen.wait(
        () => this.isFontsLoaded()
      );
    }
  }
  Document.createCanvas = createCanvas;
  Document.createImage = createImage;
  Document.elementTypes = elements;
  class Canvg {
    /**
    * Create Canvg instance from SVG source string or URL.
    * @param ctx - Rendering context.
    * @param svg - SVG source string or URL.
    * @param options - Rendering options.
    * @returns Canvg instance.
    */
    static async from(ctx, svg) {
      let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      const parser = new Parser(options);
      const svgDocument = await parser.parse(svg);
      return new Canvg(ctx, svgDocument, options);
    }
    /**
    * Create Canvg instance from SVG source string.
    * @param ctx - Rendering context.
    * @param svg - SVG source string.
    * @param options - Rendering options.
    * @returns Canvg instance.
    */
    static fromString(ctx, svg) {
      let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      const parser = new Parser(options);
      const svgDocument = parser.parseFromString(svg);
      return new Canvg(ctx, svgDocument, options);
    }
    /**
    * Create new Canvg instance with inherited options.
    * @param ctx - Rendering context.
    * @param svg - SVG source string or URL.
    * @param options - Rendering options.
    * @returns Canvg instance.
    */
    fork(ctx, svg) {
      let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return Canvg.from(ctx, svg, {
        ...this.options,
        ...options
      });
    }
    /**
    * Create new Canvg instance with inherited options.
    * @param ctx - Rendering context.
    * @param svg - SVG source string.
    * @param options - Rendering options.
    * @returns Canvg instance.
    */
    forkString(ctx, svg) {
      let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return Canvg.fromString(ctx, svg, {
        ...this.options,
        ...options
      });
    }
    /**
    * Document is ready promise.
    * @returns Ready promise.
    */
    ready() {
      return this.screen.ready();
    }
    /**
    * Document is ready value.
    * @returns Is ready or not.
    */
    isReady() {
      return this.screen.isReady();
    }
    /**
    * Render only first frame, ignoring animations and mouse.
    * @param options - Rendering options.
    */
    async render() {
      let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      this.start({
        enableRedraw: true,
        ignoreAnimation: true,
        ignoreMouse: true,
        ...options
      });
      await this.ready();
      this.stop();
    }
    /**
    * Start rendering.
    * @param options - Render options.
    */
    start() {
      let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      const { documentElement, screen, options: baseOptions } = this;
      screen.start(documentElement, {
        enableRedraw: true,
        ...baseOptions,
        ...options
      });
    }
    /**
    * Stop rendering.
    */
    stop() {
      this.screen.stop();
    }
    /**
    * Resize SVG to fit in given size.
    * @param width
    * @param height
    * @param preserveAspectRatio
    */
    resize(width) {
      let height = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : width, preserveAspectRatio = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
      this.documentElement.resize(width, height, preserveAspectRatio);
    }
    /**
    * Main constructor.
    * @param ctx - Rendering context.
    * @param svg - SVG Document.
    * @param options - Rendering options.
    */
    constructor(ctx, svg, options = {}) {
      this.parser = new Parser(options);
      this.screen = new Screen(ctx, options);
      this.options = options;
      const document2 = new Document(this, options);
      const documentElement = document2.createDocumentElement(svg);
      this.document = document2;
      this.documentElement = documentElement;
    }
  }
  const preset = index.offscreen({
    DOMParser: libExports.DOMParser
  });
  self.onmessage = async (event) => {
    const {
      width,
      height,
      offscreen: offscreen2,
      svg
    } = event.data;
    const ctx = offscreen2.getContext("2d");
    const v2 = await Canvg.from(ctx, svg, preset);
    v2.start({ ignoreAnimation: false });
  };
});
