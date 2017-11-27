/* eslint-disable no-confusing-arrow */
import _ from 'underscore';

const defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHeAAAB3gF6X+LpAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAdFQTFRF/////6oA/8wa/78V/70J/70Q/78N/8MN/8EN/8EN/8IN/8IP/8IO/8EN/8AP/8AO/8EO/8EO/8EO/8EN/8EP/8EO/8EO/8AO/8EO/8EO/8EO/8EO/8EO/8EOMzMzNDQzNTQzNTUzNjUyNzYyODYyOTcyOjgyOzkyPDkxPToxPjsxPzsxQj4wQz4wRT8wRUAwRkAwR0EvSUIvSUMvTUUuTkYuT0YuUEcuVEotV0wsWE0sWU0sWk4sXVErXlErYVMrZFUqZVYqZlcqZ1cqaFgpaVgpa1opblwocV4odWEneWQmfWYmfmclf2glgmolhGskhWwkiW8jinAjjXEjj3MikXQikXUiknUik3YilHYhlXchmXogmXohnHwgnn4gn34foH8foX8fpIIfpoMep4QeqIQeqYUeq4cdrYgdrokdsIoctI0cto4bu5IavZMavpQav5QawJUZwZYZw5cZyJsYyZsYzJ0XzZ4Xzp8X0KAX06IW1aMW1qUV2aYV2acV26gV3KgU4awT4awU464T5K4T5a8T6LES6bES6bIS67MS7bQR7bUR7rUR77YR8bcR8rgQ87kQ9boQ9rsQ97sP+b0P+r4P+74P/L8P/cAO/sAO/8EOYHC6QQAAAB50Uk5TAAMKDBsfPExOYmRocHSKjqSwtr7Ay9XY5ery+Pn+bfME6gAAAs5JREFUWMOtV1dbE0EUnZAAIZ1U0o5UQQFFxY4KigULoFgBO9gFC2BDsWHBRiCUzK/1gWx2Z3aX7OxynpK7c873zZ07d84lRAd2p8cXCMUSiVgo4PM47UQIDncwSRkkg26HUXaJN5KmGkhHvCUG6DZXFdVFlctWjF8epesiWr4uvTRMiyJcqs8vi1MDiJfp8StS1BBSFdrZ81PD8Gvk0lZJBVCpVvBTIfhV+6eC4PJQlhIVSDFnURqnwogr6yFMTSCsqF8j61dUkUJV26JF2Z97dtR23OY0otJZuoryn28GABxaYMOu/P3n7+/K+4dDL+YUgV+tWMMF7nav9QcvG82cbQQAtI8VQnfyfNRl2bVeQgghETY4IK2unpVCp6UQ3rJrI4QQ4uD61zVpce0PKXSmIDDNdTkHIcTNZWBpYBsA1HRMFUKjEr9hmVvsJoQE1UmffXr39aLi//zOvMAgvzJIiD1poIgmmwEA3Vn+Q9JOnIbK9nvvvuZjD3LqD07ioZbgIT5rAj4SsCYQICFrAiESkw8rY0IgRhLSz7mGrf/EBRKywDtg3IxAYQvzwC0zW5CT2IZeM0mUj7ELnWaOUS6kfmw3U0geZd/5ZqKU5cs0DVwVFnAqr3MnWrKC/KRd2VDGgUeCAkGmpa3uxkFBATfbVEeAJ0L8tINt65kWNM6ICET4h2WiBntEbpRX9bSNAidzhvn5p415XPuBft2zXBw+9UXjcWWe9+Uu4MBHbf6rvcANreedMRh/jgANIxrbWDi/CTj+W8tgsBZn9WY9cGKCNyST7cCW+zlti8OZrA/7AbT2yRqZZ327AByd1TVZnM1bulwNAK3nLl4ZHL4+1F0PAE33cvo2T2U0v15qgRJNPY//rms01VY3OzZwuG6N3db3MlvU6mqa7eWfM1NvPs0bM9uW7b71gWMDRh7rQ5f1sW8DBk/ro+8GDN9i4/9/nurQohsZlRwAAAAASUVORK5CYII=';

export default {
  data() {
    return {
      usersList: [{ value: null, displayName: 'Filter by User' }],
      filters: {
        search: null,
        status: null,
        completed: null,
        user: undefined,
        who: null,
      },
    };
    // this.hello();
  },
  methods: {
    resetFilters() {
      this.filters = {
        search: null,
        status: null,
        completed: null,
        user: undefined,
        who: null,
      };
    },
    filter(data) {
      let test = true;
      if (this.filters.who) {
        if (data.who === this.filters.who) {
          test = true;
        } else return false;
      }
      if (this.filters.user) {
        if (data.user === this.filters.user) {
          test = true;
        } else return false;
      }
      if (this.filters.status) {
        if (data.status === this.filters.status) {
          test = true;
        } else return false;
      }
      if (this.filters.search) {
        test = _.some(data, this.recursiveObjectFilterSearch);
      }
      return test;
    },
    recursiveObjectFilterSearch(item) {
      // eslint-disable-next-line no-nested-ternary
      return _.isObject(item) || _.isArray(item) // check if item is an array or object
        // if so, search values recursively
        ? _.some(item, this.recursiveObjectFilterSearch)
        // check if item is a string
        : _.isString(item)
          // if so, normalize values and search
          ? item.toLowerCase().includes(this.filters.search.toLowerCase())
          // if not, compare directly
          : item === this.filters.search;
    },
    getReportData(id) {
      return this.$root.fbDatabase.collection('reports').doc(id).get().then(doc => doc.exists ? doc : false);
    },
    getUserData(uid) {
      return this.$root.fbDatabase.collection('users').doc(uid).get().then(doc => doc.exists ? doc : false);
    },
    getAllUserData() {
      return this.$root.fbDatabase.collection('users').get().then((list) => {
        list.forEach((user) => {
          this.usersList.push(_.extend({ id: user.id }, user.data()));
        });
      });
    },
    getUserFromList(id) {
      const obj = _.findWhere(this.usersList, { id });
      return obj ? `<img src="${obj.photoURL || defaultAvatar}" width="25" height="25" class="m-1 rounded-circle"/> ${obj.displayName || ''}` : id;
    },
  },
  created() {
    this.getAllUserData();
  },
};
