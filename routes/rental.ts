import { Router } from 'express';

import { RentalController } from '../controllers/rental';

export class RentalRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.buildRoutes();
    }

    buildRoutes() {
        this.router.get('/rental/:lat/:lng', RentalController.getRental);
        this.router.get('/rental/reports/:lat/:lng/:radius', RentalController.getReports);
    }

}
