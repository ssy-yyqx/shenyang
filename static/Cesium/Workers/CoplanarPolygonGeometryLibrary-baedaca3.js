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
define(["exports","./Check-430b3551","./Cartesian2-0cd32dae","./Transforms-1f147cce","./OrientedBoundingBox-963ed09f"],function(n,e,g,f,l){"use strict";var t={},i=new g.Cartesian3,x=new g.Cartesian3,B=new g.Cartesian3,P=new g.Cartesian3,M=new l.OrientedBoundingBox;function o(n,e,t,r,a){e=g.Cartesian3.subtract(n,e,i),t=g.Cartesian3.dot(t,e),e=g.Cartesian3.dot(r,e);return g.Cartesian2.fromElements(t,e,a)}t.validOutline=function(n){var e=l.OrientedBoundingBox.fromPoints(n,M).halfAxes,t=f.Matrix3.getColumn(e,0,x),n=f.Matrix3.getColumn(e,1,B),e=f.Matrix3.getColumn(e,2,P),t=g.Cartesian3.magnitude(t),n=g.Cartesian3.magnitude(n),e=g.Cartesian3.magnitude(e);return!(0===t&&(0===n||0===e)||0===n&&0===e)},t.computeProjectTo2DArguments=function(n,e,t,r){var a,i,o=l.OrientedBoundingBox.fromPoints(n,M),u=o.halfAxes,s=f.Matrix3.getColumn(u,0,x),C=f.Matrix3.getColumn(u,1,B),c=f.Matrix3.getColumn(u,2,P),m=g.Cartesian3.magnitude(s),d=g.Cartesian3.magnitude(C),n=g.Cartesian3.magnitude(c),u=Math.min(m,d,n);return(0!==m||0!==d&&0!==n)&&(0!==d||0!==n)&&(u!==d&&u!==n||(a=s),u===m?a=C:u===n&&(i=C),u!==m&&u!==d||(i=c),g.Cartesian3.normalize(a,t),g.Cartesian3.normalize(i,r),g.Cartesian3.clone(o.center,e),!0)},t.createProjectPointsTo2DFunction=function(r,a,i){return function(n){for(var e=new Array(n.length),t=0;t<n.length;t++)e[t]=o(n[t],r,a,i);return e}},t.createProjectPointTo2DFunction=function(t,r,a){return function(n,e){return o(n,t,r,a,e)}},n.CoplanarPolygonGeometryLibrary=t});
