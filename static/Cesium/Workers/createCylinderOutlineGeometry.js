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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./Transforms-1f147cce","./RuntimeError-443472b0","./WebGLConstants-2ddfa2f9","./ComponentDatatype-adb4702b","./GeometryAttribute-ebf6a4c7","./GeometryAttributes-614c63f8","./IndexDatatype-a78bfe07","./GeometryOffsetAttribute-daefb9ce","./CylinderGeometryLibrary-e40ba316"],function(m,e,t,p,i,y,a,r,_,h,A,v,R,G){"use strict";var O=new p.Cartesian2;function s(e){var t=(e=m.defaultValue(e,m.defaultValue.EMPTY_OBJECT)).length,i=e.topRadius,a=e.bottomRadius,r=m.defaultValue(e.slices,128),n=Math.max(m.defaultValue(e.numberOfVerticalLines,16),0);this._length=t,this._topRadius=i,this._bottomRadius=a,this._slices=r,this._numberOfVerticalLines=n,this._offsetAttribute=e.offsetAttribute,this._workerName="createCylinderOutlineGeometry"}s.packedLength=6,s.pack=function(e,t,i){return i=m.defaultValue(i,0),t[i++]=e._length,t[i++]=e._topRadius,t[i++]=e._bottomRadius,t[i++]=e._slices,t[i++]=e._numberOfVerticalLines,t[i]=m.defaultValue(e._offsetAttribute,-1),t};var f={length:void 0,topRadius:void 0,bottomRadius:void 0,slices:void 0,numberOfVerticalLines:void 0,offsetAttribute:void 0};return s.unpack=function(e,t,i){t=m.defaultValue(t,0);var a=e[t++],r=e[t++],n=e[t++],o=e[t++],u=e[t++],t=e[t];return m.defined(i)?(i._length=a,i._topRadius=r,i._bottomRadius=n,i._slices=o,i._numberOfVerticalLines=u,i._offsetAttribute=-1===t?void 0:t,i):(f.length=a,f.topRadius=r,f.bottomRadius=n,f.slices=o,f.numberOfVerticalLines=u,f.offsetAttribute=-1===t?void 0:t,new s(f))},s.createGeometry=function(e){var t=e._length,i=e._topRadius,a=e._bottomRadius,r=e._slices,n=e._numberOfVerticalLines;if(!(t<=0||i<0||a<0||0===i&&0===a)){var o,u,s=2*r,f=G.CylinderGeometryLibrary.computePositions(t,i,a,r,!1),d=2*r;0<n&&(o=Math.min(n,r),u=Math.round(r/o),d+=o);for(var b=v.IndexDatatype.createTypedArray(s,2*d),l=0,c=0;c<r-1;c++)b[l++]=c,b[l++]=c+1,b[l++]=c+r,b[l++]=c+1+r;if(b[l++]=r-1,b[l++]=0,b[l++]=r+r-1,b[l++]=r,0<n)for(c=0;c<r;c+=u)b[l++]=c,b[l++]=c+r;n=new A.GeometryAttributes;n.position=new h.GeometryAttribute({componentDatatype:_.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:f}),O.x=.5*t,O.y=Math.max(a,i);i=new y.BoundingSphere(p.Cartesian3.ZERO,p.Cartesian2.magnitude(O));return m.defined(e._offsetAttribute)&&(t=f.length,f=new Uint8Array(t/3),t=e._offsetAttribute===R.GeometryOffsetAttribute.NONE?0:1,R.arrayFill(f,t),n.applyOffset=new h.GeometryAttribute({componentDatatype:_.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:f})),new h.Geometry({attributes:n,indices:b,primitiveType:h.PrimitiveType.LINES,boundingSphere:i,offsetAttribute:e._offsetAttribute})}},function(e,t){return m.defined(t)&&(e=s.unpack(e,t)),s.createGeometry(e)}});
