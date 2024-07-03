// sticky header

let header = document.querySelector("header");
let backtop = document.querySelector("back-to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.classList.add("header-fixed");
    backtop.classList.add("show-backTop");
  } else {
    header.classList.remove("header-fixed");
    backtop.classList.remove("show-backTop");
  }
});
let copied = document.querySelector(".copied");
class iconElement extends HTMLElement {
  constructor() {
    super();
    this.svg = this.querySelector("svg");
    this.svgContent = this.svg.outerHTML;

    this.addEventListener("click", () => {
      const TempText = document.createElement("input");
      TempText.value = this.svgContent;
      document.body.appendChild(TempText);
      TempText.select();
      document.execCommand("copy");
      document.body.removeChild(TempText);
      copied.classList.add("show-copied");
      setTimeout(() => {
        copied.classList.remove("show-copied");
      }, 500);
    });
  }
}
customElements.define("icon-element", iconElement);

class BackToTop extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
customElements.define("back-to-top", BackToTop);

class SearchHandle extends HTMLElement {
  constructor() {
    super();
    this.inp = this.querySelector('input[name="search"]');
    this.close_btn = this.querySelector(".close");
    this.preview = document.querySelector(".preview");
    this.result = document.querySelector(".search-result");
    this.arrIcons = this.preview.querySelectorAll("icon-element");
    this.not_found = document.querySelector('.no-results');
    this.arrIcons_obj = [];

    this.arrIcons.forEach((icon) => {
      this.arrIcons_obj.push({
        name: icon.querySelector(".icon_text").innerHTML,
        data: icon,
      });
    });
    const uniqueObject = this.arrIcons_obj.reduce((acc, item) => {
      if (!acc[JSON.stringify(item)]) {
        acc[JSON.stringify(item)] = item;
      }
      return acc;
    }, {});
    this.uniqueArray = Object.values(uniqueObject);

    if (!this.inp || !this.close_btn || !this.preview || !this.result) {
      return;
    }

    this.inp.addEventListener("input", (e) => {
      this.handleSearch(e.target.value);
    });
    this.close_btn.addEventListener('click', ()=>{
      this.clearSearch();
      this.handleSearch('');
    })
  }
  handleSearch(value) {
    if (value) {
      this.preview.style.display = "none";
      this.not_found.style.display="none";
      this.result.style.display = "grid";
      this.close_btn.style.display= "block";
      this.result.innerHTML = null;
      let count =0;

      this.uniqueArray.map((item) => {
        if (
          item.name.toLowerCase().trim().includes(value.toLowerCase().trim())
        ) {
          const node_clone = item.data.cloneNode(true);
          this.result.insertAdjacentElement("afterbegin", node_clone);
          count += 1;
        }
      });
      if(count == 0){
        this.not_found.style.display="block";
      }

    } else {
      this.preview.style.display = "block";
      this.result.style.display = "none";
      this.close_btn.style.display= "none";
      this.not_found.style.display="none";
    }
  }
  clearSearch(){
    this.inp.value = '';
  }
}
customElements.define("form-search", SearchHandle);
