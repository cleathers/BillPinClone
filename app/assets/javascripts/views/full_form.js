BillPinClone.Views.FullForm = Backbone.View.extend({
  
  template: JST['fullForm'],
  
  events: {
    'keyup #split-amt': 'handleKeyup',
    'keyup #split-des': 'handleKeyup',
    'submit form': 'buildSplit'
  },

  render: function () {
    this.$el.html(this.template({
      users: BillPinClone.friends
    }));
    
    return this;
  },

  buildSplit: function (event) {
    event.preventDefault();
    var formData = $(event.target).serializeJSON().split;

    BillPinClone.splits.create(formData, {wait: true});
    // run a fetch so the other view which isn't even displayed at this point will update.
    BillPinClone.splits.fetch();
  },

  handleKeyup: function (event) {
    var input = event.target;
    var preview = '#' + input.id + '-prev';

    $(preview).html(input.value);
  }

});
