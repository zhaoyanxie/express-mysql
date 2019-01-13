const showHomepage = (req, res, next) => {
  res.status(200).json({ message: "Homepage" });
};
module.exports = { showHomepage };
