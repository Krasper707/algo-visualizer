let initialArray = [];
let frames = [];
let currentFrame = 0;
let isPlaying = false;
let playTimer = null;

const algoInfo = {
    bubble: { time: "O(n²)", space: "O(1)" },
    selection: { time: "O(n²)", space: "O(1)" },
    insertion: { time: "O(n²)", space: "O(1)" },
    merge: { time: "O(n log n)", space: "O(n)" },
    quick: { time: "O(n log n)", space: "O(log n)" },
    heap: { time: "O(n log n)", space: "O(1)" },
    shell: { time: "O(n log n)", space: "O(1)" },
    cocktail: { time: "O(n²)", space: "O(1)" }
};

function updateAlgoInfo() {
    const algo = document.getElementById("algo").value;
    document.getElementById("timeComplexity").innerText = `Time: ${algoInfo[algo].time}`;
    document.getElementById("spaceComplexity").innerText = `Space: ${algoInfo[algo].space}`;
}

function generateRandomArray(size) {
    stopPlayback();
    initialArray = Array.from({ length: size }, () => Math.floor(Math.random() * 500) + 10);
    resetToInitial();
}

function loadCustomArray() {
    const input = document.getElementById("customInput").value;
    const customArr = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (customArr.length > 0) {
        stopPlayback();
        initialArray = customArr;
        resetToInitial();
    }
}

function resetToInitial() {
    frames = [];
    currentFrame = 0;
    document.getElementById("compCount").innerText = "0";
    document.getElementById("swapCount").innerText = "0";
    setButtonsDisabled(true);
    document.getElementById("generateBtn").disabled = false;
    renderArray(initialArray, [], [], []);
}

function renderArray(arr, comparing = [], swapping = [], sorted = []) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    const maxVal = Math.max(...arr, 1);
    const spacing = arr.length > 100 ? 0 : 1;
    let barWidth = (container.clientWidth / arr.length) - (spacing * 2);
    if (barWidth < 1) barWidth = 1;

    arr.forEach((val, i) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${(val / maxVal) * 100}%`;
        bar.style.margin = `0 ${spacing}px`;

        if (comparing.includes(i)) bar.classList.add("comparing");
        if (swapping.includes(i)) bar.classList.add("swapping");
        if (sorted.includes(i)) bar.classList.add("sorted");

        container.appendChild(bar);
    });
}

function setButtonsDisabled(disabled) {
    document.getElementById("playBtn").disabled = disabled;
    document.getElementById("prevBtn").disabled = disabled;
    document.getElementById("nextBtn").disabled = disabled;
    document.getElementById("resetBtn").disabled = disabled;
}

function togglePlay() {
    isPlaying = !isPlaying;
    const playBtn = document.getElementById("playBtn");
    if (isPlaying) {
        if (currentFrame >= frames.length - 1) currentFrame = 0;
        playBtn.innerText = "⏸ Pause";
        playBtn.classList.add("playing");
        playLoop();
    } else {
        stopPlayback();
    }
}

function stopPlayback() {
    isPlaying = false;
    clearTimeout(playTimer);
    const playBtn = document.getElementById("playBtn");
    playBtn.innerText = "▶ Play";
    playBtn.classList.remove("playing");
}

function playLoop() {
    if (!isPlaying) return;
    if (currentFrame < frames.length - 1) {
        stepForward();
        const speed = 201 - document.getElementById("speed").value;
        playTimer = setTimeout(playLoop, speed);
    } else {
        stopPlayback();
    }
}

function stepForward() {
    if (currentFrame < frames.length - 1) {
        currentFrame++;
        drawCurrentFrame();
    }
}

function stepBack() {
    if (currentFrame > 0) {
        currentFrame--;
        drawCurrentFrame();
    }
}

function resetPlayback() {
    stopPlayback();
    currentFrame = 0;
    drawCurrentFrame();
}

function drawCurrentFrame() {
    if (!frames[currentFrame]) return;
    const frame = frames[currentFrame];
    renderArray(frame.arr, frame.comp, frame.swap, frame.sorted);
    document.getElementById("compCount").innerText = frame.comps;
    document.getElementById("swapCount").innerText = frame.swaps;
}

function addFrame(arr, comp, swap, sorted, comps, swaps) {
    frames.push({
        arr: [...arr],
        comp: [...comp],
        swap: [...swap],
        sorted: [...sorted],
        comps: comps,
        swaps: swaps
    });
}

function initSort() {
    if (initialArray.length === 0) return;
    document.getElementById("generateBtn").disabled = true;
    frames = [];
    currentFrame = 0;
    
    const algo = document.getElementById("algo").value;
    const arr = [...initialArray];
    
    if (algo === "bubble") bubbleSortGen(arr);
    if (algo === "selection") selectionSortGen(arr);
    if (algo === "insertion") insertionSortGen(arr);
    if (algo === "merge") mergeSortGen(arr);
    if (algo === "quick") quickSortGen(arr);
    if (algo === "heap") heapSortGen(arr);
    if (algo === "shell") shellSortGen(arr);
    if (algo === "cocktail") cocktailSortGen(arr);

    addFrame(arr, [], [], Array.from(arr.keys()), frames[frames.length-1]?.comps || 0, frames[frames.length-1]?.swaps || 0);
    
    setButtonsDisabled(false);
    document.getElementById("generateBtn").disabled = false;
    togglePlay();
}

function bubbleSortGen(arr) {
    let comps = 0, swaps = 0;
    let sorted = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            comps++;
            addFrame(arr, [j, j + 1], [], sorted, comps, swaps);
            if (arr[j] > arr[j + 1]) {
                swaps++;
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                addFrame(arr, [], [j, j + 1], sorted, comps, swaps);
            }
        }
        sorted.push(arr.length - 1 - i);
    }
}

function selectionSortGen(arr) {
    let comps = 0, swaps = 0;
    let sorted = [];
    for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            comps++;
            addFrame(arr, [min, j], [], sorted, comps, swaps);
            if (arr[j] < arr[min]) min = j;
        }
        if (min !== i) {
            swaps++;
            [arr[i], arr[min]] = [arr[min], arr[i]];
            addFrame(arr, [], [i, min], sorted, comps, swaps);
        }
        sorted.push(i);
    }
}

function insertionSortGen(arr) {
    let comps = 0, swaps = 0;
    let sorted = [0];
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        addFrame(arr, [i], [], sorted, comps, swaps);
        while (j >= 0) {
            comps++;
            addFrame(arr, [j, j + 1], [], sorted, comps, swaps);
            if (arr[j] > key) {
                swaps++;
                arr[j + 1] = arr[j];
                addFrame(arr, [], [j, j + 1], sorted, comps, swaps);
                j--;
            } else break;
        }
        swaps++;
        arr[j + 1] = key;
        sorted.push(i);
        addFrame(arr, [], [j + 1], sorted, comps, swaps);
    }
}

function mergeSortGen(arr) {
    let comps = 0, swaps = 0;
    function merge(l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = new Array(n1), R = new Array(n2);
        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            comps++;
            addFrame(arr, [l + i, m + 1 + j], [], [], comps, swaps);
            if (L[i] <= R[j]) {
                swaps++;
                arr[k] = L[i];
                i++;
            } else {
                swaps++;
                arr[k] = R[j];
                j++;
            }
            addFrame(arr, [], [k], [], comps, swaps);
            k++;
        }
        while (i < n1) { swaps++; arr[k] = L[i]; addFrame(arr, [], [k], [], comps, swaps); i++; k++; }
        while (j < n2) { swaps++; arr[k] = R[j]; addFrame(arr, [], [k], [], comps, swaps); j++; k++; }
    }
    function sort(l, r) {
        if (l >= r) return;
        let m = l + Math.floor((r - l) / 2);
        sort(l, m);
        sort(m + 1, r);
        merge(l, m, r);
    }
    sort(0, arr.length - 1);
}

function quickSortGen(arr) {
    let comps = 0, swaps = 0;
    function partition(low, high) {
        let pivot = arr[high];
        let i = low - 1;
        for (let j = low; j <= high - 1; j++) {
            comps++;
            addFrame(arr, [j, high], [], [], comps, swaps);
            if (arr[j] < pivot) {
                i++;
                swaps++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                addFrame(arr, [], [i, j], [], comps, swaps);
            }
        }
        swaps++;
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        addFrame(arr, [], [i + 1, high], [], comps, swaps);
        return i + 1;
    }
    function sort(low, high) {
        if (low < high) {
            let pi = partition(low, high);
            sort(low, pi - 1);
            sort(pi + 1, high);
        }
    }
    sort(0, arr.length - 1);
}

function heapSortGen(arr) {
    let comps = 0, swaps = 0;
    let sorted = [];
    function heapify(n, i) {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;
        if (l < n) {
            comps++;
            addFrame(arr, [l, largest], [], sorted, comps, swaps);
            if (arr[l] > arr[largest]) largest = l;
        }
        if (r < n) {
            comps++;
            addFrame(arr, [r, largest], [], sorted, comps, swaps);
            if (arr[r] > arr[largest]) largest = r;
        }
        if (largest !== i) {
            swaps++;
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            addFrame(arr, [], [i, largest], sorted, comps, swaps);
            heapify(n, largest);
        }
    }
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapify(arr.length, i);
    for (let i = arr.length - 1; i > 0; i--) {
        swaps++;
        [arr[0], arr[i]] = [arr[i], arr[0]];
        sorted.push(i);
        addFrame(arr, [], [0, i], sorted, comps, swaps);
        heapify(i, 0);
    }
    sorted.push(0);
}

function shellSortGen(arr) {
    let comps = 0, swaps = 0;
    let n = arr.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;
            addFrame(arr, [i], [], [], comps, swaps);
            for (j = i; j >= gap; j -= gap) {
                comps++;
                addFrame(arr, [j - gap, i], [], [], comps, swaps);
                if (arr[j - gap] > temp) {
                    swaps++;
                    arr[j] = arr[j - gap];
                    addFrame(arr, [], [j, j - gap], [], comps, swaps);
                } else break;
            }
            swaps++;
            arr[j] = temp;
            addFrame(arr, [], [j], [], comps, swaps);
        }
    }
}

function cocktailSortGen(arr) {
    let comps = 0, swaps = 0;
    let sorted = [];
    let swapped = true;
    let start = 0;
    let end = arr.length - 1;
    while (swapped) {
        swapped = false;
        for (let i = start; i < end; ++i) {
            comps++;
            addFrame(arr, [i, i + 1], [], sorted, comps, swaps);
            if (arr[i] > arr[i + 1]) {
                swaps++;
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                addFrame(arr, [], [i, i + 1], sorted, comps, swaps);
                swapped = true;
            }
        }
        if (!swapped) break;
        sorted.push(end);
        swapped = false;
        end--;
        for (let i = end - 1; i >= start; i--) {
            comps++;
            addFrame(arr, [i, i + 1], [], sorted, comps, swaps);
            if (arr[i] > arr[i + 1]) {
                swaps++;
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                addFrame(arr, [], [i, i + 1], sorted, comps, swaps);
                swapped = true;
            }
        }
        sorted.push(start);
        start++;
    }
}

generateRandomArray(40);
updateAlgoInfo();