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
define(["exports","./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./Transforms-1f147cce","./GeometryAttribute-ebf6a4c7"],function(t,d,n,X,Y,a,l){"use strict";var w=Math.cos,M=Math.sin,m=Math.sqrt,r={computePosition:function(t,n,a,r,e,o,s){var i=n.radiiSquared,g=t.nwCorner,c=t.boundingRectangle,h=g.latitude-t.granYCos*r+e*t.granXSin,u=w(h),C=M(h),l=i.z*C,S=g.longitude+r*t.granYSin+e*t.granXCos,n=u*w(S),g=u*M(S),u=i.x*n,i=i.y*g,C=m(u*n+i*g+l*C);o.x=u/C,o.y=i/C,o.z=l/C,a&&(a=t.stNwCorner,d.defined(a)?(h=a.latitude-t.stGranYCos*r+e*t.stGranXSin,S=a.longitude+r*t.stGranYSin+e*t.stGranXCos,s.x=(S-t.stWest)*t.lonScalar,s.y=(h-t.stSouth)*t.latScalar):(s.x=(S-c.west)*t.lonScalar,s.y=(h-c.south)*t.latScalar))}},S=new l.Matrix2,p=new Y.Cartesian3,f=new Y.Cartographic,G=new Y.Cartesian3,x=new a.GeographicProjection;function R(t,n,a,r,e,o,s){var i=Math.cos(n),g=r*i,c=a*i,h=Math.sin(n),u=r*h,C=a*h;p=x.project(t,p),p=Y.Cartesian3.subtract(p,G,p);i=l.Matrix2.fromRotation(n,S);p=l.Matrix2.multiplyByVector(i,p,p),p=Y.Cartesian3.add(p,G,p),--o,--s;r=(t=x.unproject(p,t)).latitude,a=r+o*C,h=r-g*s,n=r-g*s+o*C,i=Math.max(r,a,h,n),r=Math.min(r,a,h,n),a=t.longitude,h=a+o*c,n=a+s*u,o=a+s*u+o*c;return{north:i,south:r,east:Math.max(a,h,n,o),west:Math.min(a,h,n,o),granYCos:g,granYSin:u,granXCos:c,granXSin:C,nwCorner:t}}r.computeOptions=function(t,n,a,r,e,o,s){var i=t.east,g=t.west,c=t.north,h=t.south,u=!1,C=!1;c===X.CesiumMath.PI_OVER_TWO&&(u=!0),h===-X.CesiumMath.PI_OVER_TWO&&(C=!0);var l,S=c-h,d=(w=i<g?X.CesiumMath.TWO_PI-g+i:i-g)/((l=Math.ceil(w/n)+1)-1),w=S/((M=Math.ceil(S/n)+1)-1),S=Y.Rectangle.northwest(t,o),n=Y.Rectangle.center(t,f);0===a&&0===r||(n.longitude<S.longitude&&(n.longitude+=X.CesiumMath.TWO_PI),G=x.project(n,G));var M,o=w,n=d,e=Y.Rectangle.clone(t,e),C={granYCos:o,granYSin:0,granXCos:n,granXSin:0,nwCorner:S,boundingRectangle:e,width:l,height:M,northCap:u,southCap:C};return 0!==a&&(c=(S=R(S,a,d,w,0,l,M)).north,h=S.south,i=S.east,g=S.west,C.granYCos=S.granYCos,C.granYSin=S.granYSin,C.granXCos=S.granXCos,C.granXSin=S.granXSin,e.north=c,e.south=h,e.east=i,e.west=g),0!==r&&(a-=r,M=R(s=Y.Rectangle.northwest(e,s),a,d,w,0,l,M),C.stGranYCos=M.granYCos,C.stGranXCos=M.granXCos,C.stGranYSin=M.granYSin,C.stGranXSin=M.granXSin,C.stNwCorner=s,C.stWest=M.west,C.stSouth=M.south),C},t.RectangleGeometryLibrary=r});
