const navContent = document.querySelector(".tab-content");
const activeTab = navContent.querySelector(".tab-pane.active.show");
const navLinks = document.querySelectorAll(".nav-link");
const nuevaPestañas = document.querySelectorAll(".di");

// Abrir pestaña

nuevaPestañas.forEach((a) => {
    a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = a.getAttribute("data-bs-target");
        const content = document.querySelector(target);
        activeTab.classList.remove("active", "show");
        content.classList.add("active", "show");
        content.classList.remove("ocultar");
        navLinks.forEach((link) => {
            link.classList.remove("active");
        });
        const buttonActive = document.querySelectorAll('button');
        buttonActive.forEach(boton => {
            if (boton.getAttribute('data-bs-target') === target) {
                boton.classList.remove("ocultar");
                boton.classList.add("active");
            };
        });

    });
});

// Seleccion de pestañas

navLinks.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const target = button.getAttribute("data-bs-target");
        const content = document.querySelector(target);
        activeTab.classList.remove("active", "show");
        content.classList.add("active", "show");
        navLinks.forEach((link) => {
            link.classList.remove("active");
        });
        button.classList.add("active");
    });
});

//Cerrar pestañas

const cerrar = document.querySelector(".btnCerrar");
cerrar.addEventListener("click", (e) => {
    e.preventDefault();
    let target = cerrar.getAttribute("data-bs-target");
    let content = document.querySelector(target);
    const activeTab = navContent.querySelector(".tab-pane.show.active");
    activeTab.classList.remove("show", "active");
    target = "#nav-home";
    content = document.querySelector(target);
    content.classList.add("show", "active");
    const pestaña = document.querySelector(".active");
    pestaña.classList.add("ocultar");
    navLinks.forEach((link) => {
        link.classList.remove("active");
    });
    let home = document.querySelector(".home");
    home.classList.add("active");
});

// Ingreso desde formulario

class Ingreso {
    constructor(idRegistro, categoria, subcategoria, monto) {
        this.idRegistro = idRegistro;
        this.categoria = categoria;
        this.subcategoria = subcategoria;
        this.monto = monto;
        this.fechaIngreso = new Date().toLocaleDateString();
    }
}

let idRegistro = 0;
const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
const registroMovimiento = () => {
    const registroMovimiento = document.querySelector("#registroMovimiento");
    registroMovimiento.addEventListener("submit", (e) => {
        e.preventDefault();
        const idValue = movimientos.reduce((maxId, movimiento) => {
            return (movimiento.idRegistro > maxId) ? movimiento.idRegistro : maxId;
        }, -1);
        const categoria = e.target.children["categoria"].value;
        const subcategoria = e.target.children["subcategoria"].value;
        const monto = e.target.children["monto"].value;
        const movimiento = new Ingreso(idValue + 1, categoria, subcategoria, monto);
        movimientos.push(movimiento);
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
        detalle(movimiento);
        totalTd();
        registroMovimiento.reset();
    });
};

//Relleno de la tabla

const detalle = ({ fechaIngreso, categoria, subcategoria, monto }) => {
    const tablaDetalle = document.querySelector("#tablaDetalle");
    const tr = document.createElement("tr");

    if (categoria === "ingreso") {
        tr.innerHTML = `
                    <td>${fechaIngreso}</td>
                    <td>${subcategoria}</td>
                    <td>$${monto}</td>
                    <td></td>
                    `;
    } else {
        tr.innerHTML = `
                    <td>${fechaIngreso}</td>
                    <td>${subcategoria}</td>
                    <td></td>
                    <td>-$${monto}</td>
                    `;
    }
    tablaDetalle.append(tr);
};

const cargarTabla = () => {
    movimientos.forEach(movimiento => {
        detalle(movimiento);
    });

};

//Calculo del total

const saldoTotal = () => {
    const ingresos = movimientos.reduce((total, item) => {
        if (item.categoria === "ingreso") {
            return total + parseFloat(item.monto);
        } else {
            return total;
        }
    }, 0);

    const egresos = movimientos.reduce((total, item) => {
        if (item.categoria === "egreso") {
            return total + parseFloat(item.monto);
        } else {
            return total;
        }
    }, 0);
    const final = ingresos - egresos;
    return final;
};

const totalTd = () => {
    const tdTotal = document.querySelector("#total");
    tdTotal.innerText = "$" + saldoTotal();
}

totalTd()
cargarTabla();
registroMovimiento();