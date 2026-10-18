    // Year Auto Set
    document.getElementById("currentYear").textContent = new Date().getFullYear();

    // Mobile Drawer Navigation
    const mobileDrawer = document.getElementById("mobileDrawer");
    const openDrawerBtn = document.getElementById("openDrawer");
    const closeDrawerBtn = document.getElementById("closeDrawer");
    const mobileLinks = document.querySelectorAll(".mobile-item");

    openDrawerBtn.addEventListener("click", () => mobileDrawer.classList.add("active"));
    closeDrawerBtn.addEventListener("click", () => mobileDrawer.classList.remove("active"));
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => mobileDrawer.classList.remove("active"));
    });

    // Dynamic Top Navigation & Accurate Section Scroll-Spy
    const topNavBar = document.querySelector(".top-nav-bar");
    const navAnchors = document.querySelectorAll(".frosted-capsule a");

    function updateNavScrollSpy() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Navbar frosted glass state
      if (scrollY > vh * 0.4) {
        topNavBar.classList.add("nav-scrolled");
      } else {
        topNavBar.classList.remove("nav-scrolled");
      }

      // If user is anywhere in the top hero viewport, Home is guaranteed active
      let activeId = "home";
      if (scrollY >= vh * 0.5) {
        // Check from bottom section upwards using getBoundingClientRect
        const sectionsToCheck = ["bridal", "treatments", "about"];
        for (const id of sectionsToCheck) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= vh * 0.45) {
              activeId = id;
              break;
            }
          }
        }
      }

      navAnchors.forEach(a => {
        if (a.getAttribute("href") === "#" + activeId) {
          a.classList.add("active");
        } else {
          a.classList.remove("active");
        }
      });
    }

    window.addEventListener("scroll", updateNavScrollSpy, { passive: true });
    updateNavScrollSpy();

    /* ==========================================================================
       ATMOSPHERE AUTO-SWITCHER ENGINE WITH 3D LIGHT COORDINATION
       ========================================================================== */
    const atmospheresData = [
      {
        name: "Rose Glow",
        desc: "Luminous glass skin, rose quartz dewy flush, and sculptural purity.",
        pinkHex: 0xf472b6, // Bluish Pink
        blueHex: 0x93c5fd  // Powder Ice Blue
      },
      {
        name: "Ice Editorial",
        desc: "High-definition contouring, cool periwinkle accents, and modern allure.",
        pinkHex: 0xe879f9, // Orchid Blush Pink
        blueHex: 0x60a5fa  // Ice Sky Blue
      },
      {
        name: "Bridal Aura",
        desc: "Romantic blush bridal palette, diamond dewiness, and bespoke couture styling.",
        pinkHex: 0xfb7185, // Rose Petal
        blueHex: 0xffffff  // Diamond White
      },
      {
        name: "Regal Splendor",
        desc: "Majestic bridal attire, heavy royal jewelry, opulent zardozi embroidery, and timeless poise.",
        pinkHex: 0xec4899, // Royal Fuchsia Pink
        blueHex: 0xa5b4fc  // Royal Periwinkle
      }
    ];

    let currentAtmosphereIdx = 0;
    let atmosphereTimerId = null;
    const SWITCH_INTERVAL = 5000; // 5 Seconds

    const slides = document.querySelectorAll(".atmosphere-slide");
    const buttons = document.querySelectorAll(".look-pill-btn");
    const moodCaption = document.getElementById("atmosphereCaption");

    function clearAtmosphereTimer() {
      if (atmosphereTimerId) {
        clearInterval(atmosphereTimerId);
        atmosphereTimerId = null;
      }
    }

    function resetAtmosphereTimer() {
      clearAtmosphereTimer();
      atmosphereTimerId = setInterval(advanceAtmosphere, SWITCH_INTERVAL);
    }

    function setAtmosphere(index) {
      if (index < 0 || index >= atmospheresData.length) index = 0;
      currentAtmosphereIdx = index;

      // Crossfade slides with proper z-index layering
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add("active");
          slide.style.zIndex = "2";
        } else {
          slide.classList.remove("active");
          slide.style.zIndex = "1";
        }
      });

      // Synchronize button active states and restart animation cleanly via layout reflow
      buttons.forEach((btn, i) => {
        const timerFill = btn.querySelector(".pill-timer-fill");
        if (i === index) {
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");
          if (timerFill) {
            timerFill.style.animation = "none";
            void timerFill.offsetWidth; // Force synchronous layout reflow to restart animation
            timerFill.style.animation = "";
          }
        } else {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
          if (timerFill) {
            timerFill.style.animation = "none";
          }
        }
      });

      // Smooth Caption Update
      if (moodCaption && atmospheresData[index]) {
        moodCaption.style.opacity = "0";
        setTimeout(() => {
          moodCaption.textContent = atmospheresData[index].desc;
          moodCaption.style.opacity = "1";
        }, 220);
      }

      // Coordinate Three.js 3D Lighting
      if (window.update3DLighting && atmospheresData[index]) {
        window.update3DLighting(atmospheresData[index].pinkHex, atmospheresData[index].blueHex);
      }
    }

    function advanceAtmosphere() {
      const nextIdx = (currentAtmosphereIdx + 1) % atmospheresData.length;
      setAtmosphere(nextIdx);
    }

    function startAtmosphereLoop() {
      setAtmosphere(currentAtmosphereIdx);
      resetAtmosphereTimer();
    }

    // User manual click on any atmosphere button: immediate switch + fresh timer reset
    window.userSelectAtmosphere = function(index) {
      setAtmosphere(index);
      resetAtmosphereTimer();
    };

    // Synchronize transitions with Tab Visibility (prevents freeze/desync when switching tabs)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearAtmosphereTimer();
      } else {
        setAtmosphere(currentAtmosphereIdx);
        resetAtmosphereTimer();
      }
    });

    // Window focus safety handler to ensure the timer stays active
    window.addEventListener("focus", () => {
      if (!atmosphereTimerId && !document.hidden) {
        resetAtmosphereTimer();
      }
    });

    // Preload atmosphere slide images so transitions are instant without blank flashes
    function preloadAtmosphereAssets() {
      const slideImages = document.querySelectorAll(".hero-atmosphere-stage img");
      slideImages.forEach(img => {
        if (img.src) {
          const preloader = new Image();
          preloader.src = img.src;
        }
      });
    }

    /* ==========================================================================
       THREE.JS 3D WEBGL AMBIENT LUXURY CANVAS (BLUISH PINK & ICE BLUE LIGHTING)
       ========================================================================== */
    function initThreeAmbient() {
      const canvas = document.getElementById("three-fullscreen-canvas");
      if (!canvas || typeof THREE === "undefined") return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 24;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Shimmering Diamond & Rose Sparkle Dust Particles
      const count = 220;
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 58;
        positions[i + 1] = (Math.random() - 0.5) * 52;
        positions[i + 2] = (Math.random() - 0.5) * 42;
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.18,
        color: 0xffffff,
        transparent: true,
        opacity: 0.72
      });
      const particleCloud = new THREE.Points(geo, mat);
      scene.add(particleCloud);

      // Ambient Point Lights (Interpolate with atmosphere)
      // Light 1: Bluish-Pink Glow
      const pinkLight = new THREE.PointLight(0xf472b6, 3.5, 50);
      pinkLight.position.set(12, 8, 9);
      scene.add(pinkLight);

      // Light 2: Powder Ice-Blue Glow
      const blueLight = new THREE.PointLight(0x93c5fd, 2.8, 52);
      blueLight.position.set(-14, -8, -4);
      scene.add(blueLight);

      // Light 3: Diamond White Specular Sparkle
      const whiteLight = new THREE.PointLight(0xffffff, 1.2, 40);
      whiteLight.position.set(0, 14, 6);
      scene.add(whiteLight);

      // Expose lighting update hook for atmosphere transitions
      let targetPinkColor = new THREE.Color(0xf472b6);
      let targetBlueColor = new THREE.Color(0x93c5fd);

      window.update3DLighting = function(pinkHex, blueHex) {
        targetPinkColor.setHex(pinkHex);
        targetBlueColor.setHex(blueHex);
      };

      // Cursor and scroll tracking for continuous 3D spatial flow
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let currentScrollY = 0;
      let targetScrollY = 0;

      window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      window.addEventListener("scroll", () => {
        targetScrollY = window.scrollY;
      }, { passive: true });

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      function animate() {
        requestAnimationFrame(animate);
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        currentScrollY += (targetScrollY - currentScrollY) * 0.05;

        // Smooth lighting color interpolation
        pinkLight.color.lerp(targetPinkColor, 0.035);
        blueLight.color.lerp(targetBlueColor, 0.035);

        // Fluid 3D particle motion tied to scroll across all sections
        particleCloud.rotation.y = -performance.now() * 0.00012 - currentScrollY * 0.00025;
        particleCloud.rotation.x = currentScrollY * 0.00015;
        particleCloud.position.y = (currentScrollY * 0.008) % 12 - 6;

        pinkLight.position.x = 12 + targetX * 7;
        pinkLight.position.y = 8 + targetY * 7;

        blueLight.position.x = -14 - targetX * 5;
        blueLight.position.y = -8 - targetY * 5;

        renderer.render(scene, camera);
      }
      animate();
    }

    function initAtmosphereExperience() {
      preloadAtmosphereAssets();
      initThreeAmbient();
      startAtmosphereLoop();
    }

    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", initAtmosphereExperience);
    } else {
      initAtmosphereExperience();
    }
