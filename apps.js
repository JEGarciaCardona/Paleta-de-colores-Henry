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
    setTimeout(() => toast.classList.remove("visible"), 2000);
  }

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  let paletaActual = [];

  function generarPaleta() {
    const cantidad = parseInt(selectCantidad.value, 10);
    paletaActual = [];

    for (let i = 0; i < cantidad; i++) {
      const h = random(0, 360);
      const s = random(45, 90);
      const l = random(40, 70);

      const hsl = `hsl(${h}, ${s}%, ${l}%)`;
      const hex = hslParaHex(h, s, l);

      paletaActual.push({ hex, hsl });
    }
    renderizar();
  }

  function renderizar() {
    const formato = selectFormato.value;
    paletaContenedor.innerHTML = "";

    paletaActual.forEach(color => {

      const textoMostrado = formato === "hsl" ? color.hsl : color.hex;

      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta-color";
      tarjeta.setAttribute("tabindex", "0");
      tarjeta.setAttribute("role", "button");
      tarjeta.setAttribute("aria-label", `Copiar color ${textoMostrado}`);

      tarjeta.innerHTML = `
        <div class="muestra-color" style="background-color: ${color.hex};"></div>
        <div class="info-color">${textoMostrado}</div>
      `;

      tarjeta.addEventListener("click", () => {
        navigator.clipboard.writeText(textoMostrado).then(() => {
          mostrarToast(`¡Copiado: ${textoMostrado}!`);
        });
      });

      tarjeta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tarjeta.click();
        }
      });

      paletaContenedor.appendChild(tarjeta);
    });
  }

  function hslParaHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  }

  btnGenerar.addEventListener("click", generarPaleta);
  selectCantidad.addEventListener("change", generarPaleta); 
  selectFormato.addEventListener("change", renderizar);      

  generarPaleta();
});