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

this.stageCustomSeriesInstaller = (function (echarts) {
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

    var echarts__namespace = /*#__PURE__*/_interopNamespaceDefault(echarts);

    var renderItem = function (params, api) {
        var _a;
        var start = api.value(0);
        var end = api.value(1);
        var stageIndex = api.value(2);
        var startCoord = api.coord([start, stageIndex]);
        var endCoord = api.coord([end, stageIndex]);
        var bandWidth = api.coord([0, 0])[1] - api.coord([0, 1])[1];
        var fontSize = 14;
        var textMargin = 5;
        var color = api.visual('color');
        var itemPayload = params.itemPayload;
        var itemStyle = itemPayload.itemStyle || {};
        var borderRadius = itemStyle.borderRadius || 8;
        var externalRadius = echarts.zrUtil.retrieve2((_a = itemPayload.envelope) === null || _a === void 0 ? void 0 : _a.externalRadius, 6);
        var barVerticalMargin = echarts.zrUtil.retrieve2(itemStyle.verticalMargin, 8);
        var barMinWidth = echarts.zrUtil.retrieve2(itemStyle.minHorizontalSize, 3);
        var children = [];
        var boxes = params.context.boxes || [];
        var span = endCoord[0] - startCoord[0];
        var height = Math.max(span, barMinWidth);
        var shape = {
            x: startCoord[0] - (height - span) / 2,
            y: startCoord[1] - bandWidth / 2 + textMargin + fontSize + barVerticalMargin,
            width: height,
            height: bandWidth - fontSize - textMargin - 2 * barVerticalMargin,
        };
        children.push({
            type: 'rect',
            shape: {
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
                r: borderRadius,
            },
            style: {
                fill: color,
            },
            z2: 10,
        });
        boxes.push(shape);
        params.context.boxes = boxes;
        if (!params.context.renderedStages) {
            params.context.renderedStages = [];
        }
        var renderedStages = params.context.renderedStages;
        if (!renderedStages[stageIndex]) {
            var axisLabel = itemPayload.axisLabel || {};
            var text = api.ordinalRawValue(2);
            if (typeof axisLabel.formatter === 'function') {
                text = axisLabel.formatter(text, stageIndex);
            }
            children.push({
                type: 'text',
                style: {
                    x: params.coordSys.x + textMargin,
                    y: startCoord[1] - bandWidth / 2 + textMargin + fontSize,
                    fill: axisLabel.color || '#8A8A8A',
                    text: text,
                    verticalAlign: 'bottom',
                },
                z2: 20,
            });
            renderedStages[stageIndex] = true;
        }
        if (params.dataIndex === params.dataInsideLength - 1) {
            var allColors = [];
            for (var i = 0; i < params.dataInsideLength; i++) {
                var color_1 = api.visual('color', i);
                if (allColors.indexOf(color_1) < 0) {
                    allColors.push(color_1);
                }
            }
            var envelope = itemPayload.envelope || {};
            if (envelope.show !== false && boxes.length > 1) {
                var envelopePaths = [];
                var margin = echarts__namespace.zrUtil.retrieve2(envelope.margin, 2);
                boxes.sort(function (a, b) { return a.x - b.x || a.y - b.y; });
                var envelopeFill = envelope.color || '#888';
                if (allColors.length > 0 && !envelope.color) {
                    var stops = [];
                    for (var i = 0; i < allColors.length; i++) {
                        stops.push({
                            offset: (i * 2 + 1) / (allColors.length * 2),
                            color: allColors[i],
                        });
                    }
                    envelopeFill = {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        global: false,
                        colorStops: stops,
                    };
                }
                var opacity = echarts.zrUtil.retrieve2(envelope.opacity, 0.25);
                for (var i = 0; i < boxes.length; i++) {
                    var box = boxes[i];
                    envelopePaths.push({
                        type: 'rect',
                        shape: {
                            x: box.x - margin,
                            y: box.y - margin,
                            width: box.width + margin * 2,
                            height: box.height + margin * 2,
                            r: Math.min(borderRadius, box.width / 2) + margin,
                        },
                    });
                    if (i > 0) {
                        var prevBox = boxes[i - 1];
                        var isPrevLower = prevBox.y > box.y + box.height;
                        var height_1 = isPrevLower
                            ? prevBox.y - box.y - box.height + borderRadius * 2
                            : box.y - prevBox.y - prevBox.height + borderRadius * 2;
                        var y = isPrevLower
                            ? box.y + box.height - borderRadius
                            : prevBox.y + prevBox.height - borderRadius;
                        if (box.x - margin >= prevBox.x + prevBox.width + margin) {
                            continue;
                        }
                        if (isPrevLower) {
                            if (box.x - margin - prevBox.x > 0) {
                                var right = Math.ceil(box.x - margin);
                                var bottom = prevBox.y - margin;
                                var r = Math.min((box.x - margin - prevBox.x) / 2, externalRadius);
                                envelopePaths.push({
                                    type: 'path',
                                    shape: {
                                        pathData: "M".concat(right - r, " ").concat(bottom, "A").concat(r, " ").concat(r, " 0 0 0 ").concat(right, " ").concat(bottom - r, "L").concat(right, ",").concat(bottom + margin, "L").concat(right - r, ",").concat(bottom, "Z"),
                                    },
                                });
                            }
                            if (box.x + box.width - prevBox.x - prevBox.width - margin > 0) {
                                var top_1 = box.y + box.height + margin;
                                var left = Math.floor(prevBox.x + prevBox.width + margin);
                                var r = Math.min((box.x + box.width - prevBox.x - prevBox.width - margin) / 2, externalRadius);
                                envelopePaths.push({
                                    type: 'path',
                                    shape: {
                                        pathData: "M".concat(left + r, " ").concat(top_1, "A").concat(r, " ").concat(r, " 0 0 0 ").concat(left, " ").concat(top_1 + r, "L").concat(left, ",").concat(top_1 - margin, "L").concat(left + r, ",").concat(top_1, "Z"),
                                    },
                                });
                            }
                        }
                        else {
                            if (box.x - margin - prevBox.x > 0) {
                                var right = Math.ceil(box.x - margin);
                                var top_2 = prevBox.y + prevBox.height + margin;
                                var r = Math.min((box.x - margin - prevBox.x) / 2, externalRadius);
                                envelopePaths.push({
                                    type: 'path',
                                    shape: {
                                        pathData: "M".concat(right, " ").concat(top_2 + r, "A").concat(r, " ").concat(r, " 0 0 0 ").concat(right - r, " ").concat(top_2, "L").concat(right, ",").concat(top_2 - margin, "L").concat(right, ",").concat(top_2 + r, "Z"),
                                    },
                                });
                            }
                            if (box.x + box.width - prevBox.x - prevBox.width - margin > 0) {
                                var bottom = box.y - margin;
                                var left = Math.floor(prevBox.x + prevBox.width + margin);
                                var r = Math.min((box.x + box.width - prevBox.x - prevBox.width - margin) / 2, externalRadius);
                                envelopePaths.push({
                                    type: 'path',
                                    shape: {
                                        pathData: "M".concat(left, " ").concat(bottom - r, "A").concat(r, " ").concat(r, " 0 0 0 ").concat(left + r, " ").concat(bottom, "L").concat(left, ",").concat(bottom + margin, "L").concat(left, ",").concat(bottom - r, "Z"),
                                    },
                                });
                            }
                        }
                        envelopePaths.push({
                            type: 'rect',
                            shape: {
                                x: prevBox.x + prevBox.width + margin,
                                y: y + height_1,
                                width: box.x - prevBox.x - prevBox.width - margin * 2,
                                height: -height_1,
                            },
                        });
                    }
                }
                children.push({
                    type: 'compoundPath',
                    shape: {
                        paths: envelopePaths,
                    },
                    style: {
                        fill: envelopeFill,
                        opacity: opacity,
                    },
                    silent: true,
                });
            }
        }
        return {
            type: 'group',
            children: children,
        };
    };
    var index = {
        install: function (registers) {
            registers.registerCustomSeries('stage', renderItem);
        },
    };

    return index;

})(echarts);
// Automatically register the custom series
if (typeof window !== 'undefined' && window.echarts) {
  window.echarts.use(window.stageCustomSeriesInstaller);
}
