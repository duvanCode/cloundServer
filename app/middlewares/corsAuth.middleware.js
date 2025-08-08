function corsAuth(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Permite desde cualquier dominio
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");

  // Responder de inmediato a las peticiones preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
}

module.exports = corsAuth;
