var register = (Handlebars) => {
  var helpers = {
    extend: function(name, options) {
      if (!this._block) this._block = {};
      this._block[name] = options.fn(this);
      return null;
    }
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
  
};

module.exports.register = register;
module.exports.helpers = register(null);