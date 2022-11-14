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
function MVTColorParser(){}MVTColorParser.prototype={parse:function(s){if(null==s)return null;if(-1!=s.indexOf("rgba")||-1!=s.indexOf("rgb"))return s;s=this.parseCSSColor(s);return"rgba("+Math.round(s[0])+","+Math.round(s[1])+","+Math.round(s[2])+","+s[3]+")"},clamp_css_byte:function(s){return(s=Math.round(s))<0?0:255<s?255:s},clamp_css_float:function(s){return s<0?0:1<s?1:s},parse_css_int:function(s){return"%"===s[s.length-1]?this.clamp_css_byte(parseFloat(s)/100*255):this.clamp_css_byte(parseInt(s))},parse_css_float:function(s){return"%"===s[s.length-1]?this.clamp_css_float(parseFloat(s)/100):this.clamp_css_float(parseFloat(s))},css_hue_to_rgb:function(s,t,r){return r<0?r+=1:1<r&&--r,6*r<1?s+(t-s)*r*6:2*r<1?t:3*r<2?s+(t-s)*(2/3-r)*6:s},parseCSSColor:function(s){var t=s.replace(/ /g,"").toLowerCase();if("#"===t[0])return 4===t.length?0<=(e=parseInt(t.substr(1),16))&&e<=4095?[(3840&e)>>4|(3840&e)>>8,240&e|(240&e)>>4,15&e|(15&e)<<4,1]:null:7===t.length&&0<=(e=parseInt(t.substr(1),16))&&e<=16777215?[(16711680&e)>>16,(65280&e)>>8,255&e,1]:null;var r=t.indexOf("("),s=t.indexOf(")");if(-1!==r&&s+1===t.length){var e=t.substr(0,r),n=t.substr(r+1,s-(r+1)).split(","),a=1;switch(e){case"rgba":if(4!==n.length)return null;a=this.parse_css_float(n.pop());case"rgb":return 3!==n.length?null:[this.parse_css_int(n[0]),this.parse_css_int(n[1]),this.parse_css_int(n[2]),a];case"hsla":if(4!==n.length)return null;a=this.parse_css_float(n.pop());case"hsl":if(3!==n.length)return null;var l=(parseFloat(n[0])%360+360)%360/360,_=this.parse_css_float(n[1]),u=this.parse_css_float(n[2]),_=u<=.5?u*(_+1):u+_-u*_,u=2*u-_;return[this.clamp_css_byte(255*this.css_hue_to_rgb(u,_,l+1/3)),this.clamp_css_byte(255*this.css_hue_to_rgb(u,_,l)),this.clamp_css_byte(255*this.css_hue_to_rgb(u,_,l-1/3)),a];default:return null}}return null}};