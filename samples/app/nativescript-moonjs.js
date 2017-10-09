
/*!
 * NativeScript-MoonJS
 * Released under MIT license.
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var view = require('ui/core/view');
var contentView = require('ui/content-view');
var layoutBase = require('ui/layouts/layout-base');
var Moon = _interopDefault(require('moonjs/dist/moon'));
var application = require('application');
var page = require('ui/page');

const elementMap = new Map();

const defaultViewMeta = {
  skipAddToDom: false,
  isUnaryTag: false,
  tagNamespace: '',
  canBeLeftOpen: false,
  model: {
    prop: 'text',
    event: 'textChange'
  }
};

function normalizeElementName(elementName) {
  return elementName.replace(/-/g, '').toLowerCase()
}

function registerElement(elementName, resolver, meta) {
  elementName = normalizeElementName(elementName);

  meta = Object.assign({}, defaultViewMeta, meta);

  if (elementMap.has(elementName)) {
    throw new Error(`Element for ${elementName} already registered.`)
  }

  const entry = { resolver: resolver, meta: meta };
  elementMap.set(elementName.toLowerCase(), entry);
}

function getViewClass(elementName) {
  elementName = normalizeElementName(elementName);
  const entry = elementMap.get(elementName.toLowerCase());

  if (!entry) {
    throw new TypeError(`No known component for element ${elementName}.`)
  }

  try {
    return entry.resolver()
  } catch (e) {
    throw new TypeError(`Could not load view for: ${elementName}. ${e}`)
  }
}

function getViewMeta(nodeName) {
  nodeName = normalizeElementName(nodeName);

  let meta = defaultViewMeta;
  const entry = elementMap.get(nodeName.toLowerCase());

  if (entry && entry.meta) {
    meta = entry.meta;
  }

  return meta
}



registerElement(
  'AbsoluteLayout',
  () => require('ui/layouts/absolute-layout').AbsoluteLayout
);
registerElement(
  'ActivityIndicator',
  () => require('ui/activity-indicator').ActivityIndicator
);
registerElement('Border', () => require('ui/border').Border);
registerElement('Button', () => require('ui/button').Button);
registerElement('ContentView', () => require('ui/content-view').ContentView);
registerElement('DatePicker', () => require('ui/date-picker').DatePicker, {
  model: {
    prop: 'date',
    event: 'dateChange'
  }
});
registerElement(
  'DockLayout',
  () => require('ui/layouts/dock-layout').DockLayout
);
registerElement(
  'GridLayout',
  () => require('ui/layouts/grid-layout').GridLayout
);
registerElement('HtmlView', () => require('ui/html-view').HtmlView);
registerElement('Image', () => require('ui/image').Image);
registerElement('img', () => require('ui/image').Image);
registerElement('Label', () => require('ui/label').Label);
registerElement('ListPicker', () => require('ui/list-picker').ListPicker, {
  model: {
    prop: 'selectedIndex',
    event: 'selectedIndexChange'
  }
});
registerElement('NativeActionBar', () => require('ui/action-bar').ActionBar);
registerElement('NativeActionItem', () => require('ui/action-bar').ActionItem);
registerElement('NativeListView', () => require('ui/list-view').ListView);
registerElement(
  'NativeNavigationButton',
  () => require('ui/action-bar').NavigationButton
);
registerElement('Page', () => require('ui/page').Page, {
  skipAddToDom: true
});
registerElement('Placeholder', () => require('ui/placeholder').Placeholder);
registerElement('Progress', () => require('ui/progress').Progress);
registerElement(
  'ProxyViewContainer',
  () => require('ui/proxy-view-container').ProxyViewContainer
);
registerElement('Repeater', () => require('ui/repeater').Repeater);
registerElement('ScrollView', () => require('ui/scroll-view').ScrollView);
registerElement('SearchBar', () => require('ui/search-bar').SearchBar);
registerElement(
  'SegmentedBar',
  () => require('ui/segmented-bar').SegmentedBar,
  {
    model: {
      prop: 'selectedIndex',
      event: 'selectedIndexChange'
    }
  }
);
registerElement(
  'SegmentedBarItem',
  () => require('ui/segmented-bar').SegmentedBarItem
);
registerElement('Slider', () => require('ui/slider').Slider, {
  model: {
    prop: 'value',
    event: 'valueChange'
  }
});
registerElement(
  'StackLayout',
  () => require('ui/layouts/stack-layout').StackLayout
);
registerElement(
  'FlexboxLayout',
  () => require('ui/layouts/flexbox-layout').FlexboxLayout
);
registerElement('Switch', () => require('ui/switch').Switch, {
  model: {
    prop: 'checked',
    event: 'checkedChange'
  }
});

registerElement('NativeTabView', () => require('ui/tab-view').TabView, {
  model: {
    prop: 'selectedIndex',
    event: 'selectedIndexChange'
  }
});
registerElement('NativeTabViewItem', () => require('ui/tab-view').TabViewItem, {
  skipAddToDom: true
});

registerElement('TextField', () => require('ui/text-field').TextField);
registerElement('TextView', () => require('ui/text-view').TextView);
registerElement('TimePicker', () => require('ui/time-picker').TimePicker, {
  model: {
    prop: 'time',
    event: 'timeChange'
  }
});
registerElement('WebView', () => require('ui/web-view').WebView);
registerElement(
  'WrapLayout',
  () => require('ui/layouts/wrap-layout').WrapLayout
);
registerElement(
  'FormattedString',
  () => require('text/formatted-string').FormattedString
);
registerElement('Span', () => require('text/span').Span);

registerElement(
  'DetachedContainer',
  () => require('ui/proxy-view-container').ProxyViewContainer,
  {
    skipAddToDom: true
  }
);
registerElement('DetachedText', () => require('ui/placeholder').Placeholder, {
  skipAddToDom: true
});
registerElement('Comment', () => require('ui/placeholder').Placeholder);
registerElement(
  'Document',
  () => require('ui/proxy-view-container').ProxyViewContainer,
  {
    skipAddToDom: true
  }
);

function isView(view$$1) {
  return view$$1 instanceof view.View
}

function isLayout(view$$1) {
  return view$$1 instanceof layoutBase.LayoutBase
}

function isContentView(view$$1) {
  return view$$1 instanceof contentView.ContentView
}

function insertChild(parentNode, childNode, atIndex = -1) {
  if (!parentNode || childNode.meta.skipAddToDom) {
    return
  }

  const parentView = parentNode.nativeView;
  const childView = childNode.nativeView;

  if (isLayout(parentView)) {
    if (childView.parent === parentView) {
      let index = parentView.getChildIndex(childView);
      if (index !== -1) {
        parentView.removeChild(childView);
      }
    }
    if (atIndex !== -1) {
      parentView.insertChild(childView, atIndex);
    } else {
      parentView.addChild(childView);
    }
  } else if (isContentView(parentView)) {
    if (childNode.nodeType === 8) {
      parentView._addView(childView, atIndex);
    } else {
      parentView.content = childView;
    }
  } else if (parentView && parentView._addChildFromBuilder) {
    parentView._addChildFromBuilder(
      childNode._nativeView.constructor.name,
      childView
    );
  } else {
    // throw new Error("Parent can"t contain children: " + parent.nodeName + ", " + parent);
  }
}

function removeChild(parentNode, childNode) {
  if (!parentNode || childNode.meta.skipAddToDom) {
    return
  }

  const parentView = parentNode.nativeView;
  const childView = childNode.nativeView;

  if (isLayout(parentView)) {
    parentView.removeChild(childView);
  } else if (isContentView(parentView)) {
    if (parentView.content === childView) {
      parentView.content = null;
    }

    if (childNode.nodeType === 8) {
      parentView._removeView(childView);
    }
  } else if (isView(parentView)) {
    parentView._removeView(childView);
  } else {
    // throw new Error("Unknown parent type: " + parent);
  }
}

const XML_ATTRIBUTES = Object.freeze([
  'style',
  'rows',
  'columns',
  'fontAttributes'
]);

class ViewNode {
  constructor() {
    this.nodeType = null;
    this._tagName = null;
    this.parentNode = null;
    this.childNodes = [];
    this.prevSibling = null;
    this.nextSibling = null;

    this._ownerDocument = null;
    this._nativeView = null;
    this._meta = null;

    /* istanbul ignore next
         * make vue happy :)
         */
    this.hasAttribute = this.removeAttribute = () => false;
  }

  /* istanbul ignore next */
  toString() {
    return `${this.constructor.name}(${this.tagName})`
  }

  set tagName(name) {
    this._tagName = normalizeElementName(name);
  }

  get tagName() {
    return this._tagName
  }

  get firstChild() {
    return this.childNodes.length ? this.childNodes[0] : null
  }

  get lastChild() {
    return this.childNodes.length
      ? this.childNodes[this.childNodes.length - 1]
      : null
  }

  get nativeView() {
    return this._nativeView
  }

  set nativeView(view$$1) {
    if (this._nativeView) {
      throw new Error(`Can't override native view.`)
    }

    this._nativeView = view$$1;
  }

  get meta() {
    if (this._meta) {
      return this._meta
    }

    return (this._meta = getViewMeta(this.tagName))
  }

  /* istanbul ignore next */
  get ownerDocument() {
    if (this._ownerDocument) {
      return this._ownerDocument
    }

    let el = this;
    while ((el = el.parentNode).nodeType !== 9) {
      // do nothing
    }

    return (this._ownerDocument = el)
  }

  /* istanbul ignore next */
  setAttribute(key, value) {
    try {
      if (XML_ATTRIBUTES.indexOf(key) !== -1) {
        this.nativeView._applyXmlAttribute(key, value);
      } else {
        this.nativeView[key] = value;
      }
    } catch (e) {
      throw new Error(`${this.tagName} has no property ${key}. (${e})`)
    }
  }

  /* istanbul ignore next */
  setStyle(property, value) {
    if (!(value = value.trim()).length) {
      return
    }

    if (property.endsWith('Align')) {
      // NativeScript uses Alignment instead of Align, this ensures that text-align works
      property += 'ment';
    }
    this.nativeView.style[property] = value;
  }

  /* istanbul ignore next */
  setText(text) {
    if (this.nodeType === 3) {
      this.parentNode.setText(text);
    } else {
      this.setAttribute('text', text);
    }
  }

  /* istanbul ignore next */
  addEventListener(event, handler) {
    this.nativeView.on(event, handler);
  }

  /* istanbul ignore next */
  removeEventListener(event) {
    this.nativeView.off(event);
  }

  insertBefore(childNode, referenceNode) {
    if (!childNode) {
      throw new Error(`Can't insert child.`)
    }

    if (referenceNode && referenceNode.parentNode !== this) {
      throw new Error(
        `Can't insert child, because the reference node has a different parent.`
      )
    }

    if (childNode.parentNode && childNode.parentNode !== this) {
      throw new Error(
        `Can't insert child, because it already has a different parent.`
      )
    }

    if (childNode.parentNode === this) {
      throw new Error(`Can't insert child, because it is already a child.`)
    }

    let index = this.childNodes.indexOf(referenceNode);

    childNode.parentNode = this;
    childNode.nextSibling = referenceNode;
    childNode.prevSibling = this.childNodes[index - 1];

    referenceNode.prevSibling = childNode;
    this.childNodes.splice(index, 0, childNode);

    insertChild(this, childNode, index);
  }

  appendChild(childNode) {
    if (!childNode) {
      throw new Error(`Can't append child.`)
    }

    if (childNode.parentNode && childNode.parentNode !== this) {
      throw new Error(
        `Can't append child, because it already has a different parent.`
      )
    }

    if (childNode.parentNode === this) {
      throw new Error(`Can't append child, because it is already a child.`)
    }

    childNode.parentNode = this;

    if (this.lastChild) {
      childNode.prevSibling = this.lastChild;
      this.lastChild.nextSibling = childNode;
    }

    this.childNodes.push(childNode);

    insertChild(this, childNode, this.childNodes.length - 1);
  }

  removeChild(childNode) {
    if (!childNode) {
      throw new Error(`Can't remove child.`)
    }

    if (!childNode.parentNode) {
      throw new Error(`Can't remove child, because it has no parent.`)
    }

    if (childNode.parentNode !== this) {
      throw new Error(`Can't remove child, because it has a different parent.`)
    }

    childNode.parentNode = null;

    if (childNode.prevSibling) {
      childNode.prevSibling.nextSibling = childNode.nextSibling;
    }

    if (childNode.nextSibling) {
      childNode.nextSibling.prevSibling = childNode.prevSibling;
    }

    this.childNodes = this.childNodes.filter(node => node !== childNode);

    removeChild(this, childNode);
  }
}

const VUE_ELEMENT_REF = '__vue_element_ref__';

class ElementNode extends ViewNode {
  constructor(tagName) {
    super();

    this.nodeType = 1;
    this.tagName = tagName;

    const viewClass = getViewClass(tagName);
    this._nativeView = new viewClass();
    this._nativeView[VUE_ELEMENT_REF] = this;
  }

  appendChild(childNode) {
    super.appendChild(childNode);

    if (childNode.nodeType === 3) {
      this.setText(childNode.text);
    }
  }

  insertBefore(childNode, referenceNode) {
    super.insertBefore(childNode, referenceNode);

    if (childNode.nodeType === 3) {
      this.setText(childNode.text);
    }
  }

  removeChild(childNode) {
    super.removeChild(childNode);

    if (childNode.nodeType === 3) {
      this.setText('');
    }
  }
}

class TextNode extends ElementNode {
  constructor(text) {
    super('comment');

    this.nodeType = 8;
    this.text = text;
  }
}

class TextNode$1 extends ViewNode {
  constructor(text) {
    super();

    this.nodeType = 3;
    this.text = text;

    this._meta = {
      skipAddToDom: true
    };
  }

  setText(text) {
    this.text = text;
    this.parentNode.setText(text);
  }
}

class DocumentNode extends ViewNode {
  constructor() {
    super();

    this.nodeType = 9;
    this.documentElement = new ElementNode('document');

    // make static methods accessible via this
    this.createComment = this.constructor.createComment;
    this.createElement = this.constructor.createElement;
    this.createElementNS = this.constructor.createElementNS;
    this.createTextNode = this.constructor.createTextNode;
  }

  static createComment(text) {
    return new TextNode(text)
  }

  static createElement(tagName) {
    return new ElementNode(tagName)
  }

  static createElementNS(namespace, tagName) {
    return new ElementNode(namespace + ':' + tagName)
  }

  static createTextNode(text) {
    return new TextNode$1(text)
  }
}

global.document = new DocumentNode();

Moon.prototype.$start = function () {
  this.__is_root__ = true;

  const placeholder = document.createElement('placeholder');

  this.mount(placeholder);
};

const mountMoon = Moon.prototype.mount;

const mount = function (el) {
  if (this.__is_root__) {
    const self = this;

    application.start({
      create() {
        console.log('>>>>>> CREATE');
        console.log(el);
        mountMoon.call(self, el);

        console.dir(Object.keys(self));
        //const page = self.root.nativeView

        return new page.Page
      }
    });
  } else {
    mountMoon.call(this, el);
  }
};

Moon.prototype.mount = function (el) {
  return mount.call(this, el)
};

module.exports = Moon;
//# sourceMappingURL=nativescript-moonjs.js.map
