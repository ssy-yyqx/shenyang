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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./Transforms-1f147cce","./RuntimeError-443472b0","./WebGLConstants-2ddfa2f9","./ComponentDatatype-adb4702b","./GeometryAttribute-ebf6a4c7","./GeometryAttributes-614c63f8","./VertexFormat-95f25802"],function(n,e,t,o,r,i,a,m,u,p,c,y){"use strict";function s(e){e=n.defaultValue(e,n.defaultValue.EMPTY_OBJECT);e=n.defaultValue(e.vertexFormat,y.VertexFormat.DEFAULT);this._vertexFormat=e,this._workerName="createPlaneGeometry"}s.packedLength=y.VertexFormat.packedLength,s.pack=function(e,t,r){return r=n.defaultValue(r,0),y.VertexFormat.pack(e._vertexFormat,t,r),t};var A=new y.VertexFormat,b={vertexFormat:A};s.unpack=function(e,t,r){t=n.defaultValue(t,0);t=y.VertexFormat.unpack(e,t,A);return n.defined(r)?(r._vertexFormat=y.VertexFormat.clone(t,r._vertexFormat),r):new s(b)};var l=new o.Cartesian3(-.5,-.5,0),F=new o.Cartesian3(.5,.5,0);return s.createGeometry=function(e){var t,r,n=e._vertexFormat,a=new c.GeometryAttributes;return n.position&&((e=new Float64Array(12))[0]=l.x,e[1]=l.y,e[2]=0,e[3]=F.x,e[4]=l.y,e[5]=0,e[6]=F.x,e[7]=F.y,e[8]=0,e[9]=l.x,e[10]=F.y,e[11]=0,a.position=new p.GeometryAttribute({componentDatatype:u.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e}),n.normal&&((e=new Float32Array(12))[0]=0,e[1]=0,e[2]=1,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=1,e[9]=0,e[10]=0,e[11]=1,a.normal=new p.GeometryAttribute({componentDatatype:u.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:e})),n.st&&((t=new Float32Array(8))[0]=0,t[1]=0,t[2]=1,t[3]=0,t[4]=1,t[5]=1,t[6]=0,t[7]=1,a.st=new p.GeometryAttribute({componentDatatype:u.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:t})),n.tangent&&((t=new Float32Array(12))[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t[6]=1,t[7]=0,t[8]=0,t[9]=1,t[10]=0,t[11]=0,a.tangent=new p.GeometryAttribute({componentDatatype:u.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:t})),n.bitangent&&((r=new Float32Array(12))[0]=0,r[1]=1,r[2]=0,r[3]=0,r[4]=1,r[5]=0,r[6]=0,r[7]=1,r[8]=0,r[9]=0,r[10]=1,r[11]=0,a.bitangent=new p.GeometryAttribute({componentDatatype:u.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:r})),(r=new Uint16Array(6))[0]=0,r[1]=1,r[2]=2,r[3]=0,r[4]=2,r[5]=3),new p.Geometry({attributes:a,indices:r,primitiveType:p.PrimitiveType.TRIANGLES,boundingSphere:new i.BoundingSphere(o.Cartesian3.ZERO,Math.sqrt(2))})},function(e,t){return n.defined(t)&&(e=s.unpack(e,t)),s.createGeometry(e)}});
