// Array que funciona como "base de datos" en memoria: cada elemento va a ser un objeto
// que representa un auto lavado (marca, dueño, precio y si pagó o no)
let autos=[];

//recuperando el array del localStorage
//primero buscás el dato (una sola vez), lo guardamos en una variable temporal, y después decidís con el if/else qué hacer según lo que encontraste ahí.
let datosGuardados= localStorage.getItem("lavaGo");

if (datosGuardados) {
    autos=JSON.parse(datosGuardados);
    
    
} else {
    
};
dibujarAutos();

function dibujarAutos() {
      // Referencia al <ul> donde se muestra la lista visual de autos cargados
    let ul= document.querySelector("#listaAutos");

     // Vaciamos el <ul> antes de repintarlo, para no duplicar autos ya mostrados
    ul.innerHTML="";

    autos.forEach(function(num, indice){
        let li= document.createElement("li")
        li.innerHTML=`
                        Marca: ${num.marca}
                        Dueño: ${num.dueño}
                        Precio: ${num.precio}
                        Estado:${num.pagado ? "Efectivo" : "transf."}
                        <article class="btn_edit">
                        <button type="button" class="btn-editar-precio">Editar Precio</button>
                        <button type="button" class="btn-editar-estado">Editar Estado</button>
                        </article>
                        
                    `
        
        let btnEditEstado= li.querySelector(".btn-editar-estado");
        
        btnEditEstado.addEventListener("click",()=>{
            autos[indice].pagado=!autos[indice].pagado;
            localStorage.setItem("lavaGo",JSON.stringify(autos));
            dibujarAutos()
            
        })

        let btnEditPrecio= li.querySelector(".btn-editar-precio");

        btnEditPrecio.addEventListener("click",()=>{
            let precioNuevo= parseFloat(prompt("ingresa el nuevo precio"));
            
            if (isNaN(precioNuevo)) {
                alert("Tenes que colocar el precio, capo!")
                return
            }
            
            autos[indice].precio=precioNuevo;
            
            localStorage.setItem("lavaGo",JSON.stringify(autos));
            dibujarAutos()
        })




        ul.appendChild(li)

    })
}


// Referencia al botón "Agregar", para poder escuchar cuándo el usuario hace clic
let btnAgregar= document.querySelector("#btnagregar");

btnAgregar.addEventListener("click",()=>{

    // Leemos los valores actuales de los 4 inputs del formulario/.vulue por que queremos el valor que se ingrese en el input
    let marcaAuto= document.querySelector("#marca").value;
    
    let duenioAuto= document.querySelector("#duenio").value;

     // parseFloat convierte el texto del input a número, porque .value siempre devuelve string
    let precioAuto= parseFloat(document.querySelector("#precio").value);

     // .checked (no .value) porque es un checkbox: devuelve true o false directamente
    let pagoAuto= document.querySelector("#pago").checked;
    
        // Armamos un objeto con los 4 datos leídos, representando "un auto" completo

    let auto={
        marca:marcaAuto,
        dueño: duenioAuto,
        precio:precioAuto,
        pagado:pagoAuto
    }
    
    if (isNaN(auto.precio)) {
        alert("Tenes que colocar el precio, capo!")
        return
    }

    

    // Guardamos ese objeto en el array
    autos.push(auto);

    //aplicando localStorage
    localStorage.setItem("lavaGo",JSON.stringify(autos));

    dibujarAutos();


     // Limpiamos los 4 inputs para que el formulario quede listo
     // para cargar el próximo auto, sin arrastrar datos del anterior

        marcaAuto= document.querySelector("#marca");
        marcaAuto.value="";

        duenioAuto= document.querySelector("#duenio");
        duenioAuto.value="";

        precioAuto= document.querySelector("#precio");
        precioAuto.value="";

        pagoAuto= document.querySelector("#pago");
        pagoAuto.checked=false; //solo devuelve dos valores (true/false). como tenemos que vaciarlo lo dejamos en false
})

// Referencia al botón "Total Cobrado"
let btnTotalCobrado= document.querySelector("#btnCobrado");

btnTotalCobrado.addEventListener("click",()=>{
    // Nos quedamos solo con los autos que ya fueron pagados
    let autosPagados=autos.filter(function (auto) {
        return auto.pagado
        
    })
      // Sumamos los precios de esos autos filtrados, arrancando desde 0
    let totalCobrado=autosPagados.reduce((acumulador,num)=> acumulador+num.precio,0);

    // let totalCobrado=autosPagados.reduce(function(acumulador, num){
    //     return acumulador+ num.precio
    // },0)
    // console.log(totalCobrado);
    
    let spanCobrado= document.querySelector("#resultadoCobrado");

      // Mostramos el total calculado en pantalla
    spanCobrado.textContent=`
                                $:${totalCobrado}
    `;
    
})

// Referencia al botón "Total Pendiente"
let btnPendiente= document.querySelector("#btnPendiente");

btnPendiente.addEventListener("click",()=>{
    let autosPendientes=autos.filter(function(pendiente) { //usamos.filter(crea un array nuevo secando datos que cumplan la condicion, en este caso trae valores del array original y mostrara solo los que cumplan la condicion)
        return !pendiente.pagado // Nos quedamos solo con los autos que TODAVÍA no pagaron (por eso el !)
    })

     // Sumamos los precios de los autos pendientes
    let totalPendiente=autosPendientes.reduce((acumulador,num)=>acumulador+num.precio,0);

    let spanPendiente=document.querySelector("#resultadoPendiente");
    
    spanPendiente.textContent=`
                                $:${totalPendiente}
                                    `
})

// Referencia al botón "Total General"
let btnGeneral= document.querySelector("#btnGeneral");

// Sumamos TODOS los precios del array, sin filtrar (cobrados + pendientes)
btnGeneral.addEventListener("click",()=>{
    let totalGeneral=autos.reduce((acumulador,num)=> acumulador+num.precio,0)
    
    let spanGeneral=document.querySelector("#resultadoGeneral")
    
    spanGeneral.textContent=`
                            $:${totalGeneral}`

})


// reinicio de jornada
let btnReinicio= document.querySelector("#btnReinicio");

btnReinicio.addEventListener("click",()=>{
    localStorage.clear();
    autos=[];
    dibujarAutos();
    limpiarResultados()

})

function limpiarResultados() {
        let resetCobrado= document.querySelector("#resultadoCobrado");
    resetCobrado.textContent=``;

    let resetPendiente= document.querySelector("#resultadoPendiente");
    resetPendiente.textContent=``;

    let resetGeneral= document.querySelector("#resultadoGeneral");
    resetGeneral.textContent=``;
}