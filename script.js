
function decimal() {
	
	validateDecimalInput()

	values.decimal.unformatted = decimalInput.value

	if (inputErrorState.error) {
		updateScreenValues()
		formatFieldsForError()

		return
	}

	let value = values.decimal.unformatted

	let inputIsNegative = false
	if (signedInteger && isNegative(value)) {
		inputIsNegative = true
	}

	let binaryValue = inputIsNegative ? twosComplement(convert(value.replace(/-/, ""), 10, 2)) : convert(value, 10, 2)

	values.binary.unformatted = binaryValue
	values.hexadecimal.unformatted = convert(binaryValue, 2, 16)

	updateScreenValues()
}


function hexadecimal() {

	validateHexadecimalInput()

	values.hexadecimal.unformatted = hexadecimalInput.value

	if (inputErrorState.error) {
		updateScreenValues()
		formatFieldsForError()

		return
	}

	let value = values.hexadecimal.unformatted
	let binaryValue = convert(value, 16, 2)

	values.binary.unformatted = binaryValue
	values.decimal.unformatted = signedInteger ? (binaryValue.length === numBytes * 8 && binaryValue.charAt(0) === '1' ? '-' + convert(twosComplement(binaryValue), 2, 10) : convert(binaryValue, 2, 10)) : convert(value, 16, 10)

	updateScreenValues()
}

function binary() {

		validateBinaryInput()

	values.binary.unformatted = binaryInput.value

	if (inputErrorState.error) {
		updateScreenValues()
		formatFieldsForError()

		return
	}

	let value = values.binary.unformatted

	values.decimal.unformatted = signedInteger ? (value.length === numBytes * 8 && value.charAt(0) === '1' ? '-'  + convert(twosComplement(value), 2, 10) : convert(value, 2, 10)) : convert(value, 2, 10)
	values.hexadecimal.unformatted = convert(value, 2, 16)

	updateScreenValues()

	prevValues = values
}

function convert(value, fromBase, toBase) {
	let rawValue = isNaN(parseInt(value, fromBase)) ? "" : parseInt(value, fromBase).toString(toBase)

	return rawValue
}

function max0(value) {
	return value > 0 ? value : 0
}

function isNegative(value) {
	return value.charAt(0) === '-'
}


function twosComplement(bitString) {
	bitString = reverseBitString(padBitString(bitString, numBytes))

	return addOneToBitString(bitString)
}

function reverseBitString(bitString) {
	bitString = bitString.replace(/1/g, '2')
	bitString = bitString.replace(/0/g, '1')
	return bitString.replace(/2/g, '0')
}

function addOneToBitString(bitString) {
	for (let i = bitString.length - 1; i >= 0; i--) {
		if (bitString.charAt(i) === '0') {
			return bitString.substring(0, i) + bitString.substring(i).replace(/0/, '1')
		}

		bitString = bitString.substring(0, i) + bitString.substring(i).replace(/1/, '0')
	}
}

function padBitString(bitString, numBytes) {
	return bitString.padStart(numBytes * 8, '0')
}

function padHexString(hexString, numBytes) {
	return hexString.padStart(numBytes * 2, '0')
}

function updateScreenValues() {
	updateFormattedValues()

	decimalInput.value = values.decimal.unformatted
	hexadecimalInput.value = values.hexadecimal.unformatted
	binaryInput.value = values.binary.unformatted
}

function updateFormattedValues() {
	values.decimal.formatted = values.decimal.unformatted
	values.hexadecimal.formatted = values.hexadecimal.unformatted
	values.binary.formatted = values.binary.unformatted
}



var decimalInput = document.getElementById("decimal-value")
var hexadecimalInput = document.getElementById("hexadecimal-value")
var binaryInput = document.getElementById("binary-value")
var numBytesSelect = document.getElementById("num-bytes")
var signedSelect = document.getElementById("signed")


decimalInput.oninput = decimal
hexadecimalInput.oninput = hexadecimal
binaryInput.oninput = binary


numBytesSelect.onchange = () => { numBytes = numBytesSelect.value; binary() }
signedSelect.onchange = () => { signedInteger = signedSelect.checked; binary() }


var signedInteger = document.getElementById("signed").checked
var numBytes = document.getElementById("num-bytes").value

var inputErrorState = { error: false, errorFields: [] }
var decimalLength = 0

var values = {
	decimal: {unformatted: '0', formatted: ''},
	hexadecimal: {unformatted: '', formatted: ''},
	binary: {unformatted: '', formatted: ''}
}

updateScreenValues()

var prevValues = values

