# Sorting Visualizer

A web-based tool to visualize various sorting algorithms in real-time. This application allows users to see how different algorithms manipulate data structures to achieve a sorted state, featuring adjustable speeds and support for custom datasets.

## Features

- **Multiple Algorithms**:
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Merge Sort
  - Quick Sort
  - Heap Sort
  - Shell Sort
  - Cocktail Shaker Sort
  - Bogo Sort (Randomized)
- **Custom Input**: Enter your own numbers separated by commas to see how the algorithms handle specific data.
- **Dynamic Scaling**: The interface automatically adjusts bar widths and heights based on the size and values of the input array.
- **Responsive Design**: Handles large datasets (up to 500+ elements) with performance optimizations.
- **Color Coding**: Visual cues for comparisons (yellow), swaps (red), and sorted elements (green).
- **Speed Control**: Adjust the visualization speed in real-time.

## Live Demo

You can deploy this project easily on Vercel or GitHub Pages by uploading the `index.html`, `style.css`, and `script.js` files.

## How to Use

1. **Random Array**: Click the "Random" button to generate a standard set of data.
2. **Massive Array**: Click "Massive" to test the visualizer's performance with 300 elements.
3. **Custom Data**: Type numbers into the input field (e.g., `10, 45, 2, 80`) and click "Load Data".
4. **Select Algorithm**: Choose an algorithm from the dropdown menu.
5. **Adjust Speed**: Use the slider to speed up or slow down the animation.
6. **Start**: Click "Start" to begin the visualization.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
