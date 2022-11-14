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
function MVTFeature(e,t,r,a,n){this.properties={},this.extent=r,this.type=0,this._pbf=e,this._geometry=-1,this._keys=a,this._values=n,e.readFields(readFeature,this,t)}function readFeature(e,t,r){1==e?t.id=r.readVarint():2==e?readTag(r,t):3==e?t.type=r.readVarint():4==e&&(t._geometry=r.pos)}function readTag(e,t){for(var r=e.readVarint()+e.pos;e.pos<r;){var a=t._keys[e.readVarint()],n=t._values[e.readVarint()];t.properties[a]=n}}function classifyRings(e){var t=e.length;if(t<=1)return[e];for(var r,a,n=[],i=0;i<t;i++){var o=signedArea(e[i]);0!==o&&((a=void 0===a?o<0:a)===o<0?(r&&n.push(r),r=[e[i]]):r.push(e[i]))}return r&&n.push(r),n}function signedArea(e){for(var t,r,a=0,n=0,i=e.length,o=i-1;n<i;o=n++)t=e[n],a+=((r=e[o]).x-t.x)*(t.y+r.y);return a}MVTFeature.types=["Unknown","Point","LineString","Polygon"],MVTFeature.prototype.loadGeometry=function(){var e=this._pbf;e.pos=this._geometry;for(var t,r,a=e.readVarint()+e.pos,n=1,i=0,o=0,s=0,h=[];e.pos<a;)if(i||(n=7&(r=e.readVarint()),i=r>>3),i--,1===n||2===n)o+=e.readSVarint(),s+=e.readSVarint(),1===n&&(t&&h.push(t),t=[]),t.push(new Point(o,s));else{if(7!==n)throw new Error("unknown command "+n);t&&t.push(t[0].clone())}return t&&h.push(t),h},MVTFeature.prototype.bbox=function(){var e=this._pbf;e.pos=this._geometry;for(var t,r=e.readVarint()+e.pos,a=1,n=0,i=0,o=0,s=1/0,h=-1/0,p=1/0,u=-1/0;e.pos<r;)if(n||(a=7&(t=e.readVarint()),n=t>>3),n--,1===a||2===a)(i+=e.readSVarint())<s&&(s=i),h<i&&(h=i),(o+=e.readSVarint())<p&&(p=o),u<o&&(u=o);else if(7!==a)throw new Error("unknown command "+a);return[s,p,h,u]},MVTFeature.prototype.toGeoJSON=function(e,t,r){var a,n=this.extent*Math.pow(2,r),i=this.extent*e,o=this.extent*t,s=this.loadGeometry(),t=MVTFeature.types[this.type];function h(e){for(var t=0;t<e.length;t++){var r=e[t],a=180-360*(r.y+o)/n;e[t]=[360*(r.x+i)/n-180,360/Math.PI*Math.atan(Math.exp(a*Math.PI/180))-90]}}switch(this.type){case 1:for(var p=[],u=0;u<s.length;u++)p[u]=s[u][0];h(s=p);break;case 2:for(u=0;u<s.length;u++)h(s[u]);break;case 3:for(s=classifyRings(s),u=0;u<s.length;u++)for(a=0;a<s[u].length;a++)h(s[u][a])}1===s.length?s=s[0]:t="Multi"+t;t={type:"Feature",geometry:{type:t,coordinates:s},properties:this.properties};return"id"in this&&(t.id=this.id),t};