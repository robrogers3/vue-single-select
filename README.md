# vue-single-select

    single select dropdown component with autocomplete for Vue apps for you!

## What It Does

vue-single-select provides a **simple** interface to replace regular select elements with an auto-complete select.

## What It Does Not Do

Nope no Multi Select. See vue-multiple-select for this.

No ajax loading.

No massive styling options (for now).

# Usage

### Install it

```
npm i vue-single-select
```

### Register it

In your component:

```
import VueSingleSelect from "vue-single-select";
export default {
components: {
     VueSingleSelect
  },
  //...
}
```

Globally:

```
import VueSingleSelect from "vue-single-select";
Vue.component('vue-single-select', VueSingleSelect);
```

### Use It

```
<vue-single-select
        name="maybe"
        placeholder="pick a post"
        you-want-to-select-a-post="ok"
        v-model="post"
        out-of-all-these-posts="makes sense"
        :options="posts"
        a-post-has-an-id="good for search and display"
        value-key="id"
        the-post-has-a-title="make sure to show these"
        label="title"
></vue-single-select>
```

### Use It Again

```
<vue-single-select
        you-want-to-select-a-reply="yes"
        v-model="reply"
        out-of-all-these-replies="yep"
        :options="replies"
        a-reply-only-has-a-reply="sounds about right"
        label="reply"
        seed-an-initial-value="what's seed mean?"
        initial="seed me"
        you-only-want-20-options-to-show="sure"
        :max-results="20"
></vue-single-select>
```

### Use It Again

```
<vue-single-select
        v-model="fruit"
        it-is-just-fruit="simple yes?"
        :options="['apple','cherry','tomato']"
        you-are-hungry="very!"
        :required="true"
></vue-single-select>
```

### Dont like the Styling

You can override some of it. Like so:

```
<vue-single-select
        id="selected-reply"
        name="a_reply"
        label="reply"
        v-model="reply"
        :options="replies"
        you-like-huge-dropdowns="1000px is long!"
        max-height="1000px"
        you-love-bootstrap="yes!!"
        :classes="{
                    input: 'form-control',
                    wrapper: 'form-group',
                    icon: 'glyphicon'
        }"
></vue-single-select>
```

Then all you need to do is provide some class definitions like so:

```
.form-control {
    color: pink;
    width: 10000px;
    _go: nuts;
}
.glyphicon {
    display:none;
}
.form-group {
    background-color: pink;
}
```

### Kitchen Sink

Meh, see props below.

## Why vue-single-select is better

1.  It handles custom label/value props for displaying options.

    Other select components require you to conform to their format. Which often means data wrangling.

2.  It's easier on the DOM.

    Other components will load up all the options available in the select element. This can be heavy. vue-single-select makes an executive decision that you probably will not want to scroll more than N options before you want to narrow things down a bit. You can change this, but the default is 30.

3.  Snappy Event Handling

    - tab for selecting options
    - up and down arrows for selecting options
    - enter to select first match
    - remembers selection on change
    - hit the escape key to well escape

4.  Lightweight

    - Why are the other packages so big and actually have dependencies?

5.  This one just looks nicer

## Available Props:

```
    props: {
        value: {
            required: true
        },
        //name of the input, good for doing a POST
        name: {
            type: String,
            required: false,
            default: () => ""
        },
        //your list for the dropdown
        options: {
            type: Array,
            required: false,
            default: () => [],
        },
        //the label you would like
        label: {
            type: String,
            required: false,
            default: () => null,
        },
        //maybe you want to show the "id - label" in the list.
        //or maybe you want to search by id and the label
        //i do
        valueKey: {
            type: String,
            required: false,
            default: () => null,
        },
        placeholder: {
            type: String,
            required: false,
            default: () => ''
        },
        maxHeight: {
            type: String,
            default: () => '220px',
            required: false
        },
        //form element id
        inputId: {
            type: String,
            default: () => 'single-select',
            required: false
        },
        //style me with these
        classes: {
            type: Object,
            required: false,
            default: () => {
                return  {
                    wrapper: 'single-select-wrapper',
                    input: 'form-control',
                    icon: 'icon'
                }
            }
        },
        //provide an initial value
        initial: {
            type: String,
            required: true,
            default: () => ''
        },
        //more for you than me.
        required: {
            type: Boolean,
            required: false,
            default: () => false
        },
        //No I don't want to scroll past 30 options. yikes.
        maxResults: {
            type: Number,
            required: false,
            default: () => 30
        }
    },
```

## Q&A

Q. _What about Ajax?_

A. Good question. Why aren't you passing that in as a prop?
Seriously, this is just a widget why does it need knowledge of it's data source?

Q. _What about Templating?_

A. Good question. Really. Working on it.

Q. _What about Multiple Selects?_

A. Nope not found here.

Q. _Why doesn't it work?_

A. You know I really didn't make this to be used without a bundler and the vue-loader. If you don't know what this means then checkout **Parcel** or **Vue Cli** to get started. You're going to want it anyway.

Or if you are ready to roll but need a helping hand use **Laravel Mix**
It's your one stop to success!
