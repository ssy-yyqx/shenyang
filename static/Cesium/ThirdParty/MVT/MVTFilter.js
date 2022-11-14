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
function MVTFilter(){}MVTFilter.prototype={filterExpression:function(e,r){return!this.isValidFilter(e)||(this.isComplexFilter(e)?this.filterComplexExpression(e,r):this.filterSimpleExpression(e,r))},filterComplexExpression:function(e,r){var i=e[0];if("all"==i){for(var t=1;t<e.length;t++)if(!this.filterSimpleExpression(e[t],r))return!1;return!0}if("any"==i){for(t=1;t<e.length;t++)if(this.filterSimpleExpression(e[t],r))return!0;return 1==e.length?!0:!1}if("none"!=i)return!1;for(t=1;t<e.length;t++)if(this.filterSimpleExpression(e[t],r))return!1;return e.length,!0},filterSimpleExpression:function(e,r){if(!this.isValidFilter(e))return!1;var i=e[0];{if("=="==i)return"$type"==e[1]?MVTFeature.types[r.type]==e[2]:"$id"==e[1]?r.id==e[2]:(t=r.properties[e[1]])==e[2];if("!="==i)return"$type"==e[1]?MVTFeature.types[r.type]!=e[2]:"$id"==e[1]?r.id!=e[2]:(t=r.properties[e[1]])!=e[2];else{if(">"==i)return(t=r.properties[e[1]])>e[2];if(">="==i)return(t=r.properties[e[1]])>=e[2];if("<"==i)return(t=r.properties[e[1]])<e[2];if("<="==i)return(t=r.properties[e[1]])<=e[2];if("has"==i)return null!=(t=r.properties[e[1]]);if("!has"==i)return null==(t=r.properties[e[1]]);if("in"==i){for(var t=r.properties[e[1]],n=2;n<e.length;n++)if(t==e[n])return!0;return!1}if("!in"==i){for(t=r.properties[e[1]],n=2;n<e.length;n++)if(t==e[n])return!1;return!0}if("all"==i||"any"==i||"none"==i)return this.filterComplexExpression(e,r);if(""==i||null==i)return!0}}return!1},isValidFilter:function(e){return null!=e&&0!==e.length},isComplexFilter:function(e){switch(e[0]){case"has":case"in":case"!in":case"!has":case"==":case"!=":case">":case">=":case"<":case"<=":return!1;case"any":case"all":case"none":return!0;default:return!1}}};