module.exports = {

  friendlyName: <%=util.inspect(friendlyName)%>,

  description: <%=util.inspect(description)%>,

  extendedDescription: <%=util.inspect(extendedDescription)%>,

  inputs: {



  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      example:  '???'
    }
  },

  fn: function (inputs, exits) {

    /**
     * Module Dependencies
     */

    // ...



    var result = 'stuffandthings';
    return exits.success(result);

  }

};
