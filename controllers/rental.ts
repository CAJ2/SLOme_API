import * as maps from '@google/maps';
import { waterfall, forEach } from 'async';
import { Request, Response } from 'express';

import { slome } from '../app';
import { Report } from '../models/report';

export class RentalController {

    static getRental(req: Request, res: Response) {
        const rentalLat = req.params.lat;
        const rentalLng = req.params.lng;

        // Test data
        const schoolCoords = [{
            name: 'Cal Poly SLO',
            lat: 35.3004,
            lng: -120.6579
        }];

        waterfall([
            (cb: any) => {
                let rentalInfo: any;

                slome.maps.distanceMatrix({
                    origins: [{
                        lat: rentalLat,
                        lng: rentalLng
                    }],
                    destinations: schoolCoords,
                }, (err: any, data: any) => {
                    if (err) return res.json(500);

                    console.log(data.json.rows[0].elements);

                    let i = 0;
                    data.json.rows[0].elements.forEach((elem: any) => {
                        rentalInfo.schools.append({
                            name: schoolCoords[i].name,
                            location: data.json.destination_addresses[i],
                            duration: elem.duration.text,
                            distance: elem.distance.text,
                        });
                        i++;
                    });
                });
                cb(rentalInfo);
            },
        ], (err, rentalInfo) => {
            console.log(rentalInfo);
            return res.json(rentalInfo);
        });
    }

    static getReports(req: Request, res: Response) {
        const rLat: number = req.params.lat;
        const rLng: number = req.params.lng;
        const radius: number = req.params.radius;

        Report.find({ location: { $geoWithin: { $center: [[rLat, rLng], radius]}}}).exec((err, data) => {
            if (err) return res.sendStatus(404);
            return res.json(data);
        });
    }
}
