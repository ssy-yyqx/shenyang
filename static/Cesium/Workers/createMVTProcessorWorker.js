/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
function onMessage(r){r=r.data;this.tileProcessor.process(r)}"function"==typeof importScripts&&(importScripts("../ThirdParty/MVT/Point.js"),importScripts("../ThirdParty/MVT/Pbf.js"),importScripts("../ThirdParty/MVT/MVTData.js"),importScripts("../ThirdParty/MVT/MVTFeature.js"),importScripts("../ThirdParty/MVT/MVTLayer.js"),importScripts("../ThirdParty/MVT/MVTRequest.js"),importScripts("../ThirdParty/MVT/MVTColor.js"),importScripts("../ThirdParty/MVT/MVTFilter.js"),importScripts("../ThirdParty/MVT/MVTFunction.js"),importScripts("../ThirdParty/MVT/MVTProcessor.js"),addEventListener("message",onMessage),this.tileProcessor=new MVTProcessor);