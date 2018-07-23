<template>
    <div>
        <div v-if="!selectedItem" :class="classes.wrapper">
            <div class="relative inline-block w-full">
                <input ref="search" :class="classes.input" tabindex="0" :id="inputId" 
                    @click="openSelect = true" 
                    @keyup.esc="closeOut"
                    @keyup.enter="selectPossibileMatch($event)" 
                    @keyup.down="arrowDown" 
                    @keyup.up="arrowUp"
                    @focus="searchText = ''"
                    :placeholder="placeholder" autocomplete="off"
                    :required="required" 
                    v-model="searchText">

                <div @click="toggleOpenSelect" :class="classes.icon" class="cursor-pointer absolute flex items-center">
                    <svg v-if="!openSelect" aria-hidden="true" viewBox="0 0 448 512">
                        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                    </svg>
                    <svg v-else aria-hidden="true" viewBox="0 0 448 512">
                        <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
                    </svg>
                </div>

                <ul tabindex="-1" ref="options" v-if="matchingItems" :style="{'max-height': maxHeight}" style="z-index: 100;padding"
                    class="shadow-md absolute w-full overflow-auto appearance-none border rounded mt-px  text-grey-darker  border-grey-lighter bg-white list-reset leading-normal text-left"
                    >
                    <li tabindex="0" :class="{ 'is-active': idx === counter }" class="cursor-pointer px-1 py-2 outline-none" v-for="(item, idx) in matchingItems" :key="idx"
                            @mouseover="focus(idx,$event)"
                            @keyup.up="arrowUp"
                            @keyup.tab.exact="arrowDown"
                            @keyup.tab.shift.exact="arrowUp"
                            @keydown.enter="setItem(item)" 
                            @keyup.down="arrowDown"
                            @click.prevent="setItem(item)"
                            @keyup.esc="closeOut" 
                            v-text="itemDesciption(item)">
                    </li>
                </ul>
            </div>
        </div>

        <div :class="classes.wrapper" v-if="selectedItem">
            <input id="inputId" :name="name" :class="classes.input" ref="match" :required="required" 
                @input="switchToSearch($event)" 
                @click="switchToSearch($event)"
                :placeholder="placeholder" :value="itemDesciption(selectedItem)">

            <div :class="classes.icon" @click="selectedItem = null" class="cursor-pointer absolute flex items-center">
                <svg @keyup.enter="selectedItem = null" @keyup.space="selectedItem = null" aria-hidden="true" viewBox="0 0 512 512">
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    value: {
      required: true
    },
    name: {
      type: String,
      required: false,
      default: () => ""
    },
    options: {
      type: Array,
      required: false,
      default: () => []
    },
    label: {
      type: String,
      required: false,
      default: () => null
    },
    valueKey: {
      type: String,
      required: false,
      default: () => null
    },
    placeholder: {
      type: String,
      required: false,
      default: () => "Search Here"
    },
    maxHeight: {
      type: String,
      default: () => "220px",
      required: false
    },
    inputId: {
      type: String,
      default: () => "single-select",
      required: false
    },
    classes: {
      type: Object,
      required: false,
      default: () => {
        return {
          wrapper: "single-select-wrapper",
          input: "form-control",
          icon: "icon"
        };
      }
    },
    initial: {
      type: String,
      required: false,
      default: () => null
    },
    required: {
      type: Boolean,
      required: false,
      default: () => false
    },
    maxResults: {
      type: Number,
      required: false,
      default: () => 30
    }
  },
  mounted() {
    document.addEventListener("keyup", this.handleClickOutside);
    document.addEventListener("click", this.handleClickOutside);
    this.searchText = this.initial;
  },
  destroyed() {
    document.removeEventListener("keyup", this.handleClickOutside);
    document.removeEventListener("click", this.handleClickOutside);
  },
  data() {
    return {
      searchText: null,
      selectedItem: null,
      openSelect: false,
      counter: -1
    };
  },
  watch: {
    searchText(curr, prev) {
      if (curr !== prev) {
        this.counter = -1;
      }
    },
    selectedItem(curr, prev) {
      if (curr === prev) {
        return;
      }

      if (curr) {
        return;
      }

      this.$emit("input", null);

      this.$nextTick().then(() => {
        this.$refs.search.focus();
      });
    },
    openSelect(curr, prev) {
      if (curr === prev) {
        return;
      }
      if (!curr) {
        this.searchText = null;
        return;
      }

      if (!this.searchText) {
        this.searchText = "";
      }
    }
  },
  computed: {
    matchingItems() {
      if (this.searchText === null) {
        return null;
      }

      if (!this.searchText.length) {
        return [...this.options].slice(0, this.maxResults);
      }

      if (this.label && this.valueKey) {
        return this.options
          .filter(item => {
            return (
              item[this.label]
                .toString()
                .toLowerCase()
                .includes(this.searchText.toString().toLowerCase()) ||
              this.searchText
                .toString()
                .toLowerCase()
                .includes(item[this.valueKey].toString().toLowerCase())
            );
          })
          .slice(0, this.maxResults);
      }

      if (this.label) {
        return this.options
          .filter(item =>
            item[this.label]
              .toString()
              .toLowerCase()
              .includes(this.searchText.toString().toLowerCase())
          )
          .slice(0, this.maxResults);
      }

      if (this.valueKey) {
        return this.options
          .filter(item =>
            this.searchText
              .toString()
              .toLowerCase()
              .includes(item[this.valueKey].toString().toLowerCase())
          )
          .slice(0, this.maxResults);
      }

      return this.options
        .filter(item =>
          item
            .toString()
            .toLowerCase()
            .includes(this.searchText.toString().toLowerCase())
        )
        .slice(0, this.maxResults);
    }
  },
  methods: {
    focus(idx, event) {
      this.counter = idx;
    },
    switchToSearch(event) {
      this.searchText = event.target.value;
      this.selectedItem = null;
      this.$nextTick().then(() => {
        this.$refs.search.focus();
      });
    },
    selectPossibileMatch() {
      if (this.matchingItems.length) {
        this.setItem(this.matchingItems[0]);
      }
    },
    toggleOpenSelect() {
      this.openSelect = !this.openSelect;

      if (this.openSelect) {
        this.$refs.search.focus();
      }
    },
    closeOut() {
      this.openSelect = false;
      this.searchText = null;
    },
    arrowDown() {
      if (this.counter < this.matchingItems.length) {
        this.counter = this.counter + 1;
      }
    },
    arrowUp() {
      if (this.counter > 0) {
        this.counter = this.counter - 1;
      }
    },
    setItem(item) {
      this.selectedItem = item;
      this.searchText = null;
      this.openSelect = false;
      this.counter = -1;
      this.$emit("input", item);
      this.$nextTick().then(() => {
        this.$refs.match.focus();
      });
    },
    itemDesciption(item) {
      if (this.valueKey && this.label) {
        return item[this.valueKey] + " " + item[this.label];
      }
      if (this.label) {
        return item[this.label];
      }
      if (this.valueKey) {
        return item[this.valueKey];
      }

      return item;
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.closeOut();
      }
    }
  }
};
</script>
<style scoped>
.w-full {
  width: 100%;
}
.inline-block {
  display: inline-block;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.border {
  border-width: thin;
  border-style: solid;
}
.rounded {
  border-radius: 0.25rem;
}
.text-black {
  color: #22292f;
}
.text-grey-darker {
  color: #606f7b;
}
.text-grey-light {
  color: #dae1e7;
}
.border-grey-lighter {
  border-color: #ced4da;
}
.bg-grey-lighter {
  background-color: #606f7b;
}
.bg-grey-light {
  background-color: #dae1e7;
}
.bg-grey-dark {
  background-color: #8795a1;
}
.bg-white {
  background-color: #fff;
}
.pin-r {
  right: 0;
}
.pin-y {
  top: 0;
  bottom: 0;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}

.items-center {
  align-items: center;
}
.p-0 {
  padding: 0;
}
.p-1 {
  padding: 0.25rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.mt-px {
  margin-top: 1px;
}
.leading-tight {
  line-height: 1.25;
}
.leading-normal {
  line-height: 1.5;
}
.text-left {
  text-align: left;
}
.w-full {
  width: 100%;
}
.shadow {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.list-reset {
  list-style: none;
  padding: 0;
}
.overflow-auto {
  overflow: auto;
}
.appearance-none {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.w-1 {
  width: 0.25rem;
}
.w-2 {
  width: 0.5rem;
}
.w-3 {
  width: 0.75rem;
}
.w-4 {
  width: 1rem;
}
.h-4 {
  height: 1rem;
}
.h-1 {
  height: 0.25rem;
}
.h-2 {
  height: 0.5rem;
}
.h-3 {
  height: 0.75rem;
}
.fill-current {
  fill: currentColor;
}
.no-underline {
  text-decoration: none;
}
.hover\:no-underline:hover {
  text-decoration: none;
}
.outline-none {
  outline: 0;
}
.hover\:outline-none {
  outline: 0;
}
.hover\:bg-grey-light:hover {
  background-color: #dae1e7;
}
.shadow-md {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
}
.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-sizing: border-box;
}
.icon {
  padding: 0 1rem;
  right: 0;
  top: 0;
  bottom: 0;
  fill: #606f7b;
}
.icon > svg {
  width: 0.75rem;
  height: 0.75rem;
}
.single-select-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}
.cursor-pointer {
  cursor: pointer;
}
ol,
ul {
  margin: 0;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
}
button,
input {
  overflow: visible;
}
li:hover,
.is-active {
  background: #dae1e7;
}
</style>
