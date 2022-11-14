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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./WebGLConstants-2ddfa2f9","./AttributeCompression-424ccc06","./IndexDatatype-a78bfe07","./createTaskProcessorWorker"],function(a,e,M,L,r,n,S,_,t){"use strict";var G=32767,W=new L.Cartographic,B=new L.Cartesian3;var z=new L.Rectangle,H=new L.Ellipsoid,O=new L.Cartesian3,Y={min:void 0,max:void 0};var Z=new L.Cartesian3,j=new L.Cartesian3,q=new L.Cartesian3,J=new L.Cartesian3,K=new L.Cartesian3;return t(function(a,e){var r=new Uint16Array(a.positions),n=new Uint16Array(a.widths),t=new Uint32Array(a.counts),i=new Uint16Array(a.batchIds);!function(a){a=new Float64Array(a);var e=0;Y.min=a[e++],Y.max=a[e++],L.Rectangle.unpack(a,2,z),e+=L.Rectangle.packedLength,L.Ellipsoid.unpack(a,e,H),e+=L.Ellipsoid.packedLength,L.Cartesian3.unpack(a,e,O)}(a.packedBuffer);for(var s=O,c=function(a,e,r,n,t){var i=a.length/3,s=a.subarray(0,i),c=a.subarray(i,2*i),u=a.subarray(2*i,3*i);S.AttributeCompression.zigZagDeltaDecode(s,c,u);for(var o=new Float32Array(a.length),f=0;f<i;++f){var p=s[f],C=c[f],d=u[f],p=M.CesiumMath.lerp(e.west,e.east,p/G),C=M.CesiumMath.lerp(e.south,e.north,C/G),d=M.CesiumMath.lerp(r,n,d/G),d=L.Cartographic.fromRadians(p,C,d,W),d=t.cartographicToCartesian(d,B);L.Cartesian3.pack(d,o,3*f)}return o}(r,z,Y.min,Y.max,H),r=4*(a=c.length/3)-4,u=new Float32Array(3*r),o=new Float32Array(3*r),f=new Float32Array(3*r),p=new Float32Array(2*r),C=new Uint16Array(r),d=0,b=0,w=0,h=0,l=t.length,y=0;y<l;++y){for(var k,v=t[y],A=n[y],g=i[y],m=0;m<v;++m){0===m?(E=L.Cartesian3.unpack(c,3*h,Z),x=L.Cartesian3.unpack(c,3*(h+1),j),k=L.Cartesian3.subtract(E,x,q),L.Cartesian3.add(E,k,k)):k=L.Cartesian3.unpack(c,3*(h+m-1),q);var x,E,D,I=L.Cartesian3.unpack(c,3*(h+m),J);m===v-1?(x=L.Cartesian3.unpack(c,3*(h+v-1),Z),E=L.Cartesian3.unpack(c,3*(h+v-2),j),D=L.Cartesian3.subtract(x,E,K),L.Cartesian3.add(x,D,D)):D=L.Cartesian3.unpack(c,3*(h+m+1),K),L.Cartesian3.subtract(k,s,k),L.Cartesian3.subtract(I,s,I),L.Cartesian3.subtract(D,s,D);for(var T=m===v-1?2:4,U=0===m?2:0;U<T;++U){L.Cartesian3.pack(I,u,d),L.Cartesian3.pack(k,o,d),L.Cartesian3.pack(D,f,d),d+=3;var F=U-2<0?-1:1;p[b++]=U%2*2-1,p[b++]=F*A,C[w++]=g}}h+=v}var N=_.IndexDatatype.createTypedArray(r,6*a-6),P=0,R=0,l=a-1;for(y=0;y<l;++y)N[R++]=P,N[R++]=P+2,N[R++]=P+1,N[R++]=P+1,N[R++]=P+2,N[R++]=P+3,P+=4;return e.push(u.buffer,o.buffer,f.buffer),e.push(p.buffer,C.buffer,N.buffer),{indexDatatype:2===N.BYTES_PER_ELEMENT?_.IndexDatatype.UNSIGNED_SHORT:_.IndexDatatype.UNSIGNED_INT,currentPositions:u.buffer,previousPositions:o.buffer,nextPositions:f.buffer,expandAndWidth:p.buffer,batchIds:C.buffer,indices:N.buffer}})});
