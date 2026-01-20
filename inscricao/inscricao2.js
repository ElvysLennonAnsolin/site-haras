/* inscricao.js — carousel fluido + hero + modals + blur control */
document.addEventListener("DOMContentLoaded", () => {
  // ==================== SLIDES DE FUNDO COM TRANSITION FLUIDA ====================
  const slides = [
    { src: "./imagens/fundo1.png", text: "Viva a experiência equestre perfeita." },
    { src: "./imagens/fundo2.jpg", text: "Conecte-se com a elegância e a força do cavalo." },
    { src: "./imagens/fundo3.png", text: "Salto, adestramento e liberdade tudo em um só lugar." },
    { src: "./imagens/fundo4.jpg", text: "Trilhas e cuidados: bem-estar animal em primeiro lugar." },
  ]

  const bgImage1 = document.getElementById("bgImage1")
  const bgImage2 = document.getElementById("bgImage2")
  const heroText = document.getElementById("heroText")
  const slideText = document.querySelector(".slide-text")

  let currentSlide = 0
  let transitioning = false
  let timer
  let currentActive = bgImage1
  let nextImage = bgImage2

  function preloadImages() {
    slides.forEach((slide) => {
      const img = new Image()
      img.src = slide.src
    })
  }

  preloadImages()

  function nextSlide() {
    if (transitioning || !slides.length) return

    transitioning = true
    currentSlide = (currentSlide + 1) % slides.length
    const slide = slides[currentSlide]

    nextImage.src = slide.src
    nextImage.classList.add("active")
    currentActive.classList.remove("active")

    if (heroText) heroText.textContent = slide.text
    if (slideText) slideText.textContent = slide.text

    updateCarouselIndicators()
    ;[currentActive, nextImage] = [nextImage, currentActive]

    setTimeout(() => {
      transitioning = false
    }, 1500)
  }

  function startTimer() {
    timer = setInterval(nextSlide, 5000)
  }

  function stopTimer() {
    clearInterval(timer)
  }

  function initCarouselIndicators() {
    const indicatorsContainer = document.createElement("div")
    indicatorsContainer.className = "carousel-indicators"

    slides.forEach((_, index) => {
      const indicator = document.createElement("div")
      indicator.className = `carousel-indicator ${index === 0 ? "active" : ""}`
      indicator.addEventListener("click", () => {
        goToSlide(index)
      })
      indicatorsContainer.appendChild(indicator)
    })

    document.querySelector(".bg-viewport").appendChild(indicatorsContainer)
  }

  function updateCarouselIndicators() {
    const indicators = document.querySelectorAll(".carousel-indicator")
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide)
    })
  }

  function goToSlide(index) {
    if (transitioning || index === currentSlide) return

    transitioning = true
    currentSlide = index
    const slide = slides[currentSlide]

    nextImage.src = slide.src
    nextImage.classList.add("active")
    currentActive.classList.remove("active")

    if (heroText) heroText.textContent = slide.text
    if (slideText) slideText.textContent = slide.text

    updateCarouselIndicators()
    ;[currentActive, nextImage] = [nextImage, currentActive]

    stopTimer()
    startTimer()

    setTimeout(() => {
      transitioning = false
    }, 1500)
  }

  initCarouselIndicators()
  setTimeout(() => {
    startTimer()
  }, 1000)

  document.addEventListener("mouseenter", stopTimer)
  document.addEventListener("mouseleave", startTimer)

  // ==================== NAVEGAÇÃO POR ABAS ====================
  function initTabNavigation() {
    const tabButtons = document.querySelectorAll(".course-menu-item")
    const cursoSelect = document.getElementById("cursoSelect")

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        tabButtons.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")

        const tabName = this.getAttribute("data-tab")
        if (cursoSelect) {
          cursoSelect.value = tabName
          cursoSelect.dispatchEvent(new Event("change"))
        }
      })
    })
  }

  initTabNavigation()

  // ==================== SISTEMA DE MODAIS ====================
  const gsap = window.gsap

  function closeAllModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.add("hidden")
    })

    if (gsap && bgImage1 && bgImage2) {
      gsap.to([bgImage1, bgImage2], {
        duration: 0.6,
        filter: "blur(0px) saturate(1)",
        scale: 1,
        ease: "power3.out",
      })
    }

    document.body.style.overflow = ""
    startTimer()
  }

  function openModalById(id, buttonElement) {
    closeAllModals()

    const modal = document.getElementById(id)
    if (!modal) return

    modal.classList.remove("hidden")

    if (buttonElement) {
      const buttonRect = buttonElement.getBoundingClientRect()
      const modalCard = modal.querySelector(".modal-card")

      if (modalCard) {
        const top = buttonRect.bottom + 10
        const left = buttonRect.left

        modalCard.style.position = "absolute"
        modalCard.style.top = top + "px"
        modalCard.style.left = left + "px"

        setTimeout(() => {
          const modalWidth = modalCard.offsetWidth
          const modalRight = left + modalWidth

          if (modalRight > window.innerWidth) {
            modalCard.style.left = window.innerWidth - modalWidth - 20 + "px"
          }

          const modalHeight = modalCard.offsetHeight
          const modalBottom = top + modalHeight

          if (modalBottom > window.innerHeight) {
            modalCard.style.top = window.innerHeight - modalHeight - 20 + "px"
          }
        }, 10)
      }
    }

    if (gsap && bgImage1 && bgImage2) {
      gsap.to([bgImage1, bgImage2], {
        duration: 0.6,
        filter: "blur(6px) saturate(1.05)",
        scale: 1.02,
        ease: "power3.out",
      })
    }

    const modalCard = modal.querySelector(".modal-card")
    if (modalCard && gsap) {
      gsap.fromTo(
        modalCard,
        { y: 20, opacity: 0, scale: 0.98 },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "back.out(1.0)",
        },
      )
    }

    document.body.style.overflow = "hidden"
    stopTimer()
  }

  function closeModal(el) {
    const modal = el.closest(".modal")
    if (!modal) return

    if (gsap && bgImage1 && bgImage2) {
      gsap.to([bgImage1, bgImage2], {
        duration: 0.6,
        filter: "blur(0px) saturate(1)",
        scale: 1,
        ease: "power3.out",
      })
    }

    modal.classList.add("hidden")
    document.body.style.overflow = ""
    startTimer()
  }

  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modalId = btn.getAttribute("data-open")
      openModalById(modalId, btn)
    })
  })

  const homeBtn = document.getElementById("homeBtn")
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "../index.html"
    })
  }

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      closeModal(btn)
    })
  })

  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        closeModal(m)
      }
    })
  })

  // ==================== FORM HANDLERS ====================
  document.getElementById("formPasseio").addEventListener("submit", (e) => {
    e.preventDefault()
    alert("Reserva enviada (protótipo). Integre com backend para envio real.")
    closeModal(e.target)
    e.target.reset()
  })

  document.getElementById("formHotelaria").addEventListener("submit", (e) => {
    e.preventDefault()
    alert("Pedido de hotelaria enviado (protótipo).")
    closeModal(e.target)
    e.target.reset()
  })

  const cursoSelect = document.getElementById("cursoSelect")
  const cursoConditional = document.getElementById("cursoConditional")
  const cursoPreco = document.getElementById("cursoPreco")
  const RATES = {
    salto: 150,
    adestramento: 120,
    redes: 100,
    ecoterapia: 200,
    iniciante: 80,
    avancado: 180,
    mensalBase: 400,
  }

  if (cursoSelect) {
    cursoSelect.addEventListener("change", (e) => {
      const v = e.target.value
      if (["salto", "adestramento", "redes", "iniciante", "avancado", "ecoterapia"].includes(v)) {
        cursoConditional.classList.remove("hidden")
        if (v === "ecoterapia") {
          cursoPreco.textContent = `Mensalidade base: R$ ${RATES.mensalBase.toFixed(2)}`
        } else {
          cursoPreco.textContent = `Preço estimado por aula: R$ ${RATES[v].toFixed(2)}`
        }
      } else {
        cursoConditional.classList.add("hidden")
        cursoPreco.textContent = "—"
      }
    })
  }

  document.getElementById("formCursos").addEventListener("submit", (e) => {
    e.preventDefault()
    alert("Inscrição enviada (protótipo).")
    closeModal(e.target)
    e.target.reset()
  })

  document.getElementById("formLogin").addEventListener("submit", (e) => {
    e.preventDefault()
    alert("Login (protótipo).")
    closeModal(e.target)
    e.target.reset()
  })
})
