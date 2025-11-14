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

this.segmentedDoughnutCustomSeriesInstaller = (function (echarts) {
    'use strict';

    var renderItem = function (params, api) {
        var group = [];
        var itemPayload = params.itemPayload;
        var segmentCount = Math.max(1, itemPayload.segmentCount || 1);
        var value = Math.max(0, api.value(0) || 0);
        var center = itemPayload.center || ['50%', '50%'];
        var radius = itemPayload.radius || ['50%', '60%'];
        var width = api.getWidth();
        var height = api.getHeight();
        var size = Math.min(width, height);
        var cx = echarts.number.parsePercent(center[0], api.getWidth());
        var cy = echarts.number.parsePercent(center[1], api.getHeight());
        var r = echarts.number.parsePercent(radius[1], size / 2);
        var r0 = echarts.number.parsePercent(radius[0], size / 2);
        var padAngle = ((echarts.zrUtil.retrieve2(itemPayload.padAngle, 2) || 0) * Math.PI) / 180;
        var pieceAngle = (Math.PI * 2 - padAngle * segmentCount) / segmentCount;
        var backgroundGroup = {
            type: 'group',
            children: [],
        };
        group.push(backgroundGroup);
        var bgStyle = itemPayload.backgroundStyle || {};
        var showBackground = bgStyle.show !== false;
        var backgroundStyle = {
            fill: bgStyle.color || 'rgba(180, 180, 180, 0.2)',
            stroke: bgStyle.borderColor || 'none',
            lineWidth: bgStyle.borderWidth || 0,
            lineType: bgStyle.borderType || 'solid',
            opacity: bgStyle.opacity || 1,
            shadowBlur: bgStyle.shadowBlur || 0,
            shadowColor: bgStyle.shadowColor || 'rgba(0, 0, 0, 0)',
            shadowOffsetX: bgStyle.shadowOffsetX || 0,
            shadowOffsetY: bgStyle.shadowOffsetY || 0,
        };
        var itemGroup = {
            type: 'group',
            children: [],
        };
        group.push(itemGroup);
        var itemStyle = api.style();
        var itemStyleEmphasis = api.styleEmphasis();
        var startAngle = -Math.PI / 2;
        var cornerRadius = (r - r0) / 2;
        for (var i = 0; i < segmentCount; ++i) {
            var sAngle = startAngle + (pieceAngle + padAngle) * i;
            var eAngle = startAngle + (pieceAngle + padAngle) * i + pieceAngle;
            if (showBackground) {
                backgroundGroup.children.push({
                    type: 'sector',
                    shape: {
                        cx: cx,
                        cy: cy,
                        r0: r0,
                        r: r,
                        cornerRadius: cornerRadius,
                        startAngle: sAngle,
                        endAngle: eAngle,
                        clockwise: true,
                    },
                    style: backgroundStyle,
                    silent: true,
                });
            }
            if (i < value) {
                itemGroup.children.push({
                    type: 'sector',
                    shape: {
                        cx: cx,
                        cy: cy,
                        r0: r0,
                        r: r,
                        cornerRadius: cornerRadius,
                        startAngle: sAngle,
                        endAngle: eAngle,
                        clockwise: true,
                    },
                    style: itemStyle,
                    styleEmphasis: itemStyleEmphasis,
                });
            }
        }
        var label = itemPayload.label;
        var labelEl;
        if (label && label.show) {
            var text = echarts.format.formatTpl(label.formatter || '{c}/{b}', {
                $vars: ['seriesName', 'b', 'c', 'd'],
                seriesName: params.seriesName,
                b: segmentCount,
                c: value,
                d: Math.round((value / segmentCount) * 100) + '%',
            });
            labelEl = {
                type: 'text',
                style: {
                    text: text,
                    fontSize: label.fontSize || 12,
                    fill: label.color || '#000',
                    textAlign: 'center',
                    textVerticalAlign: 'middle',
                },
                x: cx,
                y: cy,
            };
            group.push(labelEl);
        }
        return {
            type: 'group',
            children: group,
        };
    };
    var index = {
        install: function (registers) {
            registers.registerCustomSeries('segmentedDoughnut', renderItem);
        },
    };

    return index;

})(echarts);
// Automatically register the custom series
if (typeof window !== 'undefined' && window.echarts) {
  window.echarts.use(window.segmentedDoughnutCustomSeriesInstaller);
}
