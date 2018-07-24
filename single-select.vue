<template>
    <div ref="vuesingleselect">
        <div v-if="!selectedOption" :class="classes.wrapper">
            <div class="relative inline-block w-full">
                <input ref="search" :class="[classes.input, isRequired]" tabindex="0" :id="inputId" 
                    @click="seedSearchText" 
                    @focus="seedSearchText" 
                    @keyup.esc="closeOut"
                    @keyup.enter="setOption" 
                    @keyup.down="movePointerDown($event)"
                    @keyup.up="movePointerUp"
                    :placeholder="placeholder" 
                    autocomplete="off"
                    :required="required" 
                    v-model="searchText">

                <div @click="toggleOpenSelect" :class="[classes.icon]" class="cursor-pointer absolute flex items-center">
                    <svg v-if="!openSelect" aria-hidden="true" viewBox="0 0 448 512">
                        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                    </svg>
                    <svg v-else aria-hidden="true" viewBox="0 0 448 512">
                        <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
                    </svg>
                </div>

                <ul tabindex="-1" ref="options" v-if="matchingOptions" :style="{'max-height': maxHeight}" style="z-index: 100;padding"
                    class="shadow-md absolute w-full overflow-auto appearance-none border rounded mt-px  text-grey-darker  border-grey-lighter bg-white list-reset leading-normal text-left"
                    >
                    <li tabindex="0" 
                         v-for="(option, idx) in matchingOptions" :key="idx"
                         :class="{ 'is-active': idx === pointer }" 
                         class="cursor-pointer px-1 py-2 outline-none"
                            @mouseover="pointer = idx"
                            @keyup.enter="setOption()" 
                            @keyup.shift.tab.exact="movePointerUp"
                            @keyup.tab.exact="movePointerDown($event)"
                            @keyup.up="movePointerUp()"
                            @keyup.down="movePointerDown($event)"
                            @click.prevent="setOption()"
                            @keyup.esc="closeOut" 
                            v-text="optionDesciption(option)">
                    </li>
                </ul>
            </div>
        </div>

        <div :class="classes.wrapper" v-if="selectedOption">
            <input id="inputId" :name="name" :class="[classes.input]" ref="match" :required="required" 
                @input="switchToSearch($event)" 
                @click="switchToSearch($event)"
                :placeholder="placeholder" :value="optionDesciption(selectedOption)">

            <div :class="classes.icon" @click="closeOut" class="cursor-pointer absolute flex items-center">
                <svg  @click="closeOut" aria-hidden="true" viewBox="0 0 512 512">
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import pointerScroll from './pointerScroll';
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
    optionLabel: {
      type: String,
      required: false,
      default: () => null
    },
    optionKey: {
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
          icon: "icon",
          required: "required"
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
  mixins: [pointerScroll],
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
      selectedOption: null,
      openSelect: false,
      closed: false
    };
  },
  watch: {
    searchText(curr, prev) {
      if (curr !== prev) {
        this.pointer = -1;
      }
      this.closed = false;
    },
    selectedOption(curr, prev) {
      if (curr === prev) {
        return;
      }

      this.$emit("input", curr);

      if (this.closed) {
        return;
      }
      if (curr) {
        return;
      }

      this.$nextTick().then(() => {
        this.$refs.search.focus();
      });
    },
    openSelect(curr, prev) {
      if (curr === prev) {
        return;
      }

      if (this.selectedOption) {
        this.searchText = this.optionDesciption(this.selectedOption);
        return;
      }

      if (!curr) {
        this.searchText = null;
        return;
      }

      if (!this.searchText) {
        this.searchText = "";
      }
      this.$nextTick().then(() => {
        this.$refs.search.focus();
      });
    }
  },
  computed: {
      isRequired() {
          if (!this.required) {
              return '';
          }

          if (!this.closed) {
              return '';
          }

          return 'required';
      },
    matchingOptions() {
      if (this.searchText === null) {
        return null;
      }

      if (!this.searchText.length) {
        return [...this.options].slice(0, this.maxResults);
      }

      if (this.optionLabel && this.optionKey) {
        return this.options
          .filter(option => {
            return (
              option[this.optionLabel]
                .toString()
                .toLowerCase()
                .includes(this.searchText.toString().toLowerCase()) ||
              this.searchText
                .toString()
                .toLowerCase()
                .includes(option[this.optionKey].toString().toLowerCase())
            );
          })
          .slice(0, this.maxResults);
      }

      if (this.optionLabel) {
        return this.options
          .filter(option =>
            option[this.optionLabel]
              .toString()
              .toLowerCase()
              .includes(this.searchText.toString().toLowerCase())
          )
          .slice(0, this.maxResults);
      }

      if (this.optionKey) {
        return this.options
          .filter(option =>
            this.searchText
              .toString()
              .toLowerCase()
              .includes(option[this.optionKey].toString().toLowerCase())
          )
          .slice(0, this.maxResults);
      }

      return this.options
        .filter(option =>
          option
            .toString()
            .toLowerCase()
            .includes(this.searchText.toString().toLowerCase())
        )
        .slice(0, this.maxResults);
    }
  },
  methods: {
    seedSearchText() {
      if (!this.searchText) {
        this.searchText = "";
      }

        this.$nextTick().then(() => {
            this.closed = false;
      });
    },
    resetSearch() {
      this.selectedOption = null;
      this.openSelect = false;
      this.searchText = null;
    },
    switchToSearch(event) {
      this.searchText = event.target.value;
      this.selectedOption = null;
      this.$nextTick().then(() => {
        this.$refs.search.focus();
      });
    },
    toggleOpenSelect() {
      this.openSelect = !this.openSelect;
    },
    closeOut() {
      this.selectedOption = null;
      this.openSelect = false;
      this.searchText = null;
      this.closed = true;
    },
    movePointerDown(event) {
      if (this.pointer >= this.matchingOptions.length - 1) {
        return;
      }

      this.pointer++;
      return;
      //Fiddling with focus events for tabbing. Hold off for now
      if (event.target.tagName === "INPUT") {
        this.$refs.options.firstElementChild.focus();
        this.pointer++;
        return;
      }

      event.target.focus();

    },
    movePointerUp() {
      if (this.pointer > 0) {
        this.pointer--;
      }
    },
    setOption() {
        if (!this.matchingOptions.length) {
            return;
        }

      this.selectedOption = this.matchingOptions[this.pointer];
      this.searchText = null;
      this.openSelect = false;
      this.pointer = -1;
      this.$nextTick().then(() => {
        this.$refs.match.focus();
      });
    },
    optionDesciption(option) {
        
      if (this.optionKey && this.optionLabel) {
        return option[this.optionKey] + " " + option[this.optionLabel];
      }
      if (this.optionLabel) {
        return option[this.optionLabel];
      }
      if (this.optionKey) {
        return option[this.optionKey];
      }

      return option;
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
.required {
    _color: #721c24;
    _background-color: #f8d7da;
    _border-color: #f5c6cb;
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
li:hover {
  background-clip: pink;
}
.is-active {
  background: #dae1e7;
}
</style>
