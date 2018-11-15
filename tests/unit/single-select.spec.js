import { shallowMount, mount } from '@vue/test-utils'
import VueSingleSelect from '@/VueSingleSelect.vue'
let wrapper

describe('VueSingleSelect', () => {
  let someOptions =  ['apple','cherry','pear','peach','banana','orange','plum', 'grape']
  beforeEach(() => {
    wrapper = shallowMount(VueSingleSelect,  {
      propsData: {
        value: null,
        options: someOptions
      }
    })
  })

  it('needs some props', () => {
    expect(wrapper.props().options).toBe(someOptions)
    expect(wrapper.props().value).toBe(null)
  })

  it('allows selecting an option with mouse', () => {
    type('cher', '.search-input')
    see('cherry', 'ul')
    see('cherry', 'li')
    click('li:first-child')
    has('cherry','input')
  })

  it('allows selecting an option with enter', () => {
    wrapper.setProps({
      name: 'fruit'
    })
    type('cher', '.search-input')
    see('cherry', 'li')
    triggerKeyUp('.search-input', 'enter')
    has('cherry','.search-input')
    const nameInput = wrapper.find('input[name=fruit]')
    expect(nameInput.element.value).toBe('cherry')
  })
  it('allows selecting an option with cursor', () => {
    wrapper.setProps({
      name: 'fruit'
    })
    focus('.search-input')
    triggerKeyUp('.search-input', 'down')
    see('apple','li:first-child')
    click('li:first-child')
    const nameInput = wrapper.find('input[name=fruit]')
    expect(nameInput.element.value).toBe('apple')
  })
  it('handles objects with labels and keys', () => {
    const options = [
      {'title': 'foo', id: 1},
      {'title': 'bar', id: 2},
      {'title': 'baz', id: 3},
      {'title': 'zazz', id: 4}                        
    ]
    wrapper.setProps({
      options,
      optionLabel: 'title',
      optionKey: 'id'
    })
    expect(wrapper.props().options).toBe(options)
    type('a', 'input.search-input')
    expect(wrapper.findAll('li').length).toBe(3)
    see('bar','li:first-child')
    click('li:first-child')
    has('2 bar', '.search-input')
  })
  it('can toggle the dropdown', () => {
    expect(wrapper.findAll('ul').length).toBe(0)
    click('svg');
    expect(wrapper.findAll('ul').length).toBe(1)
  });
  it('can escape out of the input', () => {
    focus('.search-input')
    expect(wrapper.findAll('ul').length).toBe(1)
    triggerKeyUp('.search-input', 'tab')
    expect(wrapper.findAll('ul').length).toBe(0)
  })
  it('allows you to unselect an option', () => {
    type('cher', '.search-input')
    see('cherry', 'ul')
    see('cherry', 'li')
    click('li:first-child')
    has('cherry','input')
    click('svg')
    has('', 'input')
  })
  it('it seeds the search text from the selected option', () => {
    wrapper.setProps({
      required: true
    })
    expect(wrapper.find({ref: 'match'}).exists()).toBe(false)
    type('cher', '.search-input')
    see('cherry', 'ul')
    see('cherry', 'li')
    click('li:first-child')
    has('cherry', '.search-input')
    expect(wrapper.find({ref: 'match'}).exists()).toBe(true)
    type('cherry', '.search-input')
    expect(wrapper.find({ref: 'match'}).exists()).toBe(false)
    has('cherry', '.search-input')
  })
  it('will set the required prop on the search element', () => {
    wrapper.setProps({
      required: true
    })
    expect(wrapper.find('input[required=required]').exists()).toBe(true)
    let el = wrapper.find('input[required=required]')
    expect(el.element.classList.toString().includes('required')).toBe(true)
    type('cher', '.search-input')
    click('li:first-child')
    expect(wrapper.find('input[required=required]').exists()).toBe(true)    
    el = wrapper.find('input[required=required]')
    expect(el.element.classList.toString().includes('required')).toBe(false)

  })
  it('toggles the search input when toggling dropdown', () => {
    type('cher', '.search-input')
    see('cherry', 'ul')
    see('cherry', 'li')
    click('li:first-child')
    has('cherry', '.search-input')
    focus('.search-input')
    has('cherry', '.search-input')
    click('svg')
    has('', '.search-input')
  })
  it('shows no items when there is no search input', () => {
    expect(wrapper.findAll('li').length).toBe(0)
  })
  it('shows no items when there are no matching items', () => {
    type('nono', '.search-input')
    expect(wrapper.findAll('li').length).toBe(0)
  })
  it('shows no items when there are no matching items', () => {
    type('nono', '.search-input')
    expect(wrapper.findAll('li').length).toBe(0)
  })
  it('respects the updated value prop', () => {
    type('cher', '.search-input')
    click('li:first-child')
    has('cherry','input')
    wrapper.setProps({
      value: 'apple'
    })
    has('apple', 'input')
  })
  it('shows all options when search in focused', () => {
    focus('.search-input')
    expect(wrapper.findAll('li').length).toEqual(someOptions.length)
  })
  it('only shows the maximum amount of options', () => {
    wrapper.setProps({
      maxResults: 3
    })
    focus('.search-input')
    expect(wrapper.findAll('li').length).toEqual(3)
  })
  it('allows for a custom option description', () => {
    wrapper.setProps({
      getOptionDescription: (option) => {
        return option + ' zed'
      }
    })
    focus('.search-input')
    see('apple zed', 'li:first-child')
    type('cherry', '.search-input')
    see('cherry zed', 'li:first-child')
    click('li:first-child')
    has('cherry zed', '.search-input')
  })
  it('allows for a custom option value', () => {
    wrapper.setProps({
      getOptionValue: (option) => {
        return option + ' fred'
      },
      name: 'fruit'
    })
    type('cherry', '.search-input')
    click('li:first-child')
    const nameInput = wrapper.find('input[name=fruit]')
    expect(nameInput.element.value).toBe('cherry fred')
  })
  it('allows for a custom matching options prop', () => {
    wrapper.setProps({
      filterBy: function (option) {
        return option
          .toString()
          .toLowerCase()
          .includes(this.searchText.toString().toLowerCase())
      }
    })
    type('erry', '.search-input');
    see('cherry', 'li:first-child')
    wrapper.setProps({
      filterBy: function (option) {
        return option
          .toString()
          .toLowerCase()
          .startsWith(this.searchText.toString().toLowerCase())
      }
    })
    type('erry', '.search-input');
    notSee('cherry')
  });
  it('updating selected resets search', () => {
    wrapper.setProps({
      name: 'fruit'
    })
    type('cher', '.search-input')
    click('li:first-child')
    has('cherry', '.search-input');
    expect(wrapper.find('input[name=fruit]').element.value).toBe('cherry')
    click({ ref: 'match' })
    expect(wrapper.find({ ref: 'selectedValue' }).exists()).toBe(false)
  })
});
const peek = (opt) => {
  console.log('peek', wrapper.vm[opt])
};
const has = (text, selector) => {
  let wrap = selector ? wrapper.find(selector) : wrapper
  expect(wrap.element.value).toBe(text)
};
let see = (text, selector) => {
  let wrap = selector ? wrapper.find(selector) : wrapper
  expect(wrap.html()).toContain(text)
};
let notSee = (text, selector) => {
  let wrap = selector ? wrapper.find(selector) : wrapper
  expect(wrap.html()).not.toContain(text)
};
let type = (text, selector) => {
  let node = wrapper.find(selector);
  node.element.value = text;
  node.trigger('input');
};
let focus = (selector) => {
  wrapper.find(selector).trigger('focus');    
};
let click = (selector) => {
  wrapper.find(selector).trigger('click');
};
let triggerKeyUp = (selector, type) => {
  type = 'keyup.' + type;
  wrapper.find(selector).trigger(type);
};
