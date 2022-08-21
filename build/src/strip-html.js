module.exports = function(data) {
  return (data || '').replace(/(<([^>]+)>)/ig,'');
};
