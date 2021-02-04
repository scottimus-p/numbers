
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

function elementFormatting(element, value) {
	let pos = element.selectionStart - 1
	
	const spaces = countSpaces(element.value.substr(0, pos + 1))
	
	let isBeforeSpace = element.value.charAt(pos + 1) === ' '

	element.value = element.value.replace(/[^0-9a-fA-F]+/g, '').replace(/ /, '')

	isBeforeSpace &= element.value.length >= value.unformatted.length

	if (element.value.length < value.unformatted.length) {
		element.value = value.unformatted.substr(0, pos + 1 - spaces) + '0' + value.unformatted.substr(pos + 2 - spaces)
	}
	else {
		element.value = value.unformatted.substr(0, pos - spaces) + element.value.charAt(pos - spaces) + value.unformatted.substr(pos + 1 - spaces)
	}


	function postUpdateFormatting () {
		element.setSelectionRange(pos + 1 + (isBeforeSpace ? 1 : 0), pos + 1 + (isBeforeSpace ? 1 : 0))
	}

	return postUpdateFormatting
}


function performConversion(element, value) {

	let postUpdateFormatting = elementFormatting(element, value)

	value.unformatted = element.value

	if (inputErrorState.error) {
		updateScreenValues()
		formatFieldsForError()

		return
	}

	convertAll(element)

	updateScreenValues()
	
	postUpdateFormatting()
}




function hexadecimal() {
	performConversion(hexadecimalInput, values.hexadecimal)
}

function binary() {
	performConversion(binaryInput, values.binary)
}


function convertAll(element) {
	const allElements = document.getElementsByClassName("input-field")

	const fromBase = inputMap.get(element)
	for (let i = 0; i < allElements.length; i++) {
		if (element != allElements[i]) {
			allElements[i].value = easyConversion(element.value, fromBase, inputMap.get(allElements[i]))
		}
	}

	setUnformattedValues()
}

function easyConversion(value, fromBase, toBase) {
	switch (fromBase) {
		case 2:
			var bInt = BigInt('0b' + value)
			break

		case 10:
			var bInt = BigInt(value + 'n')
			break

		case 16:
			var bInt = BigInt('0x' + value)
			break;
	}
	
	if (toBase == 10) {
		if (signedInteger) {
			bInt = BigInt.asIntN(numBytes * 8, bInt)
		}
		else {
			bInt = BigInt.asUintN(numBytes * 8, bInt)
		}
	}

	return bInt.toString(toBase)
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

function setUnformattedValues() {
	values.binary.unformatted = binaryInput.value
	values.decimal.unformatted = decimalInput.value
	values.hexadecimal.unformatted = hexadecimalInput.value
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

var inputMap = new Map()
inputMap.set(decimalInput, 10)
inputMap.set(binaryInput, 2)
inputMap.set(hexadecimalInput, 16)

decimalInput.oninput = decimal
hexadecimalInput.oninput = hexadecimal
binaryInput.oninput = binary


numBytesSelect.onchange = () => { 
	const prevNumBytes = numBytes

	numBytes = numBytesSelect.value;

	if (numBytes > prevNumBytes) {
		values.binary.unformatted = '0'.repeat(numBytes * 8 - values.binary.unformatted.length) + values.binary.unformatted
		binaryInput.value = values.binary.unformatted
	}
	else {
		values.binary.unformatted = values.binary.unformatted.substr(values.binary.unformatted - 1 - numBytes * 8)
		binaryInput.value = values.binary.unformatted
	}

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

