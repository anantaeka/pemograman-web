window.TagCloud = { };

window.TagCloud.create = function(tweets) {
  var tagCloud = { };
  var result = [ ];

  _.each(tweets, function(d) {
    _.each(d.tags.split(' '), function(t) {
      if(t != "") {
        if(!tagCloud[t]) tagCloud[t] = 0;

        tagCloud[t] += 1;
      }
    });
  });

  for(var tag in tagCloud) {
    result.push({
      tag: tag,
      count: tagCloud[tag],
      important: tag.match(/!/) 
    });
  }

  return result;
};

window.TagCloud.sort = function(tag) {
  if(tag.important) return -999999;
  return tag.count * -1;
}
