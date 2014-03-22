BillPinClone.Collections.Friends = Backbone.Collection.extend({
  model: BillPinClone.Models.Friend,
  url: '/api/users',

  getOrFetch: function (id) {
    var model;
    var friends = this;

    if (model = this.get(id)) {
      return model;
    } else {
      model = new BillPinClone.Models.Friend({ id: id });
      model.fetch({
        success: function () { friends.add(model) }
      });
      return model;
    }
  }
});
