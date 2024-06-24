document.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram.WebApp;
    const stepCountElement = document.getElementById("step-count");
    const currencyAmountElement = document.getElementById("currency-amount");
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");

    let stepCount = 0;
    let coinCount = 0;
    let accelerometerData = [];
    let samplingRate = 20; // Example sampling rate in Hz
    let isCounting = false;
    let stepDetectionInterval;

    function calculateMagnitude(x, y, z) {
        return Math.sqrt(x * x + y * y + z * z);
    }

    function lowPassFilter(data, alpha = 0.5) {
        let filteredData = [];
        filteredData[0] = data[0];
        for (let i = 1; i < data.length; i++) {
            filteredData[i] = alpha * data[i] + (1 - alpha) * filteredData[i - 1];
        }
        return filteredData;
    }

    function removeMean(data) {
        let mean = data.reduce((a, b) => a + b) / data.length;
        return data.map(d => d - mean);
    }

    function autoCorrelation(data) {
        let n = data.length;
        let result = new Array(n).fill(0);
        for (let lag = 0; lag < n; lag++) {
            for (let i = 0; i < n - lag; i++) {
                result[lag] += data[i] * data[i + lag];
            }
        }
        return result;
    }

    function findFirstZeroCrossing(data) {
        for (let i = 1; i < data.length; i++) {
            if (data[i - 1] > 0 && data[i] <= 0) {
                return i;
            }
        }
        return -1;
    }

    function calculateSteps(data) {
        let magnitudes = data.map(({ x, y, z }) => calculateMagnitude(x, y, z));
        let filteredData = lowPassFilter(magnitudes);
        let centeredData = removeMean(filteredData);
        let autocorr = autoCorrelation(centeredData);
        let firstZeroCrossing = findFirstZeroCrossing(autocorr);

        if (firstZeroCrossing === -1) return 0;

        let stepFrequency = samplingRate / firstZeroCrossing;
        let stepCount = stepFrequency * (data.length / 3) / samplingRate;

        return Math.round(stepCount);
    }

    function updateStepCount(count) {
        stepCountElement.textContent = count;
    }

    function updateCoinCount() {
        currencyAmountElement.textContent = coinCount;
    }

    function handleMotion(event) {
        const { accelerationIncludingGravity } = event;
        const { x, y, z } = accelerationIncludingGravity;
        accelerometerData.push({ x, y, z });

        const maxTuples = samplingRate * 4; // Assuming 4 seconds window
        if (accelerometerData.length > maxTuples) {
            accelerometerData.shift();
        }
    }

    function startCounting() {
        stepCount = 0;
        coinCount = 0;
        accelerometerData = [];
        isCounting = true;
        startButton.style.display = "none";
        stopButton.style.display = "inline-block";

        window.addEventListener("devicemotion", handleMotion);

        stepDetectionInterval = setInterval(() => {
            if (accelerometerData.length > 0) {
                let steps = calculateSteps(accelerometerData);
                stepCount += steps;
                coinCount += steps; // 1 coin per step
                updateStepCount(stepCount);
                updateCoinCount();
            }
        }, 1000); // Update step count every second
    }

    function stopCounting() {
        isCounting = false;
        startButton.style.display = "inline-block";
        stopButton.style.display = "none";

        window.removeEventListener("devicemotion", handleMotion);
        clearInterval(stepDetectionInterval);
    }

    startButton.addEventListener("click", startCounting);
    stopButton.addEventListener("click", stopCounting);

    tg.ready();
});
