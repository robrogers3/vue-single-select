<template>
  <div id="app" class="mt-2">
    <form class="p-2 form w-full bg-x" action>
      <input value="test input 1" />
      <label style="display: block">Vue Single Select</label>
      <vue-single-select
        :getOptionDescription="getCustomDescription"
        v-model="thread"
        :options="threads"
        option-label="a_title"
        option-key="id"
        name="dude"
      ></vue-single-select>
      <div class="mt-1">
        <label>foo</label>
        <input class="search-input inline-block" value="roob" />
      </div>
      <hr />
      <select class="form-control" name="rob">
        <option>red</option>
        <option>blue</option>
        <option>green</option>
        <option>yellow</option>
      </select>
      <hr />
      <vue-single-select v-model="fruit" :options="fruits"></vue-single-select>
      <button type="submit" class="button py-2 px-4 bg-grey-lighter border rounded mt-2">button</button>
      <hr />
      <input type="submit" value="submit" />
      <hr />
    </form>
  </div>
</template>
<script>
/* eslint-disable */

// import "./../public/app.css";
import VueSingleSelect from "./VueSingleSelect.vue";
export default {
  name: "app",
  created() {
    //this.numbers = _.range(20,40);
    //this.thread = this.threads[1]
  },
  methods: {
    getCustomDescription(opt) {
      return opt.a_title;
    },

    addOption(opt) {
      //this.myThreads.push(opt);
      //this.threads.push(opt);
      this.fruits.push(opt);
    },
    zed(opt) {
      return opt + " fruit";
    }
  },
  mounted() {
    //let r = _.sample(this.fruits)
    //this.fruit = 'peach'
    setTimeout(() => {
      /* let threads = _.sampleSize(this.threads, 2);
       * this.myThreads = [this.threads[0]];*/
    }, 2000);
    setInterval(() => {
      //      this.fruit = _.sample(this.fruits)
      //this.myThreads = [];
    }, 1000);
  },
  components: {
    VueSingleSelect
  },
  data() {
    return {
      nums: [],
      numbers: [],
      fruit: "apple",
      veggies: [],
      fruits: [
        "apple",
        "cherry",
        "pear",
        "peach",
        "banana",
        "orange",
        "plum",
        "grape"
      ],
      myThreads: [],
      thread: "",
      threads: [
        { id: 1, a_title: "baz bar" },
        { id: 2, a_title: "foo bar" },
        {
          id: 3,
          a_title: "Eos rerum veniam quia mollitia"
        },
        { id: 4, a_title: "Robs Thread" },
        { id: 5, a_title: "test" },
        { id: 6, a_title: "goose" },
        { id: 7, a_title: "loose goose" },
        { id: 8, a_title: "geese" },
        { id: 9, a_title: "moose" },
        { id: 10, a_title: "test thread updated" },
        {
          id: 11,
          a_title:
            "Distinctio quo praesentium quis commodi praesentium excepturi."
        },
        { id: 12, a_title: "changed new thread" },
        { id: 13, a_title: "fred" },
        { id: 14, a_title: "barney" },
        { id: 15, a_title: "fredn and barney" }
      ]
    };
  }
};
</script>

<style>
body {
  font-size: 16px;
}
.w-50 {
  width: 50%;
}
.container {
  width: 1000px;
  margin: 0 auto;
}
.emoji-happy::before {
  content: "\1F600";
}
.emoji-sad::before {
  content: "\1F622";
}
#app {
  font-family: "Oxygen", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  _font-size: 16px;
}
.pill {
}
</style>
