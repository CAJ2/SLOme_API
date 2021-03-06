import { series } from 'async';
import { Request, Response } from 'express';
import * as axios from 'axios';

import { slome } from '../app';
import { Report } from '../models/report';
import { timeout } from 'typings/async';
import { Environment } from '../config';

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

        const rentalInfo = {
            drive_dist: '',
            drive_time: '',
            bike_dist: '',
            bike_time: '',
            walking_dist: '',
            walking_time: '',
            transit_dist: '',
            transit_time: ''
        };

        const urls = [
            'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&destinations=' + schoolCoords[0].lat + ',' + schoolCoords[0].lng + '&origins=' + rentalLat + ',' + rentalLng + '&key=' + Environment.google_api_key,
            'https://maps.googleapis.com/maps/api/distancematrix/json?mode=bicycling&units=imperial&destinations=' + schoolCoords[0].lat + ',' + schoolCoords[0].lng + '&origins=' + rentalLat + ',' + rentalLng + '&key=' + Environment.google_api_key,
            'https://maps.googleapis.com/maps/api/distancematrix/json?mode=walking&units=imperial&destinations=' + schoolCoords[0].lat + ',' + schoolCoords[0].lng + '&origins=' + rentalLat + ',' + rentalLng + '&key=' + Environment.google_api_key,
            'https://maps.googleapis.com/maps/api/distancematrix/json?mode=transit&units=imperial&destinations=' + schoolCoords[0].lat + ',' + schoolCoords[0].lng + '&origins=' + rentalLat + ',' + rentalLng + '&key=' + Environment.google_api_key,
        ];

        series([
            (cb) => {
                axios.default.get(urls[0]).then(response => {
                    rentalInfo.drive_dist = response.data.rows[0].elements[0].distance.text;
                    rentalInfo.drive_time = response.data.rows[0].elements[0].duration.text;
                    cb(undefined, 'driving');
                }).catch((err) => {
                    cb(err, 'driving');
                });
            },
            (cb) => {
                axios.default.get(urls[1]).then(response => {
                    rentalInfo.bike_dist = response.data.rows[0].elements[0].distance.text;
                    rentalInfo.bike_time = response.data.rows[0].elements[0].duration.text;
                    cb(undefined, 'biking');
                }).catch((err) => {
                    cb(err, 'biking');

                });
            },
            (cb) => {
                axios.default.get(urls[2]).then(response => {
                    rentalInfo.walking_dist = response.data.rows[0].elements[0].distance.text;
                    rentalInfo.walking_time = response.data.rows[0].elements[0].duration.text;
                    cb(undefined, 'walking');
                }).catch((err) => {
                    cb(err, 'walking');

                });
            },
            (cb) => {
                axios.default.get(urls[3]).then(response => {
                    rentalInfo.transit_dist = response.data.rows[0].elements[0].distance.text;
                    rentalInfo.transit_time = response.data.rows[0].elements[0].duration.text;
                    cb(undefined, 'transit');
                }).catch((err) => {
                    cb(err, 'transit');

                });
            },
        ],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.json(rentalInfo);
            }
            return res.json(rentalInfo);
        });

    }

    static getReports(req: Request, res: Response) {
        const rLat: number = req.params.lat;
        const rLng: number = req.params.lng;
        const radius: number = req.params.radius;

        Report.find({ location: { $geoWithin: { $center: [[rLat, rLng], radius * 0.0000127]}}}).exec((err, data) => {
            if (err) return res.sendStatus(404);
            const categoryNum = {
                disorderly: 0,
                noise: 0,
                substance: 0,
                domestic: 0,
                misdemeanor: 0,
                hazard: 0,
                misc: 0
            };
            data.forEach(element => {
                if (element.category == 'Disorderly') {
                    categoryNum.disorderly++;
                }
                else if (element.category == 'Noise') {
                    categoryNum.noise++;
                }
                else if (element.category == 'Substance') {
                    categoryNum.substance++;
                }
                else if (element.category == 'Domestic Crimes') {
                    categoryNum.domestic++;
                }
                else if (element.category == 'Misdemeanor') {
                    categoryNum.misdemeanor++;
                }
                else if (element.category == 'Hazard') {
                    categoryNum.hazard++;
                }
                else if (element.category == 'Misc') {
                    categoryNum.misc++;
                }
            });
            return res.json(categoryNum);
        });
    }
}
