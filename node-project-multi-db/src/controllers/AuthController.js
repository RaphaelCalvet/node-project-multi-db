export class AuthController {
  constructor(service) { this.service = service; }

  register = async (req, res, next) => {
    try {
      const { token, user } = await this.service.register(req.body);
      res.status(201).json({ token, user });
    } catch (e) { next(e); }
  };

  login = async (req, res, next) => {
    try {
      const { token, user } = await this.service.login(req.body);
      res.json({ token, user });
    } catch (e) { next(e); }
  };

  // Devolve o usuário autenticado a partir do token.
  me = async (req, res, next) => {
    try {
      res.json({ user: req.user });
    } catch (e) { next(e); }
  };
}
