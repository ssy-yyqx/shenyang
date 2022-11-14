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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./Transforms-1f147cce","./RuntimeError-443472b0","./WebGLConstants-2ddfa2f9","./ComponentDatatype-adb4702b","./GeometryAttribute-ebf6a4c7","./GeometryAttributes-614c63f8","./AttributeCompression-424ccc06","./GeometryPipeline-27b4178f","./EncodedCartesian3-17533efe","./IndexDatatype-a78bfe07","./IntersectionTests-9618f995","./Plane-6d029ea4","./GeometryInstance-50734731","./arrayRemoveDuplicates-0e267e0f","./EllipsoidTangentPlane-6e29c6f6","./OrientedBoundingBox-963ed09f","./CoplanarPolygonGeometryLibrary-baedaca3","./ArcType-51c149e1","./EllipsoidRhumbLine-aeb03c9a","./PolygonPipeline-d378df2d","./PolygonGeometryLibrary-189cbefa"],function(o,e,t,i,r,y,n,a,l,p,s,c,u,d,m,f,g,b,h,P,G,v,L,C,T,E){"use strict";function k(e){e=(e=o.defaultValue(e,o.defaultValue.EMPTY_OBJECT)).polygonHierarchy;this._polygonHierarchy=e,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=E.PolygonGeometryLibrary.computeHierarchyPackedLength(e)+1}k.fromPositions=function(e){return new k({polygonHierarchy:{positions:(e=o.defaultValue(e,o.defaultValue.EMPTY_OBJECT)).positions}})},k.pack=function(e,t,r){return r=o.defaultValue(r,0),t[r=E.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy,t,r)]=e.packedLength,t};var H={polygonHierarchy:{}};return k.unpack=function(e,t,r){t=o.defaultValue(t,0);var n=E.PolygonGeometryLibrary.unpackPolygonHierarchy(e,t);t=n.startingIndex,delete n.startingIndex;t=e[t];return(r=!o.defined(r)?new k(H):r)._polygonHierarchy=n,r.packedLength=t,r},k.createGeometry=function(e){var t=e._polygonHierarchy,e=t.positions,e=h.arrayRemoveDuplicates(e,i.Cartesian3.equalsEpsilon,!0);if(!(e.length<3)&&v.CoplanarPolygonGeometryLibrary.validOutline(e)){var r=E.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(t,!1);if(0!==r.length){for(var n=[],o=0;o<r.length;o++){var a=new b.GeometryInstance({geometry:function(e){for(var t=e.length,r=new Float64Array(3*t),n=m.IndexDatatype.createTypedArray(t,2*t),o=0,a=0,i=0;i<t;i++){var y=e[i];r[o++]=y.x,r[o++]=y.y,r[o++]=y.z,n[a++]=i,n[a++]=(i+1)%t}var c=new s.GeometryAttributes({position:new p.GeometryAttribute({componentDatatype:l.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:r})});return new p.Geometry({attributes:c,indices:n,primitiveType:p.PrimitiveType.LINES})}(r[o])});n.push(a)}e=u.GeometryPipeline.combineInstances(n)[0],t=y.BoundingSphere.fromPoints(t.positions);return new p.Geometry({attributes:e.attributes,indices:e.indices,primitiveType:e.primitiveType,boundingSphere:t})}}},function(e,t){return(e=o.defined(t)?k.unpack(e,t):e)._ellipsoid=i.Ellipsoid.clone(e._ellipsoid),k.createGeometry(e)}});
