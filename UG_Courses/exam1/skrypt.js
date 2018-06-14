//jshint browser: true, esversion: 6, devel: true
const lista = [
    { no: 1, name: 'Wiga' },
    { no: 2, name: 'Paterna' },
    { no: 3, name: 'Etira' },
    { no: 4, name: 'Emandorissa' },
    { no: 5, name: 'Patria' },
    { no: 6, name: 'Galacja' },
    { no: 7, name: 'Paeksa' },
    { no: 8, name: 'Pilastra' },
    { no: 9, name: 'Elfira' },
    { no: 10, name: 'Fanabella' },
    { no: 11, name: 'Pustynna Noc' },
    { no: 12, name: 'Gratena' },
    { no: 13, name: 'Matahna' },
    { no: 14, name: 'Panetta' },
    { no: 15, name: 'Baklava' },
    { no: 16, name: 'Piera' },
    { no: 17, name: 'Wersa' },
    { no: 18, name: 'Atanda' },
    { no: 19, name: 'Escalada' },
    { no: 20, name: 'Faworyta' },
    { no: 21, name: 'Angelina' },
    { no: 22, name: 'Kalahari' },
    { no: 23, name: 'Godaiva' },
    { no: 24, name: 'Alamina' },
    { no: 25, name: 'Piacolla' },
    { no: 26, name: 'Wieża Bajek' }
];

addPlayer = (element) => {
    let playername = document.createTextNode(element.name);
    let listposition = document.createElement("li");
    listposition.appendChild(playername);
    document.getElementById("lista").appendChild(listposition)

};

listOperator = (event) => {
    const {target} = event;
    target.style.backgroundColor = "yellow";
    let nameplate = document.getElementById("zawodnik");
    nameplate.style.display = "block";
    nameplate.textContent = target.textContent;
};

addNoteClick = (element) => {
    element.addEventListener('keypress', calcDiv);
    element.addEventListener('keypress', calcDiv);
    // element.addEventListener('Tab', moveNext);
    element.addEventListener('keypress', calcDiv);
    // element.addEventListener('Shift+Tab', movePrev);
};

clickOperator = (element) => {
    element.addEventListener('click', listOperator);
};

insertDiv = (element) => {
    let div = document.createElement("input");
    div.style.borderStyle = "1px";
    div.style.borderColor = "black";
    div.style.width = "100px";
    div.style.height = "50px";
    div.style.marginTop = "10px";
    div.style.marginLeft = "33%";
    div.style.marginRight = "auto";
    div.style.textAlign = "center";
    div.id = "suma";
    div.value = "0.0";
    element.appendChild(div);

};

calcDiv = (event) => {

    if (event.keyCode === 13) {
        console.log("click");
        let sum = document.querySelectorAll("span");
        let partialsum = 0;
        let sums = 0;
        sum.forEach(function (s) {
            // console.log(s);
            let values = s.querySelectorAll("input");
            // console.log(values);
            values.forEach(function (v) {
                // console.log(v);
                if (v.value !== null) {
                    partialsum = partialsum + v.value;
                }
                console.log(v.value);
            });
            sums = (sums + partialsum)/15;
            partialsum = 0;
            // console.log(sums);
        });
        document.getElementById("suma").value = sums.toFixed(2).toString();
    }
};

initApplication = () => {
    lista.forEach(addPlayer);
    const listmatches = document.querySelectorAll("li");
    listmatches.forEach(clickOperator);
    const wyniki = document.getElementById("wyniki");
    insertDiv(wyniki);
    const notes = document.querySelectorAll('[class^="nota"]');
    notes.forEach(addNoteClick);
};

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        initApplication();
    }
};
