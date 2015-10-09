Meteor.publish(null, function() {
  if(!this.userId) {
    return [];
  }
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      name: 1,
      'services.worldcubeassociation': 1,
    }
  });
});
