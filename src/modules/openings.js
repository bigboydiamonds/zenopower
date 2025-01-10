// [data-svg-loc="seattle"]
// [data-svg-loc="washington"]
// [data-svg-loc-def]

export class Openings {
  constructor(el) {
    // console.log("openings", el);

    this.el = el;

    // manage url creation
    const urls = document.querySelectorAll("[data-url]");
    urls.forEach((item, i) => {
      item.href = item.href + item.dataset.url;
    });
    // manage url creation

    this.filters = [
      ...this.el.querySelectorAll(
        '[data-filter="locations"] , [data-filter="department"]'
      ),
    ];

    this.filterData = {
      locations: [],
      departments: [],
    };

    this.items = [...this.el.querySelectorAll("[data-filter='item']")].map(
      (it, i) => {
        const location = it.querySelector("[data-filter-location]").textContent;

        if (!this.filterData.locations.includes(location)) {
          this.filterData.locations.push(location);
        }

        return {
          item: it,
          location,
          index: i,
        };
      }
    );

    // set filters (1/2)
    this.filterData.locations.forEach((loc) => {
      // console.log(loc);
      const el = this.filters[0].children[1].children[0].cloneNode(true);
      el.textContent = loc;
      this.filters[0].children[1].appendChild(el);
      el.onclick = () => this.filterItems("locations", loc);
    });

    // reset base
    this.filters[0].children[1].children[0].onclick = () =>
      this.filterItems("locations", "all");

    // create dropdowns
    this.filters.forEach((filter) => {
      filter.onclick = (e) => {
        e.stopPropagation();
        // console.log("click", filter);
        filter.classList.toggle("active");
      };
    });
  }

  filterItems(filter, data) {
    // console.log(filter, data);

    if (filter === "locations") {
      this.items.forEach((it) => {
        if (data === "all") {
          it.item.style.display = "flex";
        } else {
          it.item.style.display = it.location === data ? "flex" : "none";
        }
      });
    }
  }

  destroy() {
    // console.log("destroy openings");

    this.filterData.forEach((filter) => {
      filter.onclick = null;
    });

    this.filters.forEach((filter) => {
      filter.onclick = null;
    });
  }
}
