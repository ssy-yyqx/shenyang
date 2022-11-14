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
define(["exports","./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./Transforms-1f147cce"],function(n,r,a,e,i,t){"use strict";function o(n,a){this.normal=i.Cartesian3.clone(n),this.distance=a}o.fromPointNormal=function(n,a,e){n=-i.Cartesian3.dot(a,n);return r.defined(e)?(i.Cartesian3.clone(a,e.normal),e.distance=n,e):new o(a,n)};var s=new i.Cartesian3;o.fromCartesian4=function(n,a){var e=i.Cartesian3.fromCartesian4(n,s),n=n.w;return r.defined(a)?(i.Cartesian3.clone(e,a.normal),a.distance=n,a):new o(e,n)},o.getPointDistance=function(n,a){return i.Cartesian3.dot(n.normal,a)+n.distance};var c=new i.Cartesian3;o.projectPointOntoPlane=function(n,a,e){r.defined(e)||(e=new i.Cartesian3);var t=o.getPointDistance(n,a),t=i.Cartesian3.multiplyByScalar(n.normal,t,c);return i.Cartesian3.subtract(a,t,e)};var l=new i.Cartesian3;o.transform=function(n,a,e){return t.Matrix4.multiplyByPointAsVector(a,n.normal,s),i.Cartesian3.normalize(s,s),i.Cartesian3.multiplyByScalar(n.normal,-n.distance,l),t.Matrix4.multiplyByPoint(a,l,l),o.fromPointNormal(l,s,e)},o.clone=function(n,a){return r.defined(a)?(i.Cartesian3.clone(n.normal,a.normal),a.distance=n.distance,a):new o(n.normal,n.distance)},o.equals=function(n,a){return n.distance===a.distance&&i.Cartesian3.equals(n.normal,a.normal)},o.ORIGIN_XY_PLANE=r.freezeObject(new o(i.Cartesian3.UNIT_Z,0)),o.ORIGIN_YZ_PLANE=r.freezeObject(new o(i.Cartesian3.UNIT_X,0)),o.ORIGIN_ZX_PLANE=r.freezeObject(new o(i.Cartesian3.UNIT_Y,0)),n.Plane=o});
