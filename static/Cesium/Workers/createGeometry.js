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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./Transforms-1f147cce","./RuntimeError-443472b0","./WebGLConstants-2ddfa2f9","./ComponentDatatype-adb4702b","./GeometryAttribute-ebf6a4c7","./GeometryAttributes-614c63f8","./AttributeCompression-424ccc06","./GeometryPipeline-27b4178f","./EncodedCartesian3-17533efe","./IndexDatatype-a78bfe07","./IntersectionTests-9618f995","./Plane-6d029ea4","./PrimitivePipeline-448cc37d","./WebMercatorProjection-3d1fffe8","./createTaskProcessorWorker"],function(s,e,r,t,n,a,i,o,c,f,u,d,b,m,p,l,y,P,k,C){"use strict";var v={};return C(function(e,r){for(var t=e.subTasks,n=t.length,a=new Array(n),i=0;i<n;i++){var o=t[i],c=o.geometry,f=o.moduleName;s.defined(f)?(f=function(e){var r=v[e];return s.defined(r)||("object"==typeof exports?v[r]=r=require("Workers/"+e):require(["Workers/"+e],function(e){v[r=e]=e})),r}(f),a[i]=f(c,o.offset)):a[i]=c}return s.when.all(a,function(e){return P.PrimitivePipeline.packCreateGeometryResults(e,r)})})});
