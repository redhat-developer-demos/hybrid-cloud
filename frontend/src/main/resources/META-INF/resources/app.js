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

const gesso = new Gesso();

class Application {
    constructor() {
        this.data = null;

        window.addEventListener("statechange", (event) => {
            this.renderResponses();
            this.renderWorkers();
        });

        window.addEventListener("load", (event) => {
            this.fetchDataPeriodically();

            $("#requests").addEventListener("submit", (event) => {
                this.sendRequest(event.target);
                this.fetchDataPeriodically();
            });
        });
    }

    fetchDataPeriodically() {
        gesso.fetchPeriodically("/api/data", (data) => {
            this.data = data;
            window.dispatchEvent(new Event("statechange"));
        });
    }

    sendRequest(form) {
        console.log("Sending request");

        let request = gesso.openRequest("POST", "/api/send-request", (event) => {
            if (event.target.status >= 200 && event.target.status < 300) {
                this.fetchDataPeriodically();
            }
        });

        let data = {
            text: form.text.value,
            uppercase: form.uppercase.checked,
            reverse: form.reverse.checked,
        };

        let json = JSON.stringify(data);

        request.setRequestHeader("Content-Type", "application/json");
        request.send(json);

        form.text.value = "";
    }

    renderResponses() {
        if (this.data.requestIds.length === 0) {
            return;
        }

        console.log("Rendering responses");

        let div = gesso.createDiv(null, "#responses");

        // let headings = ["Worker", "Cloud", "Response"];
        // let rows = [];

        for (let requestId of this.data.requestIds.reverse()) {
            let response = this.data.responses[requestId];

            if (response == null) {
                continue;
            }

            let item = gesso.createDiv(div, "response");
            gesso.createDiv(item, "worker", response.workerId);
            gesso.createDiv(item, "cloud", response.cloudId);
            gesso.createDiv(item, "text", response.text);

            // rows.push([response.workerId, response.cloudId, response.text]);
        }
        // let table = gesso.createTable(null, headings, rows, {id: "responses"});
        // gesso.replaceElement($("#responses"), table);

        gesso.replaceElement($("#responses"), div);

    }

    renderWorkers() {
        console.log("Rendering workers");

        if (Object.keys(this.data.workers).length === 0) {
            let div = gesso.createDiv(null, "#workers");
            let span = gesso.createSpan(div, "placeholder", "None");

            gesso.replaceElement($("#workers"), div);

            return;
        }

        let headings = ["ID", "Cloud", "Requests", "Errors"];
        // let headings = ["ID", "Cloud", "Updated", "Requests", "Errors"];
        let rows = [];
        let now = new Date().getTime();

        for (let workerId in this.data.workers) {
            let update = this.data.workers[workerId];
            let cloud = update.cloud;
            // let time = new Date(update.timestamp).toLocaleDateString();
            let requestsProcessed = update.requestsProcessed;
            let processingErrors = update.processingErrors;

            // rows.push([workerId, cloud, time, requestsProcessed, processingErrors]);
            rows.push([workerId, cloud, requestsProcessed, processingErrors]);
        }

        let table = gesso.createTable(null, headings, rows, { id: "workers" });

        gesso.replaceElement($("#workers"), table);
    }

}