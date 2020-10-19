/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Element.prototype.$ = function () {
    return this.querySelector.apply(this, arguments);
};

Element.prototype.$$ = function () {
    return this.querySelectorAll.apply(this, arguments);
};

class Gesso {
    constructor() {
        this._minFetchInterval = 500;
        this._maxFetchInterval = 60 * 1000;
        this._fetchStates = new Map(); // By path
    }

    openRequest(method, url, loadHandler) {
        let request = new XMLHttpRequest();

        request.open(method, url);

        if (loadHandler != null) {
            request.addEventListener("load", loadHandler);
        }

        return request;
    }

    _getFetchState(path) {
        let state = this._fetchStates[path];

        if (state == null) {
            state = {
                currentInterval: null,
                currentTimeoutId: null,
                failedAttempts: 0,
                etag: null,
                timestamp: null
            };

            this._fetchStates[path] = state;
        }

        return state;
    }

    fetch(path, dataHandler) {
        console.log("Fetching data from", path);

        let state = this._getFetchState(path);

        let request = this.openRequest("GET", path, (event) => {
            if (event.target.status >= 200 && event.target.status < 300) {
                state.failedAttempts = 0;
                state.etag = event.target.getResponseHeader("ETag");

                dataHandler(JSON.parse(event.target.responseText));
            } else if (event.target.status == 304) {
                state.failedAttempts = 0;
            }

            state.timestamp = new Date().getTime();
        });

        request.addEventListener("error", (event) => {
            console.log("Fetch failed");
            state.failedAttempts++;
        });

        let etag = state.etag;

        if (etag) {
            request.setRequestHeader("If-None-Match", etag);
        }

        request.send();

        return state;
    }

    fetchPeriodically(path, dataHandler) {
        let state = this._getFetchState(path);

        clearTimeout(state.currentTimeoutId);
        state.currentInterval = this._minFetchInterval;

        this._doFetchPeriodically(path, dataHandler, state);

        return state;
    }

    _doFetchPeriodically(path, dataHandler, state) {
        if (state.currentInterval >= this._maxFetchInterval) {
            setInterval(() => {
                this.fetch(path, dataHandler);
            }, this._maxFetchInterval);

            return;
        }

        state.currentTimeoutId = setTimeout(() => {
            this._doFetchPeriodically(path, dataHandler, state);
        }, state.currentInterval);

        state.currentInterval = Math.min(state.currentInterval * 2, this._maxFetchInterval);

        this.fetch(path, dataHandler);
    }

    parseQueryString(str) {
        if (str.startsWith("?")) {
            str = str.slice(1);
        }

        let qvars = str.split(/[&;]/);
        let obj = {};

        for (let i = 0; i < qvars.length; i++) {
            let [name, value] = qvars[i].split("=", 2);

            name = decodeURIComponent(name);
            value = decodeURIComponent(value);

            obj[name] = value;
        }

        return obj;
    }

    emitQueryString(obj) {
        let tokens = [];

        for (let name in obj) {
            if (!obj.hasOwnProperty(name)) {
                continue;
            }

            let value = obj[name];

            name = decodeURIComponent(name);
            value = decodeURIComponent(value);

            tokens.push(name + "=" + value);
        }

        return tokens.join(";");
    }

    createElement(parent, tag, options) {
        let elem = document.createElement(tag);

        if (parent != null) {
            parent.appendChild(elem);
        }

        if (options != null) {
            if (typeof options === "string" || typeof options === "number") {
                this.createText(elem, options);
            } else if (typeof options === "object") {
                if (options.hasOwnProperty("text")) {
                    this.createText(elem, options["text"]);
                    delete options["text"];
                }

                for (let key of Object.keys(options)) {
                    elem.setAttribute(key, options[key]);
                }
            } else {
                throw `illegal argument: ${options}`;
            }
        }

        return elem;
    }

    createText(parent, text) {
        let node = document.createTextNode(text);

        if (parent != null) {
            parent.appendChild(node);
        }

        return node;
    }

    _setSelector(elem, selector) {
        if (selector == null) {
            return;
        }

        if (selector.startsWith("#")) {
            elem.setAttribute("id", selector.slice(1));
        } else {
            elem.setAttribute("class", selector);
        }
    }

    createDiv(parent, selector, options) {
        let elem = this.createElement(parent, "div", options);

        this._setSelector(elem, selector);

        return elem;
    }

    createSpan(parent, selector, options) {
        let elem = this.createElement(parent, "span", options);

        this._setSelector(elem, selector);

        return elem;
    }

    createLink(parent, href, options) {
        let elem = this.createElement(parent, "a", options);

        if (href != null) {
            elem.setAttribute("href", href);
        }

        return elem;
    }

    createTable(parent, headings, rows, options) {
        let elem = this.createElement(parent, "table", options);
        let thead = this.createElement(elem, "thead");
        let tbody = this.createElement(elem, "tbody");

        if (headings) {
            let tr = this.createElement(thead, "tr");

            for (let heading of headings) {
                this.createElement(tr, "th", heading);
            }
        }

        for (let row of rows) {
            let tr = this.createElement(tbody, "tr");

            for (let cell of row) {
                this.createElement(tr, "td", cell);
            }
        }

        return elem;
    }

    replaceElement(oldElement, newElement) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }

    formatDuration(milliseconds) {
        if (milliseconds == null) {
            return "-";
        }

        let seconds = Math.round(milliseconds / 1000);
        let minutes = Math.round(milliseconds / 60 / 1000);
        let hours = Math.round(milliseconds / 3600 / 1000);
        let days = Math.round(milliseconds / 86400 / 1000);
        let weeks = Math.round(milliseconds / 432000 / 1000);

        if (weeks >= 2) {
            return `${weeks} weeks`;
        }

        if (days >= 2) {
            return `${days} days`;
        }

        if (hours >= 1) {
            return `${hours} hours`;
        }

        if (minutes >= 1) {
            return `${minutes} minutes`;
        }

        if (seconds === 1) {
            return "1 second";
        }

        return `${seconds} seconds`;
    }
}