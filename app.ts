import * as bodyparser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as cors from 'cors';

import { Application, Router } from 'express';
import { Environment } from './config';
import { RentalRouter } from './routes/rental';

export class Slome {

    public app: Application;
    //public maps: any;

    constructor(app: Application) {
        this.app = app;
        this.initialize();
    }

    public initialize() {
        this.app.set('port', process.env.PORT || Environment.port);
        this.app.use(logger('short'));
        this.app.use(bodyparser.json());
        this.app.use(bodyparser.urlencoded({extended: true}));
        this.app.use(cors());

        mongoose.connect('mongodb://christianjohansen.com:27017/slome', { user: 'slome', pass: 'slome' }, (err) => {
            if (err) {
                console.log(err.message);
                console.log('ERROR: Mongodb connection failed!');
            }
        });

        //this.maps = maps.createClient({
        //    key: Environment.google_api_key,
        //});

        // Build Routes
        this.app.use(new RentalRouter().router);
    }

    public start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('App is running at http://localhost:%d in %s mode',
            this.app.get('port'), this.app.get('env'));
        });
    }
}

export const slome = new Slome(express());
slome.start();
