export class GlobalMiddleware {
  static logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }

  static errorHandler(err, req, res, next) {
    res.status(500).json({
      error: 'Erro Interno',
      message: err.message
    });
  }
}