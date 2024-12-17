<script lang="ts">
    import Chart from "$lib/HighchartStream.svelte";
    import { IMUNoiseGenerator } from "$lib/noise_generator";
    import { StatefulGenerator } from "$lib/StatefulGenerator";
    import ThreeScene from "$lib/ThreeScene.svelte";
    import { lowPassGenerator, getFPS, highPassGenerator, highPassFilter, lowPassFilter } from "$lib/util";

    const getUpdateRate = new StatefulGenerator(getFPS());
    const zAxisNoise = new StatefulGenerator(IMUNoiseGenerator(5, 0.5, 0.01));
</script>

<main>
    <!-- <div>
        <ThreeScene />
    </div> -->
    <div class="charts-container">
        <Chart
            updateInterval={100}
            chartTitle={"Update Rate"}
            seriesArgs={[
                { seriesName: "Low pass filter Update Hz", generator: lowPassFilter(250, 0.01, getUpdateRate) },
                { seriesName: "Raw Update Hz", generator: getUpdateRate },
            ]}
        />

        <Chart
            chartTitle={"Gyro readings"}
            seriesArgs={[
                { seriesName: "High pass filter", generator: highPassFilter(0, 0.9, zAxisNoise) },
                { seriesName: "Low pass filter", generator: lowPassFilter(0, 0.01, zAxisNoise) },
                { seriesName: "Raw", generator: zAxisNoise },
            ]}
        />

        <Chart chartTitle={"Z axis Gyro"} seriesArgs={[{ seriesName: "Z", generator: IMUNoiseGenerator(5, 0.5, 0.01) }]} />
    </div>
</main>

<style>
    .charts-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
