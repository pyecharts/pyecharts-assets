/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

this.contourCustomSeriesInstaller = (function (echarts, d3) {
    'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var d3__namespace = /*#__PURE__*/_interopNamespaceDefault(d3);

    var blendColors = function (colors, dataLength, index) {
        if (dataLength <= 1) {
            return colors[0];
        }
        var dataRatio = index / (dataLength - 1);
        var colorIndex = Math.floor(dataRatio * (colors.length - 1));
        if (colorIndex <= 0) {
            return colors[0];
        }
        else if (colorIndex >= colors.length - 1) {
            return colors[colors.length - 1];
        }
        else {
            var leftColor = d3__namespace.color(colors[colorIndex]);
            var rightColor = d3__namespace.color(colors[colorIndex + 1]);
            var ratio = (dataRatio - colorIndex / (colors.length - 1)) * (colors.length - 1);
            return d3__namespace.interpolate(leftColor, rightColor)(ratio);
        }
    };
    var renderItem = function (params, api) {
        var cnt = params.dataInsideLength;
        if (params.dataIndex === cnt - 1) {
            var itemPayload = params.itemPayload;
            var coordSys = params.coordSys;
            var data = [];
            for (var i = 0; i < cnt; i++) {
                var xValue = api.value(0, i);
                var yValue = api.value(1, i);
                var value = api.value(2, i);
                var coord = api.coord([xValue, yValue]);
                data.push({
                    coord: coord,
                    value: value,
                });
            }
            var width = coordSys.width;
            var height = coordSys.height;
            var x_1 = d3__namespace
                .scaleLinear()
                .domain(d3__namespace.extent(data, function (d) { return d.coord[0]; }))
                .range([0, width]);
            var y_1 = d3__namespace
                .scaleLinear()
                .domain(d3__namespace.extent(data, function (d) { return d.coord[1]; }))
                .range([0, height]);
            var thresholds_1 = echarts.zrUtil.retrieve2(itemPayload.thresholds, 8);
            var bandwidth = echarts.zrUtil.retrieve2(itemPayload.bandwidth, 20);
            var contours = d3__namespace
                .contourDensity()
                .x(function (d) { return x_1(d.coord[0]); })
                .y(function (d) { return y_1(d.coord[1]); })
                .size([width, height])
                .bandwidth(bandwidth)
                .thresholds(thresholds_1)(data.map(function (d) { return ({ coord: d.coord, value: d.value }); }));
            var paths_1 = contours.map(d3__namespace.geoPath());
            var itemStyle = itemPayload.itemStyle || {};
            var colors_1 = itemStyle.color || [api.visual('color')];
            var itemOpacity_1 = echarts.zrUtil.retrieve2(itemStyle.opacity, [0.3, 1]);
            if (typeof itemOpacity_1 === 'number') {
                itemOpacity_1 = [itemOpacity_1, itemOpacity_1];
            }
            var lineStyle_1 = itemPayload.lineStyle || {};
            var stroke_1 = lineStyle_1.color;
            var lineWidth_1 = echarts.zrUtil.retrieve2(lineStyle_1.width, 1);
            var children_1 = [];
            paths_1.forEach(function (path, index) {
                var fill = colors_1 === 'none' ? 'none' : blendColors(colors_1, thresholds_1, index);
                if (colors_1 !== 'none') {
                    children_1.push({
                        type: 'path',
                        shape: {
                            pathData: path,
                        },
                        style: {
                            fill: fill,
                            opacity: itemOpacity_1[0] +
                                (itemOpacity_1[1] - itemOpacity_1[0]) * (index / (paths_1.length - 1)),
                        },
                        z2: -1,
                        disableTooltip: true,
                    });
                }
                if (stroke_1 !== 'none' && (stroke_1 != null || colors_1 !== 'none')) {
                    children_1.push({
                        type: 'path',
                        shape: {
                            pathData: path,
                        },
                        style: {
                            fill: 'none',
                            stroke: echarts.zrUtil.retrieve2(stroke_1, fill),
                            lineWidth: lineWidth_1,
                            opacity: echarts.zrUtil.retrieve2(lineStyle_1.opacity, 1),
                        },
                        z2: -1,
                        disableTooltip: true,
                    });
                }
            });
            return {
                type: 'group',
                children: children_1,
                x: coordSys.x,
                y: coordSys.y,
            };
        }
        return null;
    };
    var index = {
        install: function (registers) {
            registers.registerCustomSeries('contour', renderItem);
        },
    };

    return index;

})(echarts, d3);
// Automatically register the custom series
if (typeof window !== 'undefined' && window.echarts) {
  window.echarts.use(window.contourCustomSeriesInstaller);
}
