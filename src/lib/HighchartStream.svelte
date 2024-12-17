<script lang="ts">
    import Highcharts from "highcharts";
    import type { Options, Point, SeriesOptionsType } from "highcharts";
    import { gaussianNoise, randomNoiseGenerator } from "$lib/noise_generator";
    import { generateRandomHexColor, lowPassGenerator, getDeltaTime, getFPS } from "$lib/util";
    import { onDestroy, onMount } from "svelte";
    import type { HexColor } from "./types";
    import type { StatefulGenerator } from "./StatefulGenerator";

    // Component args
    export let chartTitle: string = "Chart";
    export let dataPoints: number = 100;

    export let seriesArgs: SeriesParameters[] = [{ seriesName: "Update Hz", generator: randomNoiseGenerator() }];
    export let extremes: [number, number] | undefined = undefined;
    export let updateInterval = 100;

    let chartContainer: HTMLElement;

    interface SeriesParameters {
        seriesName: string;
        generator: Generator<number, never, unknown> | StatefulGenerator;
        color?: HexColor;
        lineWidth?: number;
    }

    const options = {
        chart: {
            type: "line",
            backgroundColor: "#f4f4f4",
            borderRadius: 10,
            animation: false,
            panning: false,
            pinchType: null,
            zoomType: null,
            mouseTracking: false,
        },
        title: {
            text: chartTitle,
            style: {
                color: "#333",
                fontSize: "24px",
                fontWeight: "bold",
            },
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            enabled: false,
        },
        xAxis: {
            crosshair: false,
            tickLength: 0,
            labels: {
                enabled: false,
            },
        },
        yAxis: {},
        plotOptions: {
            line: {
                lineWidth: 1,
                marker: {
                    enabled: false,
                },
            },
            series: {
                enableMouseTracking: false,
                states: {
                    hover: {
                        enabled: false,
                    },
                },
            },
        },
        accessibility: {
            enabled: false,
        },
    };

    export function getUpdateRate() {}

    onMount(() => {
        if (chartContainer) {
            let chart = Highcharts.chart(chartContainer, options as any);

            fillParameters();
            initializeSeries(chart);

            let update = setInterval(() => {
                updateSeries(chart);
            }, updateInterval);

            return () => {
                clearInterval(update);
            };
        }
    });

    function fillParameters() {}

    function initializeSeries(chart: Highcharts.Chart) {
        if (extremes) chart.yAxis[0].setExtremes(extremes[0], extremes[1]);

        for (let seriesParameters of seriesArgs) {
            chart.addSeries({
                name: seriesParameters.seriesName,
                lineWidth: seriesParameters.lineWidth ?? 3,
                data: new Array(dataPoints).fill(0),
                color: seriesParameters.color ?? generateRandomHexColor(),
            } as SeriesOptionsType);
        }
    }

    function updateSeries(chart: Highcharts.Chart) {
        chart.series.forEach((series, i) => {
            const generatorValue = seriesArgs[i].generator.next().value;

            series.addPoint(generatorValue, false, true);
        });

        chart.redraw();
    }
</script>

<div bind:this={chartContainer} style="width: 400px; height: 300px;"></div>

<style>
    div {
        border-style: solid;
        border-width: 2px;
    }
</style>
