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
define(["./when-4ca4e419","./Check-430b3551","./Math-c0afb7aa","./Cartesian2-0cd32dae","./defineProperties-24e785e9","./Transforms-1f147cce","./RuntimeError-443472b0","./WebGLConstants-2ddfa2f9","./ComponentDatatype-adb4702b","./GeometryAttribute-ebf6a4c7","./GeometryAttributes-614c63f8","./IndexDatatype-a78bfe07","./GeometryOffsetAttribute-daefb9ce","./EllipseGeometryLibrary-13db6b5e","./EllipseOutlineGeometry-8e2e10d0"],function(r,e,i,n,t,l,s,o,a,d,u,c,m,p,y){"use strict";function f(e){var i=(e=r.defaultValue(e,r.defaultValue.EMPTY_OBJECT)).radius,e={center:e.center,semiMajorAxis:i,semiMinorAxis:i,ellipsoid:e.ellipsoid,height:e.height,extrudedHeight:e.extrudedHeight,granularity:e.granularity,numberOfVerticalLines:e.numberOfVerticalLines};this._ellipseGeometry=new y.EllipseOutlineGeometry(e),this._workerName="createCircleOutlineGeometry"}f.packedLength=y.EllipseOutlineGeometry.packedLength,f.pack=function(e,i,t){return y.EllipseOutlineGeometry.pack(e._ellipseGeometry,i,t)};var G=new y.EllipseOutlineGeometry({center:new n.Cartesian3,semiMajorAxis:1,semiMinorAxis:1}),_={center:new n.Cartesian3,radius:void 0,ellipsoid:n.Ellipsoid.clone(n.Ellipsoid.UNIT_SPHERE),height:void 0,extrudedHeight:void 0,granularity:void 0,numberOfVerticalLines:void 0,semiMajorAxis:void 0,semiMinorAxis:void 0};return f.unpack=function(e,i,t){i=y.EllipseOutlineGeometry.unpack(e,i,G);return _.center=n.Cartesian3.clone(i._center,_.center),_.ellipsoid=n.Ellipsoid.clone(i._ellipsoid,_.ellipsoid),_.height=i._height,_.extrudedHeight=i._extrudedHeight,_.granularity=i._granularity,_.numberOfVerticalLines=i._numberOfVerticalLines,r.defined(t)?(_.semiMajorAxis=i._semiMajorAxis,_.semiMinorAxis=i._semiMinorAxis,t._ellipseGeometry=new y.EllipseOutlineGeometry(_),t):(_.radius=i._semiMajorAxis,new f(_))},f.createGeometry=function(e){return y.EllipseOutlineGeometry.createGeometry(e._ellipseGeometry)},function(e,i){return(e=r.defined(i)?f.unpack(e,i):e)._ellipseGeometry._center=n.Cartesian3.clone(e._ellipseGeometry._center),e._ellipseGeometry._ellipsoid=n.Ellipsoid.clone(e._ellipseGeometry._ellipsoid),f.createGeometry(e)}});
