import CryptoJS from 'crypto-js/crypto-js';

const key = 'buni123456789012'; // 密钥 后端提供
const iv = '1234567890123456'; // 偏移量


/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(text) {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}