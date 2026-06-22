export class GlobalMiddleware {
  static logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }

  static errorHandler(err, req, res, next) {
    const status = err.status || 500;
    if (status >= 500) {
        console.error(err);
    }
    res.status(status).json({
      error: status >= 500 ? 'Erro Interno' : (err.error || 'Erro'),
      message: err.message
    });
  }
}
