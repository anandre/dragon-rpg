const displayName = (user) => {
  if (user.side === 'player') return user.name;
  return user.id;
};

module.exports = displayName;