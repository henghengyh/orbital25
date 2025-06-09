class MathHelper {
    static toTwodp(num) {
        return Math.round(num * 100) / 100;
    }
}

module.exports = MathHelper;