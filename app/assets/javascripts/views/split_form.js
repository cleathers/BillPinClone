BillPinClone.Views.SplitForm = Backbone.View.extend({

  attributes: {
    'id': 'split-form'
  },

  template: JST['splitForm'],

  events: {
    'keyup #split-amt': 'handleKeyup', 
    'keyup #split-des': 'handleKeyup',
    'submit form': 'buildSplit'
  },

  buildSplit: function (event) {
    event.preventDefault();
    var formData = $(event.target).serializeJSON().split;
    

    BillPinClone.splits.create(formData, {wait: true});
  },

  handleKeyup: function (event) {
    console.dir(event.target);
    var input = event.target
    var preview = '#' + input.id + '-prev';

    $(preview).html(input.value);
  },


  render: function () {
    this.$el.html(this.template({
      users: BillPinClone.friends
    }));
    return this;
  }

});
