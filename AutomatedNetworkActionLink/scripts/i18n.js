/* ==========================================================================
   i18n — ES (default) / EN toggle
   - Elements with [data-i18n="key"] pick up text/html from dictionary.
   - Elements with [data-i18n-attr="attrName"] get the key applied to that
     attribute instead of textContent (e.g. alt, content, aria-label).
   - Preference is persisted in localStorage under "anal.lang".
   ========================================================================== */

(function () {
  const STORAGE_KEY = "anal.lang";
  const DEFAULT_LANG = "es";
  const SUPPORTED = ["es", "en"];

  const DICT = {
    es: {
      "meta.title": "A.N.A.L. — Automated Network Action Link",
      "meta.description": "A.N.A.L. — Automated Network Action Link. Dispositivos físicos que tu chat de Twitch activa en vivo mediante channel point rewards y alertas.",

      "nav.brandSub": "AUTOMATED NETWORK ACTION LINK",
      "nav.what": "Qué es",
      "nav.how": "Cómo funciona",
      "nav.devices": "Dispositivos",
      "nav.demo": "En acción",
      "nav.about": "Sobre mí",
      "nav.contact": "Contacto",
      "nav.cta": "Contáctame",

      "hero.eyebrow": "MOD.01 // CHANNEL POINTS × HARDWARE",
      "hero.title1": "AUTOMATED",
      "hero.title2": "NETWORK ACTION",
      "hero.title3": "LINK",
      "hero.subtitle": "El puente entre tu chat y el mundo físico. Channel points, donaciones y alertas que disparan dispositivos reales durante tu stream.",
      "hero.primaryCta": "Pide el tuyo",
      "hero.secondaryCta": "Ver en acción",
      "hero.spec1Label": "DISPOSITIVOS",
      "hero.spec1Value": "Custom · Ready-made",
      "hero.spec2Label": "LATENCIA",
      "hero.spec2Value": "< 1 s",
      "hero.spec3Label": "INTEGRA",
      "hero.spec3Value": "Twitch · LIVE",
      "hero.panelLabel": "LIVE FEED / DEMO",
      "hero.tickerLabel": "EVENT STREAM",
      "hero.rail1": "TWITCH-COMPLIANT",
      "hero.rail2": "OPEN HARDWARE",
      "hero.rail3": "HECHO A MANO",

      "ticker.dev1": 'Máquina de "cosquillas"',
      "ticker.dev2": "Spray ×3",
      "ticker.dev3": "Control bloqueado 5s",
      "ticker.dev4": "Flash rojo",
      "ticker.dev5": "Fanfare",

      "proof.eyebrow": "SIGNAL // CHAT REAL",
      "proof.title": "El chat pierde la cabeza.",

      "what.eyebrow": "MOD.02 // QUÉ ES",
      "what.title": "Tu chat ya interactúa. Ahora puede activar cosas.",
      "what.body": "A.N.A.L. conecta los rewards y alertas de Twitch con dispositivos físicos construidos a medida. Tus espectadores canjean puntos, donan, se suscriben — y algo pasa en tu habitación. En vivo. Al instante.",
      "what.feat1.title": "Hardware real",
      "what.feat1.body": "Dispositivos reales controlados por MCUs (Raspberry Pi, Orange Pi, ESP32). No plugins ni overlays: cosas que se mueven, se iluminan, disparan.",
      "what.feat2.title": "Totalmente custom",
      "what.feat2.body": "Te armo uno de los que ya tengo o te diseño uno nuevo para tu stream. Si se puede imaginar y la física lo permite, lo hacemos.",
      "what.feat3.title": "Pensado para Twitch",
      "what.feat3.body": "Se integra con channel point rewards, donaciones, follows, suscripciones, hype trains. Lo que sea que active tu comunidad.",
      "what.proofTitle": "PRUEBA SOCIAL // CHAT REAL",
      "what.proofAlt1": "Captura del chat de Twitch diciendo que es divertido",
      "what.proofCap1": "El chat declarando en vivo que está divertido.",
      "what.proofAlt2": "Captura del chat de Twitch prometiendo regalar subs",
      "what.proofCap2": "Viewer prometiendo regalar subs para activar el dispositivo.",

      "how.eyebrow": "MOD.03 // FLUJO",
      "how.title": "De un click a una acción física en < 1 s",
      "how.step1": "VIEWER",
      "how.step1Sub": "canjea reward / dona / se suscribe",
      "how.step2": "TWITCH",
      "how.step2Sub": "evento enviado vía API",
      "how.step3": "MCU",
      "how.step3Sub": "RPi · Orange Pi · ESP32",
      "how.step4": "DISPOSITIVO",
      "how.step4Sub": "se enciende, se mueve, dispara",

      "devices.eyebrow": "MOD.04 // INVENTARIO",
      "devices.title": "Los dispositivos",
      "devices.subtitle": "Catálogo inicial. Construyo más a pedido.",
      "devices.control.trigger": "REWARD · CONGELAR / INVERTIR",
      "devices.control.name": "Automatizador de Control",
      "devices.control.desc": "Interviene tu control de consola en vivo: congela botones, invierte o randomiza inputs según el reward.",
      "devices.toques.trigger": 'REWARD · "COSQUILLAS"',
      "devices.toques.name": 'Máquina de "Cosquillas"',
      "devices.toques.desc": "Dispositivo que da un toque (eléctrico leve) cuando el chat lo canjea. Reacción garantizada.",
      "devices.spray.trigger": "REWARD · SPRAY",
      "devices.spray.name": "Reward de Spray",
      "devices.spray.desc": "Rocía al streamer. Perfecto para el verano, para hacerte reaccionar, o solo para molestar.",
      "devices.custom.tag": "ON DEMAND",
      "devices.custom.name": "¿Tienes otra idea?",
      "devices.custom.desc": "Diseño y construyo dispositivos desde cero. Si se puede cablear, se puede activar desde tu chat.",
      "devices.custom.cta": "Proponer uno",
      "devices.bandText": "¿Viste uno que te guste? Armamos el tuyo.",
      "devices.bandCta": "Escríbeme",

      "demo.eyebrow": "MOD.05 // EN ACCIÓN",
      "demo.title": "Míralo funcionar",
      "demo.pitchTitle": "Pitch para streamers",
      "demo.pitchDesc": "2 minutos. Qué es, cómo lo uso y por qué a tu chat le va a encantar.",
      "demo.devicesTitle": "Dispositivos en acción",
      "demo.devicesDesc": "Recorrido por los dispositivos que ya tengo funcionando.",
      "demo.clipsTitle": "Redeems reales",
      "demo.clipsDesc": "Clips cortos de activaciones en vivo.",
      "demo.clip1": 'Máquina de "cosquillas" activándose.',
      "demo.clip2": "Control congelado en pleno juego.",
      "demo.clip3": "Spray disparando.",

      "about.eyebrow": "MOD.06 // OPERADOR",
      "about.title": "El que construye esto",
      "about.portraitAlt": "Eiram Araujo junto a uno de los dispositivos A.N.A.L.",
      "about.role": "Hardware · Firmware · Integración",
      "about.body": "Soy Eiram Araujo. Diseño y construyo dispositivos electrónicos custom. Si tienes una idea de reward físico para tu stream, la hacemos realidad: diseño de hardware, firmware del MCU, integración con Twitch. Dispositivos existentes o desde cero.",
      "about.listTitle": "Lo que puedo construir",
      "about.list1": "Dispositivos del inventario, listos para integrar.",
      "about.list2": "Hardware custom diseñado específicamente para tu idea.",
      "about.list3": "Integración con Twitch API.",
      "about.list4": "Firmware sobre Raspberry Pi, Orange Pi, ESP32, Arduino.",

      "contact.eyebrow": "MOD.07 // CONTACTO",
      "contact.title": "Listo para que tu chat haga algo más que escribir",
      "contact.body": "Los precios se discuten contigo según qué tipo de dispositivo quieras y cuán custom sea. Escríbeme y hablamos.",
      "contact.emailLabel": "EMAIL",
      "contact.copyBtn": "Copiar email",
      "contact.copyDone": "Copiado ✓",
      "contact.mailBtn": "Abrir en cliente",
      "contact.note": "Respondo en 24–48h.",

      "footer.tag": "Automated Network Action Link · Hecho a mano",
      "footer.disclaimer": "Sí, soy consciente del acrónimo. Ese es el punto."
    },

    en: {
      "meta.title": "A.N.A.L. — Automated Network Action Link",
      "meta.description": "A.N.A.L. — Automated Network Action Link. Physical devices your Twitch chat triggers live via channel point rewards and alerts.",

      "nav.brandSub": "AUTOMATED NETWORK ACTION LINK",
      "nav.what": "What",
      "nav.how": "How it works",
      "nav.devices": "Devices",
      "nav.demo": "In action",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.cta": "Get in touch",

      "hero.eyebrow": "MOD.01 // CHANNEL POINTS × HARDWARE",
      "hero.title1": "AUTOMATED",
      "hero.title2": "NETWORK ACTION",
      "hero.title3": "LINK",
      "hero.subtitle": "The bridge between your chat and the physical world. Channel points, donations and alerts fire real devices live on your stream.",
      "hero.primaryCta": "Commission one",
      "hero.secondaryCta": "See it live",
      "hero.spec1Label": "DEVICES",
      "hero.spec1Value": "Custom · Ready-made",
      "hero.spec2Label": "LATENCY",
      "hero.spec2Value": "< 1 s",
      "hero.spec3Label": "INTEGRATES",
      "hero.spec3Value": "Twitch · LIVE",
      "hero.panelLabel": "LIVE FEED / DEMO",
      "hero.tickerLabel": "EVENT STREAM",
      "hero.rail1": "TWITCH-COMPLIANT",
      "hero.rail2": "OPEN HARDWARE",
      "hero.rail3": "HAND-ASSEMBLED",

      "ticker.dev1": '"Tickle" machine',
      "ticker.dev2": "Spray ×3",
      "ticker.dev3": "Controller freezed 5s",
      "ticker.dev4": "Red flash",
      "ticker.dev5": "Fanfare",

      "proof.eyebrow": "SIGNAL // REAL CHAT",
      "proof.title": "Chat loses it.",

      "what.eyebrow": "MOD.02 // WHAT IT IS",
      "what.title": "Your chat already interacts. Now it can trigger things.",
      "what.body": "A.N.A.L. links Twitch rewards and alerts to custom-built physical devices. Your viewers redeem points, donate, subscribe — and something happens in your room. Live. Instantly.",
      "what.feat1.title": "Real hardware",
      "what.feat1.body": "Actual devices controlled by MCUs (Raspberry Pi, Orange Pi, ESP32). No plugins, no overlays: things that move, light up, fire.",
      "what.feat2.title": "Fully custom",
      "what.feat2.body": "I provide devices I already have or design and build a new one for your stream. If you can imagine it and physics allows, we make it.",
      "what.feat3.title": "Built for Twitch",
      "what.feat3.body": "Integrates with channel point rewards, donations, follows, subs, hype trains. Whatever gets your community going.",
      "what.proofTitle": "SOCIAL PROOF // REAL CHAT",
      "what.proofAlt1": "Twitch chat saying the device is fun",
      "what.proofCap1": "Chat literally calling it fun on a live stream.",
      "what.proofAlt2": "Twitch chat promising to gift subs to trigger the device",
      "what.proofCap2": "Viewer offering to gift subs just to fire the device.",

      "how.eyebrow": "MOD.03 // FLOW",
      "how.title": "From a click to a physical action in < 1 s",
      "how.step1": "VIEWER",
      "how.step1Sub": "redeems / donates / subscribes",
      "how.step2": "TWITCH",
      "how.step2Sub": "event pushed via API",
      "how.step3": "MCU",
      "how.step3Sub": "RPi · Orange Pi · ESP32",
      "how.step4": "DEVICE",
      "how.step4Sub": "lights up, moves, fires",

      "devices.eyebrow": "MOD.04 // INVENTORY",
      "devices.title": "The devices",
      "devices.subtitle": "Starting catalog. I build more on demand.",
      "devices.control.trigger": "REWARD · FREEZE / INVERT",
      "devices.control.name": "Controller Automator",
      "devices.control.desc": "Takes over your console controller live: Freeze buttons, inverts or randomizes inputs based on the reward.",
      "devices.toques.trigger": 'REWARD · "TICKLES"',
      "devices.toques.name": '"Tickle" Machine',
      "devices.toques.desc": "Delivers a light electric zap when chat redeems it. Reaction guaranteed.",
      "devices.spray.trigger": "REWARD · SPRAY",
      "devices.spray.name": "Spray Reward",
      "devices.spray.desc": "Sprays the streamer. Perfect for summer, to jolt a reaction, or just to annoy.",
      "devices.custom.tag": "ON DEMAND",
      "devices.custom.name": "Got another idea?",
      "devices.custom.desc": "I design and build devices from scratch. If it can be wired, your chat can trigger it.",
      "devices.custom.cta": "Pitch one",
      "devices.bandText": "See one you like? Let's build yours.",
      "devices.bandCta": "Email me",

      "demo.eyebrow": "MOD.05 // IN ACTION",
      "demo.title": "Watch it run",
      "demo.pitchTitle": "Streamer pitch",
      "demo.pitchDesc": "2 minutes. What it is, how I use it, why your chat will love it.",
      "demo.devicesTitle": "Devices in action",
      "demo.devicesDesc": "A tour of the devices I already have running.",
      "demo.clipsTitle": "Real redeems",
      "demo.clipsDesc": "Short clips of live activations.",
      "demo.clip1": '"Tickle" machine firing.',
      "demo.clip2": "Controller locked mid-match.",
      "demo.clip3": "Spray going off.",

      "about.eyebrow": "MOD.06 // OPERATOR",
      "about.title": "The one who builds this",
      "about.portraitAlt": "Eiram Araujo next to one of the A.N.A.L. devices",
      "about.role": "Hardware · Firmware · Integration",
      "about.body": "I'm Eiram Araujo. I design and build custom electronic devices. If you have an idea for a physical reward on your stream, we make it real: hardware design, MCU firmware, Twitch integration. Existing devices or from scratch.",
      "about.listTitle": "What I can build",
      "about.list1": "Inventory devices, ready to integrate.",
      "about.list2": "Custom hardware designed specifically around your idea.",
      "about.list3": "Integration with Twitch API.",
      "about.list4": "Firmware on Raspberry Pi, Orange Pi, ESP32, Arduino.",

      "contact.eyebrow": "MOD.07 // CONTACT",
      "contact.title": "Ready for chat to do more than type",
      "contact.body": "Pricing is discussed with you based on the kind of device and how custom it is. Reach out and we'll talk.",
      "contact.emailLabel": "EMAIL",
      "contact.copyBtn": "Copy email",
      "contact.copyDone": "Copied ✓",
      "contact.mailBtn": "Open in client",
      "contact.note": "I reply within 24–48h.",

      "footer.tag": "Automated Network Action Link · Hand-assembled",
      "footer.disclaimer": "Yes, I'm aware of the acronym. That's the point."
    }
  };

  function detectInitialLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("en")) return "en";
    return DEFAULT_LANG;
  }

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    const dict = DICT[lang];

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = dict[key];
      if (value == null) return;

      const attr = el.getAttribute("data-i18n-attr");
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });

    // visual toggle state
    document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function bindToggle() {
    document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.dataset.lang));
    });
  }

  // expose for main.js (e.g. copy button needs fresh label)
  window.ANAL_i18n = {
    get lang() { return document.documentElement.lang || DEFAULT_LANG; },
    t(key) { return (DICT[this.lang] && DICT[this.lang][key]) || key; },
    apply: applyLang
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(detectInitialLang());
    bindToggle();
  });
})();
