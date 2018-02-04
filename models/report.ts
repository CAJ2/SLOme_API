import { Document, Schema, model, Model } from 'mongoose';

export interface Report extends Document {
    incident_id?: number;
    received?: string;
    incident_type?: string;
    raw_address?: string;
    code?: string;
    comments?: string;
    description?: string;
    police_report_id?: number;
    address_place_id?: number;
    location?: [Number];
    category?: string;
}

const schema = new Schema({
    incident_id: {
        type: Number
    },
    received: {
        type: String
    },
    incident_type: {
        type: String
    },
    raw_address: {
        type: String
    },
    code: {
        type: String
    },
    comments: {
        type: String
    },
    description: {
        type: String
    },
    police_report_id: {
        type: Number
    },
    address_place_id: {
        type: Number
    },
    location: {
        type: [Number],
        index: '2d'
    },
    category: {
        type: String
    }
});

export let Report = model<Report>('report', schema, 'reports', true);