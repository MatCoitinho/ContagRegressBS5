const API_URL = "http://localhost:3000/contagem-regressiva";

const elDias = document.querySelector("#dias");
const elHoras = document.querySelector("#horas");
const elMinutos = document.querySelector("#minutos");
const elSegundos = document.querySelector("#segundos");
const camposValor = [elDias, elHoras, elMinutos, elSegundos];

let dataEvento = null;
let instanteServidor = null;
let instanteClienteNaSync = null;
let intervaloContagem = null;

function definirCorCampos(terminou) {
  camposValor.forEach(function (campo) {
    campo.classList.remove("bg-dark", "bg-success");
    campo.classList.add(terminou ? "bg-success" : "bg-dark");
  });
}

function renderizar(dias, horas, minutos, segundos, terminou) {
  elDias.innerHTML = dias;
  elHoras.innerHTML = horas;
  elMinutos.innerHTML = minutos;
  elSegundos.innerHTML = segundos;
  definirCorCampos(terminou);
}

function pararContagem() {
  if (intervaloContagem !== null) {
    clearInterval(intervaloContagem);
    intervaloContagem = null;
  }
}

function atualizarContagem() {
  if (
    !dataEvento ||
    instanteServidor === null ||
    instanteClienteNaSync === null
  ) {
    return;
  }

  const agora =
    instanteServidor + (Date.now() - instanteClienteNaSync);
  let diff = dataEvento - agora;

  if (diff <= 0) {
    renderizar(0, 0, 0, 0, true);
    return;
  }

  const totalSegundos = Math.floor(diff / 1000);
  const dias = Math.floor(totalSegundos / (60 * 60 * 24));
  const horas = Math.floor((totalSegundos % (60 * 60 * 24)) / (60 * 60));
  const minutos = Math.floor((totalSegundos % (60 * 60)) / 60);
  const segundos = totalSegundos % 60;

  renderizar(dias, horas, minutos, segundos, false);
}

function iniciarContagem(dados) {
  instanteServidor = new Date(dados["Data Atual"]).getTime();
  instanteClienteNaSync = Date.now();

  if (dados["Data Evento"]) {
    dataEvento = new Date(dados["Data Evento"]).getTime();
  } else if (dados["Minutos Restantes"] !== undefined) {
    dataEvento =
      instanteServidor + dados["Minutos Restantes"] * 60 * 1000;
  }

  pararContagem();
  atualizarContagem();
  intervaloContagem = setInterval(atualizarContagem, 1000);
}

fetch(API_URL)
  .then(function (resposta) {
    return resposta.json();
  })
  .then(iniciarContagem)
  .catch(function (erro) {
    console.error("Erro ao recuperar dados do servidor:", erro);
  });
