module.exports = (str, reg, minLength, maxLength) => {
    if (maxLength) {
        if (reg.test(str) || str.length < minLength || str.length > maxLength)
            return false;
    }
    else if (reg.test(str) || str.length < minLength)
        return false;
    return true;
}