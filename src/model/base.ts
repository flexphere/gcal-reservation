import { ConnectDB } from '../db';

export class Model {
    db;

    constructor(){
        this.getDB();
    }

    async getDB() {
        this.db = await ConnectDB();
    }
}