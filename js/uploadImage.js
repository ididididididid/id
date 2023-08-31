function uploadAndCache() {

    let setImage = false;
    let setText = false;

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
  
    if (!file) {
      alert('Please select a file.');
      return;
    }
  
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = function(event) {
      const fileContent = event.target.result;
      // Store the file content in localStorage
      localStorage.setItem('idBillede', fileContent);
      setImage = true;
      if(setImage && setText) {
        window.location.href = "index.html"
      }
    };
  
    reader.readAsDataURL(file);

    let nameInput = document.getElementById('name')
    localStorage.setItem("name", nameInput.value)

    let birthdayInput = document.getElementById('birthday')
    localStorage.setItem("birthday", birthdayInput.value)

    let alderInput = document.getElementById('alder')
    localStorage.setItem("alder", alderInput.value)

    let kortNrInput = document.getElementById('kortNr')
    localStorage.setItem("kortNr", kortNrInput.value)
    setText = true;
    if(setImage && setText) {
      window.location.href = "index.html"
    }
  }