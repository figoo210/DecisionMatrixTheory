
function insertRow() {
  // Body vars
  let content = document.getElementById("body");
  let columnsLength = content.firstElementChild.children.length;
  let rowsLength = content.children.length;
  let counterRows = rowsLength + 1;
  let tr = document.createElement("tr");
  for (let x = 0; x < columnsLength; x++) {
    let td = document.createElement("td");
    let input = document.createElement("input");
    if (x == 0) {
      input.setAttribute("placeholder", "Alternative " + counterRows);
      input.setAttribute("class", "alternatives_input dm-input");
      input.setAttribute("type", "text");
      input.setAttribute("name", "title-" + rowsLength);
    } else {
      input.setAttribute("class", "dm-input");
      input.setAttribute("type", "number");
      input.setAttribute("name", "index-" + rowsLength + "-" + (x-1));
    }
    td.appendChild(input);
    tr.appendChild(td);
  }

  let button = document.createElement("button");
  button.classList = "btn btn-delete";
  button.innerHTML = "X";
  tr.appendChild(button);
  content.appendChild(tr);

  // event listener to delete row
  button.addEventListener("click", function (e) {
    e.target.parentElement.remove();
  });

}

function insertColumn() {
  // Body Vars
  let content = document.getElementById("body");
  let rowsLength = content.children.length;
  let columnsLength = content.firstElementChild.children.length;
  let columnsCounter = columnsLength - 1;

  // Weight Vars
  let weight_body = document.getElementById("weightBody");
  let weight_row_length = weight_body.children.length;
  let weightTd = document.createElement("td");
  let weightInput = document.createElement("input");
  weightInput.setAttribute("class", "weight_input dm-input");
  weightInput.setAttribute("type", "number");
  weightInput.setAttribute("name", "weight-" + columnsCounter);
  let button = document.createElement("button");
  button.classList = "btn btn-delete posAbs";
  button.innerHTML = "X";
  weightTd.appendChild(button);
  weightTd.appendChild(weightInput);
  weight_body.appendChild(weightTd);

    // factors Vars
  let factors_body = document.getElementById("factors");
  let factors_row_length = factors_body.children.length;
  let factorsTd = document.createElement("td");
  let factorsInput = document.createElement("input");
  factorsInput.setAttribute("placeholder", "factor " + columnsLength);
  factorsInput.setAttribute("class", "factor_input dm-input");
  factorsInput.setAttribute("type", "text");
  factorsInput.setAttribute("name", "factor-" + columnsCounter);
  factorsTd.appendChild(factorsInput);
  factors_body.appendChild(factorsTd);

  //insert row for body 'tbody'
  for (let x = 0; x < rowsLength; x++) {
    let td = document.createElement("td");
    let input = document.createElement("input");
    input.setAttribute("class", "dm-input");
    input.setAttribute("type", "number");
    input.setAttribute("name", "index-" + x + "-" + (columnsCounter));
    td.appendChild(input);
    // if statment to avoid putting elment after delete button
    content.children[x].insertBefore(
        td,
        content.children[x].lastElementChild
    );
  }

  // event listener to delete column
  button.addEventListener("click", function (e) {
    let index = e.target.parentElement.cellIndex;
    e.target.parentElement.remove();
    factors_body.children[index].remove();
    for (let x = 0; x < rowsLength; x++) {
      content.children[x].children[index].remove();
    }
  });

}


document.addEventListener("submit", (e) => {
    e.preventDefault();
    let content = document.getElementById("body");
    let tableBody = document.querySelector(".center")
    let inputRowsCols = document.createElement("input");
    inputRowsCols.setAttribute("type", "hidden");
    inputRowsCols.setAttribute("value", [content.children.length, content.firstElementChild.children.length - 1]);
    inputRowsCols.setAttribute("name", "matrix");
    tableBody.appendChild(inputRowsCols);
    getDMData(e.target);
});

function getDMData(form) {
    let tableCont = document.querySelector(".center");
    let formData = new FormData(form);
    const data = Object.fromEntries(formData);
    // console.log(data)
    const matrixRows = parseInt(data.matrix.split(",")[0]);
    const matrixCols = parseInt(data.matrix.split(",")[1]);
    let matrix = [];
    let weights = [];
    for (let i = 0; i < matrixRows; i++) {
      let row = [];
      for (let j = 0; j < matrixCols; j++) {
        if (i == 0) {
          weights.push(data["weight-" + j])
          if (j == matrixCols - 1) {
            row.push(data["index-" + i + "-0"]);
          } else {
            row.push(data["index-" + i + "-" + (j + 1)]);
          }
        } else {
          row.push(data["index-" + i + "-" + j]);
        }
      }
      matrix.push(row);
    }
    // console.log(weights)
    // Connect with backend
    let req = new FormData();
    req.append("data", JSON.stringify( matrix ));
    req.append("weights", JSON.stringify( weights ));

    fetch("/decision-matrix",
    {
        method: "POST",
        body: req
    })
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data);
        tableCont.appendChild(document.createElement("hr"));
        let s1Value, s1 = null;
        if (!data.idx) {
            s1 = "Undefined";
        }else {
            s1Value = "title-" + (data.idx);
            s1 = document.querySelector(`input[name='${s1Value}']`).value;
        }
        let result = document.createElement("h2");
        result.innerHTML = "Result: " + data.result + " In (" + s1 + ")";
        tableCont.appendChild(result);
    });
}

