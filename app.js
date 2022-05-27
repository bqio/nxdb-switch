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
  source.src = "nintendo.png";
  return true;
}

const app = createApp({
  data() {
    return {
      all: [],
      offset: 0,
      maxOffset: 15,
    };
  },
  methods: {
    getImage(uid) {
      return `https://tinfoil.media/thi/${uid}/485/273/`;
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
      } else {
        alert("window.nx is undefined.");
      }
    },
  },
  computed: {
    filteredTitles() {
      return this.all
        .filter((title) => {
          if (title.uid != -1 && !title.title.includes("[УДАЛЕНО]")) {
            return true;
          }
          return false;
        })
        .slice(this.offset, this.maxOffset);
    },
  },
  async mounted() {
    const response = await fetch("nxdb_data/nxdb.json");
    const json = await response.json();
    this.all = json;
  },
}).mount("#app");

window.addEventListener("scroll", throttle(app.checkPosition, 1000));
