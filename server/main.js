import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/link'
import { WebApp } from 'meteor/webapp'
import ConnectRoute from 'connect-route'

Meteor.startup(() => {
  // publish
  Meteor.publish('links', function() {
    return Links.find({})
  })
});

function onRoute(req, res, next) {
  // take token from url
  // match token in Links Collection
  const link = Links.findOne({ token: req.params.token })

  if (link) {
    //update counter
    Links.update(link, { $inc: {clicks: 1}})
    //redirect user to link object
    res.writeHead(307, { 'Location': link.url })
    res.end()
  } else {
    next()
  }
}

const middleware = ConnectRoute(function(router) {
  router.get('/:token', onRoute)
})

WebApp.connectHandlers.use(middleware)
