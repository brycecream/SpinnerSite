// Get references to the canvas, context, spin button, input textarea, spin time range, and spin time value
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const inputTextarea = document.getElementById('inputTextarea');
const spinTimeRange = document.getElementById('spinTimeRange');
const spinTimeValue = document.getElementById('spinTimeValue');
const backgroundMusic = document.getElementById('backgroundMusic');
const soundEffect = document.getElementById('soundEffect');
const modal = document.getElementById('winnerModal');
const closeModal = document.getElementById('closeModal');



// Array to store segment colors
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
let segments = []; // Array to store the text segments

// Function to set canvas size based on screen size
function setCanvasSize() {
    canvas.width = window.innerWidth * 0.9; // Adjust the factor as needed
    canvas.height = window.innerHeight * 0.8; // Adjust the factor as needed
    drawWheel(); // Redraw the wheel when canvas size changes
}

// Set initial canvas size
setCanvasSize();

// Function to draw the wheel segments
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = Math.min(canvas.width, canvas.height) / 2 * 0.8; // Adjust factor for size
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let startAngle = 0;

    // Set minimum and maximum text sizes
    const minTextSize = 15; // Minimum text size
    const maxTextSize = 100; // Maximum text size

    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + (Math.PI * 2) / segments.length);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        // Calculate dynamic text size based on segment size
        const segmentAngle = (Math.PI * 2) / segments.length;
        const textAngle = startAngle + segmentAngle / 2;
        const textX = centerX + Math.cos(textAngle) * radius * 0.6;
        const textY = centerY + Math.sin(textAngle) * radius * 0.6;
        
        // Calculate text size based on segment size
        const text = segments[i];
        let textSize = Math.min(maxTextSize, (radius * segmentAngle * 0.4) / text.length); // Adjust the factor as needed
        textSize = Math.max(minTextSize, textSize); // Ensure it doesn't become too small

        // Draw segment text
        ctx.fillStyle = '#000';
        ctx.font = `bold ${textSize}px Arial`; // Set the dynamic font size
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, textX, textY);

        startAngle += segmentAngle;
    }
}

// Function to spin the wheel
function spinWheel() {
    let angle = 0;
    let spinTime = 0;
    let startSpinTime;
    const spins = Math.random() * 5 + 5; // Random number of full spins
    const totalSpinTime = parseFloat(spinTimeRange.value) * 1000; // Spin time in milliseconds

    function spinWheelFrame(timestamp) {
        if (!startSpinTime) {
            startSpinTime = timestamp;
        }

        spinTime = timestamp - startSpinTime;
        const progress = spinTime / totalSpinTime;
        const deceleration = 1 - (1 / (1 + progress * 4)); // Creates a slowing effect

        angle = (spins * Math.PI * 2) * deceleration; // Full spins * slowing effect

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        drawWheel();
        ctx.restore();

        if (spinTime < totalSpinTime) {
            requestAnimationFrame(spinWheelFrame);
        } else {
            // Determine the winning segment and display a message
            const adjustedAngle = angle + Math.PI / 2; // Adjust for the 12 o'clock position
            const winningSegmentIndex = Math.floor((adjustedAngle % (2 * Math.PI)) / (2 * Math.PI / segments.length));
            const winner = segments[segments.length - 1 - winningSegmentIndex];

            // Display the winner in the modal
            document.getElementById('winnerMessage').textContent = `Winner is: ${winner}`;
            document.getElementById('winnerModal').style.display = 'block';
            spinButton.disabled = false;
        }
    }

    requestAnimationFrame(spinWheelFrame);
}

// Event listener for input changes in the textarea
inputTextarea.addEventListener('input', () => {
    const inputLines = inputTextarea.value.trim().split('\n');
    segments = inputLines.filter(line => line.trim() !== ''); // Update segments array
    drawWheel(); // Redraw the wheel with updated segments
});

// Event listener for the spin button click
spinButton.addEventListener('click', () => {
    if (segments.length > 0) {
        spinButton.disabled = true;
        spinWheel();
    } else {
        alert('Please add at least one segment.');
    }
});

// Event listener for the spin time range input
spinTimeRange.addEventListener('input', () => {
    spinTimeValue.textContent = spinTimeRange.value;
});

// Initial draw to show empty wheel
drawWheel();

// Event listener for window resize
window.addEventListener('resize', setCanvasSize);

// Get references to the nav button and nav element
const navButton = document.querySelector('.navButton');
const nav = document.querySelector('nav');

// Function to toggle the navigation menu display
function toggleNav() {
    nav.classList.toggle('show');
}


// Add event listener to the Spin button
spinButton.addEventListener('click', () => {
    // Play the background music
    backgroundMusic.play();
    
    // Get the selected spin time from the range input
    const selectedTime = parseInt(spinTimeRange.value, 10) * 1000; // Convert to milliseconds
    
    // Stop the music after the selected spin time
    setTimeout(() => {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reset to the beginning
        
        // Play the sound effect once
        soundEffect.play();
    }, selectedTime);
});

// When the user clicks on the close button, close the modal
closeModal.onclick = () => {
    modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = event => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

document.getElementById('deleteSegmentButton').addEventListener('click', () => {
    const winnerMessage = document.getElementById('winnerMessage').textContent;
    const winner = winnerMessage.replace('Winner is: ', '');
    
    // Filter out all segments with the same content as the winner
    segments = segments.filter(segment => segment !== winner);

    drawWheel(); // Redraw the wheel with updated segments
    document.getElementById('winnerModal').style.display = 'none'; // Close the modal

    // Update the input textarea
    document.getElementById('inputTextarea').value = segments.join('\n');
});

let isMuted = false;

function toggleMute() {
    isMuted = !isMuted;

    // Update the mute image based on the mute state
    const muteImage = document.getElementById('muteImage');
    muteImage.src = isMuted ? 'mute.png' : 'sound.png';

    // Toggle mute on both the music and sound effect elements
    backgroundMusic.muted = isMuted;
    soundEffect.muted = isMuted;
}










  
  
  
  
  