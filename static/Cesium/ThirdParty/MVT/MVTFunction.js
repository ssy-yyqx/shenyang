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
function MVTFunction(){}MVTFunction.prototype={getValue:function(t,n){if(this.isFunction(t)){var o=null,s=t.stops.length;return 1==s&&(o=t.stops[0][1]),n<=t.stops[0][0]&&(o=t.stops[0][1]),null==(o=n>=t.stops[s-1][0]?t.stops[s-1][1]:o)&&(s=this.findStopLessThanOrEqualTo(t.stops,n),"number"==typeof(o=t.stops[s][1])&&null!=t.base&&(n=this.interpolationFactor(n,t.base,t.stops[s][0],t.stops[s+1][0]),o=this.numberInterpolate(t.stops[s][1],t.stops[s+1][1],n))),o}return t},isFunction:function(t){return null!=t&&null!=t.stops},findStopLessThanOrEqualTo:function(t,n){for(var o,s,r=0,u=t.length-1,e=0;r<=u;){if(o=t[e=Math.floor((r+u)/2)][0],s=t[e+1][0],n===o||o<n&&n<s)return e;o<n?r=e+1:n<o&&(u=e-1)}return Math.max(e-1,0)},interpolationFactor:function(t,n,o,s){s-=o,o=t-o;return 0==s?0:1===n?o/s:(Math.pow(n,o)-1)/(Math.pow(n,s)-1)},numberInterpolate:function(t,n,o){return t*(1-o)+n*o}};