const showHomepage = (req, res, next) => {
  res.json({ message: "Homepage" });
};
module.exports = { showHomepage };
