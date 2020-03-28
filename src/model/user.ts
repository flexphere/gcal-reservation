import { Model } from './base';

class User extends Model {
    async find(id: string) {
        const res = await this.db.query('SELECT * FROM users WHERE id = ?', [ id ]);
        if (!res.length) {
            return null;
        }
        return res[0];
    }

    async save(id: string, refresh_token: string) {
        const exist = await this.db.query('SELECT id FROM users WHERE id = ?', [ id ]);
        if (exist.length) {
            await this.db.query('UPDATE users SET token = ? WHERE id = ?', [ refresh_token, id ]);
        } else {
            await this.db.query('INSERT INTO users (id, token) values (?, ?)', [ id, refresh_token ]);
        }
    }
}

export default new User();