const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const inputTextarea = document.getElementById('inputTextarea');
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
let segments = [];

// Function to set canvas size based on screen size
function setCanvasSize() {
    canvas.width = window.innerWidth * 0.8; // Adjust the factor as needed
    canvas.height = window.innerHeight * 0.6; // Adjust the factor as needed
    drawWheel(); // Redraw the wheel when canvas size changes
}

// Set initial canvas size
setCanvasSize();


function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = Math.min(canvas.width, canvas.height) / 2 * 0.8; // Adjust factor for size
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let startAngle = 0;

    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + (Math.PI * 2) / segments.length);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        // Draw segment text
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textAngle = startAngle + (Math.PI * 2) / segments.length / 2;
        const textX = centerX + Math.cos(textAngle) * radius * 0.6; // Adjust factor for text position
        const textY = centerY + Math.sin(textAngle) * radius * 0.6; // Adjust factor for text position
        ctx.fillText(segments[i], textX, textY);

        startAngle += (Math.PI * 2) / segments.length;
    }

    
}

function spinWheel() {
    let angle = 0;
    let spinTime = 0;
    let startSpinTime;
    const spins = Math.random() * 5 + 5; // Random number of full spins
    const totalSpinTime = 3000 + Math.random() * 2000; // Random total time for spin

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
            const adjustedAngle = angle + Math.PI / 2; // Adjust for the 12 o'clock position
            const winningSegmentIndex = Math.floor((adjustedAngle % (2 * Math.PI)) / (2 * Math.PI / segments.length));
            const winner = segments[segments.length - 1 - winningSegmentIndex];
            alert(`Winner is: ${winner}`);
            spinButton.disabled = false;
        }
    }

    requestAnimationFrame(spinWheelFrame);
}

inputTextarea.addEventListener('input', () => {
    const inputLines = inputTextarea.value.trim().split('\n');
    segments = inputLines.filter(line => line.trim() !== '');
    drawWheel();
});

spinButton.addEventListener('click', () => {
    if (segments.length > 0) {
        spinButton.disabled = true;
        spinWheel();
    } else {
        alert('Please add at least one segment.');
    }
});


// Initial draw to show empty wheel
drawWheel();
window.addEventListener('resize', setCanvasSize);

//navigation scripts

function toggleNav() {
    var nav = document.querySelector('nav');
    nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
}

