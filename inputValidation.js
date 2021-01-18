
function validateHexadecimalInput() {
	let pos = hexadecimalInput.selectionStart - 1

	validateCharacter(hexadecimalInput, pos, values.hexadecimal.formatted, isValidHexadecimalCharacter)

	if (!isValidHexadecimalForByteLength(hexadecimalInput.value, numBytes)) {
		hexadecimalInput.value = hexadecimalInput.value.substring(0, hexadecimalInput.value.length - 1)
	}
}

function validateBinaryInput() {
	let pos = binaryInput.selectionStart - 1

	validateCharacter(binaryInput, pos, values.binary.formatted, isValidBinaryCharacter)

	if (!isValidBinaryForByteLength(binaryInput.value, numBytes)) {
		binaryInput.value = binaryInput.value.substring(0, binaryInput.value.length - 1)
		// maybe do a message next to the input box
	}
}

function validateDecimalInput() {

	validateDecimalCharacter(decimalInput, isValidDecimalCharacter, signedInteger)

	if (!isValidDecimalForByteLength(decimalInput.value, numBytes, signedInteger)) {
		inputErrorState.error = true
		inputErrorState.errorFields.push(decimalInput)
		// maybe do a message next to the input box
	}
	else {
		Array.prototype.forEach.call(document.getElementsByClassName("input-field"), (element) => {
			element.style.removeProperty("color")
			element.style.removeProperty("background-color")
		})
		inputErrorState.error = false
		inputErrorState.errorFields = []
	}
}



function validateCharacter(element, pos, previousValue, validationFunction) {
	if (!validationFunction(element, pos, numBytes) && element.value.length > 0) {
		element.value = previousValue
	}
}

function validateDecimalCharacter(element, validationFunction, signedInteger) {
	if (!signedInteger) {
		element.value = element.value.replace(/-/g, "")
	}
	else if (element.value.length > 1) {
		element.value = element.value.charAt(0) + element.value.substring(1).replace(/-/g, "")
	}

	let pos = max0(decimalInput.selectionStart - 1)
	validateCharacter(element, pos, values.decimal.formatted, validationFunction)
}


/****************************************************************
 * The following three functions validate that a character typed
 * into the field is valid for that field
 ****************************************************************/

function isValidBinaryCharacter(element, pos, maxBytes) {
	let validCharacters = ['0', '1']

	return    validCharacters.includes(element.value.charAt(pos)) 
	       /*&& Math.floor(element.value.replace(/ /g, "").length) <= maxBytes * 8*/
}

function isValidDecimalCharacter(element, pos, maxBytes) {
	let validCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-']

	return validCharacters.includes(element.value.charAt(pos))
}

function isValidHexadecimalCharacter(element, pos, maxBytes) {
	let validCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F']

	return    validCharacters.includes(element.value.charAt(pos))
	       /*&& Math.floor(element.value.replace(/ /g, "").length) <= maxBytes * 2*/
}







/*
function validateDecimalValue(inputValue, numBytes, signedInteger) {

	if (!isValidDecimalForByteLength(inputValue, numBytes, signedInteger)) {
		decimalInput.style.backgroundColor = "red"

		decimalInput.value = formatRawDecimalValue(inputValue)
		return false
	}
	else {
		decimalInput.style.removeProperty('background-color')
		return true
	}
}

function validateHexadecimalValue(inputValue, numBytes, signedInteger) {

	if (!isValidHexadecimalForByteLength(inputValue, numBytes)) {
		hexadecimalInput.style.backgroundColor = "red"

		hexadecimalInput.value = formatRawValue(inputValue, 16)
		return false
	}
	else {
		hexadecimalInput.style.removeProperty('background-color')
		return true
	}
}

function validateBinaryValue(inputValue, numBytes, signedInteger) {

	if (!isValidBinaryForByteLength(inputValue, numBytes, signedInteger)) {
		binaryInput.style.backgroundColor = "red"

		binarylInput.value = formatRawValue(inputValue, 2)
		return false
	}
	else {
		binaryInput.style.removeProperty('background-color')
		return true
	}
}
*/



/****************************************************************
 * These three functions ensure that the numbers entered are
 * valid for the number of bytes selected
 ****************************************************************/

function isValidDecimalForByteLength(inputValue, bytes, signed) {
	let binary = convert(inputValue.replace(/,/g, ""), 10, 2)

	if (binary.length > bytes * 8) {
		return false
	}
	else if (signed && binary.length === bytes * 8 && binary.charAt(0) === '1') {
		return false
	}

	return true
}

function isValidHexadecimalForByteLength(inputValue, bytes) {
	return inputValue.replace(/ /g, "").length <= bytes * 2
}

function isValidBinaryForByteLength(inputValue, bytes) {
	return inputValue.replace(/ /g, "").length <= bytes * 8
}