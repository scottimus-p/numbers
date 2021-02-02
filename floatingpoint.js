function convertDecimalToBinaryFloating(valueAsString) {

	valueAsString = valueAsString.replace(/,/g, "")

	let integralAsBinary = getLeftOfDecimalAsBinary(valueAsString)
	let fractionalAsBinary = getRightOfDecimalAsBinary(valueAsString)



	console.log(integralAsBinary)
	console.log(fractionalAsBinary)
}

function convertFloatingToBinary(valueAsString, exponentBitSize, significandBitSize) {

	const MAX_BYTES = 32 // 256 bits

	let integral = valueAsString.indexOf(".") == -1 ? BigInt(valueAsString) : BigInt(valueAsString.substring(0, valueAsString.indexOf(".")))
	let fractional =  valueAsString.indexOf(".") == -1 ? BigInt(0) : BigInt(valueAsString.substring(valueAsString.indexOf(".") + 1))

	let signBit = valueAsString.charAt(0) == "-" ? 1 : 0
	integral = integral < BigInt(0) ? BigInt(integral) * BigInt(-1) : BigInt(integral)

	var dvIntegral = new DataView(new ArrayBuffer(MAX_BYTES))
	var dvFractional = new DataView(new ArrayBuffer(MAX_BYTES))

	let bufferStart = MAX_BYTES - 8
	while (bufferStart >= 0) {
		dvIntegral.setBigUint64(bufferStart, integral)

		integral = integral >> BigInt(64)
		bufferStart -= 8
	}

	let result = ""
	for (let i = 0; i < MAX_BYTES; i++) {
		let bits = dvIntegral.getUint8(i).toString(2);
		if (bits.length < 8) {
            bits = new Array(8 - bits.length).fill('0').join("") + bits;
        }
		result += bits
	}

	let fractionalZeroPad = valueAsString.substring(valueAsString.indexOf(".") + 1).length - fractional.toString().length
	result += "."
	result = result.padEnd(result.length + fractionalZeroPad, "0")

	let numDigits = fractional.toString(10).length
	while (fractional > 0) {
		fractional = fractional * BigInt(2)

		if (fractional.toString(10).length > numDigits) {
			result += "1"
			fractional -= BigInt(10**numDigits)
		}
		else {
			result += "0"
		}

		numDigits = fractional.toString(10).length
	}

	// remove the 0s at the beginning
	result = result.substring(Math.min(result.indexOf('.'), result.indexOf('1')))

	// pad the end with 0s
	result = result.padEnd(MAX_BYTES * 8 + 1, "0")

	let exponent = result.indexOf(".") - 1
	let exponentBits = (exponent + 127).toString(2)

	if (exponentBits.length < exponentBitSize) {
		exponentBits = exponentBits.padStart(exponentBitSize, "0")
	}

	if (exponentBits.length > exponentBitSize) {
		throw 'overflow'
	}

	let significandBits = result.replace(".", "").substring(1, 1 + significandBitSize)
	console.log(result)
	console.log(signBit + exponentBits + "" + significandBits)
}



function getLeftOfDecimalAsBinary(value) {
	return value.indexOf(".") == -1 ? value : convert(value.substring(0, value.indexOf(".")), 10, 2)
}

function getRightOfDecimalAsBinary(value) {
	let fractionalDecimal = parseInt("0." + value.substring(value.indexOf(".") + 1))

	if (!Number.isSafeInteger(fractionalDecimal)) {
		throw 'fractional part contains too many digits'
	}

	let maxBits = 10

	let fractionalBinary = ""

	while (fractionalDecimal != 0 && numBits < maxBits) {
		let tmp = fractionalDecimal * 2
	}
}


// Number.MAX_SAFE_INTEGER


function to64bitFloat(number) {
    var i, result = "";
    var dv = new DataView(new ArrayBuffer(8));

    dv.setFloat64(0, number, false);

    for (i = 0; i < 8; i++) {
        var bits = dv.getUint8(i).toString(2);
        if (bits.length < 8) {
            bits = new Array(8 - bits.length).fill('0').join("") + bits;
        }
        result += bits;
    }
    return result;
}

function to32bitFloat(number) {
    var i, result = "";
    var dv = new DataView(new ArrayBuffer(4));

    dv.setFloat32(0, number, false);

    for (i = 0; i < 4; i++) {
        var bits = dv.getUint8(i).toString(2);
        if (bits.length < 8) {
            bits = new Array(8 - bits.length).fill('0').join("") + bits;
        }
        result += bits;
    }
    return result;
}


//Number.isSafeInteger()

//convertDecimalToBinaryFloating("329.390625")

convertFloatingToBinary("-0.05", 8, 23)


//console.log(to64bitFloat(329.390625))
//console.log(to32bitFloat(329.390625))

class ExactDecimal {
	constructor(number) {
		this.integral = getIntegral(number)
		this.fractional = getFractional(number)
	}

	getIntegral(number) {
		return number.indexOf(".") == -1 ? BigInt(number) : BigInt(number.substring(0, number.indexOf(".")))
	}

	getFractional(number) {
		return number.indexOf(".") == -1 ? null : BigInt(number.substring(number.indexOf(".") + 1))
	}

	times(number) {
		let result = []

		for (let i = 0; i < number.toString(10).length * fractional.toString(10).length) {
			result.push(0)
		}
		
		let carryValue = 0
		for (let i = 0; i < number.toString(10).length; i++) {
			for (let j = 0; j < fractional.toString(10).length; j++) {
				let val = number.toString(10)[number.toString(10).length - i - 1]  * fractional.toString(10)[fractional.toString(10).length - j - 1]

				carryValue = Math.floor(val / 10);

				result[i + j] += val - carryValue * 10;
			}
		}


	}
}

