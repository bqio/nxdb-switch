const { createApp } = Vue;

function throttle(callee, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

function onImgErrorSmall(source) {
  source.src =
    "http://u.kanobu.ru/editor/images/68/3b613ae5-43cd-46fe-993c-665bac63a485.png";
  return true;
}

let app = createApp({
  data() {
    return {
      all: [],
      offset: 0,
      maxOffset: 15,
    };
  },
  methods: {
    resizeImage(url) {
      return url.replace("/0/0/", "/485/273/");
    },
    checkPosition() {
      const height = document.body.offsetHeight;
      const screenHeight = window.innerHeight;
      const scrolled = window.scrollY;
      const threshold = height - screenHeight / 2;
      const position = scrolled + screenHeight;

      if (position >= threshold) {
        this.maxOffset += 15;
      }
    },
    decode(text) {
      return he.decode(text);
    },
    open(magnet) {
      if (window.nx) {
        window.nx.sendMessage(`${magnet}\0`);
      }
    },
  },
  computed: {
    filteredTitles() {
      return this.all.slice(this.offset, this.maxOffset);
    },
  },
  async mounted() {
    const response = await fetch(
      "https://raw.githubusercontent.com/bqio/nxdb/main/nxdb1642450449771.json"
    );
    const json = await response.json();
    this.all = json.titles;
  },
}).mount("#app");

window.addEventListener("scroll", throttle(app.checkPosition, 1000));
