// Set the connection string based from the config vars of the production server
// To run locally use 'mongodb://localhost/mern-crud' instead of process.env.DB

module.exports = {
  db: "mongodb://localhost:27017/crud",
  react_app_url: "http://localhost:4200",
};
