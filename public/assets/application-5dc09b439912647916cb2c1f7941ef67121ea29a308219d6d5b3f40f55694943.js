/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, fire, prepareOptions, processResponse;

      CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var response;
          response = processResponse(xhr.response, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if (!(typeof options.beforeSend === "function" ? options.beforeSend(xhr, options) : void 0)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=113)}([function(e,t,n){"use strict";e.exports=n(114)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(214),o=n(84),i=n(218);n.d(t,"Provider",function(){return r.b}),n.d(t,"createProvider",function(){return r.a}),n.d(t,"connectAdvanced",function(){return o.a}),n.d(t,"connect",function(){return i.a})},function(e,t,n){e.exports=n(215)()},function(e,t,n){"use strict";var r=function(){};e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(225);n.d(t,"BrowserRouter",function(){return r.a});var o=n(227);n.d(t,"HashRouter",function(){return o.a});var i=n(91);n.d(t,"Link",function(){return i.a});var a=n(229);n.d(t,"MemoryRouter",function(){return a.a});var u=n(232);n.d(t,"NavLink",function(){return u.a});var l=n(235);n.d(t,"Prompt",function(){return l.a});var s=n(237);n.d(t,"Redirect",function(){return s.a});var c=n(92);n.d(t,"Route",function(){return c.a});var f=n(55);n.d(t,"Router",function(){return f.a});var p=n(243);n.d(t,"StaticRouter",function(){return p.a});var d=n(245);n.d(t,"Switch",function(){return d.a});var h=n(247);n.d(t,"matchPath",function(){return h.a});var y=n(248);n.d(t,"withRouter",function(){return y.a})},function(e,t,n){"use strict";var r=function(e,t,n,r,o,i,a,u){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var s=[n,r,o,i,a,u],c=0;l=new Error(t.replace(/%s/g,function(){return s[c++]})),l.name="Invariant Violation"}throw l.framesToPop=1,l}};e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=t.OPEN_MODAL="OPEN_MODAL",o=t.CLOSE_MODAL="CLOSE_MODAL";t.openModal=function(e){return{type:r,modal:e}},t.closeModal=function(){return{type:o}}},function(e,t,n){var r=n(70),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();e.exports=i},function(e,t){var n=Array.isArray;e.exports=n},function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}Object.defineProperty(t,"__esModule",{value:!0}),t.deleteFollow=t.createFollow=t.removeLike=t.deleteLike=t.receiveLike=t.createLike=t.receiveErrors=t.searchTaggedUsers=t.updateUser=t.fetchUser=t.RECEIVE_USERS=t.REMOVE_FOLLOW=t.RECEIVE_FOLLOW=t.REMOVE_LIKE=t.RECEIVE_LIKE=t.RECEIVE_USER_FORM_ERRORS=t.RECEIVE_USER=void 0;var o=n(199),i=r(o),a=n(200),u=r(a),l=n(201),s=r(l),c=t.RECEIVE_USER="RECEIVE_USER",f=t.RECEIVE_USER_FORM_ERRORS="RECEIVE_USER_FORM_ERRORS",p=t.RECEIVE_LIKE="RECEIVE_LIKE",d=t.REMOVE_LIKE="REMOVE_LIKE",h=t.RECEIVE_FOLLOW="RECEIVE_FOLLOW",y=t.REMOVE_FOLLOW="REMOVE_FOLLOW",v=t.RECEIVE_USERS="RECEIVE_USERS",m=(t.fetchUser=function(e){return function(t){return i.fetchUser(e).then(function(e){return t(b(e))})}},t.updateUser=function(e){return function(t){return i.updateUser(e).then(function(e){return t(b(e))},function(e){return t(g(e.responseJSON))})}},t.searchTaggedUsers=function(e){return function(t){return i.searchTaggedUsers(e).then(function(e){return t(m(e))},function(e){return t(g(e.responseJSON))})}},function(e){return{type:v,users:e}}),b=function(e){return{type:c,user:e}},g=t.receiveErrors=function(e){return{type:f,errors:e}},_=(t.createLike=function(e){return function(t){return u.createLike(e).then(function(e){return t(_(e))})}},t.receiveLike=function(e){return{type:p,like:e}}),w=(t.deleteLike=function(e){var t=e.user_id,n=e.story_id;return function(e){return u.deleteLike({user_id:t,story_id:n}).then(function(t){return e(w(t))})}},t.removeLike=function(e){return{type:d,like:e}}),E=(t.createFollow=function(e){return function(t){return s.createFollow(e).then(function(e){return t(E(e))})}},t.deleteFollow=function(e){var t=e.follower_id,n=e.following_id;return function(e){return s.deleteFollow({follower_id:t,following_id:n}).then(function(t){return e(O(t))})}},function(e){return{type:h,follow:e}}),O=function(e){return{type:y,follow:e}}},function(e,t){function n(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.receiveStory=t.deleteStory=t.updateStory=t.createStory=t.fetchStories=t.fetchUserStories=t.fetchLikedStories=t.searchTaggedStories=t.fetchStory=t.RECEIVE_FORM_ERRORS=t.REMOVE_STORY=t.RECEIVE_STORIES=t.RECEIVE_STORY=void 0;var r=n(205),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),i=t.RECEIVE_STORY="RECEIVE_STORY",a=t.RECEIVE_STORIES="RECEIVE_STORIES",u=t.REMOVE_STORY="REMOVE_STORY",l=t.RECEIVE_FORM_ERRORS="RECEIVE_FORM_ERRORS",s=(t.fetchStory=function(e){return function(t){return o.fetchStory(e).then(function(e){return t(f(e))})}},t.searchTaggedStories=function(e){return function(t){return o.searchTaggedStories(e).then(function(e){return t(c(e))},function(e){return t(p(e.responseJSON))})}},t.fetchLikedStories=function(e){return function(t){return o.fetchLikedStories(e).then(function(e){return t(c(e))})}},t.fetchUserStories=function(e){return function(t){return o.fetchUserStories(e).then(function(e){return t(c(e))})}},t.fetchStories=function(){return function(e){return o.fetchStories().then(function(t){return e(c(t))})}},t.createStory=function(e){return function(t){return o.createStory(e).then(function(e){return t(f(e))},function(e){return t(p(e.responseJSON))})}},t.updateStory=function(e){return function(t){return o.updateStory(e).then(function(e){return t(f(e))},function(e){return t(p(e.responseJSON))})}},t.deleteStory=function(e){return function(t){return o.deleteStory(e).then(function(e){return t(s(e.id))})}},function(e){return{type:u,storyId:e}}),c=function(e){return{type:a,stories:e}},f=t.receiveStory=function(e){return{type:i,story:e}},p=t.receiveErrors=function(e){return{type:l,errors:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.signup=t.logout=t.login=t.RECEIVE_SESSION_ERRORS=t.RECEIVE_CURRENT_USER=void 0;var r=n(140),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),i=t.RECEIVE_CURRENT_USER="RECEIVE_CURRENT_USER",a=t.RECEIVE_SESSION_ERRORS="RECEIVE_SESSION_ERRORS",u=(t.login=function(e){return function(t){return o.login(e).then(function(e){return t(u(e))},function(e){return t(l(e.responseJSON))})}},t.logout=function(){return function(e){return o.logout().then(function(){return e(u(null))},function(t){return e(l(t.responseJSON))})}},t.signup=function(e){return function(t){return o.signup(e).then(function(e){return t(u(e))},function(e){return t(l(e.responseJSON))})}},function(e){return{type:i,currentUser:e}}),l=t.receiveErrors=function(e){return{type:a,errors:e}}},function(e,t,n){function r(e,t){var n=i(e,t);return o(n)?n:void 0}var o=n(152),i=n(157);e.exports=r},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t,n){function r(e){return null==e?void 0===e?l:u:s&&s in Object(e)?i(e):a(e)}var o=n(29),i=n(153),a=n(154),u="[object Null]",l="[object Undefined]",s=o?o.toStringTag:void 0;e.exports=r},function(e,t,n){function r(e){return null!=e&&i(e.length)&&!o(e)}var o=n(41),i=n(47);e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(66),o=n(134),i=n(135),a=n(136),u=n(69);n(68);n.d(t,"createStore",function(){return r.b}),n.d(t,"combineReducers",function(){return o.a}),n.d(t,"bindActionCreators",function(){return i.a}),n.d(t,"applyMiddleware",function(){return a.a}),n.d(t,"compose",function(){return u.a})},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){"use strict";t.__esModule=!0;var r=(t.addLeadingSlash=function(e){return"/"===e.charAt(0)?e:"/"+e},t.stripLeadingSlash=function(e){return"/"===e.charAt(0)?e.substr(1):e},t.hasBasename=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)});t.stripBasename=function(e,t){return r(e,t)?e.substr(t.length):e},t.stripTrailingSlash=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},t.parsePath=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}},t.createPath=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}},function(e,t,n){"use strict";n.d(t,"a",function(){return r}),n.d(t,"f",function(){return o}),n.d(t,"c",function(){return i}),n.d(t,"e",function(){return a}),n.d(t,"g",function(){return u}),n.d(t,"d",function(){return l}),n.d(t,"b",function(){return s});var r=function(e){return"/"===e.charAt(0)?e:"/"+e},o=function(e){return"/"===e.charAt(0)?e.substr(1):e},i=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)},a=function(e,t){return i(e,t)?e.substr(t.length):e},u=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},l=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}},s=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=n(4),f=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={username:"",password:""},n.handleSubmit=n.handleSubmit.bind(n),n}return a(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=Object.assign({},this.state);this.props.processForm(t).then(this.props.closeModal)}},{key:"update",value:function(e){var t=this;return function(n){return t.setState(r({},e,n.target.value))}}},{key:"render",value:function(){var e=this.props.errors.map(function(e,t){return s.default.createElement("li",{key:t},e)});return s.default.createElement("div",{className:"login-form-container"},s.default.createElement("button",{className:"x-close",onClick:this.props.closeModal},"X"),s.default.createElement("form",{onSubmit:this.handleSubmit,className:"form-session"},s.default.createElement("h3",null,this.props.headerMessage),s.default.createElement("br",null),s.default.createElement("p",null,this.props.modalMessage),s.default.createElement("br",null),s.default.createElement("input",{className:"input-field",placeholder:"username",onChange:this.update("username"),type:"text",value:this.state.username}),s.default.createElement("br",null),s.default.createElement("input",{className:"input-field",placeholder:"password",onChange:this.update("password"),type:"password",value:this.state.password}),s.default.createElement("br",null),s.default.createElement("ul",{className:"error-message"},e),s.default.createElement("input",{className:"submit-button",type:"submit",value:"Continue"}),s.default.createElement("br",null),s.default.createElement("p",{className:"formText"},this.props.redirectPageMessage,this.props.otherForm)))}}]),t}(s.default.Component);t.default=(0,c.withRouter)(f)},function(e,t,n){"use strict";function r(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var o=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,u,l=r(e),s=1;s<arguments.length;s++){n=Object(arguments[s]);for(var c in n)i.call(n,c)&&(l[c]=n[c]);if(o){u=o(n);for(var f=0;f<u.length;f++)a.call(n,u[f])&&(l[u[f]]=n[u[f]])}}return l}},function(e,t,n){"use strict";var r={};e.exports=r},function(e,t,n){"use strict";function r(e){return function(){return e}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},e.exports=o},function(e,t,n){var r=n(141),o=n(191),i=o(function(e,t,n){r(e,t,n)});e.exports=i},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(142),i=n(143),a=n(144),u=n(145),l=n(146);r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=a,r.prototype.has=u,r.prototype.set=l,e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n;return-1}var o=n(19);e.exports=r},function(e,t,n){var r=n(7),o=r.Symbol;e.exports=o},function(e,t,n){var r=n(13),o=r(Object,"create");e.exports=o},function(e,t,n){function r(e,t){var n=e.__data__;return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(166);e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.deleteStory=t.updateComment=t.createComment=t.fetchComments=t.fetchUserComments=t.fetchComment=t.RECEIVE_FORM_ERRORS=t.REMOVE_COMMENT=t.RECEIVE_COMMENTS=t.RECEIVE_COMMENT=void 0;var r=n(211),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),i=t.RECEIVE_COMMENT="RECEIVE_COMMENT",a=t.RECEIVE_COMMENTS="RECEIVE_COMMENTS",u=t.REMOVE_COMMENT="REMOVE_COMMENT",l=t.RECEIVE_FORM_ERRORS="RECEIVE_FORM_ERRORS",s=(t.fetchComment=function(e){return function(t){return o.fetchComment(e).then(function(e){return t(f(e))})}},t.fetchUserComments=function(e){return function(t){return o.fetchUserComments(e).then(function(e){return t(c(e))})}},t.fetchComments=function(e){return function(t){return o.fetchComments(e).then(function(e){return t(c(e))})}},t.createComment=function(e){return function(t){return o.createComment(e).then(function(e){return t(f(e))},function(e){return t(p(e.responseJSON))})}},t.updateComment=function(e){return function(t){return o.updateComment(e).then(function(e){return t(f(e))},function(e){return t(p(e.responseJSON))})}},t.deleteStory=function(e){return function(t){return o.deleteStory(e).then(function(e){return t(s(e.id))})}},function(e){return{type:u,commentId:e}}),c=function(e){return{type:a,comments:e}},f=function(e){return{type:i,comment:e}},p=t.receiveErrors=function(e){return{type:l,errors:e}}},function(e,t,n){"use strict";n.d(t,"a",function(){return u}),n.d(t,"b",function(){return l});var r=n(88),o=n(89),i=n(21),a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(e,t,n,o){var u=void 0;"string"==typeof e?(u=Object(i.d)(e),u.state=t):(u=a({},e),void 0===u.pathname&&(u.pathname=""),u.search?"?"!==u.search.charAt(0)&&(u.search="?"+u.search):u.search="",u.hash?"#"!==u.hash.charAt(0)&&(u.hash="#"+u.hash):u.hash="",void 0!==t&&void 0===u.state&&(u.state=t));try{u.pathname=decodeURI(u.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+u.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(u.key=n),o?u.pathname?"/"!==u.pathname.charAt(0)&&(u.pathname=Object(r.default)(u.pathname,o.pathname)):u.pathname=o.pathname:u.pathname||(u.pathname="/"),u},l=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&Object(o.default)(e.state,t.state)}},function(e,t,n){function r(e){return a(e)?o(e):i(e)}var o=n(80),i=n(277),a=n(16);e.exports=r},function(e,t,n){function r(e){return"symbol"==typeof e||i(e)&&o(e)==a}var o=n(15),i=n(14),a="[object Symbol]";e.exports=r},function(e,t,n){function r(e){if("string"==typeof e||o(e))return e;var t=e+"";return"0"==t&&1/e==-i?"-0":t}var o=n(35),i=1/0;e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=(t.selectAuthoredStories=function(e,t){return t?t.authoredStories.map(function(t){return e.stories[t]}):[]},t.selectAuthoredComments=function(e,t){return t?t.comments.map(function(t){return e.comments[t]}):[]},t.selectLikedStories=function(e,t){return t?t.likes.map(function(t){return e.stories[t]}):[]},function(e,t){if(e[1]){var n=[];return Object.values(e).forEach(function(e){t.includes(e.author_id)?n.unshift(e):n.push(e)}),n}return[]});t.getFollowingStoriesFirst=function(e,t){return t?r(e.stories,Object.values(t)[0].following):[]}},function(e,t,n){"use strict";function r(e){if(!Object(a.a)(e)||Object(o.a)(e)!=u)return!1;var t=Object(i.a)(e);if(null===t)return!0;var n=f.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==p}var o=n(123),i=n(128),a=n(130),u="[object Object]",l=Function.prototype,s=Object.prototype,c=l.toString,f=s.hasOwnProperty,p=c.call(Object);t.a=r},function(e,t,n){function r(e){var t=this.__data__=new o(e);this.size=t.size}var o=n(27),i=n(147),a=n(148),u=n(149),l=n(150),s=n(151);r.prototype.clear=i,r.prototype.delete=a,r.prototype.get=u,r.prototype.has=l,r.prototype.set=s,e.exports=r},function(e,t,n){var r=n(13),o=n(7),i=r(o,"Map");e.exports=i},function(e,t,n){function r(e){if(!i(e))return!1;var t=o(e);return t==u||t==l||t==a||t==s}var o=n(15),i=n(10),a="[object AsyncFunction]",u="[object Function]",l="[object GeneratorFunction]",s="[object Proxy]";e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(158),i=n(165),a=n(167),u=n(168),l=n(169);r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=a,r.prototype.has=u,r.prototype.set=l,e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(73);e.exports=r},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t){function n(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||r)}var r=Object.prototype;e.exports=n},function(e,t,n){var r=n(178),o=n(14),i=Object.prototype,a=i.hasOwnProperty,u=i.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&a.call(e,"callee")&&!u.call(e,"callee")};e.exports=l},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r}var r=9007199254740991;e.exports=n},function(e,t,n){(function(e){var r=n(7),o=n(180),i="object"==typeof t&&t&&!t.nodeType&&t,a=i&&"object"==typeof e&&e&&!e.nodeType&&e,u=a&&a.exports===i,l=u?r.Buffer:void 0,s=l?l.isBuffer:void 0,c=s||o;e.exports=c}).call(t,n(44)(e))},function(e,t,n){var r=n(182),o=n(183),i=n(184),a=i&&i.isTypedArray,u=a?o(a):r;e.exports=u},function(e,t){function n(e,t){var n=typeof e;return!!(t=null==t?r:t)&&("number"==n||"symbol"!=n&&o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/;e.exports=n},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){"use strict";function r(e){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(e);try{throw new Error(e)}catch(e){}}t.a=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.locationsAreEqual=t.createLocation=void 0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(88),a=r(i),u=n(89),l=r(u),s=n(20);t.createLocation=function(e,t,n,r){var i=void 0;"string"==typeof e?(i=(0,s.parsePath)(e),i.state=t):(i=o({},e),void 0===i.pathname&&(i.pathname=""),i.search?"?"!==i.search.charAt(0)&&(i.search="?"+i.search):i.search="",i.hash?"#"!==i.hash.charAt(0)&&(i.hash="#"+i.hash):i.hash="",void 0!==t&&void 0===i.state&&(i.state=t));try{i.pathname=decodeURI(i.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+i.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(i.key=n),r?i.pathname?"/"!==i.pathname.charAt(0)&&(i.pathname=(0,a.default)(i.pathname,r.pathname)):i.pathname=r.pathname:i.pathname||(i.pathname="/"),i},t.locationsAreEqual=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&(0,l.default)(e.state,t.state)}},function(e,t,n){"use strict";t.__esModule=!0;var r=n(3),o=function(e){return e&&e.__esModule?e:{default:e}}(r),i=function(){var e=null,t=function(t){return(0,o.default)(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},n=function(t,n,r,i){if(null!=e){var a="function"==typeof e?e(t,n):e;"string"==typeof a?"function"==typeof r?r(a,i):((0,o.default)(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),i(!0)):i(!1!==a)}else i(!0)},r=[];return{setPrompt:t,confirmTransitionTo:n,appendListener:function(e){var t=!0,n=function(){t&&e.apply(void 0,arguments)};return r.push(n),function(){t=!1,r=r.filter(function(e){return e!==n})}},notifyListeners:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.forEach(function(e){return e.apply(void 0,t)})}}};t.default=i},function(e,t,n){"use strict";var r=n(56);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(3),u=n.n(a),l=n(5),s=n.n(l),c=n(0),f=n.n(c),p=n(2),d=n.n(p),h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},y=function(e){function t(){var n,i,a;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=i=o(this,e.call.apply(e,[this].concat(l))),i.state={match:i.computeMatch(i.props.history.location.pathname)},a=n,o(i,a)}return i(t,e),t.prototype.getChildContext=function(){return{router:h({},this.context.router,{history:this.props.history,route:{location:this.props.history.location,match:this.state.match}})}},t.prototype.computeMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}},t.prototype.componentWillMount=function(){var e=this,t=this.props,n=t.children,r=t.history;s()(null==n||1===f.a.Children.count(n),"A <Router> may have only one child element"),this.unlisten=r.listen(function(){e.setState({match:e.computeMatch(r.location.pathname)})})},t.prototype.componentWillReceiveProps=function(e){u()(this.props.history===e.history,"You cannot change <Router history>")},t.prototype.componentWillUnmount=function(){this.unlisten()},t.prototype.render=function(){var e=this.props.children;return e?f.a.Children.only(e):null},t}(f.a.Component);y.propTypes={history:d.a.object.isRequired,children:d.a.node},y.contextTypes={router:d.a.object},y.childContextTypes={router:d.a.object.isRequired},t.a=y},function(e,t,n){"use strict";var r=n(233),o=n.n(r),i={},a=0,u=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=i[n]||(i[n]={});if(r[e])return r[e];var u=[],l=o()(e,u,t),s={re:l,keys:u};return a<1e4&&(r[e]=s,a++),s},l=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"string"==typeof t&&(t={path:t});var n=t,r=n.path,o=void 0===r?"/":r,i=n.exact,a=void 0!==i&&i,l=n.strict,s=void 0!==l&&l,c=n.sensitive,f=void 0!==c&&c,p=u(o,{end:a,strict:s,sensitive:f}),d=p.re,h=p.keys,y=d.exec(e);if(!y)return null;var v=y[0],m=y.slice(1),b=e===v;return a&&!b?null:{path:o,url:"/"===o&&""===v?"/":v,isExact:b,params:h.reduce(function(e,t,n){return e[t.name]=m[n],e},{})}};t.a=l},function(e,t,n){"use strict";var r=n(3),o=n.n(r),i=function(){var e=null,t=function(t){return o()(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},n=function(t,n,r,i){if(null!=e){var a="function"==typeof e?e(t,n):e;"string"==typeof a?"function"==typeof r?r(a,i):(o()(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),i(!0)):i(!1!==a)}else i(!0)},r=[];return{setPrompt:t,confirmTransitionTo:n,appendListener:function(e){var t=!0,n=function(){t&&e.apply(void 0,arguments)};return r.push(n),function(){t=!1,r=r.filter(function(e){return e!==n})}},notifyListeners:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.forEach(function(e){return e.apply(void 0,t)})}}};t.a=i},function(e,t,n){var r=n(99);e.exports=n(257),e.exports.Quill=r,e.exports.Mixin=n(101),e.exports.Toolbar=n(309)},function(e,t,n){function r(e){return"function"==typeof e?e:null==e?a:"object"==typeof e?u(e)?i(e[0],e[1]):o(e):l(e)}var o=n(260),i=n(285),a=n(51),u=n(8),l=n(296);e.exports=r},function(e,t,n){function r(e,t,n,a,u){return e===t||(null==e||null==t||!i(e)&&!i(t)?e!==e&&t!==t:o(e,t,n,a,r,u))}var o=n(262),i=n(14);e.exports=r},function(e,t,n){function r(e,t){if(o(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!i(e))||(u.test(e)||!a.test(e)||null!=t&&e in Object(t))}var o=n(8),i=n(35),a=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,u=/^\w*$/;e.exports=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(4),f=n(112),p=(r(f),n(64)),d=r(p),h=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"render",value:function(){var e=this,t="controlsHide",n=this.props.story,r="",o="";return this.props.currentUser&&parseInt(Object.keys(this.props.currentUser)[0])===n.author_id&&(t="controlsShow"),n.title&&(r=n.title.substring(0,40),n.title.length!==r.length&&(r+="...")),n.subtitle&&(o=""+n.subtitle.substring(0,140),n.subtitle.length!==o.length&&(o+="...")),s.default.createElement("li",{className:"story-item-li "+this.props.feature},s.default.createElement("div",{className:"story-item"},s.default.createElement(c.Link,{className:"story-title",to:"/story/"+n.id},r),s.default.createElement("br",null),s.default.createElement(c.Link,{className:"story-preview",to:"/story/"+n.id},s.default.createElement("p",{className:"story-show-body"},o)),s.default.createElement("div",{className:"user-follow-container"},s.default.createElement(c.Link,{className:"author",to:"/user/"+n.author_id},n.author),s.default.createElement(d.default,{user:n.author_id})),s.default.createElement("p",{className:"create-date"},n.created_at),s.default.createElement("div",{className:"update-date"},s.default.createElement("div",{className:"arrow-up"}),"Updated ",n.updated_at),s.default.createElement("div",{className:t},s.default.createElement(c.Link,{className:"edit-link",to:"/story/"+n.id+"/edit"},"Edit Story"),s.default.createElement("button",{className:"remove-story",onClick:function(){return e.props.deleteStory(n.id).then(e.props.history.push("/"))}},"Delete Story"))),s.default.createElement(c.Link,{to:"/story/"+n.id},s.default.createElement("img",{className:"story-header-img",src:n.image_url})))}}]),t}(s.default.Component);t.default=(0,c.withRouter)(h)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(324),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(9),u=n(6),l=function(e,t){return{userId:t.user,currentUser:e.session.currentUser}},s=function(e){return{clearErrors:function(){return e((0,a.receiveErrors)([]))},openModal:function(t){return e((0,u.openModal)(t))},closeModal:function(){return e((0,u.closeModal)())},createFollow:function(t){return e((0,a.createFollow)(t))},deleteFollow:function(t){return e((0,a.deleteFollow)(t))},fetchUser:function(t){return e((0,a.fetchUser)(t))}}};t.default=(0,r.connect)(l,s)(i.default)},function(e,t,n){"use strict";function r(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}r(),e.exports=n(115)},function(e,t,n){"use strict";function r(e,t,n){function u(){m===v&&(m=v.slice())}function l(){return y}function s(e){if("function"!=typeof e)throw new Error("Expected listener to be a function.");var t=!0;return u(),m.push(e),function(){if(t){t=!1,u();var n=m.indexOf(e);m.splice(n,1)}}}function c(e){if(!Object(o.a)(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(b)throw new Error("Reducers may not dispatch actions.");try{b=!0,y=h(y,e)}finally{b=!1}for(var t=v=m,n=0;n<t.length;n++){(0,t[n])()}return e}function f(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");h=e,c({type:a.INIT})}function p(){var e,t=s;return e={subscribe:function(e){function n(){e.next&&e.next(l())}if("object"!=typeof e)throw new TypeError("Expected the observer to be an object.");return n(),{unsubscribe:t(n)}}},e[i.a]=function(){return this},e}var d;if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(r)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var h=e,y=t,v=[],m=v,b=!1;return c({type:a.INIT}),d={dispatch:c,subscribe:s,getState:l,replaceReducer:f},d[i.a]=p,d}n.d(t,"a",function(){return a}),t.b=r;var o=n(38),i=n(131),a={INIT:"@@redux/INIT"}},function(e,t,n){"use strict";var r=n(124),o=r.a.Symbol;t.a=o},function(e,t,n){"use strict"},function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}t.a=r},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,n(18))},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(e){}try{return e+""}catch(e){}}return""}var r=Function.prototype,o=r.toString;e.exports=n},function(e,t,n){function r(e,t,n){(void 0===n||i(e[t],n))&&(void 0!==n||t in e)||o(e,t,n)}var o=n(43),i=n(19);e.exports=r},function(e,t,n){var r=n(13),o=function(){try{var e=r(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,n){var r=n(170),o=r();e.exports=o},function(e,t,n){var r=n(7),o=r.Uint8Array;e.exports=o},function(e,t,n){var r=n(77),o=r(Object.getPrototypeOf,Object);e.exports=o},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t){function n(e,t){return"__proto__"==t?void 0:e[t]}e.exports=n},function(e,t,n){function r(e){return a(e)?o(e,!0):i(e)}var o=n(80),i=n(189),a=n(16);e.exports=r},function(e,t,n){function r(e,t){var n=a(e),r=!n&&i(e),c=!n&&!r&&u(e),p=!n&&!r&&!c&&s(e),d=n||r||c||p,h=d?o(e.length,String):[],y=h.length;for(var v in e)!t&&!f.call(e,v)||d&&("length"==v||c&&("offset"==v||"parent"==v)||p&&("buffer"==v||"byteLength"==v||"byteOffset"==v)||l(v,y))||h.push(v);return h}var o=n(188),i=n(46),a=n(8),u=n(48),l=n(50),s=n(49),c=Object.prototype,f=c.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t,n){if(!u(n))return!1;var r=typeof t;return!!("number"==r?i(n)&&a(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(19),i=n(16),a=n(50),u=n(10);e.exports=r},function(e,t,n){"use strict";function r(e,t,n,r,i,a,u,l){if(o(t),!e){var s;if(void 0===t)s=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,i,a,u,l],f=0;s=new Error(t.replace(/%s/g,function(){return c[f++]})),s.name="Invariant Violation"}throw s.framesToPop=1,s}}var o=function(e){};e.exports=r},function(e,t,n){"use strict";n.d(t,"b",function(){return i}),n.d(t,"a",function(){return a});var r=n(2),o=n.n(r),i=o.a.shape({trySubscribe:o.a.func.isRequired,tryUnsubscribe:o.a.func.isRequired,notifyNestedSubs:o.a.func.isRequired,isSubscribed:o.a.func.isRequired}),a=o.a.shape({subscribe:o.a.func.isRequired,dispatch:o.a.func.isRequired,getState:o.a.func.isRequired})},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function u(){}function l(e,t){var n={run:function(r){try{var o=e(t.getState(),r);(o!==n.props||n.error)&&(n.shouldComponentUpdate=!0,n.props=o,n.error=null)}catch(e){n.shouldComponentUpdate=!0,n.error=e}}};return n}function s(e){var t,n,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=s.getDisplayName,p=void 0===c?function(e){return"ConnectAdvanced("+e+")"}:c,_=s.methodName,w=void 0===_?"connectAdvanced":_,E=s.renderCountProp,O=void 0===E?void 0:E,x=s.shouldHandleStateChanges,k=void 0===x||x,S=s.storeKey,C=void 0===S?"store":S,P=s.withRef,j=void 0!==P&&P,T=a(s,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef"]),N=C+"Subscription",A=b++,R=(t={},t[C]=v.a,t[N]=v.b,t),M=(n={},n[N]=v.b,n);return function(t){d()("function"==typeof t,"You must pass a component to the function returned by "+w+". Instead received "+JSON.stringify(t));var n=t.displayName||t.name||"Component",a=p(n),s=m({},T,{getDisplayName:p,methodName:w,renderCountProp:O,shouldHandleStateChanges:k,storeKey:C,withRef:j,displayName:a,wrappedComponentName:n,WrappedComponent:t}),c=function(n){function c(e,t){r(this,c);var i=o(this,n.call(this,e,t));return i.version=A,i.state={},i.renderCount=0,i.store=e[C]||t[C],i.propsMode=Boolean(e[C]),i.setWrappedInstance=i.setWrappedInstance.bind(i),d()(i.store,'Could not find "'+C+'" in either the context or props of "'+a+'". Either wrap the root component in a <Provider>, or explicitly pass "'+C+'" as a prop to "'+a+'".'),i.initSelector(),i.initSubscription(),i}return i(c,n),c.prototype.getChildContext=function(){var e,t=this.propsMode?null:this.subscription;return e={},e[N]=t||this.context[N],e},c.prototype.componentDidMount=function(){k&&(this.subscription.trySubscribe(),this.selector.run(this.props),this.selector.shouldComponentUpdate&&this.forceUpdate())},c.prototype.componentWillReceiveProps=function(e){this.selector.run(e)},c.prototype.shouldComponentUpdate=function(){return this.selector.shouldComponentUpdate},c.prototype.componentWillUnmount=function(){this.subscription&&this.subscription.tryUnsubscribe(),this.subscription=null,this.notifyNestedSubs=u,this.store=null,this.selector.run=u,this.selector.shouldComponentUpdate=!1},c.prototype.getWrappedInstance=function(){return d()(j,"To access the wrapped instance, you need to specify { withRef: true } in the options argument of the "+w+"() call."),this.wrappedInstance},c.prototype.setWrappedInstance=function(e){this.wrappedInstance=e},c.prototype.initSelector=function(){var t=e(this.store.dispatch,s);this.selector=l(t,this.store),this.selector.run(this.props)},c.prototype.initSubscription=function(){if(k){var e=(this.propsMode?this.props:this.context)[N];this.subscription=new y.a(this.store,e,this.onStateChange.bind(this)),this.notifyNestedSubs=this.subscription.notifyNestedSubs.bind(this.subscription)}},c.prototype.onStateChange=function(){this.selector.run(this.props),this.selector.shouldComponentUpdate?(this.componentDidUpdate=this.notifyNestedSubsOnComponentDidUpdate,this.setState(g)):this.notifyNestedSubs()},c.prototype.notifyNestedSubsOnComponentDidUpdate=function(){this.componentDidUpdate=void 0,this.notifyNestedSubs()},c.prototype.isSubscribed=function(){return Boolean(this.subscription)&&this.subscription.isSubscribed()},c.prototype.addExtraProps=function(e){if(!(j||O||this.propsMode&&this.subscription))return e;var t=m({},e);return j&&(t.ref=this.setWrappedInstance),O&&(t[O]=this.renderCount++),this.propsMode&&this.subscription&&(t[N]=this.subscription),t},c.prototype.render=function(){var e=this.selector;if(e.shouldComponentUpdate=!1,e.error)throw e.error;return Object(h.createElement)(t,this.addExtraProps(e.props))},c}(h.Component);return c.WrappedComponent=t,c.displayName=a,c.childContextTypes=M,c.contextTypes=R,c.propTypes=R,f()(c,t)}}t.a=s;var c=n(85),f=n.n(c),p=n(5),d=n.n(p),h=n(0),y=(n.n(h),n(217)),v=n(83),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},b=0,g={}},function(e,t,n){!function(t,n){e.exports=n()}(0,function(){"use strict";var e={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},t={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},n=Object.defineProperty,r=Object.getOwnPropertyNames,o=Object.getOwnPropertySymbols,i=Object.getOwnPropertyDescriptor,a=Object.getPrototypeOf,u=a&&a(Object);return function l(s,c,f){if("string"!=typeof c){if(u){var p=a(c);p&&p!==u&&l(s,p,f)}var d=r(c);o&&(d=d.concat(o(c)));for(var h=0;h<d.length;++h){var y=d[h];if(!(e[y]||t[y]||f&&f[y])){var v=i(c,y);try{n(s,y,v)}catch(e){}}}return s}return s}})},function(e,t,n){"use strict";function r(e){return function(t,n){function r(){return o}var o=e(t,n);return r.dependsOnOwnProps=!1,r}}function o(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function i(e,t){return function(t,n){var r=(n.displayName,function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)});return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=o(e);var i=r(t,n);return"function"==typeof i&&(r.mapToProps=i,r.dependsOnOwnProps=o(i),i=r(t,n)),i},r}}t.a=r,t.b=i;n(87)},function(e,t,n){"use strict";n(38),n(52)},function(e,t,n){"use strict";function r(e){return"/"===e.charAt(0)}function o(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}function i(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],i=t&&t.split("/")||[],a=e&&r(e),u=t&&r(t),l=a||u;if(e&&r(e)?i=n:n.length&&(i.pop(),i=i.concat(n)),!i.length)return"/";var s=void 0;if(i.length){var c=i[i.length-1];s="."===c||".."===c||""===c}else s=!1;for(var f=0,p=i.length;p>=0;p--){var d=i[p];"."===d?o(i,p):".."===d?(o(i,p),f++):f&&(o(i,p),f--)}if(!l)for(;f--;f)i.unshift("..");!l||""===i[0]||i[0]&&r(i[0])||i.unshift("");var h=i.join("/");return s&&"/"!==h.substr(-1)&&(h+="/"),h}Object.defineProperty(t,"__esModule",{value:!0}),t.default=i},function(e,t,n){"use strict";function r(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(Array.isArray(e))return Array.isArray(t)&&e.length===t.length&&e.every(function(e,n){return r(e,t[n])});var n=void 0===e?"undefined":o(e);if(n!==(void 0===t?"undefined":o(t)))return!1;if("object"===n){var i=e.valueOf(),a=t.valueOf();if(i!==e||a!==t)return r(i,a);var u=Object.keys(e),l=Object.keys(t);return u.length===l.length&&u.every(function(n){return r(e[n],t[n])})}return!1}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=r},function(e,t,n){"use strict";t.__esModule=!0;t.canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement),t.addEventListener=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},t.removeEventListener=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},t.getConfirmation=function(e,t){return t(window.confirm(e))},t.supportsHistory=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},t.supportsPopStateOnHashChange=function(){return-1===window.navigator.userAgent.indexOf("Trident")},t.supportsGoWithoutReloadUsingHash=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},t.isExtraneousPopstateEvent=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(0),l=n.n(u),s=n(2),c=n.n(s),f=n(5),p=n.n(f),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},y=function(e){function t(){var n,r,a;o(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=r=i(this,e.call.apply(e,[this].concat(l))),r.handleClick=function(e){if(r.props.onClick&&r.props.onClick(e),!e.defaultPrevented&&0===e.button&&!r.props.target&&!h(e)){e.preventDefault();var t=r.context.router.history,n=r.props,o=n.replace,i=n.to;o?t.replace(i):t.push(i)}},a=n,i(r,a)}return a(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),n=e.innerRef,o=r(e,["replace","to","innerRef"]);p()(this.context.router,"You should not use <Link> outside a <Router>");var i=this.context.router.history.createHref("string"==typeof t?{pathname:t}:t);return l.a.createElement("a",d({},o,{onClick:this.handleClick,href:i,ref:n}))},t}(l.a.Component);y.propTypes={onClick:c.a.func,target:c.a.string,replace:c.a.bool,to:c.a.oneOfType([c.a.string,c.a.object]).isRequired,innerRef:c.a.oneOfType([c.a.string,c.a.func])},y.defaultProps={replace:!1},y.contextTypes={router:c.a.shape({history:c.a.shape({push:c.a.func.isRequired,replace:c.a.func.isRequired,createHref:c.a.func.isRequired}).isRequired}).isRequired},t.a=y},function(e,t,n){"use strict";var r=n(93);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(3),u=n.n(a),l=n(5),s=n.n(l),c=n(0),f=n.n(c),p=n(2),d=n.n(p),h=n(57),y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},v=function(e){return 0===f.a.Children.count(e)},m=function(e){function t(){var n,i,a;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=i=o(this,e.call.apply(e,[this].concat(l))),i.state={match:i.computeMatch(i.props,i.context.router)},a=n,o(i,a)}return i(t,e),t.prototype.getChildContext=function(){return{router:y({},this.context.router,{route:{location:this.props.location||this.context.router.route.location,match:this.state.match}})}},t.prototype.computeMatch=function(e,t){var n=e.computedMatch,r=e.location,o=e.path,i=e.strict,a=e.exact,u=e.sensitive;if(n)return n;s()(t,"You should not use <Route> or withRouter() outside a <Router>");var l=t.route,c=(r||l.location).pathname;return o?Object(h.a)(c,{path:o,strict:i,exact:a,sensitive:u}):l.match},t.prototype.componentWillMount=function(){u()(!(this.props.component&&this.props.render),"You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"),u()(!(this.props.component&&this.props.children&&!v(this.props.children)),"You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"),u()(!(this.props.render&&this.props.children&&!v(this.props.children)),"You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored")},t.prototype.componentWillReceiveProps=function(e,t){u()(!(e.location&&!this.props.location),'<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),u()(!(!e.location&&this.props.location),'<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'),this.setState({match:this.computeMatch(e,t.router)})},t.prototype.render=function(){var e=this.state.match,t=this.props,n=t.children,r=t.component,o=t.render,i=this.context.router,a=i.history,u=i.route,l=i.staticContext,s=this.props.location||u.location,c={match:e,location:s,history:a,staticContext:l};return r?e?f.a.createElement(r,c):null:o?e?o(c):null:n?"function"==typeof n?n(c):v(n)?null:f.a.Children.only(n):null},t}(f.a.Component);m.propTypes={computedMatch:d.a.object,path:d.a.string,exact:d.a.bool,strict:d.a.bool,sensitive:d.a.bool,component:d.a.func,render:d.a.func,children:d.a.oneOfType([d.a.func,d.a.node]),location:d.a.object},m.contextTypes={router:d.a.shape({history:d.a.object.isRequired,route:d.a.object.isRequired,staticContext:d.a.object})},m.childContextTypes={router:d.a.object.isRequired},t.a=m},function(e,t,n){"use strict";n.d(t,"b",function(){return r}),n.d(t,"a",function(){return o}),n.d(t,"e",function(){return i}),n.d(t,"c",function(){return a}),n.d(t,"g",function(){return u}),n.d(t,"h",function(){return l}),n.d(t,"f",function(){return s}),n.d(t,"d",function(){return c});var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},i=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},a=function(e,t){return t(window.confirm(e))},u=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},l=function(){return-1===window.navigator.userAgent.indexOf("Trident")},s=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},c=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(1),u=n(12),l=n(6),s=n(22),c=r(s),f=function(e){return{errors:e.errors.session,formType:"login",redirectPageMessage:"No account? ",headerMessage:"Welcome back.",modalMessage:"Sign in to access your account. You can like, follow others and write your own stories. Tell your tale. Keep on writing."}},p=function(e){return{processForm:function(t){return e((0,u.login)(t))},otherForm:i.default.createElement("button",{className:"other-form-button",onClick:function(){return e((0,l.openModal)("signup"))}},"Create One."),closeModal:function(){return e((0,l.closeModal)())},clearErrors:function(){return e((0,u.receiveErrors)([]))}}};t.default=(0,a.connect)(f,p)(c.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(1),u=n(12),l=n(22),s=r(l),c=n(6),f=function(e,t){return{errors:e.errors.session,formType:"signup",redirectPageMessage:"Already have an account? ",headerMessage:"Join Betwixt.",modalMessage:"Create an account join all the fun. All your friends are doing it. Write your own stories. Like other stories. Comment and share your stories. Read more, it is good for you. Join today."}},p=function(e){return{processForm:function(t){return e((0,u.signup)(t))},otherForm:i.default.createElement("button",{className:"other-form-button",onClick:function(){return e((0,c.openModal)("login"))}},"Login."),closeModal:function(){return e((0,c.closeModal)())},clearErrors:function(){return e((0,u.receiveErrors)([]))}}};t.default=(0,a.connect)(f,p)(s.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(98),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(11),u=function(e,t){return{story:{id:"",title:"",author_id:"",body:""},errors:e.errors.form,authorId:Object.keys(e.session.currentUser)[0]}},l=function(e){return{action:function(t){return e((0,a.createStory)(t))},clearErrors:function(){return e((0,a.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),c=r(s),f=n(4),p=n(59),d=r(p),h=function(e){function t(e){i(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),r=n.props.story.subtitle||"",o=n.props.story.tags||[];return n.state={id:n.props.story.id,title:n.props.story.title,author_id:n.props.story.authorId,body:n.props.story.body,subtitle:r,imageUrl:n.props.story.image_url,imageFile:null,placeholder:"Write something decent...",tags:o},n.update=n.update.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.handleQuillChange=n.handleQuillChange.bind(n),n.fileAdd=n.fileAdd.bind(n),n.addTags=n.addTags.bind(n),n.removeTag=n.removeTag.bind(n),n}return u(t,e),l(t,[{key:"update",value:function(e){var t=this;return function(n){return t.setState(o({},e,n.target.value))}}},{key:"componentDidMount",value:function(){var e=this,t=document.getElementById("tag-input");t.addEventListener("keyup",function(n){n.preventDefault(),13===n.keyCode&&(e.addTags(t.value),t.value="")})}},{key:"goBack",value:function(){this.props.history.push("/")}},{key:"handleQuillChange",value:function(e){this.setState({body:e})}},{key:"fileAdd",value:function(e){var t=this,n=new FileReader,r=e.currentTarget.files[0];n.onloadend=function(){return t.setState({imageUrl:n.result,imageFile:r})},r?n.readAsDataURL(r):this.setState({imageUrl:"",imageFile:null})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=new FormData;n.append("story[title]",this.state.title),n.append("story[body]",this.state.body),n.append("story[author_id]",this.props.authorId),n.append("story[id]",this.props.story.id),n.append("story[subtitle]",this.state.subtitle),n.append("story[all_tags]",this.state.tags),this.state.imageFile&&n.append("story[image]",this.state.imageFile),this.props.action(n).then(function(e){return t.props.history.push("/story/"+Object.keys(e.story)[0])})}},{key:"displayTags",value:function(){var e=this;if(this.state.tags.length>0){var t=this.state.tags.map(function(t){return c.default.createElement("li",null,c.default.createElement("p",null,t),c.default.createElement("span",{id:"remove-tag",onClick:e.removeTag},"x"))});return c.default.createElement("ul",{className:"tag-form-display"},t)}return c.default.createElement("ul",{className:"tag-list"})}},{key:"addTags",value:function(e){if(0!==e.trim().length){var t=this.state.tags;if(0===t.length?t=[e.trim()]:this.state.tags.includes(e.trim())||t.push(e.trim()),this.setState({tags:t}),5===this.state.tags.length){var n=document.getElementById("tag-input"),r=document.getElementById("tag-message");n.style.display="none",r.style.display="inline-block"}}}},{key:"removeTag",value:function(e){var t=e.target.parentElement,n=t.firstChild.innerHTML,r=[];if(this.state.tags.forEach(function(e,t){e!==n&&r.push(e)}),this.setState({tags:r}),this.state.tags.length<=5){var o=document.getElementById("tag-input"),i=document.getElementById("tag-message");o.style.display="inline-block",i.style.display="none"}}},{key:"render",value:function(){var e=this.props.errors.map(function(e,t){return c.default.createElement("li",{key:t},e)});return c.default.createElement("div",{className:"story-form"},c.default.createElement("link",{href:"https://cdn.quilljs.com/1.3.6/quill.snow.css",rel:"stylesheet"}),c.default.createElement("input",{className:"title-input",placeholder:"Title",type:"text",value:this.state.title,onChange:this.update("title")}),c.default.createElement("br",null),c.default.createElement("input",{className:"subtitle-input",placeholder:"Tell a little about your story...",type:"text",value:this.state.subtitle,onChange:this.update("subtitle")}),c.default.createElement("br",null),c.default.createElement("label",{className:"header-image-label"},"Add a header image...",c.default.createElement("input",{className:"image-input",type:"file",onChange:this.fileAdd}),c.default.createElement("img",{className:"story-header-img",src:this.state.imageUrl})),c.default.createElement("br",null),c.default.createElement(d.default,{theme:"snow",value:this.state.body,onChange:this.handleQuillChange,modules:t.modules,formats:t.formats,placeholder:this.state.placeholder}),c.default.createElement("ul",{className:"error-message"},e),this.displayTags(),c.default.createElement("input",{id:"tag-input",placeholder:"Add a tag...",type:"text"}),c.default.createElement("p",{id:"tag-message"},"Limit of 5 tags, add or change tags so readers know what your story is about"),c.default.createElement("br",null),c.default.createElement("button",{className:"input-publish",onClick:this.handleSubmit},"Publish"))}}]),t}(c.default.Component);h.modules={toolbar:[[{header:"1"},{header:"2"}],["bold","italic","underline","strike"],[{list:"ordered"},{list:"bullet"}],["image"]]},h.formats=["header","font","size","bold","italic","underline","strike","blockquote","list","bullet","indent","link","image","video"],t.default=(0,f.withRouter)(h)},function(e,t,n){(function(t){/*!
 * Quill Editor v1.3.6
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
!function(t,n){e.exports=n()}("undefined"!=typeof self&&self,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=109)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(17),o=n(18),i=n(19),a=n(45),u=n(46),l=n(47),s=n(48),c=n(49),f=n(12),p=n(32),d=n(33),h=n(31),y=n(1),v={Scope:y.Scope,create:y.create,find:y.find,query:y.query,register:y.register,Container:r.default,Format:o.default,Leaf:i.default,Embed:s.default,Scroll:a.default,Block:l.default,Inline:u.default,Text:c.default,Attributor:{Attribute:f.default,Class:p.default,Style:d.default,Store:h.default}};t.default=v},function(e,t,n){"use strict";function r(e,t){var n=i(e);if(null==n)throw new l("Unable to create "+e+" blot");var r=n;return new r(e instanceof Node||e.nodeType===Node.TEXT_NODE?e:r.create(t),t)}function o(e,n){return void 0===n&&(n=!1),null==e?null:null!=e[t.DATA_KEY]?e[t.DATA_KEY].blot:n?o(e.parentNode,n):null}function i(e,t){void 0===t&&(t=d.ANY);var n;if("string"==typeof e)n=p[e]||s[e];else if(e instanceof Text||e.nodeType===Node.TEXT_NODE)n=p.text;else if("number"==typeof e)e&d.LEVEL&d.BLOCK?n=p.block:e&d.LEVEL&d.INLINE&&(n=p.inline);else if(e instanceof HTMLElement){var r=(e.getAttribute("class")||"").split(/\s+/);for(var o in r)if(n=c[r[o]])break;n=n||f[e.tagName]}return null==n?null:t&d.LEVEL&n.scope&&t&d.TYPE&n.scope?n:null}function a(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];if(e.length>1)return e.map(function(e){return a(e)});var n=e[0];if("string"!=typeof n.blotName&&"string"!=typeof n.attrName)throw new l("Invalid definition");if("abstract"===n.blotName)throw new l("Cannot register abstract class");if(p[n.blotName||n.attrName]=n,"string"==typeof n.keyName)s[n.keyName]=n;else if(null!=n.className&&(c[n.className]=n),null!=n.tagName){Array.isArray(n.tagName)?n.tagName=n.tagName.map(function(e){return e.toUpperCase()}):n.tagName=n.tagName.toUpperCase();var r=Array.isArray(n.tagName)?n.tagName:[n.tagName];r.forEach(function(e){null!=f[e]&&null!=n.className||(f[e]=n)})}return n}var u=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var l=function(e){function t(t){var n=this;return t="[Parchment] "+t,n=e.call(this,t)||this,n.message=t,n.name=n.constructor.name,n}return u(t,e),t}(Error);t.ParchmentError=l;var s={},c={},f={},p={};t.DATA_KEY="__blot";var d;!function(e){e[e.TYPE=3]="TYPE",e[e.LEVEL=12]="LEVEL",e[e.ATTRIBUTE=13]="ATTRIBUTE",e[e.BLOT=14]="BLOT",e[e.INLINE=7]="INLINE",e[e.BLOCK=11]="BLOCK",e[e.BLOCK_BLOT=10]="BLOCK_BLOT",e[e.INLINE_BLOT=6]="INLINE_BLOT",e[e.BLOCK_ATTRIBUTE=9]="BLOCK_ATTRIBUTE",e[e.INLINE_ATTRIBUTE=5]="INLINE_ATTRIBUTE",e[e.ANY=15]="ANY"}(d=t.Scope||(t.Scope={})),t.create=r,t.find=o,t.query=i,t.register=a},function(e,t,n){var r=n(51),o=n(11),i=n(3),a=n(20),u=String.fromCharCode(0),l=function(e){Array.isArray(e)?this.ops=e:null!=e&&Array.isArray(e.ops)?this.ops=e.ops:this.ops=[]};l.prototype.insert=function(e,t){var n={};return 0===e.length?this:(n.insert=e,null!=t&&"object"==typeof t&&Object.keys(t).length>0&&(n.attributes=t),this.push(n))},l.prototype.delete=function(e){return e<=0?this:this.push({delete:e})},l.prototype.retain=function(e,t){if(e<=0)return this;var n={retain:e};return null!=t&&"object"==typeof t&&Object.keys(t).length>0&&(n.attributes=t),this.push(n)},l.prototype.push=function(e){var t=this.ops.length,n=this.ops[t-1];if(e=i(!0,{},e),"object"==typeof n){if("number"==typeof e.delete&&"number"==typeof n.delete)return this.ops[t-1]={delete:n.delete+e.delete},this;if("number"==typeof n.delete&&null!=e.insert&&(t-=1,"object"!=typeof(n=this.ops[t-1])))return this.ops.unshift(e),this;if(o(e.attributes,n.attributes)){if("string"==typeof e.insert&&"string"==typeof n.insert)return this.ops[t-1]={insert:n.insert+e.insert},"object"==typeof e.attributes&&(this.ops[t-1].attributes=e.attributes),this;if("number"==typeof e.retain&&"number"==typeof n.retain)return this.ops[t-1]={retain:n.retain+e.retain},"object"==typeof e.attributes&&(this.ops[t-1].attributes=e.attributes),this}}return t===this.ops.length?this.ops.push(e):this.ops.splice(t,0,e),this},l.prototype.chop=function(){var e=this.ops[this.ops.length-1];return e&&e.retain&&!e.attributes&&this.ops.pop(),this},l.prototype.filter=function(e){return this.ops.filter(e)},l.prototype.forEach=function(e){this.ops.forEach(e)},l.prototype.map=function(e){return this.ops.map(e)},l.prototype.partition=function(e){var t=[],n=[];return this.forEach(function(r){(e(r)?t:n).push(r)}),[t,n]},l.prototype.reduce=function(e,t){return this.ops.reduce(e,t)},l.prototype.changeLength=function(){return this.reduce(function(e,t){return t.insert?e+a.length(t):t.delete?e-t.delete:e},0)},l.prototype.length=function(){return this.reduce(function(e,t){return e+a.length(t)},0)},l.prototype.slice=function(e,t){e=e||0,"number"!=typeof t&&(t=1/0);for(var n=[],r=a.iterator(this.ops),o=0;o<t&&r.hasNext();){var i;o<e?i=r.next(e-o):(i=r.next(t-o),n.push(i)),o+=a.length(i)}return new l(n)},l.prototype.compose=function(e){for(var t=a.iterator(this.ops),n=a.iterator(e.ops),r=new l;t.hasNext()||n.hasNext();)if("insert"===n.peekType())r.push(n.next());else if("delete"===t.peekType())r.push(t.next());else{var o=Math.min(t.peekLength(),n.peekLength()),i=t.next(o),u=n.next(o);if("number"==typeof u.retain){var s={};"number"==typeof i.retain?s.retain=o:s.insert=i.insert;var c=a.attributes.compose(i.attributes,u.attributes,"number"==typeof i.retain);c&&(s.attributes=c),r.push(s)}else"number"==typeof u.delete&&"number"==typeof i.retain&&r.push(u)}return r.chop()},l.prototype.concat=function(e){var t=new l(this.ops.slice());return e.ops.length>0&&(t.push(e.ops[0]),t.ops=t.ops.concat(e.ops.slice(1))),t},l.prototype.diff=function(e,t){if(this.ops===e.ops)return new l;var n=[this,e].map(function(t){return t.map(function(n){if(null!=n.insert)return"string"==typeof n.insert?n.insert:u;var r=t===e?"on":"with";throw new Error("diff() called "+r+" non-document")}).join("")}),i=new l,s=r(n[0],n[1],t),c=a.iterator(this.ops),f=a.iterator(e.ops);return s.forEach(function(e){for(var t=e[1].length;t>0;){var n=0;switch(e[0]){case r.INSERT:n=Math.min(f.peekLength(),t),i.push(f.next(n));break;case r.DELETE:n=Math.min(t,c.peekLength()),c.next(n),i.delete(n);break;case r.EQUAL:n=Math.min(c.peekLength(),f.peekLength(),t);var u=c.next(n),l=f.next(n);o(u.insert,l.insert)?i.retain(n,a.attributes.diff(u.attributes,l.attributes)):i.push(l).delete(n)}t-=n}}),i.chop()},l.prototype.eachLine=function(e,t){t=t||"\n";for(var n=a.iterator(this.ops),r=new l,o=0;n.hasNext();){if("insert"!==n.peekType())return;var i=n.peek(),u=a.length(i)-n.peekLength(),s="string"==typeof i.insert?i.insert.indexOf(t,u)-u:-1;if(s<0)r.push(n.next());else if(s>0)r.push(n.next(s));else{if(!1===e(r,n.next(1).attributes||{},o))return;o+=1,r=new l}}r.length()>0&&e(r,{},o)},l.prototype.transform=function(e,t){if(t=!!t,"number"==typeof e)return this.transformPosition(e,t);for(var n=a.iterator(this.ops),r=a.iterator(e.ops),o=new l;n.hasNext()||r.hasNext();)if("insert"!==n.peekType()||!t&&"insert"===r.peekType())if("insert"===r.peekType())o.push(r.next());else{var i=Math.min(n.peekLength(),r.peekLength()),u=n.next(i),s=r.next(i);if(u.delete)continue;s.delete?o.push(s):o.retain(i,a.attributes.transform(u.attributes,s.attributes,t))}else o.retain(a.length(n.next()));return o.chop()},l.prototype.transformPosition=function(e,t){t=!!t;for(var n=a.iterator(this.ops),r=0;n.hasNext()&&r<=e;){var o=n.peekLength(),i=n.peekType();n.next(),"delete"!==i?("insert"===i&&(r<e||!t)&&(e+=o),r+=o):e-=Math.min(o,e-r)}return e},e.exports=l},function(e,t){"use strict";var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString,o=function(e){return"function"==typeof Array.isArray?Array.isArray(e):"[object Array]"===r.call(e)},i=function(e){if(!e||"[object Object]"!==r.call(e))return!1;var t=n.call(e,"constructor"),o=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,"isPrototypeOf");if(e.constructor&&!t&&!o)return!1;var i;for(i in e);return void 0===i||n.call(e,i)};e.exports=function e(){var t,n,r,a,u,l,s=arguments[0],c=1,f=arguments.length,p=!1;for("boolean"==typeof s&&(p=s,s=arguments[1]||{},c=2),(null==s||"object"!=typeof s&&"function"!=typeof s)&&(s={});c<f;++c)if(null!=(t=arguments[c]))for(n in t)r=s[n],a=t[n],s!==a&&(p&&a&&(i(a)||(u=o(a)))?(u?(u=!1,l=r&&o(r)?r:[]):l=r&&i(r)?r:{},s[n]=e(p,l,a)):void 0!==a&&(s[n]=a));return s}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return null==e?t:("function"==typeof e.formats&&(t=(0,f.default)(t,e.formats())),null==e.parent||"scroll"==e.parent.blotName||e.parent.statics.scope!==e.statics.scope?t:u(e.parent,t))}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.BlockEmbed=t.bubbleFormats=void 0;var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},c=n(3),f=r(c),p=n(2),d=r(p),h=n(0),y=r(h),v=n(16),m=r(v),b=n(6),g=r(b),_=n(7),w=r(_),E=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),l(t,[{key:"attach",value:function(){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"attach",this).call(this),this.attributes=new y.default.Attributor.Store(this.domNode)}},{key:"delta",value:function(){return(new d.default).insert(this.value(),(0,f.default)(this.formats(),this.attributes.values()))}},{key:"format",value:function(e,t){var n=y.default.query(e,y.default.Scope.BLOCK_ATTRIBUTE);null!=n&&this.attributes.attribute(n,t)}},{key:"formatAt",value:function(e,t,n,r){this.format(n,r)}},{key:"insertAt",value:function(e,n,r){if("string"==typeof n&&n.endsWith("\n")){var o=y.default.create(O.blotName);this.parent.insertBefore(o,0===e?this:this.next),o.insertAt(0,n.slice(0,-1))}else s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"insertAt",this).call(this,e,n,r)}}]),t}(y.default.Embed);E.scope=y.default.Scope.BLOCK_BLOT;var O=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.cache={},n}return a(t,e),l(t,[{key:"delta",value:function(){return null==this.cache.delta&&(this.cache.delta=this.descendants(y.default.Leaf).reduce(function(e,t){return 0===t.length()?e:e.insert(t.value(),u(t))},new d.default).insert("\n",u(this))),this.cache.delta}},{key:"deleteAt",value:function(e,n){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"deleteAt",this).call(this,e,n),this.cache={}}},{key:"formatAt",value:function(e,n,r,o){n<=0||(y.default.query(r,y.default.Scope.BLOCK)?e+n===this.length()&&this.format(r,o):s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"formatAt",this).call(this,e,Math.min(n,this.length()-e-1),r,o),this.cache={})}},{key:"insertAt",value:function(e,n,r){if(null!=r)return s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"insertAt",this).call(this,e,n,r);if(0!==n.length){var o=n.split("\n"),i=o.shift();i.length>0&&(e<this.length()-1||null==this.children.tail?s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"insertAt",this).call(this,Math.min(e,this.length()-1),i):this.children.tail.insertAt(this.children.tail.length(),i),this.cache={});var a=this;o.reduce(function(e,t){return a=a.split(e,!0),a.insertAt(0,t),t.length},e+i.length)}}},{key:"insertBefore",value:function(e,n){var r=this.children.head;s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"insertBefore",this).call(this,e,n),r instanceof m.default&&r.remove(),this.cache={}}},{key:"length",value:function(){return null==this.cache.length&&(this.cache.length=s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"length",this).call(this)+1),this.cache.length}},{key:"moveChildren",value:function(e,n){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"moveChildren",this).call(this,e,n),this.cache={}}},{key:"optimize",value:function(e){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"optimize",this).call(this,e),this.cache={}}},{key:"path",value:function(e){return s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"path",this).call(this,e,!0)}},{key:"removeChild",value:function(e){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"removeChild",this).call(this,e),this.cache={}}},{key:"split",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(n&&(0===e||e>=this.length()-1)){var r=this.clone();return 0===e?(this.parent.insertBefore(r,this),this):(this.parent.insertBefore(r,this.next),r)}var o=s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"split",this).call(this,e,n);return this.cache={},o}}]),t}(y.default.Block);O.blotName="block",O.tagName="P",O.defaultChild="break",O.allowedChildren=[g.default,y.default.Embed,w.default],t.bubbleFormats=u,t.BlockEmbed=E,t.default=O},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(t=(0,S.default)(!0,{container:e,modules:{clipboard:!0,keyboard:!0,history:!0}},t),t.theme&&t.theme!==A.DEFAULTS.theme){if(t.theme=A.import("themes/"+t.theme),null==t.theme)throw new Error("Invalid theme "+t.theme+". Did you register it?")}else t.theme=T.default;var n=(0,S.default)(!0,{},t.theme.DEFAULTS);[n,t].forEach(function(e){e.modules=e.modules||{},Object.keys(e.modules).forEach(function(t){!0===e.modules[t]&&(e.modules[t]={})})});var r=Object.keys(n.modules).concat(Object.keys(t.modules)),o=r.reduce(function(e,t){var n=A.import("modules/"+t);return null==n?N.error("Cannot load "+t+" module. Are you sure you registered it?"):e[t]=n.DEFAULTS||{},e},{});return null!=t.modules&&t.modules.toolbar&&t.modules.toolbar.constructor!==Object&&(t.modules.toolbar={container:t.modules.toolbar}),t=(0,S.default)(!0,{},A.DEFAULTS,{modules:o},n,t),["bounds","container","scrollingContainer"].forEach(function(e){"string"==typeof t[e]&&(t[e]=document.querySelector(t[e]))}),t.modules=Object.keys(t.modules).reduce(function(e,n){return t.modules[n]&&(e[n]=t.modules[n]),e},{}),t}function u(e,t,n,r){if(this.options.strict&&!this.isEnabled()&&t===b.default.sources.USER)return new h.default;var o=null==n?null:this.getSelection(),i=this.editor.delta,a=e();if(null!=o&&(!0===n&&(n=o.index),null==r?o=s(o,a,t):0!==r&&(o=s(o,n,r,t)),this.setSelection(o,b.default.sources.SILENT)),a.length()>0){var u,l=[b.default.events.TEXT_CHANGE,a,i,t];if((u=this.emitter).emit.apply(u,[b.default.events.EDITOR_CHANGE].concat(l)),t!==b.default.sources.SILENT){var c;(c=this.emitter).emit.apply(c,l)}}return a}function l(e,t,n,r,o){var i={};return"number"==typeof e.index&&"number"==typeof e.length?"number"!=typeof t?(o=r,r=n,n=t,t=e.length,e=e.index):(t=e.length,e=e.index):"number"!=typeof t&&(o=r,r=n,n=t,t=0),"object"===(void 0===n?"undefined":c(n))?(i=n,o=r):"string"==typeof n&&(null!=r?i[n]=r:o=n),o=o||b.default.sources.API,[e,t,i,o]}function s(e,t,n,r){if(null==e)return null;var o=void 0,i=void 0;if(t instanceof h.default){var a=[e.index,e.index+e.length].map(function(e){return t.transformPosition(e,r!==b.default.sources.USER)}),u=f(a,2);o=u[0],i=u[1]}else{var l=[e.index,e.index+e.length].map(function(e){return e<t||e===t&&r===b.default.sources.USER?e:n>=0?e+n:Math.max(t,e+n)}),s=f(l,2);o=s[0],i=s[1]}return new O.Range(o,i-o)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.overload=t.expandConfig=void 0;var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},f=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(50);var d=n(2),h=r(d),y=n(14),v=r(y),m=n(8),b=r(m),g=n(9),_=r(g),w=n(0),E=r(w),O=n(15),x=r(O),k=n(3),S=r(k),C=n(10),P=r(C),j=n(34),T=r(j),N=(0,P.default)("quill"),A=function(){function e(t){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(i(this,e),this.options=a(t,r),this.container=this.options.container,null==this.container)return N.error("Invalid Quill container",t);this.options.debug&&e.debug(this.options.debug);var o=this.container.innerHTML.trim();this.container.classList.add("ql-container"),this.container.innerHTML="",this.container.__quill=this,this.root=this.addContainer("ql-editor"),this.root.classList.add("ql-blank"),this.root.setAttribute("data-gramm",!1),this.scrollingContainer=this.options.scrollingContainer||this.root,this.emitter=new b.default,this.scroll=E.default.create(this.root,{emitter:this.emitter,whitelist:this.options.formats}),this.editor=new v.default(this.scroll),this.selection=new x.default(this.scroll,this.emitter),this.theme=new this.options.theme(this,this.options),this.keyboard=this.theme.addModule("keyboard"),this.clipboard=this.theme.addModule("clipboard"),this.history=this.theme.addModule("history"),this.theme.init(),this.emitter.on(b.default.events.EDITOR_CHANGE,function(e){e===b.default.events.TEXT_CHANGE&&n.root.classList.toggle("ql-blank",n.editor.isBlank())}),this.emitter.on(b.default.events.SCROLL_UPDATE,function(e,t){var r=n.selection.lastRange,o=r&&0===r.length?r.index:void 0;u.call(n,function(){return n.editor.update(null,t,o)},e)});var l=this.clipboard.convert("<div class='ql-editor' style=\"white-space: normal;\">"+o+"<p><br></p></div>");this.setContents(l),this.history.clear(),this.options.placeholder&&this.root.setAttribute("data-placeholder",this.options.placeholder),this.options.readOnly&&this.disable()}return p(e,null,[{key:"debug",value:function(e){!0===e&&(e="log"),P.default.level(e)}},{key:"find",value:function(e){return e.__quill||E.default.find(e)}},{key:"import",value:function(e){return null==this.imports[e]&&N.error("Cannot import "+e+". Are you sure it was registered?"),this.imports[e]}},{key:"register",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if("string"!=typeof e){var o=e.attrName||e.blotName;"string"==typeof o?this.register("formats/"+o,e,t):Object.keys(e).forEach(function(r){n.register(r,e[r],t)})}else null==this.imports[e]||r||N.warn("Overwriting "+e+" with",t),this.imports[e]=t,(e.startsWith("blots/")||e.startsWith("formats/"))&&"abstract"!==t.blotName?E.default.register(t):e.startsWith("modules")&&"function"==typeof t.register&&t.register()}}]),p(e,[{key:"addContainer",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if("string"==typeof e){var n=e;e=document.createElement("div"),e.classList.add(n)}return this.container.insertBefore(e,t),e}},{key:"blur",value:function(){this.selection.setRange(null)}},{key:"deleteText",value:function(e,t,n){var r=this,o=l(e,t,n),i=f(o,4);return e=i[0],t=i[1],n=i[3],u.call(this,function(){return r.editor.deleteText(e,t)},n,e,-1*t)}},{key:"disable",value:function(){this.enable(!1)}},{key:"enable",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.scroll.enable(e),this.container.classList.toggle("ql-disabled",!e)}},{key:"focus",value:function(){var e=this.scrollingContainer.scrollTop;this.selection.focus(),this.scrollingContainer.scrollTop=e,this.scrollIntoView()}},{key:"format",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:b.default.sources.API;return u.call(this,function(){var r=n.getSelection(!0),i=new h.default;if(null==r)return i;if(E.default.query(e,E.default.Scope.BLOCK))i=n.editor.formatLine(r.index,r.length,o({},e,t));else{if(0===r.length)return n.selection.format(e,t),i;i=n.editor.formatText(r.index,r.length,o({},e,t))}return n.setSelection(r,b.default.sources.SILENT),i},r)}},{key:"formatLine",value:function(e,t,n,r,o){var i=this,a=void 0,s=l(e,t,n,r,o),c=f(s,4);return e=c[0],t=c[1],a=c[2],o=c[3],u.call(this,function(){return i.editor.formatLine(e,t,a)},o,e,0)}},{key:"formatText",value:function(e,t,n,r,o){var i=this,a=void 0,s=l(e,t,n,r,o),c=f(s,4);return e=c[0],t=c[1],a=c[2],o=c[3],u.call(this,function(){return i.editor.formatText(e,t,a)},o,e,0)}},{key:"getBounds",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=void 0;n="number"==typeof e?this.selection.getBounds(e,t):this.selection.getBounds(e.index,e.length);var r=this.container.getBoundingClientRect();return{bottom:n.bottom-r.top,height:n.height,left:n.left-r.left,right:n.right-r.left,top:n.top-r.top,width:n.width}}},{key:"getContents",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.getLength()-e,n=l(e,t),r=f(n,2);return e=r[0],t=r[1],this.editor.getContents(e,t)}},{key:"getFormat",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.getSelection(!0),t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return"number"==typeof e?this.editor.getFormat(e,t):this.editor.getFormat(e.index,e.length)}},{key:"getIndex",value:function(e){return e.offset(this.scroll)}},{key:"getLength",value:function(){return this.scroll.length()}},{key:"getLeaf",value:function(e){return this.scroll.leaf(e)}},{key:"getLine",value:function(e){return this.scroll.line(e)}},{key:"getLines",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Number.MAX_VALUE;return"number"!=typeof e?this.scroll.lines(e.index,e.length):this.scroll.lines(e,t)}},{key:"getModule",value:function(e){return this.theme.modules[e]}},{key:"getSelection",value:function(){return arguments.length>0&&void 0!==arguments[0]&&arguments[0]&&this.focus(),this.update(),this.selection.getRange()[0]}},{key:"getText",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.getLength()-e,n=l(e,t),r=f(n,2);return e=r[0],t=r[1],this.editor.getText(e,t)}},{key:"hasFocus",value:function(){return this.selection.hasFocus()}},{key:"insertEmbed",value:function(t,n,r){var o=this,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:e.sources.API;return u.call(this,function(){return o.editor.insertEmbed(t,n,r)},i,t)}},{key:"insertText",value:function(e,t,n,r,o){var i=this,a=void 0,s=l(e,0,n,r,o),c=f(s,4);return e=c[0],a=c[2],o=c[3],u.call(this,function(){return i.editor.insertText(e,t,a)},o,e,t.length)}},{key:"isEnabled",value:function(){return!this.container.classList.contains("ql-disabled")}},{key:"off",value:function(){return this.emitter.off.apply(this.emitter,arguments)}},{key:"on",value:function(){return this.emitter.on.apply(this.emitter,arguments)}},{key:"once",value:function(){return this.emitter.once.apply(this.emitter,arguments)}},{key:"pasteHTML",value:function(e,t,n){this.clipboard.dangerouslyPasteHTML(e,t,n)}},{key:"removeFormat",value:function(e,t,n){var r=this,o=l(e,t,n),i=f(o,4);return e=i[0],t=i[1],n=i[3],u.call(this,function(){return r.editor.removeFormat(e,t)},n,e)}},{key:"scrollIntoView",value:function(){this.selection.scrollIntoView(this.scrollingContainer)}},{key:"setContents",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:b.default.sources.API;return u.call(this,function(){e=new h.default(e);var n=t.getLength(),r=t.editor.deleteText(0,n),o=t.editor.applyDelta(e),i=o.ops[o.ops.length-1];return null!=i&&"string"==typeof i.insert&&"\n"===i.insert[i.insert.length-1]&&(t.editor.deleteText(t.getLength()-1,1),o.delete(1)),r.compose(o)},n)}},{key:"setSelection",value:function(t,n,r){if(null==t)this.selection.setRange(null,n||e.sources.API);else{var o=l(t,n,r),i=f(o,4);t=i[0],n=i[1],r=i[3],this.selection.setRange(new O.Range(t,n),r),r!==b.default.sources.SILENT&&this.selection.scrollIntoView(this.scrollingContainer)}}},{key:"setText",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:b.default.sources.API,n=(new h.default).insert(e);return this.setContents(n,t)}},{key:"update",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b.default.sources.USER,t=this.scroll.update(e);return this.selection.update(e),t}},{key:"updateContents",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:b.default.sources.API;return u.call(this,function(){return e=new h.default(e),t.editor.applyDelta(e,n)},n,!0)}}]),e}();A.DEFAULTS={bounds:null,formats:null,modules:{},placeholder:"",readOnly:!1,scrollingContainer:null,strict:!0,theme:"default"},A.events=b.default.events,A.sources=b.default.sources,A.version="1.3.6",A.imports={delta:h.default,parchment:E.default,"core/module":_.default,"core/theme":T.default},t.expandConfig=a,t.overload=l,t.default=A},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},s=n(7),c=r(s),f=n(0),p=r(f),d=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"formatAt",value:function(e,n,r,o){if(t.compare(this.statics.blotName,r)<0&&p.default.query(r,p.default.Scope.BLOT)){var i=this.isolate(e,n);o&&i.wrap(r,o)}else l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"formatAt",this).call(this,e,n,r,o)}},{key:"optimize",value:function(e){if(l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"optimize",this).call(this,e),this.parent instanceof t&&t.compare(this.statics.blotName,this.parent.statics.blotName)>0){var n=this.parent.isolate(this.offset(),this.length());this.moveChildren(n),n.wrap(this)}}}],[{key:"compare",value:function(e,n){var r=t.order.indexOf(e),o=t.order.indexOf(n);return r>=0||o>=0?r-o:e===n?0:e<n?-1:1}}]),t}(p.default.Inline);d.allowedChildren=[d,p.default.Embed,c.default],d.order=["cursor","inline","underline","strike","italic","bold","script","link","code"],t.default=d},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(0),u=function(e){return e&&e.__esModule?e:{default:e}}(a),l=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),t}(u.default.Text);t.default=l},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},s=n(54),c=r(s),f=n(10),p=r(f),d=(0,p.default)("quill:events");["selectionchange","mousedown","mouseup","click"].forEach(function(e){document.addEventListener(e,function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];[].slice.call(document.querySelectorAll(".ql-container")).forEach(function(e){if(e.__quill&&e.__quill.emitter){var n;(n=e.__quill.emitter).handleDOM.apply(n,t)}})})});var h=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.listeners={},e.on("error",d.error),e}return a(t,e),u(t,[{key:"emit",value:function(){d.log.apply(d,arguments),l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"emit",this).apply(this,arguments)}},{key:"handleDOM",value:function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];(this.listeners[e.type]||[]).forEach(function(t){var r=t.node,o=t.handler;(e.target===r||r.contains(e.target))&&o.apply(void 0,[e].concat(n))})}},{key:"listenDOM",value:function(e,t,n){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push({node:t,handler:n})}}]),t}(c.default);h.events={EDITOR_CHANGE:"editor-change",SCROLL_BEFORE_UPDATE:"scroll-before-update",SCROLL_OPTIMIZE:"scroll-optimize",SCROLL_UPDATE:"scroll-update",SELECTION_CHANGE:"selection-change",TEXT_CHANGE:"text-change"},h.sources={API:"api",SILENT:"silent",USER:"user"},t.default=h},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};r(this,e),this.quill=t,this.options=n};o.DEFAULTS={},t.default=o},function(e,t,n){"use strict";function r(e){if(i.indexOf(e)<=i.indexOf(a)){for(var t,n=arguments.length,r=Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];(t=console)[e].apply(t,r)}}function o(e){return i.reduce(function(t,n){return t[n]=r.bind(console,n,e),t},{})}Object.defineProperty(t,"__esModule",{value:!0});var i=["error","warn","log","info"],a="warn";r.level=o.level=function(e){a=e},t.default=o},function(e,t,n){function r(e){return null===e||void 0===e}function o(e){return!(!e||"object"!=typeof e||"number"!=typeof e.length)&&("function"==typeof e.copy&&"function"==typeof e.slice&&!(e.length>0&&"number"!=typeof e[0]))}function i(e,t,n){var i,c;if(r(e)||r(t))return!1;if(e.prototype!==t.prototype)return!1;if(l(e))return!!l(t)&&(e=a.call(e),t=a.call(t),s(e,t,n));if(o(e)){if(!o(t))return!1;if(e.length!==t.length)return!1;for(i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}try{var f=u(e),p=u(t)}catch(e){return!1}if(f.length!=p.length)return!1;for(f.sort(),p.sort(),i=f.length-1;i>=0;i--)if(f[i]!=p[i])return!1;for(i=f.length-1;i>=0;i--)if(c=f[i],!s(e[c],t[c],n))return!1;return typeof e==typeof t}var a=Array.prototype.slice,u=n(52),l=n(53),s=e.exports=function(e,t,n){return n||(n={}),e===t||(e instanceof Date&&t instanceof Date?e.getTime()===t.getTime():!e||!t||"object"!=typeof e&&"object"!=typeof t?n.strict?e===t:e==t:i(e,t,n))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=function(){function e(e,t,n){void 0===n&&(n={}),this.attrName=e,this.keyName=t;var o=r.Scope.TYPE&r.Scope.ATTRIBUTE;null!=n.scope?this.scope=n.scope&r.Scope.LEVEL|o:this.scope=r.Scope.ATTRIBUTE,null!=n.whitelist&&(this.whitelist=n.whitelist)}return e.keys=function(e){return[].map.call(e.attributes,function(e){return e.name})},e.prototype.add=function(e,t){return!!this.canAdd(e,t)&&(e.setAttribute(this.keyName,t),!0)},e.prototype.canAdd=function(e,t){return null!=r.query(e,r.Scope.BLOT&(this.scope|r.Scope.TYPE))&&(null==this.whitelist||("string"==typeof t?this.whitelist.indexOf(t.replace(/["']/g,""))>-1:this.whitelist.indexOf(t)>-1))},e.prototype.remove=function(e){e.removeAttribute(this.keyName)},e.prototype.value=function(e){var t=e.getAttribute(this.keyName);return this.canAdd(e,t)&&t?t:""},e}();t.default=o},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.Code=void 0;var u=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},c=n(2),f=r(c),p=n(0),d=r(p),h=n(4),y=r(h),v=n(6),m=r(v),b=n(7),g=r(b),_=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),t}(m.default);_.blotName="code",_.tagName="CODE";var w=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),l(t,[{key:"delta",value:function(){var e=this,t=this.domNode.textContent;return t.endsWith("\n")&&(t=t.slice(0,-1)),t.split("\n").reduce(function(t,n){return t.insert(n).insert("\n",e.formats())},new f.default)}},{key:"format",value:function(e,n){if(e!==this.statics.blotName||!n){var r=this.descendant(g.default,this.length()-1),o=u(r,1),i=o[0];null!=i&&i.deleteAt(i.length()-1,1),s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"format",this).call(this,e,n)}}},{key:"formatAt",value:function(e,n,r,o){if(0!==n&&null!=d.default.query(r,d.default.Scope.BLOCK)&&(r!==this.statics.blotName||o!==this.statics.formats(this.domNode))){var i=this.newlineIndex(e);if(!(i<0||i>=e+n)){var a=this.newlineIndex(e,!0)+1,u=i-a+1,l=this.isolate(a,u),s=l.next;l.format(r,o),s instanceof t&&s.formatAt(0,e-a+n-u,r,o)}}}},{key:"insertAt",value:function(e,t,n){if(null==n){var r=this.descendant(g.default,e),o=u(r,2),i=o[0],a=o[1];i.insertAt(a,t)}}},{key:"length",value:function(){var e=this.domNode.textContent.length;return this.domNode.textContent.endsWith("\n")?e:e+1}},{key:"newlineIndex",value:function(e){if(arguments.length>1&&void 0!==arguments[1]&&arguments[1])return this.domNode.textContent.slice(0,e).lastIndexOf("\n");var t=this.domNode.textContent.slice(e).indexOf("\n");return t>-1?e+t:-1}},{key:"optimize",value:function(e){this.domNode.textContent.endsWith("\n")||this.appendChild(d.default.create("text","\n")),s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"optimize",this).call(this,e);var n=this.next;null!=n&&n.prev===this&&n.statics.blotName===this.statics.blotName&&this.statics.formats(this.domNode)===n.statics.formats(n.domNode)&&(n.optimize(e),n.moveChildren(this),n.remove())}},{key:"replace",value:function(e){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"replace",this).call(this,e),[].slice.call(this.domNode.querySelectorAll("*")).forEach(function(e){var t=d.default.find(e);null==t?e.parentNode.removeChild(e):t instanceof d.default.Embed?t.remove():t.unwrap()})}}],[{key:"create",value:function(e){var n=s(t.__proto__||Object.getPrototypeOf(t),"create",this).call(this,e);return n.setAttribute("spellcheck",!1),n}},{key:"formats",value:function(){return!0}}]),t}(y.default);w.blotName="code-block",w.tagName="PRE",w.TAB="  ",t.Code=_,t.default=w},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){return Object.keys(t).reduce(function(n,r){return null==e[r]?n:(t[r]===e[r]?n[r]=t[r]:Array.isArray(t[r])?t[r].indexOf(e[r])<0&&(n[r]=t[r].concat([e[r]])):n[r]=[t[r],e[r]],n)},{})}function u(e){return e.reduce(function(e,t){if(1===t.insert){var n=(0,S.default)(t.attributes);return delete n.image,e.insert({image:t.attributes.image},n)}if(null==t.attributes||!0!==t.attributes.list&&!0!==t.attributes.bullet||(t=(0,S.default)(t),t.attributes.list?t.attributes.list="ordered":(t.attributes.list="bullet",delete t.attributes.bullet)),"string"==typeof t.insert){var r=t.insert.replace(/\r\n/g,"\n").replace(/\r/g,"\n");return e.insert(r,t.attributes)}return e.push(t)},new p.default)}Object.defineProperty(t,"__esModule",{value:!0});var l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(2),p=r(f),d=n(20),h=r(d),y=n(0),v=r(y),m=n(13),b=r(m),g=n(24),_=r(g),w=n(4),E=r(w),O=n(16),x=r(O),k=n(21),S=r(k),C=n(11),P=r(C),j=n(3),T=r(j),N=/^[ -~]*$/,A=function(){function e(t){i(this,e),this.scroll=t,this.delta=this.getDelta()}return c(e,[{key:"applyDelta",value:function(e){var t=this,n=!1;this.scroll.update();var r=this.scroll.length();return this.scroll.batchStart(),e=u(e),e.reduce(function(e,o){var i=o.retain||o.delete||o.insert.length||1,a=o.attributes||{};if(null!=o.insert){if("string"==typeof o.insert){var u=o.insert;u.endsWith("\n")&&n&&(n=!1,u=u.slice(0,-1)),e>=r&&!u.endsWith("\n")&&(n=!0),t.scroll.insertAt(e,u);var c=t.scroll.line(e),f=s(c,2),p=f[0],d=f[1],y=(0,T.default)({},(0,w.bubbleFormats)(p));if(p instanceof E.default){var m=p.descendant(v.default.Leaf,d),b=s(m,1),g=b[0];y=(0,T.default)(y,(0,w.bubbleFormats)(g))}a=h.default.attributes.diff(y,a)||{}}else if("object"===l(o.insert)){var _=Object.keys(o.insert)[0];if(null==_)return e;t.scroll.insertAt(e,_,o.insert[_])}r+=i}return Object.keys(a).forEach(function(n){t.scroll.formatAt(e,i,n,a[n])}),e+i},0),e.reduce(function(e,n){return"number"==typeof n.delete?(t.scroll.deleteAt(e,n.delete),e):e+(n.retain||n.insert.length||1)},0),this.scroll.batchEnd(),this.update(e)}},{key:"deleteText",value:function(e,t){return this.scroll.deleteAt(e,t),this.update((new p.default).retain(e).delete(t))}},{key:"formatLine",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return this.scroll.update(),Object.keys(r).forEach(function(o){if(null==n.scroll.whitelist||n.scroll.whitelist[o]){var i=n.scroll.lines(e,Math.max(t,1)),a=t;i.forEach(function(t){var i=t.length();if(t instanceof b.default){var u=e-t.offset(n.scroll),l=t.newlineIndex(u+a)-u+1;t.formatAt(u,l,o,r[o])}else t.format(o,r[o]);a-=i})}}),this.scroll.optimize(),this.update((new p.default).retain(e).retain(t,(0,S.default)(r)))}},{key:"formatText",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return Object.keys(r).forEach(function(o){n.scroll.formatAt(e,t,o,r[o])}),this.update((new p.default).retain(e).retain(t,(0,S.default)(r)))}},{key:"getContents",value:function(e,t){return this.delta.slice(e,e+t)}},{key:"getDelta",value:function(){return this.scroll.lines().reduce(function(e,t){return e.concat(t.delta())},new p.default)}},{key:"getFormat",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=[],r=[];0===t?this.scroll.path(e).forEach(function(e){var t=s(e,1),o=t[0];o instanceof E.default?n.push(o):o instanceof v.default.Leaf&&r.push(o)}):(n=this.scroll.lines(e,t),r=this.scroll.descendants(v.default.Leaf,e,t));var o=[n,r].map(function(e){if(0===e.length)return{};for(var t=(0,w.bubbleFormats)(e.shift());Object.keys(t).length>0;){var n=e.shift();if(null==n)return t;t=a((0,w.bubbleFormats)(n),t)}return t});return T.default.apply(T.default,o)}},{key:"getText",value:function(e,t){return this.getContents(e,t).filter(function(e){return"string"==typeof e.insert}).map(function(e){return e.insert}).join("")}},{key:"insertEmbed",value:function(e,t,n){return this.scroll.insertAt(e,t,n),this.update((new p.default).retain(e).insert(o({},t,n)))}},{key:"insertText",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return t=t.replace(/\r\n/g,"\n").replace(/\r/g,"\n"),this.scroll.insertAt(e,t),Object.keys(r).forEach(function(o){n.scroll.formatAt(e,t.length,o,r[o])}),this.update((new p.default).retain(e).insert(t,(0,S.default)(r)))}},{key:"isBlank",value:function(){if(0==this.scroll.children.length)return!0;if(this.scroll.children.length>1)return!1;var e=this.scroll.children.head;return e.statics.blotName===E.default.blotName&&(!(e.children.length>1)&&e.children.head instanceof x.default)}},{key:"removeFormat",value:function(e,t){var n=this.getText(e,t),r=this.scroll.line(e+t),o=s(r,2),i=o[0],a=o[1],u=0,l=new p.default;null!=i&&(u=i instanceof b.default?i.newlineIndex(a)-a+1:i.length()-a,l=i.delta().slice(a,a+u-1).insert("\n"));var c=this.getContents(e,t+u),f=c.diff((new p.default).insert(n).concat(l)),d=(new p.default).retain(e).concat(f);return this.applyDelta(d)}},{key:"update",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,r=this.delta;if(1===t.length&&"characterData"===t[0].type&&t[0].target.data.match(N)&&v.default.find(t[0].target)){var o=v.default.find(t[0].target),i=(0,w.bubbleFormats)(o),a=o.offset(this.scroll),u=t[0].oldValue.replace(_.default.CONTENTS,""),l=(new p.default).insert(u),s=(new p.default).insert(o.value());e=(new p.default).retain(a).concat(l.diff(s,n)).reduce(function(e,t){return t.insert?e.insert(t.insert,i):e.push(t)},new p.default),this.delta=r.compose(e)}else this.delta=this.getDelta(),e&&(0,P.default)(r.compose(e),this.delta)||(e=r.diff(this.delta,n));return e}}]),e}();t.default=A},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){try{t.parentNode}catch(e){return!1}return t instanceof Text&&(t=t.parentNode),e.contains(t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.Range=void 0;var u=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),c=r(s),f=n(21),p=r(f),d=n(11),h=r(d),y=n(8),v=r(y),m=n(10),b=r(m),g=(0,b.default)("quill:selection"),_=function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;i(this,e),this.index=t,this.length=n},w=function(){function e(t,n){var r=this;i(this,e),this.emitter=n,this.scroll=t,this.composing=!1,this.mouseDown=!1,this.root=this.scroll.domNode,this.cursor=c.default.create("cursor",this),this.lastRange=this.savedRange=new _(0,0),this.handleComposition(),this.handleDragging(),this.emitter.listenDOM("selectionchange",document,function(){r.mouseDown||setTimeout(r.update.bind(r,v.default.sources.USER),1)}),this.emitter.on(v.default.events.EDITOR_CHANGE,function(e,t){e===v.default.events.TEXT_CHANGE&&t.length()>0&&r.update(v.default.sources.SILENT)}),this.emitter.on(v.default.events.SCROLL_BEFORE_UPDATE,function(){if(r.hasFocus()){var e=r.getNativeRange();null!=e&&e.start.node!==r.cursor.textNode&&r.emitter.once(v.default.events.SCROLL_UPDATE,function(){try{r.setNativeRange(e.start.node,e.start.offset,e.end.node,e.end.offset)}catch(e){}})}}),this.emitter.on(v.default.events.SCROLL_OPTIMIZE,function(e,t){if(t.range){var n=t.range,o=n.startNode,i=n.startOffset,a=n.endNode,u=n.endOffset;r.setNativeRange(o,i,a,u)}}),this.update(v.default.sources.SILENT)}return l(e,[{key:"handleComposition",value:function(){var e=this;this.root.addEventListener("compositionstart",function(){e.composing=!0}),this.root.addEventListener("compositionend",function(){if(e.composing=!1,e.cursor.parent){var t=e.cursor.restore();if(!t)return;setTimeout(function(){e.setNativeRange(t.startNode,t.startOffset,t.endNode,t.endOffset)},1)}})}},{key:"handleDragging",value:function(){var e=this;this.emitter.listenDOM("mousedown",document.body,function(){e.mouseDown=!0}),this.emitter.listenDOM("mouseup",document.body,function(){e.mouseDown=!1,e.update(v.default.sources.USER)})}},{key:"focus",value:function(){this.hasFocus()||(this.root.focus(),this.setRange(this.savedRange))}},{key:"format",value:function(e,t){if(null==this.scroll.whitelist||this.scroll.whitelist[e]){this.scroll.update();var n=this.getNativeRange();if(null!=n&&n.native.collapsed&&!c.default.query(e,c.default.Scope.BLOCK)){if(n.start.node!==this.cursor.textNode){var r=c.default.find(n.start.node,!1);if(null==r)return;if(r instanceof c.default.Leaf){var o=r.split(n.start.offset);r.parent.insertBefore(this.cursor,o)}else r.insertBefore(this.cursor,n.start.node);this.cursor.attach()}this.cursor.format(e,t),this.scroll.optimize(),this.setNativeRange(this.cursor.textNode,this.cursor.textNode.data.length),this.update()}}}},{key:"getBounds",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.scroll.length();e=Math.min(e,n-1),t=Math.min(e+t,n-1)-e;var r=void 0,o=this.scroll.leaf(e),i=u(o,2),a=i[0],l=i[1];if(null==a)return null;var s=a.position(l,!0),c=u(s,2);r=c[0],l=c[1];var f=document.createRange();if(t>0){f.setStart(r,l);var p=this.scroll.leaf(e+t),d=u(p,2);if(a=d[0],l=d[1],null==a)return null;var h=a.position(l,!0),y=u(h,2);return r=y[0],l=y[1],f.setEnd(r,l),f.getBoundingClientRect()}var v="left",m=void 0;return r instanceof Text?(l<r.data.length?(f.setStart(r,l),f.setEnd(r,l+1)):(f.setStart(r,l-1),f.setEnd(r,l),v="right"),m=f.getBoundingClientRect()):(m=a.domNode.getBoundingClientRect(),l>0&&(v="right")),{bottom:m.top+m.height,height:m.height,left:m[v],right:m[v],top:m.top,width:0}}},{key:"getNativeRange",value:function(){var e=document.getSelection();if(null==e||e.rangeCount<=0)return null;var t=e.getRangeAt(0);if(null==t)return null;var n=this.normalizeNative(t);return g.info("getNativeRange",n),n}},{key:"getRange",value:function(){var e=this.getNativeRange();return null==e?[null,null]:[this.normalizedToRange(e),e]}},{key:"hasFocus",value:function(){return document.activeElement===this.root}},{key:"normalizedToRange",value:function(e){var t=this,n=[[e.start.node,e.start.offset]];e.native.collapsed||n.push([e.end.node,e.end.offset]);var r=n.map(function(e){var n=u(e,2),r=n[0],o=n[1],i=c.default.find(r,!0),a=i.offset(t.scroll);return 0===o?a:i instanceof c.default.Container?a+i.length():a+i.index(r,o)}),i=Math.min(Math.max.apply(Math,o(r)),this.scroll.length()-1),a=Math.min.apply(Math,[i].concat(o(r)));return new _(a,i-a)}},{key:"normalizeNative",value:function(e){if(!a(this.root,e.startContainer)||!e.collapsed&&!a(this.root,e.endContainer))return null;var t={start:{node:e.startContainer,offset:e.startOffset},end:{node:e.endContainer,offset:e.endOffset},native:e};return[t.start,t.end].forEach(function(e){for(var t=e.node,n=e.offset;!(t instanceof Text)&&t.childNodes.length>0;)if(t.childNodes.length>n)t=t.childNodes[n],n=0;else{if(t.childNodes.length!==n)break;t=t.lastChild,n=t instanceof Text?t.data.length:t.childNodes.length+1}e.node=t,e.offset=n}),t}},{key:"rangeToNative",value:function(e){var t=this,n=e.collapsed?[e.index]:[e.index,e.index+e.length],r=[],o=this.scroll.length();return n.forEach(function(e,n){e=Math.min(o-1,e);var i=void 0,a=t.scroll.leaf(e),l=u(a,2),s=l[0],c=l[1],f=s.position(c,0!==n),p=u(f,2);i=p[0],c=p[1],r.push(i,c)}),r.length<2&&(r=r.concat(r)),r}},{key:"scrollIntoView",value:function(e){var t=this.lastRange;if(null!=t){var n=this.getBounds(t.index,t.length);if(null!=n){var r=this.scroll.length()-1,o=this.scroll.line(Math.min(t.index,r)),i=u(o,1),a=i[0],l=a;if(t.length>0){var s=this.scroll.line(Math.min(t.index+t.length,r));l=u(s,1)[0]}if(null!=a&&null!=l){var c=e.getBoundingClientRect();n.top<c.top?e.scrollTop-=c.top-n.top:n.bottom>c.bottom&&(e.scrollTop+=n.bottom-c.bottom)}}}}},{key:"setNativeRange",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:t,o=arguments.length>4&&void 0!==arguments[4]&&arguments[4];if(g.info("setNativeRange",e,t,n,r),null==e||null!=this.root.parentNode&&null!=e.parentNode&&null!=n.parentNode){var i=document.getSelection();if(null!=i)if(null!=e){this.hasFocus()||this.root.focus();var a=(this.getNativeRange()||{}).native;if(null==a||o||e!==a.startContainer||t!==a.startOffset||n!==a.endContainer||r!==a.endOffset){"BR"==e.tagName&&(t=[].indexOf.call(e.parentNode.childNodes,e),e=e.parentNode),"BR"==n.tagName&&(r=[].indexOf.call(n.parentNode.childNodes,n),n=n.parentNode);var u=document.createRange();u.setStart(e,t),u.setEnd(n,r),i.removeAllRanges(),i.addRange(u)}}else i.removeAllRanges(),this.root.blur(),document.body.focus()}}},{key:"setRange",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:v.default.sources.API;if("string"==typeof t&&(n=t,t=!1),g.info("setRange",e),null!=e){var r=this.rangeToNative(e);this.setNativeRange.apply(this,o(r).concat([t]))}else this.setNativeRange(null);this.update(n)}},{key:"update",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v.default.sources.USER,t=this.lastRange,n=this.getRange(),r=u(n,2),o=r[0],i=r[1];if(this.lastRange=o,null!=this.lastRange&&(this.savedRange=this.lastRange),!(0,h.default)(t,this.lastRange)){var a;!this.composing&&null!=i&&i.native.collapsed&&i.start.node!==this.cursor.textNode&&this.cursor.restore();var l=[v.default.events.SELECTION_CHANGE,(0,p.default)(this.lastRange),(0,p.default)(t),e];if((a=this.emitter).emit.apply(a,[v.default.events.EDITOR_CHANGE].concat(l)),e!==v.default.sources.SILENT){var s;(s=this.emitter).emit.apply(s,l)}}}}]),e}();t.Range=_,t.default=w},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"insertInto",value:function(e,n){0===e.children.length?u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"insertInto",this).call(this,e,n):this.remove()}},{key:"length",value:function(){return 0}},{key:"value",value:function(){return""}}],[{key:"value",value:function(){}}]),t}(s.default.Embed);c.blotName="break",c.tagName="BR",t.default=c},function(e,t,n){"use strict";function r(e){var t=u.find(e);if(null==t)try{t=u.create(e)}catch(n){t=u.create(u.Scope.INLINE),[].slice.call(e.childNodes).forEach(function(e){t.domNode.appendChild(e)}),e.parentNode&&e.parentNode.replaceChild(t.domNode,e),t.attach()}return t}var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var i=n(44),a=n(30),u=n(1),l=function(e){function t(t){var n=e.call(this,t)||this;return n.build(),n}return o(t,e),t.prototype.appendChild=function(e){this.insertBefore(e)},t.prototype.attach=function(){e.prototype.attach.call(this),this.children.forEach(function(e){e.attach()})},t.prototype.build=function(){var e=this;this.children=new i.default,[].slice.call(this.domNode.childNodes).reverse().forEach(function(t){try{var n=r(t);e.insertBefore(n,e.children.head||void 0)}catch(e){if(e instanceof u.ParchmentError)return;throw e}})},t.prototype.deleteAt=function(e,t){if(0===e&&t===this.length())return this.remove();this.children.forEachAt(e,t,function(e,t,n){e.deleteAt(t,n)})},t.prototype.descendant=function(e,n){var r=this.children.find(n),o=r[0],i=r[1];return null==e.blotName&&e(o)||null!=e.blotName&&o instanceof e?[o,i]:o instanceof t?o.descendant(e,i):[null,-1]},t.prototype.descendants=function(e,n,r){void 0===n&&(n=0),void 0===r&&(r=Number.MAX_VALUE);var o=[],i=r;return this.children.forEachAt(n,r,function(n,r,a){(null==e.blotName&&e(n)||null!=e.blotName&&n instanceof e)&&o.push(n),n instanceof t&&(o=o.concat(n.descendants(e,r,i))),i-=a}),o},t.prototype.detach=function(){this.children.forEach(function(e){e.detach()}),e.prototype.detach.call(this)},t.prototype.formatAt=function(e,t,n,r){this.children.forEachAt(e,t,function(e,t,o){e.formatAt(t,o,n,r)})},t.prototype.insertAt=function(e,t,n){var r=this.children.find(e),o=r[0],i=r[1];if(o)o.insertAt(i,t,n);else{var a=null==n?u.create("text",t):u.create(t,n);this.appendChild(a)}},t.prototype.insertBefore=function(e,t){if(null!=this.statics.allowedChildren&&!this.statics.allowedChildren.some(function(t){return e instanceof t}))throw new u.ParchmentError("Cannot insert "+e.statics.blotName+" into "+this.statics.blotName);e.insertInto(this,t)},t.prototype.length=function(){return this.children.reduce(function(e,t){return e+t.length()},0)},t.prototype.moveChildren=function(e,t){this.children.forEach(function(n){e.insertBefore(n,t)})},t.prototype.optimize=function(t){if(e.prototype.optimize.call(this,t),0===this.children.length)if(null!=this.statics.defaultChild){var n=u.create(this.statics.defaultChild);this.appendChild(n),n.optimize(t)}else this.remove()},t.prototype.path=function(e,n){void 0===n&&(n=!1);var r=this.children.find(e,n),o=r[0],i=r[1],a=[[this,e]];return o instanceof t?a.concat(o.path(i,n)):(null!=o&&a.push([o,i]),a)},t.prototype.removeChild=function(e){this.children.remove(e)},t.prototype.replace=function(n){n instanceof t&&n.moveChildren(this),e.prototype.replace.call(this,n)},t.prototype.split=function(e,t){if(void 0===t&&(t=!1),!t){if(0===e)return this;if(e===this.length())return this.next}var n=this.clone();return this.parent.insertBefore(n,this.next),this.children.forEachAt(e,this.length(),function(e,r,o){e=e.split(r,t),n.appendChild(e)}),n},t.prototype.unwrap=function(){this.moveChildren(this.parent,this.next),this.remove()},t.prototype.update=function(e,t){var n=this,o=[],i=[];e.forEach(function(e){e.target===n.domNode&&"childList"===e.type&&(o.push.apply(o,e.addedNodes),i.push.apply(i,e.removedNodes))}),i.forEach(function(e){if(!(null!=e.parentNode&&"IFRAME"!==e.tagName&&document.body.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_CONTAINED_BY)){var t=u.find(e);null!=t&&(null!=t.domNode.parentNode&&t.domNode.parentNode!==n.domNode||t.detach())}}),o.filter(function(e){return e.parentNode==n.domNode}).sort(function(e,t){return e===t?0:e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING?1:-1}).forEach(function(e){var t=null;null!=e.nextSibling&&(t=u.find(e.nextSibling));var o=r(e);o.next==t&&null!=o.next||(null!=o.parent&&o.parent.removeChild(n),n.insertBefore(o,t||void 0))})},t}(a.default);t.default=l},function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(12),i=n(31),a=n(17),u=n(1),l=function(e){function t(t){var n=e.call(this,t)||this;return n.attributes=new i.default(n.domNode),n}return r(t,e),t.formats=function(e){return"string"==typeof this.tagName||(Array.isArray(this.tagName)?e.tagName.toLowerCase():void 0)},t.prototype.format=function(e,t){var n=u.query(e);n instanceof o.default?this.attributes.attribute(n,t):t&&(null==n||e===this.statics.blotName&&this.formats()[e]===t||this.replaceWith(e,t))},t.prototype.formats=function(){var e=this.attributes.values(),t=this.statics.formats(this.domNode);return null!=t&&(e[this.statics.blotName]=t),e},t.prototype.replaceWith=function(t,n){var r=e.prototype.replaceWith.call(this,t,n);return this.attributes.copy(r),r},t.prototype.update=function(t,n){var r=this;e.prototype.update.call(this,t,n),t.some(function(e){return e.target===r.domNode&&"attributes"===e.type})&&this.attributes.build()},t.prototype.wrap=function(n,r){var o=e.prototype.wrap.call(this,n,r);return o instanceof t&&o.statics.scope===this.statics.scope&&this.attributes.move(o),o},t}(a.default);t.default=l},function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(30),i=n(1),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return r(t,e),t.value=function(e){return!0},t.prototype.index=function(e,t){return this.domNode===e||this.domNode.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_CONTAINED_BY?Math.min(t,1):-1},t.prototype.position=function(e,t){var n=[].indexOf.call(this.parent.domNode.childNodes,this.domNode);return e>0&&(n+=1),[this.parent.domNode,n]},t.prototype.value=function(){return e={},e[this.statics.blotName]=this.statics.value(this.domNode)||!0,e;var e},t.scope=i.Scope.INLINE_BLOT,t}(o.default);t.default=a},function(e,t,n){function r(e){this.ops=e,this.index=0,this.offset=0}var o=n(11),i=n(3),a={attributes:{compose:function(e,t,n){"object"!=typeof e&&(e={}),"object"!=typeof t&&(t={});var r=i(!0,{},t);n||(r=Object.keys(r).reduce(function(e,t){return null!=r[t]&&(e[t]=r[t]),e},{}));for(var o in e)void 0!==e[o]&&void 0===t[o]&&(r[o]=e[o]);return Object.keys(r).length>0?r:void 0},diff:function(e,t){"object"!=typeof e&&(e={}),"object"!=typeof t&&(t={});var n=Object.keys(e).concat(Object.keys(t)).reduce(function(n,r){return o(e[r],t[r])||(n[r]=void 0===t[r]?null:t[r]),n},{});return Object.keys(n).length>0?n:void 0},transform:function(e,t,n){if("object"!=typeof e)return t;if("object"==typeof t){if(!n)return t;var r=Object.keys(t).reduce(function(n,r){return void 0===e[r]&&(n[r]=t[r]),n},{});return Object.keys(r).length>0?r:void 0}}},iterator:function(e){return new r(e)},length:function(e){return"number"==typeof e.delete?e.delete:"number"==typeof e.retain?e.retain:"string"==typeof e.insert?e.insert.length:1}};r.prototype.hasNext=function(){return this.peekLength()<1/0},r.prototype.next=function(e){e||(e=1/0);var t=this.ops[this.index];if(t){var n=this.offset,r=a.length(t);if(e>=r-n?(e=r-n,this.index+=1,this.offset=0):this.offset+=e,"number"==typeof t.delete)return{delete:e};var o={};return t.attributes&&(o.attributes=t.attributes),"number"==typeof t.retain?o.retain=e:"string"==typeof t.insert?o.insert=t.insert.substr(n,e):o.insert=t.insert,o}return{retain:1/0}},r.prototype.peek=function(){return this.ops[this.index]},r.prototype.peekLength=function(){return this.ops[this.index]?a.length(this.ops[this.index])-this.offset:1/0},r.prototype.peekType=function(){return this.ops[this.index]?"number"==typeof this.ops[this.index].delete?"delete":"number"==typeof this.ops[this.index].retain?"retain":"insert":"retain"},e.exports=a},function(e,n){var r=function(){"use strict";function e(e,t){return null!=t&&e instanceof t}function n(r,o,i,a,f){function p(r,i){if(null===r)return null;if(0===i)return r;var v,m;if("object"!=typeof r)return r;if(e(r,l))v=new l;else if(e(r,s))v=new s;else if(e(r,c))v=new c(function(e,t){r.then(function(t){e(p(t,i-1))},function(e){t(p(e,i-1))})});else if(n.__isArray(r))v=[];else if(n.__isRegExp(r))v=new RegExp(r.source,u(r)),r.lastIndex&&(v.lastIndex=r.lastIndex);else if(n.__isDate(r))v=new Date(r.getTime());else{if(y&&t.isBuffer(r))return v=new t(r.length),r.copy(v),v;e(r,Error)?v=Object.create(r):void 0===a?(m=Object.getPrototypeOf(r),v=Object.create(m)):(v=Object.create(a),m=a)}if(o){var b=d.indexOf(r);if(-1!=b)return h[b];d.push(r),h.push(v)}e(r,l)&&r.forEach(function(e,t){var n=p(t,i-1),r=p(e,i-1);v.set(n,r)}),e(r,s)&&r.forEach(function(e){var t=p(e,i-1);v.add(t)});for(var g in r){var _;m&&(_=Object.getOwnPropertyDescriptor(m,g)),_&&null==_.set||(v[g]=p(r[g],i-1))}if(Object.getOwnPropertySymbols)for(var w=Object.getOwnPropertySymbols(r),g=0;g<w.length;g++){var E=w[g],O=Object.getOwnPropertyDescriptor(r,E);(!O||O.enumerable||f)&&(v[E]=p(r[E],i-1),O.enumerable||Object.defineProperty(v,E,{enumerable:!1}))}if(f)for(var x=Object.getOwnPropertyNames(r),g=0;g<x.length;g++){var k=x[g],O=Object.getOwnPropertyDescriptor(r,k);O&&O.enumerable||(v[k]=p(r[k],i-1),Object.defineProperty(v,k,{enumerable:!1}))}return v}"object"==typeof o&&(i=o.depth,a=o.prototype,f=o.includeNonEnumerable,o=o.circular);var d=[],h=[],y=void 0!==t;return void 0===o&&(o=!0),void 0===i&&(i=1/0),p(r,i)}function r(e){return Object.prototype.toString.call(e)}function o(e){return"object"==typeof e&&"[object Date]"===r(e)}function i(e){return"object"==typeof e&&"[object Array]"===r(e)}function a(e){return"object"==typeof e&&"[object RegExp]"===r(e)}function u(e){var t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),t}var l;try{l=Map}catch(e){l=function(){}}var s;try{s=Set}catch(e){s=function(){}}var c;try{c=Promise}catch(e){c=function(){}}return n.clonePrototype=function(e){if(null===e)return null;var t=function(){};return t.prototype=e,new t},n.__objToStr=r,n.__isDate=o,n.__isArray=i,n.__isRegExp=a,n.__getRegExpFlags=u,n}();"object"==typeof e&&e.exports&&(e.exports=r)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){return e instanceof v.default||e instanceof y.BlockEmbed}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},f=n(0),p=r(f),d=n(8),h=r(d),y=n(4),v=r(y),m=n(16),b=r(m),g=n(13),_=r(g),w=n(25),E=r(w),O=function(e){function t(e,n){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.emitter=n.emitter,Array.isArray(n.whitelist)&&(r.whitelist=n.whitelist.reduce(function(e,t){return e[t]=!0,e},{})),r.domNode.addEventListener("DOMNodeInserted",function(){}),r.optimize(),r.enable(),r}return a(t,e),s(t,[{key:"batchStart",value:function(){this.batch=!0}},{key:"batchEnd",value:function(){this.batch=!1,this.optimize()}},{key:"deleteAt",value:function(e,n){var r=this.line(e),o=l(r,2),i=o[0],a=o[1],u=this.line(e+n),s=l(u,1),f=s[0];if(c(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"deleteAt",this).call(this,e,n),null!=f&&i!==f&&a>0){if(i instanceof y.BlockEmbed||f instanceof y.BlockEmbed)return void this.optimize();if(i instanceof _.default){var p=i.newlineIndex(i.length(),!0);if(p>-1&&(i=i.split(p+1))===f)return void this.optimize()}else if(f instanceof _.default){var d=f.newlineIndex(0);d>-1&&f.split(d+1)}var h=f.children.head instanceof b.default?null:f.children.head;i.moveChildren(f,h),i.remove()}this.optimize()}},{key:"enable",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.domNode.setAttribute("contenteditable",e)}},{key:"formatAt",value:function(e,n,r,o){(null==this.whitelist||this.whitelist[r])&&(c(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"formatAt",this).call(this,e,n,r,o),this.optimize())}},{key:"insertAt",value:function(e,n,r){if(null==r||null==this.whitelist||this.whitelist[n]){if(e>=this.length())if(null==r||null==p.default.query(n,p.default.Scope.BLOCK)){var o=p.default.create(this.statics.defaultChild);this.appendChild(o),null==r&&n.endsWith("\n")&&(n=n.slice(0,-1)),o.insertAt(0,n,r)}else{var i=p.default.create(n,r);this.appendChild(i)}else c(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"insertAt",this).call(this,e,n,r);this.optimize()}}},{key:"insertBefore",value:function(e,n){if(e.statics.scope===p.default.Scope.INLINE_BLOT){var r=p.default.create(this.statics.defaultChild);r.appendChild(e),e=r}c(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"insertBefore",this).call(this,e,n)}},{key:"leaf",value:function(e){return this.path(e).pop()||[null,-1]}},{key:"line",value:function(e){return e===this.length()?this.line(e-1):this.descendant(u,e)}},{key:"lines",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Number.MAX_VALUE;return function e(t,n,r){var o=[],i=r;return t.children.forEachAt(n,r,function(t,n,r){u(t)?o.push(t):t instanceof p.default.Container&&(o=o.concat(e(t,n,i))),i-=r}),o}(this,e,t)}},{key:"optimize",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};!0!==this.batch&&(c(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"optimize",this).call(this,e,n),e.length>0&&this.emitter.emit(h.default.events.SCROLL_OPTIMIZE,e,n))}},{key:"path",value:function(e){return c(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"path",this).call(this,e).slice(1)}},{key:"update",value:function(e){if(!0!==this.batch){var n=h.default.sources.USER;"string"==typeof e&&(n=e),Array.isArray(e)||(e=this.observer.takeRecords()),e.length>0&&this.emitter.emit(h.default.events.SCROLL_BEFORE_UPDATE,n,e),c(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"update",this).call(this,e.concat([])),e.length>0&&this.emitter.emit(h.default.events.SCROLL_UPDATE,n,e)}}}]),t}(p.default.Scroll);O.blotName="scroll",O.className="ql-editor",O.tagName="DIV",O.defaultChild="block",O.allowedChildren=[v.default,y.BlockEmbed,E.default],t.default=O},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n,r=e===D.keys.LEFT?"prefix":"suffix";return n={key:e,shiftKey:t,altKey:null},o(n,r,/^$/),o(n,"handler",function(n){var r=n.index;e===D.keys.RIGHT&&(r+=n.length+1);var o=this.quill.getLeaf(r);return!(m(o,1)[0]instanceof T.default.Embed)||(e===D.keys.LEFT?t?this.quill.setSelection(n.index-1,n.length+1,A.default.sources.USER):this.quill.setSelection(n.index-1,A.default.sources.USER):t?this.quill.setSelection(n.index,n.length+1,A.default.sources.USER):this.quill.setSelection(n.index+n.length+1,A.default.sources.USER),!1)}),n}function s(e,t){if(!(0===e.index||this.quill.getLength()<=1)){var n=this.quill.getLine(e.index),r=m(n,1),o=r[0],i={};if(0===t.offset){var a=this.quill.getLine(e.index-1),u=m(a,1),l=u[0];if(null!=l&&l.length()>1){var s=o.formats(),c=this.quill.getFormat(e.index-1,1);i=P.default.attributes.diff(s,c)||{}}}var f=/[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(t.prefix)?2:1;this.quill.deleteText(e.index-f,f,A.default.sources.USER),Object.keys(i).length>0&&this.quill.formatLine(e.index-f,f,i,A.default.sources.USER),this.quill.focus()}}function c(e,t){var n=/^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(t.suffix)?2:1;if(!(e.index>=this.quill.getLength()-n)){var r={},o=0,i=this.quill.getLine(e.index),a=m(i,1),u=a[0];if(t.offset>=u.length()-1){var l=this.quill.getLine(e.index+1),s=m(l,1),c=s[0];if(c){var f=u.formats(),p=this.quill.getFormat(e.index,1);r=P.default.attributes.diff(f,p)||{},o=c.length()}}this.quill.deleteText(e.index,n,A.default.sources.USER),Object.keys(r).length>0&&this.quill.formatLine(e.index+o-1,n,r,A.default.sources.USER)}}function f(e){var t=this.quill.getLines(e),n={};if(t.length>1){var r=t[0].formats(),o=t[t.length-1].formats();n=P.default.attributes.diff(o,r)||{}}this.quill.deleteText(e,A.default.sources.USER),Object.keys(n).length>0&&this.quill.formatLine(e.index,1,n,A.default.sources.USER),this.quill.setSelection(e.index,A.default.sources.SILENT),this.quill.focus()}function p(e,t){var n=this;e.length>0&&this.quill.scroll.deleteAt(e.index,e.length);var r=Object.keys(t.format).reduce(function(e,n){return T.default.query(n,T.default.Scope.BLOCK)&&!Array.isArray(t.format[n])&&(e[n]=t.format[n]),e},{});this.quill.insertText(e.index,"\n",r,A.default.sources.USER),this.quill.setSelection(e.index+1,A.default.sources.SILENT),this.quill.focus(),Object.keys(t.format).forEach(function(e){null==r[e]&&(Array.isArray(t.format[e])||"link"!==e&&n.quill.format(e,t.format[e],A.default.sources.USER))})}function d(e){return{key:D.keys.TAB,shiftKey:!e,format:{"code-block":!0},handler:function(t){var n=T.default.query("code-block"),r=t.index,o=t.length,i=this.quill.scroll.descendant(n,r),a=m(i,2),u=a[0],l=a[1];if(null!=u){var s=this.quill.getIndex(u),c=u.newlineIndex(l,!0)+1,f=u.newlineIndex(s+l+o),p=u.domNode.textContent.slice(c,f).split("\n");l=0,p.forEach(function(t,i){e?(u.insertAt(c+l,n.TAB),l+=n.TAB.length,0===i?r+=n.TAB.length:o+=n.TAB.length):t.startsWith(n.TAB)&&(u.deleteAt(c+l,n.TAB.length),l-=n.TAB.length,0===i?r-=n.TAB.length:o-=n.TAB.length),l+=t.length+1}),this.quill.update(A.default.sources.USER),this.quill.setSelection(r,o,A.default.sources.SILENT)}}}}function h(e){return{key:e[0].toUpperCase(),shortKey:!0,handler:function(t,n){this.quill.format(e,!n.format[e],A.default.sources.USER)}}}function y(e){if("string"==typeof e||"number"==typeof e)return y({key:e});if("object"===(void 0===e?"undefined":v(e))&&(e=(0,_.default)(e,!1)),"string"==typeof e.key)if(null!=D.keys[e.key.toUpperCase()])e.key=D.keys[e.key.toUpperCase()];else{if(1!==e.key.length)return null;e.key=e.key.toUpperCase().charCodeAt(0)}return e.shortKey&&(e[U]=e.shortKey,delete e.shortKey),e}Object.defineProperty(t,"__esModule",{value:!0}),t.SHORTKEY=t.default=void 0;var v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},m=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),b=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),g=n(21),_=r(g),w=n(11),E=r(w),O=n(3),x=r(O),k=n(2),S=r(k),C=n(20),P=r(C),j=n(0),T=r(j),N=n(5),A=r(N),R=n(10),M=r(R),L=n(9),I=r(L),q=(0,M.default)("quill:keyboard"),U=/Mac/i.test(navigator.platform)?"metaKey":"ctrlKey",D=function(e){function t(e,n){i(this,t);var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.bindings={},Object.keys(r.options.bindings).forEach(function(t){("list autofill"!==t||null==e.scroll.whitelist||e.scroll.whitelist.list)&&r.options.bindings[t]&&r.addBinding(r.options.bindings[t])}),r.addBinding({key:t.keys.ENTER,shiftKey:null},p),r.addBinding({key:t.keys.ENTER,metaKey:null,ctrlKey:null,altKey:null},function(){}),/Firefox/i.test(navigator.userAgent)?(r.addBinding({key:t.keys.BACKSPACE},{collapsed:!0},s),r.addBinding({key:t.keys.DELETE},{collapsed:!0},c)):(r.addBinding({key:t.keys.BACKSPACE},{collapsed:!0,prefix:/^.?$/},s),r.addBinding({key:t.keys.DELETE},{collapsed:!0,suffix:/^.?$/},c)),r.addBinding({key:t.keys.BACKSPACE},{collapsed:!1},f),r.addBinding({key:t.keys.DELETE},{collapsed:!1},f),r.addBinding({key:t.keys.BACKSPACE,altKey:null,ctrlKey:null,metaKey:null,shiftKey:null},{collapsed:!0,offset:0},s),r.listen(),r}return u(t,e),b(t,null,[{key:"match",value:function(e,t){return t=y(t),!["altKey","ctrlKey","metaKey","shiftKey"].some(function(n){return!!t[n]!==e[n]&&null!==t[n]})&&t.key===(e.which||e.keyCode)}}]),b(t,[{key:"addBinding",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=y(e);if(null==r||null==r.key)return q.warn("Attempted to add invalid keyboard binding",r);"function"==typeof t&&(t={handler:t}),"function"==typeof n&&(n={handler:n}),r=(0,x.default)(r,t,n),this.bindings[r.key]=this.bindings[r.key]||[],this.bindings[r.key].push(r)}},{key:"listen",value:function(){var e=this;this.quill.root.addEventListener("keydown",function(n){if(!n.defaultPrevented){var r=n.which||n.keyCode,o=(e.bindings[r]||[]).filter(function(e){return t.match(n,e)});if(0!==o.length){var i=e.quill.getSelection();if(null!=i&&e.quill.hasFocus()){var a=e.quill.getLine(i.index),u=m(a,2),l=u[0],s=u[1],c=e.quill.getLeaf(i.index),f=m(c,2),p=f[0],d=f[1],h=0===i.length?[p,d]:e.quill.getLeaf(i.index+i.length),y=m(h,2),b=y[0],g=y[1],_=p instanceof T.default.Text?p.value().slice(0,d):"",w=b instanceof T.default.Text?b.value().slice(g):"",O={collapsed:0===i.length,empty:0===i.length&&l.length()<=1,format:e.quill.getFormat(i),offset:s,prefix:_,suffix:w};o.some(function(t){if(null!=t.collapsed&&t.collapsed!==O.collapsed)return!1;if(null!=t.empty&&t.empty!==O.empty)return!1;if(null!=t.offset&&t.offset!==O.offset)return!1;if(Array.isArray(t.format)){if(t.format.every(function(e){return null==O.format[e]}))return!1}else if("object"===v(t.format)&&!Object.keys(t.format).every(function(e){return!0===t.format[e]?null!=O.format[e]:!1===t.format[e]?null==O.format[e]:(0,E.default)(t.format[e],O.format[e])}))return!1;return!(null!=t.prefix&&!t.prefix.test(O.prefix))&&(!(null!=t.suffix&&!t.suffix.test(O.suffix))&&!0!==t.handler.call(e,i,O))})&&n.preventDefault()}}}})}}]),t}(I.default);D.keys={BACKSPACE:8,TAB:9,ENTER:13,ESCAPE:27,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46},D.DEFAULTS={bindings:{bold:h("bold"),italic:h("italic"),underline:h("underline"),indent:{key:D.keys.TAB,format:["blockquote","indent","list"],handler:function(e,t){if(t.collapsed&&0!==t.offset)return!0;this.quill.format("indent","+1",A.default.sources.USER)}},outdent:{key:D.keys.TAB,shiftKey:!0,format:["blockquote","indent","list"],handler:function(e,t){if(t.collapsed&&0!==t.offset)return!0;this.quill.format("indent","-1",A.default.sources.USER)}},"outdent backspace":{key:D.keys.BACKSPACE,collapsed:!0,shiftKey:null,metaKey:null,ctrlKey:null,altKey:null,format:["indent","list"],offset:0,handler:function(e,t){null!=t.format.indent?this.quill.format("indent","-1",A.default.sources.USER):null!=t.format.list&&this.quill.format("list",!1,A.default.sources.USER)}},"indent code-block":d(!0),"outdent code-block":d(!1),"remove tab":{key:D.keys.TAB,shiftKey:!0,collapsed:!0,prefix:/\t$/,handler:function(e){this.quill.deleteText(e.index-1,1,A.default.sources.USER)}},tab:{key:D.keys.TAB,handler:function(e){this.quill.history.cutoff();var t=(new S.default).retain(e.index).delete(e.length).insert("\t");this.quill.updateContents(t,A.default.sources.USER),this.quill.history.cutoff(),this.quill.setSelection(e.index+1,A.default.sources.SILENT)}},"list empty enter":{key:D.keys.ENTER,collapsed:!0,format:["list"],empty:!0,handler:function(e,t){this.quill.format("list",!1,A.default.sources.USER),t.format.indent&&this.quill.format("indent",!1,A.default.sources.USER)}},"checklist enter":{key:D.keys.ENTER,collapsed:!0,format:{list:"checked"},handler:function(e){var t=this.quill.getLine(e.index),n=m(t,2),r=n[0],o=n[1],i=(0,x.default)({},r.formats(),{list:"checked"}),a=(new S.default).retain(e.index).insert("\n",i).retain(r.length()-o-1).retain(1,{list:"unchecked"});this.quill.updateContents(a,A.default.sources.USER),this.quill.setSelection(e.index+1,A.default.sources.SILENT),this.quill.scrollIntoView()}},"header enter":{key:D.keys.ENTER,collapsed:!0,format:["header"],suffix:/^$/,handler:function(e,t){var n=this.quill.getLine(e.index),r=m(n,2),o=r[0],i=r[1],a=(new S.default).retain(e.index).insert("\n",t.format).retain(o.length()-i-1).retain(1,{header:null});this.quill.updateContents(a,A.default.sources.USER),this.quill.setSelection(e.index+1,A.default.sources.SILENT),this.quill.scrollIntoView()}},"list autofill":{key:" ",collapsed:!0,format:{list:!1},prefix:/^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,handler:function(e,t){var n=t.prefix.length,r=this.quill.getLine(e.index),o=m(r,2),i=o[0],a=o[1];if(a>n)return!0;var u=void 0;switch(t.prefix.trim()){case"[]":case"[ ]":u="unchecked";break;case"[x]":u="checked";break;case"-":case"*":u="bullet";break;default:u="ordered"}this.quill.insertText(e.index," ",A.default.sources.USER),this.quill.history.cutoff();var l=(new S.default).retain(e.index-a).delete(n+1).retain(i.length()-2-a).retain(1,{list:u});this.quill.updateContents(l,A.default.sources.USER),this.quill.history.cutoff(),this.quill.setSelection(e.index-n,A.default.sources.SILENT)}},"code exit":{key:D.keys.ENTER,collapsed:!0,format:["code-block"],prefix:/\n\n$/,suffix:/^\s+$/,handler:function(e){var t=this.quill.getLine(e.index),n=m(t,2),r=n[0],o=n[1],i=(new S.default).retain(e.index+r.length()-o-2).retain(1,{"code-block":null}).delete(1);this.quill.updateContents(i,A.default.sources.USER)}},"embed left":l(D.keys.LEFT,!1),"embed left shift":l(D.keys.LEFT,!0),"embed right":l(D.keys.RIGHT,!1),"embed right shift":l(D.keys.RIGHT,!0)}},t.default=D,t.SHORTKEY=U},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(0),f=r(c),p=n(7),d=r(p),h=function(e){function t(e,n){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.selection=n,r.textNode=document.createTextNode(t.CONTENTS),r.domNode.appendChild(r.textNode),r._length=0,r}return a(t,e),s(t,null,[{key:"value",value:function(){}}]),s(t,[{key:"detach",value:function(){null!=this.parent&&this.parent.removeChild(this)}},{key:"format",value:function(e,n){if(0!==this._length)return l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"format",this).call(this,e,n);for(var r=this,o=0;null!=r&&r.statics.scope!==f.default.Scope.BLOCK_BLOT;)o+=r.offset(r.parent),r=r.parent;null!=r&&(this._length=t.CONTENTS.length,r.optimize(),r.formatAt(o,t.CONTENTS.length,e,n),this._length=0)}},{key:"index",value:function(e,n){return e===this.textNode?0:l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"index",this).call(this,e,n)}},{key:"length",value:function(){return this._length}},{key:"position",value:function(){return[this.textNode,this.textNode.data.length]}},{key:"remove",value:function(){l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this),this.parent=null}},{key:"restore",value:function(){if(!this.selection.composing&&null!=this.parent){var e=this.textNode,n=this.selection.getNativeRange(),r=void 0,o=void 0,i=void 0;if(null!=n&&n.start.node===e&&n.end.node===e){var a=[e,n.start.offset,n.end.offset];r=a[0],o=a[1],i=a[2]}for(;null!=this.domNode.lastChild&&this.domNode.lastChild!==this.textNode;)this.domNode.parentNode.insertBefore(this.domNode.lastChild,this.domNode);if(this.textNode.data!==t.CONTENTS){var l=this.textNode.data.split(t.CONTENTS).join("");this.next instanceof d.default?(r=this.next.domNode,this.next.insertAt(0,l),this.textNode.data=t.CONTENTS):(this.textNode.data=l,this.parent.insertBefore(f.default.create(this.textNode),this),this.textNode=document.createTextNode(t.CONTENTS),this.domNode.appendChild(this.textNode))}if(this.remove(),null!=o){var s=[o,i].map(function(e){return Math.max(0,Math.min(r.data.length,e-1))}),c=u(s,2);return o=c[0],i=c[1],{startNode:r,startOffset:o,endNode:r,endOffset:i}}}}},{key:"update",value:function(e,t){var n=this;if(e.some(function(e){return"characterData"===e.type&&e.target===n.textNode})){var r=this.restore();r&&(t.range=r)}}},{key:"value",value:function(){return""}}]),t}(f.default.Embed);h.blotName="cursor",h.className="ql-cursor",h.tagName="span",h.CONTENTS="\ufeff",t.default=h},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=n(0),l=r(u),s=n(4),c=r(s),f=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),t}(l.default.Container);f.allowedChildren=[c.default,s.BlockEmbed,f],t.default=f},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.ColorStyle=t.ColorClass=t.ColorAttributor=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"value",value:function(e){var n=u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"value",this).call(this,e);return n.startsWith("rgb(")?(n=n.replace(/^[^\d]+/,"").replace(/[^\d]+$/,""),"#"+n.split(",").map(function(e){return("00"+parseInt(e).toString(16)).slice(-2)}).join("")):n}}]),t}(s.default.Attributor.Style),f=new s.default.Attributor.Class("color","ql-color",{scope:s.default.Scope.INLINE}),p=new c("color","color",{scope:s.default.Scope.INLINE});t.ColorAttributor=c,t.ColorClass=f,t.ColorStyle=p},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t){var n=document.createElement("a");n.href=e;var r=n.href.slice(0,n.href.indexOf(":"));return t.indexOf(r)>-1}Object.defineProperty(t,"__esModule",{value:!0}),t.sanitize=t.default=void 0;var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},s=n(6),c=function(e){return e&&e.__esModule?e:{default:e}}(s),f=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),u(t,[{key:"format",value:function(e,n){if(e!==this.statics.blotName||!n)return l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"format",this).call(this,e,n);n=this.constructor.sanitize(n),this.domNode.setAttribute("href",n)}}],[{key:"create",value:function(e){var n=l(t.__proto__||Object.getPrototypeOf(t),"create",this).call(this,e);return e=this.sanitize(e),n.setAttribute("href",e),n.setAttribute("target","_blank"),n}},{key:"formats",value:function(e){return e.getAttribute("href")}},{key:"sanitize",value:function(e){return a(e,this.PROTOCOL_WHITELIST)?e:this.SANITIZED_URL}}]),t}(c.default);f.blotName="link",f.tagName="A",f.SANITIZED_URL="about:blank",f.PROTOCOL_WHITELIST=["http","https","mailto","tel"],t.default=f,t.sanitize=a},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){e.setAttribute(t,!("true"===e.getAttribute(t)))}Object.defineProperty(t,"__esModule",{value:!0});var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(23),s=r(l),c=n(107),f=r(c),p=0,d=function(){function e(t){var n=this;o(this,e),this.select=t,this.container=document.createElement("span"),this.buildPicker(),this.select.style.display="none",this.select.parentNode.insertBefore(this.container,this.select),this.label.addEventListener("mousedown",function(){n.togglePicker()}),this.label.addEventListener("keydown",function(e){switch(e.keyCode){case s.default.keys.ENTER:n.togglePicker();break;case s.default.keys.ESCAPE:n.escape(),e.preventDefault()}}),this.select.addEventListener("change",this.update.bind(this))}return u(e,[{key:"togglePicker",value:function(){this.container.classList.toggle("ql-expanded"),i(this.label,"aria-expanded"),i(this.options,"aria-hidden")}},{key:"buildItem",value:function(e){var t=this,n=document.createElement("span");return n.tabIndex="0",n.setAttribute("role","button"),n.classList.add("ql-picker-item"),e.hasAttribute("value")&&n.setAttribute("data-value",e.getAttribute("value")),e.textContent&&n.setAttribute("data-label",e.textContent),n.addEventListener("click",function(){t.selectItem(n,!0)}),n.addEventListener("keydown",function(e){switch(e.keyCode){case s.default.keys.ENTER:t.selectItem(n,!0),e.preventDefault();break;case s.default.keys.ESCAPE:t.escape(),e.preventDefault()}}),n}},{key:"buildLabel",value:function(){var e=document.createElement("span");return e.classList.add("ql-picker-label"),e.innerHTML=f.default,e.tabIndex="0",e.setAttribute("role","button"),e.setAttribute("aria-expanded","false"),this.container.appendChild(e),e}},{key:"buildOptions",value:function(){var e=this,t=document.createElement("span");t.classList.add("ql-picker-options"),t.setAttribute("aria-hidden","true"),t.tabIndex="-1",t.id="ql-picker-options-"+p,p+=1,this.label.setAttribute("aria-controls",t.id),this.options=t,[].slice.call(this.select.options).forEach(function(n){var r=e.buildItem(n);t.appendChild(r),!0===n.selected&&e.selectItem(r)}),this.container.appendChild(t)}},{key:"buildPicker",value:function(){var e=this;[].slice.call(this.select.attributes).forEach(function(t){e.container.setAttribute(t.name,t.value)}),this.container.classList.add("ql-picker"),this.label=this.buildLabel(),this.buildOptions()}},{key:"escape",value:function(){var e=this;this.close(),setTimeout(function(){return e.label.focus()},1)}},{key:"close",value:function(){this.container.classList.remove("ql-expanded"),this.label.setAttribute("aria-expanded","false"),this.options.setAttribute("aria-hidden","true")}},{key:"selectItem",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.container.querySelector(".ql-selected");if(e!==n&&(null!=n&&n.classList.remove("ql-selected"),null!=e&&(e.classList.add("ql-selected"),this.select.selectedIndex=[].indexOf.call(e.parentNode.children,e),e.hasAttribute("data-value")?this.label.setAttribute("data-value",e.getAttribute("data-value")):this.label.removeAttribute("data-value"),e.hasAttribute("data-label")?this.label.setAttribute("data-label",e.getAttribute("data-label")):this.label.removeAttribute("data-label"),t))){if("function"==typeof Event)this.select.dispatchEvent(new Event("change"));else if("object"===("undefined"==typeof Event?"undefined":a(Event))){var r=document.createEvent("Event");r.initEvent("change",!0,!0),this.select.dispatchEvent(r)}this.close()}}},{key:"update",value:function(){var e=void 0;if(this.select.selectedIndex>-1){var t=this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex];e=this.select.options[this.select.selectedIndex],this.selectItem(t)}else this.selectItem(null);var n=null!=e&&e!==this.select.querySelector("option[selected]");this.label.classList.toggle("ql-active",n)}}]),e}();t.default=d},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(5),u=r(a),l=n(4),s=r(l),c=n(16),f=r(c),p=n(25),d=r(p),h=n(24),y=r(h),v=n(35),m=r(v),b=n(6),g=r(b),_=n(22),w=r(_),E=n(7),O=r(E),x=n(55),k=r(x),S=n(42),C=r(S),P=n(23),j=r(P);u.default.register({"blots/block":s.default,"blots/block/embed":l.BlockEmbed,"blots/break":f.default,"blots/container":d.default,"blots/cursor":y.default,"blots/embed":m.default,"blots/inline":g.default,"blots/scroll":w.default,"blots/text":O.default,"modules/clipboard":k.default,"modules/history":C.default,"modules/keyboard":j.default}),i.default.register(s.default,f.default,y.default,g.default,w.default,O.default),t.default=u.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=function(){function e(e){this.domNode=e,this.domNode[r.DATA_KEY]={blot:this}}return Object.defineProperty(e.prototype,"statics",{get:function(){return this.constructor},enumerable:!0,configurable:!0}),e.create=function(e){if(null==this.tagName)throw new r.ParchmentError("Blot definition missing tagName");var t;return Array.isArray(this.tagName)?("string"==typeof e&&(e=e.toUpperCase(),parseInt(e).toString()===e&&(e=parseInt(e))),t="number"==typeof e?document.createElement(this.tagName[e-1]):this.tagName.indexOf(e)>-1?document.createElement(e):document.createElement(this.tagName[0])):t=document.createElement(this.tagName),this.className&&t.classList.add(this.className),t},e.prototype.attach=function(){null!=this.parent&&(this.scroll=this.parent.scroll)},e.prototype.clone=function(){var e=this.domNode.cloneNode(!1);return r.create(e)},e.prototype.detach=function(){null!=this.parent&&this.parent.removeChild(this),delete this.domNode[r.DATA_KEY]},e.prototype.deleteAt=function(e,t){this.isolate(e,t).remove()},e.prototype.formatAt=function(e,t,n,o){var i=this.isolate(e,t);if(null!=r.query(n,r.Scope.BLOT)&&o)i.wrap(n,o);else if(null!=r.query(n,r.Scope.ATTRIBUTE)){var a=r.create(this.statics.scope);i.wrap(a),a.format(n,o)}},e.prototype.insertAt=function(e,t,n){var o=null==n?r.create("text",t):r.create(t,n),i=this.split(e);this.parent.insertBefore(o,i)},e.prototype.insertInto=function(e,t){void 0===t&&(t=null),null!=this.parent&&this.parent.children.remove(this);var n=null;e.children.insertBefore(this,t),null!=t&&(n=t.domNode),this.domNode.parentNode==e.domNode&&this.domNode.nextSibling==n||e.domNode.insertBefore(this.domNode,n),this.parent=e,this.attach()},e.prototype.isolate=function(e,t){var n=this.split(e);return n.split(t),n},e.prototype.length=function(){return 1},e.prototype.offset=function(e){return void 0===e&&(e=this.parent),null==this.parent||this==e?0:this.parent.children.offset(this)+this.parent.offset(e)},e.prototype.optimize=function(e){null!=this.domNode[r.DATA_KEY]&&delete this.domNode[r.DATA_KEY].mutations},e.prototype.remove=function(){null!=this.domNode.parentNode&&this.domNode.parentNode.removeChild(this.domNode),this.detach()},e.prototype.replace=function(e){null!=e.parent&&(e.parent.insertBefore(this,e.next),e.remove())},e.prototype.replaceWith=function(e,t){var n="string"==typeof e?r.create(e,t):e;return n.replace(this),n},e.prototype.split=function(e,t){return 0===e?this:this.next},e.prototype.update=function(e,t){},e.prototype.wrap=function(e,t){var n="string"==typeof e?r.create(e,t):e;return null!=this.parent&&this.parent.insertBefore(n,this.next),n.appendChild(this),n},e.blotName="abstract",e}();t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(12),o=n(32),i=n(33),a=n(1),u=function(){function e(e){this.attributes={},this.domNode=e,this.build()}return e.prototype.attribute=function(e,t){t?e.add(this.domNode,t)&&(null!=e.value(this.domNode)?this.attributes[e.attrName]=e:delete this.attributes[e.attrName]):(e.remove(this.domNode),delete this.attributes[e.attrName])},e.prototype.build=function(){var e=this;this.attributes={};var t=r.default.keys(this.domNode),n=o.default.keys(this.domNode),u=i.default.keys(this.domNode);t.concat(n).concat(u).forEach(function(t){var n=a.query(t,a.Scope.ATTRIBUTE);n instanceof r.default&&(e.attributes[n.attrName]=n)})},e.prototype.copy=function(e){var t=this;Object.keys(this.attributes).forEach(function(n){var r=t.attributes[n].value(t.domNode);e.format(n,r)})},e.prototype.move=function(e){var t=this;this.copy(e),Object.keys(this.attributes).forEach(function(e){t.attributes[e].remove(t.domNode)}),this.attributes={}},e.prototype.values=function(){var e=this;return Object.keys(this.attributes).reduce(function(t,n){return t[n]=e.attributes[n].value(e.domNode),t},{})},e}();t.default=u},function(e,t,n){"use strict";function r(e,t){return(e.getAttribute("class")||"").split(/\s+/).filter(function(e){return 0===e.indexOf(t+"-")})}var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var i=n(12),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o(t,e),t.keys=function(e){return(e.getAttribute("class")||"").split(/\s+/).map(function(e){return e.split("-").slice(0,-1).join("-")})},t.prototype.add=function(e,t){return!!this.canAdd(e,t)&&(this.remove(e),e.classList.add(this.keyName+"-"+t),!0)},t.prototype.remove=function(e){r(e,this.keyName).forEach(function(t){e.classList.remove(t)}),0===e.classList.length&&e.removeAttribute("class")},t.prototype.value=function(e){var t=r(e,this.keyName)[0]||"",n=t.slice(this.keyName.length+1);return this.canAdd(e,n)?n:""},t}(i.default);t.default=a},function(e,t,n){"use strict";function r(e){var t=e.split("-"),n=t.slice(1).map(function(e){return e[0].toUpperCase()+e.slice(1)}).join("");return t[0]+n}var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var i=n(12),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o(t,e),t.keys=function(e){return(e.getAttribute("style")||"").split(";").map(function(e){return e.split(":")[0].trim()})},t.prototype.add=function(e,t){return!!this.canAdd(e,t)&&(e.style[r(this.keyName)]=t,!0)},t.prototype.remove=function(e){e.style[r(this.keyName)]="",e.getAttribute("style")||e.removeAttribute("style")},t.prototype.value=function(e){var t=e.style[r(this.keyName)];return this.canAdd(e,t)?t:""},t}(i.default);t.default=a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(t,n){r(this,e),this.quill=t,this.options=n,this.modules={}}return o(e,[{key:"init",value:function(){var e=this;Object.keys(this.options.modules).forEach(function(t){null==e.modules[t]&&e.addModule(t)})}},{key:"addModule",value:function(e){var t=this.quill.constructor.import("modules/"+e);return this.modules[e]=new t(this.quill,this.options.modules[e]||{}),this.modules[e]}}]),e}();i.DEFAULTS={modules:{}},i.themes={default:i},t.default=i},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},s=n(0),c=r(s),f=n(7),p=r(f),d="\ufeff",h=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.contentNode=document.createElement("span"),n.contentNode.setAttribute("contenteditable",!1),[].slice.call(n.domNode.childNodes).forEach(function(e){n.contentNode.appendChild(e)}),n.leftGuard=document.createTextNode(d),n.rightGuard=document.createTextNode(d),n.domNode.appendChild(n.leftGuard),n.domNode.appendChild(n.contentNode),n.domNode.appendChild(n.rightGuard),n}return a(t,e),u(t,[{key:"index",value:function(e,n){return e===this.leftGuard?0:e===this.rightGuard?1:l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"index",this).call(this,e,n)}},{key:"restore",value:function(e){var t=void 0,n=void 0,r=e.data.split(d).join("");if(e===this.leftGuard)if(this.prev instanceof p.default){var o=this.prev.length();this.prev.insertAt(o,r),t={startNode:this.prev.domNode,startOffset:o+r.length}}else n=document.createTextNode(r),this.parent.insertBefore(c.default.create(n),this),t={startNode:n,startOffset:r.length};else e===this.rightGuard&&(this.next instanceof p.default?(this.next.insertAt(0,r),t={startNode:this.next.domNode,startOffset:r.length}):(n=document.createTextNode(r),this.parent.insertBefore(c.default.create(n),this.next),t={startNode:n,startOffset:r.length}));return e.data=d,t}},{key:"update",value:function(e,t){var n=this;e.forEach(function(e){if("characterData"===e.type&&(e.target===n.leftGuard||e.target===n.rightGuard)){var r=n.restore(e.target);r&&(t.range=r)}})}}]),t}(c.default.Embed);t.default=h},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.AlignStyle=t.AlignClass=t.AlignAttribute=void 0;var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),i={scope:o.default.Scope.BLOCK,whitelist:["right","center","justify"]},a=new o.default.Attributor.Attribute("align","align",i),u=new o.default.Attributor.Class("align","ql-align",i),l=new o.default.Attributor.Style("align","text-align",i);t.AlignAttribute=a,t.AlignClass=u,t.AlignStyle=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.BackgroundStyle=t.BackgroundClass=void 0;var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),i=n(26),a=new o.default.Attributor.Class("background","ql-bg",{scope:o.default.Scope.INLINE}),u=new i.ColorAttributor("background","background-color",{scope:o.default.Scope.INLINE});t.BackgroundClass=a,t.BackgroundStyle=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DirectionStyle=t.DirectionClass=t.DirectionAttribute=void 0;var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),i={scope:o.default.Scope.BLOCK,whitelist:["rtl"]},a=new o.default.Attributor.Attribute("direction","dir",i),u=new o.default.Attributor.Class("direction","ql-direction",i),l=new o.default.Attributor.Style("direction","direction",i);t.DirectionAttribute=a,t.DirectionClass=u,t.DirectionStyle=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.FontClass=t.FontStyle=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c={scope:s.default.Scope.INLINE,whitelist:["serif","monospace"]},f=new s.default.Attributor.Class("font","ql-font",c),p=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"value",value:function(e){return u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"value",this).call(this,e).replace(/["']/g,"")}}]),t}(s.default.Attributor.Style),d=new p("font","font-family",c);t.FontStyle=d,t.FontClass=f},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SizeStyle=t.SizeClass=void 0;var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),i=new o.default.Attributor.Class("size","ql-size",{scope:o.default.Scope.INLINE,whitelist:["small","large","huge"]}),a=new o.default.Attributor.Style("size","font-size",{scope:o.default.Scope.INLINE,whitelist:["10px","18px","32px"]});t.SizeClass=i,t.SizeStyle=a},function(e,t,n){"use strict";e.exports={align:{"":n(76),center:n(77),right:n(78),justify:n(79)},background:n(80),blockquote:n(81),bold:n(82),clean:n(83),code:n(58),"code-block":n(58),color:n(84),direction:{"":n(85),rtl:n(86)},float:{center:n(87),full:n(88),left:n(89),right:n(90)},formula:n(91),header:{1:n(92),2:n(93)},italic:n(94),image:n(95),indent:{"+1":n(96),"-1":n(97)},link:n(98),list:{ordered:n(99),bullet:n(100),check:n(101)},script:{sub:n(102),super:n(103)},strike:n(104),underline:n(105),video:n(106)}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){var t=e.ops[e.ops.length-1];return null!=t&&(null!=t.insert?"string"==typeof t.insert&&t.insert.endsWith("\n"):null!=t.attributes&&Object.keys(t.attributes).some(function(e){return null!=f.default.query(e,f.default.Scope.BLOCK)}))}function l(e){var t=e.reduce(function(e,t){return e+=t.delete||0},0),n=e.length()-t;return u(e)&&(n-=1),n}Object.defineProperty(t,"__esModule",{value:!0}),t.getLastChangeIndex=t.default=void 0;var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(0),f=r(c),p=n(5),d=r(p),h=n(9),y=r(h),v=function(e){function t(e,n){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.lastRecorded=0,r.ignoreChange=!1,r.clear(),r.quill.on(d.default.events.EDITOR_CHANGE,function(e,t,n,o){e!==d.default.events.TEXT_CHANGE||r.ignoreChange||(r.options.userOnly&&o!==d.default.sources.USER?r.transform(t):r.record(t,n))}),r.quill.keyboard.addBinding({key:"Z",shortKey:!0},r.undo.bind(r)),r.quill.keyboard.addBinding({key:"Z",shortKey:!0,shiftKey:!0},r.redo.bind(r)),/Win/i.test(navigator.platform)&&r.quill.keyboard.addBinding({key:"Y",shortKey:!0},r.redo.bind(r)),r}return a(t,e),s(t,[{key:"change",value:function(e,t){if(0!==this.stack[e].length){var n=this.stack[e].pop();this.stack[t].push(n),this.lastRecorded=0,this.ignoreChange=!0,this.quill.updateContents(n[e],d.default.sources.USER),this.ignoreChange=!1;var r=l(n[e]);this.quill.setSelection(r)}}},{key:"clear",value:function(){this.stack={undo:[],redo:[]}}},{key:"cutoff",value:function(){this.lastRecorded=0}},{key:"record",value:function(e,t){if(0!==e.ops.length){this.stack.redo=[];var n=this.quill.getContents().diff(t),r=Date.now();if(this.lastRecorded+this.options.delay>r&&this.stack.undo.length>0){var o=this.stack.undo.pop();n=n.compose(o.undo),e=o.redo.compose(e)}else this.lastRecorded=r;this.stack.undo.push({redo:e,undo:n}),this.stack.undo.length>this.options.maxStack&&this.stack.undo.shift()}}},{key:"redo",value:function(){this.change("redo","undo")}},{key:"transform",value:function(e){this.stack.undo.forEach(function(t){t.undo=e.transform(t.undo,!0),t.redo=e.transform(t.redo,!0)}),this.stack.redo.forEach(function(t){t.undo=e.transform(t.undo,!0),t.redo=e.transform(t.redo,!0)})}},{key:"undo",value:function(){this.change("undo","redo")}}]),t}(y.default);v.DEFAULTS={delay:1e3,maxStack:100,userOnly:!1},t.default=v,t.getLastChangeIndex=l},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){var t=e.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/)||e.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);return t?(t[1]||"https")+"://www.youtube.com/embed/"+t[2]+"?showinfo=0":(t=e.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))?(t[1]||"https")+"://player.vimeo.com/video/"+t[2]+"/":e}function l(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];t.forEach(function(t){var r=document.createElement("option");t===n?r.setAttribute("selected","selected"):r.setAttribute("value",t),e.appendChild(r)})}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.BaseTooltip=void 0;var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},f=n(3),p=r(f),d=n(2),h=r(d),y=n(8),v=r(y),m=n(23),b=r(m),g=n(34),_=r(g),w=n(59),E=r(w),O=n(60),x=r(O),k=n(28),S=r(k),C=n(61),P=r(C),j=[!1,"center","right","justify"],T=["#000000","#e60000","#ff9900","#ffff00","#008a00","#0066cc","#9933ff","#ffffff","#facccc","#ffebcc","#ffffcc","#cce8cc","#cce0f5","#ebd6ff","#bbbbbb","#f06666","#ffc266","#ffff66","#66b966","#66a3e0","#c285ff","#888888","#a10000","#b26b00","#b2b200","#006100","#0047b2","#6b24b2","#444444","#5c0000","#663d00","#666600","#003700","#002966","#3d1466"],N=[!1,"serif","monospace"],A=["1","2","3",!1],R=["small",!1,"large","huge"],M=function(e){function t(e,n){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n)),a=function t(n){if(!document.body.contains(e.root))return document.body.removeEventListener("click",t);null==r.tooltip||r.tooltip.root.contains(n.target)||document.activeElement===r.tooltip.textbox||r.quill.hasFocus()||r.tooltip.hide(),null!=r.pickers&&r.pickers.forEach(function(e){e.container.contains(n.target)||e.close()})};return e.emitter.listenDOM("click",document.body,a),r}return a(t,e),s(t,[{key:"addModule",value:function(e){var n=c(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"addModule",this).call(this,e);return"toolbar"===e&&this.extendToolbar(n),n}},{key:"buildButtons",value:function(e,t){e.forEach(function(e){(e.getAttribute("class")||"").split(/\s+/).forEach(function(n){if(n.startsWith("ql-")&&(n=n.slice("ql-".length),null!=t[n]))if("direction"===n)e.innerHTML=t[n][""]+t[n].rtl;else if("string"==typeof t[n])e.innerHTML=t[n];else{var r=e.value||"";null!=r&&t[n][r]&&(e.innerHTML=t[n][r])}})})}},{key:"buildPickers",value:function(e,t){var n=this;this.pickers=e.map(function(e){if(e.classList.contains("ql-align"))return null==e.querySelector("option")&&l(e,j),new x.default(e,t.align);if(e.classList.contains("ql-background")||e.classList.contains("ql-color")){var n=e.classList.contains("ql-background")?"background":"color";return null==e.querySelector("option")&&l(e,T,"background"===n?"#ffffff":"#000000"),new E.default(e,t[n])}return null==e.querySelector("option")&&(e.classList.contains("ql-font")?l(e,N):e.classList.contains("ql-header")?l(e,A):e.classList.contains("ql-size")&&l(e,R)),new S.default(e)});var r=function(){n.pickers.forEach(function(e){e.update()})};this.quill.on(v.default.events.EDITOR_CHANGE,r)}}]),t}(_.default);M.DEFAULTS=(0,p.default)(!0,{},_.default.DEFAULTS,{modules:{toolbar:{handlers:{formula:function(){this.quill.theme.tooltip.edit("formula")},image:function(){var e=this,t=this.container.querySelector("input.ql-image[type=file]");null==t&&(t=document.createElement("input"),t.setAttribute("type","file"),t.setAttribute("accept","image/png, image/gif, image/jpeg, image/bmp, image/x-icon"),t.classList.add("ql-image"),t.addEventListener("change",function(){if(null!=t.files&&null!=t.files[0]){var n=new FileReader;n.onload=function(n){var r=e.quill.getSelection(!0);e.quill.updateContents((new h.default).retain(r.index).delete(r.length).insert({image:n.target.result}),v.default.sources.USER),e.quill.setSelection(r.index+1,v.default.sources.SILENT),t.value=""},n.readAsDataURL(t.files[0])}}),this.container.appendChild(t)),t.click()},video:function(){this.quill.theme.tooltip.edit("video")}}}}});var L=function(e){function t(e,n){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.textbox=r.root.querySelector('input[type="text"]'),r.listen(),r}return a(t,e),s(t,[{key:"listen",value:function(){var e=this;this.textbox.addEventListener("keydown",function(t){b.default.match(t,"enter")?(e.save(),t.preventDefault()):b.default.match(t,"escape")&&(e.cancel(),t.preventDefault())})}},{key:"cancel",value:function(){this.hide()}},{key:"edit",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"link",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;this.root.classList.remove("ql-hidden"),this.root.classList.add("ql-editing"),null!=t?this.textbox.value=t:e!==this.root.getAttribute("data-mode")&&(this.textbox.value=""),this.position(this.quill.getBounds(this.quill.selection.savedRange)),this.textbox.select(),this.textbox.setAttribute("placeholder",this.textbox.getAttribute("data-"+e)||""),this.root.setAttribute("data-mode",e)}},{key:"restoreFocus",value:function(){var e=this.quill.scrollingContainer.scrollTop;this.quill.focus(),this.quill.scrollingContainer.scrollTop=e}},{key:"save",value:function(){var e=this.textbox.value;switch(this.root.getAttribute("data-mode")){case"link":var t=this.quill.root.scrollTop;this.linkRange?(this.quill.formatText(this.linkRange,"link",e,v.default.sources.USER),delete this.linkRange):(this.restoreFocus(),this.quill.format("link",e,v.default.sources.USER)),this.quill.root.scrollTop=t;break;case"video":e=u(e);case"formula":if(!e)break;var n=this.quill.getSelection(!0);if(null!=n){var r=n.index+n.length;this.quill.insertEmbed(r,this.root.getAttribute("data-mode"),e,v.default.sources.USER),"formula"===this.root.getAttribute("data-mode")&&this.quill.insertText(r+1," ",v.default.sources.USER),this.quill.setSelection(r+2,v.default.sources.USER)}}this.textbox.value="",this.hide()}}]),t}(P.default);t.BaseTooltip=L,t.default=M},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){this.head=this.tail=null,this.length=0}return e.prototype.append=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.insertBefore(e[0],null),e.length>1&&this.append.apply(this,e.slice(1))},e.prototype.contains=function(e){for(var t,n=this.iterator();t=n();)if(t===e)return!0;return!1},e.prototype.insertBefore=function(e,t){e&&(e.next=t,null!=t?(e.prev=t.prev,null!=t.prev&&(t.prev.next=e),t.prev=e,t===this.head&&(this.head=e)):null!=this.tail?(this.tail.next=e,e.prev=this.tail,this.tail=e):(e.prev=null,this.head=this.tail=e),this.length+=1)},e.prototype.offset=function(e){for(var t=0,n=this.head;null!=n;){if(n===e)return t;t+=n.length(),n=n.next}return-1},e.prototype.remove=function(e){this.contains(e)&&(null!=e.prev&&(e.prev.next=e.next),null!=e.next&&(e.next.prev=e.prev),e===this.head&&(this.head=e.next),e===this.tail&&(this.tail=e.prev),this.length-=1)},e.prototype.iterator=function(e){return void 0===e&&(e=this.head),function(){var t=e;return null!=e&&(e=e.next),t}},e.prototype.find=function(e,t){void 0===t&&(t=!1);for(var n,r=this.iterator();n=r();){var o=n.length();if(e<o||t&&e===o&&(null==n.next||0!==n.next.length()))return[n,e];e-=o}return[null,0]},e.prototype.forEach=function(e){for(var t,n=this.iterator();t=n();)e(t)},e.prototype.forEachAt=function(e,t,n){if(!(t<=0))for(var r,o=this.find(e),i=o[0],a=o[1],u=e-a,l=this.iterator(i);(r=l())&&u<e+t;){var s=r.length();e>u?n(r,e-u,Math.min(t,u+s-e)):n(r,0,Math.min(s,e+t-u)),u+=s}},e.prototype.map=function(e){return this.reduce(function(t,n){return t.push(e(n)),t},[])},e.prototype.reduce=function(e,t){for(var n,r=this.iterator();n=r();)t=e(t,n);return t},e}();t.default=r},function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(17),i=n(1),a={attributes:!0,characterData:!0,characterDataOldValue:!0,childList:!0,subtree:!0},u=function(e){function t(t){var n=e.call(this,t)||this;return n.scroll=n,n.observer=new MutationObserver(function(e){n.update(e)}),n.observer.observe(n.domNode,a),n.attach(),n}return r(t,e),t.prototype.detach=function(){e.prototype.detach.call(this),this.observer.disconnect()},t.prototype.deleteAt=function(t,n){this.update(),0===t&&n===this.length()?this.children.forEach(function(e){e.remove()}):e.prototype.deleteAt.call(this,t,n)},t.prototype.formatAt=function(t,n,r,o){this.update(),e.prototype.formatAt.call(this,t,n,r,o)},t.prototype.insertAt=function(t,n,r){this.update(),e.prototype.insertAt.call(this,t,n,r)},t.prototype.optimize=function(t,n){var r=this;void 0===t&&(t=[]),void 0===n&&(n={}),e.prototype.optimize.call(this,n);for(var a=[].slice.call(this.observer.takeRecords());a.length>0;)t.push(a.pop());for(var u=function(e,t){void 0===t&&(t=!0),null!=e&&e!==r&&null!=e.domNode.parentNode&&(null==e.domNode[i.DATA_KEY].mutations&&(e.domNode[i.DATA_KEY].mutations=[]),t&&u(e.parent))},l=function(e){null!=e.domNode[i.DATA_KEY]&&null!=e.domNode[i.DATA_KEY].mutations&&(e instanceof o.default&&e.children.forEach(l),e.optimize(n))},s=t,c=0;s.length>0;c+=1){if(c>=100)throw new Error("[Parchment] Maximum optimize iterations reached");for(s.forEach(function(e){var t=i.find(e.target,!0);null!=t&&(t.domNode===e.target&&("childList"===e.type?(u(i.find(e.previousSibling,!1)),[].forEach.call(e.addedNodes,function(e){var t=i.find(e,!1);u(t,!1),t instanceof o.default&&t.children.forEach(function(e){u(e,!1)})})):"attributes"===e.type&&u(t.prev)),u(t))}),this.children.forEach(l),s=[].slice.call(this.observer.takeRecords()),a=s.slice();a.length>0;)t.push(a.pop())}},t.prototype.update=function(t,n){var r=this;void 0===n&&(n={}),t=t||this.observer.takeRecords(),t.map(function(e){var t=i.find(e.target,!0);return null==t?null:null==t.domNode[i.DATA_KEY].mutations?(t.domNode[i.DATA_KEY].mutations=[e],t):(t.domNode[i.DATA_KEY].mutations.push(e),null)}).forEach(function(e){null!=e&&e!==r&&null!=e.domNode[i.DATA_KEY]&&e.update(e.domNode[i.DATA_KEY].mutations||[],n)}),null!=this.domNode[i.DATA_KEY].mutations&&e.prototype.update.call(this,this.domNode[i.DATA_KEY].mutations,n),this.optimize(t,n)},t.blotName="scroll",t.defaultChild="block",t.scope=i.Scope.BLOCK_BLOT,t.tagName="DIV",t}(o.default);t.default=u},function(e,t,n){"use strict";function r(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(var n in e)if(e[n]!==t[n])return!1;return!0}var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var i=n(18),a=n(1),u=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o(t,e),t.formats=function(n){if(n.tagName!==t.tagName)return e.formats.call(this,n)},t.prototype.format=function(n,r){var o=this;n!==this.statics.blotName||r?e.prototype.format.call(this,n,r):(this.children.forEach(function(e){e instanceof i.default||(e=e.wrap(t.blotName,!0)),o.attributes.copy(e)}),this.unwrap())},t.prototype.formatAt=function(t,n,r,o){if(null!=this.formats()[r]||a.query(r,a.Scope.ATTRIBUTE)){this.isolate(t,n).format(r,o)}else e.prototype.formatAt.call(this,t,n,r,o)},t.prototype.optimize=function(n){e.prototype.optimize.call(this,n);var o=this.formats();if(0===Object.keys(o).length)return this.unwrap();var i=this.next;i instanceof t&&i.prev===this&&r(o,i.formats())&&(i.moveChildren(this),i.remove())},t.blotName="inline",t.scope=a.Scope.INLINE_BLOT,t.tagName="SPAN",t}(i.default);t.default=u},function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(18),i=n(1),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return r(t,e),t.formats=function(n){var r=i.query(t.blotName).tagName;if(n.tagName!==r)return e.formats.call(this,n)},t.prototype.format=function(n,r){null!=i.query(n,i.Scope.BLOCK)&&(n!==this.statics.blotName||r?e.prototype.format.call(this,n,r):this.replaceWith(t.blotName))},t.prototype.formatAt=function(t,n,r,o){null!=i.query(r,i.Scope.BLOCK)?this.format(r,o):e.prototype.formatAt.call(this,t,n,r,o)},t.prototype.insertAt=function(t,n,r){if(null==r||null!=i.query(n,i.Scope.INLINE))e.prototype.insertAt.call(this,t,n,r);else{var o=this.split(t),a=i.create(n,r);o.parent.insertBefore(a,o)}},t.prototype.update=function(t,n){navigator.userAgent.match(/Trident/)?this.build():e.prototype.update.call(this,t,n)},t.blotName="block",t.scope=i.Scope.BLOCK_BLOT,t.tagName="P",t}(o.default);t.default=a},function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(19),i=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return r(t,e),t.formats=function(e){},t.prototype.format=function(t,n){e.prototype.formatAt.call(this,0,this.length(),t,n)},t.prototype.formatAt=function(t,n,r,o){0===t&&n===this.length()?this.format(r,o):e.prototype.formatAt.call(this,t,n,r,o)},t.prototype.formats=function(){return this.statics.formats(this.domNode)},t}(o.default);t.default=i},function(e,t,n){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(t,"__esModule",{value:!0});var o=n(19),i=n(1),a=function(e){function t(t){var n=e.call(this,t)||this;return n.text=n.statics.value(n.domNode),n}return r(t,e),t.create=function(e){return document.createTextNode(e)},t.value=function(e){var t=e.data;return t.normalize&&(t=t.normalize()),t},t.prototype.deleteAt=function(e,t){this.domNode.data=this.text=this.text.slice(0,e)+this.text.slice(e+t)},t.prototype.index=function(e,t){return this.domNode===e?t:-1},t.prototype.insertAt=function(t,n,r){null==r?(this.text=this.text.slice(0,t)+n+this.text.slice(t),this.domNode.data=this.text):e.prototype.insertAt.call(this,t,n,r)},t.prototype.length=function(){return this.text.length},t.prototype.optimize=function(n){e.prototype.optimize.call(this,n),this.text=this.statics.value(this.domNode),0===this.text.length?this.remove():this.next instanceof t&&this.next.prev===this&&(this.insertAt(this.length(),this.next.value()),this.next.remove())},t.prototype.position=function(e,t){return void 0===t&&(t=!1),[this.domNode,e]},t.prototype.split=function(e,t){if(void 0===t&&(t=!1),!t){if(0===e)return this;if(e===this.length())return this.next}var n=i.create(this.domNode.splitText(e));return this.parent.insertBefore(n,this.next),this.text=this.statics.value(this.domNode),n},t.prototype.update=function(e,t){var n=this;e.some(function(e){return"characterData"===e.type&&e.target===n.domNode})&&(this.text=this.statics.value(this.domNode))},t.prototype.value=function(){return this.text},t.blotName="text",t.scope=i.Scope.INLINE_BLOT,t}(o.default);t.default=a},function(e,t,n){"use strict";var r=document.createElement("div");if(r.classList.toggle("test-class",!1),r.classList.contains("test-class")){var o=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(e,t){return arguments.length>1&&!this.contains(e)==!t?t:o.call(this,e)}}String.prototype.startsWith||(String.prototype.startsWith=function(e,t){return t=t||0,this.substr(t,e.length)===e}),String.prototype.endsWith||(String.prototype.endsWith=function(e,t){var n=this.toString();("number"!=typeof t||!isFinite(t)||Math.floor(t)!==t||t>n.length)&&(t=n.length),t-=e.length;var r=n.indexOf(e,t);return-1!==r&&r===t}),Array.prototype.find||Object.defineProperty(Array.prototype,"find",{value:function(e){if(null===this)throw new TypeError("Array.prototype.find called on null or undefined");if("function"!=typeof e)throw new TypeError("predicate must be a function");for(var t,n=Object(this),r=n.length>>>0,o=arguments[1],i=0;i<r;i++)if(t=n[i],e.call(o,t,i,n))return t}}),document.addEventListener("DOMContentLoaded",function(){document.execCommand("enableObjectResizing",!1,!1),document.execCommand("autoUrlDetect",!1,!1)})},function(e,t){function n(e,t,n){if(e==t)return e?[[v,e]]:[];(n<0||e.length<n)&&(n=null);var o=a(e,t),i=e.substring(0,o);e=e.substring(o),t=t.substring(o),o=u(e,t);var l=e.substring(e.length-o);e=e.substring(0,e.length-o),t=t.substring(0,t.length-o);var c=r(e,t);return i&&c.unshift([v,i]),l&&c.push([v,l]),s(c),null!=n&&(c=f(c,n)),c=p(c)}function r(e,t){var r;if(!e)return[[y,t]];if(!t)return[[h,e]];var i=e.length>t.length?e:t,a=e.length>t.length?t:e,u=i.indexOf(a);if(-1!=u)return r=[[y,i.substring(0,u)],[v,a],[y,i.substring(u+a.length)]],e.length>t.length&&(r[0][0]=r[2][0]=h),r;if(1==a.length)return[[h,e],[y,t]];var s=l(e,t);if(s){var c=s[0],f=s[1],p=s[2],d=s[3],m=s[4],b=n(c,p),g=n(f,d);return b.concat([[v,m]],g)}return o(e,t)}function o(e,t){for(var n=e.length,r=t.length,o=Math.ceil((n+r)/2),a=o,u=2*o,l=new Array(u),s=new Array(u),c=0;c<u;c++)l[c]=-1,s[c]=-1;l[a+1]=0,s[a+1]=0;for(var f=n-r,p=f%2!=0,d=0,v=0,m=0,b=0,g=0;g<o;g++){for(var _=-g+d;_<=g-v;_+=2){var w,E=a+_;w=_==-g||_!=g&&l[E-1]<l[E+1]?l[E+1]:l[E-1]+1;for(var O=w-_;w<n&&O<r&&e.charAt(w)==t.charAt(O);)w++,O++;if(l[E]=w,w>n)v+=2;else if(O>r)d+=2;else if(p){var x=a+f-_;if(x>=0&&x<u&&-1!=s[x]){var k=n-s[x];if(w>=k)return i(e,t,w,O)}}}for(var S=-g+m;S<=g-b;S+=2){var k,x=a+S;k=S==-g||S!=g&&s[x-1]<s[x+1]?s[x+1]:s[x-1]+1;for(var C=k-S;k<n&&C<r&&e.charAt(n-k-1)==t.charAt(r-C-1);)k++,C++;if(s[x]=k,k>n)b+=2;else if(C>r)m+=2;else if(!p){var E=a+f-S;if(E>=0&&E<u&&-1!=l[E]){var w=l[E],O=a+w-E;if(k=n-k,w>=k)return i(e,t,w,O)}}}}return[[h,e],[y,t]]}function i(e,t,r,o){var i=e.substring(0,r),a=t.substring(0,o),u=e.substring(r),l=t.substring(o),s=n(i,a),c=n(u,l);return s.concat(c)}function a(e,t){if(!e||!t||e.charAt(0)!=t.charAt(0))return 0;for(var n=0,r=Math.min(e.length,t.length),o=r,i=0;n<o;)e.substring(i,o)==t.substring(i,o)?(n=o,i=n):r=o,o=Math.floor((r-n)/2+n);return o}function u(e,t){if(!e||!t||e.charAt(e.length-1)!=t.charAt(t.length-1))return 0;for(var n=0,r=Math.min(e.length,t.length),o=r,i=0;n<o;)e.substring(e.length-o,e.length-i)==t.substring(t.length-o,t.length-i)?(n=o,i=n):r=o,o=Math.floor((r-n)/2+n);return o}function l(e,t){function n(e,t,n){for(var r,o,i,l,s=e.substring(n,n+Math.floor(e.length/4)),c=-1,f="";-1!=(c=t.indexOf(s,c+1));){var p=a(e.substring(n),t.substring(c)),d=u(e.substring(0,n),t.substring(0,c));f.length<d+p&&(f=t.substring(c-d,c)+t.substring(c,c+p),r=e.substring(0,n-d),o=e.substring(n+p),i=t.substring(0,c-d),l=t.substring(c+p))}return 2*f.length>=e.length?[r,o,i,l,f]:null}var r=e.length>t.length?e:t,o=e.length>t.length?t:e;if(r.length<4||2*o.length<r.length)return null;var i,l=n(r,o,Math.ceil(r.length/4)),s=n(r,o,Math.ceil(r.length/2));if(!l&&!s)return null;i=s?l&&l[4].length>s[4].length?l:s:l;var c,f,p,d;return e.length>t.length?(c=i[0],f=i[1],p=i[2],d=i[3]):(p=i[0],d=i[1],c=i[2],f=i[3]),[c,f,p,d,i[4]]}function s(e){e.push([v,""]);for(var t,n=0,r=0,o=0,i="",l="";n<e.length;)switch(e[n][0]){case y:o++,l+=e[n][1],n++;break;case h:r++,i+=e[n][1],n++;break;case v:r+o>1?(0!==r&&0!==o&&(t=a(l,i),0!==t&&(n-r-o>0&&e[n-r-o-1][0]==v?e[n-r-o-1][1]+=l.substring(0,t):(e.splice(0,0,[v,l.substring(0,t)]),n++),l=l.substring(t),i=i.substring(t)),0!==(t=u(l,i))&&(e[n][1]=l.substring(l.length-t)+e[n][1],l=l.substring(0,l.length-t),i=i.substring(0,i.length-t))),0===r?e.splice(n-o,r+o,[y,l]):0===o?e.splice(n-r,r+o,[h,i]):e.splice(n-r-o,r+o,[h,i],[y,l]),n=n-r-o+(r?1:0)+(o?1:0)+1):0!==n&&e[n-1][0]==v?(e[n-1][1]+=e[n][1],e.splice(n,1)):n++,o=0,r=0,i="",l=""}""===e[e.length-1][1]&&e.pop();var c=!1;for(n=1;n<e.length-1;)e[n-1][0]==v&&e[n+1][0]==v&&(e[n][1].substring(e[n][1].length-e[n-1][1].length)==e[n-1][1]?(e[n][1]=e[n-1][1]+e[n][1].substring(0,e[n][1].length-e[n-1][1].length),e[n+1][1]=e[n-1][1]+e[n+1][1],e.splice(n-1,1),c=!0):e[n][1].substring(0,e[n+1][1].length)==e[n+1][1]&&(e[n-1][1]+=e[n+1][1],e[n][1]=e[n][1].substring(e[n+1][1].length)+e[n+1][1],e.splice(n+1,1),c=!0)),n++;c&&s(e)}function c(e,t){if(0===t)return[v,e];for(var n=0,r=0;r<e.length;r++){var o=e[r];if(o[0]===h||o[0]===v){var i=n+o[1].length;if(t===i)return[r+1,e];if(t<i){e=e.slice();var a=t-n,u=[o[0],o[1].slice(0,a)],l=[o[0],o[1].slice(a)];return e.splice(r,1,u,l),[r+1,e]}n=i}}throw new Error("cursor_pos is out of bounds!")}function f(e,t){var n=c(e,t),r=n[1],o=n[0],i=r[o],a=r[o+1];if(null==i)return e;if(i[0]!==v)return e;if(null!=a&&i[1]+a[1]===a[1]+i[1])return r.splice(o,2,a,i),d(r,o,2);if(null!=a&&0===a[1].indexOf(i[1])){r.splice(o,2,[a[0],i[1]],[0,i[1]]);var u=a[1].slice(i[1].length);return u.length>0&&r.splice(o+2,0,[a[0],u]),d(r,o,3)}return e}function p(e){for(var t=!1,n=function(e){return e.charCodeAt(0)>=56320&&e.charCodeAt(0)<=57343},r=2;r<e.length;r+=1)e[r-2][0]===v&&function(e){return e.charCodeAt(e.length-1)>=55296&&e.charCodeAt(e.length-1)<=56319}(e[r-2][1])&&e[r-1][0]===h&&n(e[r-1][1])&&e[r][0]===y&&n(e[r][1])&&(t=!0,e[r-1][1]=e[r-2][1].slice(-1)+e[r-1][1],e[r][1]=e[r-2][1].slice(-1)+e[r][1],e[r-2][1]=e[r-2][1].slice(0,-1));if(!t)return e;for(var o=[],r=0;r<e.length;r+=1)e[r][1].length>0&&o.push(e[r]);return o}function d(e,t,n){for(var r=t+n-1;r>=0&&r>=t-1;r--)if(r+1<e.length){var o=e[r],i=e[r+1];o[0]===i[1]&&e.splice(r,2,[o[0],o[1]+i[1]])}return e}var h=-1,y=1,v=0,m=n;m.INSERT=y,m.DELETE=h,m.EQUAL=v,e.exports=m},function(e,t){function n(e){var t=[];for(var n in e)t.push(n);return t}t=e.exports="function"==typeof Object.keys?Object.keys:n,t.shim=n},function(e,t){function n(e){return"[object Arguments]"==Object.prototype.toString.call(e)}function r(e){return e&&"object"==typeof e&&"number"==typeof e.length&&Object.prototype.hasOwnProperty.call(e,"callee")&&!Object.prototype.propertyIsEnumerable.call(e,"callee")||!1}var o="[object Arguments]"==function(){return Object.prototype.toString.call(arguments)}();t=e.exports=o?n:r,t.supported=n,t.unsupported=r},function(e,t){"use strict";function n(){}function r(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function o(){this._events=new n,this._eventsCount=0}var i=Object.prototype.hasOwnProperty,a="~";Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(a=!1)),o.prototype.eventNames=function(){var e,t,n=[];if(0===this._eventsCount)return n;for(t in e=this._events)i.call(e,t)&&n.push(a?t.slice(1):t);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(e)):n},o.prototype.listeners=function(e,t){var n=a?a+e:e,r=this._events[n];if(t)return!!r;if(!r)return[];if(r.fn)return[r.fn];for(var o=0,i=r.length,u=new Array(i);o<i;o++)u[o]=r[o].fn;return u},o.prototype.emit=function(e,t,n,r,o,i){var u=a?a+e:e;if(!this._events[u])return!1;var l,s,c=this._events[u],f=arguments.length;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),f){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,n),!0;case 4:return c.fn.call(c.context,t,n,r),!0;case 5:return c.fn.call(c.context,t,n,r,o),!0;case 6:return c.fn.call(c.context,t,n,r,o,i),!0}for(s=1,l=new Array(f-1);s<f;s++)l[s-1]=arguments[s];c.fn.apply(c.context,l)}else{var p,d=c.length;for(s=0;s<d;s++)switch(c[s].once&&this.removeListener(e,c[s].fn,void 0,!0),f){case 1:c[s].fn.call(c[s].context);break;case 2:c[s].fn.call(c[s].context,t);break;case 3:c[s].fn.call(c[s].context,t,n);break;case 4:c[s].fn.call(c[s].context,t,n,r);break;default:if(!l)for(p=1,l=new Array(f-1);p<f;p++)l[p-1]=arguments[p];c[s].fn.apply(c[s].context,l)}}return!0},o.prototype.on=function(e,t,n){var o=new r(t,n||this),i=a?a+e:e;return this._events[i]?this._events[i].fn?this._events[i]=[this._events[i],o]:this._events[i].push(o):(this._events[i]=o,this._eventsCount++),this},o.prototype.once=function(e,t,n){var o=new r(t,n||this,!0),i=a?a+e:e;return this._events[i]?this._events[i].fn?this._events[i]=[this._events[i],o]:this._events[i].push(o):(this._events[i]=o,this._eventsCount++),this},o.prototype.removeListener=function(e,t,r,o){var i=a?a+e:e;if(!this._events[i])return this;if(!t)return 0==--this._eventsCount?this._events=new n:delete this._events[i],this;var u=this._events[i];if(u.fn)u.fn!==t||o&&!u.once||r&&u.context!==r||(0==--this._eventsCount?this._events=new n:delete this._events[i]);else{for(var l=0,s=[],c=u.length;l<c;l++)(u[l].fn!==t||o&&!u[l].once||r&&u[l].context!==r)&&s.push(u[l]);s.length?this._events[i]=1===s.length?s[0]:s:0==--this._eventsCount?this._events=new n:delete this._events[i]}return this},o.prototype.removeAllListeners=function(e){var t;return e?(t=a?a+e:e,this._events[t]&&(0==--this._eventsCount?this._events=new n:delete this._events[t])):(this._events=new n,this._eventsCount=0),this},o.prototype.off=o.prototype.removeListener,o.prototype.addListener=o.prototype.on,o.prototype.setMaxListeners=function(){return this},o.prefixed=a,o.EventEmitter=o,void 0!==e&&(e.exports=o)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t,n){return"object"===(void 0===t?"undefined":O(t))?Object.keys(t).reduce(function(e,n){return l(e,n,t[n])},e):e.reduce(function(e,r){return r.attributes&&r.attributes[t]?e.push(r):e.insert(r.insert,(0,C.default)({},o({},t,n),r.attributes))},new j.default)}function s(e){if(e.nodeType!==Node.ELEMENT_NODE)return{};return e["__ql-computed-style"]||(e["__ql-computed-style"]=window.getComputedStyle(e))}function c(e,t){for(var n="",r=e.ops.length-1;r>=0&&n.length<t.length;--r){var o=e.ops[r];if("string"!=typeof o.insert)break;n=o.insert+n}return n.slice(-1*t.length)===t}function f(e){return 0!==e.childNodes.length&&["block","list-item"].indexOf(s(e).display)>-1}function p(e,t,n){return e.nodeType===e.TEXT_NODE?n.reduce(function(t,n){return n(e,t)},new j.default):e.nodeType===e.ELEMENT_NODE?[].reduce.call(e.childNodes||[],function(r,o){var i=p(o,t,n);return o.nodeType===e.ELEMENT_NODE&&(i=t.reduce(function(e,t){return t(o,e)},i),i=(o[Y]||[]).reduce(function(e,t){return t(o,e)},i)),r.concat(i)},new j.default):new j.default}function d(e,t,n){return l(n,e,!0)}function h(e,t){var n=N.default.Attributor.Attribute.keys(e),r=N.default.Attributor.Class.keys(e),o=N.default.Attributor.Style.keys(e),i={};return n.concat(r).concat(o).forEach(function(t){var n=N.default.query(t,N.default.Scope.ATTRIBUTE);null!=n&&(i[n.attrName]=n.value(e),i[n.attrName])||(n=G[t],null==n||n.attrName!==t&&n.keyName!==t||(i[n.attrName]=n.value(e)||void 0),null==(n=Q[t])||n.attrName!==t&&n.keyName!==t||(n=Q[t],i[n.attrName]=n.value(e)||void 0))}),Object.keys(i).length>0&&(t=l(t,i)),t}function y(e,t){var n=N.default.query(e);if(null==n)return t;if(n.prototype instanceof N.default.Embed){var r={},o=n.value(e);null!=o&&(r[n.blotName]=o,t=(new j.default).insert(r,n.formats(e)))}else"function"==typeof n.formats&&(t=l(t,n.blotName,n.formats(e)));return t}function v(e,t){return c(t,"\n")||t.insert("\n"),t}function m(){return new j.default}function b(e,t){var n=N.default.query(e);if(null==n||"list-item"!==n.blotName||!c(t,"\n"))return t;for(var r=-1,o=e.parentNode;!o.classList.contains("ql-clipboard");)"list"===(N.default.query(o)||{}).blotName&&(r+=1),o=o.parentNode;return r<=0?t:t.compose((new j.default).retain(t.length()-1).retain(1,{indent:r}))}function g(e,t){return c(t,"\n")||(f(e)||t.length()>0&&e.nextSibling&&f(e.nextSibling))&&t.insert("\n"),t}function _(e,t){if(f(e)&&null!=e.nextElementSibling&&!c(t,"\n\n")){var n=e.offsetHeight+parseFloat(s(e).marginTop)+parseFloat(s(e).marginBottom);e.nextElementSibling.offsetTop>e.offsetTop+1.5*n&&t.insert("\n")}return t}function w(e,t){var n={},r=e.style||{};return r.fontStyle&&"italic"===s(e).fontStyle&&(n.italic=!0),r.fontWeight&&(s(e).fontWeight.startsWith("bold")||parseInt(s(e).fontWeight)>=700)&&(n.bold=!0),Object.keys(n).length>0&&(t=l(t,n)),parseFloat(r.textIndent||0)>0&&(t=(new j.default).insert("\t").concat(t)),t}function E(e,t){var n=e.data;if("O:P"===e.parentNode.tagName)return t.insert(n.trim());if(0===n.trim().length&&e.parentNode.classList.contains("ql-clipboard"))return t;if(!s(e.parentNode).whiteSpace.startsWith("pre")){var r=function(e,t){return t=t.replace(/[^\u00a0]/g,""),t.length<1&&e?" ":t};n=n.replace(/\r\n/g," ").replace(/\n/g," "),n=n.replace(/\s\s+/g,r.bind(r,!0)),(null==e.previousSibling&&f(e.parentNode)||null!=e.previousSibling&&f(e.previousSibling))&&(n=n.replace(/^\s+/,r.bind(r,!1))),(null==e.nextSibling&&f(e.parentNode)||null!=e.nextSibling&&f(e.nextSibling))&&(n=n.replace(/\s+$/,r.bind(r,!1)))}return t.insert(n)}Object.defineProperty(t,"__esModule",{value:!0}),t.matchText=t.matchSpacing=t.matchNewline=t.matchBlot=t.matchAttributor=t.default=void 0;var O="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},x=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),k=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),S=n(3),C=r(S),P=n(2),j=r(P),T=n(0),N=r(T),A=n(5),R=r(A),M=n(10),L=r(M),I=n(9),q=r(I),U=n(36),D=n(37),F=n(13),B=r(F),H=n(26),z=n(38),V=n(39),W=n(40),K=(0,L.default)("quill:clipboard"),Y="__ql-matcher",$=[[Node.TEXT_NODE,E],[Node.TEXT_NODE,g],["br",v],[Node.ELEMENT_NODE,g],[Node.ELEMENT_NODE,y],[Node.ELEMENT_NODE,_],[Node.ELEMENT_NODE,h],[Node.ELEMENT_NODE,w],["li",b],["b",d.bind(d,"bold")],["i",d.bind(d,"italic")],["style",m]],G=[U.AlignAttribute,z.DirectionAttribute].reduce(function(e,t){return e[t.keyName]=t,e},{}),Q=[U.AlignStyle,D.BackgroundStyle,H.ColorStyle,z.DirectionStyle,V.FontStyle,W.SizeStyle].reduce(function(e,t){return e[t.keyName]=t,e},{}),Z=function(e){function t(e,n){i(this,t);var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.quill.root.addEventListener("paste",r.onPaste.bind(r)),r.container=r.quill.addContainer("ql-clipboard"),r.container.setAttribute("contenteditable",!0),r.container.setAttribute("tabindex",-1),r.matchers=[],$.concat(r.options.matchers).forEach(function(e){var t=x(e,2),o=t[0],i=t[1];(n.matchVisual||i!==_)&&r.addMatcher(o,i)}),r}return u(t,e),k(t,[{key:"addMatcher",value:function(e,t){this.matchers.push([e,t])}},{key:"convert",value:function(e){if("string"==typeof e)return this.container.innerHTML=e.replace(/\>\r?\n +\</g,"><"),this.convert();var t=this.quill.getFormat(this.quill.selection.savedRange.index);if(t[B.default.blotName]){var n=this.container.innerText;return this.container.innerHTML="",(new j.default).insert(n,o({},B.default.blotName,t[B.default.blotName]))}var r=this.prepareMatching(),i=x(r,2),a=i[0],u=i[1],l=p(this.container,a,u);return c(l,"\n")&&null==l.ops[l.ops.length-1].attributes&&(l=l.compose((new j.default).retain(l.length()-1).delete(1))),K.log("convert",this.container.innerHTML,l),this.container.innerHTML="",l}},{key:"dangerouslyPasteHTML",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:R.default.sources.API;if("string"==typeof e)this.quill.setContents(this.convert(e),t),this.quill.setSelection(0,R.default.sources.SILENT);else{var r=this.convert(t);this.quill.updateContents((new j.default).retain(e).concat(r),n),this.quill.setSelection(e+r.length(),R.default.sources.SILENT)}}},{key:"onPaste",value:function(e){var t=this;if(!e.defaultPrevented&&this.quill.isEnabled()){var n=this.quill.getSelection(),r=(new j.default).retain(n.index),o=this.quill.scrollingContainer.scrollTop;this.container.focus(),this.quill.selection.update(R.default.sources.SILENT),setTimeout(function(){r=r.concat(t.convert()).delete(n.length),t.quill.updateContents(r,R.default.sources.USER),t.quill.setSelection(r.length()-n.length,R.default.sources.SILENT),t.quill.scrollingContainer.scrollTop=o,t.quill.focus()},1)}}},{key:"prepareMatching",value:function(){var e=this,t=[],n=[];return this.matchers.forEach(function(r){var o=x(r,2),i=o[0],a=o[1];switch(i){case Node.TEXT_NODE:n.push(a);break;case Node.ELEMENT_NODE:t.push(a);break;default:[].forEach.call(e.container.querySelectorAll(i),function(e){e[Y]=e[Y]||[],e[Y].push(a)})}}),[t,n]}}]),t}(q.default);Z.DEFAULTS={matchers:[],matchVisual:!0},t.default=Z,t.matchAttributor=h,t.matchBlot=y,t.matchNewline=g,t.matchSpacing=_,t.matchText=E},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(6),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"optimize",value:function(e){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"optimize",this).call(this,e),this.domNode.tagName!==this.statics.tagName[0]&&this.replaceWith(this.statics.blotName)}}],[{key:"create",value:function(){return u(t.__proto__||Object.getPrototypeOf(t),"create",this).call(this)}},{key:"formats",value:function(){return!0}}]),t}(s.default);c.blotName="bold",c.tagName=["STRONG","B"],t.default=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t,n){var r=document.createElement("button");r.setAttribute("type","button"),r.classList.add("ql-"+t),null!=n&&(r.value=n),e.appendChild(r)}function s(e,t){Array.isArray(t[0])||(t=[t]),t.forEach(function(t){var n=document.createElement("span");n.classList.add("ql-formats"),t.forEach(function(e){if("string"==typeof e)l(n,e);else{var t=Object.keys(e)[0],r=e[t];Array.isArray(r)?c(n,t,r):l(n,t,r)}}),e.appendChild(n)})}function c(e,t,n){var r=document.createElement("select");r.classList.add("ql-"+t),n.forEach(function(e){var t=document.createElement("option");!1!==e?t.setAttribute("value",e):t.setAttribute("selected","selected"),r.appendChild(t)}),e.appendChild(r)}Object.defineProperty(t,"__esModule",{value:!0}),t.addControls=t.default=void 0;var f=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(2),h=r(d),y=n(0),v=r(y),m=n(5),b=r(m),g=n(10),_=r(g),w=n(9),E=r(w),O=(0,_.default)("quill:toolbar"),x=function(e){function t(e,n){i(this,t);var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));if(Array.isArray(r.options.container)){var o=document.createElement("div");s(o,r.options.container),e.container.parentNode.insertBefore(o,e.container),r.container=o}else"string"==typeof r.options.container?r.container=document.querySelector(r.options.container):r.container=r.options.container;if(!(r.container instanceof HTMLElement)){var u;return u=O.error("Container required for toolbar",r.options),a(r,u)}return r.container.classList.add("ql-toolbar"),r.controls=[],r.handlers={},Object.keys(r.options.handlers).forEach(function(e){r.addHandler(e,r.options.handlers[e])}),[].forEach.call(r.container.querySelectorAll("button, select"),function(e){r.attach(e)}),r.quill.on(b.default.events.EDITOR_CHANGE,function(e,t){e===b.default.events.SELECTION_CHANGE&&r.update(t)}),r.quill.on(b.default.events.SCROLL_OPTIMIZE,function(){var e=r.quill.selection.getRange(),t=f(e,1),n=t[0];r.update(n)}),r}return u(t,e),p(t,[{key:"addHandler",value:function(e,t){this.handlers[e]=t}},{key:"attach",value:function(e){var t=this,n=[].find.call(e.classList,function(e){return 0===e.indexOf("ql-")});if(n){if(n=n.slice("ql-".length),"BUTTON"===e.tagName&&e.setAttribute("type","button"),null==this.handlers[n]){if(null!=this.quill.scroll.whitelist&&null==this.quill.scroll.whitelist[n])return void O.warn("ignoring attaching to disabled format",n,e);if(null==v.default.query(n))return void O.warn("ignoring attaching to nonexistent format",n,e)}var r="SELECT"===e.tagName?"change":"click";e.addEventListener(r,function(r){var i=void 0;if("SELECT"===e.tagName){if(e.selectedIndex<0)return;var a=e.options[e.selectedIndex];i=!a.hasAttribute("selected")&&(a.value||!1)}else i=!e.classList.contains("ql-active")&&(e.value||!e.hasAttribute("value")),r.preventDefault();t.quill.focus();var u=t.quill.selection.getRange(),l=f(u,1),s=l[0];if(null!=t.handlers[n])t.handlers[n].call(t,i);else if(v.default.query(n).prototype instanceof v.default.Embed){if(!(i=prompt("Enter "+n)))return;t.quill.updateContents((new h.default).retain(s.index).delete(s.length).insert(o({},n,i)),b.default.sources.USER)}else t.quill.format(n,i,b.default.sources.USER);t.update(s)}),this.controls.push([n,e])}}},{key:"update",value:function(e){var t=null==e?{}:this.quill.getFormat(e);this.controls.forEach(function(n){var r=f(n,2),o=r[0],i=r[1];if("SELECT"===i.tagName){var a=void 0;if(null==e)a=null;else if(null==t[o])a=i.querySelector("option[selected]");else if(!Array.isArray(t[o])){var u=t[o];"string"==typeof u&&(u=u.replace(/\"/g,'\\"')),a=i.querySelector('option[value="'+u+'"]')}null==a?(i.value="",i.selectedIndex=-1):a.selected=!0}else if(null==e)i.classList.remove("ql-active");else if(i.hasAttribute("value")){var l=t[o]===i.getAttribute("value")||null!=t[o]&&t[o].toString()===i.getAttribute("value")||null==t[o]&&!i.getAttribute("value");i.classList.toggle("ql-active",l)}else i.classList.toggle("ql-active",null!=t[o])})}}]),t}(E.default);x.DEFAULTS={},x.DEFAULTS={container:null,handlers:{clean:function(){var e=this,t=this.quill.getSelection();if(null!=t)if(0==t.length){var n=this.quill.getFormat();Object.keys(n).forEach(function(t){null!=v.default.query(t,v.default.Scope.INLINE)&&e.quill.format(t,!1)})}else this.quill.removeFormat(t,b.default.sources.USER)},direction:function(e){var t=this.quill.getFormat().align;"rtl"===e&&null==t?this.quill.format("align","right",b.default.sources.USER):e||"right"!==t||this.quill.format("align",!1,b.default.sources.USER),this.quill.format("direction",e,b.default.sources.USER)},indent:function(e){var t=this.quill.getSelection(),n=this.quill.getFormat(t),r=parseInt(n.indent||0);if("+1"===e||"-1"===e){var o="+1"===e?1:-1;"rtl"===n.direction&&(o*=-1),this.quill.format("indent",r+o,b.default.sources.USER)}},link:function(e){!0===e&&(e=prompt("Enter link URL:")),this.quill.format("link",e,b.default.sources.USER)},list:function(e){var t=this.quill.getSelection(),n=this.quill.getFormat(t);"check"===e?"checked"===n.list||"unchecked"===n.list?this.quill.format("list",!1,b.default.sources.USER):this.quill.format("list","unchecked",b.default.sources.USER):this.quill.format("list",e,b.default.sources.USER)}}},t.default=x,t.addControls=s},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"></polyline> <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"></polyline> <line class=ql-stroke x1=10 x2=8 y1=5 y2=13></line> </svg>'},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(28),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(e,n){r(this,t);var i=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.label.innerHTML=n,i.container.classList.add("ql-color-picker"),[].slice.call(i.container.querySelectorAll(".ql-picker-item"),0,7).forEach(function(e){e.classList.add("ql-primary")}),i}return i(t,e),a(t,[{key:"buildItem",value:function(e){var n=u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"buildItem",this).call(this,e);return n.style.backgroundColor=e.getAttribute("value")||"",n}},{key:"selectItem",value:function(e,n){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"selectItem",this).call(this,e,n);var r=this.label.querySelector(".ql-color-label"),o=e?e.getAttribute("data-value")||"":"";r&&("line"===r.tagName?r.style.stroke=o:r.style.fill=o)}}]),t}(s.default);t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(28),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(e,n){r(this,t);var i=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.container.classList.add("ql-icon-picker"),[].forEach.call(i.container.querySelectorAll(".ql-picker-item"),function(e){e.innerHTML=n[e.getAttribute("data-value")||""]}),i.defaultItem=i.container.querySelector(".ql-selected"),i.selectItem(i.defaultItem),i}return i(t,e),a(t,[{key:"selectItem",value:function(e,n){u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"selectItem",this).call(this,e,n),e=e||this.defaultItem,this.label.innerHTML=e.innerHTML}}]),t}(s.default);t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(t,n){var o=this;r(this,e),this.quill=t,this.boundsContainer=n||document.body,this.root=t.addContainer("ql-tooltip"),this.root.innerHTML=this.constructor.TEMPLATE,this.quill.root===this.quill.scrollingContainer&&this.quill.root.addEventListener("scroll",function(){o.root.style.marginTop=-1*o.quill.root.scrollTop+"px"}),this.hide()}return o(e,[{key:"hide",value:function(){this.root.classList.add("ql-hidden")}},{key:"position",value:function(e){var t=e.left+e.width/2-this.root.offsetWidth/2,n=e.bottom+this.quill.root.scrollTop;this.root.style.left=t+"px",this.root.style.top=n+"px",this.root.classList.remove("ql-flip");var r=this.boundsContainer.getBoundingClientRect(),o=this.root.getBoundingClientRect(),i=0;if(o.right>r.right&&(i=r.right-o.right,this.root.style.left=t+i+"px"),o.left<r.left&&(i=r.left-o.left,this.root.style.left=t+i+"px"),o.bottom>r.bottom){var a=o.bottom-o.top,u=e.bottom-e.top+a;this.root.style.top=n-u+"px",this.root.classList.add("ql-flip")}return i}},{key:"show",value:function(){this.root.classList.remove("ql-editing"),this.root.classList.remove("ql-hidden")}}]),e}();t.default=i},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(3),f=r(c),p=n(8),d=r(p),h=n(43),y=r(h),v=n(27),m=r(v),b=n(15),g=n(41),_=r(g),w=[[{header:["1","2","3",!1]}],["bold","italic","underline","link"],[{list:"ordered"},{list:"bullet"}],["clean"]],E=function(e){function t(e,n){o(this,t),null!=n.modules.toolbar&&null==n.modules.toolbar.container&&(n.modules.toolbar.container=w);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.quill.container.classList.add("ql-snow"),r}return a(t,e),s(t,[{key:"extendToolbar",value:function(e){e.container.classList.add("ql-snow"),this.buildButtons([].slice.call(e.container.querySelectorAll("button")),_.default),this.buildPickers([].slice.call(e.container.querySelectorAll("select")),_.default),this.tooltip=new O(this.quill,this.options.bounds),e.container.querySelector(".ql-link")&&this.quill.keyboard.addBinding({key:"K",shortKey:!0},function(t,n){e.handlers.link.call(e,!n.format.link)})}}]),t}(y.default);E.DEFAULTS=(0,f.default)(!0,{},y.default.DEFAULTS,{modules:{toolbar:{handlers:{link:function(e){if(e){var t=this.quill.getSelection();if(null==t||0==t.length)return;var n=this.quill.getText(t);/^\S+@\S+\.\S+$/.test(n)&&0!==n.indexOf("mailto:")&&(n="mailto:"+n);this.quill.theme.tooltip.edit("link",n)}else this.quill.format("link",!1)}}}}});var O=function(e){function t(e,n){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.preview=r.root.querySelector("a.ql-preview"),r}return a(t,e),s(t,[{key:"listen",value:function(){var e=this;l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"listen",this).call(this),this.root.querySelector("a.ql-action").addEventListener("click",function(t){e.root.classList.contains("ql-editing")?e.save():e.edit("link",e.preview.textContent),t.preventDefault()}),this.root.querySelector("a.ql-remove").addEventListener("click",function(t){if(null!=e.linkRange){var n=e.linkRange;e.restoreFocus(),e.quill.formatText(n,"link",!1,d.default.sources.USER),delete e.linkRange}t.preventDefault(),e.hide()}),this.quill.on(d.default.events.SELECTION_CHANGE,function(t,n,r){if(null!=t){if(0===t.length&&r===d.default.sources.USER){var o=e.quill.scroll.descendant(m.default,t.index),i=u(o,2),a=i[0],l=i[1];if(null!=a){e.linkRange=new b.Range(t.index-l,a.length());var s=m.default.formats(a.domNode);return e.preview.textContent=s,e.preview.setAttribute("href",s),e.show(),void e.position(e.quill.getBounds(e.linkRange))}}else delete e.linkRange;e.hide()}})}},{key:"show",value:function(){l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"show",this).call(this),this.root.removeAttribute("data-mode")}}]),t}(h.BaseTooltip);O.TEMPLATE=['<a class="ql-preview" target="_blank" href="about:blank"></a>','<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">','<a class="ql-action"></a>','<a class="ql-remove"></a>'].join(""),t.default=E},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(29),i=r(o),a=n(36),u=n(38),l=n(64),s=n(65),c=r(s),f=n(66),p=r(f),d=n(67),h=r(d),y=n(37),v=n(26),m=n(39),b=n(40),g=n(56),_=r(g),w=n(68),E=r(w),O=n(27),x=r(O),k=n(69),S=r(k),C=n(70),P=r(C),j=n(71),T=r(j),N=n(72),A=r(N),R=n(73),M=r(R),L=n(13),I=r(L),q=n(74),U=r(q),D=n(75),F=r(D),B=n(57),H=r(B),z=n(41),V=r(z),W=n(28),K=r(W),Y=n(59),$=r(Y),G=n(60),Q=r(G),Z=n(61),X=r(Z),J=n(108),ee=r(J),te=n(62),ne=r(te);i.default.register({"attributors/attribute/direction":u.DirectionAttribute,"attributors/class/align":a.AlignClass,"attributors/class/background":y.BackgroundClass,"attributors/class/color":v.ColorClass,"attributors/class/direction":u.DirectionClass,"attributors/class/font":m.FontClass,"attributors/class/size":b.SizeClass,"attributors/style/align":a.AlignStyle,"attributors/style/background":y.BackgroundStyle,"attributors/style/color":v.ColorStyle,"attributors/style/direction":u.DirectionStyle,"attributors/style/font":m.FontStyle,"attributors/style/size":b.SizeStyle},!0),i.default.register({"formats/align":a.AlignClass,"formats/direction":u.DirectionClass,"formats/indent":l.IndentClass,"formats/background":y.BackgroundStyle,"formats/color":v.ColorStyle,"formats/font":m.FontClass,"formats/size":b.SizeClass,"formats/blockquote":c.default,"formats/code-block":I.default,"formats/header":p.default,"formats/list":h.default,"formats/bold":_.default,"formats/code":L.Code,"formats/italic":E.default,"formats/link":x.default,"formats/script":S.default,"formats/strike":P.default,"formats/underline":T.default,"formats/image":A.default,"formats/video":M.default,"formats/list/item":d.ListItem,"modules/formula":U.default,"modules/syntax":F.default,"modules/toolbar":H.default,"themes/bubble":ee.default,"themes/snow":ne.default,"ui/icons":V.default,"ui/picker":K.default,"ui/icon-picker":Q.default,"ui/color-picker":$.default,"ui/tooltip":X.default},!0),t.default=i.default},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.IndentClass=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"add",value:function(e,n){if("+1"===n||"-1"===n){var r=this.value(e)||0;n="+1"===n?r+1:r-1}return 0===n?(this.remove(e),!0):u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"add",this).call(this,e,n)}},{key:"canAdd",value:function(e,n){return u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"canAdd",this).call(this,e,n)||u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"canAdd",this).call(this,e,parseInt(n))}},{key:"value",value:function(e){return parseInt(u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"value",this).call(this,e))||void 0}}]),t}(s.default.Attributor.Class),f=new c("indent","ql-indent",{scope:s.default.Scope.BLOCK,whitelist:[1,2,3,4,5,6,7,8]});t.IndentClass=f},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(4),u=function(e){return e&&e.__esModule?e:{default:e}}(a),l=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),t}(u.default);l.blotName="blockquote",l.tagName="blockquote",t.default=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(4),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,null,[{key:"formats",value:function(e){return this.tagName.indexOf(e.tagName)+1}}]),t}(l.default);s.blotName="header",s.tagName=["H1","H2","H3","H4","H5","H6"],t.default=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.ListItem=void 0;var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},c=n(0),f=r(c),p=n(4),d=r(p),h=n(25),y=r(h),v=function(e){function t(){return i(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,e),l(t,[{key:"format",value:function(e,n){e!==m.blotName||n?s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"format",this).call(this,e,n):this.replaceWith(f.default.create(this.statics.scope))}},{key:"remove",value:function(){null==this.prev&&null==this.next?this.parent.remove():s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"remove",this).call(this)}},{key:"replaceWith",value:function(e,n){return this.parent.isolate(this.offset(this.parent),this.length()),e===this.parent.statics.blotName?(this.parent.replaceWith(e,n),this):(this.parent.unwrap(),s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"replaceWith",this).call(this,e,n))}}],[{key:"formats",value:function(e){return e.tagName===this.tagName?void 0:s(t.__proto__||Object.getPrototypeOf(t),"formats",this).call(this,e)}}]),t}(d.default);v.blotName="list-item",v.tagName="LI";var m=function(e){function t(e){i(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),r=function(t){if(t.target.parentNode===e){var r=n.statics.formats(e),o=f.default.find(t.target);"checked"===r?o.format("list","unchecked"):"unchecked"===r&&o.format("list","checked")}};return e.addEventListener("touchstart",r),e.addEventListener("mousedown",r),n}return u(t,e),l(t,null,[{key:"create",value:function(e){var n="ordered"===e?"OL":"UL",r=s(t.__proto__||Object.getPrototypeOf(t),"create",this).call(this,n);return"checked"!==e&&"unchecked"!==e||r.setAttribute("data-checked","checked"===e),r}},{key:"formats",value:function(e){return"OL"===e.tagName?"ordered":"UL"===e.tagName?e.hasAttribute("data-checked")?"true"===e.getAttribute("data-checked")?"checked":"unchecked":"bullet":void 0}}]),l(t,[{key:"format",value:function(e,t){this.children.length>0&&this.children.tail.format(e,t)}},{key:"formats",value:function(){return o({},this.statics.blotName,this.statics.formats(this.domNode))}},{key:"insertBefore",value:function(e,n){if(e instanceof v)s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"insertBefore",this).call(this,e,n);else{var r=null==n?this.length():n.offset(this),o=this.split(r);o.parent.insertBefore(e,o)}}},{key:"optimize",value:function(e){s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"optimize",this).call(this,e);var n=this.next;null!=n&&n.prev===this&&n.statics.blotName===this.statics.blotName&&n.domNode.tagName===this.domNode.tagName&&n.domNode.getAttribute("data-checked")===this.domNode.getAttribute("data-checked")&&(n.moveChildren(this),n.remove())}},{key:"replace",value:function(e){if(e.statics.blotName!==this.statics.blotName){var n=f.default.create(this.statics.defaultChild);e.moveChildren(n),this.appendChild(n)}s(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"replace",this).call(this,e)}}]),t}(y.default);m.blotName="list",m.scope=f.default.Scope.BLOCK_BLOT,m.tagName=["OL","UL"],m.defaultChild="list-item",m.allowedChildren=[v],t.ListItem=v,t.default=m},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(56),u=function(e){return e&&e.__esModule?e:{default:e}}(a),l=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),t}(u.default);l.blotName="italic",l.tagName=["EM","I"],t.default=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(6),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,null,[{key:"create",value:function(e){return"super"===e?document.createElement("sup"):"sub"===e?document.createElement("sub"):u(t.__proto__||Object.getPrototypeOf(t),"create",this).call(this,e)}},{key:"formats",value:function(e){return"SUB"===e.tagName?"sub":"SUP"===e.tagName?"super":void 0}}]),t}(s.default);c.blotName="script",c.tagName=["SUB","SUP"],t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(6),u=function(e){return e&&e.__esModule?e:{default:e}}(a),l=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),t}(u.default);l.blotName="strike",l.tagName="S",t.default=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(6),u=function(e){return e&&e.__esModule?e:{default:e}}(a),l=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),t}(u.default);l.blotName="underline",l.tagName="U",t.default=l},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=n(27),f=["alt","height","width"],p=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"format",value:function(e,n){f.indexOf(e)>-1?n?this.domNode.setAttribute(e,n):this.domNode.removeAttribute(e):u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"format",this).call(this,e,n)}}],[{key:"create",value:function(e){var n=u(t.__proto__||Object.getPrototypeOf(t),"create",this).call(this,e);return"string"==typeof e&&n.setAttribute("src",this.sanitize(e)),n}},{key:"formats",value:function(e){return f.reduce(function(t,n){return e.hasAttribute(n)&&(t[n]=e.getAttribute(n)),t},{})}},{key:"match",value:function(e){return/\.(jpe?g|gif|png)$/.test(e)||/^data:image\/.+;base64/.test(e)}},{key:"sanitize",value:function(e){return(0,c.sanitize)(e,["http","https","data"])?e:"//:0"}},{key:"value",value:function(e){return e.getAttribute("src")}}]),t}(s.default.Embed);p.blotName="image",p.tagName="IMG",t.default=p},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=n(4),s=n(27),c=function(e){return e&&e.__esModule?e:{default:e}}(s),f=["height","width"],p=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"format",value:function(e,n){f.indexOf(e)>-1?n?this.domNode.setAttribute(e,n):this.domNode.removeAttribute(e):u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"format",this).call(this,e,n)}}],[{key:"create",value:function(e){var n=u(t.__proto__||Object.getPrototypeOf(t),"create",this).call(this,e);return n.setAttribute("frameborder","0"),n.setAttribute("allowfullscreen",!0),n.setAttribute("src",this.sanitize(e)),n}},{key:"formats",value:function(e){return f.reduce(function(t,n){return e.hasAttribute(n)&&(t[n]=e.getAttribute(n)),t},{})}},{key:"sanitize",value:function(e){return c.default.sanitize(e)}},{key:"value",value:function(e){return e.getAttribute("src")}}]),t}(l.BlockEmbed);p.blotName="video",p.className="ql-video",p.tagName="IFRAME",t.default=p},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.FormulaBlot=void 0;var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},s=n(35),c=r(s),f=n(5),p=r(f),d=n(9),h=r(d),y=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,null,[{key:"create",value:function(e){var n=l(t.__proto__||Object.getPrototypeOf(t),"create",this).call(this,e);return"string"==typeof e&&(window.katex.render(e,n,{throwOnError:!1,errorColor:"#f00"}),n.setAttribute("data-value",e)),n}},{key:"value",value:function(e){return e.getAttribute("data-value")}}]),t}(c.default);y.blotName="formula",y.className="ql-formula",y.tagName="SPAN";var v=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));if(null==window.katex)throw new Error("Formula module requires KaTeX.");return e}return a(t,e),u(t,null,[{key:"register",value:function(){p.default.register(y,!0)}}]),t}(h.default);t.FormulaBlot=y,t.default=v},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.CodeToken=t.CodeBlock=void 0;var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},s=n(0),c=r(s),f=n(5),p=r(f),d=n(9),h=r(d),y=n(13),v=r(y),m=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"replaceWith",value:function(e){this.domNode.textContent=this.domNode.textContent,this.attach(),l(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"replaceWith",this).call(this,e)}},{key:"highlight",value:function(e){var t=this.domNode.textContent;this.cachedText!==t&&((t.trim().length>0||null==this.cachedText)&&(this.domNode.innerHTML=e(t),this.domNode.normalize(),this.attach()),this.cachedText=t)}}]),t}(v.default);m.className="ql-syntax";var b=new c.default.Attributor.Class("token","hljs",{scope:c.default.Scope.INLINE}),g=function(e){function t(e,n){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));if("function"!=typeof r.options.highlight)throw new Error("Syntax module requires highlight.js. Please include the library on the page before Quill.");var a=null;return r.quill.on(p.default.events.SCROLL_OPTIMIZE,function(){clearTimeout(a),a=setTimeout(function(){r.highlight(),a=null},r.options.interval)}),r.highlight(),r}return a(t,e),u(t,null,[{key:"register",value:function(){p.default.register(b,!0),p.default.register(m,!0)}}]),u(t,[{key:"highlight",value:function(){var e=this;if(!this.quill.selection.composing){this.quill.update(p.default.sources.USER);var t=this.quill.getSelection();this.quill.scroll.descendants(m).forEach(function(t){t.highlight(e.options.highlight)}),this.quill.update(p.default.sources.SILENT),null!=t&&this.quill.setSelection(t,p.default.sources.SILENT)}}}]),t}(h.default);g.DEFAULTS={highlight:function(){return null==window.hljs?null:function(e){return window.hljs.highlightAuto(e).value}}(),interval:1e3},t.CodeBlock=m,t.CodeToken=b,t.default=g},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=13 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=9 y1=4 y2=4></line> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=14 x2=4 y1=14 y2=14></line> <line class=ql-stroke x1=12 x2=6 y1=4 y2=4></line> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=5 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=9 y1=4 y2=4></line> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=15 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=15 x2=3 y1=14 y2=14></line> <line class=ql-stroke x1=15 x2=3 y1=4 y2=4></line> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <g class="ql-fill ql-color-label"> <polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"></polygon> <rect height=1 width=1 x=4 y=4></rect> <polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"></polygon> <rect height=1 width=1 x=2 y=6></rect> <rect height=1 width=1 x=3 y=5></rect> <rect height=1 width=1 x=4 y=7></rect> <polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"></polygon> <rect height=1 width=1 x=2 y=12></rect> <rect height=1 width=1 x=2 y=9></rect> <rect height=1 width=1 x=2 y=15></rect> <polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"></polygon> <rect height=1 width=1 x=3 y=8></rect> <path d=M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z></path> <path d=M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z></path> <path d=M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z></path> <rect height=1 width=1 x=12 y=2></rect> <rect height=1 width=1 x=11 y=3></rect> <path d=M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z></path> <rect height=1 width=1 x=2 y=3></rect> <rect height=1 width=1 x=6 y=2></rect> <rect height=1 width=1 x=3 y=2></rect> <rect height=1 width=1 x=5 y=3></rect> <rect height=1 width=1 x=9 y=2></rect> <rect height=1 width=1 x=15 y=14></rect> <polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"></polygon> <rect height=1 width=1 x=13 y=7></rect> <rect height=1 width=1 x=15 y=5></rect> <rect height=1 width=1 x=14 y=6></rect> <rect height=1 width=1 x=15 y=8></rect> <rect height=1 width=1 x=14 y=9></rect> <path d=M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z></path> <rect height=1 width=1 x=14 y=3></rect> <polygon points="12 6.868 12 6 11.62 6 12 6.868"></polygon> <rect height=1 width=1 x=15 y=2></rect> <rect height=1 width=1 x=12 y=5></rect> <rect height=1 width=1 x=13 y=4></rect> <polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"></polygon> <rect height=1 width=1 x=9 y=14></rect> <rect height=1 width=1 x=8 y=15></rect> <path d=M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z></path> <rect height=1 width=1 x=5 y=15></rect> <path d=M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z></path> <rect height=1 width=1 x=11 y=15></rect> <path d=M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z></path> <rect height=1 width=1 x=14 y=15></rect> <rect height=1 width=1 x=15 y=11></rect> </g> <polyline class=ql-stroke points="5.5 13 9 5 12.5 13"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=11 y2=11></line> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <rect class="ql-fill ql-stroke" height=3 width=3 x=4 y=5></rect> <rect class="ql-fill ql-stroke" height=3 width=3 x=11 y=5></rect> <path class="ql-even ql-fill ql-stroke" d=M7,8c0,4.031-3,5-3,5></path> <path class="ql-even ql-fill ql-stroke" d=M14,8c0,4.031-3,5-3,5></path> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-stroke d=M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z></path> <path class=ql-stroke d=M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z></path> </svg>'},function(e,t){e.exports='<svg class="" viewbox="0 0 18 18"> <line class=ql-stroke x1=5 x2=13 y1=3 y2=3></line> <line class=ql-stroke x1=6 x2=9.35 y1=12 y2=3></line> <line class=ql-stroke x1=11 x2=15 y1=11 y2=15></line> <line class=ql-stroke x1=15 x2=11 y1=11 y2=15></line> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=7 x=2 y=14></rect> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class="ql-color-label ql-stroke ql-transparent" x1=3 x2=15 y1=15 y2=15></line> <polyline class=ql-stroke points="5.5 11 9 3 12.5 11"></polyline> <line class=ql-stroke x1=11.63 x2=6.38 y1=9 y2=9></line> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"></polygon> <line class="ql-stroke ql-fill" x1=15 x2=11 y1=4 y2=4></line> <path class=ql-fill d=M11,3a3,3,0,0,0,0,6h1V3H11Z></path> <rect class=ql-fill height=11 width=1 x=11 y=4></rect> <rect class=ql-fill height=11 width=1 x=13 y=4></rect> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"></polygon> <line class="ql-stroke ql-fill" x1=9 x2=5 y1=4 y2=4></line> <path class=ql-fill d=M5,3A3,3,0,0,0,5,9H6V3H5Z></path> <rect class=ql-fill height=11 width=1 x=5 y=4></rect> <rect class=ql-fill height=11 width=1 x=7 y=4></rect> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-fill d=M14,16H4a1,1,0,0,1,0-2H14A1,1,0,0,1,14,16Z /> <path class=ql-fill d=M14,4H4A1,1,0,0,1,4,2H14A1,1,0,0,1,14,4Z /> <rect class=ql-fill x=3 y=6 width=12 height=6 rx=1 ry=1 /> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-fill d=M13,16H5a1,1,0,0,1,0-2h8A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H5A1,1,0,0,1,5,2h8A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=2 y=6 width=14 height=6 rx=1 ry=1 /> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15,8H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,8Z /> <path class=ql-fill d=M15,12H13a1,1,0,0,1,0-2h2A1,1,0,0,1,15,12Z /> <path class=ql-fill d=M15,16H5a1,1,0,0,1,0-2H15A1,1,0,0,1,15,16Z /> <path class=ql-fill d=M15,4H5A1,1,0,0,1,5,2H15A1,1,0,0,1,15,4Z /> <rect class=ql-fill x=2 y=6 width=8 height=6 rx=1 ry=1 /> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-fill d=M5,8H3A1,1,0,0,1,3,6H5A1,1,0,0,1,5,8Z /> <path class=ql-fill d=M5,12H3a1,1,0,0,1,0-2H5A1,1,0,0,1,5,12Z /> <path class=ql-fill d=M13,16H3a1,1,0,0,1,0-2H13A1,1,0,0,1,13,16Z /> <path class=ql-fill d=M13,4H3A1,1,0,0,1,3,2H13A1,1,0,0,1,13,4Z /> <rect class=ql-fill x=8 y=6 width=8 height=6 rx=1 ry=1 transform="translate(24 18) rotate(-180)"/> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-fill d=M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z></path> <rect class=ql-fill height=1.6 rx=0.8 ry=0.8 width=5 x=5.15 y=6.2></rect> <path class=ql-fill d=M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z></path> </svg>'},function(e,t){e.exports='<svg viewBox="0 0 18 18"> <path class=ql-fill d=M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z /> </svg>'},function(e,t){e.exports='<svg viewBox="0 0 18 18"> <path class=ql-fill d=M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z /> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=13 y1=4 y2=4></line> <line class=ql-stroke x1=5 x2=11 y1=14 y2=14></line> <line class=ql-stroke x1=8 x2=10 y1=14 y2=4></line> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <rect class=ql-stroke height=10 width=12 x=3 y=4></rect> <circle class=ql-fill cx=6 cy=7 r=1></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"></polyline> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=3 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points="5 7 5 11 3 9 5 7"></polyline> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=11 y1=7 y2=11></line> <path class="ql-even ql-stroke" d=M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z></path> <path class="ql-even ql-stroke" d=M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z></path> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=7 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=7 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=7 x2=15 y1=14 y2=14></line> <line class="ql-stroke ql-thin" x1=2.5 x2=4.5 y1=5.5 y2=5.5></line> <path class=ql-fill d=M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z></path> <path class="ql-stroke ql-thin" d=M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156></path> <path class="ql-stroke ql-thin" d=M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109></path> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class=ql-stroke x1=6 x2=15 y1=4 y2=4></line> <line class=ql-stroke x1=6 x2=15 y1=9 y2=9></line> <line class=ql-stroke x1=6 x2=15 y1=14 y2=14></line> <line class=ql-stroke x1=3 x2=3 y1=4 y2=4></line> <line class=ql-stroke x1=3 x2=3 y1=9 y2=9></line> <line class=ql-stroke x1=3 x2=3 y1=14 y2=14></line> </svg>'},function(e,t){e.exports='<svg class="" viewbox="0 0 18 18"> <line class=ql-stroke x1=9 x2=15 y1=4 y2=4></line> <polyline class=ql-stroke points="3 4 4 5 6 3"></polyline> <line class=ql-stroke x1=9 x2=15 y1=14 y2=14></line> <polyline class=ql-stroke points="3 14 4 15 6 13"></polyline> <line class=ql-stroke x1=9 x2=15 y1=9 y2=9></line> <polyline class=ql-stroke points="3 9 4 10 6 8"></polyline> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z /> <path class=ql-fill d=M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z /> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-fill d=M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z /> <path class=ql-fill d=M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z /> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <line class="ql-stroke ql-thin" x1=15.5 x2=2.5 y1=8.5 y2=9.5></line> <path class=ql-fill d=M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z></path> <path class=ql-fill d=M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z></path> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <path class=ql-stroke d=M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3></path> <rect class=ql-fill height=1 rx=0.5 ry=0.5 width=12 x=3 y=15></rect> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <rect class=ql-stroke height=12 width=12 x=3 y=3></rect> <rect class=ql-fill height=12 width=1 x=5 y=3></rect> <rect class=ql-fill height=12 width=1 x=12 y=3></rect> <rect class=ql-fill height=2 width=8 x=5 y=8></rect> <rect class=ql-fill height=1 width=3 x=3 y=5></rect> <rect class=ql-fill height=1 width=3 x=3 y=7></rect> <rect class=ql-fill height=1 width=3 x=3 y=10></rect> <rect class=ql-fill height=1 width=3 x=3 y=12></rect> <rect class=ql-fill height=1 width=3 x=12 y=5></rect> <rect class=ql-fill height=1 width=3 x=12 y=7></rect> <rect class=ql-fill height=1 width=3 x=12 y=10></rect> <rect class=ql-fill height=1 width=3 x=12 y=12></rect> </svg>'},function(e,t){e.exports='<svg viewbox="0 0 18 18"> <polygon class=ql-stroke points="7 11 9 13 11 11 7 11"></polygon> <polygon class=ql-stroke points="7 7 9 5 11 7 7 7"></polygon> </svg>'},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.BubbleTooltip=void 0;var u=function e(t,n,r){null===t&&(t=Function.prototype);var o=Object.getOwnPropertyDescriptor(t,n);if(void 0===o){var i=Object.getPrototypeOf(t);return null===i?void 0:e(i,n,r)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(r)},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(3),c=r(s),f=n(8),p=r(f),d=n(43),h=r(d),y=n(15),v=n(41),m=r(v),b=[["bold","italic","link"],[{header:1},{header:2},"blockquote"]],g=function(e){function t(e,n){o(this,t),null!=n.modules.toolbar&&null==n.modules.toolbar.container&&(n.modules.toolbar.container=b);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.quill.container.classList.add("ql-bubble"),r}return a(t,e),l(t,[{key:"extendToolbar",value:function(e){this.tooltip=new _(this.quill,this.options.bounds),this.tooltip.root.appendChild(e.container),this.buildButtons([].slice.call(e.container.querySelectorAll("button")),m.default),this.buildPickers([].slice.call(e.container.querySelectorAll("select")),m.default)}}]),t}(h.default);g.DEFAULTS=(0,c.default)(!0,{},h.default.DEFAULTS,{modules:{toolbar:{handlers:{link:function(e){e?this.quill.theme.tooltip.edit():this.quill.format("link",!1)}}}}});var _=function(e){function t(e,n){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.quill.on(p.default.events.EDITOR_CHANGE,function(e,t,n,o){if(e===p.default.events.SELECTION_CHANGE)if(null!=t&&t.length>0&&o===p.default.sources.USER){r.show(),r.root.style.left="0px",r.root.style.width="",r.root.style.width=r.root.offsetWidth+"px";var i=r.quill.getLines(t.index,t.length);if(1===i.length)r.position(r.quill.getBounds(t));else{var a=i[i.length-1],u=r.quill.getIndex(a),l=Math.min(a.length()-1,t.index+t.length-u),s=r.quill.getBounds(new y.Range(u,l));r.position(s)}}else document.activeElement!==r.textbox&&r.quill.hasFocus()&&r.hide()}),r}return a(t,e),l(t,[{key:"listen",value:function(){var e=this;u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"listen",this).call(this),this.root.querySelector(".ql-close").addEventListener("click",function(){e.root.classList.remove("ql-editing")}),this.quill.on(p.default.events.SCROLL_OPTIMIZE,function(){setTimeout(function(){if(!e.root.classList.contains("ql-hidden")){var t=e.quill.getSelection();null!=t&&e.position(e.quill.getBounds(t))}},1)})}},{key:"cancel",value:function(){this.show()}},{key:"position",value:function(e){var n=u(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"position",this).call(this,e),r=this.root.querySelector(".ql-tooltip-arrow");if(r.style.marginLeft="",0===n)return n;r.style.marginLeft=-1*n-r.offsetWidth/2+"px"}}]),t}(d.BaseTooltip);_.TEMPLATE=['<span class="ql-tooltip-arrow"></span>','<div class="ql-tooltip-editor">','<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">','<a class="ql-close"></a>',"</div>"].join(""),t.BubbleTooltip=_,t.default=g},function(e,t,n){e.exports=n(63)}]).default})}).call(t,n(253).Buffer)},function(e,t,n){"use strict";var r=n(0),o=n(258);if(void 0===r)throw Error("create-react-class could not find the React object. If you are using script tags, make sure that React is being loaded before create-react-class.");var i=(new r.Component).updater;e.exports=o(r.Component,r.isValidElement,i)},function(e,t,n){"use strict";var r=n(99),o={createEditor:function(e,t){var n=new r(e,t);return this.hookEditor(n),n},hookEditor:function(e){var t=this.makeUnprivilegedEditor(e);this.handleTextChange=function(n,r,o){this.onEditorChangeText&&(this.onEditorChangeText(e.root.innerHTML,n,o,t),this.onEditorChangeSelection(e.getSelection(),o,t))}.bind(this),this.handleSelectionChange=function(e,n,r){this.onEditorChangeSelection&&this.onEditorChangeSelection(e,r,t)}.bind(this),e.on("text-change",this.handleTextChange),e.on("selection-change",this.handleSelectionChange)},unhookEditor:function(e){e.off("selection-change"),e.off("text-change")},setEditorReadOnly:function(e,t){t?e.disable():e.enable()},setEditorContents:function(e,t){var n=e.getSelection();"string"==typeof t?e.setContents(e.clipboard.convert(t)):e.setContents(t),n&&e.hasFocus()&&this.setEditorSelection(e,n)},setEditorSelection:function(e,t){if(t){var n=e.getLength();t.index=Math.max(0,Math.min(t.index,n-1)),t.length=Math.max(0,Math.min(t.length,n-1-t.index))}e.setSelection(t)},makeUnprivilegedEditor:function(e){var t=e;return{getLength:function(){return t.getLength.apply(t,arguments)},getText:function(){return t.getText.apply(t,arguments)},getHTML:function(){return t.root.innerHTML},getContents:function(){return t.getContents.apply(t,arguments)},getSelection:function(){return t.getSelection.apply(t,arguments)},getBounds:function(){return t.getBounds.apply(t,arguments)}}}};e.exports=o},function(e,t,n){var r=n(259),o=n(299),i=r(o);e.exports=i},function(e,t,n){function r(e,t,n,r,s,c){var f=n&u,p=e.length,d=t.length;if(p!=d&&!(f&&d>p))return!1;var h=c.get(e);if(h&&c.get(t))return h==t;var y=-1,v=!0,m=n&l?new o:void 0;for(c.set(e,t),c.set(t,e);++y<p;){var b=e[y],g=t[y];if(r)var _=f?r(g,b,y,t,e,c):r(b,g,y,e,t,c);if(void 0!==_){if(_)continue;v=!1;break}if(m){if(!i(t,function(e,t){if(!a(m,t)&&(b===e||s(b,e,n,r,c)))return m.push(t)})){v=!1;break}}else if(b!==g&&!s(b,g,n,r,c)){v=!1;break}}return c.delete(e),c.delete(t),v}var o=n(263),i=n(104),a=n(266),u=1,l=2;e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}e.exports=n},function(e,t,n){function r(e){return e===e&&!o(e)}var o=n(10);e.exports=r},function(e,t){function n(e,t){return function(n){return null!=n&&(n[e]===t&&(void 0!==t||e in Object(n)))}}e.exports=n},function(e,t,n){function r(e,t){t=o(t,e);for(var n=0,r=t.length;null!=e&&n<r;)e=e[i(t[n++])];return n&&n==r?e:void 0}var o=n(108),i=n(36);e.exports=r},function(e,t,n){function r(e,t){return o(e)?e:i(e,t)?[e]:a(u(e))}var o=n(8),i=n(62),a=n(287),u=n(290);e.exports=r},function(e,t,n){function r(e,t){return o(e,t)}var o=n(61);e.exports=r},function(e,t,n){"use strict";!function(t){e.exports=t(n(0))}(function(e){function t(t){var n=e.createElement.bind(null,t);return n.type=t,n}return{a:t("a"),abbr:t("abbr"),address:t("address"),area:t("area"),article:t("article"),aside:t("aside"),audio:t("audio"),b:t("b"),base:t("base"),bdi:t("bdi"),bdo:t("bdo"),big:t("big"),blockquote:t("blockquote"),body:t("body"),br:t("br"),button:t("button"),canvas:t("canvas"),caption:t("caption"),cite:t("cite"),code:t("code"),col:t("col"),colgroup:t("colgroup"),data:t("data"),datalist:t("datalist"),dd:t("dd"),del:t("del"),details:t("details"),dfn:t("dfn"),dialog:t("dialog"),div:t("div"),dl:t("dl"),dt:t("dt"),em:t("em"),embed:t("embed"),fieldset:t("fieldset"),figcaption:t("figcaption"),figure:t("figure"),footer:t("footer"),form:t("form"),h1:t("h1"),h2:t("h2"),h3:t("h3"),h4:t("h4"),h5:t("h5"),h6:t("h6"),head:t("head"),header:t("header"),hgroup:t("hgroup"),hr:t("hr"),html:t("html"),i:t("i"),iframe:t("iframe"),img:t("img"),input:t("input"),ins:t("ins"),kbd:t("kbd"),keygen:t("keygen"),label:t("label"),legend:t("legend"),li:t("li"),link:t("link"),main:t("main"),map:t("map"),mark:t("mark"),menu:t("menu"),menuitem:t("menuitem"),meta:t("meta"),meter:t("meter"),nav:t("nav"),noscript:t("noscript"),object:t("object"),ol:t("ol"),optgroup:t("optgroup"),option:t("option"),output:t("output"),p:t("p"),param:t("param"),picture:t("picture"),pre:t("pre"),progress:t("progress"),q:t("q"),rp:t("rp"),rt:t("rt"),ruby:t("ruby"),s:t("s"),samp:t("samp"),script:t("script"),section:t("section"),select:t("select"),small:t("small"),source:t("source"),span:t("span"),strong:t("strong"),style:t("style"),sub:t("sub"),summary:t("summary"),sup:t("sup"),table:t("table"),tbody:t("tbody"),td:t("td"),textarea:t("textarea"),tfoot:t("tfoot"),th:t("th"),thead:t("thead"),time:t("time"),title:t("title"),tr:t("tr"),track:t("track"),u:t("u"),ul:t("ul"),var:t("var"),video:t("video"),wbr:t("wbr"),circle:t("circle"),clipPath:t("clipPath"),defs:t("defs"),ellipse:t("ellipse"),g:t("g"),image:t("image"),line:t("line"),linearGradient:t("linearGradient"),mask:t("mask"),path:t("path"),pattern:t("pattern"),polygon:t("polygon"),polyline:t("polyline"),radialGradient:t("radialGradient"),rect:t("rect"),stop:t("stop"),svg:t("svg"),text:t("text"),tspan:t("tspan")}})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(321),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(11),u=n(37),l=function(e,t){var n=t.user;return{user:n,authoredStories:(0,u.selectAuthoredStories)(e,n),currentUser:e.session.currentUser}},s=function(e){return{deleteStory:function(t){return e((0,a.deleteStory)(t))},fetchUserStories:function(t){return e((0,a.fetchUserStories)(t))}}};t.default=(0,r.connect)(l,s)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=(n(4),n(322)),f=r(c),p=n(59),d=(r(p),n(325)),h=r(d),y=function(e){function t(e){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchStory(this.props.match.params.storyId)}},{key:"componentWillReceiveProps",value:function(e){this.props.currentUser!==e.currentUser&&this.props.closeModal()}},{key:"likeButton",value:function(){var e=this,t="sad",n=function(){return e.props.openModal("like-login")};if(this.props.currentUser){var r=parseInt(Object.keys(this.props.currentUser)[0]);n=function(){return e.props.createLike({user_id:r,story_id:e.props.story.id})},this.props.story.likes.includes(r)&&(t="heart",n=function(){return e.props.deleteLike({user_id:r,story_id:e.props.story.id})})}return s.default.createElement("aside",{className:"like-container"},s.default.createElement("span",{className:t,onClick:n}),s.default.createElement("p",null,this.props.story.likes.length))}},{key:"render",value:function(){if(this.props.story){var e=this.props.story,t=this.props.story.tags;return t=t.map(function(e){return s.default.createElement("li",null,e)}),s.default.createElement("div",{className:"story-show-container"},s.default.createElement(f.default,{authorId:this.props.story.author_id}),s.default.createElement("section",{className:"story-display"},s.default.createElement("h1",{className:"story-title"},e.title),s.default.createElement("h3",{className:"story-subtitle"},e.subtitle),s.default.createElement("img",{className:"story-header-img",src:e.image_url}),s.default.createElement("div",{className:"story-show-body",dangerouslySetInnerHTML:{__html:e.body}}),s.default.createElement("div",{className:"separator"}),s.default.createElement("ul",{className:"tag-list"},t),s.default.createElement("div",{className:"story-accessories"},this.likeButton(),s.default.createElement("p",{className:"story-date"},"Created on ",e.created_at),s.default.createElement("div",{className:"update-date"},s.default.createElement("div",{className:"arrow-up"}),"Updated ",e.updated_at))),s.default.createElement(h.default,{story:e}))}return s.default.createElement("div",null,"Loading...")}}]),t}(s.default.Component);t.default=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=n(0),i=r(o),a=n(65),u=r(a),l=n(122),s=r(l),c=n(213),f=r(c);document.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("root"),t=void 0;if(window.currentUser){var n={session:{currentUser:window.currentUser}};t=(0,s.default)(n),delete window.currentUser}else t=(0,s.default)();u.default.render(i.default.createElement(f.default,{store:t}),e)})},function(e,t,n){"use strict";function r(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);throw t=Error(n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."),t.name="Invariant Violation",t.framesToPop=1,t}function o(e,t,n){this.props=e,this.context=t,this.refs=b,this.updater=n||T}function i(){}function a(e,t,n){this.props=e,this.context=t,this.refs=b,this.updater=n||T}function u(e,t,n){var r=void 0,o={},i=null,a=null;if(null!=t)for(r in void 0!==t.ref&&(a=t.ref),void 0!==t.key&&(i=""+t.key),t)R.call(t,r)&&!M.hasOwnProperty(r)&&(o[r]=t[r]);var u=arguments.length-2;if(1===u)o.children=n;else if(1<u){for(var l=Array(u),s=0;s<u;s++)l[s]=arguments[s+2];o.children=l}if(e&&e.defaultProps)for(r in u=e.defaultProps)void 0===o[r]&&(o[r]=u[r]);return{$$typeof:w,type:e,key:i,ref:a,props:o,_owner:A.current}}function l(e){return"object"==typeof e&&null!==e&&e.$$typeof===w}function s(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}function c(e,t,n,r){if(I.length){var o=I.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function f(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>I.length&&I.push(e)}function p(e,t,n,o){var i=typeof e;"undefined"!==i&&"boolean"!==i||(e=null);var a=!1;if(null===e)a=!0;else switch(i){case"string":case"number":a=!0;break;case"object":switch(e.$$typeof){case w:case E:a=!0}}if(a)return n(o,e,""===t?"."+d(e,0):t),1;if(a=0,t=""===t?".":t+":",Array.isArray(e))for(var u=0;u<e.length;u++){i=e[u];var l=t+d(i,u);a+=p(i,l,n,o)}else if(null===e||void 0===e?l=null:(l=j&&e[j]||e["@@iterator"],l="function"==typeof l?l:null),"function"==typeof l)for(e=l.call(e),u=0;!(i=e.next()).done;)i=i.value,l=t+d(i,u++),a+=p(i,l,n,o);else"object"===i&&(n=""+e,r("31","[object Object]"===n?"object with keys {"+Object.keys(e).join(", ")+"}":n,""));return a}function d(e,t){return"object"==typeof e&&null!==e&&null!=e.key?s(e.key):t.toString(36)}function h(e,t){e.func.call(e.context,t,e.count++)}function y(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?v(e,r,n,g.thatReturnsArgument):null!=e&&(l(e)&&(t=o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(L,"$&/")+"/")+n,e={$$typeof:w,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}),r.push(e))}function v(e,t,n,r,o){var i="";null!=n&&(i=(""+n).replace(L,"$&/")+"/"),t=c(t,i,r,o),null==e||p(e,"",y,t),f(t)}/** @license React v16.3.0
 * react.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var m=n(23),b=n(24),g=n(25),_="function"==typeof Symbol&&Symbol.for,w=_?Symbol.for("react.element"):60103,E=_?Symbol.for("react.portal"):60106,O=_?Symbol.for("react.fragment"):60107,x=_?Symbol.for("react.strict_mode"):60108,k=_?Symbol.for("react.provider"):60109,S=_?Symbol.for("react.context"):60110,C=_?Symbol.for("react.async_mode"):60111,P=_?Symbol.for("react.forward_ref"):60112,j="function"==typeof Symbol&&Symbol.iterator,T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};o.prototype.isReactComponent={},o.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&r("85"),this.updater.enqueueSetState(this,e,t,"setState")},o.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},i.prototype=o.prototype;var N=a.prototype=new i;N.constructor=a,m(N,o.prototype),N.isPureReactComponent=!0;var A={current:null},R=Object.prototype.hasOwnProperty,M={key:!0,ref:!0,__self:!0,__source:!0},L=/\/+/g,I=[],q={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return v(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;t=c(null,null,t,n),null==e||p(e,"",h,t),f(t)},count:function(e){return null==e?0:p(e,"",g.thatReturnsNull,null)},toArray:function(e){var t=[];return v(e,t,null,g.thatReturnsArgument),t},only:function(e){return l(e)||r("143"),e}},createRef:function(){return{current:null}},Component:o,PureComponent:a,createContext:function(e,t){return void 0===t&&(t=null),e={$$typeof:S,_calculateChangedBits:t,_defaultValue:e,_currentValue:e,_changedBits:0,Provider:null,Consumer:null},e.Provider={$$typeof:k,context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:P,render:e}},Fragment:O,StrictMode:x,unstable_AsyncMode:C,createElement:u,cloneElement:function(e,t,n){var r=void 0,o=m({},e.props),i=e.key,a=e.ref,u=e._owner;if(null!=t){void 0!==t.ref&&(a=t.ref,u=A.current),void 0!==t.key&&(i=""+t.key);var l=void 0;e.type&&e.type.defaultProps&&(l=e.type.defaultProps);for(r in t)R.call(t,r)&&!M.hasOwnProperty(r)&&(o[r]=void 0===t[r]&&void 0!==l?l[r]:t[r])}if(1===(r=arguments.length-2))o.children=n;else if(1<r){l=Array(r);for(var s=0;s<r;s++)l[s]=arguments[s+2];o.children=l}return{$$typeof:w,type:e.type,key:i,ref:a,props:o,_owner:u}},createFactory:function(e){var t=u.bind(null,e);return t.type=e,t},isValidElement:l,version:"16.3.0",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:A,assign:m}},U=Object.freeze({default:q}),D=U&&q||U;e.exports=D.default?D.default:D},function(e,t,n){"use strict";function r(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);throw t=Error(n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."),t.name="Invariant Violation",t.framesToPop=1,t}function o(e,t,n,r,o,i,a,u,l){this._hasCaughtError=!1,this._caughtError=null;var s=Array.prototype.slice.call(arguments,3);try{t.apply(n,s)}catch(e){this._caughtError=e,this._hasCaughtError=!0}}function i(){if(mn._hasRethrowError){var e=mn._rethrowError;throw mn._rethrowError=null,mn._hasRethrowError=!1,e}}function a(){if(bn)for(var e in gn){var t=gn[e],n=bn.indexOf(e);if(-1<n||r("96",e),!_n[n]){t.extractEvents||r("97",e),_n[n]=t,n=t.eventTypes;for(var o in n){var i=void 0,a=n[o],l=t,s=o;wn.hasOwnProperty(s)&&r("99",s),wn[s]=a;var c=a.phasedRegistrationNames;if(c){for(i in c)c.hasOwnProperty(i)&&u(c[i],l,s);i=!0}else a.registrationName?(u(a.registrationName,l,s),i=!0):i=!1;i||r("98",o,e)}}}}function u(e,t,n){En[e]&&r("100",e),En[e]=t,On[e]=t.eventTypes[n].dependencies}function l(e){bn&&r("101"),bn=Array.prototype.slice.call(e),a()}function s(e){var t,n=!1;for(t in e)if(e.hasOwnProperty(t)){var o=e[t];gn.hasOwnProperty(t)&&gn[t]===o||(gn[t]&&r("102",t),gn[t]=o,n=!0)}n&&a()}function c(e,t,n,r){t=e.type||"unknown-event",e.currentTarget=Cn(r),mn.invokeGuardedCallbackAndCatchFirstError(t,n,void 0,e),e.currentTarget=null}function f(e,t){return null==t&&r("30"),null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function p(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}function d(e,t){if(e){var n=e._dispatchListeners,r=e._dispatchInstances;if(Array.isArray(n))for(var o=0;o<n.length&&!e.isPropagationStopped();o++)c(e,t,n[o],r[o]);else n&&c(e,t,n,r);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}function h(e){return d(e,!0)}function y(e){return d(e,!1)}function v(e,t){var n=e.stateNode;if(!n)return null;var o=kn(n);if(!o)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":(o=!o.disabled)||(e=e.type,o=!("button"===e||"input"===e||"select"===e||"textarea"===e)),e=!o;break e;default:e=!1}return e?null:(n&&"function"!=typeof n&&r("231",t,typeof n),n)}function m(e,t){null!==e&&(Pn=f(Pn,e)),e=Pn,Pn=null,e&&(t?p(e,h):p(e,y),Pn&&r("95"),mn.rethrowCaughtError())}function b(e,t,n,r){for(var o=null,i=0;i<_n.length;i++){var a=_n[i];a&&(a=a.extractEvents(e,t,n,r))&&(o=f(o,a))}m(o,!1)}function g(e){if(e[An])return e[An];for(;!e[An];){if(!e.parentNode)return null;e=e.parentNode}return e=e[An],5===e.tag||6===e.tag?e:null}function _(e){if(5===e.tag||6===e.tag)return e.stateNode;r("33")}function w(e){return e[Rn]||null}function E(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function O(e,t,n){for(var r=[];e;)r.push(e),e=E(e);for(e=r.length;0<e--;)t(r[e],"captured",n);for(e=0;e<r.length;e++)t(r[e],"bubbled",n)}function x(e,t,n){(t=v(e,n.dispatchConfig.phasedRegistrationNames[t]))&&(n._dispatchListeners=f(n._dispatchListeners,t),n._dispatchInstances=f(n._dispatchInstances,e))}function k(e){e&&e.dispatchConfig.phasedRegistrationNames&&O(e._targetInst,x,e)}function S(e){if(e&&e.dispatchConfig.phasedRegistrationNames){var t=e._targetInst;t=t?E(t):null,O(t,x,e)}}function C(e,t,n){e&&n&&n.dispatchConfig.registrationName&&(t=v(e,n.dispatchConfig.registrationName))&&(n._dispatchListeners=f(n._dispatchListeners,t),n._dispatchInstances=f(n._dispatchInstances,e))}function P(e){e&&e.dispatchConfig.registrationName&&C(e._targetInst,null,e)}function j(e){p(e,k)}function T(e,t,n,r){if(n&&r)e:{for(var o=n,i=r,a=0,u=o;u;u=E(u))a++;u=0;for(var l=i;l;l=E(l))u++;for(;0<a-u;)o=E(o),a--;for(;0<u-a;)i=E(i),u--;for(;a--;){if(o===i||o===i.alternate)break e;o=E(o),i=E(i)}o=null}else o=null;for(i=o,o=[];n&&n!==i&&(null===(a=n.alternate)||a!==i);)o.push(n),n=E(n);for(n=[];r&&r!==i&&(null===(a=r.alternate)||a!==i);)n.push(r),r=E(r);for(r=0;r<o.length;r++)C(o[r],"bubbled",e);for(e=n.length;0<e--;)C(n[e],"captured",t)}function N(){return!In&&cn.canUseDOM&&(In="textContent"in document.documentElement?"textContent":"innerText"),In}function A(){if(qn._fallbackText)return qn._fallbackText;var e,t,n=qn._startText,r=n.length,o=R(),i=o.length;for(e=0;e<r&&n[e]===o[e];e++);var a=r-e;for(t=1;t<=a&&n[r-t]===o[i-t];t++);return qn._fallbackText=o.slice(e,1<t?1-t:void 0),qn._fallbackText}function R(){return"value"in qn._root?qn._root.value:qn._root[N()]}function M(e,t,n,r){this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n,e=this.constructor.Interface;for(var o in e)e.hasOwnProperty(o)&&((t=e[o])?this[o]=t(n):"target"===o?this.target=r:this[o]=n[o]);return this.isDefaultPrevented=(null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue)?pn.thatReturnsTrue:pn.thatReturnsFalse,this.isPropagationStopped=pn.thatReturnsFalse,this}function L(e,t,n,r){if(this.eventPool.length){var o=this.eventPool.pop();return this.call(o,e,t,n,r),o}return new this(e,t,n,r)}function I(e){e instanceof this||r("223"),e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function q(e){e.eventPool=[],e.getPooled=L,e.release=I}function U(e,t){switch(e){case"topKeyUp":return-1!==Hn.indexOf(t.keyCode);case"topKeyDown":return 229!==t.keyCode;case"topKeyPress":case"topMouseDown":case"topBlur":return!0;default:return!1}}function D(e){return e=e.detail,"object"==typeof e&&"data"in e?e.data:null}function F(e,t){switch(e){case"topCompositionEnd":return D(t);case"topKeyPress":return 32!==t.which?null:(Gn=!0,Yn);case"topTextInput":return e=t.data,e===Yn&&Gn?null:e;default:return null}}function B(e,t){if(Qn)return"topCompositionEnd"===e||!zn&&U(e,t)?(e=A(),qn._root=null,qn._startText=null,qn._fallbackText=null,Qn=!1,e):null;switch(e){case"topPaste":return null;case"topKeyPress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"topCompositionEnd":return Kn?null:t.data;default:return null}}function H(e){if(e=Sn(e)){Xn&&"function"==typeof Xn.restoreControlledState||r("194");var t=kn(e.stateNode);Xn.restoreControlledState(e.stateNode,e.type,t)}}function z(e){Jn?er?er.push(e):er=[e]:Jn=e}function V(){return null!==Jn||null!==er}function W(){if(Jn){var e=Jn,t=er;if(er=Jn=null,H(e),t)for(e=0;e<t.length;e++)H(t[e])}}function K(e,t){return e(t)}function Y(e,t,n){return e(t,n)}function $(){}function G(e,t){if(rr)return e(t);rr=!0;try{return K(e,t)}finally{rr=!1,V()&&($(),W())}}function Q(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!or[e.type]:"textarea"===t}function Z(e){return e=e.target||window,e.correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function X(e,t){return!(!cn.canUseDOM||t&&!("addEventListener"in document))&&(e="on"+e,t=e in document,t||(t=document.createElement("div"),t.setAttribute(e,"return;"),t="function"==typeof t[e]),t)}function J(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function ee(e){var t=J(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&"function"==typeof n.get&&"function"==typeof n.set)return Object.defineProperty(e,t,{configurable:!0,get:function(){return n.get.call(this)},set:function(e){r=""+e,n.set.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}function te(e){e._valueTracker||(e._valueTracker=ee(e))}function ne(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=J(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}function re(e){return null===e||void 0===e?null:(e=mr&&e[mr]||e["@@iterator"],"function"==typeof e?e:null)}function oe(e){if("function"==typeof(e=e.type))return e.displayName||e.name;if("string"==typeof e)return e;switch(e){case fr:return"ReactFragment";case cr:return"ReactPortal";case lr:return"ReactCall";case sr:return"ReactReturn"}return null}function ie(e){var t="";do{e:switch(e.tag){case 0:case 1:case 2:case 5:var n=e._debugOwner,r=e._debugSource,o=oe(e),i=null;n&&(i=oe(n)),n=r,o="\n    in "+(o||"Unknown")+(n?" (at "+n.fileName.replace(/^.*[\\\/]/,"")+":"+n.lineNumber+")":i?" (created by "+i+")":"");break e;default:o=""}t+=o,e=e.return}while(e);return t}function ae(e){return!!_r.hasOwnProperty(e)||!gr.hasOwnProperty(e)&&(br.test(e)?_r[e]=!0:(gr[e]=!0,!1))}function ue(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}function le(e,t,n,r){if(null===t||void 0===t||ue(e,t,n,r))return!0;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function se(e,t,n,r,o){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t}function ce(e){return e[1].toUpperCase()}function fe(e,t,n,r){var o=wr.hasOwnProperty(t)?wr[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(le(t,n,o,r)&&(n=null),r||null===o?ae(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(o=o.type,n=3===o||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}function pe(e,t){var n=t.checked;return fn({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function de(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=be(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function he(e,t){null!=(t=t.checked)&&fe(e,"checked",t,!1)}function ye(e,t){he(e,t);var n=be(t.value);null!=n&&("number"===t.type?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n)),t.hasOwnProperty("value")?me(e,t.type,n):t.hasOwnProperty("defaultValue")&&me(e,t.type,be(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function ve(e,t){(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue"))&&(""===e.value&&(e.value=""+e._wrapperState.initialValue),e.defaultValue=""+e._wrapperState.initialValue),t=e.name,""!==t&&(e.name=""),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!e.defaultChecked,""!==t&&(e.name=t)}function me(e,t,n){"number"===t&&e.ownerDocument.activeElement===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}function be(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}function ge(e,t,n){return e=M.getPooled(Or.change,e,t,n),e.type="change",z(n),j(e),e}function _e(e){m(e,!1)}function we(e){if(ne(_(e)))return e}function Ee(e,t){if("topChange"===e)return t}function Oe(){xr&&(xr.detachEvent("onpropertychange",xe),kr=xr=null)}function xe(e){"value"===e.propertyName&&we(kr)&&(e=ge(kr,e,Z(e)),G(_e,e))}function ke(e,t,n){"topFocus"===e?(Oe(),xr=t,kr=n,xr.attachEvent("onpropertychange",xe)):"topBlur"===e&&Oe()}function Se(e){if("topSelectionChange"===e||"topKeyUp"===e||"topKeyDown"===e)return we(kr)}function Ce(e,t){if("topClick"===e)return we(t)}function Pe(e,t){if("topInput"===e||"topChange"===e)return we(t)}function je(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=jr[e])&&!!t[e]}function Te(){return je}function Ne(e){var t=e;if(e.alternate)for(;t.return;)t=t.return;else{if(0!=(2&t.effectTag))return 1;for(;t.return;)if(t=t.return,0!=(2&t.effectTag))return 1}return 3===t.tag?2:3}function Ae(e){return!!(e=e._reactInternalFiber)&&2===Ne(e)}function Re(e){2!==Ne(e)&&r("188")}function Me(e){var t=e.alternate;if(!t)return t=Ne(e),3===t&&r("188"),1===t?null:e;for(var n=e,o=t;;){var i=n.return,a=i?i.alternate:null;if(!i||!a)break;if(i.child===a.child){for(var u=i.child;u;){if(u===n)return Re(i),e;if(u===o)return Re(i),t;u=u.sibling}r("188")}if(n.return!==o.return)n=i,o=a;else{u=!1;for(var l=i.child;l;){if(l===n){u=!0,n=i,o=a;break}if(l===o){u=!0,o=i,n=a;break}l=l.sibling}if(!u){for(l=a.child;l;){if(l===n){u=!0,n=a,o=i;break}if(l===o){u=!0,o=a,n=i;break}l=l.sibling}u||r("189")}}n.alternate!==o&&r("190")}return 3!==n.tag&&r("188"),n.stateNode.current===n?e:t}function Le(e){if(!(e=Me(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}function Ie(e){if(!(e=Me(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child&&4!==t.tag)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}function qe(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}function Ue(e,t){var n=e[0].toUpperCase()+e.slice(1),r="on"+n;n="top"+n,t={phasedRegistrationNames:{bubbled:r,captured:r+"Capture"},dependencies:[n],isInteractive:t},zr[e]=t,Vr[n]=t}function De(e){var t=e.targetInst;do{if(!t){e.ancestors.push(t);break}var n;for(n=t;n.return;)n=n.return;if(!(n=3!==n.tag?null:n.stateNode.containerInfo))break;e.ancestors.push(t),t=g(n)}while(t);for(n=0;n<e.ancestors.length;n++)t=e.ancestors[n],b(e.topLevelType,t,e.nativeEvent,Z(e.nativeEvent))}function Fe(e){$r=!!e}function Be(e,t,n){if(!n)return null;e=(Kr(e)?ze:Ve).bind(null,e),n.addEventListener(t,e,!1)}function He(e,t,n){if(!n)return null;e=(Kr(e)?ze:Ve).bind(null,e),n.addEventListener(t,e,!0)}function ze(e,t){Y(Ve,e,t)}function Ve(e,t){if($r){var n=Z(t);if(n=g(n),null!==n&&"number"==typeof n.tag&&2!==Ne(n)&&(n=null),Yr.length){var r=Yr.pop();r.topLevelType=e,r.nativeEvent=t,r.targetInst=n,e=r}else e={topLevelType:e,nativeEvent:t,targetInst:n,ancestors:[]};try{G(De,e)}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,10>Yr.length&&Yr.push(e)}}}function We(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n["ms"+e]="MS"+t,n["O"+e]="o"+t.toLowerCase(),n}function Ke(e){if(Zr[e])return Zr[e];if(!Qr[e])return e;var t,n=Qr[e];for(t in n)if(n.hasOwnProperty(t)&&t in Xr)return Zr[e]=n[t];return e}function Ye(e){return Object.prototype.hasOwnProperty.call(e,ro)||(e[ro]=no++,to[e[ro]]={}),to[e[ro]]}function $e(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ge(e,t){var n=$e(e);e=0;for(var r;n;){if(3===n.nodeType){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=$e(n)}}function Qe(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&"text"===e.type||"textarea"===t||"true"===e.contentEditable)}function Ze(e,t){if(so||null==ao||ao!==dn())return null;var n=ao;return"selectionStart"in n&&Qe(n)?n={start:n.selectionStart,end:n.selectionEnd}:window.getSelection?(n=window.getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}):n=void 0,lo&&hn(lo,n)?null:(lo=n,e=M.getPooled(io.select,uo,e,t),e.type="select",e.target=ao,j(e),e)}function Xe(e,t,n,r){this.tag=e,this.key=n,this.stateNode=this.type=null,this.sibling=this.child=this.return=null,this.index=0,this.ref=null,this.pendingProps=t,this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.expirationTime=0,this.alternate=null}function Je(e,t,n){var r=e.alternate;return null===r?(r=new Xe(e.tag,t,e.key,e.mode),r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.effectTag=0,r.nextEffect=null,r.firstEffect=null,r.lastEffect=null),r.expirationTime=n,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function et(e,t,n){var o=e.type,i=e.key;e=e.props;var a=void 0;if("function"==typeof o)a=o.prototype&&o.prototype.isReactComponent?2:0;else if("string"==typeof o)a=5;else switch(o){case fr:return tt(e.children,t,n,i);case yr:a=11,t|=3;break;case pr:a=11,t|=2;break;case lr:a=7;break;case sr:a=9;break;default:if("object"==typeof o&&null!==o)switch(o.$$typeof){case dr:a=13;break;case hr:a=12;break;case vr:a=14;break;default:if("number"==typeof o.tag)return t=o,t.pendingProps=e,t.expirationTime=n,t;r("130",null==o?o:typeof o,"")}else r("130",null==o?o:typeof o,"")}return t=new Xe(a,e,i,t),t.type=o,t.expirationTime=n,t}function tt(e,t,n,r){return e=new Xe(10,e,r,t),e.expirationTime=n,e}function nt(e,t,n){return e=new Xe(6,e,null,t),e.expirationTime=n,e}function rt(e,t,n){return t=new Xe(4,null!==e.children?e.children:[],e.key,t),t.expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function ot(e){return function(t){try{return e(t)}catch(e){}}}function it(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);fo=ot(function(e){return t.onCommitFiberRoot(n,e)}),po=ot(function(e){return t.onCommitFiberUnmount(n,e)})}catch(e){}return!0}function at(e){"function"==typeof fo&&fo(e)}function ut(e){"function"==typeof po&&po(e)}function lt(e){return{baseState:e,expirationTime:0,first:null,last:null,callbackList:null,hasForceUpdate:!1,isInitialized:!1,capturedValues:null}}function st(e,t){null===e.last?e.first=e.last=t:(e.last.next=t,e.last=t),(0===e.expirationTime||e.expirationTime>t.expirationTime)&&(e.expirationTime=t.expirationTime)}function ct(e){ho=yo=null;var t=e.alternate,n=e.updateQueue;null===n&&(n=e.updateQueue=lt(null)),null!==t?null===(e=t.updateQueue)&&(e=t.updateQueue=lt(null)):e=null,ho=n,yo=e!==n?e:null}function ft(e,t){ct(e),e=ho;var n=yo;null===n?st(e,t):null===e.last||null===n.last?(st(e,t),st(n,t)):(st(e,t),n.last=t)}function pt(e,t,n,r){return e=e.partialState,"function"==typeof e?e.call(t,n,r):e}function dt(e,t,n,r,o,i){null!==e&&e.updateQueue===n&&(n=t.updateQueue={baseState:n.baseState,expirationTime:n.expirationTime,first:n.first,last:n.last,isInitialized:n.isInitialized,capturedValues:n.capturedValues,callbackList:null,hasForceUpdate:!1}),n.expirationTime=0,n.isInitialized?e=n.baseState:(e=n.baseState=t.memoizedState,n.isInitialized=!0);for(var a=!0,u=n.first,l=!1;null!==u;){var s=u.expirationTime;if(s>i){var c=n.expirationTime;(0===c||c>s)&&(n.expirationTime=s),l||(l=!0,n.baseState=e)}else l||(n.first=u.next,null===n.first&&(n.last=null)),u.isReplace?(e=pt(u,r,e,o),a=!0):(s=pt(u,r,e,o))&&(e=a?fn({},e,s):fn(e,s),a=!1),u.isForced&&(n.hasForceUpdate=!0),null!==u.callback&&(s=n.callbackList,null===s&&(s=n.callbackList=[]),s.push(u)),null!==u.capturedValue&&(s=n.capturedValues,null===s?n.capturedValues=[u.capturedValue]:s.push(u.capturedValue));u=u.next}return null!==n.callbackList?t.effectTag|=32:null!==n.first||n.hasForceUpdate||null!==n.capturedValues||(t.updateQueue=null),l||(n.baseState=e),e}function ht(e,t){var n=e.callbackList;if(null!==n)for(e.callbackList=null,e=0;e<n.length;e++){var o=n[e],i=o.callback;o.callback=null,"function"!=typeof i&&r("191",i),i.call(t)}}function yt(e,t,n,r,o){function i(e,t,n,r,o,i){if(null===t||null!==e.updateQueue&&e.updateQueue.hasForceUpdate)return!0;var a=e.stateNode;return e=e.type,"function"==typeof a.shouldComponentUpdate?a.shouldComponentUpdate(n,o,i):!e.prototype||!e.prototype.isPureReactComponent||(!hn(t,n)||!hn(r,o))}function a(e,t){t.updater=h,e.stateNode=t,t._reactInternalFiber=e}function u(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&h.enqueueReplaceState(t,t.state,null)}function l(e,t,n,r){if(e=e.type,"function"==typeof e.getDerivedStateFromProps)return e.getDerivedStateFromProps.call(null,n,r)}var s=e.cacheContext,c=e.getMaskedContext,f=e.getUnmaskedContext,p=e.isContextConsumer,d=e.hasContextChanged,h={isMounted:Ae,enqueueSetState:function(e,r,o){e=e._reactInternalFiber,o=void 0===o?null:o;var i=n(e);ft(e,{expirationTime:i,partialState:r,callback:o,isReplace:!1,isForced:!1,capturedValue:null,next:null}),t(e,i)},enqueueReplaceState:function(e,r,o){e=e._reactInternalFiber,o=void 0===o?null:o;var i=n(e);ft(e,{expirationTime:i,partialState:r,callback:o,isReplace:!0,isForced:!1,capturedValue:null,next:null}),t(e,i)},enqueueForceUpdate:function(e,r){e=e._reactInternalFiber,r=void 0===r?null:r;var o=n(e);ft(e,{expirationTime:o,partialState:null,callback:r,isReplace:!1,isForced:!0,capturedValue:null,next:null}),t(e,o)}};return{adoptClassInstance:a,callGetDerivedStateFromProps:l,constructClassInstance:function(e,t){var n=e.type,r=f(e),o=p(e),i=o?c(e,r):vn;n=new n(t,i);var u=null!==n.state&&void 0!==n.state?n.state:null;return a(e,n),e.memoizedState=u,t=l(e,n,t,u),null!==t&&void 0!==t&&(e.memoizedState=fn({},e.memoizedState,t)),o&&s(e,r,i),n},mountClassInstance:function(e,t){var n=e.type,r=e.alternate,o=e.stateNode,i=e.pendingProps,a=f(e);o.props=i,o.state=e.memoizedState,o.refs=vn,o.context=c(e,a),"function"==typeof n.getDerivedStateFromProps||"function"==typeof o.getSnapshotBeforeUpdate||"function"!=typeof o.UNSAFE_componentWillMount&&"function"!=typeof o.componentWillMount||(n=o.state,"function"==typeof o.componentWillMount&&o.componentWillMount(),"function"==typeof o.UNSAFE_componentWillMount&&o.UNSAFE_componentWillMount(),n!==o.state&&h.enqueueReplaceState(o,o.state,null),null!==(n=e.updateQueue)&&(o.state=dt(r,e,n,o,i,t))),"function"==typeof o.componentDidMount&&(e.effectTag|=4)},resumeMountClassInstance:function(e,t){var n=e.type,a=e.stateNode;a.props=e.memoizedProps,a.state=e.memoizedState;var s=e.memoizedProps,p=e.pendingProps,h=a.context,y=f(e);y=c(e,y),(n="function"==typeof n.getDerivedStateFromProps||"function"==typeof a.getSnapshotBeforeUpdate)||"function"!=typeof a.UNSAFE_componentWillReceiveProps&&"function"!=typeof a.componentWillReceiveProps||(s!==p||h!==y)&&u(e,a,p,y),h=e.memoizedState,t=null!==e.updateQueue?dt(null,e,e.updateQueue,a,p,t):h;var v=void 0;return s!==p&&(v=l(e,a,p,t)),null!==v&&void 0!==v&&(t=null===t||void 0===t?v:fn({},t,v)),s!==p||h!==t||d()||null!==e.updateQueue&&e.updateQueue.hasForceUpdate?((s=i(e,s,p,h,t,y))?(n||"function"!=typeof a.UNSAFE_componentWillMount&&"function"!=typeof a.componentWillMount||("function"==typeof a.componentWillMount&&a.componentWillMount(),"function"==typeof a.UNSAFE_componentWillMount&&a.UNSAFE_componentWillMount()),"function"==typeof a.componentDidMount&&(e.effectTag|=4)):("function"==typeof a.componentDidMount&&(e.effectTag|=4),r(e,p),o(e,t)),a.props=p,a.state=t,a.context=y,s):("function"==typeof a.componentDidMount&&(e.effectTag|=4),!1)},updateClassInstance:function(e,t,n){var a=t.type,s=t.stateNode;s.props=t.memoizedProps,s.state=t.memoizedState;var p=t.memoizedProps,h=t.pendingProps,y=s.context,v=f(t);v=c(t,v),(a="function"==typeof a.getDerivedStateFromProps||"function"==typeof s.getSnapshotBeforeUpdate)||"function"!=typeof s.UNSAFE_componentWillReceiveProps&&"function"!=typeof s.componentWillReceiveProps||(p!==h||y!==v)&&u(t,s,h,v),y=t.memoizedState,n=null!==t.updateQueue?dt(e,t,t.updateQueue,s,h,n):y;var m=void 0;return p!==h&&(m=l(t,s,h,n)),null!==m&&void 0!==m&&(n=null===n||void 0===n?m:fn({},n,m)),p!==h||y!==n||d()||null!==t.updateQueue&&t.updateQueue.hasForceUpdate?((m=i(t,p,h,y,n,v))?(a||"function"!=typeof s.UNSAFE_componentWillUpdate&&"function"!=typeof s.componentWillUpdate||("function"==typeof s.componentWillUpdate&&s.componentWillUpdate(h,n,v),"function"==typeof s.UNSAFE_componentWillUpdate&&s.UNSAFE_componentWillUpdate(h,n,v)),"function"==typeof s.componentDidUpdate&&(t.effectTag|=4),"function"==typeof s.getSnapshotBeforeUpdate&&(t.effectTag|=2048)):("function"!=typeof s.componentDidUpdate||p===e.memoizedProps&&y===e.memoizedState||(t.effectTag|=4),"function"!=typeof s.getSnapshotBeforeUpdate||p===e.memoizedProps&&y===e.memoizedState||(t.effectTag|=2048),r(t,h),o(t,n)),s.props=h,s.state=n,s.context=v,m):("function"!=typeof s.componentDidUpdate||p===e.memoizedProps&&y===e.memoizedState||(t.effectTag|=4),"function"!=typeof s.getSnapshotBeforeUpdate||p===e.memoizedProps&&y===e.memoizedState||(t.effectTag|=2048),!1)}}}function vt(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){n=n._owner;var o=void 0;n&&(2!==n.tag&&r("110"),o=n.stateNode),o||r("147",e);var i=""+e;return null!==t&&null!==t.ref&&t.ref._stringRef===i?t.ref:(t=function(e){var t=o.refs===vn?o.refs={}:o.refs;null===e?delete t[i]:t[i]=e},t._stringRef=i,t)}"string"!=typeof e&&r("148"),n._owner||r("254",e)}return e}function mt(e,t){"textarea"!==e.type&&r("31","[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,"")}function bt(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function o(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function i(e,t,n){return e=Je(e,t,n),e.index=0,e.sibling=null,e}function a(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index,r<n?(t.effectTag=2,n):r):(t.effectTag=2,n):n}function u(t){return e&&null===t.alternate&&(t.effectTag=2),t}function l(e,t,n,r){return null===t||6!==t.tag?(t=nt(n,e.mode,r),t.return=e,t):(t=i(t,n,r),t.return=e,t)}function s(e,t,n,r){return null!==t&&t.type===n.type?(r=i(t,n.props,r),r.ref=vt(e,t,n),r.return=e,r):(r=et(n,e.mode,r),r.ref=vt(e,t,n),r.return=e,r)}function c(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=rt(n,e.mode,r),t.return=e,t):(t=i(t,n.children||[],r),t.return=e,t)}function f(e,t,n,r,o){return null===t||10!==t.tag?(t=tt(n,e.mode,r,o),t.return=e,t):(t=i(t,n,r),t.return=e,t)}function p(e,t,n){if("string"==typeof t||"number"==typeof t)return t=nt(""+t,e.mode,n),t.return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case ur:return n=et(t,e.mode,n),n.ref=vt(e,null,t),n.return=e,n;case cr:return t=rt(t,e.mode,n),t.return=e,t}if(vo(t)||re(t))return t=tt(t,e.mode,n,null),t.return=e,t;mt(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:l(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case ur:return n.key===o?n.type===fr?f(e,t,n.props.children,r,o):s(e,t,n,r):null;case cr:return n.key===o?c(e,t,n,r):null}if(vo(n)||re(n))return null!==o?null:f(e,t,n,r,null);mt(e,n)}return null}function h(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return e=e.get(n)||null,l(t,e,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case ur:return e=e.get(null===r.key?n:r.key)||null,r.type===fr?f(t,e,r.props.children,o,r.key):s(t,e,r,o);case cr:return e=e.get(null===r.key?n:r.key)||null,c(t,e,r,o)}if(vo(r)||re(r))return e=e.get(n)||null,f(t,e,r,o,null);mt(t,r)}return null}function y(r,i,u,l){for(var s=null,c=null,f=i,y=i=0,v=null;null!==f&&y<u.length;y++){f.index>y?(v=f,f=null):v=f.sibling;var m=d(r,f,u[y],l);if(null===m){null===f&&(f=v);break}e&&f&&null===m.alternate&&t(r,f),i=a(m,i,y),null===c?s=m:c.sibling=m,c=m,f=v}if(y===u.length)return n(r,f),s;if(null===f){for(;y<u.length;y++)(f=p(r,u[y],l))&&(i=a(f,i,y),null===c?s=f:c.sibling=f,c=f);return s}for(f=o(r,f);y<u.length;y++)(v=h(f,r,y,u[y],l))&&(e&&null!==v.alternate&&f.delete(null===v.key?y:v.key),i=a(v,i,y),null===c?s=v:c.sibling=v,c=v);return e&&f.forEach(function(e){return t(r,e)}),s}function v(i,u,l,s){var c=re(l);"function"!=typeof c&&r("150"),null==(l=c.call(l))&&r("151");for(var f=c=null,y=u,v=u=0,m=null,b=l.next();null!==y&&!b.done;v++,b=l.next()){y.index>v?(m=y,y=null):m=y.sibling;var g=d(i,y,b.value,s);if(null===g){y||(y=m);break}e&&y&&null===g.alternate&&t(i,y),u=a(g,u,v),null===f?c=g:f.sibling=g,f=g,y=m}if(b.done)return n(i,y),c;if(null===y){for(;!b.done;v++,b=l.next())null!==(b=p(i,b.value,s))&&(u=a(b,u,v),null===f?c=b:f.sibling=b,f=b);return c}for(y=o(i,y);!b.done;v++,b=l.next())null!==(b=h(y,i,v,b.value,s))&&(e&&null!==b.alternate&&y.delete(null===b.key?v:b.key),u=a(b,u,v),null===f?c=b:f.sibling=b,f=b);return e&&y.forEach(function(e){return t(i,e)}),c}return function(e,o,a,l){"object"==typeof a&&null!==a&&a.type===fr&&null===a.key&&(a=a.props.children);var s="object"==typeof a&&null!==a;if(s)switch(a.$$typeof){case ur:e:{var c=a.key;for(s=o;null!==s;){if(s.key===c){if(10===s.tag?a.type===fr:s.type===a.type){n(e,s.sibling),o=i(s,a.type===fr?a.props.children:a.props,l),o.ref=vt(e,s,a),o.return=e,e=o;break e}n(e,s);break}t(e,s),s=s.sibling}a.type===fr?(o=tt(a.props.children,e.mode,l,a.key),o.return=e,e=o):(l=et(a,e.mode,l),l.ref=vt(e,o,a),l.return=e,e=l)}return u(e);case cr:e:{for(s=a.key;null!==o;){if(o.key===s){if(4===o.tag&&o.stateNode.containerInfo===a.containerInfo&&o.stateNode.implementation===a.implementation){n(e,o.sibling),o=i(o,a.children||[],l),o.return=e,e=o;break e}n(e,o);break}t(e,o),o=o.sibling}o=rt(a,e.mode,l),o.return=e,e=o}return u(e)}if("string"==typeof a||"number"==typeof a)return a=""+a,null!==o&&6===o.tag?(n(e,o.sibling),o=i(o,a,l)):(n(e,o),o=nt(a,e.mode,l)),o.return=e,e=o,u(e);if(vo(a))return y(e,o,a,l);if(re(a))return v(e,o,a,l);if(s&&mt(e,a),void 0===a)switch(e.tag){case 2:case 1:l=e.type,r("152",l.displayName||l.name||"Component")}return n(e,o)}}function gt(e,t,n,o,i,a,u){function l(e,t,n){s(e,t,n,t.expirationTime)}function s(e,t,n,r){t.child=null===e?bo(t,null,n,r):mo(t,e.child,n,r)}function c(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function f(e,t,n,r,o,i){if(c(e,t),!n&&!o)return r&&S(t,!1),y(e,t);n=t.stateNode,ir.current=t;var a=o?null:n.render();return t.effectTag|=1,o&&(s(e,t,null,i),t.child=null),s(e,t,a,i),t.memoizedState=n.state,t.memoizedProps=n.props,r&&S(t,!0),t.child}function p(e){var t=e.stateNode;t.pendingContext?k(e,t.pendingContext,t.pendingContext!==t.context):t.context&&k(e,t.context,!1),g(e,t.containerInfo)}function d(e,t,n,r){var o=e.child;for(null!==o&&(o.return=e);null!==o;){switch(o.tag){case 12:var i=0|o.stateNode;if(o.type===t&&0!=(i&n)){for(i=o;null!==i;){var a=i.alternate;if(0===i.expirationTime||i.expirationTime>r)i.expirationTime=r,null!==a&&(0===a.expirationTime||a.expirationTime>r)&&(a.expirationTime=r);else{if(null===a||!(0===a.expirationTime||a.expirationTime>r))break;a.expirationTime=r}i=i.return}i=null}else i=o.child;break;case 13:i=o.type===e.type?null:o.child;break;default:i=o.child}if(null!==i)i.return=o;else for(i=o;null!==i;){if(i===e){i=null;break}if(null!==(o=i.sibling)){i=o;break}i=i.return}o=i}}function h(e,t,n){var r=t.type.context,o=t.pendingProps,i=t.memoizedProps;if(!O()&&i===o)return t.stateNode=0,_(t),y(e,t);var a=o.value;if(t.memoizedProps=o,null===i)a=1073741823;else if(i.value===o.value){if(i.children===o.children)return t.stateNode=0,_(t),y(e,t);a=0}else{var u=i.value;if(u===a&&(0!==u||1/u==1/a)||u!==u&&a!==a){if(i.children===o.children)return t.stateNode=0,_(t),y(e,t);a=0}else if(a="function"==typeof r._calculateChangedBits?r._calculateChangedBits(u,a):1073741823,0===(a|=0)){if(i.children===o.children)return t.stateNode=0,_(t),y(e,t)}else d(t,r,a,n)}return t.stateNode=a,_(t),l(e,t,o.children),t.child}function y(e,t){if(null!==e&&t.child!==e.child&&r("153"),null!==t.child){e=t.child;var n=Je(e,e.pendingProps,e.expirationTime);for(t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,n=n.sibling=Je(e,e.pendingProps,e.expirationTime),n.return=t;n.sibling=null}return t.child}var v=e.shouldSetTextContent,m=e.shouldDeprioritizeSubtree,b=t.pushHostContext,g=t.pushHostContainer,_=o.pushProvider,w=n.getMaskedContext,E=n.getUnmaskedContext,O=n.hasContextChanged,x=n.pushContextProvider,k=n.pushTopLevelContextObject,S=n.invalidateContextProvider,C=i.enterHydrationState,P=i.resetHydrationState,j=i.tryToClaimNextHydratableInstance;e=yt(n,a,u,function(e,t){e.memoizedProps=t},function(e,t){e.memoizedState=t});var T=e.adoptClassInstance,N=e.callGetDerivedStateFromProps,A=e.constructClassInstance,R=e.mountClassInstance,M=e.resumeMountClassInstance,L=e.updateClassInstance;return{beginWork:function(e,t,n){if(0===t.expirationTime||t.expirationTime>n){switch(t.tag){case 3:p(t);break;case 2:x(t);break;case 4:g(t,t.stateNode.containerInfo);break;case 13:_(t)}return null}switch(t.tag){case 0:null!==e&&r("155");var o=t.type,i=t.pendingProps,a=E(t);return a=w(t,a),o=o(i,a),t.effectTag|=1,"object"==typeof o&&null!==o&&"function"==typeof o.render&&void 0===o.$$typeof?(a=t.type,t.tag=2,t.memoizedState=null!==o.state&&void 0!==o.state?o.state:null,"function"==typeof a.getDerivedStateFromProps&&null!==(i=N(t,o,i,t.memoizedState))&&void 0!==i&&(t.memoizedState=fn({},t.memoizedState,i)),i=x(t),T(t,o),R(t,n),e=f(e,t,!0,i,!1,n)):(t.tag=1,l(e,t,o),t.memoizedProps=i,e=t.child),e;case 1:return i=t.type,n=t.pendingProps,O()||t.memoizedProps!==n?(o=E(t),o=w(t,o),i=i(n,o),t.effectTag|=1,l(e,t,i),t.memoizedProps=n,e=t.child):e=y(e,t),e;case 2:i=x(t),null===e?null===t.stateNode?(A(t,t.pendingProps),R(t,n),o=!0):o=M(t,n):o=L(e,t,n),a=!1;var u=t.updateQueue;return null!==u&&null!==u.capturedValues&&(a=o=!0),f(e,t,o,i,a,n);case 3:e:if(p(t),null!==(o=t.updateQueue)){if(a=t.memoizedState,i=dt(e,t,o,null,null,n),t.memoizedState=i,null!==(o=t.updateQueue)&&null!==o.capturedValues)o=null;else{if(a===i){P(),e=y(e,t);break e}o=i.element}a=t.stateNode,(null===e||null===e.child)&&a.hydrate&&C(t)?(t.effectTag|=2,t.child=bo(t,null,o,n)):(P(),l(e,t,o)),t.memoizedState=i,e=t.child}else P(),e=y(e,t);return e;case 5:return b(t),null===e&&j(t),i=t.type,u=t.memoizedProps,o=t.pendingProps,a=null!==e?e.memoizedProps:null,O()||u!==o||((u=1&t.mode&&m(i,o))&&(t.expirationTime=1073741823),u&&1073741823===n)?(u=o.children,v(i,o)?u=null:a&&v(i,a)&&(t.effectTag|=16),c(e,t),1073741823!==n&&1&t.mode&&m(i,o)?(t.expirationTime=1073741823,t.memoizedProps=o,e=null):(l(e,t,u),t.memoizedProps=o,e=t.child)):e=y(e,t),e;case 6:return null===e&&j(t),t.memoizedProps=t.pendingProps,null;case 8:t.tag=7;case 7:return i=t.pendingProps,O()||t.memoizedProps!==i||(i=t.memoizedProps),o=i.children,t.stateNode=null===e?bo(t,t.stateNode,o,n):mo(t,e.stateNode,o,n),t.memoizedProps=i,t.stateNode;case 9:return null;case 4:return g(t,t.stateNode.containerInfo),i=t.pendingProps,O()||t.memoizedProps!==i?(null===e?t.child=mo(t,null,i,n):l(e,t,i),t.memoizedProps=i,e=t.child):e=y(e,t),e;case 14:return n=t.type.render,n=n(t.pendingProps,t.ref),l(e,t,n),t.memoizedProps=n,t.child;case 10:return n=t.pendingProps,O()||t.memoizedProps!==n?(l(e,t,n),t.memoizedProps=n,e=t.child):e=y(e,t),e;case 11:return n=t.pendingProps.children,O()||null!==n&&t.memoizedProps!==n?(l(e,t,n),t.memoizedProps=n,e=t.child):e=y(e,t),e;case 13:return h(e,t,n);case 12:o=t.type,a=t.pendingProps;var s=t.memoizedProps;return i=o._currentValue,u=o._changedBits,O()||0!==u||s!==a?(t.memoizedProps=a,s=a.unstable_observedBits,void 0!==s&&null!==s||(s=1073741823),t.stateNode=s,0!=(u&s)&&d(t,o,u,n),n=a.children,n=n(i),l(e,t,n),e=t.child):e=y(e,t),e;default:r("156")}}}}function _t(e,t,n,o,i){function a(e){e.effectTag|=4}var u=e.createInstance,l=e.createTextInstance,s=e.appendInitialChild,c=e.finalizeInitialChildren,f=e.prepareUpdate,p=e.persistence,d=t.getRootHostContainer,h=t.popHostContext,y=t.getHostContext,v=t.popHostContainer,m=n.popContextProvider,b=n.popTopLevelContextObject,g=o.popProvider,_=i.prepareToHydrateHostInstance,w=i.prepareToHydrateHostTextInstance,E=i.popHydrationState,O=void 0,x=void 0,k=void 0;return e.mutation?(O=function(){},x=function(e,t,n){(t.updateQueue=n)&&a(t)},k=function(e,t,n,r){n!==r&&a(t)}):r(p?"235":"236"),{completeWork:function(e,t,n){var o=t.pendingProps;switch(t.tag){case 1:return null;case 2:return m(t),e=t.stateNode,o=t.updateQueue,null!==o&&null!==o.capturedValues&&(t.effectTag&=-65,"function"==typeof e.componentDidCatch?t.effectTag|=256:o.capturedValues=null),null;case 3:return v(t),b(t),o=t.stateNode,o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),null!==e&&null!==e.child||(E(t),t.effectTag&=-3),O(t),e=t.updateQueue,null!==e&&null!==e.capturedValues&&(t.effectTag|=256),null;case 5:h(t),n=d();var i=t.type;if(null!==e&&null!=t.stateNode){var p=e.memoizedProps,S=t.stateNode,C=y();S=f(S,i,p,o,n,C),x(e,t,S,i,p,o,n,C),e.ref!==t.ref&&(t.effectTag|=128)}else{if(!o)return null===t.stateNode&&r("166"),null;if(e=y(),E(t))_(t,n,e)&&a(t);else{p=u(i,o,n,e,t);e:for(C=t.child;null!==C;){if(5===C.tag||6===C.tag)s(p,C.stateNode);else if(4!==C.tag&&null!==C.child){C.child.return=C,C=C.child;continue}if(C===t)break;for(;null===C.sibling;){if(null===C.return||C.return===t)break e;C=C.return}C.sibling.return=C.return,C=C.sibling}c(p,i,o,n,e)&&a(t),t.stateNode=p}null!==t.ref&&(t.effectTag|=128)}return null;case 6:if(e&&null!=t.stateNode)k(e,t,e.memoizedProps,o);else{if("string"!=typeof o)return null===t.stateNode&&r("166"),null;e=d(),n=y(),E(t)?w(t)&&a(t):t.stateNode=l(o,e,n,t)}return null;case 7:(o=t.memoizedProps)||r("165"),t.tag=8,i=[];e:for((p=t.stateNode)&&(p.return=t);null!==p;){if(5===p.tag||6===p.tag||4===p.tag)r("247");else if(9===p.tag)i.push(p.pendingProps.value);else if(null!==p.child){p.child.return=p,p=p.child;continue}for(;null===p.sibling;){if(null===p.return||p.return===t)break e;p=p.return}p.sibling.return=p.return,p=p.sibling}return p=o.handler,o=p(o.props,i),t.child=mo(t,null!==e?e.child:null,o,n),t.child;case 8:return t.tag=7,null;case 9:case 14:case 10:case 11:return null;case 4:return v(t),O(t),null;case 13:return g(t),null;case 12:return null;case 0:r("167");default:r("156")}}}}function wt(e,t,n,r,o){var i=e.popHostContainer,a=e.popHostContext,u=t.popContextProvider,l=t.popTopLevelContextObject,s=n.popProvider;return{throwException:function(e,t,n){t.effectTag|=512,t.firstEffect=t.lastEffect=null,t={value:n,source:t,stack:ie(t)};do{switch(e.tag){case 3:return ct(e),e.updateQueue.capturedValues=[t],void(e.effectTag|=1024);case 2:if(n=e.stateNode,0==(64&e.effectTag)&&null!==n&&"function"==typeof n.componentDidCatch&&!o(n)){ct(e),n=e.updateQueue;var r=n.capturedValues;return null===r?n.capturedValues=[t]:r.push(t),void(e.effectTag|=1024)}}e=e.return}while(null!==e)},unwindWork:function(e){switch(e.tag){case 2:u(e);var t=e.effectTag;return 1024&t?(e.effectTag=-1025&t|64,e):null;case 3:return i(e),l(e),t=e.effectTag,1024&t?(e.effectTag=-1025&t|64,e):null;case 5:return a(e),null;case 4:return i(e),null;case 13:return s(e),null;default:return null}},unwindInterruptedWork:function(e){switch(e.tag){case 2:u(e);break;case 3:i(e),l(e);break;case 5:a(e);break;case 4:i(e);break;case 13:s(e)}}}}function Et(e,t){var n=t.source;null===t.stack&&ie(n),null!==n&&oe(n),t=t.value,null!==e&&2===e.tag&&oe(e);try{t&&t.suppressReactErrorLogging||console.error(t)}catch(e){e&&e.suppressReactErrorLogging||console.error(e)}}function Ot(e,t,n,o,i){function a(e){var n=e.ref;if(null!==n)if("function"==typeof n)try{n(null)}catch(n){t(e,n)}else n.current=null}function u(e){switch("function"==typeof ut&&ut(e),e.tag){case 2:a(e);var n=e.stateNode;if("function"==typeof n.componentWillUnmount)try{n.props=e.memoizedProps,n.state=e.memoizedState,n.componentWillUnmount()}catch(n){t(e,n)}break;case 5:a(e);break;case 7:l(e.stateNode);break;case 4:p&&c(e)}}function l(e){for(var t=e;;)if(u(t),null===t.child||p&&4===t.tag){if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}else t.child.return=t,t=t.child}function s(e){return 5===e.tag||3===e.tag||4===e.tag}function c(e){for(var t=e,n=!1,o=void 0,i=void 0;;){if(!n){n=t.return;e:for(;;){switch(null===n&&r("160"),n.tag){case 5:o=n.stateNode,i=!1;break e;case 3:case 4:o=n.stateNode.containerInfo,i=!0;break e}n=n.return}n=!0}if(5===t.tag||6===t.tag)l(t),i?E(o,t.stateNode):w(o,t.stateNode);else if(4===t.tag?o=t.stateNode.containerInfo:u(t),null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;t=t.return,4===t.tag&&(n=!1)}t.sibling.return=t.return,t=t.sibling}}var f=e.getPublicInstance,p=e.mutation;e=e.persistence,p||r(e?"235":"236");var d=p.commitMount,h=p.commitUpdate,y=p.resetTextContent,v=p.commitTextUpdate,m=p.appendChild,b=p.appendChildToContainer,g=p.insertBefore,_=p.insertInContainerBefore,w=p.removeChild,E=p.removeChildFromContainer;return{commitBeforeMutationLifeCycles:function(e,t){switch(t.tag){case 2:if(2048&t.effectTag&&null!==e){var n=e.memoizedProps,o=e.memoizedState;e=t.stateNode,e.props=t.memoizedProps,e.state=t.memoizedState,t=e.getSnapshotBeforeUpdate(n,o),e.__reactInternalSnapshotBeforeUpdate=t}break;case 3:case 5:case 6:case 4:break;default:r("163")}},commitResetTextContent:function(e){y(e.stateNode)},commitPlacement:function(e){e:{for(var t=e.return;null!==t;){if(s(t)){var n=t;break e}t=t.return}r("160"),n=void 0}var o=t=void 0;switch(n.tag){case 5:t=n.stateNode,o=!1;break;case 3:case 4:t=n.stateNode.containerInfo,o=!0;break;default:r("161")}16&n.effectTag&&(y(t),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||s(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag;){if(2&n.effectTag)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.effectTag)){n=n.stateNode;break e}}for(var i=e;;){if(5===i.tag||6===i.tag)n?o?_(t,i.stateNode,n):g(t,i.stateNode,n):o?b(t,i.stateNode):m(t,i.stateNode);else if(4!==i.tag&&null!==i.child){i.child.return=i,i=i.child;continue}if(i===e)break;for(;null===i.sibling;){if(null===i.return||i.return===e)return;i=i.return}i.sibling.return=i.return,i=i.sibling}},commitDeletion:function(e){c(e),e.return=null,e.child=null,e.alternate&&(e.alternate.child=null,e.alternate.return=null)},commitWork:function(e,t){switch(t.tag){case 2:break;case 5:var n=t.stateNode;if(null!=n){var o=t.memoizedProps;e=null!==e?e.memoizedProps:o;var i=t.type,a=t.updateQueue;t.updateQueue=null,null!==a&&h(n,a,i,e,o,t)}break;case 6:null===t.stateNode&&r("162"),n=t.memoizedProps,v(t.stateNode,null!==e?e.memoizedProps:n,n);break;case 3:break;default:r("163")}},commitLifeCycles:function(e,t,n){switch(n.tag){case 2:if(e=n.stateNode,4&n.effectTag)if(null===t)e.props=n.memoizedProps,e.state=n.memoizedState,e.componentDidMount();else{var o=t.memoizedProps;t=t.memoizedState,e.props=n.memoizedProps,e.state=n.memoizedState,e.componentDidUpdate(o,t,e.__reactInternalSnapshotBeforeUpdate)}n=n.updateQueue,null!==n&&ht(n,e);break;case 3:if(null!==(t=n.updateQueue)){if(e=null,null!==n.child)switch(n.child.tag){case 5:e=f(n.child.stateNode);break;case 2:e=n.child.stateNode}ht(t,e)}break;case 5:e=n.stateNode,null===t&&4&n.effectTag&&d(e,n.type,n.memoizedProps,n);break;case 6:case 4:break;default:r("163")}},commitErrorLogging:function(e,t){switch(e.tag){case 2:var n=e.type;t=e.stateNode;var o=e.updateQueue;(null===o||null===o.capturedValues)&&r("264");var a=o.capturedValues;for(o.capturedValues=null,"function"!=typeof n.getDerivedStateFromCatch&&i(t),t.props=e.memoizedProps,t.state=e.memoizedState,n=0;n<a.length;n++){o=a[n];var u=o.value,l=o.stack;Et(e,o),t.componentDidCatch(u,{componentStack:null!==l?l:""})}break;case 3:for(n=e.updateQueue,(null===n||null===n.capturedValues)&&r("264"),a=n.capturedValues,n.capturedValues=null,n=0;n<a.length;n++)o=a[n],Et(e,o),t(o.value);break;default:r("265")}},commitAttachRef:function(e){var t=e.ref;if(null!==t){var n=e.stateNode;switch(e.tag){case 5:e=f(n);break;default:e=n}"function"==typeof t?t(e):t.current=e}},commitDetachRef:function(e){null!==(e=e.ref)&&("function"==typeof e?e(null):e.current=null)}}}function xt(e,t){function n(e){return e===go&&r("174"),e}var o=e.getChildHostContext,i=e.getRootHostContext;e=t.createCursor;var a=t.push,u=t.pop,l=e(go),s=e(go),c=e(go);return{getHostContext:function(){return n(l.current)},getRootHostContainer:function(){return n(c.current)},popHostContainer:function(e){u(l,e),u(s,e),u(c,e)},popHostContext:function(e){s.current===e&&(u(l,e),u(s,e))},pushHostContainer:function(e,t){a(c,t,e),t=i(t),a(s,e,e),a(l,t,e)},pushHostContext:function(e){var t=n(c.current),r=n(l.current);t=o(r,e.type,t),r!==t&&(a(s,e,e),a(l,t,e))}}}function kt(e){function t(e,t){var n=new Xe(5,null,null,0);n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function n(e,t){switch(e.tag){case 5:return null!==(t=a(t,e.type,e.pendingProps))&&(e.stateNode=t,!0);case 6:return null!==(t=u(t,e.pendingProps))&&(e.stateNode=t,!0);default:return!1}}function o(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag;)e=e.return;p=e}var i=e.shouldSetTextContent;if(!(e=e.hydration))return{enterHydrationState:function(){return!1},resetHydrationState:function(){},tryToClaimNextHydratableInstance:function(){},prepareToHydrateHostInstance:function(){r("175")},prepareToHydrateHostTextInstance:function(){r("176")},popHydrationState:function(){return!1}};var a=e.canHydrateInstance,u=e.canHydrateTextInstance,l=e.getNextHydratableSibling,s=e.getFirstHydratableChild,c=e.hydrateInstance,f=e.hydrateTextInstance,p=null,d=null,h=!1;return{enterHydrationState:function(e){return d=s(e.stateNode.containerInfo),p=e,h=!0},resetHydrationState:function(){d=p=null,h=!1},tryToClaimNextHydratableInstance:function(e){if(h){var r=d;if(r){if(!n(e,r)){if(!(r=l(r))||!n(e,r))return e.effectTag|=2,h=!1,void(p=e);t(p,d)}p=e,d=s(r)}else e.effectTag|=2,h=!1,p=e}},prepareToHydrateHostInstance:function(e,t,n){return t=c(e.stateNode,e.type,e.memoizedProps,t,n,e),e.updateQueue=t,null!==t},prepareToHydrateHostTextInstance:function(e){return f(e.stateNode,e.memoizedProps,e)},popHydrationState:function(e){if(e!==p)return!1;if(!h)return o(e),h=!0,!1;var n=e.type;if(5!==e.tag||"head"!==n&&"body"!==n&&!i(n,e.memoizedProps))for(n=d;n;)t(e,n),n=l(n);return o(e),d=p?l(e.stateNode):null,!0}}}function St(e){function t(e,t,n){e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=n}function n(e){return 2===e.tag&&null!=e.type.childContextTypes}function o(e,t){var n=e.stateNode,o=e.type.childContextTypes;if("function"!=typeof n.getChildContext)return t;n=n.getChildContext();for(var i in n)i in o||r("108",oe(e)||"Unknown",i);return fn({},t,n)}var i=e.createCursor,a=e.push,u=e.pop,l=i(vn),s=i(!1),c=vn;return{getUnmaskedContext:function(e){return n(e)?c:l.current},cacheContext:t,getMaskedContext:function(e,n){var r=e.type.contextTypes;if(!r)return vn;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===n)return o.__reactInternalMemoizedMaskedChildContext;var i,a={};for(i in r)a[i]=n[i];return o&&t(e,n,a),a},hasContextChanged:function(){return s.current},isContextConsumer:function(e){return 2===e.tag&&null!=e.type.contextTypes},isContextProvider:n,popContextProvider:function(e){n(e)&&(u(s,e),u(l,e))},popTopLevelContextObject:function(e){u(s,e),u(l,e)},pushTopLevelContextObject:function(e,t,n){null!=l.cursor&&r("168"),a(l,t,e),a(s,n,e)},processChildContext:o,pushContextProvider:function(e){if(!n(e))return!1;var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||vn,c=l.current,a(l,t,e),a(s,s.current,e),!0},invalidateContextProvider:function(e,t){var n=e.stateNode;if(n||r("169"),t){var i=o(e,c);n.__reactInternalMemoizedMergedChildContext=i,u(s,e),u(l,e),a(l,i,e)}else u(s,e);a(s,t,e)},findCurrentUnmaskedContext:function(e){for(2!==Ne(e)||2!==e.tag?r("170"):void 0;3!==e.tag;){if(n(e))return e.stateNode.__reactInternalMemoizedMergedChildContext;(e=e.return)||r("171")}return e.stateNode.context}}}function Ct(e){var t=e.createCursor,n=e.push,r=e.pop,o=t(null),i=t(null),a=t(0);return{pushProvider:function(e){var t=e.type.context;n(a,t._changedBits,e),n(i,t._currentValue,e),n(o,e,e),t._currentValue=e.pendingProps.value,t._changedBits=e.stateNode},popProvider:function(e){var t=a.current,n=i.current;r(o,e),r(i,e),r(a,e),e=e.type.context,e._currentValue=n,e._changedBits=t}}}function Pt(){var e=[],t=-1;return{createCursor:function(e){return{current:e}},isEmpty:function(){return-1===t},pop:function(n){0>t||(n.current=e[t],e[t]=null,t--)},push:function(n,r){t++,e[t]=n.current,n.current=r},checkThatStackIsEmpty:function(){},resetStackAfterFatalErrorInDev:function(){}}}function jt(e){function t(){if(null!==J)for(var e=J.return;null!==e;)A(e),e=e.return;ee=null,te=0,J=null,oe=!1}function n(e){return null!==ae&&ae.has(e)}function o(e){for(;;){var t=e.alternate,n=e.return,r=e.sibling;if(0==(512&e.effectTag)){t=j(t,e,te);var o=e;if(1073741823===te||1073741823!==o.expirationTime){e:switch(o.tag){case 3:case 2:var i=o.updateQueue;i=null===i?0:i.expirationTime;break e;default:i=0}for(var a=o.child;null!==a;)0!==a.expirationTime&&(0===i||i>a.expirationTime)&&(i=a.expirationTime),a=a.sibling;o.expirationTime=i}if(null!==t)return t;if(null!==n&&0==(512&n.effectTag)&&(null===n.firstEffect&&(n.firstEffect=e.firstEffect),null!==e.lastEffect&&(null!==n.lastEffect&&(n.lastEffect.nextEffect=e.firstEffect),n.lastEffect=e.lastEffect),1<e.effectTag&&(null!==n.lastEffect?n.lastEffect.nextEffect=e:n.firstEffect=e,n.lastEffect=e)),null!==r)return r;if(null===n){oe=!0;break}e=n}else{if(null!==(e=N(e)))return e.effectTag&=2559,e;if(null!==n&&(n.firstEffect=n.lastEffect=null,n.effectTag|=512),null!==r)return r;if(null===n)break;e=n}}return null}function i(e){var t=P(e.alternate,e,te);return null===t&&(t=o(e)),ir.current=null,t}function a(e,n,a){X&&r("243"),X=!0,n===te&&e===ee&&null!==J||(t(),ee=e,te=n,J=Je(ee.current,null,te),e.pendingCommitExpirationTime=0);for(var u=!1;;){try{if(a)for(;null!==J&&!E();)J=i(J);else for(;null!==J;)J=i(J)}catch(e){if(null===J){u=!0,O(e);break}a=J;var l=a.return;if(null===l){u=!0,O(e);break}T(l,a,e),J=o(a)}break}return X=!1,u||null!==J?null:oe?(e.pendingCommitExpirationTime=n,e.current.alternate):void r("262")}function u(e,t,n,r){e={value:n,source:e,stack:ie(e)},ft(t,{expirationTime:r,partialState:null,callback:null,isReplace:!1,isForced:!1,capturedValue:e,next:null}),c(t,r)}function l(e,t){e:{X&&!re&&r("263");for(var o=e.return;null!==o;){switch(o.tag){case 2:var i=o.stateNode;if("function"==typeof o.type.getDerivedStateFromCatch||"function"==typeof i.componentDidCatch&&!n(i)){u(e,o,t,1),e=void 0;break e}break;case 3:u(e,o,t,1),e=void 0;break e}o=o.return}3===e.tag&&u(e,e,t,1),e=void 0}return e}function s(e){return e=0!==Z?Z:X?re?1:te:1&e.mode?we?10*(1+((f()+50)/10|0)):25*(1+((f()+500)/25|0)):1,we&&(0===he||e>he)&&(he=e),e}function c(e,n){e:{for(;null!==e;){if((0===e.expirationTime||e.expirationTime>n)&&(e.expirationTime=n),null!==e.alternate&&(0===e.alternate.expirationTime||e.alternate.expirationTime>n)&&(e.alternate.expirationTime=n),null===e.return){if(3!==e.tag){n=void 0;break e}var o=e.stateNode;!X&&0!==te&&n<te&&t(),X&&!re&&ee===o||h(o,n),xe>Oe&&r("185")}e=e.return}n=void 0}return n}function f(){return G=H()-Y,$=2+(G/10|0)}function p(e,t,n,r,o){var i=Z;Z=1;try{return e(t,n,r,o)}finally{Z=i}}function d(e){if(0!==se){if(e>se)return;V(ce)}var t=H()-Y;se=e,ce=z(v,{timeout:10*(e-2)-t})}function h(e,t){if(null===e.nextScheduledRoot)e.remainingExpirationTime=t,null===le?(ue=le=e,e.nextScheduledRoot=e):(le=le.nextScheduledRoot=e,le.nextScheduledRoot=ue);else{var n=e.remainingExpirationTime;(0===n||t<n)&&(e.remainingExpirationTime=t)}fe||(ge?_e&&(pe=e,de=1,_(e,1,!1)):1===t?m():d(t))}function y(){var e=0,t=null;if(null!==le)for(var n=le,o=ue;null!==o;){var i=o.remainingExpirationTime;if(0===i){if((null===n||null===le)&&r("244"),o===o.nextScheduledRoot){ue=le=o.nextScheduledRoot=null;break}if(o===ue)ue=i=o.nextScheduledRoot,le.nextScheduledRoot=i,o.nextScheduledRoot=null;else{if(o===le){le=n,le.nextScheduledRoot=ue,o.nextScheduledRoot=null;break}n.nextScheduledRoot=o.nextScheduledRoot,o.nextScheduledRoot=null}o=n.nextScheduledRoot}else{if((0===e||i<e)&&(e=i,t=o),o===le)break;n=o,o=o.nextScheduledRoot}}n=pe,null!==n&&n===t&&1===e?xe++:xe=0,pe=t,de=e}function v(e){b(0,!0,e)}function m(){b(1,!1,null)}function b(e,t,n){if(be=n,y(),t)for(;null!==pe&&0!==de&&(0===e||e>=de)&&(!ye||f()>=de);)_(pe,de,!ye),y();else for(;null!==pe&&0!==de&&(0===e||e>=de);)_(pe,de,!1),y();null!==be&&(se=0,ce=-1),0!==de&&d(de),be=null,ye=!1,g()}function g(){if(xe=0,null!==Ee){var e=Ee;Ee=null;for(var t=0;t<e.length;t++){var n=e[t];try{n._onComplete()}catch(e){ve||(ve=!0,me=e)}}}if(ve)throw e=me,me=null,ve=!1,e}function _(e,t,n){fe&&r("245"),fe=!0,n?(n=e.finishedWork,null!==n?w(e,n,t):(e.finishedWork=null,null!==(n=a(e,t,!0))&&(E()?e.finishedWork=n:w(e,n,t)))):(n=e.finishedWork,null!==n?w(e,n,t):(e.finishedWork=null,null!==(n=a(e,t,!1))&&w(e,n,t))),fe=!1}function w(e,t,n){var o=e.firstBatch;if(null!==o&&o._expirationTime<=n&&(null===Ee?Ee=[o]:Ee.push(o),o._defer))return e.finishedWork=t,void(e.remainingExpirationTime=0);e.finishedWork=null,re=X=!0,n=t.stateNode,n.current===t&&r("177"),o=n.pendingCommitExpirationTime,0===o&&r("261"),n.pendingCommitExpirationTime=0;var i=f();if(ir.current=null,1<t.effectTag)if(null!==t.lastEffect){t.lastEffect.nextEffect=t;var a=t.firstEffect}else a=t;else a=t.firstEffect;for(W(n.containerInfo),ne=a;null!==ne;){var u=!1,s=void 0;try{for(;null!==ne;)2048&ne.effectTag&&R(ne.alternate,ne),ne=ne.nextEffect}catch(e){u=!0,s=e}u&&(null===ne&&r("178"),l(ne,s),null!==ne&&(ne=ne.nextEffect))}for(ne=a;null!==ne;){u=!1,s=void 0;try{for(;null!==ne;){var c=ne.effectTag;if(16&c&&M(ne),128&c){var p=ne.alternate;null!==p&&B(p)}switch(14&c){case 2:L(ne),ne.effectTag&=-3;break;case 6:L(ne),ne.effectTag&=-3,q(ne.alternate,ne);break;case 4:q(ne.alternate,ne);break;case 8:I(ne)}ne=ne.nextEffect}}catch(e){u=!0,s=e}u&&(null===ne&&r("178"),l(ne,s),null!==ne&&(ne=ne.nextEffect))}for(K(n.containerInfo),n.current=t,ne=a;null!==ne;){c=!1,p=void 0;try{for(a=n,u=i,s=o;null!==ne;){var d=ne.effectTag;36&d&&U(a,ne.alternate,ne,u,s),256&d&&D(ne,O),128&d&&F(ne);var h=ne.nextEffect;ne.nextEffect=null,ne=h}}catch(e){c=!0,p=e}c&&(null===ne&&r("178"),l(ne,p),null!==ne&&(ne=ne.nextEffect))}X=re=!1,"function"==typeof at&&at(t.stateNode),t=n.current.expirationTime,0===t&&(ae=null),e.remainingExpirationTime=t}function E(){return!(null===be||be.timeRemaining()>ke)&&(ye=!0)}function O(e){null===pe&&r("246"),pe.remainingExpirationTime=0,ve||(ve=!0,me=e)}var x=Pt(),k=xt(e,x),S=St(x);x=Ct(x);var C=kt(e),P=gt(e,k,S,x,C,c,s).beginWork,j=_t(e,k,S,x,C).completeWork;k=wt(k,S,x,c,n);var T=k.throwException,N=k.unwindWork,A=k.unwindInterruptedWork;k=Ot(e,l,c,s,function(e){null===ae?ae=new Set([e]):ae.add(e)},f);var R=k.commitBeforeMutationLifeCycles,M=k.commitResetTextContent,L=k.commitPlacement,I=k.commitDeletion,q=k.commitWork,U=k.commitLifeCycles,D=k.commitErrorLogging,F=k.commitAttachRef,B=k.commitDetachRef,H=e.now,z=e.scheduleDeferredCallback,V=e.cancelDeferredCallback,W=e.prepareForCommit,K=e.resetAfterCommit,Y=H(),$=2,G=Y,Q=0,Z=0,X=!1,J=null,ee=null,te=0,ne=null,re=!1,oe=!1,ae=null,ue=null,le=null,se=0,ce=-1,fe=!1,pe=null,de=0,he=0,ye=!1,ve=!1,me=null,be=null,ge=!1,_e=!1,we=!1,Ee=null,Oe=1e3,xe=0,ke=1;return{recalculateCurrentTime:f,computeExpirationForFiber:s,scheduleWork:c,requestWork:h,flushRoot:function(e,t){fe&&r("253"),pe=e,de=t,_(e,t,!1),m(),g()},batchedUpdates:function(e,t){var n=ge;ge=!0;try{return e(t)}finally{(ge=n)||fe||m()}},unbatchedUpdates:function(e,t){if(ge&&!_e){_e=!0;try{return e(t)}finally{_e=!1}}return e(t)},flushSync:function(e,t){fe&&r("187");var n=ge;ge=!0;try{return p(e,t)}finally{ge=n,m()}},flushControlled:function(e){var t=ge;ge=!0;try{p(e)}finally{(ge=t)||fe||b(1,!1,null)}},deferredUpdates:function(e){var t=Z;Z=25*(1+((f()+500)/25|0));try{return e()}finally{Z=t}},syncUpdates:p,interactiveUpdates:function(e,t,n){if(we)return e(t,n);ge||fe||0===he||(b(he,!1,null),he=0);var r=we,o=ge;ge=we=!0;try{return e(t,n)}finally{we=r,(ge=o)||fe||m()}},flushInteractiveUpdates:function(){fe||0===he||(b(he,!1,null),he=0)},computeUniqueAsyncExpiration:function(){var e=25*(1+((f()+500)/25|0));return e<=Q&&(e=Q+1),Q=e},legacyContext:S}}function Tt(e){function t(e,t,n,r,o,i){if(r=t.current,n){n=n._reactInternalFiber;var u=l(n);n=s(n)?c(n,u):u}else n=vn;return null===t.context?t.context=n:t.pendingContext=n,t=i,ft(r,{expirationTime:o,partialState:{element:e},callback:void 0===t?null:t,isReplace:!1,isForced:!1,capturedValue:null,next:null}),a(r,o),o}function n(e){return e=Le(e),null===e?null:e.stateNode}var r=e.getPublicInstance;e=jt(e);var o=e.recalculateCurrentTime,i=e.computeExpirationForFiber,a=e.scheduleWork,u=e.legacyContext,l=u.findCurrentUnmaskedContext,s=u.isContextProvider,c=u.processChildContext;return{createContainer:function(e,t,n){return t=new Xe(3,null,null,t?3:0),e={current:t,containerInfo:e,pendingChildren:null,pendingCommitExpirationTime:0,finishedWork:null,context:null,pendingContext:null,hydrate:n,remainingExpirationTime:0,firstBatch:null,nextScheduledRoot:null},t.stateNode=e},updateContainer:function(e,n,r,a){var u=n.current,l=o();return u=i(u),t(e,n,r,l,u,a)},updateContainerAtExpirationTime:function(e,n,r,i,a){return t(e,n,r,o(),i,a)},flushRoot:e.flushRoot,requestWork:e.requestWork,computeUniqueAsyncExpiration:e.computeUniqueAsyncExpiration,batchedUpdates:e.batchedUpdates,unbatchedUpdates:e.unbatchedUpdates,deferredUpdates:e.deferredUpdates,syncUpdates:e.syncUpdates,interactiveUpdates:e.interactiveUpdates,flushInteractiveUpdates:e.flushInteractiveUpdates,flushControlled:e.flushControlled,flushSync:e.flushSync,getPublicRootInstance:function(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return r(e.child.stateNode);default:return e.child.stateNode}},findHostInstance:n,findHostInstanceWithNoPortals:function(e){return e=Ie(e),null===e?null:e.stateNode},injectIntoDevTools:function(e){var t=e.findFiberByHostInstance;return it(fn({},e,{findHostInstanceByFiber:function(e){return n(e)},findFiberByHostInstance:function(e){return t?t(e):null}}))}}}function Nt(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:cr,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}function At(e){var t="";return sn.Children.forEach(e,function(e){null==e||"string"!=typeof e&&"number"!=typeof e||(t+=e)}),t}function Rt(e,t){return e=fn({children:void 0},t),(t=At(t.children))&&(e.children=t),e}function Mt(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+n,t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function Lt(e,t){var n=t.value;e._wrapperState={initialValue:null!=n?n:t.defaultValue,wasMultiple:!!t.multiple}}function It(e,t){return null!=t.dangerouslySetInnerHTML&&r("91"),fn({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function qt(e,t){var n=t.value;null==n&&(n=t.defaultValue,t=t.children,null!=t&&(null!=n&&r("92"),Array.isArray(t)&&(1>=t.length||r("93"),t=t[0]),n=""+t),null==n&&(n="")),e._wrapperState={initialValue:""+n}}function Ut(e,t){var n=t.value;null!=n&&(n=""+n,n!==e.value&&(e.value=n),null==t.defaultValue&&(e.defaultValue=n)),null!=t.defaultValue&&(e.defaultValue=t.defaultValue)}function Dt(e){var t=e.textContent;t===e._wrapperState.initialValue&&(e.value=t)}function Ft(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Bt(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?Ft(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}function Ht(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}function zt(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=n,i=t[n];o=null==i||"boolean"==typeof i||""===i?"":r||"number"!=typeof i||0===i||Fo.hasOwnProperty(o)&&Fo[o]?(""+i).trim():i+"px","float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}function Vt(e,t,n){t&&(Ho[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML)&&r("137",e,n()),null!=t.dangerouslySetInnerHTML&&(null!=t.children&&r("60"),"object"==typeof t.dangerouslySetInnerHTML&&"__html"in t.dangerouslySetInnerHTML||r("61")),null!=t.style&&"object"!=typeof t.style&&r("62",n()))}function Wt(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}function Kt(e,t){e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument;var n=Ye(e);t=On[t];for(var r=0;r<t.length;r++){var o=t[r];n.hasOwnProperty(o)&&n[o]||("topScroll"===o?He("topScroll","scroll",e):"topFocus"===o||"topBlur"===o?(He("topFocus","focus",e),He("topBlur","blur",e),n.topBlur=!0,n.topFocus=!0):"topCancel"===o?(X("cancel",!0)&&He("topCancel","cancel",e),n.topCancel=!0):"topClose"===o?(X("close",!0)&&He("topClose","close",e),n.topClose=!0):Jr.hasOwnProperty(o)&&Be(o,Jr[o],e),n[o]=!0)}}function Yt(e,t,n,r){return n=9===n.nodeType?n:n.ownerDocument,r===zo&&(r=Ft(e)),r===zo?"script"===e?(e=n.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):e="string"==typeof t.is?n.createElement(e,{is:t.is}):n.createElement(e):e=n.createElementNS(r,e),e}function $t(e,t){return(9===t.nodeType?t:t.ownerDocument).createTextNode(e)}function Gt(e,t,n,r){var o=Wt(t,n);switch(t){case"iframe":case"object":Be("topLoad","load",e);var i=n;break;case"video":case"audio":for(i in eo)eo.hasOwnProperty(i)&&Be(i,eo[i],e);i=n;break;case"source":Be("topError","error",e),i=n;break;case"img":case"image":case"link":Be("topError","error",e),Be("topLoad","load",e),i=n;break;case"form":Be("topReset","reset",e),Be("topSubmit","submit",e),i=n;break;case"details":Be("topToggle","toggle",e),i=n;break;case"input":de(e,n),i=pe(e,n),Be("topInvalid","invalid",e),Kt(r,"onChange");break;case"option":i=Rt(e,n);break;case"select":Lt(e,n),i=fn({},n,{value:void 0}),Be("topInvalid","invalid",e),Kt(r,"onChange");break;case"textarea":qt(e,n),i=It(e,n),Be("topInvalid","invalid",e),Kt(r,"onChange");break;default:i=n}Vt(t,i,Vo);var a,u=i;for(a in u)if(u.hasOwnProperty(a)){var l=u[a];"style"===a?zt(e,l,Vo):"dangerouslySetInnerHTML"===a?null!=(l=l?l.__html:void 0)&&Do(e,l):"children"===a?"string"==typeof l?("textarea"!==t||""!==l)&&Ht(e,l):"number"==typeof l&&Ht(e,""+l):"suppressContentEditableWarning"!==a&&"suppressHydrationWarning"!==a&&"autoFocus"!==a&&(En.hasOwnProperty(a)?null!=l&&Kt(r,a):null!=l&&fe(e,a,l,o))}switch(t){case"input":te(e),ve(e,n);break;case"textarea":te(e),Dt(e,n);break;case"option":null!=n.value&&e.setAttribute("value",n.value);break;case"select":e.multiple=!!n.multiple,t=n.value,null!=t?Mt(e,!!n.multiple,t,!1):null!=n.defaultValue&&Mt(e,!!n.multiple,n.defaultValue,!0);break;default:"function"==typeof i.onClick&&(e.onclick=pn)}}function Qt(e,t,n,r,o){var i=null;switch(t){case"input":n=pe(e,n),r=pe(e,r),i=[];break;case"option":n=Rt(e,n),r=Rt(e,r),i=[];break;case"select":n=fn({},n,{value:void 0}),r=fn({},r,{value:void 0}),i=[];break;case"textarea":n=It(e,n),r=It(e,r),i=[];break;default:"function"!=typeof n.onClick&&"function"==typeof r.onClick&&(e.onclick=pn)}Vt(t,r,Vo),t=e=void 0;var a=null;for(e in n)if(!r.hasOwnProperty(e)&&n.hasOwnProperty(e)&&null!=n[e])if("style"===e){var u=n[e];for(t in u)u.hasOwnProperty(t)&&(a||(a={}),a[t]="")}else"dangerouslySetInnerHTML"!==e&&"children"!==e&&"suppressContentEditableWarning"!==e&&"suppressHydrationWarning"!==e&&"autoFocus"!==e&&(En.hasOwnProperty(e)?i||(i=[]):(i=i||[]).push(e,null));for(e in r){var l=r[e];if(u=null!=n?n[e]:void 0,r.hasOwnProperty(e)&&l!==u&&(null!=l||null!=u))if("style"===e)if(u){for(t in u)!u.hasOwnProperty(t)||l&&l.hasOwnProperty(t)||(a||(a={}),a[t]="");for(t in l)l.hasOwnProperty(t)&&u[t]!==l[t]&&(a||(a={}),a[t]=l[t])}else a||(i||(i=[]),i.push(e,a)),a=l;else"dangerouslySetInnerHTML"===e?(l=l?l.__html:void 0,u=u?u.__html:void 0,null!=l&&u!==l&&(i=i||[]).push(e,""+l)):"children"===e?u===l||"string"!=typeof l&&"number"!=typeof l||(i=i||[]).push(e,""+l):"suppressContentEditableWarning"!==e&&"suppressHydrationWarning"!==e&&(En.hasOwnProperty(e)?(null!=l&&Kt(o,e),i||u===l||(i=[])):(i=i||[]).push(e,l))}return a&&(i=i||[]).push("style",a),i}function Zt(e,t,n,r,o){"input"===n&&"radio"===o.type&&null!=o.name&&he(e,o),Wt(n,r),r=Wt(n,o);for(var i=0;i<t.length;i+=2){var a=t[i],u=t[i+1];"style"===a?zt(e,u,Vo):"dangerouslySetInnerHTML"===a?Do(e,u):"children"===a?Ht(e,u):fe(e,a,u,r)}switch(n){case"input":ye(e,o);break;case"textarea":Ut(e,o);break;case"select":e._wrapperState.initialValue=void 0,t=e._wrapperState.wasMultiple,e._wrapperState.wasMultiple=!!o.multiple,n=o.value,null!=n?Mt(e,!!o.multiple,n,!1):t!==!!o.multiple&&(null!=o.defaultValue?Mt(e,!!o.multiple,o.defaultValue,!0):Mt(e,!!o.multiple,o.multiple?[]:"",!1))}}function Xt(e,t,n,r,o){switch(t){case"iframe":case"object":Be("topLoad","load",e);break;case"video":case"audio":for(var i in eo)eo.hasOwnProperty(i)&&Be(i,eo[i],e);break;case"source":Be("topError","error",e);break;case"img":case"image":case"link":Be("topError","error",e),Be("topLoad","load",e);break;case"form":Be("topReset","reset",e),Be("topSubmit","submit",e);break;case"details":Be("topToggle","toggle",e);break;case"input":de(e,n),Be("topInvalid","invalid",e),Kt(o,"onChange");break;case"select":Lt(e,n),Be("topInvalid","invalid",e),Kt(o,"onChange");break;case"textarea":qt(e,n),Be("topInvalid","invalid",e),Kt(o,"onChange")}Vt(t,n,Vo),r=null;for(var a in n)n.hasOwnProperty(a)&&(i=n[a],"children"===a?"string"==typeof i?e.textContent!==i&&(r=["children",i]):"number"==typeof i&&e.textContent!==""+i&&(r=["children",""+i]):En.hasOwnProperty(a)&&null!=i&&Kt(o,a));switch(t){case"input":te(e),ve(e,n);break;case"textarea":te(e),Dt(e,n);break;case"select":case"option":break;default:"function"==typeof n.onClick&&(e.onclick=pn)}return r}function Jt(e,t){return e.nodeValue!==t}function en(e){this._expirationTime=$o.computeUniqueAsyncExpiration(),this._root=e,this._callbacks=this._next=null,this._hasChildren=this._didComplete=!1,this._children=null,this._defer=!0}function tn(){this._callbacks=null,this._didCommit=!1,this._onCommit=this._onCommit.bind(this)}function nn(e,t,n){this._internalRoot=$o.createContainer(e,t,n)}function rn(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function on(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function an(e,t){if(t||(t=e?9===e.nodeType?e.documentElement:e.firstChild:null,t=!(!t||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new nn(e,!1,t)}function un(e,t,n,o,i){rn(n)||r("200");var a=n._reactRootContainer;if(a){if("function"==typeof i){var u=i;i=function(){var e=$o.getPublicRootInstance(a._internalRoot);u.call(e)}}null!=e?a.legacy_renderSubtreeIntoContainer(e,t,i):a.render(t,i)}else{if(a=n._reactRootContainer=an(n,o),"function"==typeof i){var l=i;i=function(){var e=$o.getPublicRootInstance(a._internalRoot);l.call(e)}}$o.unbatchedUpdates(function(){null!=e?a.legacy_renderSubtreeIntoContainer(e,t,i):a.render(t,i)})}return $o.getPublicRootInstance(a._internalRoot)}function ln(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;return rn(t)||r("200"),Nt(e,t,null,n)}/** @license React v16.3.0
 * react-dom.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sn=n(0),cn=n(116),fn=n(23),pn=n(25),dn=n(117),hn=n(118),yn=n(119),vn=n(24);sn||r("227");var mn={_caughtError:null,_hasCaughtError:!1,_rethrowError:null,_hasRethrowError:!1,invokeGuardedCallback:function(e,t,n,r,i,a,u,l,s){o.apply(mn,arguments)},invokeGuardedCallbackAndCatchFirstError:function(e,t,n,r,o,i,a,u,l){if(mn.invokeGuardedCallback.apply(this,arguments),mn.hasCaughtError()){var s=mn.clearCaughtError();mn._hasRethrowError||(mn._hasRethrowError=!0,mn._rethrowError=s)}},rethrowCaughtError:function(){return i.apply(mn,arguments)},hasCaughtError:function(){return mn._hasCaughtError},clearCaughtError:function(){if(mn._hasCaughtError){var e=mn._caughtError;return mn._caughtError=null,mn._hasCaughtError=!1,e}r("198")}},bn=null,gn={},_n=[],wn={},En={},On={},xn=Object.freeze({plugins:_n,eventNameDispatchConfigs:wn,registrationNameModules:En,registrationNameDependencies:On,possibleRegistrationNames:null,injectEventPluginOrder:l,injectEventPluginsByName:s}),kn=null,Sn=null,Cn=null,Pn=null,jn={injectEventPluginOrder:l,injectEventPluginsByName:s},Tn=Object.freeze({injection:jn,getListener:v,runEventsInBatch:m,runExtractedEventsInBatch:b}),Nn=Math.random().toString(36).slice(2),An="__reactInternalInstance$"+Nn,Rn="__reactEventHandlers$"+Nn,Mn=Object.freeze({precacheFiberNode:function(e,t){t[An]=e},getClosestInstanceFromNode:g,getInstanceFromNode:function(e){return e=e[An],!e||5!==e.tag&&6!==e.tag?null:e},getNodeFromInstance:_,getFiberCurrentPropsFromNode:w,updateFiberProps:function(e,t){e[Rn]=t}}),Ln=Object.freeze({accumulateTwoPhaseDispatches:j,accumulateTwoPhaseDispatchesSkipTarget:function(e){p(e,S)},accumulateEnterLeaveDispatches:T,accumulateDirectDispatches:function(e){p(e,P)}}),In=null,qn={_root:null,_startText:null,_fallbackText:null},Un="dispatchConfig _targetInst nativeEvent isDefaultPrevented isPropagationStopped _dispatchListeners _dispatchInstances".split(" "),Dn={type:null,target:null,currentTarget:pn.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};fn(M.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=pn.thatReturnsTrue)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=pn.thatReturnsTrue)},persist:function(){this.isPersistent=pn.thatReturnsTrue},isPersistent:pn.thatReturnsFalse,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;for(t=0;t<Un.length;t++)this[Un[t]]=null}}),M.Interface=Dn,M.extend=function(e){function t(){}function n(){return r.apply(this,arguments)}var r=this;t.prototype=r.prototype;var o=new t;return fn(o,n.prototype),n.prototype=o,n.prototype.constructor=n,n.Interface=fn({},r.Interface,e),n.extend=r.extend,q(n),n},q(M);var Fn=M.extend({data:null}),Bn=M.extend({data:null}),Hn=[9,13,27,32],zn=cn.canUseDOM&&"CompositionEvent"in window,Vn=null;cn.canUseDOM&&"documentMode"in document&&(Vn=document.documentMode);var Wn=cn.canUseDOM&&"TextEvent"in window&&!Vn,Kn=cn.canUseDOM&&(!zn||Vn&&8<Vn&&11>=Vn),Yn=String.fromCharCode(32),$n={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["topCompositionEnd","topKeyPress","topTextInput","topPaste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"topBlur topCompositionEnd topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"topBlur topCompositionStart topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"topBlur topCompositionUpdate topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")}},Gn=!1,Qn=!1,Zn={eventTypes:$n,extractEvents:function(e,t,n,r){var o=void 0,i=void 0;if(zn)e:{switch(e){case"topCompositionStart":o=$n.compositionStart;break e;case"topCompositionEnd":o=$n.compositionEnd;break e;case"topCompositionUpdate":o=$n.compositionUpdate;break e}o=void 0}else Qn?U(e,n)&&(o=$n.compositionEnd):"topKeyDown"===e&&229===n.keyCode&&(o=$n.compositionStart);return o?(Kn&&(Qn||o!==$n.compositionStart?o===$n.compositionEnd&&Qn&&(i=A()):(qn._root=r,qn._startText=R(),Qn=!0)),o=Fn.getPooled(o,t,n,r),i?o.data=i:null!==(i=D(n))&&(o.data=i),j(o),i=o):i=null,(e=Wn?F(e,n):B(e,n))?(t=Bn.getPooled($n.beforeInput,t,n,r),t.data=e,j(t)):t=null,null===i?t:null===t?i:[i,t]}},Xn=null,Jn=null,er=null,tr={injectFiberControlledHostComponent:function(e){Xn=e}},nr=Object.freeze({injection:tr,enqueueStateRestore:z,needsStateRestore:V,restoreStateIfNeeded:W}),rr=!1,or={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0},ir=sn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ar="function"==typeof Symbol&&Symbol.for,ur=ar?Symbol.for("react.element"):60103,lr=ar?Symbol.for("react.call"):60104,sr=ar?Symbol.for("react.return"):60105,cr=ar?Symbol.for("react.portal"):60106,fr=ar?Symbol.for("react.fragment"):60107,pr=ar?Symbol.for("react.strict_mode"):60108,dr=ar?Symbol.for("react.provider"):60109,hr=ar?Symbol.for("react.context"):60110,yr=ar?Symbol.for("react.async_mode"):60111,vr=ar?Symbol.for("react.forward_ref"):60112,mr="function"==typeof Symbol&&Symbol.iterator,br=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,gr={},_r={},wr={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){wr[e]=new se(e,0,!1,e,null)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];wr[t]=new se(t,1,!1,e[1],null)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){wr[e]=new se(e,2,!1,e.toLowerCase(),null)}),["autoReverse","externalResourcesRequired","preserveAlpha"].forEach(function(e){wr[e]=new se(e,2,!1,e,null)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){wr[e]=new se(e,3,!1,e.toLowerCase(),null)}),["checked","multiple","muted","selected"].forEach(function(e){wr[e]=new se(e,3,!0,e.toLowerCase(),null)}),["capture","download"].forEach(function(e){wr[e]=new se(e,4,!1,e.toLowerCase(),null)}),["cols","rows","size","span"].forEach(function(e){wr[e]=new se(e,6,!1,e.toLowerCase(),null)}),["rowSpan","start"].forEach(function(e){wr[e]=new se(e,5,!1,e.toLowerCase(),null)});var Er=/[\-\:]([a-z])/g;"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Er,ce);wr[t]=new se(t,1,!1,e,null)}),"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Er,ce);wr[t]=new se(t,1,!1,e,"http://www.w3.org/1999/xlink")}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Er,ce);wr[t]=new se(t,1,!1,e,"http://www.w3.org/XML/1998/namespace")}),wr.tabIndex=new se("tabIndex",1,!1,"tabindex",null);var Or={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"topBlur topChange topClick topFocus topInput topKeyDown topKeyUp topSelectionChange".split(" ")}},xr=null,kr=null,Sr=!1;cn.canUseDOM&&(Sr=X("input")&&(!document.documentMode||9<document.documentMode));var Cr={eventTypes:Or,_isInputEventSupported:Sr,extractEvents:function(e,t,n,r){var o=t?_(t):window,i=void 0,a=void 0,u=o.nodeName&&o.nodeName.toLowerCase();if("select"===u||"input"===u&&"file"===o.type?i=Ee:Q(o)?Sr?i=Pe:(i=Se,a=ke):!(u=o.nodeName)||"input"!==u.toLowerCase()||"checkbox"!==o.type&&"radio"!==o.type||(i=Ce),i&&(i=i(e,t)))return ge(i,n,r);a&&a(e,o,t),"topBlur"===e&&null!=t&&(e=t._wrapperState||o._wrapperState)&&e.controlled&&"number"===o.type&&me(o,"number",o.value)}},Pr=M.extend({view:null,detail:null}),jr={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"},Tr=Pr.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Te,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)}}),Nr={mouseEnter:{registrationName:"onMouseEnter",dependencies:["topMouseOut","topMouseOver"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["topMouseOut","topMouseOver"]}},Ar={eventTypes:Nr,extractEvents:function(e,t,n,r){if("topMouseOver"===e&&(n.relatedTarget||n.fromElement)||"topMouseOut"!==e&&"topMouseOver"!==e)return null;var o=r.window===r?r:(o=r.ownerDocument)?o.defaultView||o.parentWindow:window;if("topMouseOut"===e?(e=t,t=(t=n.relatedTarget||n.toElement)?g(t):null):e=null,e===t)return null;var i=null==e?o:_(e);o=null==t?o:_(t);var a=Tr.getPooled(Nr.mouseLeave,e,n,r);return a.type="mouseleave",a.target=i,a.relatedTarget=o,n=Tr.getPooled(Nr.mouseEnter,t,n,r),n.type="mouseenter",n.target=o,n.relatedTarget=i,T(a,n,e,t),[a,n]}},Rr=M.extend({animationName:null,elapsedTime:null,pseudoElement:null}),Mr=M.extend({clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Lr=Pr.extend({relatedTarget:null}),Ir={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},qr={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ur=Pr.extend({key:function(e){if(e.key){var t=Ir[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?(e=qe(e),13===e?"Enter":String.fromCharCode(e)):"keydown"===e.type||"keyup"===e.type?qr[e.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Te,charCode:function(e){return"keypress"===e.type?qe(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?qe(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),Dr=Tr.extend({dataTransfer:null}),Fr=Pr.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Te}),Br=M.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),Hr=Tr.extend({deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null}),zr={},Vr={};"blur cancel click close contextMenu copy cut doubleClick dragEnd dragStart drop focus input invalid keyDown keyPress keyUp mouseDown mouseUp paste pause play rateChange reset seeked submit touchCancel touchEnd touchStart volumeChange".split(" ").forEach(function(e){Ue(e,!0)}),"abort animationEnd animationIteration animationStart canPlay canPlayThrough drag dragEnter dragExit dragLeave dragOver durationChange emptied encrypted ended error load loadedData loadedMetadata loadStart mouseMove mouseOut mouseOver playing progress scroll seeking stalled suspend timeUpdate toggle touchMove transitionEnd waiting wheel".split(" ").forEach(function(e){Ue(e,!1)});var Wr={eventTypes:zr,isInteractiveTopLevelEventType:function(e){return void 0!==(e=Vr[e])&&!0===e.isInteractive},extractEvents:function(e,t,n,r){var o=Vr[e];if(!o)return null;switch(e){case"topKeyPress":if(0===qe(n))return null;case"topKeyDown":case"topKeyUp":e=Ur;break;case"topBlur":case"topFocus":e=Lr;break;case"topClick":if(2===n.button)return null;case"topDoubleClick":case"topMouseDown":case"topMouseMove":case"topMouseUp":case"topMouseOut":case"topMouseOver":case"topContextMenu":e=Tr;break;case"topDrag":case"topDragEnd":case"topDragEnter":case"topDragExit":case"topDragLeave":case"topDragOver":case"topDragStart":case"topDrop":e=Dr;break;case"topTouchCancel":case"topTouchEnd":case"topTouchMove":case"topTouchStart":e=Fr;break;case"topAnimationEnd":case"topAnimationIteration":case"topAnimationStart":e=Rr;break;case"topTransitionEnd":e=Br;break;case"topScroll":e=Pr;break;case"topWheel":e=Hr;break;case"topCopy":case"topCut":case"topPaste":e=Mr;break;default:e=M}return t=e.getPooled(o,t,n,r),j(t),t}},Kr=Wr.isInteractiveTopLevelEventType,Yr=[],$r=!0,Gr=Object.freeze({get _enabled(){return $r},setEnabled:Fe,isEnabled:function(){return $r},trapBubbledEvent:Be,trapCapturedEvent:He,dispatchEvent:Ve}),Qr={animationend:We("Animation","AnimationEnd"),animationiteration:We("Animation","AnimationIteration"),animationstart:We("Animation","AnimationStart"),transitionend:We("Transition","TransitionEnd")},Zr={},Xr={};cn.canUseDOM&&(Xr=document.createElement("div").style,"AnimationEvent"in window||(delete Qr.animationend.animation,delete Qr.animationiteration.animation,delete Qr.animationstart.animation),"TransitionEvent"in window||delete Qr.transitionend.transition);var Jr={topAnimationEnd:Ke("animationend"),topAnimationIteration:Ke("animationiteration"),topAnimationStart:Ke("animationstart"),topBlur:"blur",topCancel:"cancel",topChange:"change",topClick:"click",topClose:"close",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topLoad:"load",topLoadStart:"loadstart",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topScroll:"scroll",topSelectionChange:"selectionchange",topTextInput:"textInput",topToggle:"toggle",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topTransitionEnd:Ke("transitionend"),topWheel:"wheel"},eo={topAbort:"abort",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topSeeked:"seeked",topSeeking:"seeking",topStalled:"stalled",topSuspend:"suspend",topTimeUpdate:"timeupdate",topVolumeChange:"volumechange",topWaiting:"waiting"},to={},no=0,ro="_reactListenersID"+(""+Math.random()).slice(2),oo=cn.canUseDOM&&"documentMode"in document&&11>=document.documentMode,io={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"topBlur topContextMenu topFocus topKeyDown topKeyUp topMouseDown topMouseUp topSelectionChange".split(" ")}},ao=null,uo=null,lo=null,so=!1,co={eventTypes:io,extractEvents:function(e,t,n,r){var o,i=r.window===r?r.document:9===r.nodeType?r:r.ownerDocument;if(!(o=!i)){e:{i=Ye(i),o=On.onSelect;for(var a=0;a<o.length;a++){var u=o[a];if(!i.hasOwnProperty(u)||!i[u]){i=!1;break e}}i=!0}o=!i}if(o)return null;switch(i=t?_(t):window,e){case"topFocus":(Q(i)||"true"===i.contentEditable)&&(ao=i,uo=t,lo=null);break;case"topBlur":lo=uo=ao=null;break;case"topMouseDown":so=!0;break;case"topContextMenu":case"topMouseUp":return so=!1,Ze(n,r);case"topSelectionChange":if(oo)break;case"topKeyDown":case"topKeyUp":return Ze(n,r)}return null}};jn.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin TapEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")),kn=Mn.getFiberCurrentPropsFromNode,Sn=Mn.getInstanceFromNode,Cn=Mn.getNodeFromInstance,jn.injectEventPluginsByName({SimpleEventPlugin:Wr,EnterLeaveEventPlugin:Ar,ChangeEventPlugin:Cr,SelectEventPlugin:co,BeforeInputEventPlugin:Zn});var fo=null,po=null;new Set;var ho=void 0,yo=void 0,vo=Array.isArray,mo=bt(!0),bo=bt(!1),go={},_o=Object.freeze({default:Tt}),wo=_o&&Tt||_o,Eo=wo.default?wo.default:wo,Oo="object"==typeof performance&&"function"==typeof performance.now,xo=void 0;xo=Oo?function(){return performance.now()}:function(){return Date.now()};var ko=void 0,So=void 0;if(cn.canUseDOM)if("function"!=typeof requestIdleCallback||"function"!=typeof cancelIdleCallback){var Co=null,Po=!1,jo=-1,To=!1,No=0,Ao=33,Ro=33,Mo=void 0;Mo=Oo?{didTimeout:!1,timeRemaining:function(){var e=No-performance.now();return 0<e?e:0}}:{didTimeout:!1,timeRemaining:function(){var e=No-Date.now();return 0<e?e:0}};var Lo="__reactIdleCallback$"+Math.random().toString(36).slice(2);window.addEventListener("message",function(e){if(e.source===window&&e.data===Lo){if(Po=!1,e=xo(),0>=No-e){if(!(-1!==jo&&jo<=e))return void(To||(To=!0,requestAnimationFrame(Io)));Mo.didTimeout=!0}else Mo.didTimeout=!1;jo=-1,e=Co,Co=null,null!==e&&e(Mo)}},!1);var Io=function(e){To=!1;var t=e-No+Ro;t<Ro&&Ao<Ro?(8>t&&(t=8),Ro=t<Ao?Ao:t):Ao=t,No=e+Ro,Po||(Po=!0,window.postMessage(Lo,"*"))};ko=function(e,t){return Co=e,null!=t&&"number"==typeof t.timeout&&(jo=xo()+t.timeout),To||(To=!0,requestAnimationFrame(Io)),0},So=function(){Co=null,Po=!1,jo=-1}}else ko=window.requestIdleCallback,So=window.cancelIdleCallback;else ko=function(e){return setTimeout(function(){e({timeRemaining:function(){return 1/0},didTimeout:!1})})},So=function(e){clearTimeout(e)};var qo={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"},Uo=void 0,Do=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n)})}:e}(function(e,t){if(e.namespaceURI!==qo.svg||"innerHTML"in e)e.innerHTML=t;else{for(Uo=Uo||document.createElement("div"),Uo.innerHTML="<svg>"+t+"</svg>",t=Uo.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}}),Fo={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Bo=["Webkit","ms","Moz","O"];Object.keys(Fo).forEach(function(e){Bo.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Fo[t]=Fo[e]})});var Ho=fn({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0}),zo=qo.html,Vo=pn.thatReturns(""),Wo=Object.freeze({createElement:Yt,createTextNode:$t,setInitialProperties:Gt,diffProperties:Qt,updateProperties:Zt,diffHydratedProperties:Xt,diffHydratedText:Jt,warnForUnmatchedText:function(){},warnForDeletedHydratableElement:function(){},warnForDeletedHydratableText:function(){},warnForInsertedHydratedElement:function(){},warnForInsertedHydratedText:function(){},restoreControlledState:function(e,t,n){switch(t){case"input":if(ye(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var i=w(o);i||r("90"),ne(o),ye(o,i)}}}break;case"textarea":Ut(e,n);break;case"select":null!=(t=n.value)&&Mt(e,!!n.multiple,t,!1)}}});tr.injectFiberControlledHostComponent(Wo);var Ko=null,Yo=null;en.prototype.render=function(e){this._defer||r("250"),this._hasChildren=!0,this._children=e;var t=this._root._internalRoot,n=this._expirationTime,o=new tn;return $o.updateContainerAtExpirationTime(e,t,null,n,o._onCommit),o},en.prototype.then=function(e){if(this._didComplete)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},en.prototype.commit=function(){var e=this._root._internalRoot,t=e.firstBatch;if(this._defer&&null!==t||r("251"),this._hasChildren){var n=this._expirationTime;if(t!==this){this._hasChildren&&(n=this._expirationTime=t._expirationTime,this.render(this._children));for(var o=null,i=t;i!==this;)o=i,i=i._next;null===o&&r("251"),o._next=i._next,this._next=t,e.firstBatch=this}this._defer=!1,$o.flushRoot(e,n),t=this._next,this._next=null,t=e.firstBatch=t,null!==t&&t._hasChildren&&t.render(t._children)}else this._next=null,this._defer=!1},en.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++)(0,e[t])()}},tn.prototype.then=function(e){if(this._didCommit)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},tn.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++){var n=e[t];"function"!=typeof n&&r("191",n),n()}}},nn.prototype.render=function(e,t){var n=this._internalRoot,r=new tn;return t=void 0===t?null:t,null!==t&&r.then(t),$o.updateContainer(e,n,null,r._onCommit),r},nn.prototype.unmount=function(e){var t=this._internalRoot,n=new tn;return e=void 0===e?null:e,null!==e&&n.then(e),$o.updateContainer(null,t,null,n._onCommit),n},nn.prototype.legacy_renderSubtreeIntoContainer=function(e,t,n){var r=this._internalRoot,o=new tn;return n=void 0===n?null:n,null!==n&&o.then(n),$o.updateContainer(t,r,e,o._onCommit),o},nn.prototype.createBatch=function(){var e=new en(this),t=e._expirationTime,n=this._internalRoot,r=n.firstBatch;if(null===r)n.firstBatch=e,e._next=null;else{for(n=null;null!==r&&r._expirationTime<=t;)n=r,r=r._next;e._next=r,null!==n&&(n._next=e)}return e};var $o=Eo({getRootHostContext:function(e){var t=e.nodeType;switch(t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Bt(null,"");break;default:t=8===t?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Bt(e,t)}return e},getChildHostContext:function(e,t){return Bt(e,t)},getPublicInstance:function(e){return e},prepareForCommit:function(){Ko=$r;var e=dn();if(Qe(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{var n=window.getSelection&&window.getSelection();if(n&&0!==n.rangeCount){t=n.anchorNode;var r=n.anchorOffset,o=n.focusNode;n=n.focusOffset;try{t.nodeType,o.nodeType}catch(e){t=null;break e}var i=0,a=-1,u=-1,l=0,s=0,c=e,f=null;t:for(;;){for(var p;c!==t||0!==r&&3!==c.nodeType||(a=i+r),c!==o||0!==n&&3!==c.nodeType||(u=i+n),3===c.nodeType&&(i+=c.nodeValue.length),null!==(p=c.firstChild);)f=c,c=p;for(;;){if(c===e)break t;if(f===t&&++l===r&&(a=i),f===o&&++s===n&&(u=i),null!==(p=c.nextSibling))break;c=f,f=c.parentNode}c=p}t=-1===a||-1===u?null:{start:a,end:u}}else t=null}t=t||{start:0,end:0}}else t=null;Yo={focusedElem:e,selectionRange:t},Fe(!1)},resetAfterCommit:function(){var e=Yo,t=dn(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&yn(document.documentElement,n)){if(Qe(n))if(t=r.start,e=r.end,void 0===e&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(window.getSelection){t=window.getSelection();var o=n[N()].length;e=Math.min(r.start,o),r=void 0===r.end?e:Math.min(r.end,o),!t.extend&&e>r&&(o=r,r=e,e=o),o=Ge(n,e);var i=Ge(n,r);if(o&&i&&(1!==t.rangeCount||t.anchorNode!==o.node||t.anchorOffset!==o.offset||t.focusNode!==i.node||t.focusOffset!==i.offset)){var a=document.createRange();a.setStart(o.node,o.offset),t.removeAllRanges(),e>r?(t.addRange(a),t.extend(i.node,i.offset)):(a.setEnd(i.node,i.offset),t.addRange(a))}}for(t=[],e=n;e=e.parentNode;)1===e.nodeType&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}Yo=null,Fe(Ko),Ko=null},createInstance:function(e,t,n,r,o){return e=Yt(e,t,n,r),e[An]=o,e[Rn]=t,e},appendInitialChild:function(e,t){e.appendChild(t)},finalizeInitialChildren:function(e,t,n,r){return Gt(e,t,n,r),on(t,n)},prepareUpdate:function(e,t,n,r,o){return Qt(e,t,n,r,o)},shouldSetTextContent:function(e,t){return"textarea"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&"string"==typeof t.dangerouslySetInnerHTML.__html},shouldDeprioritizeSubtree:function(e,t){return!!t.hidden},createTextInstance:function(e,t,n,r){return e=$t(e,t),e[An]=r,e},now:xo,mutation:{commitMount:function(e,t,n){on(t,n)&&e.focus()},commitUpdate:function(e,t,n,r,o){e[Rn]=o,Zt(e,t,n,r,o)},resetTextContent:function(e){Ht(e,"")},commitTextUpdate:function(e,t,n){e.nodeValue=n},appendChild:function(e,t){e.appendChild(t)},appendChildToContainer:function(e,t){8===e.nodeType?e.parentNode.insertBefore(t,e):e.appendChild(t)},insertBefore:function(e,t,n){e.insertBefore(t,n)},insertInContainerBefore:function(e,t,n){8===e.nodeType?e.parentNode.insertBefore(t,n):e.insertBefore(t,n)},removeChild:function(e,t){e.removeChild(t)},removeChildFromContainer:function(e,t){8===e.nodeType?e.parentNode.removeChild(t):e.removeChild(t)}},hydration:{canHydrateInstance:function(e,t){return 1!==e.nodeType||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e},canHydrateTextInstance:function(e,t){return""===t||3!==e.nodeType?null:e},getNextHydratableSibling:function(e){for(e=e.nextSibling;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e},getFirstHydratableChild:function(e){for(e=e.firstChild;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e},hydrateInstance:function(e,t,n,r,o,i){return e[An]=i,e[Rn]=n,Xt(e,t,n,o,r)},hydrateTextInstance:function(e,t,n){return e[An]=n,Jt(e,t)},didNotMatchHydratedContainerTextInstance:function(){},didNotMatchHydratedTextInstance:function(){},didNotHydrateContainerInstance:function(){},didNotHydrateInstance:function(){},didNotFindHydratableContainerInstance:function(){},didNotFindHydratableContainerTextInstance:function(){},didNotFindHydratableInstance:function(){},didNotFindHydratableTextInstance:function(){}},scheduleDeferredCallback:ko,cancelDeferredCallback:So}),Go=$o;K=Go.batchedUpdates,Y=Go.interactiveUpdates,$=Go.flushInteractiveUpdates;var Qo={createPortal:ln,findDOMNode:function(e){if(null==e)return null;if(1===e.nodeType)return e;var t=e._reactInternalFiber;if(t)return $o.findHostInstance(t);"function"==typeof e.render?r("188"):r("213",Object.keys(e))},hydrate:function(e,t,n){return un(null,e,t,!0,n)},render:function(e,t,n){return un(null,e,t,!1,n)},unstable_renderSubtreeIntoContainer:function(e,t,n,o){return(null==e||void 0===e._reactInternalFiber)&&r("38"),un(e,t,n,!1,o)},unmountComponentAtNode:function(e){return rn(e)||r("40"),!!e._reactRootContainer&&($o.unbatchedUpdates(function(){un(null,null,e,!1,function(){e._reactRootContainer=null})}),!0)},unstable_createPortal:function(){return ln.apply(void 0,arguments)},unstable_batchedUpdates:$o.batchedUpdates,unstable_deferredUpdates:$o.deferredUpdates,flushSync:$o.flushSync,unstable_flushControlled:$o.flushControlled,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{EventPluginHub:Tn,EventPluginRegistry:xn,EventPropagators:Ln,ReactControlledComponent:nr,ReactDOMComponentTree:Mn,ReactDOMEventListener:Gr},unstable_createRoot:function(e,t){return new nn(e,!0,null!=t&&!0===t.hydrate)}};$o.injectIntoDevTools({findFiberByHostInstance:g,bundleType:0,version:"16.3.0",rendererPackageName:"react-dom"});var Zo=Object.freeze({default:Qo}),Xo=Zo&&Qo||Zo;e.exports=Xo.default?Xo.default:Xo},function(e,t,n){"use strict";var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o={canUseDOM:r,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:r&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:r&&!!window.screen,isInWorker:!r};e.exports=o},function(e,t,n){"use strict";function r(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}e.exports=r},function(e,t,n){"use strict";function r(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!==e&&t!==t}function o(e,t){if(r(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(var a=0;a<n.length;a++)if(!i.call(t,n[a])||!r(e[n[a]],t[n[a]]))return!1;return!0}var i=Object.prototype.hasOwnProperty;e.exports=o},function(e,t,n){"use strict";function r(e,t){return!(!e||!t)&&(e===t||!o(e)&&(o(t)?r(e,t.parentNode):"contains"in e?e.contains(t):!!e.compareDocumentPosition&&!!(16&e.compareDocumentPosition(t))))}var o=n(120);e.exports=r},function(e,t,n){"use strict";function r(e){return o(e)&&3==e.nodeType}var o=n(121);e.exports=r},function(e,t,n){"use strict";function r(e){var t=e?e.ownerDocument||e:document,n=t.defaultView||window;return!(!e||!("function"==typeof n.Node?e instanceof n.Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}e.exports=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(17),i=n(137),a=r(i),u=n(138),l=r(u),s=n(212),c=(r(s),[a.default]),f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(0,o.createStore)(l.default,e,o.applyMiddleware.apply(void 0,c))};t.default=f},function(e,t,n){"use strict";function r(e){return null==e?void 0===e?l:u:s&&s in Object(e)?Object(i.a)(e):Object(a.a)(e)}var o=n(67),i=n(126),a=n(127),u="[object Null]",l="[object Undefined]",s=o.a?o.a.toStringTag:void 0;t.a=r},function(e,t,n){"use strict";var r=n(125),o="object"==typeof self&&self&&self.Object===Object&&self,i=r.a||o||Function("return this")();t.a=i},function(e,t,n){"use strict";(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.a=n}).call(t,n(18))},function(e,t,n){"use strict";function r(e){var t=a.call(e,l),n=e[l];try{e[l]=void 0;var r=!0}catch(e){}var o=u.call(e);return r&&(t?e[l]=n:delete e[l]),o}var o=n(67),i=Object.prototype,a=i.hasOwnProperty,u=i.toString,l=o.a?o.a.toStringTag:void 0;t.a=r},function(e,t,n){"use strict";function r(e){return i.call(e)}var o=Object.prototype,i=o.toString;t.a=r},function(e,t,n){"use strict";var r=n(129),o=Object(r.a)(Object.getPrototypeOf,Object);t.a=o},function(e,t,n){"use strict";function r(e,t){return function(n){return e(t(n))}}t.a=r},function(e,t,n){"use strict";function r(e){return null!=e&&"object"==typeof e}t.a=r},function(e,t,n){"use strict";(function(e,r){var o,i=n(133);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var a=Object(i.a)(o);t.a=a}).call(t,n(18),n(132)(e))},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}t.a=r},function(e,t,n){"use strict";function r(e,t){var n=t&&t.type;return"Given action "+(n&&'"'+n.toString()+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function o(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:a.a.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:"@@redux/PROBE_UNKNOWN_ACTION_"+Math.random().toString(36).substring(7).split("").join(".")}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+a.a.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}function i(e){for(var t=Object.keys(e),n={},i=0;i<t.length;i++){var a=t[i];"function"==typeof e[a]&&(n[a]=e[a])}var u=Object.keys(n),l=void 0;try{o(n)}catch(e){l=e}return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];if(l)throw l;for(var o=!1,i={},a=0;a<u.length;a++){var s=u[a],c=n[s],f=e[s],p=c(f,t);if(void 0===p){var d=r(s,t);throw new Error(d)}i[s]=p,o=o||p!==f}return o?i:e}}t.a=i;var a=n(66);n(38),n(68)},function(e,t,n){"use strict";function r(e,t){return function(){return t(e.apply(void 0,arguments))}}function o(e,t){if("function"==typeof e)return r(e,t);if("object"!=typeof e||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),o={},i=0;i<n.length;i++){var a=n[i],u=e[a];"function"==typeof u&&(o[a]=r(u,t))}return o}t.a=o},function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(n,r,a){var u=e(n,r,a),l=u.dispatch,s=[],c={getState:u.getState,dispatch:function(e){return l(e)}};return s=t.map(function(e){return e(c)}),l=o.a.apply(void 0,s)(u.dispatch),i({},u,{dispatch:l})}}}t.a=r;var o=n(69),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}},function(e,t,n){"use strict";function r(e){return function(t){var n=t.dispatch,r=t.getState;return function(t){return function(o){return"function"==typeof o?o(n,r,e):t(o)}}}}t.__esModule=!0;var o=r();o.withExtraArgument=r,t.default=o},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(17),i=n(139),a=r(i),u=n(202),l=r(u),s=n(206),c=r(s),f=n(208),p=r(f),d=n(209),h=r(d),y=n(210),v=r(y);t.default=(0,o.combineReducers)({session:a.default,ui:c.default,errors:l.default,users:p.default,stories:h.default,comments:v.default})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(12),o=n(26),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(9),u=Object.freeze({currentUser:null}),l=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,t=arguments[1];Object.freeze(e);var n=void 0,o=void 0;switch(t.type){case r.RECEIVE_CURRENT_USER:var l=t.currentUser;return(0,i.default)({},{currentUser:l});case a.RECEIVE_FOLLOW:return n=(0,i.default)({},e),Object.values(Object.values(n)[0])[0].following.push(t.follow.following_id),(0,i.default)({},n);case a.REMOVE_FOLLOW:return n=(0,i.default)({},e),o=Object.values(Object.values(n)[0])[0].following.indexOf(t.follow.following_id),Object.values(Object.values(n)[0])[0].following.splice(o,1),n;case a.RECEIVE_LIKE:return n=(0,i.default)({},e),Object.values(Object.values(n)[0])[0].likes.push(t.like.story_id),n;case a.REMOVE_LIKE:return n=(0,i.default)({},e),o=Object.values(Object.values(n)[0])[0].likes.indexOf(t.like.story_id),Object.values(Object.values(n)[0])[0].likes.splice(o,1),n;default:return e}};t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.signup=function(e){return $.ajax({url:"api/users",method:"POST",data:{user:e}})},t.login=function(e){return $.ajax({url:"api/session",method:"POST",data:{user:e}})},t.logout=function(){return $.ajax({url:"api/session",method:"DELETE"})}},function(e,t,n){function r(e,t,n,f,p){e!==t&&a(t,function(a,s){if(l(a))p||(p=new o),u(e,t,s,n,r,f,p);else{var d=f?f(c(e,s),a,s+"",e,t,p):void 0;void 0===d&&(d=a),i(e,s,d)}},s)}var o=n(39),i=n(72),a=n(74),u=n(171),l=n(10),s=n(79),c=n(78);e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e);return!(n<0)&&(n==t.length-1?t.pop():a.call(t,n,1),--this.size,!0)}var o=n(28),i=Array.prototype,a=i.splice;e.exports=r},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e);return n<0?void 0:t[n][1]}var o=n(28);e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(28);e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(28);e.exports=r},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(27);e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){var n=this.__data__;if(n instanceof o){var r=n.__data__;if(!i||r.length<u-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new a(r)}return n.set(e,t),this.size=n.size,this}var o=n(27),i=n(40),a=n(42),u=200;e.exports=r},function(e,t,n){function r(e){return!(!a(e)||i(e))&&(o(e)?h:s).test(u(e))}var o=n(41),i=n(155),a=n(10),u=n(71),l=/[\\^$.*+?()[\]{}|]/g,s=/^\[object .+?Constructor\]$/,c=Function.prototype,f=Object.prototype,p=c.toString,d=f.hasOwnProperty,h=RegExp("^"+p.call(d).replace(l,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=r},function(e,t,n){function r(e){var t=a.call(e,l),n=e[l];try{e[l]=void 0;var r=!0}catch(e){}var o=u.call(e);return r&&(t?e[l]=n:delete e[l]),o}var o=n(29),i=Object.prototype,a=i.hasOwnProperty,u=i.toString,l=o?o.toStringTag:void 0;e.exports=r},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString;e.exports=n},function(e,t,n){function r(e){return!!i&&i in e}var o=n(156),i=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}();e.exports=r},function(e,t,n){var r=n(7),o=r["__core-js_shared__"];e.exports=o},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(a||i),string:new o}}var o=n(159),i=n(27),a=n(40);e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(160),i=n(161),a=n(162),u=n(163),l=n(164);r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=a,r.prototype.has=u,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(30);e.exports=r},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__;if(o){var n=t[e];return n===i?void 0:n}return u.call(t,e)?t[e]:void 0}var o=n(30),i="__lodash_hash_undefined__",a=Object.prototype,u=a.hasOwnProperty;e.exports=r},function(e,t,n){function r(e){var t=this.__data__;return o?void 0!==t[e]:a.call(t,e)}var o=n(30),i=Object.prototype,a=i.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?i:t,this}var o=n(30),i="__lodash_hash_undefined__";e.exports=r},function(e,t,n){function r(e){var t=o(this,e).delete(e);return this.size-=t?1:0,t}var o=n(31);e.exports=r},function(e,t){function n(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(31);e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(31);e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(31);e.exports=r},function(e,t){function n(e){return function(t,n,r){for(var o=-1,i=Object(t),a=r(t),u=a.length;u--;){var l=a[e?u:++o];if(!1===n(i[l],l,i))break}return t}}e.exports=n},function(e,t,n){function r(e,t,n,r,g,_,w){var E=m(e,n),O=m(t,n),x=w.get(O);if(x)return void o(e,n,x);var k=_?_(E,O,n+"",e,t,w):void 0,S=void 0===k;if(S){var C=c(O),P=!C&&p(O),j=!C&&!P&&v(O);k=O,C||P||j?c(E)?k=E:f(E)?k=u(E):P?(S=!1,k=i(O,!0)):j?(S=!1,k=a(O,!0)):k=[]:y(O)||s(O)?(k=E,s(E)?k=b(E):(!h(E)||r&&d(E))&&(k=l(O))):S=!1}S&&(w.set(O,k),g(k,O,r,_,w),w.delete(O)),o(e,n,k)}var o=n(72),i=n(172),a=n(173),u=n(175),l=n(176),s=n(46),c=n(8),f=n(179),p=n(48),d=n(41),h=n(10),y=n(181),v=n(49),m=n(78),b=n(185);e.exports=r},function(e,t,n){(function(e){function r(e,t){if(t)return e.slice();var n=e.length,r=s?s(n):new e.constructor(n);return e.copy(r),r}var o=n(7),i="object"==typeof t&&t&&!t.nodeType&&t,a=i&&"object"==typeof e&&e&&!e.nodeType&&e,u=a&&a.exports===i,l=u?o.Buffer:void 0,s=l?l.allocUnsafe:void 0;e.exports=r}).call(t,n(44)(e))},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}var o=n(174);e.exports=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength);return new o(t).set(new o(e)),t}var o=n(75);e.exports=r},function(e,t){function n(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}e.exports=n},function(e,t,n){function r(e){return"function"!=typeof e.constructor||a(e)?{}:o(i(e))}var o=n(177),i=n(76),a=n(45);e.exports=r},function(e,t,n){var r=n(10),o=Object.create,i=function(){function e(){}return function(t){if(!r(t))return{};if(o)return o(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();e.exports=i},function(e,t,n){function r(e){return i(e)&&o(e)==a}var o=n(15),i=n(14),a="[object Arguments]";e.exports=r},function(e,t,n){function r(e){return i(e)&&o(e)}var o=n(16),i=n(14);e.exports=r},function(e,t){function n(){return!1}e.exports=n},function(e,t,n){function r(e){if(!a(e)||o(e)!=u)return!1;var t=i(e);if(null===t)return!0;var n=f.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==p}var o=n(15),i=n(76),a=n(14),u="[object Object]",l=Function.prototype,s=Object.prototype,c=l.toString,f=s.hasOwnProperty,p=c.call(Object);e.exports=r},function(e,t,n){function r(e){return a(e)&&i(e.length)&&!!u[o(e)]}var o=n(15),i=n(47),a=n(14),u={};u["[object Float32Array]"]=u["[object Float64Array]"]=u["[object Int8Array]"]=u["[object Int16Array]"]=u["[object Int32Array]"]=u["[object Uint8Array]"]=u["[object Uint8ClampedArray]"]=u["[object Uint16Array]"]=u["[object Uint32Array]"]=!0,u["[object Arguments]"]=u["[object Array]"]=u["[object ArrayBuffer]"]=u["[object Boolean]"]=u["[object DataView]"]=u["[object Date]"]=u["[object Error]"]=u["[object Function]"]=u["[object Map]"]=u["[object Number]"]=u["[object Object]"]=u["[object RegExp]"]=u["[object Set]"]=u["[object String]"]=u["[object WeakMap]"]=!1,e.exports=r},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){(function(e){var r=n(70),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=i&&i.exports===o,u=a&&r.process,l=function(){try{return u&&u.binding&&u.binding("util")}catch(e){}}();e.exports=l}).call(t,n(44)(e))},function(e,t,n){function r(e){return o(e,i(e))}var o=n(186),i=n(79);e.exports=r},function(e,t,n){function r(e,t,n,r){var a=!n;n||(n={});for(var u=-1,l=t.length;++u<l;){var s=t[u],c=r?r(n[s],e[s],s,n,e):void 0;void 0===c&&(c=e[s]),a?i(n,s,c):o(n,s,c)}return n}var o=n(187),i=n(43);e.exports=r},function(e,t,n){function r(e,t,n){var r=e[t];u.call(e,t)&&i(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(43),i=n(19),a=Object.prototype,u=a.hasOwnProperty;e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}e.exports=n},function(e,t,n){function r(e){if(!o(e))return a(e);var t=i(e),n=[];for(var r in e)("constructor"!=r||!t&&l.call(e,r))&&n.push(r);return n}var o=n(10),i=n(45),a=n(190),u=Object.prototype,l=u.hasOwnProperty;e.exports=r},function(e,t){function n(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}e.exports=n},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,a=o>1?n[o-1]:void 0,u=o>2?n[2]:void 0;for(a=e.length>3&&"function"==typeof a?(o--,a):void 0,u&&i(n[0],n[1],u)&&(a=o<3?void 0:a,o=1),t=Object(t);++r<o;){var l=n[r];l&&e(t,l,r,a)}return t})}var o=n(192),i=n(81);e.exports=r},function(e,t,n){function r(e,t){return a(i(e,t,o),e+"")}var o=n(51),i=n(193),a=n(195);e.exports=r},function(e,t,n){function r(e,t,n){return t=i(void 0===t?e.length-1:t,0),function(){for(var r=arguments,a=-1,u=i(r.length-t,0),l=Array(u);++a<u;)l[a]=r[t+a];a=-1;for(var s=Array(t+1);++a<t;)s[a]=r[a];return s[t]=n(l),o(e,this,s)}}var o=n(194),i=Math.max;e.exports=r},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){var r=n(196),o=n(198),i=o(r);e.exports=i},function(e,t,n){var r=n(197),o=n(73),i=n(51),a=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i;e.exports=a},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t){function n(e){var t=0,n=0;return function(){var a=i(),u=o-(a-n);if(n=a,u>0){if(++t>=r)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}var r=800,o=16,i=Date.now;e.exports=n},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchUser=function(e){return $.ajax({url:"api/users/"+e,method:"GET"})},t.updateUser=function(e){return $.ajax({url:"api/users/"+e.get("user[id]"),method:"PATCH",dataType:"json",contentType:!1,processData:!1,data:e})},t.searchTaggedUsers=function(e){return $.ajax({url:"api/search/users/"+e,method:"GET"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.createLike=function(e){return $.ajax({url:"api/likes",method:"POST",data:{like:e}})},t.deleteLike=function(e){return $.ajax({url:"api/likes/"+e.user_id+"/"+e.story_id,method:"DELETE"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.createFollow=function(e){return $.ajax({url:"api/follows",method:"POST",data:{follow:e}})},t.deleteFollow=function(e){return $.ajax({url:"api/follows/"+e.follower_id+"/"+e.following_id,method:"DELETE"})}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(17),i=n(203),a=r(i),u=n(204),l=r(u),s=(0,o.combineReducers)({session:a.default,form:l.default});t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(12),o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_CURRENT_USER:return[];case r.RECEIVE_SESSION_ERRORS:return t.errors;default:return e}};t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),o=n(9),i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case o.RECEIVE_USER:case r.RECEIVE_STORY:return[];case r.RECEIVE_FORM_ERRORS:case o.RECEIVE_USER_FORM_ERRORS:return t.errors;default:return e}};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchStory=function(e){return $.ajax({url:"api/stories/"+e,method:"GET"})},t.searchTaggedStories=function(e){return $.ajax({url:"api/search/stories/"+e,method:"GET"})},t.fetchLikedStories=function(e){return $.ajax({url:"api/users/"+e+"/likes",method:"GET"})},t.fetchUserStories=function(e){return $.ajax({url:"api/stories/from/"+e,method:"GET"})},t.fetchStories=function(){return $.ajax({url:"api/stories",method:"GET"})},t.createStory=function(e){return $.ajax({url:"api/stories",method:"POST",dataType:"json",contentType:!1,processData:!1,data:e})},t.updateStory=function(e){return $.ajax({url:"api/stories/"+e.get("story[id]"),method:"PATCH",dataType:"json",contentType:!1,processData:!1,data:e})},t.deleteStory=function(e){return $.ajax({url:"api/stories/"+e,method:"DELETE"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(17),o=n(207),i=function(e){return e&&e.__esModule?e:{default:e}}(o);t.default=(0,r.combineReducers)({modal:i.default})},function(e,t,n){"use strict";function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments[1];switch(t.type){case o.OPEN_MODAL:return t.modal;case o.CLOSE_MODAL:return null;default:return e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;var o=n(6)},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0});var o=n(9),i=n(26),a=function(e){return e&&e.__esModule?e:{default:e}}(i),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1],n=void 0,i=void 0;switch(Object.freeze(e),t.type){case o.RECEIVE_USER:return(0,a.default)({},e,t.user);case o.RECEIVE_USERS:return(0,a.default)({},t.users);case o.RECEIVE_LIKE:return n=(0,a.default)({},e),console.log(n),Object.values(n)[0].likes.push(t.like.story_id),n;case o.REMOVE_LIKE:n=(0,a.default)({},e);var u=Object.values(n)[0],l=Object.keys(n)[0];return i=u.likes.indexOf(t.like.id),u.likes.splice(i,1),(0,a.default)({},r({},l,u));case o.RECEIVE_FOLLOW:return n=(0,a.default)({},e),Object.values(n)[0].followers.push(t.follow.follower_id),(0,a.default)({},n);case o.REMOVE_FOLLOW:return n=(0,a.default)({},e),i=Object.values(n)[0].followers.indexOf(t.follow.follower_id),Object.values(n)[0].followers.splice(i,1),n;default:return e}};t.default=u},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0});var o=n(11),i=n(26),a=function(e){return e&&e.__esModule?e:{default:e}}(i),u=n(9),l=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n=void 0;switch(t.type){case o.RECEIVE_STORY:return(0,a.default)({},t.story);case o.RECEIVE_STORIES:return(0,a.default)({},t.stories);case o.REMOVE_STORY:return n=(0,a.default)({},e),delete n[t.storyId],n;case u.RECEIVE_LIKE:return n=(0,a.default)({},e),Object.values(n)[0].likes.push(t.like.user_id),n;case u.REMOVE_LIKE:n=(0,a.default)({},e);var i=Object.values(n)[0],l=Object.keys(n)[0],s=i.likes.indexOf(t.like.user_id);return i.likes.splice(s,1),(0,a.default)({},r({},l,i));default:return e}};t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(32),o=n(26),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_COMMENT:return(0,i.default)({},e,t.comment);case r.RECEIVE_COMMENTS:return(0,i.default)({},t.comments);case r.REMOVE_COMMENT:var n=(0,i.default)({},e);return delete n[t.commentId],n;default:return e}};t.default=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchComments=function(e){return $.ajax({url:"api/stories/"+e+"/comments",method:"GET"})},t.fetchUserComments=function(e){return $.ajax({url:"api/comments/from/"+e,method:"GET"})},t.createComment=function(e){return $.ajax({url:"api/comments",method:"POST",data:{comment:e}})},t.deleteComment=function(e){return $.ajax({url:"api/comments/"+e.id,method:"DELETE"})}},function(e,t,n){(function(e){!function(e,n){n(t)}(0,function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function i(e,t){i.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function a(e,t){a.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function u(e,t,n){u.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function l(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function s(e){var t=void 0===e?"undefined":T(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function c(e,t,n,r,f,p,d){f=f||[],d=d||[];var h=f.slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(h,p))return;if("object"===(void 0===r?"undefined":T(r))){if(r.prefilter&&r.prefilter(h,p))return;if(r.normalize){var y=r.normalize(h,p,e,t);y&&(e=y[0],t=y[1])}}}h.push(p)}"regexp"===s(e)&&"regexp"===s(t)&&(e=e.toString(),t=t.toString());var v=void 0===e?"undefined":T(e),m=void 0===t?"undefined":T(t),b="undefined"!==v||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),g="undefined"!==m||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!b&&g)n(new i(h,t));else if(!g&&b)n(new a(h,e));else if(s(e)!==s(t))n(new o(h,e,t));else if("date"===s(e)&&e-t!=0)n(new o(h,e,t));else if("object"===v&&null!==e&&null!==t)if(d.filter(function(t){return t.lhs===e}).length)e!==t&&n(new o(h,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var _;for(e.length,_=0;_<e.length;_++)_>=t.length?n(new u(h,_,new a(void 0,e[_]))):c(e[_],t[_],n,r,h,_,d);for(;_<t.length;)n(new u(h,_,new i(void 0,t[_++])))}else{var w=Object.keys(e),E=Object.keys(t);w.forEach(function(o,i){var a=E.indexOf(o);a>=0?(c(e[o],t[o],n,r,h,o,d),E=l(E,a)):c(e[o],void 0,n,r,h,o,d)}),E.forEach(function(e){c(void 0,t[e],n,r,h,e,d)})}d.length=d.length-1}else e!==t&&("number"===v&&isNaN(e)&&isNaN(t)||n(new o(h,e,t)))}function f(e,t,n,r){return r=r||[],c(e,t,function(e){e&&r.push(e)},n),r.length?r:void 0}function p(e,t,n){if(n.path&&n.path.length){var r,o=e[t],i=n.path.length-1;for(r=0;r<i;r++)o=o[n.path[r]];switch(n.kind){case"A":p(o[n.path[r]],n.index,n.item);break;case"D":delete o[n.path[r]];break;case"E":case"N":o[n.path[r]]=n.rhs}}else switch(n.kind){case"A":p(e[t],n.index,n.item);break;case"D":e=l(e,t);break;case"E":case"N":e[t]=n.rhs}return e}function d(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,i=n.path?n.path.length-1:0;++o<i;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":p(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function h(e,t,n){if(n.path&&n.path.length){var r,o=e[t],i=n.path.length-1;for(r=0;r<i;r++)o=o[n.path[r]];switch(n.kind){case"A":h(o[n.path[r]],n.index,n.item);break;case"D":case"E":o[n.path[r]]=n.lhs;break;case"N":delete o[n.path[r]]}}else switch(n.kind){case"A":h(e[t],n.index,n.item);break;case"D":case"E":e[t]=n.lhs;break;case"N":e=l(e,t)}return e}function y(e,t,n){if(e&&t&&n&&n.kind){var r,o,i=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===i[n.path[r]]&&(i[n.path[r]]={}),i=i[n.path[r]];switch(n.kind){case"A":h(i[n.path[r]],n.index,n.item);break;case"D":case"E":i[n.path[r]]=n.lhs;break;case"N":delete i[n.path[r]]}}}function v(e,t,n){if(e&&t){c(e,t,function(r){n&&!n(e,t,r)||d(e,t,r)})}}function m(e){return"color: "+R[e].color+"; font-weight: bold"}function b(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+i+"]",a];default:return[]}}function g(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach(function(e){var t=e.kind,r=b(e);n.log.apply(n,["%c "+R[t].text,m(t)].concat(N(r)))}):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function _(e,t,n,r){switch(void 0===e?"undefined":T(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,N(n)):e[r];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+r),n&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function E(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,u=t.colors,l=t.level,s=t.diff,c=void 0===t.titleFormatter;e.forEach(function(o,f){var p=o.started,d=o.startedTime,h=o.action,y=o.prevState,v=o.error,m=o.took,b=o.nextState,w=e[f+1];w&&(b=w.prevState,m=w.started-p);var E=r(h),O="function"==typeof a?a(function(){return b},h,o):a,x=P(d),k=u.title?"color: "+u.title(E)+";":"",S=["color: gray; font-weight: lighter;"];S.push(k),t.timestamp&&S.push("color: gray; font-weight: lighter;"),t.duration&&S.push("color: gray; font-weight: lighter;");var C=i(E,x,m);try{O?u.title&&c?n.groupCollapsed.apply(n,["%c "+C].concat(S)):n.groupCollapsed(C):u.title&&c?n.group.apply(n,["%c "+C].concat(S)):n.group(C)}catch(e){n.log(C)}var j=_(l,E,[y],"prevState"),T=_(l,E,[E],"action"),N=_(l,E,[v,y],"error"),A=_(l,E,[b],"nextState");if(j)if(u.prevState){var R="color: "+u.prevState(y)+"; font-weight: bold";n[j]("%c prev state",R,y)}else n[j]("prev state",y);if(T)if(u.action){var M="color: "+u.action(E)+"; font-weight: bold";n[T]("%c action    ",M,E)}else n[T]("action    ",E);if(v&&N)if(u.error){var L="color: "+u.error(v,y)+"; font-weight: bold;";n[N]("%c error     ",L,v)}else n[N]("error     ",v);if(A)if(u.nextState){var I="color: "+u.nextState(b)+"; font-weight: bold";n[A]("%c next state",I,b)}else n[A]("next state",b);s&&g(y,b,n,O);try{n.groupEnd()}catch(e){n.log("—— log end ——")}})}function O(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},M,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,u=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var l=[];return function(e){var n=e.getState;return function(e){return function(s){if("function"==typeof i&&!i(n,s))return e(s);var c={};l.push(c),c.started=j.now(),c.startedTime=new Date,c.prevState=r(n()),c.action=s;var f=void 0;if(a)try{f=e(s)}catch(e){c.error=o(e)}else f=e(s);c.took=j.now()-c.started,c.nextState=r(n());var p=t.diff&&"function"==typeof u?u(n,s):t.diff;if(E(l,Object.assign({},t,{diff:p})),l.length=0,c.error)throw c.error;return f}}}}var x,k,S=function(e,t){return new Array(t+1).join(e)},C=function(e,t){return S("0",t-e.toString().length)+e},P=function(e){return C(e.getHours(),2)+":"+C(e.getMinutes(),2)+":"+C(e.getSeconds(),2)+"."+C(e.getMilliseconds(),3)},j="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},N=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},A=[];x="object"===(void 0===e?"undefined":T(e))&&e?e:"undefined"!=typeof window?window:{},k=x.DeepDiff,k&&A.push(function(){void 0!==k&&x.DeepDiff===f&&(x.DeepDiff=k,k=void 0)}),n(o,r),n(i,r),n(a,r),n(u,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:c,enumerable:!0},applyDiff:{value:v,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:y,enumerable:!0},isConflict:{value:function(){return void 0!==k},enumerable:!0},noConflict:{value:function(){return A&&(A.forEach(function(e){e()}),A=null),f},enumerable:!0}});var R={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},M={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},L=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?O()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=M,t.createLogger=O,t.logger=L,t.default=L,Object.defineProperty(t,"__esModule",{value:!0})})}).call(t,n(18))},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(1),u=n(4),l=n(250),s=r(l),c=function(e){var t=e.store;return i.default.createElement(a.Provider,{store:t},i.default.createElement(u.HashRouter,null,i.default.createElement(s.default,null)))};t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"store",n=arguments[1],a=n||t+"Subscription",l=function(e){function n(i,a){r(this,n);var u=o(this,e.call(this,i,a));return u[t]=i.store,u}return i(n,e),n.prototype.getChildContext=function(){var e;return e={},e[t]=this[t],e[a]=null,e},n.prototype.render=function(){return u.Children.only(this.props.children)},n}(u.Component);return l.propTypes={store:c.a.isRequired,children:s.a.element.isRequired},l.childContextTypes=(e={},e[t]=c.a.isRequired,e[a]=c.b,e),l}t.a=a;var u=n(0),l=(n.n(u),n(2)),s=n.n(l),c=n(83);n(52);t.b=a()},function(e,t,n){"use strict";var r=n(25),o=n(82),i=n(216);e.exports=function(){function e(e,t,n,r,a,u){u!==i&&o(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t};return n.checkPropTypes=r,n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){var e=[],t=[];return{clear:function(){t=i,e=i},notify:function(){for(var n=e=t,r=0;r<n.length;r++)n[r]()},get:function(){return t},subscribe:function(n){var r=!0;return t===e&&(t=e.slice()),t.push(n),function(){r&&e!==i&&(r=!1,t===e&&(t=e.slice()),t.splice(t.indexOf(n),1))}}}}n.d(t,"a",function(){return u});var i=null,a={notify:function(){}},u=function(){function e(t,n,o){r(this,e),this.store=t,this.parentSub=n,this.onStateChange=o,this.unsubscribe=null,this.listeners=a}return e.prototype.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},e.prototype.notifyNestedSubs=function(){this.listeners.notify()},e.prototype.isSubscribed=function(){return Boolean(this.unsubscribe)},e.prototype.trySubscribe=function(){this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.onStateChange):this.store.subscribe(this.onStateChange),this.listeners=o())},e.prototype.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=a)},e}()},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function i(e,t){return e===t}var a=n(84),u=n(219),l=n(220),s=n(221),c=n(222),f=n(223),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.connectHOC,n=void 0===t?a.a:t,d=e.mapStateToPropsFactories,h=void 0===d?s.a:d,y=e.mapDispatchToPropsFactories,v=void 0===y?l.a:y,m=e.mergePropsFactories,b=void 0===m?c.a:m,g=e.selectorFactory,_=void 0===g?f.a:g;return function(e,t,a){var l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},s=l.pure,c=void 0===s||s,f=l.areStatesEqual,d=void 0===f?i:f,y=l.areOwnPropsEqual,m=void 0===y?u.a:y,g=l.areStatePropsEqual,w=void 0===g?u.a:g,E=l.areMergedPropsEqual,O=void 0===E?u.a:E,x=r(l,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),k=o(e,h,"mapStateToProps"),S=o(t,v,"mapDispatchToProps"),C=o(a,b,"mergeProps");return n(_,p({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:k,initMapDispatchToProps:S,initMergeProps:C,pure:c,areStatesEqual:d,areOwnPropsEqual:m,areStatePropsEqual:w,areMergedPropsEqual:O},x))}}()},function(e,t,n){"use strict";function r(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!==e&&t!==t}function o(e,t){if(r(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(var a=0;a<n.length;a++)if(!i.call(t,n[a])||!r(e[n[a]],t[n[a]]))return!1;return!0}t.a=o;var i=Object.prototype.hasOwnProperty},function(e,t,n){"use strict";function r(e){return"function"==typeof e?Object(u.b)(e,"mapDispatchToProps"):void 0}function o(e){return e?void 0:Object(u.a)(function(e){return{dispatch:e}})}function i(e){return e&&"object"==typeof e?Object(u.a)(function(t){return Object(a.bindActionCreators)(e,t)}):void 0}var a=n(17),u=n(86);t.a=[r,o,i]},function(e,t,n){"use strict";function r(e){return"function"==typeof e?Object(i.b)(e,"mapStateToProps"):void 0}function o(e){return e?void 0:Object(i.a)(function(){return{}})}var i=n(86);t.a=[r,o]},function(e,t,n){"use strict";function r(e,t,n){return u({},n,e,t)}function o(e){return function(t,n){var r=(n.displayName,n.pure),o=n.areMergedPropsEqual,i=!1,a=void 0;return function(t,n,u){var l=e(t,n,u);return i?r&&o(l,a)||(a=l):(i=!0,a=l),a}}}function i(e){return"function"==typeof e?o(e):void 0}function a(e){return e?void 0:function(){return r}}var u=(n(87),Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e});t.a=[i,a]},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t,n,r){return function(o,i){return n(e(o,i),t(r,i),i)}}function i(e,t,n,r,o){function i(o,i){return h=o,y=i,v=e(h,y),m=t(r,y),b=n(v,m,y),d=!0,b}function a(){return v=e(h,y),t.dependsOnOwnProps&&(m=t(r,y)),b=n(v,m,y)}function u(){return e.dependsOnOwnProps&&(v=e(h,y)),t.dependsOnOwnProps&&(m=t(r,y)),b=n(v,m,y)}function l(){var t=e(h,y),r=!p(t,v);return v=t,r&&(b=n(v,m,y)),b}function s(e,t){var n=!f(t,y),r=!c(e,h);return h=e,y=t,n&&r?a():n?u():r?l():b}var c=o.areStatesEqual,f=o.areOwnPropsEqual,p=o.areStatePropsEqual,d=!1,h=void 0,y=void 0,v=void 0,m=void 0,b=void 0;return function(e,t){return d?s(e,t):i(e,t)}}function a(e,t){var n=t.initMapStateToProps,a=t.initMapDispatchToProps,u=t.initMergeProps,l=r(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),s=n(e,l),c=a(e,l),f=u(e,l);return(l.pure?i:o)(s,c,f,e,l)}t.a=a;n(224)},function(e,t,n){"use strict";n(52)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(3),u=n.n(a),l=n(0),s=n.n(l),c=n(2),f=n.n(c),p=n(226),d=n.n(p),h=n(55),y=function(e){function t(){var n,i,a;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=i=o(this,e.call.apply(e,[this].concat(l))),i.history=d()(i.props),a=n,o(i,a)}return i(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<BrowserRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { BrowserRouter as Router }`.")},t.prototype.render=function(){return s.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(s.a.Component);y.propTypes={basename:f.a.string,forceRefresh:f.a.bool,getUserConfirmation:f.a.func,keyLength:f.a.number,children:f.a.node},t.a=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(3),u=r(a),l=n(5),s=r(l),c=n(53),f=n(20),p=n(54),d=r(p),h=n(90),y=function(){try{return window.history.state||{}}catch(e){return{}}},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,s.default)(h.canUseDOM,"Browser history needs a DOM");var t=window.history,n=(0,h.supportsHistory)(),r=!(0,h.supportsPopStateOnHashChange)(),a=e.forceRefresh,l=void 0!==a&&a,p=e.getUserConfirmation,v=void 0===p?h.getConfirmation:p,m=e.keyLength,b=void 0===m?6:m,g=e.basename?(0,f.stripTrailingSlash)((0,f.addLeadingSlash)(e.basename)):"",_=function(e){var t=e||{},n=t.key,r=t.state,o=window.location,i=o.pathname,a=o.search,l=o.hash,s=i+a+l;return(0,u.default)(!g||(0,f.hasBasename)(s,g),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+s+'" to begin with "'+g+'".'),g&&(s=(0,f.stripBasename)(s,g)),(0,c.createLocation)(s,r,n)},w=function(){return Math.random().toString(36).substr(2,b)},E=(0,d.default)(),O=function(e){i(H,e),H.length=t.length,E.notifyListeners(H.location,H.action)},x=function(e){(0,h.isExtraneousPopstateEvent)(e)||C(_(e.state))},k=function(){C(_(y()))},S=!1,C=function(e){if(S)S=!1,O();else{E.confirmTransitionTo(e,"POP",v,function(t){t?O({action:"POP",location:e}):P(e)})}},P=function(e){var t=H.location,n=T.indexOf(t.key);-1===n&&(n=0);var r=T.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(S=!0,M(o))},j=_(y()),T=[j.key],N=function(e){return g+(0,f.createPath)(e)},A=function(e,r){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==r),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var i=(0,c.createLocation)(e,r,w(),H.location);E.confirmTransitionTo(i,"PUSH",v,function(e){if(e){var r=N(i),o=i.key,a=i.state;if(n)if(t.pushState({key:o,state:a},null,r),l)window.location.href=r;else{var s=T.indexOf(H.location.key),c=T.slice(0,-1===s?0:s+1);c.push(i.key),T=c,O({action:"PUSH",location:i})}else(0,u.default)(void 0===a,"Browser history cannot push state in browsers that do not support HTML5 history"),window.location.href=r}})},R=function(e,r){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==r),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var i=(0,c.createLocation)(e,r,w(),H.location);E.confirmTransitionTo(i,"REPLACE",v,function(e){if(e){var r=N(i),o=i.key,a=i.state;if(n)if(t.replaceState({key:o,state:a},null,r),l)window.location.replace(r);else{var s=T.indexOf(H.location.key);-1!==s&&(T[s]=i.key),O({action:"REPLACE",location:i})}else(0,u.default)(void 0===a,"Browser history cannot replace state in browsers that do not support HTML5 history"),window.location.replace(r)}})},M=function(e){t.go(e)},L=function(){return M(-1)},I=function(){return M(1)},q=0,U=function(e){q+=e,1===q?((0,h.addEventListener)(window,"popstate",x),r&&(0,h.addEventListener)(window,"hashchange",k)):0===q&&((0,h.removeEventListener)(window,"popstate",x),r&&(0,h.removeEventListener)(window,"hashchange",k))},D=!1,F=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=E.setPrompt(e);return D||(U(1),D=!0),function(){return D&&(D=!1,U(-1)),t()}},B=function(e){var t=E.appendListener(e);return U(1),function(){U(-1),t()}},H={length:t.length,action:"POP",location:j,createHref:N,push:A,replace:R,go:M,goBack:L,goForward:I,block:F,listen:B};return H};t.default=v},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(3),u=n.n(a),l=n(0),s=n.n(l),c=n(2),f=n.n(c),p=n(228),d=n.n(p),h=n(55),y=function(e){function t(){var n,i,a;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=i=o(this,e.call.apply(e,[this].concat(l))),i.history=d()(i.props),a=n,o(i,a)}return i(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<HashRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { HashRouter as Router }`.")},t.prototype.render=function(){return s.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(s.a.Component);y.propTypes={basename:f.a.string,getUserConfirmation:f.a.func,hashType:f.a.oneOf(["hashbang","noslash","slash"]),children:f.a.node},t.a=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(3),a=r(i),u=n(5),l=r(u),s=n(53),c=n(20),f=n(54),p=r(f),d=n(90),h={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+(0,c.stripLeadingSlash)(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:c.stripLeadingSlash,decodePath:c.addLeadingSlash},slash:{encodePath:c.addLeadingSlash,decodePath:c.addLeadingSlash}},y=function(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)},v=function(e){return window.location.hash=e},m=function(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)},b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,l.default)(d.canUseDOM,"Hash history needs a DOM");var t=window.history,n=(0,d.supportsGoWithoutReloadUsingHash)(),r=e.getUserConfirmation,i=void 0===r?d.getConfirmation:r,u=e.hashType,f=void 0===u?"slash":u,b=e.basename?(0,c.stripTrailingSlash)((0,c.addLeadingSlash)(e.basename)):"",g=h[f],_=g.encodePath,w=g.decodePath,E=function(){var e=w(y());return(0,a.default)(!b||(0,c.hasBasename)(e,b),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+e+'" to begin with "'+b+'".'),b&&(e=(0,c.stripBasename)(e,b)),(0,s.createLocation)(e)},O=(0,p.default)(),x=function(e){o(W,e),W.length=t.length,O.notifyListeners(W.location,W.action)},k=!1,S=null,C=function(){var e=y(),t=_(e);if(e!==t)m(t);else{var n=E(),r=W.location;if(!k&&(0,s.locationsAreEqual)(r,n))return;if(S===(0,c.createPath)(n))return;S=null,P(n)}},P=function(e){if(k)k=!1,x();else{O.confirmTransitionTo(e,"POP",i,function(t){t?x({action:"POP",location:e}):j(e)})}},j=function(e){var t=W.location,n=R.lastIndexOf((0,c.createPath)(t));-1===n&&(n=0);var r=R.lastIndexOf((0,c.createPath)(e));-1===r&&(r=0);var o=n-r;o&&(k=!0,q(o))},T=y(),N=_(T);T!==N&&m(N);var A=E(),R=[(0,c.createPath)(A)],M=function(e){return"#"+_(b+(0,c.createPath)(e))},L=function(e,t){(0,a.default)(void 0===t,"Hash history cannot push state; it is ignored");var n=(0,s.createLocation)(e,void 0,void 0,W.location);O.confirmTransitionTo(n,"PUSH",i,function(e){if(e){var t=(0,c.createPath)(n),r=_(b+t);if(y()!==r){S=t,v(r);var o=R.lastIndexOf((0,c.createPath)(W.location)),i=R.slice(0,-1===o?0:o+1);i.push(t),R=i,x({action:"PUSH",location:n})}else(0,a.default)(!1,"Hash history cannot PUSH the same path; a new entry will not be added to the history stack"),x()}})},I=function(e,t){(0,a.default)(void 0===t,"Hash history cannot replace state; it is ignored");var n=(0,s.createLocation)(e,void 0,void 0,W.location);O.confirmTransitionTo(n,"REPLACE",i,function(e){if(e){var t=(0,c.createPath)(n),r=_(b+t);y()!==r&&(S=t,m(r));var o=R.indexOf((0,c.createPath)(W.location));-1!==o&&(R[o]=t),x({action:"REPLACE",location:n})}})},q=function(e){(0,a.default)(n,"Hash history go(n) causes a full page reload in this browser"),t.go(e)},U=function(){return q(-1)},D=function(){return q(1)},F=0,B=function(e){F+=e,1===F?(0,d.addEventListener)(window,"hashchange",C):0===F&&(0,d.removeEventListener)(window,"hashchange",C)},H=!1,z=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=O.setPrompt(e);return H||(B(1),H=!0),function(){return H&&(H=!1,B(-1)),t()}},V=function(e){var t=O.appendListener(e);return B(1),function(){B(-1),t()}},W={length:t.length,action:"POP",location:A,createHref:M,push:L,replace:I,go:q,goBack:U,goForward:D,block:z,listen:V};return W};t.default=b},function(e,t,n){"use strict";var r=n(230);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(3),u=n.n(a),l=n(0),s=n.n(l),c=n(2),f=n.n(c),p=n(231),d=n.n(p),h=n(56),y=function(e){function t(){var n,i,a;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=i=o(this,e.call.apply(e,[this].concat(l))),i.history=d()(i.props),a=n,o(i,a)}return i(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<MemoryRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { MemoryRouter as Router }`.")},t.prototype.render=function(){return s.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(s.a.Component);y.propTypes={initialEntries:f.a.array,initialIndex:f.a.number,getUserConfirmation:f.a.func,keyLength:f.a.number,children:f.a.node},t.a=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(3),u=r(a),l=n(20),s=n(53),c=n(54),f=r(c),p=function(e,t,n){return Math.min(Math.max(e,t),n)},d=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.getUserConfirmation,n=e.initialEntries,r=void 0===n?["/"]:n,a=e.initialIndex,c=void 0===a?0:a,d=e.keyLength,h=void 0===d?6:d,y=(0,f.default)(),v=function(e){i(j,e),j.length=j.entries.length,y.notifyListeners(j.location,j.action)},m=function(){return Math.random().toString(36).substr(2,h)},b=p(c,0,r.length-1),g=r.map(function(e){return"string"==typeof e?(0,s.createLocation)(e,void 0,m()):(0,s.createLocation)(e,void 0,e.key||m())}),_=l.createPath,w=function(e,n){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var r=(0,s.createLocation)(e,n,m(),j.location);y.confirmTransitionTo(r,"PUSH",t,function(e){if(e){var t=j.index,n=t+1,o=j.entries.slice(0);o.length>n?o.splice(n,o.length-n,r):o.push(r),v({action:"PUSH",location:r,index:n,entries:o})}})},E=function(e,n){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var r=(0,s.createLocation)(e,n,m(),j.location);y.confirmTransitionTo(r,"REPLACE",t,function(e){e&&(j.entries[j.index]=r,v({action:"REPLACE",location:r}))})},O=function(e){var n=p(j.index+e,0,j.entries.length-1),r=j.entries[n];y.confirmTransitionTo(r,"POP",t,function(e){e?v({action:"POP",location:r,index:n}):v()})},x=function(){return O(-1)},k=function(){return O(1)},S=function(e){var t=j.index+e;return t>=0&&t<j.entries.length},C=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return y.setPrompt(e)},P=function(e){return y.appendListener(e)},j={length:g.length,action:"POP",location:g[b],index:b,entries:g,createHref:_,push:w,replace:E,go:O,goBack:x,goForward:k,canGo:S,block:C,listen:P};return j};t.default=d},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var o=n(0),i=n.n(o),a=n(2),u=n.n(a),l=n(92),s=n(91),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p=function(e){var t=e.to,n=e.exact,o=e.strict,a=e.location,u=e.activeClassName,p=e.className,d=e.activeStyle,h=e.style,y=e.isActive,v=e.ariaCurrent,m=r(e,["to","exact","strict","location","activeClassName","className","activeStyle","style","isActive","ariaCurrent"]);return i.a.createElement(l.a,{path:"object"===(void 0===t?"undefined":f(t))?t.pathname:t,exact:n,strict:o,location:a,children:function(e){var n=e.location,r=e.match,o=!!(y?y(r,n):r);return i.a.createElement(s.a,c({to:t,className:o?[p,u].filter(function(e){return e}).join(" "):p,style:o?c({},h,d):h,"aria-current":o&&v},m))}})};p.propTypes={to:s.a.propTypes.to,exact:u.a.bool,strict:u.a.bool,location:u.a.object,activeClassName:u.a.string,className:u.a.string,activeStyle:u.a.object,style:u.a.object,isActive:u.a.func,ariaCurrent:u.a.oneOf(["page","step","location","true"])},p.defaultProps={activeClassName:"active",ariaCurrent:"true"},t.a=p},function(e,t,n){function r(e,t){for(var n,r=[],o=0,i=0,a="",u=t&&t.delimiter||"/";null!=(n=b.exec(e));){var c=n[0],f=n[1],p=n.index;if(a+=e.slice(i,p),i=p+c.length,f)a+=f[1];else{var d=e[i],h=n[2],y=n[3],v=n[4],m=n[5],g=n[6],_=n[7];a&&(r.push(a),a="");var w=null!=h&&null!=d&&d!==h,E="+"===g||"*"===g,O="?"===g||"*"===g,x=n[2]||u,k=v||m;r.push({name:y||o++,prefix:h||"",delimiter:x,optional:O,repeat:E,partial:w,asterisk:!!_,pattern:k?s(k):_?".*":"[^"+l(x)+"]+?"})}}return i<e.length&&(a+=e.substr(i)),a&&r.push(a),r}function o(e,t){return u(r(e,t))}function i(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function a(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function u(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,r){for(var o="",u=n||{},l=r||{},s=l.pretty?i:encodeURIComponent,c=0;c<e.length;c++){var f=e[c];if("string"!=typeof f){var p,d=u[f.name];if(null==d){if(f.optional){f.partial&&(o+=f.prefix);continue}throw new TypeError('Expected "'+f.name+'" to be defined')}if(m(d)){if(!f.repeat)throw new TypeError('Expected "'+f.name+'" to not repeat, but received `'+JSON.stringify(d)+"`");if(0===d.length){if(f.optional)continue;throw new TypeError('Expected "'+f.name+'" to not be empty')}for(var h=0;h<d.length;h++){if(p=s(d[h]),!t[c].test(p))throw new TypeError('Expected all "'+f.name+'" to match "'+f.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===h?f.prefix:f.delimiter)+p}}else{if(p=f.asterisk?a(d):s(d),!t[c].test(p))throw new TypeError('Expected "'+f.name+'" to match "'+f.pattern+'", but received "'+p+'"');o+=f.prefix+p}}else o+=f}return o}}function l(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function s(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function c(e,t){return e.keys=t,e}function f(e){return e.sensitive?"":"i"}function p(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return c(e,t)}function d(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(v(e[o],t,n).source);return c(new RegExp("(?:"+r.join("|")+")",f(n)),t)}function h(e,t,n){return y(r(e,n),t,n)}function y(e,t,n){m(t)||(n=t||n,t=[]),n=n||{};for(var r=n.strict,o=!1!==n.end,i="",a=0;a<e.length;a++){var u=e[a];if("string"==typeof u)i+=l(u);else{var s=l(u.prefix),p="(?:"+u.pattern+")";t.push(u),u.repeat&&(p+="(?:"+s+p+")*"),p=u.optional?u.partial?s+"("+p+")?":"(?:"+s+"("+p+"))?":s+"("+p+")",i+=p}}var d=l(n.delimiter||"/"),h=i.slice(-d.length)===d;return r||(i=(h?i.slice(0,-d.length):i)+"(?:"+d+"(?=$))?"),i+=o?"$":r&&h?"":"(?="+d+"|$)",c(new RegExp("^"+i,f(n)),t)}function v(e,t,n){return m(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?p(e,t):m(e)?d(e,t,n):h(e,t,n)}var m=n(234);e.exports=v,e.exports.parse=r,e.exports.compile=o,e.exports.tokensToFunction=u,e.exports.tokensToRegExp=y;var b=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";var r=n(236);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(0),u=n.n(a),l=n(2),s=n.n(l),c=n(5),f=n.n(c),p=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return i(t,e),t.prototype.enable=function(e){this.unblock&&this.unblock(),this.unblock=this.context.router.history.block(e)},t.prototype.disable=function(){this.unblock&&(this.unblock(),this.unblock=null)},t.prototype.componentWillMount=function(){f()(this.context.router,"You should not use <Prompt> outside a <Router>"),this.props.when&&this.enable(this.props.message)},t.prototype.componentWillReceiveProps=function(e){e.when?this.props.when&&this.props.message===e.message||this.enable(e.message):this.disable()},t.prototype.componentWillUnmount=function(){this.disable()},t.prototype.render=function(){return null},t}(u.a.Component);p.propTypes={when:s.a.bool,message:s.a.oneOfType([s.a.func,s.a.string]).isRequired},p.defaultProps={when:!0},p.contextTypes={router:s.a.shape({history:s.a.shape({block:s.a.func.isRequired}).isRequired}).isRequired},t.a=p},function(e,t,n){"use strict";var r=n(238);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(0),u=n.n(a),l=n(2),s=n.n(l),c=n(3),f=n.n(c),p=n(5),d=n.n(p),h=n(239),y=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return i(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){d()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=Object(h.a)(e.to),n=Object(h.a)(this.props.to);if(Object(h.b)(t,n))return void f()(!1,"You tried to redirect to the same route you're currently on: \""+n.pathname+n.search+'"');this.perform()},t.prototype.perform=function(){var e=this.context.router.history,t=this.props,n=t.push,r=t.to;n?e.push(r):e.replace(r)},t.prototype.render=function(){return null},t}(u.a.Component);y.propTypes={push:s.a.bool,from:s.a.string,to:s.a.oneOfType([s.a.string,s.a.object]).isRequired},y.defaultProps={push:!1},y.contextTypes={router:s.a.shape({history:s.a.shape({push:s.a.func.isRequired,replace:s.a.func.isRequired}).isRequired,staticContext:s.a.object}).isRequired},t.a=y},function(e,t,n){"use strict";var r=(n(240),n(241),n(242),n(33));n.d(t,"a",function(){return r.a}),n.d(t,"b",function(){return r.b});n(21)},function(e,t,n){"use strict";var r=n(3),o=(n.n(r),n(5));n.n(o),n(33),n(21),n(58),n(94),"function"==typeof Symbol&&Symbol.iterator,Object.assign},function(e,t,n){"use strict";var r=n(3),o=(n.n(r),n(5)),i=(n.n(o),n(33),n(21));n(58),n(94),Object.assign,i.f,i.a,i.a,i.a},function(e,t,n){"use strict";var r=n(3);n.n(r),n(21),n(33),n(58),"function"==typeof Symbol&&Symbol.iterator,Object.assign},function(e,t,n){"use strict";var r=n(244);t.a=r.a},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(3),l=n.n(u),s=n(5),c=n.n(s),f=n(0),p=n.n(f),d=n(2),h=n.n(d),y=n(20),v=(n.n(y),n(56)),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},b=function(e){var t=e.pathname,n=void 0===t?"/":t,r=e.search,o=void 0===r?"":r,i=e.hash,a=void 0===i?"":i;return{pathname:n,search:"?"===o?"":o,hash:"#"===a?"":a}},g=function(e,t){return e?m({},t,{pathname:Object(y.addLeadingSlash)(e)+t.pathname}):t},_=function(e,t){if(!e)return t;var n=Object(y.addLeadingSlash)(e);return 0!==t.pathname.indexOf(n)?t:m({},t,{pathname:t.pathname.substr(n.length)})},w=function(e){return"string"==typeof e?Object(y.parsePath)(e):b(e)},E=function(e){return"string"==typeof e?e:Object(y.createPath)(e)},O=function(e){return function(){c()(!1,"You cannot %s with <StaticRouter>",e)}},x=function(){},k=function(e){function t(){var n,r,a;o(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=r=i(this,e.call.apply(e,[this].concat(l))),r.createHref=function(e){return Object(y.addLeadingSlash)(r.props.basename+E(e))},r.handlePush=function(e){var t=r.props,n=t.basename,o=t.context;o.action="PUSH",o.location=g(n,w(e)),o.url=E(o.location)},r.handleReplace=function(e){var t=r.props,n=t.basename,o=t.context;o.action="REPLACE",o.location=g(n,w(e)),o.url=E(o.location)},r.handleListen=function(){return x},r.handleBlock=function(){return x},a=n,i(r,a)}return a(t,e),t.prototype.getChildContext=function(){return{router:{staticContext:this.props.context}}},t.prototype.componentWillMount=function(){l()(!this.props.history,"<StaticRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { StaticRouter as Router }`.")},t.prototype.render=function(){var e=this.props,t=e.basename,n=(e.context,e.location),o=r(e,["basename","context","location"]),i={createHref:this.createHref,action:"POP",location:_(t,w(n)),push:this.handlePush,replace:this.handleReplace,go:O("go"),goBack:O("goBack"),goForward:O("goForward"),listen:this.handleListen,block:this.handleBlock};return p.a.createElement(v.a,m({},o,{history:i}))},t}(p.a.Component);k.propTypes={basename:h.a.string,context:h.a.object.isRequired,location:h.a.oneOfType([h.a.string,h.a.object])},k.defaultProps={basename:"",location:"/"},k.childContextTypes={router:h.a.object.isRequired},t.a=k},function(e,t,n){"use strict";var r=n(246);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=n(0),u=n.n(a),l=n(2),s=n.n(l),c=n(3),f=n.n(c),p=n(5),d=n.n(p),h=n(57),y=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return i(t,e),t.prototype.componentWillMount=function(){d()(this.context.router,"You should not use <Switch> outside a <Router>")},t.prototype.componentWillReceiveProps=function(e){f()(!(e.location&&!this.props.location),'<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),f()(!(!e.location&&this.props.location),'<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.')},t.prototype.render=function(){var e=this.context.router.route,t=this.props.children,n=this.props.location||e.location,r=void 0,o=void 0;return u.a.Children.forEach(t,function(t){if(u.a.isValidElement(t)){var i=t.props,a=i.path,l=i.exact,s=i.strict,c=i.sensitive,f=i.from,p=a||f;null==r&&(o=t,r=p?Object(h.a)(n.pathname,{path:p,exact:l,strict:s,sensitive:c}):e.match)}}),r?u.a.cloneElement(o,{location:n,computedMatch:r}):null},t}(u.a.Component);y.contextTypes={router:s.a.shape({route:s.a.object.isRequired}).isRequired},y.propTypes={children:s.a.node,location:s.a.object},t.a=y},function(e,t,n){"use strict";var r=n(57);t.a=r.a},function(e,t,n){"use strict";var r=n(249);t.a=r.a},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var o=n(0),i=n.n(o),a=n(2),u=n.n(a),l=n(85),s=n.n(l),c=n(93),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(e){var t=function(t){var n=t.wrappedComponentRef,o=r(t,["wrappedComponentRef"]);return i.a.createElement(c.a,{render:function(t){return i.a.createElement(e,f({},o,t,{ref:n}))}})};return t.displayName="withRouter("+(e.displayName||e.name)+")",t.WrappedComponent=e,t.propTypes={wrappedComponentRef:u.a.func},s()(t,e)};t.a=p},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(251),u=r(a),l=n(4),s=n(315),c=r(s),f=n(319),p=r(f),d=n(336),h=r(d),y=n(338),v=r(y),m=n(339),b=n(97),g=r(b),_=n(340),w=r(_),E=n(341),O=r(E),x=n(343),k=r(x),S=function(){return i.default.createElement("div",null,i.default.createElement(c.default,null),i.default.createElement("header",null,i.default.createElement("a",{className:"about",href:"https://github.com/gabrieltal/betwixt",target:"_blank",rel:"noopener noreferrer"},"About"),i.default.createElement(l.Link,{to:"/",className:"header-Link"},i.default.createElement("h1",null,"Betwixt")),i.default.createElement(u.default,null)),i.default.createElement(l.Switch,null,i.default.createElement(m.ProtectedRoute,{exact:!0,path:"/story/new",component:g.default}),i.default.createElement(m.ProtectedRoute,{exact:!0,path:"/story/:storyId/edit",component:w.default}),i.default.createElement(l.Route,{exact:!0,path:"/story/:storyId",component:v.default}),i.default.createElement(l.Route,{exact:!0,path:"/search/:searchParams",component:k.default}),i.default.createElement(l.Route,{exact:!0,path:"/user/:userId",component:p.default}),i.default.createElement(m.ProtectedRoute,{exact:!0,path:"/user/:userId/edit",component:O.default}),i.default.createElement(l.Route,{exact:!0,path:"/",component:h.default}),i.default.createElement(l.Redirect,{from:"/",to:"/"})))};t.default=S},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(252),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(12),u=n(6),l=(n(4),function(e,t){return{currentUser:e.session.currentUser}}),s=function(e){return{logout:function(){return e((0,a.logout)())},openModal:function(t){return e((0,u.openModal)(t))},login:function(t){return e((0,a.login)(t))}}};t.default=(0,r.connect)(l,s)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(95),f=(r(c),n(96)),p=(r(f),n(4)),d=n(97),h=(r(d),function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={search:""},n.update=n.update.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.displaySearchBar=n.displaySearchBar.bind(n),n.removeSearchBar=n.removeSearchBar.bind(n),n}return a(t,e),u(t,[{key:"update",value:function(e){return this.setState({search:e.target.value})}},{key:"removeSearchBar",value:function(e){var t=document.querySelector(".search-form-container");document.querySelector(".anchor").style.left="90px",t.style.visibility="hidden",t.style.opacity=0,this.setState({search:""})}},{key:"displaySearchBar",value:function(e){var t=document.querySelector(".search-form-container");document.querySelector(".anchor").style.left="-25px",t.style.visibility="visible",t.style.opacity=1}},{key:"handleSubmit",value:function(e){this.props.history.push("/search/"+this.state.search)}},{key:"searchForm",value:function(){return s.default.createElement("aside",{className:"search-family"},s.default.createElement("span",{className:"anchor"},s.default.createElement("span",{id:"search-glass",onClick:this.displaySearchBar,class:"fas fa-search"})),s.default.createElement("form",{className:"search-form-container",focusout:this.removeSearchBar,onSubmit:this.handleSubmit},s.default.createElement("input",{type:"text",onChange:this.update,placeholder:"Search Betwixt",value:this.state.search})))}},{key:"welcomeUser",value:function(){var e=Object.values(this.props.currentUser)[0];return s.default.createElement("div",{className:"greet-signout"},this.searchForm(),s.default.createElement(p.Link,{to:"/"},s.default.createElement("button",{className:"signout-button",onClick:this.props.logout},"Sign Out")),s.default.createElement(p.Link,{to:"/story/new",className:"new-story-button"},"New Story"),s.default.createElement(p.Link,{to:"/user/"+e.id},s.default.createElement("img",{src:e.image_url})))}},{key:"navLinks",value:function(){var e=this;return s.default.createElement("nav",{className:"login-signup"},this.searchForm(),s.default.createElement("button",{className:"login-button",onClick:function(){return e.props.openModal("login")}},"Sign in"),s.default.createElement("button",{className:"signup-button",onClick:function(){return e.props.openModal("signup")}},"Get started"),s.default.createElement("button",{className:"demo-button",onClick:function(){return e.props.login({username:"guest",password:"password"})}},"Demo"))}},{key:"render",value:function(){return this.props.currentUser?this.welcomeUser():this.navLinks()}}]),t}(s.default.Component));t.default=(0,p.withRouter)(h)},function(e,t,n){"use strict";(function(e){function r(){return i.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function o(e,t){if(r()<t)throw new RangeError("Invalid typed array length");return i.TYPED_ARRAY_SUPPORT?(e=new Uint8Array(t),e.__proto__=i.prototype):(null===e&&(e=new i(t)),e.length=t),e}function i(e,t,n){if(!(i.TYPED_ARRAY_SUPPORT||this instanceof i))return new i(e,t,n);if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return s(this,e)}return a(this,e,t,n)}function a(e,t,n,r){if("number"==typeof t)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer?p(e,t,n,r):"string"==typeof t?c(e,t,n):d(e,t)}function u(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function l(e,t,n,r){return u(t),t<=0?o(e,t):void 0!==n?"string"==typeof r?o(e,t).fill(n,r):o(e,t).fill(n):o(e,t)}function s(e,t){if(u(t),e=o(e,t<0?0:0|h(t)),!i.TYPED_ARRAY_SUPPORT)for(var n=0;n<t;++n)e[n]=0;return e}function c(e,t,n){if("string"==typeof n&&""!==n||(n="utf8"),!i.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var r=0|v(t,n);e=o(e,r);var a=e.write(t,n);return a!==r&&(e=e.slice(0,a)),e}function f(e,t){var n=t.length<0?0:0|h(t.length);e=o(e,n);for(var r=0;r<n;r+=1)e[r]=255&t[r];return e}function p(e,t,n,r){if(t.byteLength,n<0||t.byteLength<n)throw new RangeError("'offset' is out of bounds");if(t.byteLength<n+(r||0))throw new RangeError("'length' is out of bounds");return t=void 0===n&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,n):new Uint8Array(t,n,r),i.TYPED_ARRAY_SUPPORT?(e=t,e.__proto__=i.prototype):e=f(e,t),e}function d(e,t){if(i.isBuffer(t)){var n=0|h(t.length);return e=o(e,n),0===e.length?e:(t.copy(e,0,0,n),e)}if(t){if("undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer||"length"in t)return"number"!=typeof t.length||G(t.length)?o(e,0):f(e,t);if("Buffer"===t.type&&X(t.data))return f(e,t.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function h(e){if(e>=r())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+r().toString(16)+" bytes");return 0|e}function y(e){return+e!=e&&(e=0),i.alloc(+e)}function v(e,t){if(i.isBuffer(e))return e.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer))return e.byteLength;"string"!=typeof e&&(e=""+e);var n=e.length;if(0===n)return 0;for(var r=!1;;)switch(t){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":case void 0:return V(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return Y(e).length;default:if(r)return V(e).length;t=(""+t).toLowerCase(),r=!0}}function m(e,t,n){var r=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return"";if(n>>>=0,t>>>=0,n<=t)return"";for(e||(e="utf8");;)switch(e){case"hex":return A(this,t,n);case"utf8":case"utf-8":return P(this,t,n);case"ascii":return T(this,t,n);case"latin1":case"binary":return N(this,t,n);case"base64":return C(this,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,t,n);default:if(r)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),r=!0}}function b(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function g(e,t,n,r,o){if(0===e.length)return-1;if("string"==typeof n?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,isNaN(n)&&(n=o?0:e.length-1),n<0&&(n=e.length+n),n>=e.length){if(o)return-1;n=e.length-1}else if(n<0){if(!o)return-1;n=0}if("string"==typeof t&&(t=i.from(t,r)),i.isBuffer(t))return 0===t.length?-1:_(e,t,n,r,o);if("number"==typeof t)return t&=255,i.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(e,t,n):Uint8Array.prototype.lastIndexOf.call(e,t,n):_(e,[t],n,r,o);throw new TypeError("val must be string, number or Buffer")}function _(e,t,n,r,o){function i(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}var a=1,u=e.length,l=t.length;if(void 0!==r&&("ucs2"===(r=String(r).toLowerCase())||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(e.length<2||t.length<2)return-1;a=2,u/=2,l/=2,n/=2}var s;if(o){var c=-1;for(s=n;s<u;s++)if(i(e,s)===i(t,-1===c?0:s-c)){if(-1===c&&(c=s),s-c+1===l)return c*a}else-1!==c&&(s-=s-c),c=-1}else for(n+l>u&&(n=u-l),s=n;s>=0;s--){for(var f=!0,p=0;p<l;p++)if(i(e,s+p)!==i(t,p)){f=!1;break}if(f)return s}return-1}function w(e,t,n,r){n=Number(n)||0;var o=e.length-n;r?(r=Number(r))>o&&(r=o):r=o;var i=t.length;if(i%2!=0)throw new TypeError("Invalid hex string");r>i/2&&(r=i/2);for(var a=0;a<r;++a){var u=parseInt(t.substr(2*a,2),16);if(isNaN(u))return a;e[n+a]=u}return a}function E(e,t,n,r){return $(V(t,e.length-n),e,n,r)}function O(e,t,n,r){return $(W(t),e,n,r)}function x(e,t,n,r){return O(e,t,n,r)}function k(e,t,n,r){return $(Y(t),e,n,r)}function S(e,t,n,r){return $(K(t,e.length-n),e,n,r)}function C(e,t,n){return 0===t&&n===e.length?Q.fromByteArray(e):Q.fromByteArray(e.slice(t,n))}function P(e,t,n){n=Math.min(e.length,n);for(var r=[],o=t;o<n;){var i=e[o],a=null,u=i>239?4:i>223?3:i>191?2:1;if(o+u<=n){var l,s,c,f;switch(u){case 1:i<128&&(a=i);break;case 2:l=e[o+1],128==(192&l)&&(f=(31&i)<<6|63&l)>127&&(a=f);break;case 3:l=e[o+1],s=e[o+2],128==(192&l)&&128==(192&s)&&(f=(15&i)<<12|(63&l)<<6|63&s)>2047&&(f<55296||f>57343)&&(a=f);break;case 4:l=e[o+1],s=e[o+2],c=e[o+3],128==(192&l)&&128==(192&s)&&128==(192&c)&&(f=(15&i)<<18|(63&l)<<12|(63&s)<<6|63&c)>65535&&f<1114112&&(a=f)}}null===a?(a=65533,u=1):a>65535&&(a-=65536,r.push(a>>>10&1023|55296),a=56320|1023&a),r.push(a),o+=u}return j(r)}function j(e){var t=e.length;if(t<=J)return String.fromCharCode.apply(String,e);for(var n="",r=0;r<t;)n+=String.fromCharCode.apply(String,e.slice(r,r+=J));return n}function T(e,t,n){var r="";n=Math.min(e.length,n);for(var o=t;o<n;++o)r+=String.fromCharCode(127&e[o]);return r}function N(e,t,n){var r="";n=Math.min(e.length,n);for(var o=t;o<n;++o)r+=String.fromCharCode(e[o]);return r}function A(e,t,n){var r=e.length;(!t||t<0)&&(t=0),(!n||n<0||n>r)&&(n=r);for(var o="",i=t;i<n;++i)o+=z(e[i]);return o}function R(e,t,n){for(var r=e.slice(t,n),o="",i=0;i<r.length;i+=2)o+=String.fromCharCode(r[i]+256*r[i+1]);return o}function M(e,t,n){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>n)throw new RangeError("Trying to access beyond buffer length")}function L(e,t,n,r,o,a){if(!i.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>o||t<a)throw new RangeError('"value" argument is out of bounds');if(n+r>e.length)throw new RangeError("Index out of range")}function I(e,t,n,r){t<0&&(t=65535+t+1);for(var o=0,i=Math.min(e.length-n,2);o<i;++o)e[n+o]=(t&255<<8*(r?o:1-o))>>>8*(r?o:1-o)}function q(e,t,n,r){t<0&&(t=4294967295+t+1);for(var o=0,i=Math.min(e.length-n,4);o<i;++o)e[n+o]=t>>>8*(r?o:3-o)&255}function U(e,t,n,r,o,i){if(n+r>e.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function D(e,t,n,r,o){return o||U(e,t,n,4,3.4028234663852886e38,-3.4028234663852886e38),Z.write(e,t,n,r,23,4),n+4}function F(e,t,n,r,o){return o||U(e,t,n,8,1.7976931348623157e308,-1.7976931348623157e308),Z.write(e,t,n,r,52,8),n+8}function B(e){if(e=H(e).replace(ee,""),e.length<2)return"";for(;e.length%4!=0;)e+="=";return e}function H(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}function z(e){return e<16?"0"+e.toString(16):e.toString(16)}function V(e,t){t=t||1/0;for(var n,r=e.length,o=null,i=[],a=0;a<r;++a){if((n=e.charCodeAt(a))>55295&&n<57344){if(!o){if(n>56319){(t-=3)>-1&&i.push(239,191,189);continue}if(a+1===r){(t-=3)>-1&&i.push(239,191,189);continue}o=n;continue}if(n<56320){(t-=3)>-1&&i.push(239,191,189),o=n;continue}n=65536+(o-55296<<10|n-56320)}else o&&(t-=3)>-1&&i.push(239,191,189);if(o=null,n<128){if((t-=1)<0)break;i.push(n)}else if(n<2048){if((t-=2)<0)break;i.push(n>>6|192,63&n|128)}else if(n<65536){if((t-=3)<0)break;i.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(n<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;i.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return i}function W(e){for(var t=[],n=0;n<e.length;++n)t.push(255&e.charCodeAt(n));return t}function K(e,t){for(var n,r,o,i=[],a=0;a<e.length&&!((t-=2)<0);++a)n=e.charCodeAt(a),r=n>>8,o=n%256,i.push(o),i.push(r);return i}function Y(e){return Q.toByteArray(B(e))}function $(e,t,n,r){for(var o=0;o<r&&!(o+n>=t.length||o>=e.length);++o)t[o+n]=e[o];return o}function G(e){return e!==e}/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var Q=n(254),Z=n(255),X=n(256);t.Buffer=i,t.SlowBuffer=y,t.INSPECT_MAX_BYTES=50,i.TYPED_ARRAY_SUPPORT=void 0!==e.TYPED_ARRAY_SUPPORT?e.TYPED_ARRAY_SUPPORT:function(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(e){return!1}}(),t.kMaxLength=r(),i.poolSize=8192,i._augment=function(e){return e.__proto__=i.prototype,e},i.from=function(e,t,n){return a(null,e,t,n)},i.TYPED_ARRAY_SUPPORT&&(i.prototype.__proto__=Uint8Array.prototype,i.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&i[Symbol.species]===i&&Object.defineProperty(i,Symbol.species,{value:null,configurable:!0})),i.alloc=function(e,t,n){return l(null,e,t,n)},i.allocUnsafe=function(e){return s(null,e)},i.allocUnsafeSlow=function(e){return s(null,e)},i.isBuffer=function(e){return!(null==e||!e._isBuffer)},i.compare=function(e,t){if(!i.isBuffer(e)||!i.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var n=e.length,r=t.length,o=0,a=Math.min(n,r);o<a;++o)if(e[o]!==t[o]){n=e[o],r=t[o];break}return n<r?-1:r<n?1:0},i.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},i.concat=function(e,t){if(!X(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return i.alloc(0);var n;if(void 0===t)for(t=0,n=0;n<e.length;++n)t+=e[n].length;var r=i.allocUnsafe(t),o=0;for(n=0;n<e.length;++n){var a=e[n];if(!i.isBuffer(a))throw new TypeError('"list" argument must be an Array of Buffers');a.copy(r,o),o+=a.length}return r},i.byteLength=v,i.prototype._isBuffer=!0,i.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)b(this,t,t+1);return this},i.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)b(this,t,t+3),b(this,t+1,t+2);return this},i.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)b(this,t,t+7),b(this,t+1,t+6),b(this,t+2,t+5),b(this,t+3,t+4);return this},i.prototype.toString=function(){var e=0|this.length;return 0===e?"":0===arguments.length?P(this,0,e):m.apply(this,arguments)},i.prototype.equals=function(e){if(!i.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===i.compare(this,e)},i.prototype.inspect=function(){var e="",n=t.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,n).match(/.{2}/g).join(" "),this.length>n&&(e+=" ... ")),"<Buffer "+e+">"},i.prototype.compare=function(e,t,n,r,o){if(!i.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===n&&(n=e?e.length:0),void 0===r&&(r=0),void 0===o&&(o=this.length),t<0||n>e.length||r<0||o>this.length)throw new RangeError("out of range index");if(r>=o&&t>=n)return 0;if(r>=o)return-1;if(t>=n)return 1;if(t>>>=0,n>>>=0,r>>>=0,o>>>=0,this===e)return 0;for(var a=o-r,u=n-t,l=Math.min(a,u),s=this.slice(r,o),c=e.slice(t,n),f=0;f<l;++f)if(s[f]!==c[f]){a=s[f],u=c[f];break}return a<u?-1:u<a?1:0},i.prototype.includes=function(e,t,n){return-1!==this.indexOf(e,t,n)},i.prototype.indexOf=function(e,t,n){return g(this,e,t,n,!0)},i.prototype.lastIndexOf=function(e,t,n){return g(this,e,t,n,!1)},i.prototype.write=function(e,t,n,r){if(void 0===t)r="utf8",n=this.length,t=0;else if(void 0===n&&"string"==typeof t)r=t,n=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t|=0,isFinite(n)?(n|=0,void 0===r&&(r="utf8")):(r=n,n=void 0)}var o=this.length-t;if((void 0===n||n>o)&&(n=o),e.length>0&&(n<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var i=!1;;)switch(r){case"hex":return w(this,e,t,n);case"utf8":case"utf-8":return E(this,e,t,n);case"ascii":return O(this,e,t,n);case"latin1":case"binary":return x(this,e,t,n);case"base64":return k(this,e,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return S(this,e,t,n);default:if(i)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),i=!0}},i.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var J=4096;i.prototype.slice=function(e,t){var n=this.length;e=~~e,t=void 0===t?n:~~t,e<0?(e+=n)<0&&(e=0):e>n&&(e=n),t<0?(t+=n)<0&&(t=0):t>n&&(t=n),t<e&&(t=e);var r;if(i.TYPED_ARRAY_SUPPORT)r=this.subarray(e,t),r.__proto__=i.prototype;else{var o=t-e;r=new i(o,void 0);for(var a=0;a<o;++a)r[a]=this[a+e]}return r},i.prototype.readUIntLE=function(e,t,n){e|=0,t|=0,n||M(e,t,this.length);for(var r=this[e],o=1,i=0;++i<t&&(o*=256);)r+=this[e+i]*o;return r},i.prototype.readUIntBE=function(e,t,n){e|=0,t|=0,n||M(e,t,this.length);for(var r=this[e+--t],o=1;t>0&&(o*=256);)r+=this[e+--t]*o;return r},i.prototype.readUInt8=function(e,t){return t||M(e,1,this.length),this[e]},i.prototype.readUInt16LE=function(e,t){return t||M(e,2,this.length),this[e]|this[e+1]<<8},i.prototype.readUInt16BE=function(e,t){return t||M(e,2,this.length),this[e]<<8|this[e+1]},i.prototype.readUInt32LE=function(e,t){return t||M(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},i.prototype.readUInt32BE=function(e,t){return t||M(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},i.prototype.readIntLE=function(e,t,n){e|=0,t|=0,n||M(e,t,this.length);for(var r=this[e],o=1,i=0;++i<t&&(o*=256);)r+=this[e+i]*o;return o*=128,r>=o&&(r-=Math.pow(2,8*t)),r},i.prototype.readIntBE=function(e,t,n){e|=0,t|=0,n||M(e,t,this.length);for(var r=t,o=1,i=this[e+--r];r>0&&(o*=256);)i+=this[e+--r]*o;return o*=128,i>=o&&(i-=Math.pow(2,8*t)),i},i.prototype.readInt8=function(e,t){return t||M(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},i.prototype.readInt16LE=function(e,t){t||M(e,2,this.length);var n=this[e]|this[e+1]<<8;return 32768&n?4294901760|n:n},i.prototype.readInt16BE=function(e,t){t||M(e,2,this.length);var n=this[e+1]|this[e]<<8;return 32768&n?4294901760|n:n},i.prototype.readInt32LE=function(e,t){return t||M(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},i.prototype.readInt32BE=function(e,t){return t||M(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},i.prototype.readFloatLE=function(e,t){return t||M(e,4,this.length),Z.read(this,e,!0,23,4)},i.prototype.readFloatBE=function(e,t){return t||M(e,4,this.length),Z.read(this,e,!1,23,4)},i.prototype.readDoubleLE=function(e,t){return t||M(e,8,this.length),Z.read(this,e,!0,52,8)},i.prototype.readDoubleBE=function(e,t){return t||M(e,8,this.length),Z.read(this,e,!1,52,8)},i.prototype.writeUIntLE=function(e,t,n,r){if(e=+e,t|=0,n|=0,!r){L(this,e,t,n,Math.pow(2,8*n)-1,0)}var o=1,i=0;for(this[t]=255&e;++i<n&&(o*=256);)this[t+i]=e/o&255;return t+n},i.prototype.writeUIntBE=function(e,t,n,r){if(e=+e,t|=0,n|=0,!r){L(this,e,t,n,Math.pow(2,8*n)-1,0)}var o=n-1,i=1;for(this[t+o]=255&e;--o>=0&&(i*=256);)this[t+o]=e/i&255;return t+n},i.prototype.writeUInt8=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,1,255,0),i.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},i.prototype.writeUInt16LE=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,2,65535,0),i.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):I(this,e,t,!0),t+2},i.prototype.writeUInt16BE=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,2,65535,0),i.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):I(this,e,t,!1),t+2},i.prototype.writeUInt32LE=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,4,4294967295,0),i.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):q(this,e,t,!0),t+4},i.prototype.writeUInt32BE=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,4,4294967295,0),i.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):q(this,e,t,!1),t+4},i.prototype.writeIntLE=function(e,t,n,r){if(e=+e,t|=0,!r){var o=Math.pow(2,8*n-1);L(this,e,t,n,o-1,-o)}var i=0,a=1,u=0;for(this[t]=255&e;++i<n&&(a*=256);)e<0&&0===u&&0!==this[t+i-1]&&(u=1),this[t+i]=(e/a>>0)-u&255;return t+n},i.prototype.writeIntBE=function(e,t,n,r){if(e=+e,t|=0,!r){var o=Math.pow(2,8*n-1);L(this,e,t,n,o-1,-o)}var i=n-1,a=1,u=0;for(this[t+i]=255&e;--i>=0&&(a*=256);)e<0&&0===u&&0!==this[t+i+1]&&(u=1),this[t+i]=(e/a>>0)-u&255;return t+n},i.prototype.writeInt8=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,1,127,-128),i.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},i.prototype.writeInt16LE=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,2,32767,-32768),i.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):I(this,e,t,!0),t+2},i.prototype.writeInt16BE=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,2,32767,-32768),i.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):I(this,e,t,!1),t+2},i.prototype.writeInt32LE=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,4,2147483647,-2147483648),i.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):q(this,e,t,!0),t+4},i.prototype.writeInt32BE=function(e,t,n){return e=+e,t|=0,n||L(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),i.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):q(this,e,t,!1),t+4},i.prototype.writeFloatLE=function(e,t,n){return D(this,e,t,!0,n)},i.prototype.writeFloatBE=function(e,t,n){return D(this,e,t,!1,n)},i.prototype.writeDoubleLE=function(e,t,n){return F(this,e,t,!0,n)},i.prototype.writeDoubleBE=function(e,t,n){return F(this,e,t,!1,n)},i.prototype.copy=function(e,t,n,r){if(n||(n=0),r||0===r||(r=this.length),t>=e.length&&(t=e.length),t||(t=0),r>0&&r<n&&(r=n),r===n)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-t<r-n&&(r=e.length-t+n);var o,a=r-n;if(this===e&&n<t&&t<r)for(o=a-1;o>=0;--o)e[o+t]=this[o+n];else if(a<1e3||!i.TYPED_ARRAY_SUPPORT)for(o=0;o<a;++o)e[o+t]=this[o+n];else Uint8Array.prototype.set.call(e,this.subarray(n,n+a),t);return a},i.prototype.fill=function(e,t,n,r){if("string"==typeof e){if("string"==typeof t?(r=t,t=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===e.length){var o=e.charCodeAt(0);o<256&&(e=o)}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!i.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<n)throw new RangeError("Out of range index");if(n<=t)return this;t>>>=0,n=void 0===n?this.length:n>>>0,e||(e=0);var a;if("number"==typeof e)for(a=t;a<n;++a)this[a]=e;else{var u=i.isBuffer(e)?e:V(new i(e,r).toString()),l=u.length;for(a=0;a<n-t;++a)this[a+t]=u[a%l]}return this};var ee=/[^+\/0-9A-Za-z-_]/g}).call(t,n(18))},function(e,t,n){"use strict";function r(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");return"="===e[t-2]?2:"="===e[t-1]?1:0}function o(e){return 3*e.length/4-r(e)}function i(e){var t,n,o,i,a,u=e.length;i=r(e),a=new f(3*u/4-i),n=i>0?u-4:u;var l=0;for(t=0;t<n;t+=4)o=c[e.charCodeAt(t)]<<18|c[e.charCodeAt(t+1)]<<12|c[e.charCodeAt(t+2)]<<6|c[e.charCodeAt(t+3)],a[l++]=o>>16&255,a[l++]=o>>8&255,a[l++]=255&o;return 2===i?(o=c[e.charCodeAt(t)]<<2|c[e.charCodeAt(t+1)]>>4,a[l++]=255&o):1===i&&(o=c[e.charCodeAt(t)]<<10|c[e.charCodeAt(t+1)]<<4|c[e.charCodeAt(t+2)]>>2,a[l++]=o>>8&255,a[l++]=255&o),a}function a(e){return s[e>>18&63]+s[e>>12&63]+s[e>>6&63]+s[63&e]}function u(e,t,n){for(var r,o=[],i=t;i<n;i+=3)r=(e[i]<<16&16711680)+(e[i+1]<<8&65280)+(255&e[i+2]),o.push(a(r));return o.join("")}function l(e){for(var t,n=e.length,r=n%3,o="",i=[],a=0,l=n-r;a<l;a+=16383)i.push(u(e,a,a+16383>l?l:a+16383));return 1===r?(t=e[n-1],o+=s[t>>2],o+=s[t<<4&63],o+="=="):2===r&&(t=(e[n-2]<<8)+e[n-1],o+=s[t>>10],o+=s[t>>4&63],o+=s[t<<2&63],o+="="),i.push(o),i.join("")}t.byteLength=o,t.toByteArray=i,t.fromByteArray=l;for(var s=[],c=[],f="undefined"!=typeof Uint8Array?Uint8Array:Array,p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",d=0,h=p.length;d<h;++d)s[d]=p[d],c[p.charCodeAt(d)]=d;c["-".charCodeAt(0)]=62,c["_".charCodeAt(0)]=63},function(e,t){t.read=function(e,t,n,r,o){var i,a,u=8*o-r-1,l=(1<<u)-1,s=l>>1,c=-7,f=n?o-1:0,p=n?-1:1,d=e[t+f];for(f+=p,i=d&(1<<-c)-1,d>>=-c,c+=u;c>0;i=256*i+e[t+f],f+=p,c-=8);for(a=i&(1<<-c)-1,i>>=-c,c+=r;c>0;a=256*a+e[t+f],f+=p,c-=8);if(0===i)i=1-s;else{if(i===l)return a?NaN:1/0*(d?-1:1);a+=Math.pow(2,r),i-=s}return(d?-1:1)*a*Math.pow(2,i-r)},t.write=function(e,t,n,r,o,i){var a,u,l,s=8*i-o-1,c=(1<<s)-1,f=c>>1,p=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,d=r?0:i-1,h=r?1:-1,y=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(u=isNaN(t)?1:0,a=c):(a=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-a))<1&&(a--,l*=2),t+=a+f>=1?p/l:p*Math.pow(2,1-f),t*l>=2&&(a++,l/=2),a+f>=c?(u=0,a=c):a+f>=1?(u=(t*l-1)*Math.pow(2,o),a+=f):(u=t*Math.pow(2,f-1)*Math.pow(2,o),a=0));o>=8;e[n+d]=255&u,d+=h,u/=256,o-=8);for(a=a<<o|u,s+=o;s>0;e[n+d]=255&a,d+=h,a/=256,s-=8);e[n+d-h]|=128*y}},function(e,t){var n={}.toString;e.exports=Array.isArray||function(e){return"[object Array]"==n.call(e)}},function(e,t,n){"use strict";var r=n(0),o=n(65),i=n(100),a=n(101),u=(n(102),n(304)),l=n(109),s=n(2),c=n(110),f=i({displayName:"Quill",mixins:[a],propTypes:{id:s.string,className:s.string,theme:s.string,style:s.object,readOnly:s.bool,value:s.oneOfType([s.string,s.shape({ops:s.array})]),defaultValue:s.oneOfType([s.string,s.shape({ops:s.array})]),placeholder:s.string,tabIndex:s.number,bounds:s.oneOfType([s.string,s.element]),onChange:s.func,onChangeSelection:s.func,onFocus:s.func,onBlur:s.func,onKeyPress:s.func,onKeyDown:s.func,onKeyUp:s.func,modules:function(e){var t=s.object.apply(this,arguments);return t||(e.modules&&e.modules.toolbar&&e.modules.toolbar[0]&&e.modules.toolbar[0].type?new Error("Since v1.0.0, React Quill will not create a custom toolbar for you anymore. Create a toolbar explictly, or let Quill create one. See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100"):void 0)},toolbar:function(e){if("toolbar"in e)return new Error("The `toolbar` prop has been deprecated. Use `modules.toolbar` instead. See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100")},formats:function(e){if(s.arrayOf(s.string).apply(this,arguments))return new Error("You cannot specify custom `formats` anymore. Use Parchment instead.  See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.")},styles:function(e){if("styles"in e)return new Error("The `styles` prop has been deprecated. Use custom stylesheets instead. See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.")},pollInterval:function(e){if("pollInterval"in e)return new Error("The `pollInterval` property does not have any effect anymore. You can safely remove it from your props.See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v100.")},children:function(e){if(s.element.apply(this,arguments))return new Error("The Quill editing area can only be composed of a single React element.");if(r.Children.count(e.children)){if("textarea"===r.Children.only(e.children).type)return new Error("Quill does not support editing on a <textarea>. Use a <div> instead.")}}},dirtyProps:["modules","formats","bounds","theme","children"],cleanProps:["id","className","style","placeholder","tabIndex","onChange","onChangeSelection","onFocus","onBlur","onKeyPress","onKeyDown","onKeyUp"],getDefaultProps:function(){return{theme:"snow",modules:{}}},isControlled:function(){return"value"in this.props},getInitialState:function(){return{generation:0,value:this.isControlled()?this.props.value:this.props.defaultValue}},componentWillReceiveProps:function(e,t){var n=this.editor;if(n){if("value"in e){var r=this.getEditorContents(),o=e.value;if(o===this.lastDeltaChangeSet)throw new Error("You are passing the `delta` object from the `onChange` event back as `value`. You most probably want `editor.getContents()` instead. See: https://github.com/zenoamaro/react-quill#using-deltas");this.isEqualValue(o,r)||this.setEditorContents(n,o)}return"readOnly"in e&&e.readOnly!==this.props.readOnly&&this.setEditorReadOnly(n,e.readOnly),this.shouldComponentRegenerate(e,t)?this.regenerate():void 0}},componentDidMount:function(){return this.editor=this.createEditor(this.getEditingArea(),this.getEditorConfig()),this.quillDelta?(this.editor.setContents(this.quillDelta),this.editor.setSelection(this.quillSelection),this.editor.focus(),void(this.quillDelta=this.quillSelection=null)):this.state.value?void this.setEditorContents(this.editor,this.state.value):void 0},componentWillUnmount:function(){var e;(e=this.getEditor())&&(this.unhookEditor(e),this.editor=null)},shouldComponentUpdate:function(e,t){var n=this;return this.state.generation!==t.generation||u(this.cleanProps,function(t){return!l(e[t],n.props[t])})},shouldComponentRegenerate:function(e,t){var n=this;return u(this.dirtyProps,function(t){return!l(e[t],n.props[t])})},componentWillUpdate:function(e,t){this.state.generation!==t.generation&&this.componentWillUnmount()},componentDidUpdate:function(e,t){this.state.generation!==t.generation&&this.componentDidMount()},getEditorConfig:function(){return{bounds:this.props.bounds,formats:this.props.formats,modules:this.props.modules,placeholder:this.props.placeholder,readOnly:this.props.readOnly,theme:this.props.theme}},getEditor:function(){return this.editor},getEditingArea:function(){return o.findDOMNode(this.editingArea)},getEditorContents:function(){return this.state.value},getEditorSelection:function(){return this.state.selection},isDelta:function(e){return e&&e.ops},isEqualValue:function(e,t){return this.isDelta(e)&&this.isDelta(t)?l(e.ops,t.ops):l(e,t)},regenerate:function(){this.quillDelta=this.editor.getContents(),this.quillSelection=this.editor.getSelection(),this.setState({generation:this.state.generation+1})},renderEditingArea:function(){var e=this,t=this.props.children,n={key:this.state.generation,tabIndex:this.props.tabIndex,ref:function(t){e.editingArea=t}},o=r.Children.count(t)?r.Children.only(t):null;return o?r.cloneElement(o,n):c.div(n)},render:function(){return c.div({id:this.props.id,style:this.props.style,key:this.state.generation,className:["quill"].concat(this.props.className).join(" "),onKeyPress:this.props.onKeyPress,onKeyDown:this.props.onKeyDown,onKeyUp:this.props.onKeyUp},this.renderEditingArea())},onEditorChangeText:function(e,t,n,r){var o=this.getEditorContents(),i=this.isDelta(o)?r.getContents():r.getHTML();this.isEqualValue(i,o)||(this.lastDeltaChangeSet=t,this.setState({value:i}),this.props.onChange&&this.props.onChange(e,t,n,r))},onEditorChangeSelection:function(e,t,n){var r=this.getEditorSelection(),o=!r&&e,i=r&&!e;l(e,r)||(this.setState({selection:e}),this.props.onChangeSelection&&this.props.onChangeSelection(e,t,n),o&&this.props.onFocus?this.props.onFocus(e,t,n):i&&this.props.onBlur&&this.props.onBlur(r,t,n))},focus:function(){this.editor.focus()},blur:function(){this.setEditorSelection(this.editor,null)}});e.exports=f},function(e,t,n){"use strict";function r(e){return e}function o(e,t,n){function o(e,t){var n=b.hasOwnProperty(t)?b[t]:null;O.hasOwnProperty(t)&&u("OVERRIDE_BASE"===n,"ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.",t),e&&u("DEFINE_MANY"===n||"DEFINE_MANY_MERGED"===n,"ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",t)}function s(e,n){if(n){u("function"!=typeof n,"ReactClass: You're attempting to use a component class or function as a mixin. Instead, just use a regular object."),u(!t(n),"ReactClass: You're attempting to use a component as a mixin. Instead, just use a regular object.");var r=e.prototype,i=r.__reactAutoBindPairs;n.hasOwnProperty(l)&&_.mixins(e,n.mixins);for(var a in n)if(n.hasOwnProperty(a)&&a!==l){var s=n[a],c=r.hasOwnProperty(a);if(o(c,a),_.hasOwnProperty(a))_[a](e,s);else{var f=b.hasOwnProperty(a),h="function"==typeof s,y=h&&!f&&!c&&!1!==n.autobind;if(y)i.push(a,s),r[a]=s;else if(c){var v=b[a];u(f&&("DEFINE_MANY_MERGED"===v||"DEFINE_MANY"===v),"ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.",v,a),"DEFINE_MANY_MERGED"===v?r[a]=p(r[a],s):"DEFINE_MANY"===v&&(r[a]=d(r[a],s))}else r[a]=s}}}else;}function c(e,t){if(t)for(var n in t){var r=t[n];if(t.hasOwnProperty(n)){var o=n in _;u(!o,'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.',n);var i=n in e;if(i){var a=g.hasOwnProperty(n)?g[n]:null;return u("DEFINE_MANY_MERGED"===a,"ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",n),void(e[n]=p(e[n],r))}e[n]=r}}}function f(e,t){u(e&&t&&"object"==typeof e&&"object"==typeof t,"mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.");for(var n in t)t.hasOwnProperty(n)&&(u(void 0===e[n],"mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.",n),e[n]=t[n]);return e}function p(e,t){return function(){var n=e.apply(this,arguments),r=t.apply(this,arguments);if(null==n)return r;if(null==r)return n;var o={};return f(o,n),f(o,r),o}}function d(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}function h(e,t){var n=t.bind(e);return n}function y(e){for(var t=e.__reactAutoBindPairs,n=0;n<t.length;n+=2){var r=t[n],o=t[n+1];e[r]=h(e,o)}}function v(e){var t=r(function(e,r,o){this.__reactAutoBindPairs.length&&y(this),this.props=e,this.context=r,this.refs=a,this.updater=o||n,this.state=null;var i=this.getInitialState?this.getInitialState():null;u("object"==typeof i&&!Array.isArray(i),"%s.getInitialState(): must return an object or null",t.displayName||"ReactCompositeComponent"),this.state=i});t.prototype=new x,t.prototype.constructor=t,t.prototype.__reactAutoBindPairs=[],m.forEach(s.bind(null,t)),s(t,w),s(t,e),s(t,E),t.getDefaultProps&&(t.defaultProps=t.getDefaultProps()),u(t.prototype.render,"createClass(...): Class specification must implement a `render` method.");for(var o in b)t.prototype[o]||(t.prototype[o]=null);return t}var m=[],b={mixins:"DEFINE_MANY",statics:"DEFINE_MANY",propTypes:"DEFINE_MANY",contextTypes:"DEFINE_MANY",childContextTypes:"DEFINE_MANY",getDefaultProps:"DEFINE_MANY_MERGED",getInitialState:"DEFINE_MANY_MERGED",getChildContext:"DEFINE_MANY_MERGED",render:"DEFINE_ONCE",componentWillMount:"DEFINE_MANY",componentDidMount:"DEFINE_MANY",componentWillReceiveProps:"DEFINE_MANY",shouldComponentUpdate:"DEFINE_ONCE",componentWillUpdate:"DEFINE_MANY",componentDidUpdate:"DEFINE_MANY",componentWillUnmount:"DEFINE_MANY",UNSAFE_componentWillMount:"DEFINE_MANY",UNSAFE_componentWillReceiveProps:"DEFINE_MANY",UNSAFE_componentWillUpdate:"DEFINE_MANY",updateComponent:"OVERRIDE_BASE"},g={getDerivedStateFromProps:"DEFINE_MANY_MERGED"},_={displayName:function(e,t){e.displayName=t},mixins:function(e,t){if(t)for(var n=0;n<t.length;n++)s(e,t[n])},childContextTypes:function(e,t){e.childContextTypes=i({},e.childContextTypes,t)},contextTypes:function(e,t){e.contextTypes=i({},e.contextTypes,t)},getDefaultProps:function(e,t){e.getDefaultProps?e.getDefaultProps=p(e.getDefaultProps,t):e.getDefaultProps=t},propTypes:function(e,t){e.propTypes=i({},e.propTypes,t)},statics:function(e,t){c(e,t)},autobind:function(){}},w={componentDidMount:function(){this.__isMounted=!0}},E={componentWillUnmount:function(){this.__isMounted=!1}},O={replaceState:function(e,t){this.updater.enqueueReplaceState(this,e,t)},isMounted:function(){return!!this.__isMounted}},x=function(){};return i(x.prototype,e.prototype,O),v}var i=n(23),a=n(24),u=n(82),l="mixins";e.exports=o},function(e,t,n){function r(e){return function(t,n,r){var u=Object(t);if(!i(t)){var l=o(n,3);t=a(t),n=function(e){return l(u[e],e,u)}}var s=e(t,n,r);return s>-1?u[l?t[s]:s]:void 0}}var o=n(60),i=n(16),a=n(34);e.exports=r},function(e,t,n){function r(e){var t=i(e);return 1==t.length&&t[0][2]?a(t[0][0],t[0][1]):function(n){return n===e||o(n,e,t)}}var o=n(261),i=n(284),a=n(106);e.exports=r},function(e,t,n){function r(e,t,n,r){var l=n.length,s=l,c=!r;if(null==e)return!s;for(e=Object(e);l--;){var f=n[l];if(c&&f[2]?f[1]!==e[f[0]]:!(f[0]in e))return!1}for(;++l<s;){f=n[l];var p=f[0],d=e[p],h=f[1];if(c&&f[2]){if(void 0===d&&!(p in e))return!1}else{var y=new o;if(r)var v=r(d,h,p,e,t,y);if(!(void 0===v?i(h,d,a|u,r,y):v))return!1}}return!0}var o=n(39),i=n(61),a=1,u=2;e.exports=r},function(e,t,n){function r(e,t,n,r,v,b){var g=s(e),_=s(t),w=g?h:l(e),E=_?h:l(t);w=w==d?y:w,E=E==d?y:E;var O=w==y,x=E==y,k=w==E;if(k&&c(e)){if(!c(t))return!1;g=!0,O=!1}if(k&&!O)return b||(b=new o),g||f(e)?i(e,t,n,r,v,b):a(e,t,w,n,r,v,b);if(!(n&p)){var S=O&&m.call(e,"__wrapped__"),C=x&&m.call(t,"__wrapped__");if(S||C){var P=S?e.value():e,j=C?t.value():t;return b||(b=new o),v(P,j,n,r,b)}}return!!k&&(b||(b=new o),u(e,t,n,r,v,b))}var o=n(39),i=n(103),a=n(267),u=n(270),l=n(279),s=n(8),c=n(48),f=n(49),p=1,d="[object Arguments]",h="[object Array]",y="[object Object]",v=Object.prototype,m=v.hasOwnProperty;e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new o;++t<n;)this.add(e[t])}var o=n(42),i=n(264),a=n(265);r.prototype.add=r.prototype.push=i,r.prototype.has=a,e.exports=r},function(e,t){function n(e){return this.__data__.set(e,r),this}var r="__lodash_hash_undefined__";e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t){function n(e,t){return e.has(t)}e.exports=n},function(e,t,n){function r(e,t,n,r,o,O,k){switch(n){case E:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case w:return!(e.byteLength!=t.byteLength||!O(new i(e),new i(t)));case p:case d:case v:return a(+e,+t);case h:return e.name==t.name&&e.message==t.message;case m:case g:return e==t+"";case y:var S=l;case b:var C=r&c;if(S||(S=s),e.size!=t.size&&!C)return!1;var P=k.get(e);if(P)return P==t;r|=f,k.set(e,t);var j=u(S(e),S(t),r,o,O,k);return k.delete(e),j;case _:if(x)return x.call(e)==x.call(t)}return!1}var o=n(29),i=n(75),a=n(19),u=n(103),l=n(268),s=n(269),c=1,f=2,p="[object Boolean]",d="[object Date]",h="[object Error]",y="[object Map]",v="[object Number]",m="[object RegExp]",b="[object Set]",g="[object String]",_="[object Symbol]",w="[object ArrayBuffer]",E="[object DataView]",O=o?o.prototype:void 0,x=O?O.valueOf:void 0;e.exports=r},function(e,t){function n(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}e.exports=n},function(e,t){function n(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}e.exports=n},function(e,t,n){function r(e,t,n,r,a,l){var s=n&i,c=o(e),f=c.length;if(f!=o(t).length&&!s)return!1;for(var p=f;p--;){var d=c[p];if(!(s?d in t:u.call(t,d)))return!1}var h=l.get(e);if(h&&l.get(t))return h==t;var y=!0;l.set(e,t),l.set(t,e);for(var v=s;++p<f;){d=c[p];var m=e[d],b=t[d];if(r)var g=s?r(b,m,d,t,e,l):r(m,b,d,e,t,l);if(!(void 0===g?m===b||a(m,b,n,r,l):g)){y=!1;break}v||(v="constructor"==d)}if(y&&!v){var _=e.constructor,w=t.constructor;_!=w&&"constructor"in e&&"constructor"in t&&!("function"==typeof _&&_ instanceof _&&"function"==typeof w&&w instanceof w)&&(y=!1)}return l.delete(e),l.delete(t),y}var o=n(271),i=1,a=Object.prototype,u=a.hasOwnProperty;e.exports=r},function(e,t,n){function r(e){return o(e,a,i)}var o=n(272),i=n(274),a=n(34);e.exports=r},function(e,t,n){function r(e,t,n){var r=t(e);return i(e)?r:o(r,n(e))}var o=n(273),i=n(8);e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}e.exports=n},function(e,t,n){var r=n(275),o=n(276),i=Object.prototype,a=i.propertyIsEnumerable,u=Object.getOwnPropertySymbols,l=u?function(e){return null==e?[]:(e=Object(e),r(u(e),function(t){return a.call(e,t)}))}:o;e.exports=l},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var a=e[n];t(a,n,e)&&(i[o++]=a)}return i}e.exports=n},function(e,t){function n(){return[]}e.exports=n},function(e,t,n){function r(e){if(!o(e))return i(e);var t=[];for(var n in Object(e))u.call(e,n)&&"constructor"!=n&&t.push(n);return t}var o=n(45),i=n(278),a=Object.prototype,u=a.hasOwnProperty;e.exports=r},function(e,t,n){var r=n(77),o=r(Object.keys,Object);e.exports=o},function(e,t,n){var r=n(280),o=n(40),i=n(281),a=n(282),u=n(283),l=n(15),s=n(71),c=s(r),f=s(o),p=s(i),d=s(a),h=s(u),y=l;(r&&"[object DataView]"!=y(new r(new ArrayBuffer(1)))||o&&"[object Map]"!=y(new o)||i&&"[object Promise]"!=y(i.resolve())||a&&"[object Set]"!=y(new a)||u&&"[object WeakMap]"!=y(new u))&&(y=function(e){var t=l(e),n="[object Object]"==t?e.constructor:void 0,r=n?s(n):"";if(r)switch(r){case c:return"[object DataView]";case f:return"[object Map]";case p:return"[object Promise]";case d:return"[object Set]";case h:return"[object WeakMap]"}return t}),e.exports=y},function(e,t,n){var r=n(13),o=n(7),i=r(o,"DataView");e.exports=i},function(e,t,n){var r=n(13),o=n(7),i=r(o,"Promise");e.exports=i},function(e,t,n){var r=n(13),o=n(7),i=r(o,"Set");e.exports=i},function(e,t,n){var r=n(13),o=n(7),i=r(o,"WeakMap");e.exports=i},function(e,t,n){function r(e){for(var t=i(e),n=t.length;n--;){var r=t[n],a=e[r];t[n]=[r,a,o(a)]}return t}var o=n(105),i=n(34);e.exports=r},function(e,t,n){function r(e,t){return u(e)&&l(t)?s(c(e),t):function(n){var r=i(n,e);return void 0===r&&r===t?a(n,e):o(t,r,f|p)}}var o=n(61),i=n(286),a=n(293),u=n(62),l=n(105),s=n(106),c=n(36),f=1,p=2;e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?void 0:o(e,t);return void 0===r?n:r}var o=n(107);e.exports=r},function(e,t,n){var r=n(288),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,i=/\\(\\)?/g,a=r(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(o,function(e,n,r,o){t.push(r?o.replace(i,"$1"):n||e)}),t});e.exports=a},function(e,t,n){function r(e){var t=o(e,function(e){return n.size===i&&n.clear(),e}),n=t.cache;return t}var o=n(289),i=500;e.exports=r},function(e,t,n){function r(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError(i);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=e.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new(r.Cache||o),n}var o=n(42),i="Expected a function";r.Cache=o,e.exports=r},function(e,t,n){function r(e){return null==e?"":o(e)}var o=n(291);e.exports=r},function(e,t,n){function r(e){if("string"==typeof e)return e;if(a(e))return i(e,r)+"";if(u(e))return c?c.call(e):"";var t=e+"";return"0"==t&&1/e==-l?"-0":t}var o=n(29),i=n(292),a=n(8),u=n(35),l=1/0,s=o?o.prototype:void 0,c=s?s.toString:void 0;e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}e.exports=n},function(e,t,n){function r(e,t){return null!=e&&i(e,t,o)}var o=n(294),i=n(295);e.exports=r},function(e,t){function n(e,t){return null!=e&&t in Object(e)}e.exports=n},function(e,t,n){function r(e,t,n){t=o(t,e);for(var r=-1,c=t.length,f=!1;++r<c;){var p=s(t[r]);if(!(f=null!=e&&n(e,p)))break;e=e[p]}return f||++r!=c?f:!!(c=null==e?0:e.length)&&l(c)&&u(p,c)&&(a(e)||i(e))}var o=n(108),i=n(46),a=n(8),u=n(50),l=n(47),s=n(36);e.exports=r},function(e,t,n){function r(e){return a(e)?o(u(e)):i(e)}var o=n(297),i=n(298),a=n(62),u=n(36);e.exports=r},function(e,t){function n(e){return function(t){return null==t?void 0:t[e]}}e.exports=n},function(e,t,n){function r(e){return function(t){return o(t,e)}}var o=n(107);e.exports=r},function(e,t,n){function r(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var l=null==n?0:a(n);return l<0&&(l=u(r+l,0)),o(e,i(t,3),l)}var o=n(300),i=n(60),a=n(301),u=Math.max;e.exports=r},function(e,t){function n(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i;return-1}e.exports=n},function(e,t,n){function r(e){var t=o(e),n=t%1;return t===t?n?t-n:t:0}var o=n(302);e.exports=r},function(e,t,n){function r(e){if(!e)return 0===e?e:0;if((e=o(e))===i||e===-i){return(e<0?-1:1)*a}return e===e?e:0}var o=n(303),i=1/0,a=1.7976931348623157e308;e.exports=r},function(e,t,n){function r(e){if("number"==typeof e)return e;if(i(e))return a;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(u,"");var n=s.test(e);return n||c.test(e)?f(e.slice(2),n?2:8):l.test(e)?a:+e}var o=n(10),i=n(35),a=NaN,u=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,c=/^0o[0-7]+$/i,f=parseInt;e.exports=r},function(e,t,n){function r(e,t,n){var r=u(e)?o:a;return n&&l(e,t,n)&&(t=void 0),r(e,i(t,3))}var o=n(104),i=n(60),a=n(305),u=n(8),l=n(81);e.exports=r},function(e,t,n){function r(e,t){var n;return o(e,function(e,r,o){return!(n=t(e,r,o))}),!!n}var o=n(306);e.exports=r},function(e,t,n){var r=n(307),o=n(308),i=o(r);e.exports=i},function(e,t,n){function r(e,t){return e&&o(e,t,i)}var o=n(74),i=n(34);e.exports=r},function(e,t,n){function r(e,t){return function(n,r){if(null==n)return n;if(!o(n))return e(n,r);for(var i=n.length,a=t?i:-1,u=Object(n);(t?a--:++a<i)&&!1!==r(u[a],a,u););return n}}var o=n(16);e.exports=r},function(e,t,n){"use strict";var r=(n(0),n(310)),o=n(100),i=n(102),a=n(109),u=n(2),l=n(110),s=["rgb(  0,   0,   0)","rgb(230,   0,   0)","rgb(255, 153,   0)","rgb(255, 255,   0)","rgb(  0, 138,   0)","rgb(  0, 102, 204)","rgb(153,  51, 255)","rgb(255, 255, 255)","rgb(250, 204, 204)","rgb(255, 235, 204)","rgb(255, 255, 204)","rgb(204, 232, 204)","rgb(204, 224, 245)","rgb(235, 214, 255)","rgb(187, 187, 187)","rgb(240, 102, 102)","rgb(255, 194, 102)","rgb(255, 255, 102)","rgb(102, 185, 102)","rgb(102, 163, 224)","rgb(194, 133, 255)","rgb(136, 136, 136)","rgb(161,   0,   0)","rgb(178, 107,   0)","rgb(178, 178,   0)","rgb(  0,  97,   0)","rgb(  0,  71, 178)","rgb(107,  36, 178)","rgb( 68,  68,  68)","rgb( 92,   0,   0)","rgb(102,  61,   0)","rgb(102, 102,   0)","rgb(  0,  55,   0)","rgb(  0,  41, 102)","rgb( 61,  20,  10)"].map(function(e){return{value:e}}),c=[{label:"Formats",type:"group",items:[{label:"Font",type:"font",items:[{label:"Sans Serif",value:"sans-serif",selected:!0},{label:"Serif",value:"serif"},{label:"Monospace",value:"monospace"}]},{label:"Size",type:"size",items:[{label:"Small",value:"10px"},{label:"Normal",value:"13px",selected:!0},{label:"Large",value:"18px"},{label:"Huge",value:"32px"}]},{label:"Alignment",type:"align",items:[{label:"",value:"",selected:!0},{label:"",value:"center"},{label:"",value:"right"},{label:"",value:"justify"}]}]},{label:"Text",type:"group",items:[{type:"bold",label:"Bold"},{type:"italic",label:"Italic"},{type:"strike",label:"Strike"},{type:"underline",label:"Underline"},{type:"color",label:"Color",items:s},{type:"background",label:"Background color",items:s},{type:"link",label:"Link"}]},{label:"Blocks",type:"group",items:[{type:"list",value:"bullet"},{type:"list",value:"ordered"}]},{label:"Blocks",type:"group",items:[{type:"image",label:"Image"}]}],f=o({displayName:"Quill Toolbar",propTypes:{id:u.string,className:u.string,style:u.object,items:u.array},getDefaultProps:function(){return{items:c}},componentDidMount:function(){console.warn("QuillToolbar is deprecated. Consider switching to the official Quill toolbar format, or providing your own toolbar instead. See: https://github.com/zenoamaro/react-quill#upgrading-to-react-quill-v1-0-0")},shouldComponentUpdate:function(e,t){return!a(e,this.props)},renderGroup:function(e,t){return l.span({key:e.label||t,className:"ql-formats"},e.items.map(this.renderItem))},renderChoiceItem:function(e,t){return l.option({key:e.label||e.value||t,value:e.value},e.label)},renderChoices:function(e,t){var n=e.items.map(this.renderChoiceItem),r=i(e.items,function(e){return e.selected}),o={key:e.label||t,title:e.label,className:"ql-"+e.type,value:r.value};return l.select(o,n)},renderButton:function(e,t){return l.button({type:"button",key:e.label||e.value||t,value:e.value,className:"ql-"+e.type,title:e.label},e.children)},renderAction:function(e,t){return l.button({key:e.label||e.value||t,className:"ql-"+e.type,title:e.label},e.children)},renderItem:function(e,t){switch(e.type){case"group":return this.renderGroup(e,t);case"font":case"header":case"align":case"size":case"color":case"background":return this.renderChoices(e,t);case"bold":case"italic":case"underline":case"strike":case"link":case"list":case"bullet":case"ordered":case"indent":case"image":case"video":return this.renderButton(e,t);default:return this.renderAction(e,t)}},getClassName:function(){return"quill-toolbar "+(this.props.className||"")},render:function(){var e=this.props.items.map(this.renderItem),t=e.map(r.renderToStaticMarkup).join("");return l.div({id:this.props.id,className:this.getClassName(),style:this.props.style,dangerouslySetInnerHTML:{__html:t}})}});e.exports=f,f.defaultItems=c,f.defaultColors=s},function(e,t,n){"use strict";e.exports=n(311)},function(e,t,n){"use strict";function r(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);throw t=Error(n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."),t.name="Invariant Violation",t.framesToPop=1,t}function o(e){return!!M.hasOwnProperty(e)||!R.hasOwnProperty(e)&&(A.test(e)?M[e]=!0:(R[e]=!0,!1))}function i(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}function a(e,t,n,r){if(null===t||void 0===t||i(e,t,n,r))return!0;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function u(e,t,n,r,o){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t}function l(e){return e[1].toUpperCase()}function s(e){if("boolean"==typeof e||"number"==typeof e)return""+e;e=""+e;var t=q.exec(e);if(t){var n,r="",o=0;for(n=t.index;n<e.length;n++){switch(e.charCodeAt(n)){case 34:t="&quot;";break;case 38:t="&amp;";break;case 39:t="&#x27;";break;case 60:t="&lt;";break;case 62:t="&gt;";break;default:continue}o!==n&&(r+=e.substring(o,n)),o=n+1,r+=t}e=o!==n?r+e.substring(o,n):r}return e}function c(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function f(e){return"string"==typeof e?e:"function"==typeof e?e.displayName||e.name:null}function p(e){var t="";return m.Children.forEach(e,function(e){null==e||"string"!=typeof e&&"number"!=typeof e||(t+=e)}),t}function d(e,t){if(e=e.contextTypes){var n,r={};for(n in e)r[n]=t[n];t=r}else t=g;return t}function h(e,t){void 0===e&&r("152",f(t)||"Component")}function y(e,t){for(;m.isValidElement(e);){var n=e,o=n.type;if("function"!=typeof o)break;!function(n,o){var i=d(o,t),a=[],u=!1,l={isMounted:function(){return!1},enqueueForceUpdate:function(){if(null===a)return null},enqueueReplaceState:function(e,t){u=!0,a=[t]},enqueueSetState:function(e,t){if(null===a)return null;a.push(t)}},s=void 0;if(o.prototype&&o.prototype.isReactComponent){if(s=new o(n.props,i,l),"function"==typeof o.getDerivedStateFromProps){var c=o.getDerivedStateFromProps.call(null,n.props,s.state);null!=c&&(s.state=v({},s.state,c))}}else if(null==(s=o(n.props,i,l))||null==s.render)return e=s,void h(e,o);if(s.props=n.props,s.context=i,s.updater=l,l=s.state,void 0===l&&(s.state=l=null),"function"==typeof s.UNSAFE_componentWillMount||"function"==typeof s.componentWillMount)if("function"==typeof s.componentWillMount&&"function"!=typeof o.getDerivedStateFromProps&&s.componentWillMount(),"function"==typeof s.UNSAFE_componentWillMount&&"function"!=typeof o.getDerivedStateFromProps&&s.UNSAFE_componentWillMount(),a.length){l=a;var p=u;if(a=null,u=!1,p&&1===l.length)s.state=l[0];else{c=p?l[0]:s.state;var y=!0;for(p=p?1:0;p<l.length;p++){var m=l[p];null!=(m="function"==typeof m?m.call(s,c,n.props,i):m)&&(y?(y=!1,c=v({},c,m)):v(c,m))}s.state=c}}else a=null;if(e=s.render(),h(e,o),n=void 0,"function"==typeof s.getChildContext&&"object"==typeof(i=o.childContextTypes)){n=s.getChildContext();for(var b in n)b in i||r("108",f(o)||"Unknown",b)}n&&(t=v({},t,n))}(n,o)}return{child:e,context:t}}/** @license React v16.3.0
 * react-dom-server.browser.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var v=n(23),m=n(0),b=n(25),g=n(24),_=n(312),w=n(314),E="function"==typeof Symbol&&Symbol.for,O=E?Symbol.for("react.call"):60104,x=E?Symbol.for("react.return"):60105,k=E?Symbol.for("react.portal"):60106,S=E?Symbol.for("react.fragment"):60107,C=E?Symbol.for("react.strict_mode"):60108,P=E?Symbol.for("react.provider"):60109,j=E?Symbol.for("react.context"):60110,T=E?Symbol.for("react.async_mode"):60111,N=E?Symbol.for("react.forward_ref"):60112,A=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,R={},M={},L={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){L[e]=new u(e,0,!1,e,null)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];L[t]=new u(t,1,!1,e[1],null)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){L[e]=new u(e,2,!1,e.toLowerCase(),null)}),["autoReverse","externalResourcesRequired","preserveAlpha"].forEach(function(e){L[e]=new u(e,2,!1,e,null)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){L[e]=new u(e,3,!1,e.toLowerCase(),null)}),["checked","multiple","muted","selected"].forEach(function(e){L[e]=new u(e,3,!0,e.toLowerCase(),null)}),["capture","download"].forEach(function(e){L[e]=new u(e,4,!1,e.toLowerCase(),null)}),["cols","rows","size","span"].forEach(function(e){L[e]=new u(e,6,!1,e.toLowerCase(),null)}),["rowSpan","start"].forEach(function(e){L[e]=new u(e,5,!1,e.toLowerCase(),null)});var I=/[\-\:]([a-z])/g;"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(I,l);L[t]=new u(t,1,!1,e,null)}),"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(I,l);L[t]=new u(t,1,!1,e,"http://www.w3.org/1999/xlink")}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(I,l);L[t]=new u(t,1,!1,e,"http://www.w3.org/XML/1998/namespace")}),L.tabIndex=new u("tabIndex",1,!1,"tabindex",null);var q=/["'&<>]/,U={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"},D={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},F=v({menuitem:!0},D),B={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},H=["Webkit","ms","Moz","O"];Object.keys(B).forEach(function(e){H.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),B[t]=B[e]})});var z=m.Children.toArray,V=b.thatReturns("");b.thatReturns("");var W={listing:!0,pre:!0,textarea:!0},K=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,Y={},$=w(function(e){return _(e)}),G={children:null,dangerouslySetInnerHTML:null,suppressContentEditableWarning:null,suppressHydrationWarning:null},Q=function(){function e(t,n){if(!(this instanceof e))throw new TypeError("Cannot call a class as a function");m.isValidElement(t)?t.type!==S?t=[t]:(t=t.props.children,t=m.isValidElement(t)?[t]:z(t)):t=z(t),this.stack=[{type:null,domNamespace:U.html,children:t,childIndex:0,context:g,footer:""}],this.exhausted=!1,this.currentSelectValue=null,this.previousWasTextNode=!1,this.makeStaticMarkup=n,this.providerStack=[],this.providerIndex=-1}return e.prototype.pushProvider=function(e){this.providerIndex+=1,this.providerStack[this.providerIndex]=e,e.type.context._currentValue=e.props.value},e.prototype.popProvider=function(e){this.providerStack[this.providerIndex]=null,--this.providerIndex,e=e.type.context,e._currentValue=0>this.providerIndex?e._defaultValue:this.providerStack[this.providerIndex].props.value},e.prototype.read=function(e){if(this.exhausted)return null;for(var t="";t.length<e;){if(0===this.stack.length){this.exhausted=!0;break}var n=this.stack[this.stack.length-1];if(n.childIndex>=n.children.length){var r=n.footer;t+=r,""!==r&&(this.previousWasTextNode=!1),this.stack.pop(),"select"===n.type?this.currentSelectValue=null:null!=n.type&&null!=n.type.type&&n.type.type.$$typeof===P&&this.popProvider(n.type)}else r=n.children[n.childIndex++],t+=this.render(r,n.context,n.domNamespace)}return t},e.prototype.render=function(e,t,n){if("string"==typeof e||"number"==typeof e)return""===(n=""+e)?"":this.makeStaticMarkup?s(n):this.previousWasTextNode?"\x3c!-- --\x3e"+s(n):(this.previousWasTextNode=!0,s(n));if(t=y(e,t),e=t.child,t=t.context,null===e||!1===e)return"";if(!m.isValidElement(e)){if(null!=e&&null!=e.$$typeof){var o=e.$$typeof;o===k&&r("257"),r("258",o.toString())}return e=z(e),this.stack.push({type:null,domNamespace:n,children:e,childIndex:0,context:t,footer:""}),""}if("string"==typeof(o=e.type))return this.renderDOM(e,t,n);switch(o){case C:case T:case S:return e=z(e.props.children),this.stack.push({type:null,domNamespace:n,children:e,childIndex:0,context:t,footer:""}),"";case O:case x:r("259")}if("object"==typeof o&&null!==o)switch(o.$$typeof){case N:return e=z(o.render(e.props,e.ref)),this.stack.push({type:null,domNamespace:n,children:e,childIndex:0,context:t,footer:""}),"";case P:return o=z(e.props.children),n={type:e,domNamespace:n,children:o,childIndex:0,context:t,footer:""},this.pushProvider(e),this.stack.push(n),"";case j:return o=z(e.props.children(e.type._currentValue)),this.stack.push({type:e,domNamespace:n,children:o,childIndex:0,context:t,footer:""}),""}r("130",null==o?o:typeof o,"")},e.prototype.renderDOM=function(e,t,n){var i=e.type.toLowerCase();n===U.html&&c(i),Y.hasOwnProperty(i)||(K.test(i)||r("65",i),Y[i]=!0);var u=e.props;if("input"===i)u=v({type:void 0},u,{defaultChecked:void 0,defaultValue:void 0,value:null!=u.value?u.value:u.defaultValue,checked:null!=u.checked?u.checked:u.defaultChecked});else if("textarea"===i){var l=u.value;if(null==l){l=u.defaultValue;var f=u.children;null!=f&&(null!=l&&r("92"),Array.isArray(f)&&(1>=f.length||r("93"),f=f[0]),l=""+f),null==l&&(l="")}u=v({},u,{value:void 0,children:""+l})}else if("select"===i)this.currentSelectValue=null!=u.value?u.value:u.defaultValue,u=v({},u,{value:void 0});else if("option"===i){f=this.currentSelectValue;var d=p(u.children);if(null!=f){var h=null!=u.value?u.value+"":d;if(l=!1,Array.isArray(f)){for(var y=0;y<f.length;y++)if(""+f[y]===h){l=!0;break}}else l=""+f===h;u=v({selected:void 0,children:void 0},u,{selected:l,children:d})}}(l=u)&&(F[i]&&(null!=l.children||null!=l.dangerouslySetInnerHTML)&&r("137",i,V()),null!=l.dangerouslySetInnerHTML&&(null!=l.children&&r("60"),"object"==typeof l.dangerouslySetInnerHTML&&"__html"in l.dangerouslySetInnerHTML||r("61")),null!=l.style&&"object"!=typeof l.style&&r("62",V())),l=u,f=this.makeStaticMarkup,d=1===this.stack.length,h="<"+e.type;for(E in l)if(l.hasOwnProperty(E)){var m=l[E];if(null!=m){if("style"===E){y=void 0;var b="",g="";for(y in m)if(m.hasOwnProperty(y)){var _=0===y.indexOf("--"),w=m[y];null!=w&&(b+=g+$(y)+":",g=y,_=null==w||"boolean"==typeof w||""===w?"":_||"number"!=typeof w||0===w||B.hasOwnProperty(g)&&B[g]?(""+w).trim():w+"px",b+=_,g=";")}m=b||null}y=null;e:if(_=i,w=l,-1===_.indexOf("-"))_="string"==typeof w.is;else switch(_){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":_=!1;break e;default:_=!0}_?G.hasOwnProperty(E)||(y=E,y=o(y)&&null!=m?y+'="'+s(m)+'"':""):(_=E,y=m,m=L.hasOwnProperty(_)?L[_]:null,(w="style"!==_)&&(w=null!==m?0===m.type:2<_.length&&("o"===_[0]||"O"===_[0])&&("n"===_[1]||"N"===_[1])),w||a(_,y,m,!1)?y="":null!==m?(_=m.attributeName,m=m.type,y=3===m||4===m&&!0===y?_+'=""':_+'="'+s(y)+'"'):y=_+'="'+s(y)+'"'),y&&(h+=" "+y)}}f||d&&(h+=' data-reactroot=""');var E=h;l="",D.hasOwnProperty(i)?E+="/>":(E+=">",l="</"+e.type+">");e:{if(null!=(f=u.dangerouslySetInnerHTML)){if(null!=f.__html){f=f.__html;break e}}else if("string"==typeof(f=u.children)||"number"==typeof f){f=s(f);break e}f=null}return null!=f?(u=[],W[i]&&"\n"===f.charAt(0)&&(E+="\n"),E+=f):u=z(u.children),e=e.type,n=null==n||"http://www.w3.org/1999/xhtml"===n?c(e):"http://www.w3.org/2000/svg"===n&&"foreignObject"===e?"http://www.w3.org/1999/xhtml":n,this.stack.push({domNamespace:n,type:i,children:u,childIndex:0,context:t,footer:l}),this.previousWasTextNode=!1,E},e}(),Z={renderToString:function(e){return new Q(e,!1).read(1/0)},renderToStaticMarkup:function(e){return new Q(e,!0).read(1/0)},renderToNodeStream:function(){r("207")},renderToStaticNodeStream:function(){r("208")},version:"16.3.0"},X=Object.freeze({default:Z}),J=X&&Z||X;e.exports=J.default?J.default:J},function(e,t,n){"use strict";function r(e){return o(e).replace(i,"-ms-")}var o=n(313),i=/^ms-/;e.exports=r},function(e,t,n){"use strict";function r(e){return e.replace(o,"-$1").toLowerCase()}var o=/([A-Z])/g;e.exports=r},function(e,t,n){"use strict";function r(e){var t={};return function(n){return t.hasOwnProperty(n)||(t[n]=e.call(this,n)),t[n]}}e.exports=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(6),u=n(1),l=n(95),s=r(l),c=n(96),f=r(c),p=n(316),d=r(p),h=n(317),y=r(h),v=n(318),m=r(v),b=function(e){var t=e.modal,n=e.closeModal;if(!t)return null;var r=void 0;switch(t){case"login":r=i.default.createElement(s.default,null);break;case"signup":r=i.default.createElement(f.default,null);break;case"comment-login":r=i.default.createElement(d.default,null);break;case"like-login":r=i.default.createElement(y.default,null);break;case"follow-login":r=i.default.createElement(m.default,null);break;default:return null}return i.default.createElement("div",{className:"modal-background",onClick:n},i.default.createElement("div",{className:"modal-child",onClick:function(e){e.stopPropagation(),"Create One."!==e.target.innerText&&"Login."!==e.target.innerText||e.preventDefault()}},r))},g=function(e){return{modal:e.ui.modal}},_=function(e){return{closeModal:function(){return e((0,a.closeModal)())}}};t.default=(0,u.connect)(g,_)(b)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(1),u=n(12),l=n(6),s=n(22),c=r(s),f=function(e){return{errors:e.errors.session,formType:"signup",redirectPageMessage:"Already have an account? ",headerMessage:"Create an account to comment",modalMessage:"Start a conversation, share ideas. Log in or create an account in order to begin commenting and connecting with others."}},p=function(e){return{processForm:function(t){return e((0,u.signup)(t))},otherForm:i.default.createElement("button",{className:"other-form-button",onClick:function(){return e((0,l.openModal)("login"))}},"Login."),closeModal:function(){return e((0,l.closeModal)())},clearErrors:function(){return e((0,u.receiveErrors)([]))}}};t.default=(0,a.connect)(f,p)(c.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(1),u=n(12),l=n(6),s=n(22),c=r(s),f=function(e){return{errors:e.errors.session,formType:"signup",redirectPageMessage:"Already have an account? ",headerMessage:"Create an account to like",modalMessage:"That is really nice that you like some content. Why not make an account and let the writer know you like what they wrote!"}},p=function(e){return{processForm:function(t){return e((0,u.signup)(t))},otherForm:i.default.createElement("button",{className:"other-form-button",onClick:function(){return e((0,l.openModal)("login"))}},"Login."),closeModal:function(){return e((0,l.closeModal)())},clearErrors:function(){return e((0,u.receiveErrors)([]))}}};t.default=(0,a.connect)(f,p)(c.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=r(o),a=n(1),u=n(12),l=n(6),s=n(22),c=r(s),f=function(e){return{errors:e.errors.session,formType:"signup",redirectPageMessage:"Already have an account? ",headerMessage:"Never miss any stories from ya boy",modalMessage:"Make an account and follow your favorite writers. Be inspired and try your hand at writing something original!"}},p=function(e){return{processForm:function(t){return e((0,u.signup)(t))},otherForm:i.default.createElement("button",{className:"other-form-button",onClick:function(){return e((0,l.openModal)("login"))}},"Login."),closeModal:function(){return e((0,l.closeModal)())},clearErrors:function(){return e((0,u.receiveErrors)([]))}}};t.default=(0,a.connect)(f,p)(c.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(320),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(9),u=n(11),l=n(32),s=function(e,t){return{currentUser:e.session.currentUser||"",errors:e.errors.form,userId:t.match.params.userId,user:e.users[t.match.params.userId]}},c=function(e){return{fetchUser:function(t){return e((0,a.fetchUser)(t))},fetchUserStories:function(t){return e((0,u.fetchUserStories)(t))},fetchUserComments:function(t){return e((0,l.fetchUserComments)(t))}}};t.default=(0,r.connect)(s,c)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(111),f=(r(c),n(4)),p=n(64),d=r(p),h=n(330),y=r(h),v=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchUser(this.props.match.params.userId),this.props.fetchUserStories(this.props.match.params.userId),this.props.fetchUserComments(this.props.match.params.userId)}},{key:"componentWillReceiveProps",value:function(e){this.props.match.params.userId!==e.match.params.userId&&this.props.fetchUser(e.match.params.userId)}},{key:"render",value:function(){if(this.props.user){var e=this.props.user,t=parseInt(Object.keys(this.props.currentUser)[0])===e.id?"edit-link":"cannot-edit";return s.default.createElement("main",{className:"user-show-container"},s.default.createElement("div",{className:"user-header-info"},s.default.createElement("img",{className:"user-profile-pic",src:e.image_url}),s.default.createElement("div",{className:"user-details"},s.default.createElement("h3",null,e.username),s.default.createElement("p",{className:"bio"},e.bio),s.default.createElement("p",{className:"member-creation"},"Betwixt member since ",e.created_at),s.default.createElement(f.Link,{className:t,to:"/user/"+e.id+"/edit"},"Edit Profile"),s.default.createElement(d.default,{user:e.id}),s.default.createElement("div",{className:"following-info"},s.default.createElement("p",null,e.followers.length," Followers"),s.default.createElement("p",null,e.following.length," Following")))),s.default.createElement(y.default,{user:e}))}return s.default.createElement("div",null," Loading...")}}]),t}(s.default.Component);t.default=v},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(63),f=r(c),p=function(e){function t(e){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchUserStories(this.props.user.id)}},{key:"render",value:function(){var e=this;if(this.props.authoredStories.length>0&&void 0!==this.props.authoredStories[0]){var t=this.props.authoredStories;return t=t.map(function(t){if(void 0!==t)return s.default.createElement(f.default,{key:t.id,story:t,deleteStory:e.props.deleteStory,currentUser:e.props.currentUser,openModal:e.props.openModal})}),s.default.createElement("ul",{className:"user-stories"},t)}return s.default.createElement("div",null)}}]),t}(s.default.Component);t.default=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(323),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(9),u=function(e,t){return{authorId:t.authorId,author:e.users[t.authorId]}},l=function(e){return{fetchUser:function(t){return e((0,a.fetchUser)(t))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(4),f=n(64),p=r(f),d=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchUser(this.props.authorId)}},{key:"render",value:function(){if(this.props.author){var e=this.props.author;return s.default.createElement("aside",{className:"author-display"},s.default.createElement(c.Link,{to:"/user/"+e.id},s.default.createElement("img",{className:"user-profile-pic",src:e.image_url})),s.default.createElement("div",{className:"user-details"},s.default.createElement("div",{className:"user-name-follow"},s.default.createElement(c.Link,{to:"/user/"+e.id},s.default.createElement("h3",null,e.username)),s.default.createElement(p.default,{user:e.id})),s.default.createElement("p",{className:"bio"},e.bio),s.default.createElement("p",{className:"member-creation"},"Betwixt member since ",e.created_at)))}return s.default.createElement("div",null,"Loading...")}}]),t}(s.default.Component);t.default=d},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"componentDidMount",value:function(){this.props.fetchUser(this.props.userId)}},{key:"render",value:function(){var e=this,t="Follow",n=function(){return e.props.openModal("follow-login")};if(this.props.currentUser){var r=this.props.userId,o=Object.values(this.props.currentUser)[0];n=function(){return e.props.createFollow({follower_id:o.id,following_id:r})},o.following.includes(r)&&(t="Following",n=function(){return e.props.deleteFollow({follower_id:o.id,following_id:r})})}return l.default.createElement("div",{className:"follow-container"},l.default.createElement("button",{className:t,onClick:n},t))}}]),t}(l.default.Component);t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(326),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(32),u=function(e,t){return{storyId:t.story.id,story:t.story,currentUser:e.session.currentUser,storyComments:e.comments}},l=function(e){return{fetchComments:function(t){return e((0,a.fetchComments)(t))},clearErrors:function(){return e((0,a.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(327),f=r(c),p=n(328),d=r(p),h=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={storyComments:n.props.storyComments},n}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchComments(this.props.storyId)}},{key:"render",value:function(){if(this.props.storyComments){var e=Object.values(this.props.storyComments).map(function(e){return s.default.createElement(f.default,{key:e.id,comment:e})});return s.default.createElement("div",{className:"comments-container"},s.default.createElement("h3",null,"Responses"),s.default.createElement(d.default,{storyId:this.props.storyId}),s.default.createElement("ul",{className:"comments-list"},e))}return s.default.createElement("div",null," Loading...")}}]),t}(s.default.Component);t.default=h},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=n(4),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"render",value:function(){var e=this.props.comment.author,t=this.props.comment;return l.default.createElement("li",{className:"comment-item"},l.default.createElement("div",{className:"author-info"},l.default.createElement(s.Link,{to:"/user/"+e.id},l.default.createElement("img",{src:e.image})),l.default.createElement("div",{className:"text-info"},l.default.createElement(s.Link,{to:"/user/"+e.id},l.default.createElement("h3",null,e.name)),l.default.createElement("p",null,t.created_at))),l.default.createElement("div",{className:"comment-body",dangerouslySetInnerHTML:{__html:t.body}}))}}]),t}(l.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(329),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(32),u=n(6),l=function(e,t){return{errors:e.errors.form,storyId:t.storyId,currentUser:e.session.currentUser}},s=function(e){return{clearErrors:function(){return e((0,a.receiveErrors)([]))},openModal:function(t){return e((0,u.openModal)(t))},createComment:function(t){return e((0,a.createComment)(t))}}};t.default=(0,r.connect)(l,s)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(59),f=r(c),p=n(4),d=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),r="";return n.props.currentUser&&(r=Object.keys(n.props.currentUser)[0]),n.state={author_id:r,story_id:n.props.storyId,body:"",placeholder:"Write a response..."},n.handleQuillChange=n.handleQuillChange.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n}return a(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"componentWillReceiveProps",value:function(e){this.props.currentUser!==e.currentUser&&this.setState({author_id:Object.keys(e.currentUser)[0]})}},{key:"handleQuillChange",value:function(e){this.setState({body:e})}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.createComment(this.state).then(this.props.clearErrors()),this.setState({body:""})}},{key:"render",value:function(){var e=this,n=function(){return e.props.openModal("comment-login")};this.state.author_id&&(n=this.handleSubmit);var r=this.props.errors.map(function(e,t){return s.default.createElement("li",{key:t},e)});return s.default.createElement("form",null,s.default.createElement("link",{href:"https://cdn.quilljs.com/1.3.6/quill.snow.css",rel:"stylesheet"}),s.default.createElement(f.default,{theme:"snow",value:this.state.body,onChange:this.handleQuillChange,modules:t.modules,formats:t.formats,placeholder:this.state.placeholder}),s.default.createElement("ul",{className:"error-message"},r),s.default.createElement("button",{onClick:n},"Publish"))}}]),t}(s.default.Component);d.modules={toolbar:[]},d.formats=[],t.default=(0,p.withRouter)(d)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(111),f=r(c),p=n(331),d=r(p),h=n(334),y=r(h),v=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={selected:"Stories"},n.selectTab=n.selectTab.bind(n),n}return a(t,e),u(t,[{key:"selectTab",value:function(e){var t=this;return function(n){return t.setState({selected:e})}}},{key:"render",value:function(){var e=void 0,t="tab",n="tab",r="tab";return"Stories"===this.state.selected?(t+="Selected",n-="Selected",r-="Selected",e=s.default.createElement(f.default,{user:this.props.user})):"Comments"===this.state.selected?(t-="Selected",n+="Selected",r-="Selected",e=s.default.createElement(d.default,{user:this.props.user})):(t-="Selected",n-="Selected",r+="Selected",e=s.default.createElement(y.default,{user:this.props.user})),s.default.createElement("aside",{className:"tabs"},s.default.createElement("nav",{className:"tab-header"},s.default.createElement("button",{className:t,onClick:this.selectTab("Stories")},"Stories"),s.default.createElement("button",{className:n,onClick:this.selectTab("Comments")},"Comments"),s.default.createElement("button",{className:r,onClick:this.selectTab("Likes")},"Likes")),e)}}]),t}(s.default.Component);t.default=v},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(332),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(37),u=function(e,t){var n=t.user;return{user:n,authoredComments:(0,a.selectAuthoredComments)(e,n)}};t.default=(0,r.connect)(u,{})(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(333),f=r(c),p=function(e){function t(e){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return a(t,e),u(t,[{key:"render",value:function(){if(this.props.authoredComments.length>0){var e=this.props.authoredComments;return e=e.map(function(e){if(void 0!==e)return s.default.createElement(f.default,{key:e.id,comment:e})}),s.default.createElement("div",{className:"comments-container"},s.default.createElement("ul",{className:"comments-list"},e))}return s.default.createElement("div",null," ")}}]),t}(s.default.Component);t.default=p},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=n(4),c=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),a(t,[{key:"render",value:function(){var e=this.props.comment.author,t=this.props.comment;return l.default.createElement("li",{className:"comment-item"},l.default.createElement("div",{className:"author-info"},l.default.createElement(s.Link,{to:"/user/"+e.id},l.default.createElement("img",{src:e.image})),l.default.createElement("div",{className:"text-info"},l.default.createElement(s.Link,{to:"/user/"+e.id},l.default.createElement("h3",null,e.name)),l.default.createElement("p",null,t.created_at))),l.default.createElement("div",{className:"comment-body",dangerouslySetInnerHTML:{__html:t.body}}),l.default.createElement(s.Link,{to:"/story/"+t.story_id},l.default.createElement("p",{className:"link-to-story"},"In response to...")))}}]),t}(l.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(335),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(37),u=n(11),l=function(e,t){var n=t.user;return{user:n,likedStories:(0,a.selectLikedStories)(e,n)}},s=function(e){return{fetchLikedStories:function(t){return e((0,u.fetchLikedStories)(t))}}};t.default=(0,r.connect)(l,s)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(63),f=r(c),p=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={stories:n.props.likedStories},n}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchLikedStories(this.props.user.id)}},{key:"componentWillReceiveProps",value:function(e){var t=e.likedStories;this.props.likedStories[0]!==t[0]&&(this.state={stories:t})}},{key:"render",value:function(){if(this.state.stories.length>0&&void 0!==this.state.stories[0]){var e=this.state.stories;return console.log(e),e=e.map(function(e){if(void 0!==e)return s.default.createElement(f.default,{key:e.id,story:e})}),console.log(e),s.default.createElement("ul",{className:"story-index"},e)}return s.default.createElement("div",null)}}]),t}(s.default.Component);t.default=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(337),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(11),u=n(37),l=n(9),s=function(e){return{stories:e.stories,currentUser:e.session.currentUser,storiesList:(0,u.getFollowingStoriesFirst)(e,e.session.currentUser)}},c=function(e){return{fetchStories:function(){return e((0,a.fetchStories)())},fetchUser:function(t){return e((0,l.fetchUser)(t))}}};t.default=(0,r.connect)(s,c)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(63),f=r(c),p=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchStories()}},{key:"render",value:function(){var e=void 0;e=this.props.currentUser&&this.props.storiesList.length?this.props.storiesList:Object.values(this.props.stories);var t=[],n=[];return e.forEach(function(e,r){r<3?t.push(s.default.createElement(f.default,{key:e.id,story:e,feature:"feature"})):n.push(s.default.createElement(f.default,{key:e.id,story:e,feature:""}))}),s.default.createElement("main",null,s.default.createElement("ul",{className:"story-index features"},t),s.default.createElement("ul",{className:"story-index"},n))}}]),t}(s.default.Component);t.default=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(112),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(11),u=n(9),l=n(6),s=function(e,t){return{storyId:t.match.params.storyId,story:e.stories[t.match.params.storyId],currentUser:e.session.currentUser,user:e.users}},c=function(e){return{fetchStory:function(t){return e((0,a.fetchStory)(t))},createLike:function(t){return e((0,u.createLike)(t))},deleteLike:function(t){return e((0,u.deleteLike)(t))},openModal:function(t){return e((0,l.openModal)(t))},closeModal:function(){return e((0,l.closeModal)())}}};t.default=(0,r.connect)(s,c)(i.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ProtectedRoute=void 0;var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),i=n(1),a=n(4),u=function(e){var t=e.component,n=e.path,r=e.loggedIn,i=e.exact;return o.default.createElement(a.Route,{path:n,exact:i,render:function(e){return r?o.default.createElement(t,e):o.default.createElement(a.Redirect,{to:"/"})}})},l=function(e){return{loggedIn:Boolean(e.session.currentUser)}};t.ProtectedRoute=(0,a.withRouter)((0,i.connect)(l)(u))},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(1),s=n(98),c=r(s),f=n(11),p=n(0),d=r(p),h=function(e,t){return{errors:e.errors.form,story:e.stories[t.match.params.storyId],authorId:Object.keys(e.session.currentUser)[0]}},y=function(e){return{fetchStory:function(t){return e((0,f.fetchStory)(t))},action:function(t){return e((0,f.updateStory)(t))},clearErrors:function(){return e((0,f.receiveErrors)([]))}}},v=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchStory(this.props.match.params.storyId)}},{key:"render",value:function(){return this.props.story?d.default.createElement(c.default,{action:this.props.action,errors:this.props.errors,story:this.props.story,authorId:this.props.authorId}):d.default.createElement("div",null,"Loading...")}}]),t}(d.default.Component);t.default=(0,l.connect)(h,y)(v)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(342),i=function(e){return e&&e.__esModule?e:{default:e}}(o),a=n(9),u=function(e,t){return{userId:t.match.params.userId,user:e.session.currentUser,errors:e.errors.form||[]}},l=function(e){return{clearErrors:function(){return e((0,a.receiveErrors)([]))},updateUser:function(t){return e((0,a.updateUser)(t))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),r=Object.values(n.props.user)[0],a=r.bio||"";return n.state={id:r.id,username:r.username,bio:a,image_url:r.image_url,imageUrl:r.image_url,imageFile:null},n.update=n.update.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n.fileAdd=n.fileAdd.bind(n),n}return a(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){var t=this;return function(n){return t.setState(r({},e,n.target.value))}}},{key:"fileAdd",value:function(e){var t=this,n=new FileReader,r=e.currentTarget.files[0];n.onloadend=function(){return t.setState({imageUrl:n.result,imageFile:r})},r?n.readAsDataURL(r):this.setState({imageUrl:"",imageFile:imageFile})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=new FormData;n.append("user[username]",this.state.username),n.append("user[bio]",this.state.bio),n.append("user[id]",this.state.id),this.state.imageFile&&n.append("user[image]",this.state.imageFile),this.props.updateUser(n).then(function(e){return t.props.history.push("/user/"+Object.keys(e.user)[0])})}},{key:"render",value:function(){var e=this.props.errors.map(function(e,t){return s.default.createElement("li",{key:t},e)});return this.props.user&&Object.keys(this.props.user)[0]===this.props.userId?s.default.createElement("form",{className:"user-edit-form"},s.default.createElement("input",{className:"username",type:"text",onChange:this.update("username"),placeholder:"username",value:this.state.username}),s.default.createElement("br",null),s.default.createElement("input",{className:"bio",type:"text",onChange:this.update("bio"),placeholder:"Write a little about yourself...",value:this.state.bio}),s.default.createElement("br",null),s.default.createElement("label",{className:"user-image"},"Profile Picture...",s.default.createElement("input",{className:"image-input",type:"file",onChange:this.fileAdd}),s.default.createElement("img",{className:"user-profile-img",src:this.state.imageUrl})),s.default.createElement("br",null),s.default.createElement("ul",{className:"error-message"},e),s.default.createElement("button",{className:"input-publish",onClick:this.handleSubmit},"Update Profile")):(this.props.history.push("/"),s.default.createElement("div",null))}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(11),i=n(344),a=function(e){return e&&e.__esModule?e:{default:e}}(i),u=(n(4),function(e,t){return{searchParams:t.match.params.searchParams,errors:e.errors.form}}),l=function(e){return{clearErrors:function(){return e((0,o.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(a.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(345),f=r(c),p=n(347),d=r(p),h=n(350),y=(r(h),function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={search:n.props.searchParams,selected:"Stories",searchParams:n.props.searchParams},n.selectTab=n.selectTab.bind(n),n.update=n.update.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n}return a(t,e),u(t,[{key:"selectTab",value:function(e){var t=this;return function(n){return t.setState({selected:e})}}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){return this.setState({search:e.target.value})}},{key:"handleSubmit",value:function(e){var t=this.state.search;this.setState({searchParams:t}),this.props.history.push("/search/"+this.state.search)}},{key:"render",value:function(){var e=void 0,t="tab",n="tab";return"Stories"===this.state.selected?(t+="Selected",n-="Selected",e=s.default.createElement(f.default,{searchParams:this.state.searchParams})):(n+="Selected",t-="Selected",e=s.default.createElement(d.default,{searchParams:this.state.searchParams})),s.default.createElement("main",{className:"search-container"},s.default.createElement("form",{onSubmit:this.handleSubmit,className:"search-form-container"},s.default.createElement("input",{type:"text",onChange:this.update,placeholder:"Search Betwixt",value:this.state.search})),s.default.createElement("nav",{className:"tab-header"},s.default.createElement("button",{className:t,onClick:this.selectTab("Stories")},"Stories"),s.default.createElement("button",{className:n,onClick:this.selectTab("Users")},"Users")),e)}}]),t}(s.default.Component));t.default=y},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(11),i=n(346),a=function(e){return e&&e.__esModule?e:{default:e}}(i),u=function(e,t){return{searchParams:t.searchParams,stories:e.stories,errors:e.errors.form}},l=function(e){return{searchTaggedStories:function(t){return e((0,o.searchTaggedStories)(t))},clearErrors:function(){return e((0,o.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(a.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(63),f=r(c),p=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={search:n.props.searchParams,errors:[]},n}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.searchTaggedStories(this.props.searchParams)}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"componentWillReceiveProps",value:function(e){1===e.errors.length&&this.setState({errors:e.errors}),this.props.searchParams!==e.searchParams&&(this.props.clearErrors(),this.props.searchTaggedStories(e.searchParams),this.setState({errors:[]}))}},{key:"render",value:function(){if(0===Object.keys(this.props.stories).length||1===this.state.errors.length)return s.default.createElement("h2",{id:"no-results"},"No results found");var e=Object.values(this.props.stories).map(function(e){return s.default.createElement("li",null,s.default.createElement(f.default,{key:e.id,story:e,feature:""}))});return s.default.createElement("ul",{className:"user-stories"},e)}}]),t}(s.default.Component);t.default=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),o=n(9),i=n(348),a=function(e){return e&&e.__esModule?e:{default:e}}(i),u=function(e,t){return{searchParams:t.searchParams,users:e.users,errors:e.errors.form}},l=function(e){return{searchTaggedUsers:function(t){return e((0,o.searchTaggedUsers)(t))},clearErrors:function(){return e((0,o.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(a.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(322),f=r(c),p=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={search:n.props.searchParams,errors:[]},n}return a(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.searchTaggedUsers(this.props.searchParams)}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"componentWillReceiveProps",value:function(e){1===e.errors.length&&this.setState({errors:e.errors}),this.props.searchParams!==e.searchParams&&(this.props.clearErrors(),this.props.searchTaggedUsers(e.searchParams),this.setState({errors:[]}))}},{key:"render",value:function(){if(0===Object.keys(this.props.users).length||1===this.state.errors.length)return s.default.createElement("h2",{id:"no-results"},"No results found");var e=Object.values(this.props.users).map(function(e){return s.default.createElement("li",null,s.default.createElement(f.default,{authorId:e.id}))});return s.default.createElement("ul",{className:"users"},e)}}]),t}(s.default.Component);t.default=p},,function(e,t,n){function r(e,t,n){function r(t){var n=b,r=g;return b=g=void 0,x=t,w=e.apply(r,n)}function c(e){return x=e,E=setTimeout(d,t),k?r(e):w}function f(e){var n=e-O,r=e-x,o=t-n;return S?s(o,_-r):o}function p(e){var n=e-O,r=e-x;return void 0===O||n>=t||n<0||S&&r>=_}function d(){var e=i();if(p(e))return h(e);E=setTimeout(d,f(e))}function h(e){return E=void 0,C&&b?r(e):(b=g=void 0,w)}function y(){void 0!==E&&clearTimeout(E),x=0,b=O=g=E=void 0}function v(){return void 0===E?w:h(i())}function m(){var e=i(),n=p(e);if(b=arguments,g=this,O=e,n){if(void 0===E)return c(O);if(S)return E=setTimeout(d,t),r(O)}return void 0===E&&(E=setTimeout(d,t)),w}var b,g,_,w,E,O,x=0,k=!1,S=!1,C=!0;if("function"!=typeof e)throw new TypeError(u);return t=a(t)||0,o(n)&&(k=!!n.leading,S="maxWait"in n,_=S?l(a(n.maxWait)||0,t):_,C="trailing"in n?!!n.trailing:C),m.cancel=y,m.flush=v,m}var o=n(10),i=n(351),a=n(303),u="Expected a function",l=Math.max,s=Math.min;e.exports=r},function(e,t,n){var r=n(7),o=function(){return r.Date.now()};e.exports=o}]);
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




;
