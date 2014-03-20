BillPinClone.Views.SplitForm = Backbone.View.extend({

  attributes: {
    'id': 'split-form'
  },

  events: {
    'keyup input': 'handleKeyup' 
  },

  handleKeyup: function (event) {
    console.dir(event.target);
    var input = event.target
    var preview = '#' + input.id + '-prev';

    $(preview).html(input.value);
  },

  template: JST['splitForm'],

  render: function () {
    this.$el.html(this.template());
    return this;
  }

});
