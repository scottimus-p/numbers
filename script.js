
function decimal() {
	
	decimalInput.value = decimalInput.value.replace(/[^0-9,-]+/g, '')

	if (decimalInput.value.length > values.decimal.formatted.length) {
		validateDecimalInput()
	}

	values.decimal.unformatted = unformatDecimalValue(decimalInput.value)

	if (!isValidDecimalForByteLength(decimalInput.value, numBytes, signedInteger)) {
		// maybe do a message next to the input box

		updateScreenValues()
		formatFieldsForError(decimalInput)

		return
	}
	else {
		removeErrorFormatting()
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
	let pos = hexadecimalInput.selectionStart - 1
	const spaces = countSpaces(hexadecimalInput.value.substr(0, pos + 1))
	let beforeSpace = hexadecimalInput.value.charAt(pos + 1) === ' '

	hexadecimalInput.value = hexadecimalInput.value.replace(/[^0-9a-fA-F]+/g, '').replace(/ /, '')

	beforeSpace &= hexadecimalInput.value.length >= values.hexadecimal.unformatted.length

	if (hexadecimalInput.value.length < values.hexadecimal.unformatted.length) {
		hexadecimalInput.value = values.hexadecimal.unformatted.substr(0, pos + 1 - spaces) + '0' + values.hexadecimal.unformatted.substr(pos + 2 - spaces)
	}
	else {
		hexadecimalInput.value = values.hexadecimal.unformatted.substr(0, pos - spaces) + hexadecimalInput.value.charAt(pos - spaces) + values.hexadecimal.unformatted.substr(pos + 1 - spaces)
	}

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

	prevValues = values
	hexadecimalInput.setSelectionRange(pos + 1 + (beforeSpace ? 1 : 0), pos + 1 + (beforeSpace ? 1 : 0))
}

function binary() {
	let pos = binaryInput.selectionStart - 1
	const spaces = countSpaces(binaryInput.value.substr(0, pos + 1))
	let beforeSpace = binaryInput.value.charAt(pos + 1) === ' '

	binaryInput.value = binaryInput.value.replace(/[^01]+/g, '').replace(/ /g, '')

	beforeSpace &= binaryInput.value.length >= values.binary.unformatted.length

	if (binaryInput.value.length < values.binary.unformatted.length) {
		binaryInput.value = values.binary.unformatted.substr(0, pos + 1 - spaces) + '0' + values.binary.unformatted.substr(pos + 2 - spaces)
	}
	else {
		binaryInput.value = values.binary.unformatted.substr(0, pos - spaces) + binaryInput.value.charAt(pos - spaces) + values.binary.unformatted.substr(pos + 1 - spaces)
	}

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

	binaryInput.setSelectionRange(pos + 1 + (beforeSpace ? 1 : 0), pos + 1 + (beforeSpace ? 1 : 0))
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
	updateUnformattedValues()
	updateFormattedValues()

	decimalInput.value = values.decimal.formatted
	hexadecimalInput.value = values.hexadecimal.formatted
	binaryInput.value = values.binary.formatted
}

function updateUnformattedValues() {
	values.binary.unformatted = padBitString(values.binary.unformatted, numBytes)
	values.hexadecimal.unformatted = padHexString(values.hexadecimal.unformatted, numBytes)
}

function updateFormattedValues() {
	values.decimal.formatted = formatRawDecimalValue(values.decimal.unformatted)
	values.hexadecimal.formatted = formatRawValue(values.hexadecimal.unformatted, 16)
	values.binary.formatted = formatRawValue(values.binary.unformatted, 2)
}

function convertUnsignedDecimalToBinary(valueStr) {
	return convert(valueStr, 10, 2)
}

function convertSignedDecimalToBinary(valueStr) {
	let isNegativeVal = isNegative(valueStr)
	let absoluteValue = valueStr.replace(/-/, "")

	let binary = convertUnsignedDecimalToBinary(absoluteValue)

	return isNegativeVal ? twosComplement(binary) : binary
}

const countSpaces = (str) => {
  const re = / /g
  return ((str || '').match(re) || []).length
}


var decimalInput = document.getElementById("decimal-value")
var hexadecimalInput = document.getElementById("hexadecimal-value")
var binaryInput = document.getElementById("binary-value")
var numBytesSelect = document.getElementById("num-bytes")
var signedSelect = document.getElementById("signed")


decimalInput.oninput = decimal
hexadecimalInput.oninput = hexadecimal
binaryInput.oninput = binary


numBytesSelect.onchange = () => { 
	numBytes = numBytesSelect.value;

	values.binary.unformatted = '0'.repeat(numBytes * 8 - values.binary.unformatted.length) + values.binary.unformatted
	binaryInput.value = values.binary.unformatted

	if (!isValidDecimalForByteLength(decimalInput.value, numBytes, signedInteger)) {
		// maybe do a message next to the input box

		updateScreenValues()
		formatFieldsForError(decimalInput)

		return
	}
	else {
		removeErrorFormatting()
	}

	decimal() 
}

signedSelect.onchange = () => {
	signedInteger = signedSelect.checked;
	binary()
}


var signedInteger = document.getElementById("signed").checked
var numBytes = document.getElementById("num-bytes").value

var inputErrorState = { error: false, errorFields: [] }
var decimalLength = 0

var values = {
	decimal: {unformatted: '0', formatted: ''},
	hexadecimal: {unformatted: '0000', formatted: ''},
	binary: {unformatted: '0000000000000000', formatted: ''}
}

updateScreenValues()

var prevValues = values

