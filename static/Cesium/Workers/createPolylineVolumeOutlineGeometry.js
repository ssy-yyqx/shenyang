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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./Transforms-1f147cce","./RuntimeError-443472b0","./WebGLConstants-2ddfa2f9","./ComponentDatatype-adb4702b","./GeometryAttribute-ebf6a4c7","./GeometryAttributes-614c63f8","./IndexDatatype-a78bfe07","./IntersectionTests-9618f995","./Plane-6d029ea4","./arrayRemoveDuplicates-0e267e0f","./BoundingRectangle-4654555a","./EllipsoidTangentPlane-6e29c6f6","./EllipsoidRhumbLine-aeb03c9a","./PolygonPipeline-d378df2d","./PolylineVolumeGeometryLibrary-85267466","./EllipsoidGeodesic-f0d5153e","./PolylinePipeline-1211a424"],function(d,e,t,c,i,u,n,a,y,h,f,g,r,o,l,s,p,m,E,v,P,_){"use strict";function k(e){var i=(e=d.defaultValue(e,d.defaultValue.EMPTY_OBJECT)).polylinePositions,n=e.shapePositions;this._positions=i,this._shape=n,this._ellipsoid=c.Ellipsoid.clone(d.defaultValue(e.ellipsoid,c.Ellipsoid.WGS84)),this._cornerType=d.defaultValue(e.cornerType,v.CornerType.ROUNDED),this._granularity=d.defaultValue(e.granularity,t.CesiumMath.RADIANS_PER_DEGREE),this._workerName="createPolylineVolumeOutlineGeometry";i=1+i.length*c.Cartesian3.packedLength;i+=1+n.length*c.Cartesian2.packedLength,this.packedLength=i+c.Ellipsoid.packedLength+2}k.pack=function(e,i,n){var t;n=d.defaultValue(n,0);var a=e._positions,r=a.length;for(i[n++]=r,t=0;t<r;++t,n+=c.Cartesian3.packedLength)c.Cartesian3.pack(a[t],i,n);var o=e._shape,r=o.length;for(i[n++]=r,t=0;t<r;++t,n+=c.Cartesian2.packedLength)c.Cartesian2.pack(o[t],i,n);return c.Ellipsoid.pack(e._ellipsoid,i,n),n+=c.Ellipsoid.packedLength,i[n++]=e._cornerType,i[n]=e._granularity,i};var C=c.Ellipsoid.clone(c.Ellipsoid.UNIT_SPHERE),b={polylinePositions:void 0,shapePositions:void 0,ellipsoid:C,height:void 0,cornerType:void 0,granularity:void 0};k.unpack=function(e,i,n){i=d.defaultValue(i,0);for(var t=e[i++],a=new Array(t),r=0;r<t;++r,i+=c.Cartesian3.packedLength)a[r]=c.Cartesian3.unpack(e,i);var t=e[i++],o=new Array(t);for(r=0;r<t;++r,i+=c.Cartesian2.packedLength)o[r]=c.Cartesian2.unpack(e,i);var l=c.Ellipsoid.unpack(e,i,C);i+=c.Ellipsoid.packedLength;var s=e[i++],p=e[i];return d.defined(n)?(n._positions=a,n._shape=o,n._ellipsoid=c.Ellipsoid.clone(l,n._ellipsoid),n._cornerType=s,n._granularity=p,n):(b.polylinePositions=a,b.shapePositions=o,b.cornerType=s,b.granularity=p,new k(b))};var L=new s.BoundingRectangle;return k.createGeometry=function(e){var i=e._positions,n=l.arrayRemoveDuplicates(i,c.Cartesian3.equalsEpsilon),t=e._shape,t=v.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(t);if(!(n.length<2||t.length<3)){E.PolygonPipeline.computeWindingOrder2D(t)===E.WindingOrder.CLOCKWISE&&t.reverse();i=s.BoundingRectangle.fromPoints(t,L);return function(e,i){var n=new f.GeometryAttributes;n.position=new h.GeometryAttribute({componentDatatype:y.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e});var t=i.length,i=n.position.values.length/3,a=e.length/3/t,r=g.IndexDatatype.createTypedArray(i,2*t*(1+a)),o=0,l=0,s=l*t;for(c=0;c<t-1;c++)r[o++]=c+s,r[o++]=c+s+1;for(r[o++]=t-1+s,r[o++]=s,s=(l=a-1)*t,c=0;c<t-1;c++)r[o++]=c+s,r[o++]=c+s+1;for(r[o++]=t-1+s,r[o++]=s,l=0;l<a-1;l++)for(var p=t*l,d=p+t,c=0;c<t;c++)r[o++]=c+p,r[o++]=c+d;return new h.Geometry({attributes:n,indices:g.IndexDatatype.createTypedArray(i,r),boundingSphere:u.BoundingSphere.fromVertices(e),primitiveType:h.PrimitiveType.LINES})}(v.PolylineVolumeGeometryLibrary.computePositions(n,t,i,e,!1),t)}},function(e,i){return(e=d.defined(i)?k.unpack(e,i):e)._ellipsoid=c.Ellipsoid.clone(e._ellipsoid),k.createGeometry(e)}});
