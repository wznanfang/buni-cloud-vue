import CryptoJS from 'crypto-js';

const DEFAULT_KEY = 'buni123456789012'; // 默认密钥（16字节）
const DEFAULT_IV = '1234567890123456';  // 默认偏移量（16字节）

/**
 * AES加密 ：字符串 key iv 返回 base64 编码的密文
 * @param {string} text 需要加密的文本
 * @param {string} [key] 自定义密钥（可选，默认使用 DEFAULT_KEY）
 * @param {string} [iv]  自定义偏移量（可选，默认使用 DEFAULT_IV）
 * @returns {string} 返回 base64 格式的密文
 */
export function Encrypt(text, key = DEFAULT_KEY, iv = DEFAULT_IV) {
    try {
        if (!text) throw new Error('加密内容不能为空');

        const encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(text),
            CryptoJS.enc.Utf8.parse(key),
            {
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        return encrypted.toString(); // 返回 base64 格式的密文
    } catch (error) {
        console.error('AES 加密失败:', error.message);
        return null; // 返回 null 以避免影响后续逻辑
    }
}

/**
 * AES解密 ：解密 base64 密文，返回原始字符串
 * @param {string} encryptedText 需要解密的密文（base64 格式）
 * @param {string} [key] 自定义密钥（可选，默认使用 DEFAULT_KEY）
 * @param {string} [iv]  自定义偏移量（可选，默认使用 DEFAULT_IV）
 * @returns {string|null} 解密后的字符串，失败返回 null
 */
export function Decrypt(encryptedText, key = DEFAULT_KEY, iv = DEFAULT_IV) {
    try {
        if (!encryptedText) throw new Error('解密内容不能为空');

        const bytes = CryptoJS.AES.decrypt(
            encryptedText,
            CryptoJS.enc.Utf8.parse(key),
            {
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        const decryptedText = CryptoJS.enc.Utf8.stringify(bytes);

        if (!decryptedText) throw new Error('解密失败，可能密钥或偏移量不正确');

        return decryptedText;
    } catch (error) {
        console.error('AES 解密失败:', error.message);
        return null; // 返回 null 以避免影响后续逻辑
    }
}
