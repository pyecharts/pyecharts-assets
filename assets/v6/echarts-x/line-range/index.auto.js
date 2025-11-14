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

this.lineRangeCustomSeriesInstaller = (function (echarts) {
    'use strict';

    var renderItem = function (params, api) {
        var group = {
            type: 'group',
            children: [],
        };
        var cnt = params.dataInsideLength;
        if (params.dataIndex === cnt - 1) {
            var itemPayload = params.itemPayload;
            var isHorizontal = params.encode.x.length === 1;
            var startDim = isHorizontal ? params.encode.y[0] : params.encode.x[0];
            var endDim = isHorizontal ? params.encode.y[1] : params.encode.x[1];
            var points = [];
            var pathDataStart = '';
            var pathDataEnd = '';
            for (var i = 0; i < cnt; i++) {
                var startValue = api.value(startDim, i);
                var startCoord = api.coord(isHorizontal ? [i, startValue] : [startValue, i]);
                points.push(startCoord);
                pathDataStart +=
                    (i === 0 ? 'M' : 'L') + startCoord[0] + ',' + startCoord[1] + ' ';
            }
            for (var i = cnt - 1; i >= 0; i--) {
                var endValue = api.value(endDim, i);
                var endCoord = api.coord(isHorizontal ? [i, endValue] : [endValue, i]);
                points.push(endCoord);
                pathDataEnd +=
                    (i === cnt - 1 ? 'M' : 'L') + endCoord[0] + ',' + endCoord[1] + ' ';
            }
            if (itemPayload.areaStyle) {
                var areaStyle = itemPayload.areaStyle;
                group.children.push({
                    type: 'polygon',
                    shape: {
                        points: points,
                    },
                    style: {
                        fill: areaStyle.color || api.visual('color'),
                        opacity: echarts.zrUtil.retrieve2(areaStyle.opacity, 0.2),
                        shadowBlur: areaStyle.shadowBlur,
                        shadowColor: areaStyle.shadowColor,
                        shadowOffsetX: areaStyle.shadowOffsetX,
                        shadowOffsetY: areaStyle.shadowOffsetY,
                    },
                    disableTooltip: true,
                });
            }
            var lineStyle = itemPayload.lineStyle || {};
            var polylineStyle = {
                fill: 'none',
                stroke: lineStyle.color || api.visual('color'),
                lineWidth: echarts.zrUtil.retrieve2(lineStyle.width, 0),
                opacity: echarts.zrUtil.retrieve2(lineStyle.opacity, 1),
                type: lineStyle.type,
                dashOffset: lineStyle.dashOffset,
                lineCap: lineStyle.cap,
                lineJoin: lineStyle.join,
                miterLimit: lineStyle.miterLimit,
                shadowBlur: lineStyle.shadowBlur,
                shadowColor: lineStyle.shadowColor,
                shadowOffsetX: lineStyle.shadowOffsetX,
                shadowOffsetY: lineStyle.shadowOffsetY,
            };
            group.children.push({
                type: 'path',
                shape: {
                    pathData: pathDataStart,
                },
                style: polylineStyle,
                disableTooltip: true,
            });
            group.children.push({
                type: 'path',
                shape: {
                    pathData: pathDataEnd,
                },
                style: polylineStyle,
                disableTooltip: true,
            });
        }
        return group;
    };
    var index = {
        install: function (registers) {
            registers.registerCustomSeries('lineRange', renderItem);
        },
    };

    return index;

})(echarts);
// Automatically register the custom series
if (typeof window !== 'undefined' && window.echarts) {
  window.echarts.use(window.lineRangeCustomSeriesInstaller);
}
