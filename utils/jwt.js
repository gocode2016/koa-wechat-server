const jwt = require('jsonwebtoken'); // 用于签发、解析`token`
/* jwt密钥 */
const secret = 'secret';
export default {
    getToken(){
        return jwt.sign({}, secret, { expiresIn: '4h' });
    },
    /* 通过token获取JWT的payload部分 */
    getJWTPayload(token) {
        // 验证并解析JWT
        return jwt.verify(token.split(' ')[1], secret);
    }
}