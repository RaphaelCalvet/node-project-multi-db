export class UserController {
  constructor(service) { this.service = service; }

  getAll = async (req, res, next) => {
    try {
        res.json(await this.service.getAll());
    } catch (e) { next(e); }
  };

  create = async (req, res, next) => {
    try {
        res.status(201).json(await this.service.create(req.body));
    } catch (e) { next(e); }
  };

  update = async (req, res, next) => {
    try {
        res.json(await this.service.update(req.params.id, req.body));
    } catch (e) { next(e); }
  };

  delete = async (req, res, next) => {
    try {
        await this.service.delete(req.params.id); res.status(204).send();
    } catch (e) { next(e); }
  };
}