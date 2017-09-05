Date.prototype.format = function(format) {
    let dict = {
        'y+': this.getFullYear(),
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'H+': this.getHours(),
        'h+': this.getHours() - 12,
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
    }
    for (let k in dict) {
        let reg = new RegExp(k, 'g')
        format = format.replace(reg, function(g0) {
            return ('000000' + dict[k]).slice(-g0.length)
        })
    }
    return format
}