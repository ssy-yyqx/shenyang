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
define(["exports","./when-4ca4e419","./Math-c0afb7aa","./Cartesian2-0cd32dae","./EllipsoidTangentPlane-6e29c6f6","./PolygonPipeline-d378df2d","./PolylinePipeline-1211a424"],function(e,m,C,A,w,E,O){"use strict";var i={};var b=new A.Cartographic,M=new A.Cartographic;function L(e,i,t,n){var r=i.length;if(!(r<2)){var o=m.defined(n),a=m.defined(t),l=!0,h=new Array(r),s=new Array(r),g=new Array(r),p=i[0];h[0]=p;var d=e.cartesianToCartographic(p,b);a&&(d.height=t[0]),l=l&&d.height<=0,s[0]=d.height,g[0]=o?n[0]:0;for(var P,c,u=1,v=1;v<r;++v){var y=i[v],f=e.cartesianToCartographic(y,M);a&&(f.height=t[v]),l=l&&f.height<=0,P=d,c=f,C.CesiumMath.equalsEpsilon(P.latitude,c.latitude,C.CesiumMath.EPSILON14)&&C.CesiumMath.equalsEpsilon(P.longitude,c.longitude,C.CesiumMath.EPSILON14)?d.height<f.height&&(s[u-1]=f.height):(h[u]=y,s[u]=f.height,g[u]=o?n[v]:0,A.Cartographic.clone(f,d),++u)}if(!(l||u<2))return h.length=u,s.length=u,g.length=u,{positions:h,topHeights:s,bottomHeights:g}}}var F=new Array(2),H=new Array(2),T={positions:void 0,height:void 0,granularity:void 0,ellipsoid:void 0};i.computePositions=function(e,i,t,n,r,o){var a=L(e,i,t,n);if(m.defined(a)){i=a.positions,t=a.topHeights,n=a.bottomHeights,3<=i.length&&(h=w.EllipsoidTangentPlane.fromPoints(i,e).projectPointsOntoPlane(i),E.PolygonPipeline.computeWindingOrder2D(h)===E.WindingOrder.CLOCKWISE&&(i.reverse(),t.reverse(),n.reverse()));var l=i.length,h=l-2,s=C.CesiumMath.chordLength(r,e.maximumRadius),g=T;if(g.minDistance=s,g.ellipsoid=e,o){for(var p=0,d=0;d<l-1;d++)p+=O.PolylinePipeline.numberOfPoints(i[d],i[d+1],s)+1;var P=new Float64Array(3*p),c=new Float64Array(3*p),u=F,v=H;g.positions=u,g.height=v;var y=0;for(d=0;d<l-1;d++){u[0]=i[d],u[1]=i[d+1],v[0]=t[d],v[1]=t[d+1];var f=O.PolylinePipeline.generateArc(g);P.set(f,y),v[0]=n[d],v[1]=n[d+1],c.set(O.PolylinePipeline.generateArc(g),y),y+=f.length}}else g.positions=i,g.height=t,P=new Float64Array(O.PolylinePipeline.generateArc(g)),g.height=n,c=new Float64Array(O.PolylinePipeline.generateArc(g));return{bottomPositions:c,topPositions:P,numCorners:h}}},e.WallGeometryLibrary=i});
