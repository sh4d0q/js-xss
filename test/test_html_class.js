/**
 * tests for html parser
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */

var assert = require("assert");
var parser = require("../lib/parser");
var parseTag = parser.parseTag;
var parseAttr = parser.parseAttr;
var debug = require("debug")("xss:test");

describe("test HTML parser", function() {

  function escapeHtml(html) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function attr(n, v) {
  if (v) {
    return n + '="' + v.replace(/"/g, "&quote;") + '"';
  } else {
    return n;
  }
  }

  it("parse span with double class", function() {
  var html = parseTag(
    'hi:<span href="#"target=_blank title="this is a link" alt  = hello   class   = "hello1 hello2">link</span>',
    function(sourcePosition, position, tag, html, isClosing) {
      if (tag === "span") {
      if (isClosing) return "</span>";
      var attrhtml = parseAttr(html.slice(5, -1), function(name, value) {
        if (name === "href" || name === "target" || name === "alt" || name === "class") {
        return attr(name, value);
        }
      });
      return "<span " + attrhtml + ">";
      } else {
      return escapeHtml(html);
      }
    },
    escapeHtml
  );
  debug(html);
  assert.equal(html, 'hi:<span href="#" target="_blank" alt="hello" class="hello1 hello2">link</span>');
  });
});
