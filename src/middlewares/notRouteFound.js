export const notRouteFound = (req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
};
