// Import necessary libraries
const gsap = window.gsap
const THREE = window.THREE

const texto = document.querySelectorAll(".fade-item")
const slideLeft = document.querySelectorAll(".slide-left")

// ===================== ANIMAÇÕES NOTICIAS =====================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.classList.contains("fade-item")) {
        entry.target.classList.add("fade-ativo")
      }
    })
  },
  { threshold: 0, rootMargin: "-100px" },
)

const observerSlide = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.classList.contains("slide-left")) {
        entry.target.classList.add("slide-ativo")
      }
    })
  },
  { threshold: 0, rootMargin: "-100px" },
)

slideLeft.forEach((elemento) => observerSlide.observe(elemento))
texto.forEach((elemento) => observer.observe(elemento))

const observerTopo = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      texto.forEach((elemento) => elemento.classList.remove("fade-ativo"))
      slideLeft.forEach((elemento) => elemento.classList.remove("slide-ativo"))
    }
  })
})
observerTopo.observe(document.getElementById("topo"))

document.addEventListener("DOMContentLoaded", () => {
  // --- GALERIA ---
  const items = document.querySelectorAll(".stair-item")
  const nextBtn = document.querySelector(".stair-btn.next")
  const prevBtn = document.querySelector(".stair-btn.prev")
  if (!items.length) return

  let current = 0
  const positions = [
    { x: -550, y: 50, z: -300, scale: 0.8, rot: -8, bright: 0.6 },
    { x: -300, y: 25, z: -150, scale: 0.9, rot: -4, bright: 0.8 },
    { x: 0, y: 0, z: 0, scale: 1.05, rot: 0, bright: 1 },
    { x: 300, y: 25, z: -150, scale: 0.9, rot: 4, bright: 0.8 },
    { x: 550, y: 50, z: -300, scale: 0.8, rot: 8, bright: 0.6 },
  ]

  function render() {
    items.forEach((item, i) => {
      const offset = (i - current + items.length) % items.length
      const pos = positions[offset] || { x: 0, y: 0, z: -400, scale: 0.7, rot: 0, bright: 0.4 }
      gsap.to(item, {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        scale: pos.scale,
        rotationY: pos.rot,
        filter: `brightness(${pos.bright})`,
        duration: 1.2,
        ease: "power3.inOut",
      })
    })
  }

  function next() {
    fecharCaixa()
    current = (current + 1) % items.length
    render()
  }

  function prev() {
    fecharCaixa()
    current = (current - 1 + items.length) % items.length
    render()
  }

  nextBtn.addEventListener("click", next)
  prevBtn.addEventListener("click", prev)
  render()

  // --- CAIXA DE DESCRIÇÃO ---
  const caixaCurso = document.getElementById("caixa-curso")
  const textoCurso = document.getElementById("texto-curso")

  function fecharCaixa() {
    if (caixaCurso.classList.contains("ativo")) {
      gsap.to(caixaCurso, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => caixaCurso.classList.remove("ativo"),
      })
    }
  }

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation()
      const descricao = item.dataset.descricao
      textoCurso.textContent = descricao

      // Fade-in animation from top to bottom
      gsap.fromTo(caixaCurso, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" })
      caixaCurso.classList.add("ativo")
    })
  })

  document.addEventListener("click", (e) => {
    if (!caixaCurso.contains(e.target) && !e.target.closest(".stair-item")) {
      fecharCaixa()
    }
  })
})

// ===================== ANIMAÇÕES FOOTER =====================
const QTD_ESTRELAS_RANDOM = 50
const adalineSection = document.getElementById("adaline-universe")
const containerNuvens = document.getElementById("container-nuvens")
const containerUniverso = document.getElementById("container-universo")
const containerChuva = document.getElementById("container-chuva")
const footerInfo = document.querySelector(".footer-info")
const fundoEstrelado = document.getElementById("fundo-estrelado")

let universoIniciado = false
let nuvensIniciadas = false
let nuvensCanvas, nuvensCtx
let effectsScene, effectsCamera, effectsRenderer, effectsMaterial, effectsMesh
const clock = new THREE.Clock()

function iniciarNuvens() {
  if (nuvensIniciadas) return
  nuvensIniciadas = true
  initNuvensThreeJS()
}

function initNuvensThreeJS() {
  nuvensCanvas = document.createElement("canvas")
  nuvensCanvas.id = "nuvens-threejs"
  containerNuvens.appendChild(nuvensCanvas)

  effectsScene = new THREE.Scene()
  effectsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  effectsMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_scroll: { value: 0.0 },
    },
    transparent: true,
  })

  const geometry = new THREE.PlaneBufferGeometry(2, 2)
  effectsMesh = new THREE.Mesh(geometry, effectsMaterial)
  effectsScene.add(effectsMesh)

  effectsRenderer = new THREE.WebGLRenderer({
    canvas: nuvensCanvas,
    alpha: true,
  })
  effectsRenderer.setPixelRatio(window.devicePixelRatio)

  const rect = containerNuvens.getBoundingClientRect()
  effectsRenderer.setSize(rect.width, rect.height)
  effectsMaterial.uniforms.u_resolution.value.set(rect.width, rect.height)

  animarNuvensThreeJS()
}

function animarNuvensThreeJS() {
  if (!effectsRenderer || !effectsMaterial) return
  effectsMaterial.uniforms.u_time.value = clock.getElapsedTime()
  effectsRenderer.render(effectsScene, effectsCamera)
  requestAnimationFrame(animarNuvensThreeJS)
}

function iniciarUniverso() {
  if (universoIniciado) return
  universoIniciado = true

  console.log("[v0] Iniciando universo - animando fundo estrelado")

  if (fundoEstrelado) {
    console.log("[v0] Fundo estrelado encontrado, criando estrelas")

    // Create 200 stars with varying sizes
    for (let i = 0; i < 200; i++) {
      const estrela = document.createElement("div")
      estrela.className = "estrela-fundo"

      // Random position
      estrela.style.left = Math.random() * 100 + "%"
      estrela.style.top = Math.random() * 100 + "%"

      // Random size (1-3px)
      const tamanho = 1 + Math.random() * 2
      estrela.style.width = tamanho + "px"
      estrela.style.height = tamanho + "px"

      // Random opacity for twinkling effect
      estrela.style.opacity = 0.5 + Math.random() * 0.5

      // Random animation delay for twinkling
      estrela.style.animationDelay = Math.random() * 3 + "s"

      fundoEstrelado.appendChild(estrela)
    }

    gsap.to(fundoEstrelado, {
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => console.log("[v0] Fundo estrelado animado com sucesso"),
    })
  } else {
    console.log("[v0] ERRO: Fundo estrelado não encontrado")
  }

  criarChuvaDeEstrelas()
  const intervaloChuva = setInterval(criarChuvaDeEstrelas, 2000)
  setTimeout(animarCruzeiroDoSul, 1000)
  setTimeout(() => clearInterval(intervaloChuva), 30000)
}

function criarChuvaDeEstrelas() {
  if (!containerChuva) return

  for (let i = 0; i < QTD_ESTRELAS_RANDOM / 5; i++) {
    const estrela = document.createElement("div")
    estrela.className = "estrela-random"
    const startY = Math.random() * 120 - 10
    const startX = 110 + Math.random() * 10
    estrela.style.top = startY + "%"
    estrela.style.left = startX + "%"
    containerChuva.appendChild(estrela)

    const atraso = Math.random() * 3
    const duracao = 1.5 + Math.random() * 0.1

    // Animação simultânea: tudo acontece ao mesmo tempo
    gsap
      .timeline({ delay: atraso })
      .to(estrela, {
        opacity: 1,
        x: "-140vw",
        duration: duracao,
        ease: "linear",
        onComplete: () => estrela.remove(),
      })
      .to(
        estrela,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        `-=0.3`,
      ) // Começa a desaparecer antes de terminar o movimento
  }
}

function animarCruzeiroDoSul() {
  const estrelas = ["cruzeiro-1", "cruzeiro-2", "cruzeiro-3", "cruzeiro-4", "cruzeiro-5"].map((id) =>
    document.getElementById(id),
  )

  estrelas.forEach((estrela, i) => {
    const delay = i * 0.1
    const brilho1 = document.createElement("div")
    const brilho2 = document.createElement("div")
    brilho1.className = "brilho"
    brilho2.className = "brilho invertido"
    estrela.appendChild(brilho1)
    estrela.appendChild(brilho2)

    gsap.fromTo(estrela, { y: -500, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay, ease: "power2.out" })
    gsap.fromTo(
      [brilho1, brilho2],
      { width: 0 },
      { width: 25, duration: 0.75, delay, ease: "power2.inOut", yoyo: true, repeat: 1 },
    )

    gsap.to(estrela, {
      duration: 0.5,
      delay: delay + 1.5,
      onComplete: () => {
        brilho1.remove()
        brilho2.remove()
        estrela.classList.add("estrela-pulsante")
        gsap.to(estrela, {
          scale: 1.3,
          boxShadow: "0 0 20px 3px white, 0 0 30px 5px rgba(255,255,255,0.3)",
          opacity: 1,
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      },
    })
  })
}

// ===================== OBSERVADORES PARA SECTION =====================
const observerNuvens = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) iniciarNuvens()
    })
  },
  { threshold: 0.1 },
)

const observerUniverso = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.4 && !universoIniciado) iniciarUniverso()
    })
  },
  { threshold: [0, 0.1, 0.2, 0.3, 0.4] },
)

const footerAnimado = document.getElementById("footer-animado")
const observerFooterAnimado = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.02) {
        entry.target.classList.add("visivel")
      }
    })
  },
  { threshold: 0.1 },
)

if (containerNuvens) observerNuvens.observe(containerNuvens)
if (containerUniverso) observerUniverso.observe(containerUniverso)
if (footerAnimado) observerFooterAnimado.observe(footerAnimado)

// ==================== LOADER ENTRE PÁGINAS ====================
function showLoader(callback) {
  const loader = document.getElementById("page-loader")
  const logo = loader.querySelector(".loader-logo")

  loader.style.pointerEvents = "auto"
  loader.style.display = "flex"

  gsap
    .timeline({
      onComplete: () => {
        if (callback) callback()
      },
    })
    .set(logo, { opacity: 0, scale: 0.7, rotation: 0 })
    .to(logo, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" })
    .to(logo, { rotation: 10, yoyo: true, repeat: 3, duration: 0.3, ease: "sine.inOut" })
    .to(logo, { opacity: 0, scale: 1.3, duration: 0.6, ease: "power2.in" })
    .to(loader, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        loader.style.display = "none"
        loader.style.opacity = 1
      },
    })
}

// Mostra loader ao carregar
window.addEventListener("load", () => showLoader())

// Mostra loader ao mudar de página
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href")
    // Only show loader if it's a different page (not an anchor link)
    if (href && !href.startsWith("#") && href !== window.location.pathname) {
      e.preventDefault()
      showLoader(() => {
        window.location.href = href
      })
    }
  })
})

