<template>
<div :class="overRideClass">
    <div v-if="!selectedItem" class="relative">
        <div class="relative">
            <input ref="search" class="form-control appearance-none" @keyup.tab="closeOut" @click="openSelect = true" @keyup.enter="selectPossibileMatch"
                @keyup.down="visitOptions($event)" :placeholder="placeholder" v-model="searchText">
            <div @click="toggleOpenSelect" class="cursor-pointer absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                <svg v-if="!openSelect" aria-hidden="true" class="h-3 w-3" style="fill: #606f7b" viewBox="0 0 448 512">
                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                </svg>
                <svg v-else aria-hidden="true" class="h-3 w-3" style="fill: #606f7b" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
                </svg>
            </div>

            <ul tabindex="3" v-if="matchingItems" style="max-height: 10.5rem;z-index: 100" class="p-1 absolute w-full overflow-auto appearance-none border rounded mt-px  text-grey-darker  border-grey-lighter bg-white list-reset leading-normal text-left"
                @keyup.tab="handleClickOutside($event)">
                <li class="focus:bg-grey-light no-outline" v-for="(item, idx) in matchingItems" :key="idx" @keydown.enter="setItem(item)"
                    @keyup.down="visitNextOption($event)" @keyup.up="visitPrevOption($event)">
                    <a class="block px-2 py-2 hover:outline-none no-underline  focus:bg-grey-dark text-black hover:bg-grey-light" href="#" @click.prevent="setItem(item)"
                        @keyup.tab="handleClickOutside($event)">
                        <span v-text="itemDesciption(item)">
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div class="relative" v-if="selectedItem">
        <input class="form-control appearance-none" @input="switchToSearch($event)" @click="switchToSearch($event)" :placeholder="placeholder" :value="itemDesciption(selectedItem)">
        <div @click="selectedItem = null" class="cursor-pointer absolute pin-y pin-r flex items-center px-2 text-grey-darker">
            <svg aria-hidden="true" viewBox="0 0 512 512" class="h-3 w-3" style="fill: #606f7b">
                <path fill="" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
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
        items: {
            type: Array,
            required: false,
            default: () => [],
        },
        label: {
            type: String,
            required: false,
            default: () => null,
        },
        valueKey: {
            type: String,
            required: false,
            default: () => null,
        },
        placeholder: {
            type: String,
            required: false,
            default: () => 'Search Here'
        },
        overRideClass: {
            type: String,
            required: false,
            default: () => 'single-select'
        }
    },
    mounted() {
        document.addEventListener('keyup', this.handleClickOutside);
        document.addEventListener('click', this.handleClickOutside);

    },
    destroyed() {
        document.removeEventListener('keyup', this.handleClickOutside);
        document.removeEventListener('click', this.handleClickOutside);
    },
    data() {
        return {
            searchText: null,
            selectedItem: null,
            openSelect: false

        };
    },
    watch: {
        openSelect(curr, prev) {
            if (curr === prev) {
                return;
            }
            if (!curr) {
                this.searchText = null;
                return;
            }
            if (!this.searchText) {
                this.searchText = '';
            }
            
        }
    },
    computed: {
        matchingItems() {
            if (this.searchText === null) {
                return null;
            }

            if (!this.searchText.length) {
                let items = [...this.items];
                return items.slice(0, 100);//arbitrary but showing entire list is heavy
            }

            if (this.label) {
                return this.items.filter(item => item[this.label].toString().toLowerCase().includes(this.searchText.toString().toLowerCase()))
            }

            if (this.valueKey) {
                return this.items.filter(item => item[this.valueKey].toString().toLowerCase().includes(this.searchText.toString().toLowerCase()))
            }

            return this.items.filter(item => item.toString().toLowerCase().includes(this.searchText.toString().toLowerCase()))
        }
    },
    methods: {
        switchToSearch(event) {
            this.searchText = event.target.value;
            this.selectedItem = null;
            this.$nextTick()
            .then(() => {
            this.$refs.search.focus();// DOM updated
            })
        },
        selectPossibileMatch() {
            if (this.matchingItems) {
                this.selectedItem = this.matchingItems[0];
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
        visitNextOption(event) {
            if (!event.target.parentElement.nextElementSibling) {
                return;
            }
            event.target.parentElement.nextElementSibling.firstElementChild.focus();
        },
        visitPrevOption(event) {
            if (!event.target.parentElement.previousElementSibling) {
                return;
            }
            event.target.parentElement.previousElementSibling.firstElementChild.focus();
        },
        visitOptions(event) {
            event.target.parentElement.lastElementChild.firstElementChild.firstElementChild.focus();
        },
        setItem(item) {
            this.selectedItem = item;
            this.searchText = null;
            this.openSelect = false;
            this.$emit('input', item)
        },
        itemDesciption(item) {
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
                this.openSelect = false;
                this.searchText = null;
                return;
            }
        }
    }
};
</script>
<style scoped>
.w-full {
    width: 100%;
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
    border-radius: .25rem;
}
.text-black {
    color: #22292f;
}
.text-grey-darker {
    color: #606f7b;
}
.text-grey-light {
    color: #DAE1E7;
}
.border-grey-lighter {
    border-color:  #ced4da;
}
.bg-grey-lighter {
    background-color: #606f7b;
}
.bg-grey-light {
    background-color: #DAE1E7;
}
.bg-grey-dark {
    background-color: #8795A1;
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

.pointer-events-none {
    pointer-events: none;
}
.items-center {
    align-items: center;
}

.p-0 {
    padding: 0;
}
.p-1 {
    padding: .25rem;
}
.py-2 {
    padding-top: .5rem;
    padding-bottom: .5rem;   
}
.px-2 {
    padding-left: .5rem;
    padding-right: .5rem;
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

.single-select .shadow {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
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
.h-1 {	height: 0.25rem;
}
.h-2 {	height: 0.5rem;}
.h-3 {	height: 0.75rem;}
a:hover {
    color: #22292f;
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
.hover\:outline-none {
    outline: 0
}
.hover\:bg-grey-light:hover {
    background-color: #dae1e7;
}
.single-select .form-control {
    display: block;
    width: 100%;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
input {
    box-sizing: border-box;
}

ol, ul {
    margin: 0;
}

button, input, optgroup, select, textarea {
    font-family: inherit;
}
button, input {
    overflow: visible;
}
a:focus {
    background: #DAE1E7;
}
</style>
