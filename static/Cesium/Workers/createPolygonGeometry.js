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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./Transforms-1f147cce","./RuntimeError-443472b0","./WebGLConstants-2ddfa2f9","./ComponentDatatype-adb4702b","./GeometryAttribute-ebf6a4c7","./GeometryAttributes-614c63f8","./AttributeCompression-424ccc06","./GeometryPipeline-27b4178f","./EncodedCartesian3-17533efe","./IndexDatatype-a78bfe07","./IntersectionTests-9618f995","./Plane-6d029ea4","./GeometryOffsetAttribute-daefb9ce","./VertexFormat-95f25802","./GeometryInstance-50734731","./arrayRemoveDuplicates-0e267e0f","./BoundingRectangle-4654555a","./EllipsoidTangentPlane-6e29c6f6","./ArcType-51c149e1","./EllipsoidRhumbLine-aeb03c9a","./PolygonPipeline-d378df2d","./PolygonGeometryLibrary-189cbefa","./EllipsoidGeodesic-f0d5153e"],function(z,e,W,Y,t,U,r,o,j,Q,a,i,A,n,E,s,l,q,f,G,u,p,O,c,y,V,F,m){"use strict";var K=new Y.Cartographic,Z=new Y.Cartographic;var D=new p.BoundingRectangle,J=new Y.Cartesian3,X=new Y.Cartesian3,$=new Y.Cartesian3,ee=new Y.Cartesian3,te=new Y.Cartesian3,re=new Y.Cartesian3,oe=new Y.Cartesian3,ae=new Y.Cartesian3,ie=new Y.Cartesian3,ne=new Y.Cartesian2,se=new Y.Cartesian2,le=new Y.Cartesian3,ue=new U.Quaternion,pe=new U.Matrix3,ce=new U.Matrix3;function L(e){var t,r=e.vertexFormat,o=e.geometry,a=e.shadowVolume,i=o.attributes.position.values,n=i.length,s=e.wall,l=e.top||s,u=e.bottom||s;if(r.st||r.normal||r.tangent||r.bitangent||a){var p=e.boundingRectangle,c=e.tangentPlane,y=e.ellipsoid,m=e.stRotation,g=e.perPositionHeight,d=ne;d.x=p.x,d.y=p.y;var h,f=r.st?new Float32Array(n/3*2):void 0;r.normal&&(h=g&&l&&!s?o.attributes.normal.values:new Float32Array(n));var b,_=r.tangent?new Float32Array(n):void 0,v=r.bitangent?new Float32Array(n):void 0,P=a?new Float32Array(n):void 0,C=0,w=0,x=X,T=$,I=ee,A=!0,E=pe,G=ce;G=0!==m?(b=U.Quaternion.fromAxisAngle(c._plane.normal,m,ue),E=U.Matrix3.fromQuaternion(b,E),b=U.Quaternion.fromAxisAngle(c._plane.normal,-m,ue),U.Matrix3.fromQuaternion(b,G)):(E=U.Matrix3.clone(U.Matrix3.IDENTITY,E),U.Matrix3.clone(U.Matrix3.IDENTITY,G));var O=0,V=0;l&&u&&(O=n/2,V=n/3,n/=2);for(var F=0;F<n;F+=3){var D,L,N,H,R,M,S,B,k=Y.Cartesian3.fromArray(i,F,le);r.st&&(D=U.Matrix3.multiplyByVector(E,k,J),D=y.scaleToGeodeticSurface(D,D),L=c.projectPointOntoPlane(D,se),Y.Cartesian2.subtract(L,d,L),N=W.CesiumMath.clamp(L.x/p.width,0,1),H=W.CesiumMath.clamp(L.y/p.height,0,1),u&&(f[C+V]=N,f[C+1+V]=H),l&&(f[C]=N,f[C+1]=H),C+=2),(r.normal||r.tangent||r.bitangent||a)&&(R=w+1,M=w+2,s?(F+3<n&&(S=Y.Cartesian3.fromArray(i,F+3,te),A&&(B=Y.Cartesian3.fromArray(i,F+n,re),g&&(t=k,D=S,L=B,N=void 0,N=(H=y).cartesianToCartographic(t,K).height,(t=H.cartesianToCartographic(D,Z)).height=N,H.cartographicToCartesian(t,D),(D=H.cartesianToCartographic(L,Z)).height=N-100,H.cartographicToCartesian(D,L)),Y.Cartesian3.subtract(S,k,S),Y.Cartesian3.subtract(B,k,B),x=Y.Cartesian3.normalize(Y.Cartesian3.cross(B,S,x),x),A=!1),Y.Cartesian3.equalsEpsilon(S,k,W.CesiumMath.EPSILON10)&&(A=!0)),(r.tangent||r.bitangent)&&(I=y.geodeticSurfaceNormal(k,I),r.tangent&&(T=Y.Cartesian3.normalize(Y.Cartesian3.cross(I,x,T),T)))):(x=y.geodeticSurfaceNormal(k,x),(r.tangent||r.bitangent)&&(g&&(oe=Y.Cartesian3.fromArray(h,w,oe),ae=Y.Cartesian3.cross(Y.Cartesian3.UNIT_Z,oe,ae),ae=Y.Cartesian3.normalize(U.Matrix3.multiplyByVector(G,ae,ae),ae),r.bitangent&&(ie=Y.Cartesian3.normalize(Y.Cartesian3.cross(oe,ae,ie),ie))),T=Y.Cartesian3.cross(Y.Cartesian3.UNIT_Z,x,T),T=Y.Cartesian3.normalize(U.Matrix3.multiplyByVector(G,T,T),T),r.bitangent&&(I=Y.Cartesian3.normalize(Y.Cartesian3.cross(x,T,I),I)))),r.normal&&(e.wall?(h[w+O]=x.x,h[R+O]=x.y,h[M+O]=x.z):u&&(h[w+O]=-x.x,h[R+O]=-x.y,h[M+O]=-x.z),(l&&!g||s)&&(h[w]=x.x,h[R]=x.y,h[M]=x.z)),a&&(s&&(x=y.geodeticSurfaceNormal(k,x)),P[w+O]=-x.x,P[R+O]=-x.y,P[M+O]=-x.z),r.tangent&&(e.wall?(_[w+O]=T.x,_[R+O]=T.y,_[M+O]=T.z):u&&(_[w+O]=-T.x,_[R+O]=-T.y,_[M+O]=-T.z),l&&(g?(_[w]=ae.x,_[R]=ae.y,_[M]=ae.z):(_[w]=T.x,_[R]=T.y,_[M]=T.z))),r.bitangent&&(u&&(v[w+O]=I.x,v[R+O]=I.y,v[M+O]=I.z),l&&(g?(v[w]=ie.x,v[R]=ie.y,v[M]=ie.z):(v[w]=I.x,v[R]=I.y,v[M]=I.z))),w+=3)}r.st&&(o.attributes.st=new Q.GeometryAttribute({componentDatatype:j.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:f})),r.normal&&(o.attributes.normal=new Q.GeometryAttribute({componentDatatype:j.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:h})),r.tangent&&(o.attributes.tangent=new Q.GeometryAttribute({componentDatatype:j.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:_})),r.bitangent&&(o.attributes.bitangent=new Q.GeometryAttribute({componentDatatype:j.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:v})),a&&(o.attributes.extrudeDirection=new Q.GeometryAttribute({componentDatatype:j.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:P}))}return e.extrude&&z.defined(e.offsetAttribute)&&(m=i.length/3,b=new Uint8Array(m),e.offsetAttribute===q.GeometryOffsetAttribute.TOP?l&&u||s?b=q.arrayFill(b,1,0,m/2):l&&(b=q.arrayFill(b,1)):(m=e.offsetAttribute===q.GeometryOffsetAttribute.NONE?0:1,b=q.arrayFill(b,m)),o.attributes.applyOffset=new Q.GeometryAttribute({componentDatatype:j.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:b})),o}var g=new Y.Cartographic,d=new Y.Cartographic,h={westOverIDL:0,eastOverIDL:0},b=new m.EllipsoidGeodesic;function _(e,t,r,o,a){if(a=z.defaultValue(a,new Y.Rectangle),!z.defined(e)||e.length<3)return a.west=0,a.north=0,a.south=0,a.east=0,a;if(r===c.ArcType.RHUMB)return Y.Rectangle.fromCartesianArray(e,t,a);b.ellipsoid.equals(t)||(b=new m.EllipsoidGeodesic(void 0,void 0,t)),a.west=Number.POSITIVE_INFINITY,a.east=Number.NEGATIVE_INFINITY,a.south=Number.POSITIVE_INFINITY,a.north=Number.NEGATIVE_INFINITY,h.westOverIDL=Number.POSITIVE_INFINITY,h.eastOverIDL=Number.NEGATIVE_INFINITY;for(var i,n=1/W.CesiumMath.chordLength(o,t.maximumRadius),s=e.length,l=t.cartesianToCartographic(e[0],d),u=g,p=1;p<s;p++)i=u,u=l,l=t.cartesianToCartographic(e[p],i),b.setEndPoints(u,l),P(b,n,a,h);return i=u,u=l,l=t.cartesianToCartographic(e[0],i),b.setEndPoints(u,l),P(b,n,a,h),a.east-a.west>h.eastOverIDL-h.westOverIDL&&(a.west=h.westOverIDL,a.east=h.eastOverIDL,a.east>W.CesiumMath.PI&&(a.east=a.east-W.CesiumMath.TWO_PI),a.west>W.CesiumMath.PI&&(a.west=a.west-W.CesiumMath.TWO_PI)),a}var v=new Y.Cartographic;function P(e,t,r,o){for(var a=e.surfaceDistance,i=Math.ceil(a*t),n=0<i?a/(i-1):Number.POSITIVE_INFINITY,s=0,l=0;l<i;l++){var u=e.interpolateUsingSurfaceDistance(s,v);s+=n;var p=u.longitude,u=u.latitude;r.west=Math.min(r.west,p),r.east=Math.max(r.east,p),r.south=Math.min(r.south,u),r.north=Math.max(r.north,u);p=0<=p?p:p+W.CesiumMath.TWO_PI;o.westOverIDL=Math.min(o.westOverIDL,p),o.eastOverIDL=Math.max(o.eastOverIDL,p)}}var N=[];function C(e){var t,r=e.polygonHierarchy,o=z.defaultValue(e.vertexFormat,f.VertexFormat.DEFAULT),a=z.defaultValue(e.ellipsoid,Y.Ellipsoid.WGS84),i=z.defaultValue(e.granularity,W.CesiumMath.RADIANS_PER_DEGREE),n=z.defaultValue(e.stRotation,0),s=z.defaultValue(e.perPositionHeight,!1),l=s&&z.defined(e.extrudedHeight),u=z.defaultValue(e.height,0),p=z.defaultValue(e.extrudedHeight,u);l||(t=Math.max(u,p),p=Math.min(u,p),u=t),this._vertexFormat=f.VertexFormat.clone(o),this._ellipsoid=Y.Ellipsoid.clone(a),this._granularity=i,this._stRotation=n,this._height=u,this._extrudedHeight=p,this._closeTop=z.defaultValue(e.closeTop,!0),this._closeBottom=z.defaultValue(e.closeBottom,!0),this._polygonHierarchy=r,this._perPositionHeight=s,this._perPositionHeightExtrude=l,this._shadowVolume=z.defaultValue(e.shadowVolume,!1),this._workerName="createPolygonGeometry",this._offsetAttribute=e.offsetAttribute,this._arcType=z.defaultValue(e.arcType,c.ArcType.GEODESIC),this._rectangle=void 0,this._textureCoordinateRotationPoints=void 0,this.packedLength=F.PolygonGeometryLibrary.computeHierarchyPackedLength(r)+Y.Ellipsoid.packedLength+f.VertexFormat.packedLength+12}C.fromPositions=function(e){return new C({polygonHierarchy:{positions:(e=z.defaultValue(e,z.defaultValue.EMPTY_OBJECT)).positions},height:e.height,extrudedHeight:e.extrudedHeight,vertexFormat:e.vertexFormat,stRotation:e.stRotation,ellipsoid:e.ellipsoid,granularity:e.granularity,perPositionHeight:e.perPositionHeight,closeTop:e.closeTop,closeBottom:e.closeBottom,offsetAttribute:e.offsetAttribute,arcType:e.arcType})},C.pack=function(e,t,r){return r=z.defaultValue(r,0),r=F.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy,t,r),Y.Ellipsoid.pack(e._ellipsoid,t,r),r+=Y.Ellipsoid.packedLength,f.VertexFormat.pack(e._vertexFormat,t,r),r+=f.VertexFormat.packedLength,t[r++]=e._height,t[r++]=e._extrudedHeight,t[r++]=e._granularity,t[r++]=e._stRotation,t[r++]=e._perPositionHeightExtrude?1:0,t[r++]=e._perPositionHeight?1:0,t[r++]=e._closeTop?1:0,t[r++]=e._closeBottom?1:0,t[r++]=e._shadowVolume?1:0,t[r++]=z.defaultValue(e._offsetAttribute,-1),t[r++]=e._arcType,t[r]=e.packedLength,t};var w=Y.Ellipsoid.clone(Y.Ellipsoid.UNIT_SPHERE),x=new f.VertexFormat,T={polygonHierarchy:{}};return C.unpack=function(e,t,r){t=z.defaultValue(t,0);var o=F.PolygonGeometryLibrary.unpackPolygonHierarchy(e,t);t=o.startingIndex,delete o.startingIndex;var a=Y.Ellipsoid.unpack(e,t,w);t+=Y.Ellipsoid.packedLength;var i=f.VertexFormat.unpack(e,t,x);t+=f.VertexFormat.packedLength;var n=e[t++],s=e[t++],l=e[t++],u=e[t++],p=1===e[t++],c=1===e[t++],y=1===e[t++],m=1===e[t++],g=1===e[t++],d=e[t++],h=e[t++],t=e[t];return(r=!z.defined(r)?new C(T):r)._polygonHierarchy=o,r._ellipsoid=Y.Ellipsoid.clone(a,r._ellipsoid),r._vertexFormat=f.VertexFormat.clone(i,r._vertexFormat),r._height=n,r._extrudedHeight=s,r._granularity=l,r._stRotation=u,r._perPositionHeightExtrude=p,r._perPositionHeight=c,r._closeTop=y,r._closeBottom=m,r._shadowVolume=g,r._offsetAttribute=-1===d?void 0:d,r._arcType=h,r.packedLength=t,r},C.computeRectangle=function(e,t){var r=z.defaultValue(e.granularity,W.CesiumMath.RADIANS_PER_DEGREE),o=z.defaultValue(e.arcType,c.ArcType.GEODESIC),a=e.polygonHierarchy,e=z.defaultValue(e.ellipsoid,Y.Ellipsoid.WGS84);return _(a.positions,e,o,r,t)},C.createGeometry=function(e){var t=e._vertexFormat,r=e._ellipsoid,o=e._granularity,a=e._stRotation,i=e._polygonHierarchy,n=e._perPositionHeight,s=e._closeTop,l=e._closeBottom,u=e._arcType;if(!((g=i.positions).length<3)){var p=O.EllipsoidTangentPlane.fromPoints(g,r),i=F.PolygonGeometryLibrary.polygonsFromHierarchy(i,p.projectPointsOntoPlane.bind(p),!n,r),c=i.hierarchy,y=i.polygons;if(0!==c.length){var m,g=c[0].outerRing,g=F.PolygonGeometryLibrary.computeBoundingRectangle(p.plane.normal,p.projectPointOntoPlane.bind(p),g,a,D),d=[],h=e._height,f=e._extrudedHeight,b={perPositionHeight:n,vertexFormat:t,geometry:void 0,tangentPlane:p,boundingRectangle:g,ellipsoid:r,stRotation:a,bottom:!1,top:!0,wall:!1,extrude:!1,arcType:u};if(e._perPositionHeightExtrude||!W.CesiumMath.equalsEpsilon(h,f,0,W.CesiumMath.EPSILON2))for(b.extrude=!0,b.top=s,b.bottom=l,b.shadowVolume=e._shadowVolume,b.offsetAttribute=e._offsetAttribute,m=0;m<y.length;m++){var _,v=function(e,t,r,o,a,i,n,s,l){var u={walls:[]};if(i||n){var p=F.PolygonGeometryLibrary.createGeometryFromPositions(e,t,r,a,s,l),t=p.attributes.position.values,c=p.indices;if(i&&n){var y,i=t.concat(t),m=i.length/3;(y=E.IndexDatatype.createTypedArray(m,2*c.length)).set(c);for(var g=c.length,d=m/2,h=0;h<g;h+=3){var f=y[h]+d,b=y[h+1]+d,_=y[h+2]+d;y[h+g]=_,y[h+1+g]=b,y[h+2+g]=f}p.attributes.position.values=i,a&&s.normal&&(s=p.attributes.normal.values,p.attributes.normal.values=new Float32Array(i.length),p.attributes.normal.values.set(s)),p.indices=y}else if(n){for(m=t.length/3,y=E.IndexDatatype.createTypedArray(m,c.length),h=0;h<c.length;h+=3)y[h]=c[h+2],y[h+1]=c[h+1],y[h+2]=c[h];p.indices=y}u.topAndBottom=new G.GeometryInstance({geometry:p})}var p=o.outerRing,v=O.EllipsoidTangentPlane.fromPoints(p,e).projectPointsOntoPlane(p,N);V.PolygonPipeline.computeWindingOrder2D(v)===V.WindingOrder.CLOCKWISE&&(p=p.slice().reverse());var P=F.PolygonGeometryLibrary.computeWallGeometry(p,e,r,a,l);u.walls.push(new G.GeometryInstance({geometry:P}));var C=o.holes;for(h=0;h<C.length;h++){var w=C[h],v=O.EllipsoidTangentPlane.fromPoints(w,e).projectPointsOntoPlane(w,N);V.PolygonPipeline.computeWindingOrder2D(v)===V.WindingOrder.COUNTER_CLOCKWISE&&(w=w.slice().reverse()),P=F.PolygonGeometryLibrary.computeWallGeometry(w,e,r,a,l),u.walls.push(new G.GeometryInstance({geometry:P}))}return u}(r,y[m],o,c[m],n,s,l,t,u);s&&l?(_=v.topAndBottom,b.geometry=F.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(_.geometry,h,f,r,n)):s?((_=v.topAndBottom).geometry.attributes.position.values=V.PolygonPipeline.scaleToGeodeticHeight(_.geometry.attributes.position.values,h,r,!n),b.geometry=_.geometry):l&&((_=v.topAndBottom).geometry.attributes.position.values=V.PolygonPipeline.scaleToGeodeticHeight(_.geometry.attributes.position.values,f,r,!0),b.geometry=_.geometry),(s||l)&&(b.wall=!1,_.geometry=L(b),d.push(_));var P=v.walls;b.wall=!0;for(var C=0;C<P.length;C++){var w=P[C];b.geometry=F.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(w.geometry,h,f,r,n),w.geometry=L(b),d.push(w)}}else for(m=0;m<y.length;m++){var x,T,I=new G.GeometryInstance({geometry:F.PolygonGeometryLibrary.createGeometryFromPositions(r,y[m],o,n,t,u)});I.geometry.attributes.position.values=V.PolygonPipeline.scaleToGeodeticHeight(I.geometry.attributes.position.values,h,r,!n),b.geometry=I.geometry,I.geometry=L(b),z.defined(e._offsetAttribute)&&(T=I.geometry.attributes.position.values.length,x=new Uint8Array(T/3),T=e._offsetAttribute===q.GeometryOffsetAttribute.NONE?0:1,q.arrayFill(x,T),I.geometry.attributes.applyOffset=new Q.GeometryAttribute({componentDatatype:j.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:x})),d.push(I)}p=A.GeometryPipeline.combineInstances(d)[0];p.attributes.position.values=new Float64Array(p.attributes.position.values),p.indices=E.IndexDatatype.createTypedArray(p.attributes.position.values.length/3,p.indices);g=p.attributes,a=U.BoundingSphere.fromVertices(g.position.values);return t.position||delete g.position,new Q.Geometry({attributes:g,indices:p.indices,primitiveType:p.primitiveType,boundingSphere:a,offsetAttribute:e._offsetAttribute})}}},C.createShadowVolume=function(e,t,r){var o=e._granularity,a=e._ellipsoid,t=t(o,a),r=r(o,a);return new C({polygonHierarchy:e._polygonHierarchy,ellipsoid:a,stRotation:e._stRotation,granularity:o,perPositionHeight:!1,extrudedHeight:t,height:r,vertexFormat:f.VertexFormat.POSITION_ONLY,shadowVolume:!0,arcType:e._arcType})},t.defineProperties(C.prototype,{rectangle:{get:function(){var e;return z.defined(this._rectangle)||(e=this._polygonHierarchy.positions,this._rectangle=_(e,this._ellipsoid,this._arcType,this._granularity)),this._rectangle}},textureCoordinateRotationPoints:{get:function(){return z.defined(this._textureCoordinateRotationPoints)||(this._textureCoordinateRotationPoints=function(e){var t=-e._stRotation;if(0==t)return[0,0,0,1,1,0];var r=e._ellipsoid,o=e._polygonHierarchy.positions,e=e.rectangle;return Q.Geometry._textureCoordinateRotationPoints(o,t,r,e)}(this)),this._textureCoordinateRotationPoints}}}),function(e,t){return(e=z.defined(t)?C.unpack(e,t):e)._ellipsoid=Y.Ellipsoid.clone(e._ellipsoid),C.createGeometry(e)}});
