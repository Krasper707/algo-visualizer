let array = [];
const container = document.getElementById("container");

function generateRandomArray(size) {
    let randArr = Array.from({ length: size }, () => Math.floor(Math.random() * 500) + 10);
    renderArray(randArr);
}

function loadCustomArray() {
    const input = document.getElementById("customInput").value;
    const customArr = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (customArr.length > 0) renderArray(customArr);
}

function renderArray(newArray) {
    array = [...newArray];
    container.innerHTML = "";
    const containerWidth = container.clientWidth;
    const total = array.length;
    const maxVal = Math.max(...array);
    const spacing = total > 150 ? 0 : 1;
    let barWidth = (containerWidth / total) - (spacing * 2);
    if (barWidth < 1) barWidth = 1;

    array.forEach((val, i) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${(val / maxVal) * 100}%`;
        bar.style.margin = `0 ${spacing}px`;
        if (total > 100) bar.style.transition = "none";
        bar.setAttribute("id", `bar-${i}`);
        container.appendChild(bar);
    });
}

const sleep = () => {
    const speed = document.getElementById("speed").value;
    return new Promise(resolve => setTimeout(resolve, 201 - speed));
};

async function updateBar(idx, val) {
    array[idx] = val;
    const bar = document.getElementById(`bar-${idx}`);
    if (bar) {
        const maxVal = Math.max(...array);
        bar.style.height = `${(val / maxVal) * 100}%`;
    }
}

async function mark(idx, cls) {
    const bar = document.getElementById(`bar-${idx}`);
    if (bar) bar.className = `bar ${cls}`;
}

async function bubbleSort() {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await mark(j, 'swapping');
                let temp = array[j];
                await updateBar(j, array[j + 1]);
                await updateBar(j + 1, temp);
                await sleep();
                await mark(j, '');
            }
        }
        await mark(array.length - i - 1, 'sorted');
    }
}

async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let min = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[min]) min = j;
        }
        let temp = array[i];
        await updateBar(i, array[min]);
        await updateBar(min, temp);
        await mark(i, 'sorted');
        await sleep();
    }
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            await updateBar(j + 1, array[j]);
            j--;
            await sleep();
        }
        await updateBar(j + 1, key);
        await mark(i, 'sorted');
    }
}

async function quickSort(start = 0, end = array.length - 1) {
    if (start >= end) return;
    let pivot = array[end];
    let i = start;
    for (let j = start; j < end; j++) {
        if (array[j] < pivot) {
            let temp = array[i];
            await updateBar(i, array[j]);
            await updateBar(j, temp);
            i++;
            await sleep();
        }
    }
    let temp = array[i];
    await updateBar(i, array[end]);
    await updateBar(end, temp);
    await quickSort(start, i - 1);
    await quickSort(i + 1, end);
}

async function mergeSort(l = 0, r = array.length - 1) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    let i = l, j = m + 1, temp = [];
    while (i <= m && j <= r) {
        if (array[i] < array[j]) temp.push(array[i++]);
        else temp.push(array[j++]);
    }
    while (i <= m) temp.push(array[i++]);
    while (j <= r) temp.push(array[j++]);
    for (let k = 0; k < temp.length; k++) {
        await updateBar(l + k, temp[k]);
        await sleep();
    }
}

async function heapSort() {
    let n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
    for (let i = n - 1; i > 0; i--) {
        let temp = array[0];
        await updateBar(0, array[i]);
        await updateBar(i, temp);
        await heapify(i, 0);
        await sleep();
    }
}

async function heapify(n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    if (l < n && array[l] > array[largest]) largest = l;
    if (r < n && array[r] > array[largest]) largest = r;
    if (largest != i) {
        let temp = array[i];
        await updateBar(i, array[largest]);
        await updateBar(largest, temp);
        await heapify(n, largest);
    }
}

async function shellSort() {
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                await updateBar(j, array[j - gap]);
                await sleep();
            }
            await updateBar(j, temp);
        }
    }
}

async function cocktailSort() {
    let swapped = true;
    let start = 0, end = array.length - 1;
    while (swapped) {
        swapped = false;
        for (let i = start; i < end; ++i) {
            if (array[i] > array[i + 1]) {
                let temp = array[i];
                await updateBar(i, array[i + 1]);
                await updateBar(i + 1, temp);
                swapped = true;
                await sleep();
            }
        }
        if (!swapped) break;
        swapped = false;
        end--;
        for (let i = end - 1; i >= start; i--) {
            if (array[i] > array[i + 1]) {
                let temp = array[i];
                await updateBar(i, array[i + 1]);
                await updateBar(i + 1, temp);
                swapped = true;
                await sleep();
            }
        }
        start++;
    }
}

async function bogoSort() {
    const isSorted = (arr) => arr.every((v, i) => i === 0 || v >= arr[i - 1]);
    while (!isSorted(array)) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            await updateBar(i, array[j]);
            await updateBar(j, temp);
        }
        await sleep();
    }
}

async function startSort() {
    const algo = document.getElementById("algo").value;
    const btn = document.getElementById("startBtn");
    btn.disabled = true;

    if (algo === "bubble") await bubbleSort();
    else if (algo === "selection") await selectionSort();
    else if (algo === "insertion") await insertionSort();
    else if (algo === "merge") await mergeSort();
    else if (algo === "quick") await quickSort();
    else if (algo === "heap") await heapSort();
    else if (algo === "shell") await shellSort();
    else if (algo === "cocktail") await cocktailSort();
    else if (algo === "bogo") await bogoSort();

    document.querySelectorAll(".bar").forEach(b => b.classList.add("sorted"));
    btn.disabled = false;
}

generateRandomArray(40);