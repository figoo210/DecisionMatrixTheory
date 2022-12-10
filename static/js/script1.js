let rows = document.getElementById("rows");
let columns = document.getElementById("columns");
let button = document.querySelector("button");
let alphaBtn = document.querySelector("alpha-btn");
let inputBox = document.querySelector(".inputTableCreation");
let btnGroups = document.getElementById("calculate-group");
let regenerateBtn = document.getElementById("regenerate");
let tableCont = document.getElementById("table");


button.addEventListener("click",createTable);
regenerateBtn.addEventListener("click", regenerateTable);
document.addEventListener("submit", (e) => {
    e.preventDefault();
    getData(e.target, document.activeElement.textContent);
});

function createTable() {
    const rowsNum = parseInt(rows.value) + 1;
    const columnsNum = parseInt(columns.value) + 1;
    if (!rowsNum || !columnsNum) {
        return;
    }
    let tableBody = document.getElementById("table");
    let table = document.createElement("table");

    for(let i=0 ; i<rowsNum ; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);

        for(let j=0 ; j<columnsNum ; j++) {
            let td = document.createElement("td");
            let tableInput = document.createElement("input");
            // tableInput.setAttribute("required", "true");
            tableInput.setAttribute("class", "inputStyle2");
            if (i === 0 || j === 0) {
                tableInput.setAttribute("type", "text");
                tableInput.setAttribute("placeholder", "TEXT");
                tableInput.setAttribute("name", "title-" + i + "-" +j);
            } else {
                tableInput.setAttribute("type", "number");
                tableInput.setAttribute("placeholder", "Value");
                tableInput.setAttribute("name", "index-" + (i-1) + "-" + (j-1));
            }

            td.appendChild(tableInput);
            if (i === 0 && j === 0) {
                td.innerHTML = "";
            }
            tr.appendChild(td);
        }
    }
    tableBody.appendChild(table);
    let inputRowsCols = document.createElement("input");
    inputRowsCols.setAttribute("type", "hidden");
    inputRowsCols.setAttribute("value", [rowsNum-1, columnsNum-1]);
    inputRowsCols.setAttribute("name", "matrix");
    tableBody.appendChild(inputRowsCols);
    tableBody.appendChild(document.createElement("br"));
    tableBody.appendChild(document.createElement("br"));
    inputBox.classList.toggle("hide");
    btnGroups.classList.toggle("hide");
    tableCont.classList.toggle("hide");
}


function regenerateTable() {
    inputBox.classList.toggle("hide");
    btnGroups.classList.toggle("hide");
    tableCont.classList.toggle("hide");
    tableCont.innerHTML = "";
}


function getData(form, mode) {
    let tableBody = document.getElementById("table"); // To display results
    let formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const matrixRows = parseInt(data.matrix.split(",")[0]);
    const matrixCols = parseInt(data.matrix.split(",")[1]);
    let matrix = [];
    for (let i = 0; i < matrixRows; i++) {
      let row = [];
      for (let j = 0; j < matrixCols; j++) {
          row.push(data["index-" + i + "-" + j]);
      }
      matrix.push(row);
    }
    // Connect with backend
    let req = new FormData();
    req.append("data", JSON.stringify( matrix ));
    req.append("mode", mode);
    req.append("alpha", document.getElementById("alpha").value)

    fetch("/matrix",
    {
        method: "POST",
        body: req
    })
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data);
        tableBody.appendChild(document.createElement("hr"));
        let s1Value, s2Value, s1, s2 = null;
        if (Array.isArray(data.idx)) {
            s1Value = "title-" + (data.idx[0] + 1) + "-0";
            s2Value = "title-0-" + (data.idx[1] + 1);
            s1 = document.querySelector(`input[name='${s1Value}']`).value;
            s2 = document.querySelector(`input[name='${s2Value}']`).value;
        } else if (!data.idx) {
            s1 = "Undefined";
        }else {
            s1Value = "title-" + (data.idx + 1) + "-0";
            s1 = document.querySelector(`input[name='${s1Value}']`).value;
        }
        let result = document.createElement("h2");
        result.innerHTML = data.mode + " Result: " + data.result + " In (" + s1 + (s2 ? (", " + s2 + ")") : (")"));
        tableBody.appendChild(result);
    });
}

