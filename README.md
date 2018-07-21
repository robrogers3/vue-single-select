# vue-single-select

    single select dropdown with autocomplete for Vue apps for you!

## What It Does
vue-single-select provides a **simple** interface to replace regular select elements with an auto-complete select.

## What It Does Not Do

Nope no Multi Select. See vue-multiple-select for this.

No ajax loading.

No massive styling options (for now).

# Usage

### Save it

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
        placeholder="my static placeholder"
        value-key="id"   //the post has an id (good for search and display)
        label="title"    //the post has a title
        v-model="post"   //you want to select a post
        :options="posts" //out of all these posts
></vue-single-select>
```
### Use It Again
```
<vue-single-select
        :placeholder="myDynamicPlaceholder"
        label="reply"      //a reply only has a reply
        v-model="reply"   //you want to select a reply
        :options="replies" //out of all these reply
></vue-single-select>
```

### Use It Again
```
<vue-single-select
        v-model="fruit"   //you're hungry
        :options="['apple','cherry','tomato']" //it's just fruit
></vue-single-select>
```

### Dont like the Styling

You can override some of it. Like so:

```
<vue-single-select
        :placeholder="myPlaceholder"
        label="reply"      //a reply only has a reply
        v-model="reply"   //you want to select a reply
        :options="replies" //out of all these reply
        max-height="1000px" //I like a long dropdowns
        :classes="{input: 'form-control', wrapper:'form-group', icon: 'icon'}" //you like bootstrap!
></vue-single-select>
```
Then all you need to do is provide a class definition like so:
```
.form-control {
    color: pink;
    width: 10000px;
    _go: nuts;
}
.icon {
    display:none;
}
.wrapper {
    background-color: pink;
}
```

### Kitchen Sink

Meh, see props below.

## Why vue-single-select is better

1. It handles custom label/value props for displaying options. 

    Other select components require you to conform to their format. Which often means data wrangling.

2. It's easier on the DOM. 

    Other components will load up all the options available in the select element. This can be heavy. vue-single-select makes an executive decision that you probably will not want to scroll more than N options before you want to narrow things down a bit. You can change this, but the default is 50.

3. Snappy Event Handling

    * tab for options
    * up and down arrows for selecting options
    * enter to select first match
    * remembers selection on change
    * hit the escape key to well escape

4. Lightweight

    * Why are the other packages so big and actually have dependencies?

5. This one just looks nicer

## Available Props:
```
    props: {
        value: {
            required: true
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
            default: () => 'Search Here'
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
                    wrapper: 'form-wrapper', 
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
        noQueryResultsLength: {
            type: Number,
            required: false,
            default: () => 50
        }
    },
```
## Q&A

Q. *What about Ajax?*

A. Good question. Why aren't you passing that in as a prop?
Seriously, this is just a widget why does it need knowledge of it's data source?

Q. *What about Templating?*

A. Good question. Really. Working on it.

Q. *What about Multiple Selects?*

A. Nope not found here.

Q. *Why doesn't it work?*

A. You know I really didn't make this to be used without a bundler and the vue-loader. If you don't know what this means then checkout **Parcel** or **Vue Cli** to get started. You're going to want it anyway.

Or if you are ready to roll but need a helping hand use **Laravel Mix**
It's your one stop to success!