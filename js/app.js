

function load() {
  let isAllLoaded = true;

  let image = localStorage.getItem("idBillede");
  if(image != null) {
    document.getElementById("idBillede").style.backgroundImage = `url(${image})`;
  } else {
    isAllLoaded = false;
  }

  let name = localStorage.getItem("name");
  if(name != null) {
    document.getElementById("textName").textContent  = name;
  } else {
    isAllLoaded = false;
  }

  let birthDayTekst = localStorage.getItem("birthday");
  if(birthDayTekst != null) {
    document.getElementById("textBirthday").textContent  = birthDayTekst;
  } else {
    isAllLoaded = false;
  }

  let alderTekst = localStorage.getItem("alder");
  if(alderTekst != null) {
    document.getElementById("textAlder").textContent  = alderTekst;
  } else {
    isAllLoaded = false;
  }

  let kortNr = localStorage.getItem("kortNr");
  if(alderTekst != null) {
    document.getElementById("textKortNr").textContent  = kortNr;
  } else {
    isAllLoaded = false;
  }
  
  if(!isAllLoaded) {
    document.getElementById('setupButton').style.display = "block"
  }

}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}

// Disable orientation change
window.addEventListener("orientationchange", function() {
    if (window.orientation !== 0) {
        // Change orientation back to portrait mode
        window.orientation = 0;
    }
});

function drawSineWave(originY, context, canvas) {
  // Set the amplitude and frequency of the sine wave
  amplitude = 1.8;
  frequency = 0.2; // Adjust this value to control the number of cycles

  context.strokeStyle = "#f0afde";
  context.globalAlpha = 0.5;
  context.lineWidth = 0.4; // Adjust this value to make the line thinner

  context.moveTo(0,originY)
  for (let x = 0; x < canvas.width; x++) {
    y = originY + amplitude * Math.sin(frequency * x);
    context.lineTo(x, y);
  }
}

function drawSineWaves() {
  // Get the canvas element and its context
  canvas = document.getElementById("mainCanvas");
  context = canvas.getContext("2d");

  devicePixelRatio = window.devicePixelRatio || 1;
  backingStoreRatio = (
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1
  );

  ratio = devicePixelRatio / backingStoreRatio;

  // Set canvas dimensions
  canvas.width = canvas.parentElement.clientWidth * ratio;
  canvas.height = canvas.parentElement.clientHeight * ratio;

  // Scale the context
  context.scale(ratio, ratio);

  context.beginPath();

  for (let y = 6; y < canvas.height; y += 5) {
    drawSineWave(y, context, canvas)
  }
  context.stroke();
}

function setCurrentDate() {
    var currentDate = new Date();

    // Get the element where you want to display the date
    var currentDateElement = document.getElementById("currentDate");
    
    // Format the date as desired: "26. august 2023 kl. 18.04"
    var options = {
      day: '2-digit',    // 2-digit day (e.g., 26)
      month: 'long',     // Month's full name (e.g., august)
      year: 'numeric',   // 4-digit year (e.g., 2023)
      hour: '2-digit',   // 2-digit hour (e.g., 18)
      minute: '2-digit', // 2-digit minute (e.g., 04)
      hour12: false     // Use 24-hour time format
    };
    
    var formattedDate = currentDate.toLocaleDateString('en-DK', options);
    formattedDate = formattedDate.replace('at', ' kl.'); // Replace comma with "kl."
  
    // Set the formatted date as the content of the HTML element
    currentDateElement.innerHTML = "<b>Sidst opdateret:</b> " + formattedDate;
}

function setupWatermark() {
  const canvas = document.getElementById('watermark-canvas');
  const ctx = canvas.getContext('2d');


    // Define the start and end colors as arrays of RGBA values
  const startColor = [255, 170, 195, 255]; // RGBA values for the start color
  const currentColor = [0, 160, 207, 255];
  const endColor = [195, 177, 229, 255];    // RGBA values for the end color

  // Duration of the fading transition in milliseconds
  const transitionDuration = 10000; // 1 second

  // Number of steps or frames to achieve the transition
  const numSteps = 60; // Adjust this value for smoother or faster transitions

  // Calculate the step size for each channel (R, G, B, A)
  const stepSize = [];
  for (let i = 0; i < 4; i++) {
      stepSize[i] = (endColor[i] - startColor[i]) / numSteps;
  }

  // Function to perform the color fading transition
  function fadeColors(currentStep) {
      // Calculate the current color values using linear interpolation
      for (let i = 0; i < 4; i++) {
          currentColor[i] = Math.round(startColor[i] + stepSize[i] * currentStep);
      }
  }

  function startColorTransition() {
    let currentStep = 0;
    let direction = 1; // 1 for forward, -1 for backward
    const timeInterval = transitionDuration / numSteps;

    const intervalId = setInterval(() => {
        fadeColors(currentStep, direction);

        currentStep += direction;
        if (currentStep >= numSteps || currentStep <= 0) {
            direction *= -1; // Change direction when reaching endpoints
        }

        if (currentStep <= 0) {
            clearInterval(intervalId);
        }
    }, timeInterval);
  }
  // Start the fading transition 
  startColorTransition();

  const image = new Image();
  image.src = 'images/R7.png';

  const gradientColors = [
    startColor,
    currentColor,
    endColor
    // You can add more colors to the gradient
  ];

  let gradientAngleDegrees = 0;
  const gradientStep = 1 / (gradientColors.length - 1);

  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;

    function drawRotatedGradient() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (r === 0 && g === 0 && b === 0 && a !== 0) {
          const pixelPosition = (i / data.length); // Normalized pixel position

          // Calculate rotated gradient position
          const rotatedPixelPositionX = (pixelPosition - 0.5) * Math.cos(gradientAngleDegrees) + 0.5;
          const rotatedPixelPositionY = (pixelPosition - 0.5) * Math.sin(gradientAngleDegrees) + 0.5;

          const rotatedGradientPosition = rotatedPixelPositionX / gradientStep;

          const colorIndex1 = Math.floor(rotatedGradientPosition);
          const colorIndex2 = Math.min(colorIndex1 + 1, gradientColors.length - 1);
          const alpha = rotatedGradientPosition % 1;

          const color1 = gradientColors[colorIndex1];
          const color2 = gradientColors[colorIndex2];

          // Interpolate colors
          const interpolatedColor = color1.map((channel, idx) => {
            return Math.round(channel * (1 - alpha) + color2[idx] * alpha);
          });

          data[i] = interpolatedColor[0];
          data[i + 1] = interpolatedColor[1];
          data[i + 2] = interpolatedColor[2];
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function animate() {
      gradientAngleDegrees += 0.01; // Increment the rotation angle
      drawRotatedGradient();
      requestAnimationFrame(animate);
    }
  
    animate();
  }
}


if(window.location.href.endsWith("index.html")) {
  load()
  drawSineWaves()
  setCurrentDate()
  setupWatermark()


  document.getElementById("idBillede").addEventListener('click', function () {
    if(!window.location.href.endsWith("forstør.html")) {
      window.location.href = "forstør.html"
    }
  });

  document.getElementById('setupButton').addEventListener('click', () => {
    window.location.href = 'upload.html';
  });

}


bundBar = document.getElementById("bundBar");

bundBar.addEventListener('click', function (e) {
  relativePos = (e.x / bundBar.width) * 100;
  if(relativePos > 5 && relativePos < 20) {
    if(!window.location.href.endsWith("index.html")) {
      window.location.href = "index.html"
    }
  }
  else if(relativePos > 30 && relativePos < 45) {
    if(!window.location.href.endsWith("kortinfo.html")) {
      window.location.href = "kortinfo.html"
    }
  }
  else if(relativePos > 55 && relativePos < 68) {
    if(!window.location.href.endsWith("scan.html")) {
      window.location.href = "scan.html"
    }
  }
  else if(relativePos > 80 && relativePos < 95) {
    if(!window.location.href.endsWith("kontrol.html")) {
      window.location.href = "kontrol.html"
    }
  }
});



var noDragImages = document.querySelectorAll(".noDrag");

noDragImages.forEach(function(image) {
    image.addEventListener("dragstart", function(event) {
        event.preventDefault(); // Prevent the default drag behavior
    });
});






