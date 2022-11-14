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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./Transforms-1f147cce","./RuntimeError-443472b0","./WebGLConstants-2ddfa2f9","./ComponentDatatype-adb4702b","./GeometryAttribute-ebf6a4c7","./GeometryAttributes-614c63f8","./Plane-6d029ea4","./VertexFormat-95f25802","./FrustumGeometry-86831799"],function(o,e,t,s,r,m,n,a,f,h,d,i,u,g){"use strict";var c=0,p=1;function _(e){var t,r,n=e.frustum,a=e.orientation,i=e.origin,e=o.defaultValue(e._drawNearPlane,!0);n instanceof g.PerspectiveFrustum?(t=c,r=g.PerspectiveFrustum.packedLength):n instanceof g.OrthographicFrustum&&(t=p,r=g.OrthographicFrustum.packedLength),this._frustumType=t,this._frustum=n.clone(),this._origin=s.Cartesian3.clone(i),this._orientation=m.Quaternion.clone(a),this._drawNearPlane=e,this._workerName="createFrustumOutlineGeometry",this.packedLength=2+r+s.Cartesian3.packedLength+m.Quaternion.packedLength}_.pack=function(e,t,r){r=o.defaultValue(r,0);var n=e._frustumType,a=e._frustum;return(t[r++]=n)===c?(g.PerspectiveFrustum.pack(a,t,r),r+=g.PerspectiveFrustum.packedLength):(g.OrthographicFrustum.pack(a,t,r),r+=g.OrthographicFrustum.packedLength),s.Cartesian3.pack(e._origin,t,r),r+=s.Cartesian3.packedLength,m.Quaternion.pack(e._orientation,t,r),t[r+=m.Quaternion.packedLength]=e._drawNearPlane?1:0,t};var k=new g.PerspectiveFrustum,l=new g.OrthographicFrustum,y=new m.Quaternion,v=new s.Cartesian3;return _.unpack=function(e,t,r){t=o.defaultValue(t,0);var n,a=e[t++];a===c?(n=g.PerspectiveFrustum.unpack(e,t,k),t+=g.PerspectiveFrustum.packedLength):(n=g.OrthographicFrustum.unpack(e,t,l),t+=g.OrthographicFrustum.packedLength);var i=s.Cartesian3.unpack(e,t,v);t+=s.Cartesian3.packedLength;var u=m.Quaternion.unpack(e,t,y),e=1===e[t+=m.Quaternion.packedLength];if(!o.defined(r))return new _({frustum:n,origin:i,orientation:u,_drawNearPlane:e});t=a===r._frustumType?r._frustum:void 0;return r._frustum=n.clone(t),r._frustumType=a,r._origin=s.Cartesian3.clone(i,r._origin),r._orientation=m.Quaternion.clone(u,r._orientation),r._drawNearPlane=e,r},_.createGeometry=function(e){var t=e._frustumType,r=e._frustum,n=e._origin,a=e._orientation,i=e._drawNearPlane,e=new Float64Array(24);g.FrustumGeometry._computeNearFarPlanes(n,a,t,r,e);for(var u,o,r=new d.GeometryAttributes({position:new h.GeometryAttribute({componentDatatype:f.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e})}),s=i?2:1,c=new Uint16Array(8*(1+s)),p=i?0:1;p<2;++p)o=4*p,c[u=i?8*p:0]=o,c[u+1]=o+1,c[u+2]=o+1,c[u+3]=o+2,c[u+4]=o+2,c[u+5]=o+3,c[u+6]=o+3,c[u+7]=o;for(p=0;p<2;++p)o=4*p,c[u=8*(s+p)]=o,c[u+1]=o+4,c[u+2]=o+1,c[u+3]=o+5,c[u+4]=o+2,c[u+5]=o+6,c[u+6]=o+3,c[u+7]=o+7;return new h.Geometry({attributes:r,indices:c,primitiveType:h.PrimitiveType.LINES,boundingSphere:m.BoundingSphere.fromVertices(e)})},function(e,t){return o.defined(t)&&(e=_.unpack(e,t)),_.createGeometry(e)}});
