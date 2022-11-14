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
function MVTRequest(){}MVTRequest.prototype={getTileData:function(e,t){if(""==e)return"";var n="",l=new XMLHttpRequest;return l.timeout=0,l.withCredentials=!1,l.responseType=t,l.onload=function(){200==this.status&&(n=this.response)},l.open("GET",e,!1),l.send(null),n},getSourceURL:function(e,t,n){if(e in t){e=t[e];if(null!=e)if(null!=e.tiles){for(var l=e.tiles,u=0;u<l.length;u++)if(null!=(i=l[u])&&""!=i)return null!=n.token&&""!=n.token&&(i+="?"+n.token),this.getRequestURL(i,n.z,n.y,n.x)}else if(null!=e.url){if(0<=e.url.indexOf("{z}/{x}/{y}")){var i=e.url;return this.getRequestURL(i,n.z,n.y,n.x)}e=this.getTileData(e.url,"");if(""!=e){e=JSON.parse(e);if(null!=e.tiles)for(l=e.tiles,u=0;u<l.length;u++)if(null!=(i=l[u])&&""!=i)return null!=n.token&&""!=n.token&&(i+="?"+n.token),this.getRequestURL(i,n.z,n.y,n.x)}}}return""},getRequestURL:function(e,t,n,l){return e=(e=(e=e.replace(/{z}/,t)).replace(/{y}/,n)).replace(/{x}/,l)}};