document.addEventListener("DOMContentLoaded", () => {
  const btnGenerar = document.getElementById("btn-generar");
  const selectCantidad = document.getElementById("select-cantidad");
  const selectFormato = document.getElementById("select-formato");

  let paletaContenedor = document.getElementById("paleta-contenedor");
  if (!paletaContenedor) {
    paletaContenedor = document.createElement("div");
    paletaContenedor.id = "paleta-contenedor";
    paletaContenedor.className = "paleta-contenedor";
    document.querySelector("main").appendChild(paletaContenedor);
  }


  const toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);

  function mostrarToast(mensaje) {
    toast.textContent = mensaje;
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
    }, 2000);
  }

 const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


  function generarColor(formato) {
    if (formato === "hsl") {
      const h = random(0, 360);
      const s = random(45, 90);
      const l = random(40, 70);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }

    const hex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    return `#${hex.toUpperCase()}`;
  }

  function crearPaleta() {
    const cantidad = parseInt(selectCantidad.value, 10);
    const formato = selectFormato.value;

    paletaContenedor.innerHTML = "";

    for (let i = 0; i < cantidad; i++) {
      const color = generarColor(formato);

      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta-color";
      tarjeta.setAttribute("tabindex", "0");
      tarjeta.setAttribute("role", "button");
      tarjeta.setAttribute("aria-label", `Copiar color ${color}`);

      tarjeta.innerHTML = `
        <div class="muestra-color" style="background-color: ${color};"></div>
        <div class="info-color">${color}</div>
      `;

      tarjeta.addEventListener("click", () => {
        navigator.clipboard.writeText(color).then(() => {
          mostrarToast(`¡Copiado al portapapeles: ${color}!`);
        });
      });

      tarjeta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tarjeta.click();
        }
      });

      paletaContenedor.appendChild(tarjeta);
    }
  }


  btnGenerar.addEventListener("click", crearPaleta);
  selectCantidad.addEventListener("change", crearPaleta);
  selectFormato.addEventListener("change", crearPaleta);


  crearPaleta();
});