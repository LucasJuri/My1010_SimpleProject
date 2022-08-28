//Crear las piezas posibles
let pcs = [
    {
        name: "BBox", //Nombre de la pieza
        fill: [
            [1,1,1],
            [1,1,1],
            [1,1,1]
        ], //Relleno de la pieza dividido en filas y celdas dentro
        color: "#55ffea", //Color de la pieza
    },
    {
        name: "SBox",
        fill: [
            [1,1],
            [1,1]
        ],
        color: "#62dc5c"
    },
    {
        name: "single",
        fill:[
            [1]
        ],
        color: "#6f4ce5"
    },
    {
        name: "BL",
        fill: [
            [1],
            [1],
            [1,1,1]
        ],
        color: "#25b8dc",
        L: true //Al ser una L es una pieza con posibilidad de rotarse y voltearse
    },
    {
        name: "V2Line",
        fill: [
            [1],
            [1]
        ],
        color: "#eeeb14"
    },
    {
        name: "H2Line",
        fill: [
            [1,1]
        ],
        color: "#eeeb14"
    },
    {
        name: "V3Line",
        fill: [
            [1],
            [1],
            [1]
        ],
        color: "#f68429"
    },
    {
        name: "H3Line",
        fill: [
            [1,1,1]
        ],
        color: "#f68429"
    },
    {
        name: "V4Line",
        fill:[
            [1],
            [1],
            [1],
            [1]
        ],
        color: "#eb62ae"
    },
    {
        name: "H4Line",
        fill:[
            [1,1,1,1]
        ],
        color: "#eb62ae"
    },
    {
        name: "V5Line",
        fill:[
            [1],
            [1],
            [1],
            [1],
            [1]
        ],
        color: "#e93a4d"
    },
    {
        name: "H5Line",
        fill:[
            [1,1,1,1,1]
        ],
        color: "#e93a4d"
    },
    {
        name: "SL",
        fill: [
            [1],
            [1, 1]
        ],
        color: "#349d36"
    }
];

getNewPcs(); //Iniciar con nuevas piezas

//Funcion para obtener nuevas piezas
function getNewPcs(){
    let nps = document.querySelectorAll(".newPc") //Obtener los espacios para las piezas

    //Poner los espacios para piezas a un costado (para darle la entrada animada)
    nps.forEach(p => {
        p.style.transition = ""
        p.style.marginLeft = "100px"
    });
    let newPcs = document.getElementById("newPcs")
    newPcs.style.transition = ""
    newPcs.style.marginLeft = "600px"

    //Generar 3 piezas aleatorias
    for(let i = 0; i < 3; i++){
        let num = Math.floor(Math.random()*pcs.length); //Número aleatorio entre 0 y la cantidad de piezas posibles
        let piece = pcs[num]; //Tomar la pieza correspondiente al número
        
        //Crear tablas (piezas)
        let t = document.createElement("table");
        let tb = document.createElement("tbody");
        
        //Rellenar tablas conforme a la pieza
        piece.fill.forEach(r => {
            let tr = document.createElement("tr"); //Crear una fila por cada array dentro de piece.fill
            r.forEach(c => {
                let td = document.createElement("td"); //Crear una celda por cada "1" dentro de array
                tr.appendChild(td);
                td.style.backgroundColor = piece.color //Dar color conforme a la pieza
            })
            tb.appendChild(tr) //Agregar fila al tbody
        })
        
        t.className = "piece" //Clase para el estilo
        t.appendChild(tb) //Agregar tbody a la tabla
        document.querySelectorAll(".np" + i)[0].appendChild(t) //Agregar pieza al espacio correspondiente
        
        t.setAttribute("ontouchstart", "selectPiece(this, event)") //Dar evento al iniciar el tacto sobre la pieza
        
    }

    //Animar entrada de las piezas
    setTimeout(function() {
        nps.forEach(p => {
            p.style.transition = "all ease .4s"
            p.style.marginLeft = ""
        })
        newPcs.style.transition = "all ease .5s";
        newPcs.style.marginLeft = ""
    }, 100)
}

//Funcion al seleccionar una pieza (ontouchstart)
function selectPiece(piece, e){
    piece.style.zIndex = "100" //Subir piezas por encima de todo
    piece.style.transform = "scale(1.5)"; //Agrandar la pieza

    //Dar la posicion del dedo a la pieza
    piece.style.position = "absolute";
    piece.style.left = e.touches[0].clientX - piece.clientWidth/2 + "px" //Posicion X
    piece.style.top = e.touches[0].clientY - piece.clientHeight*1.5 + "px" //Posicion Y + un poco para no ser tapada por el dedo

    piece.setAttribute("ontouchmove", "movePiece(this, event)") //Dar evento al mover la pieza
    piece.setAttribute("ontouchend", "deselectPiece(this)") //Dar evento al soltar la pieza
}

//Funcion al soltar la pieza
function deselectPiece(piece){
    let contId = piece.parentNode.id //ID del Div padre de la peiza selecionada
    let tds = document.querySelectorAll(`#${contId} td`) //Celdas que componen la pieza
    let cells = document.querySelectorAll("#bigTable td") //Celdas de la tabla base
    tds.forEach(td => {
        cells.forEach(cell => {
            //Revizar que celda de la tabla coincide con cada celda de la pieza (en X Y)
            if(Math.abs(getPos(cell).left - getPos(td).left) < 15 && Math.abs(getPos(cell).top - getPos(td).top) < 15 && cell.className != "o"){
                cell.className = "p" //Si coincide y la celda no esta ocupada (clase "o"), se le aplica la clase "p" (a procesar)
            }
        });
    });
    
    let p = document.querySelectorAll(".p"); //Todas las celdas a procesar
    if(p.length != tds.length){ //Si no se pueden acomodar todas las celdas de la pieza en la tabla, la pieza vuelve a su lugar
        piece.style.position = "";
        piece.style.transform = "scale(1)";
        piece.style.zIndex = "99"
        p.forEach(cell => {
            cell.className = ""
        });
    } else { //Si se pueden acomodar, la pieza se borra y transfiere su color a las celdas de la tabla
        p.forEach(cell => {
            cell.style.backgroundColor = tds[0].style.backgroundColor
            cell.className = "o"
        });
        piece.remove();
        checkLines(); //Revisar si se formó alguna linea o columna para desapareceralas
    }
    if(document.querySelectorAll(".piece").length == 0){
        getNewPcs() //Si se agotan las piezas, se obtienen 3 piezas nuevas aleatorias
    }
}

//Funcion al mover la pieza
function movePiece(piece, e) {
    e.preventDefault
    piece.style.transform = "scale(1.5)"

    piece.style.position = "absolute";
    piece.style.left = e.touches[0].clientX - piece.clientWidth/2 + "px" //Seguir el dedo en X
    piece.style.top = e.touches[0].clientY - piece.clientHeight*1.5 + "px" //Seguir el dedo en Y

    piece.setAttribute("onpointerup", "deselectPiece(this)"); //Dar evento al soltar la pieza
}

//Funcion para obtener la posición de un elemento (usado en "deselectPiece()")
function getPos(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX, //Posición en X
    top: rect.top + window.scrollY //Posición en Y
  };
}

//Funcion para revisar si hay lineas o columnas llenas en la tabla
function checkLines(){
    let trs = document.querySelectorAll("#bigTable tr"); //Filas de la tabla
    let cols = [[],[],[],[],[],[],[],[],[],[]]; //Columnas de la tabla (por llenar)
    let celdas = document.querySelectorAll("#bigTable td") //Celdas de la tabla
    let tds = []; //Array de celdas para desaparecer
    
    //Guardar las celdas ocupadas por columnas en "cols"
    celdas.forEach(td => {
        for(let i = 0; i < 10; i++){
            if(td.id[td.id.length-1] == i.toString() && td.className == "o"){
                cols[i].push(td.id);
            }
        }
    })
    
    //Revisar lineas horizontales
    trs.forEach(tr => {
        let os = 0 //Cantidad de celdas ocupadas en la misma linea
        tr.childNodes.forEach(td => {
           if(td.className == "o"){
               os++ //Si la celda esta ocupada, se suma a las "os"
           }
        })
        if(os == 10){ //Si todas las celdas de la fila estan ocupadas, se suman a las "tds" (Array de celdas para desaparecer)
            tr.childNodes.forEach(td => {
            if(td.id != undefined){
                tds.push(td.id)
                }
            })
        }
    })
    
    //Revisar lineas verticales
    cols.forEach(col => {
        if(col.length == 10){ //Si todas las celdas de la columna estan ocupadas, se suman a las "tds" (Array de celdas para desaparecer)
            col.forEach(celda => {
                tds.push(celda)
            })
        }
    })
    
    deleteLines(tds) //Ejecutar la funcion para desaparecer todas las "tds" pasando sus ID's
}

//Funcion para desaparecer las lineas llenas
function deleteLines(tds) {
    tds.forEach(td => {        
        let cell = document.getElementById(td) //Cada ID de celda
        cell.style.backgroundColor = "" //Se vuelve su color a la normalidad
        cell.className = "" //Se quita la clase "o" (ocupada)
    })
}
