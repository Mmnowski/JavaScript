hideElement = (element) => {
  element.style.display = "none";
  console.log("hide");
}

showElement = (element) => {
  element.style.display = "block";
  console.log("show");
}

hoverControl = (element) => {
  
};

bodyOperator = (event) => {
  const {target} = event;
  let textBox = target.nextElementSibling;
  if (textBox.style.display === "none"){
    showElement(textBox);
  } else {
    hideElement(textBox);
  }
}

eventOperator = (element) => {
  element.addEventListener('click', bodyOperator);
}

initApplication = () => {
  const bdmatches = document.querySelectorAll(".bd");
  bdmatches.forEach(hideElement);
  const hdmatches = document.querySelectorAll(".hd");
  hdmatches.forEach(hoverControl);
  hdmatches.forEach(eventOperator);
}

document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    initApplication();
  }
}
